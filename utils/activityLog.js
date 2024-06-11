const ActivityLog = require("../models/ActivityLog");
const os = require("os");
const createActivityLog = async ({
  user_id,
  ip_address,
  device,
  title,
  activity,
  time,
  module,
}) => {
  const activity = await ActivityLog.create({
    user_id: user_id,
    ip_address: ip_address,
    device: os.platform(),
    title,
    activity,
    time,
    module,
  });
};

module.exports = createActivityLog;
