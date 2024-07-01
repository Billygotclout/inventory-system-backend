const reportRepository = require("../data/report.repository");
const Inventory = require("../models/Inventory");
const CustomError = require("../utils/CustomError");

exports.reportGenerator = async ({ filter }) => {
  const filterQuery = await reportRepository.buildFilter(filter);
  const items = await Inventory.find(filterQuery);

  if (items.length === 0) {
    throw new CustomError("No records found", 404);
  }
  const filteredData = await reportRepository.filterAndMapFields(items);

  const headers = Object.keys(filteredData[0]);

  const data = await reportRepository.getData(filteredData);
  const excelData = await reportRepository.getExcelData(filteredData);

  return { headers, data, excelData };
};
