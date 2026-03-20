import axios from "axios";

const Account_API = "https://localhost:7159/api/TaiKhoan"

export const getTaiKhoans = () => axios.get(Account_API)

export const createTaiKhoan = (data) => axios.post(Account_API, data)

export const updateTaiKhoan = (id, data) => axios.put(`${Account_API}/${id}`, data)

export const deleteTaiKhoan = (id) => axios.delete(`${Account_API}/${id}`)