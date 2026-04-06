import axios from "axios";


const KeSach_API = "https://localhost:7159/api/KeSach"

export const getKeSachs = () => axios.get(KeSach_API);

export const getKeSachById = (id) => axios.get(KeSach_API, id)

export const createKeSach = (data) => axios.post(KeSach_API, data)
export const updateKeSach = (id, data) => axios.put(`${KeSach_API}/${id}`, data)
export const deleteKeSach = (id) => axios.delete(`${KeSach_API}/${id}`)