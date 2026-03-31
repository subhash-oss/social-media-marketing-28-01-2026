import axios from "axios"

const api = axios.create({
  baseURL: "https://griffon-precious-basilisk.ngrok-free.app/",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
})

export default api
