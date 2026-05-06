import axios from "axios";


const API = "https://localhost:7159/api/PhieuMuon";
export const getAllPhieuMuons = () => 
  axios.get(`${API}/chi-tiet`)
export const createPhieuMuon = (data) =>
  axios.post(API, data);

export const returnPhieuMuon = (data) => 
  axios.post(`${API}/tra-sach-va-tinh-phat`, data)

export const giaHanPhieuMuon = (maPhieuMuon) => 
  axios.post(`${API}/gia-han/${maPhieuMuon}`);

export const getPhieuMuonByUser = (maBanDoc) => {
  return axios.get(`${API}/user/${maBanDoc}`);
};