const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const File = require("../models/FileUpload");

exports.addOneDayToDate = (date) => {
  date.setDate(date.getDate() + 1);

  return date;
};
exports.calculateFileHash = (filepath) => {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash("sha256");
    const stream = fs.createReadStream(filepath);

    stream.on("data", (data) => {
      hash.update(data);
    });

    stream.on("end", () => {
      resolve(hash.digest("hex"));
    });

    stream.on("error", (err) => {
      reject(err);
    });
  });
};
exports.getAll = async () => {
  return await File.find().populate({
    path: "user_id",
    model: "User",
  });
};
exports.update = async (id, updatedFile) => {
  try {
    const updatedFileDetails = await File.findOneAndUpdate(
      { _id: id },
      updatedFile
    );

    return updatedFileDetails;
  } catch (err) {
    throw err;
  }
};
exports.update = async (id, updatedFile) => {
  try {
    const updatedFileDetails = await File.findOneAndUpdate(
      { _id: id },
      updatedFile
    );

    return updatedFileDetails;
  } catch (err) {
    throw err;
  }
};
