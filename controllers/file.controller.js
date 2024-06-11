const fileService = require("../services/file.service");
const CustomError = require("../utils/CustomError");
const path = require("path");
const uploadFileForApproval = async (req, res, next) => {
  try {
    const upload = await fileService.uploadFile({
      filename: req.file.filename,
      filepath: req.file.path,
      user_id: req.user.id,
    });
    if (!upload) {
      throw new CustomError("Error uploading file", 400);
    }

    return res.json({
      message: "File uploaded successfully, checker will go through file",
      file: upload._id,
    });
  } catch (error) {
    next(error);
  }
};
const checkUploadedFile = async (req, res, next) => {
  try {
    const checkFile = await fileService.viewFileContents(req.params.id);
    return res.json({
      message: "File gotten",
      data: checkFile,
    });
  } catch (error) {
    next(error);
  }
};

const saveApprovedDataToDatabase = async (req, res, next) => {
  try {
    const saveFileDataToDb = await fileService.insertApprovedData({
      id: req.params.id,
      user_id: req.user.id,
    });

    return res.json({
      message: "File successfully approved",
      productsNumber: saveFileDataToDb,
    });
  } catch (error) {
    next(error);
  }
};
const cancelDataRequest = async (req, res, next) => {
  try {
    const cancel = await fileService.unapproveData({
      id: req.params.id,
    });
    return res.json({
      message: "Request cancelled, files deleted",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadFileForApproval,
  checkUploadedFile,
  saveApprovedDataToDatabase,
  cancelDataRequest,
};
