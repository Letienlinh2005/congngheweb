import axios from "axios";

const Sach_API = "https://localhost:7159/api/Sach"

export const getSachs = () => axios.get(Sach_API);
export const getSachById = (id) => axios.get(`${Sach_API}/${id}`)
export const createSach = (data) => axios.post(Sach_API, data)
export const updateSach = (id, data) => axios.put(`${Sach_API}/${id}`, data)
export const deleteSach = (id) => axios.delete(`${Sach_API}/${id}`)