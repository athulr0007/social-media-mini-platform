import Activity from "../models/Activity.js";

let ioInstance = null;

export const setIO = (io) => {
  ioInstance = io;
};

const createActivity = async (data) => {
  if (data.owner.toString() === data.actor.toString()) return;
  
  const activity = await Activity.create(data);
  
  // Populate and emit via socket.io
  await activity.populate("actor", "name avatar username");
  await activity.populate("post", "content images");
  
  if (ioInstance) {
    // Emit to the owner of the activity
    ioInstance.to(data.owner.toString()).emit("new_activity", activity);
  }
  
  return activity;
};

export default createActivity;
