const FileUpload = require("../models/FileUpload");
const fileRepository = require("../data/file.repository");
const CustomError = require("../utils/CustomError");
const fs = require("fs");
const cloudinary = require("../config/cloudinary.config");
const path = require("path");
const axios = require("axios");
const XLSX = require("xlsx");
const csvParser = require("csv-parser");
const sendMail = require("../utils/sendMail");

const Inventory = require("../models/Inventory");

exports.getFileDeta = async () => {
  const file = await fileRepository.getAll();
  return file;
};
exports.uploadFile = async ({
  filename,
  checker_mail,
  remark,
  filepath,
  user_id,
}) => {
  const hash = await fileRepository.calculateFileHash(filepath);
  const existingFile = await FileUpload.findOne({ hash: hash });
  if (existingFile) {
    fs.unlinkSync(filepath);
    throw new CustomError("File already uploaded.", 400);
  }
  const result = await cloudinary.uploader.upload(filepath, {
    resource_type: "raw",
    public_id: filename,
    use_filename: true,
    unique_filename: false,
    folder: "excel",
  });
  fs.unlink(`${filepath}`, (err) => {
    if (err) console.log(err);
  });

  const newFile = new FileUpload({
    filename: filename,
    filepath: result.secure_url,
    hash: hash,
    user_id: user_id,
    remark: remark,
    checker_mail: checker_mail,
  });

  await newFile.save();
  return newFile;
};
exports.viewFileContents = async (id) => {
  const file = await FileUpload.findById(id);

  if (!file) {
    throw new CustomError("File not found", 404);
  }
  const fileUrl = file.filepath;

  const filepath = path.resolve(file.filepath);
  const ext = path.extname(file.filename);
  if (ext === ".xlsx" || ext === ".xls") {
    const response = await axios.get(fileUrl, { responseType: "arraybuffer" });
    const data = response.data;
    const workbook = XLSX.read(data, {
      cellDates: true,
      type: "buffer",
    });
    const sheetName = workbook.SheetNames[0];
    const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    const items = sheet.map((row) => ({
      serialNumber: row["Serial Number"],
      model: row["Model"],
      purchaseDate: fileRepository.addOneDayToDate(
        new Date(row["Purchase Date"])
      ),
      deliveryDate: fileRepository.addOneDayToDate(
        new Date(row["Delivery Date"])
      ),
      color: row["Colour"],
      quantity: parseInt(row["Quantity"]),
      costPerUnit: parseFloat(row["Cost Per Unit"]),

      status: "approved",
      category: row["Category"] || null,
    }));

    return items;
  } else if (ext === ".csv") {
    // Fetch the file from Cloudinary
    const response = await axios.get(fileUrl, { responseType: "stream" });

    // Process the CSV file in memory
    return new Promise((resolve, reject) => {
      let results = [];
      response.data
        .pipe(csvParser())
        .on("data", (data) => results.push(data))
        .on("end", () => {
          resolve(results);
        })
        .on("error", (error) => {
          reject(new CustomError("Error reading CSV file", 500));
        });
    });
  } else {
    throw new CustomError("Unsupported file type", 400);
  }
};

exports.insertApprovedData = async ({ user_id, id }) => {
  const file = await FileUpload.findById(id);
  if (!file) {
    throw new CustomError("File not found", 404);
  }

  const fileUrl = file.filepath;

  const filepath = path.resolve(file.filepath);
  const ext = path.extname(file.filename);

  if (ext === ".xlsx" || ext === ".xls") {
    const response = await axios.get(fileUrl, { responseType: "arraybuffer" });
    const data = response.data;
    const workbook = XLSX.read(data, {
      cellDates: true,
      type: "buffer",
    });
    const sheetName = workbook.SheetNames[0];
    const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    const items = sheet.map((row) => ({
      serialNumber: row["Serial Number"],
      model: row["Model"],
      purchaseDate: fileRepository.addOneDayToDate(
        new Date(row["Purchase Date"])
      ),
      deliveryDate: fileRepository.addOneDayToDate(
        new Date(row["Delivery Date"])
      ),
      color: row["Colour"],
      quantity: parseInt(row["Quantity"]),
      costPerUnit: parseFloat(row["Cost Per Unit"]),
      user_id: file.user_id,
      status: "approved",
      category: row["Category"] || null,
      file_id: file._id,
    }));

    const serialNumbers = items.map((item) => item.serialNumber);
    const existingItems = await Inventory.find({
      serialNumber: { $in: serialNumbers },
    });

    if (existingItems.length > 0) {
      const existingSerialNumbers = existingItems.map(
        (item) => item.serialNumber
      );
      throw new CustomError("Duplicate serial numbers found", 400);
    } else {
      await fileRepository.update(file._id, {
        status: "approved",
      });
      const ins = await Inventory.insertMany(items);

      return items.length;
    }
  } else if (ext === ".csv") {
    const response = await axios.get(fileUrl, { responseType: "stream" });
    return new Promise((resolve, reject) => {
      const results = [];
      response.data
        .pipe(csvParser())
        .on("data", (data) => {
          results.push({
            serialNumber: data["Serial Number"],
            model: data["Model"],
            purchaseDate: fileRepository.addOneDayToDate(
              new Date(data["Purchase Date"])
            ),
            deliveryDate: fileRepository.addOneDayToDate(
              new Date(data["Delivery Date"])
            ),
            color: data["Colour"],
            quantity: parseInt(data["Quantity"]),
            costPerUnit: parseFloat(data["Cost Per Unit"]),
            user_id: file.user_id,
            status: "approved",
            category: data["Category"] || null,
            file_id: file._id,
          });
        })
        .on("end", async () => {
          const serialNumbers = results.map((item) => item.serialNumber);
          const existingItems = await Inventory.find({
            serialNumber: { $in: serialNumbers },
          });

          if (existingItems.length > 0) {
            const existingSerialNumbers = existingItems.map(
              (item) => item.serialNumber
            );
            reject(new CustomError("Duplicate serial numbers found", 400));
          } else {
            await fileRepository.update(file._id, {
              status: "approved",
            });
            await Inventory.insertMany(results);
            resolve(results.length);
          }
        })
        .on("error", (error) => {
          reject(new CustomError("Error reading CSV file", 500));
        });
    });
  } else {
    throw new CustomError("Unsupported file type", 400);
  }
};
exports.unapproveData = async ({ id }) => {
  const file = await FileUpload.findById(id);
  if (!file) {
    throw new CustomError("File not found", 404);
  }

  await fileRepository.update(id, { status: "rejected" });
  await Inventory.deleteMany({ file_id: file._id });
};
