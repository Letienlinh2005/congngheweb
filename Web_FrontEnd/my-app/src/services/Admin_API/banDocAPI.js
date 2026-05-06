import axiosClient from "../axiosClient";

export const getBanDocs     = ()         => axiosClient.get("/BanDoc");
export const createBanDoc   = (data)     => axiosClient.post("/BanDoc", data);
export const updateBanDoc   = (id, data) => axiosClient.put(`/BanDoc/${id}`, data);
export const deleteBanDoc   = (id)       => axiosClient.delete(`/BanDoc/${id}`);
export const getBanDocById  = (id)       => axiosClient.get(`/BanDoc/${id}`);