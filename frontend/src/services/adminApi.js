import API from "./api";

const getDashboard = () => API.get("/admin/dashboard");
const banUser = (id) => API.post(`/admin/users/${id}/ban`);
const unbanUser = (id) => API.post(`/admin/users/${id}/unban`);
const deletePostPermanent = (id) => API.delete(`/admin/posts/${id}/permanent`);

const listUsers = (params) => API.get(`/admin/users`, { params });
const getUser = (id) => API.get(`/admin/users/${id}`);
const suspendUser = (id) => API.post(`/admin/users/${id}/suspend`);
const unsuspendUser = (id) => API.post(`/admin/users/${id}/unsuspend`);
const softDeleteUser = (id) => API.post(`/admin/users/${id}/soft-delete`);

const listPosts = (params) => API.get(`/admin/posts`, { params });
const hidePost = (id) => API.post(`/admin/posts/${id}/hide`);
const unhidePost = (id) => API.post(`/admin/posts/${id}/unhide`);

const getLogs = (params) => API.get(`/admin/logs`, { params });

export default { getDashboard, banUser, unbanUser, deletePostPermanent, listUsers, getUser, suspendUser, unsuspendUser, softDeleteUser, listPosts, hidePost, unhidePost, getLogs };
