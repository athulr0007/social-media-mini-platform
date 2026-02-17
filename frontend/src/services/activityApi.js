import API from "./api";

export const fetchActivities = async () => {
  const res = await API.get("/activity");
  return res.data;
};

export const markActivitiesRead = async () => {
  await API.post("/activity/read");
};
