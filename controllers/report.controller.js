const reportService = require("../services/report.service");
const reportRepository = require("../data/report.repository");
const logger = require("../utils/logger");
const generateReport = async (req, res, next) => {
  try {
    let response;
    const { format } = req.query;
    const { data, excelData, headers } = await reportService.reportGenerator({
      filter: req.query,
    });

    if (format === "excel" || format === "xls" || format === "xlsx") {
      const { buffer, fileType, fileExtension } =
        await reportRepository.createExcelFile({
          headers: headers,
          data: excelData,
          format: format,
        });
      res.header("Content-Type", fileType);
      res.attachment(`report.${fileExtension}`);
      response = buffer;
    } else if (format === "pdf") {
      const exportPdf = await reportRepository.createPdfFile({
        data: data,
        headers: headers,
      });
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=report.pdf");
      response = exportPdf;
    }

    return res.send(response);
  } catch (error) {
    next(error);
    logger.error(error.message);
  }
};

module.exports = generateReport;
