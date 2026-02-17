import API from "./api";

const createReport = (payload) => API.post("/reports", payload);
const getReports = () => API.get("/reports");
const getReport = (id) => API.get(`/reports/${id}`);
const updateReport = (id, data) => API.patch(`/reports/${id}`, data);

export default { createReport, getReports, getReport, updateReport };
