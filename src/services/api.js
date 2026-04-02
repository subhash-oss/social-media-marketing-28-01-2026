import axios from "axios"

const TOKEN_KEY = "access_token"

const api = axios.create({
  baseURL: "https://griffon-precious-basilisk.ngrok-free.app/",
  headers: {
    "Content-Type": "application/json",
    'ngrok-skip-browser-warning': 'true',
  },
  timeout: 10000,
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Authentication failed - Token expired or invalid")
      // Clear the invalid token
      localStorage.removeItem(TOKEN_KEY)
      // Redirect to login page
      window.location.href = "/signin"
    }
    return Promise.reject(error)
  }
)

export { TOKEN_KEY }
export default api
