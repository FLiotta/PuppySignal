// @Packages
import axios, { AxiosInstance } from 'axios'

// @Project
import config from '../config'

const http: AxiosInstance = axios.create({
    baseURL: config.API_URL
})

export default http;