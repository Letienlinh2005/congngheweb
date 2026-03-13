import axios from "axios";

const Product_API = "https://localhost:7159/api/Sach"

export const getProduct = () => axios.get(Product_API)
export const createProduct = (data) => axios.create(Product_API, data)
export const updateBanDoc = (id, data) => axios.put(`${Product_API}/${id}`, data)
export const deleteBanDoc = (id) => axios.delete(`${Product_API}/${id}`)