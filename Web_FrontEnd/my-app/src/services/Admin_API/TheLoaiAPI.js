import axios from "axios";

const Category_API = "https://localhost:7159/api/TheLoai"

export const getTheLoais = () => axios.get(Category_API)

export const createTheLoai = (data) => axios.post(Category_API, data)

export const updateTheLoai = (id, data) => axios.put(`${Category_API}/${id}`, data)

export const deleteTheLoai = (id) => axios.delete(`${Category_API}/${id}`)