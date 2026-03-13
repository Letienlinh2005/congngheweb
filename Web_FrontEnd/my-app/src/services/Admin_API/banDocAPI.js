import axios from "axios"

const API = "https://localhost:7159/api/BanDoc"

export const getBanDocs = () => axios.get(API)

export const createBanDoc = (data) => axios.post(API, data)

export const updateBanDoc = (id, data) => axios.put(`${API}/${id}`, data)

export const deleteBanDoc = (id) => axios.delete(`${API}/${id}`)