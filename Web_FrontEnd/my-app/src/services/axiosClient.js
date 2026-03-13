import axios from "axios"

const axiosClient = axios.create({
  baseURL:"https://localhost:7159/api"
})

axiosClient.interceptors.request.use((config)=>{

  const token = localStorage.getItem("token")

  if(token){
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default axiosClient