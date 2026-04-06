import axios from "axios";
import axiosClient from "../axiosClient"

const Phat_API = "https://localhost:7159/api/Phat";

export const getAllPhats = () => 
    axios.get(Phat_API);

export const getPhatByMaBanDoc = (id) => 
    axios.get(`${Phat_API}/by-bandoc/${id}`)

export const thanhToanPhat = (data) => {
    return axiosClient.post("/Phat/thanh-toan", data);
}