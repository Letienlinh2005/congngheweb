import axios from "axios"

const Reader_API = "https://localhost:7159/api/BanDoc"

export const getBanDocs = () => axios.get(Reader_API)

export const createBanDoc = (data) => axios.post(Reader_API, data)

export const updateBanDoc = (id, data) => axios.put(`${Reader_API}/${id}`, data)

export const deleteBanDoc = (id) => axios.delete(`${Reader_API}/${id}`)