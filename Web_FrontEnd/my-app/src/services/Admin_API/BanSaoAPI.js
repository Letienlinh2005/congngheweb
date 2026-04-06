import axios from "axios";


const BanSao_API = "https://localhost:7159/api/BanSao"

export const getBanSaos = () => axios.get(BanSao_API);

export const getBanSaoById = (id) => axios.get(BanSao_API, id)

export const createBanSao = (data) => axios.post(BanSao_API, data)
export const updateBanSao = (id, data) => axios.put(`${BanSao_API}/${id}`, data)
export const deleteBanSao = (id) => axios.delete(`${BanSao_API}/${id}`)