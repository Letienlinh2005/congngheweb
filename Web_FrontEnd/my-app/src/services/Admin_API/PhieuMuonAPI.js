import axios from "axios";


const API = "https://localhost:7159/api/PhieuMuon";

export const createPhieuMuon = (data) =>
  axios.post(API, data);