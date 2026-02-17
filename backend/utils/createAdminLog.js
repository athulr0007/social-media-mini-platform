import AdminLog from "../models/AdminLog.js";

export const createAdminLog = async ({ adminId, actionType, targetType, targetId, metadata }) => {
  try {
    const entry = await AdminLog.create({ adminId, actionType, targetType, targetId, metadata });
    return entry;
  } catch (err) {
    console.error("Failed to create admin log", err);
  }
};

export default createAdminLog;
