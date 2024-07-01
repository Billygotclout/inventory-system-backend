const CustomError = require("../utils/CustomError");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit-table");
exports.buildFilter = (query) => {
  const { type, serial } = query;
  let filter = {};

  if (type) filter.category = type;
  if (serial) filter.serialNumber = serial;

  return filter;
};

const excludedFields = [
  "_id",
  "user_id",
  "file_id",
  "createdAt",
  "updatedAt",
  "__v",
  "active",
  "status",
];
const headersMap = {
  serialNumber: "Serial number",
  model: "Model",
  purchaseDate: "Purchase date",
  deliveryDate: "Delivery date",
  color: "Colour",
  costPerUnit: "Cost per unit",
  issuedOut: "Issued Out",
  quantity: "Quantity",
  category: "Category",
};

// Function to remove excluded fields and map headers
exports.filterAndMapFields = async (items) => {
  return await items.map((item) => {
    const obj = item.toObject();
    excludedFields.forEach((field) => delete obj[field]);

    const mappedObj = {};
    for (const [key, value] of Object.entries(headersMap)) {
      mappedObj[value] = obj[key];
    }
    return mappedObj;
  });
};
const isDateField = (value) => {
  // Check if the value is a Date object
  if (value instanceof Date) {
    return true;
  }
  if (
    typeof value === "object" &&
    value !== null &&
    typeof value.toISOString === "function"
  ) {
    return true;
  }

  return false;
};

const formatDate = (date) => {
  return date.toISOString().slice(0, 10);
};

exports.getData = async (filteredData) => {
  const headers = Object.keys(filteredData[0]);
  const data = await filteredData.map((item) =>
    headers.map((header) => {
      if (isDateField(item[header])) {
        return formatDate(item[header]);
      } else {
        return item[header];
      }
    })
  );
  return data;
};
exports.getExcelData = async (filteredData) => {
  const headers = Object.keys(filteredData[0]);
  const data = await Promise.all(
    filteredData.map(async (item) => {
      const obj = {};
      headers.forEach((header) => {
        if (isDateField(item[header])) {
          obj[header] = formatDate(item[header]);
        } else {
          obj[header] = item[header];
        }
      });
      return obj;
    })
  );
  return data;
};

exports.createExcelFile = ({ data, headers, format }) => {
  const ws = XLSX.utils.json_to_sheet(data, { header: headers });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Inventory Report");
  const fileType =
    format === "xls"
      ? "application/vnd.ms-excel"
      : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  const fileExtension = format === "xls" ? "xls" : "xlsx";
  const buffer = XLSX.write(wb, {
    bookType: fileExtension,
    type: "buffer",
  });

  return { buffer, fileType, fileExtension };
};
exports.createPdfFile = async ({ data, headers }) => {
  try {
    const doc = new PDFDocument({ margin: 50 });
    const pdfPath = path.join(__dirname, "..", "report.pdf");
    const writeStream = fs.createWriteStream(pdfPath);

    // Pipe PDF content to a file
    doc.pipe(writeStream);

    const table = {
      title: "INVENTORY PDF",
      headers: headers,
      rows: data,
    };

    doc.table(table, {
      prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8),
      prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
        doc.font("Helvetica").fontSize(8);
        doc.fillColor("black");
      },
    });

    doc.end();

    return new Promise((resolve, reject) => {
      writeStream.on("finish", () => {
        fs.readFile(pdfPath, (err, data) => {
          if (err) {
            return reject(err);
          }
          resolve(data);

          fs.unlink(pdfPath, (err) => {
            if (err) throw new CustomError(`Error deleting PDF:  ${err}`, 400);
          });
        });
      });
    });
  } catch (error) {
    throw new CustomError(error);
  }
};
