import axios from 'axios'

export const getAuthStatus = () => {
    return axios.get('/api/users/auth', { withCredentials: true })
}

export const getUserInfo = () => {
    return axios.get('/api/users/info', { withCredentials: true })
}

export const getSavedPins = () => {
    return axios.get('/api/pins', { withCredentials: true })
}

