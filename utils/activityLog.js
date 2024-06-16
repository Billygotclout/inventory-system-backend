const ActivityLog = require("../models/ActivityLog");
const os = require("os");
const UAParser = require("ua-parser-js");
const CustomError = require("../utils/CustomError");

const createActivityLog = async ({
  user_id,
  ip_address,

  user_agent,
  title,
  activity,
  module,
}) => {
  const parser = UAParser(`${user_agent}`);

  const activityL = new ActivityLog({
    user_id: user_id,
    ip_address: ip_address,
    device: parser.device.vendor || os.platform(),
    title: title,
    activity: activity,
    time: new Date(Date.now() + 3600000),
    module: module,
  });

  await activityL.save();

  if (!activityL) {
    throw new CustomError("Activity could not be created", 400);
  }

  return activityL;
};

module.exports = createActivityLog;
