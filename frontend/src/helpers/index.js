import axios from 'axios'

export const getAuthStatus = () => {
    return axios.get('https://travel-journal-server.herokuapp.com/api/users/auth', { withCredentials: true })
}

export const getUserInfo = () => {
    return axios.get('https://travel-journal-server.herokuapp.com/api/users/info', { withCredentials: true })
}

export const getSavedPins = () => {
    return axios.get('https://travel-journal-server.herokuapp.com/api/pins', { withCredentials: true })
}

