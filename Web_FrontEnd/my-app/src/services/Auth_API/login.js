import axiosClient from "../axiosClient";

export const loginAPI = (data) => {
    return axiosClient.post("/DangNhap/login", data);
}

export const registerAPI = (data) => {
    return axiosClient.create("/DangNhap/register-reader", data)
}