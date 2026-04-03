import axios from "axios";

const Phat_API = "https://localhost:7159/api/Phat";

export const getAllPhats = () => 
    axios.get(Phat_API);

export const getPhatByMaBanDoc = (id) => 
    axios.get(`${Phat_API}/by-bandoc/${id}`)