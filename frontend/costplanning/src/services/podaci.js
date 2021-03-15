import axios from "axios"

const baseUrl = "http://localhost:3001/api/podaci"
const baseUrlCategory = "http://localhost:3001/api/categories"
let token = null;
const postaviToken = (noviToken) => {
    token = "bearer " + noviToken
}

const axiosGet = () => {
    const config = {
        headers: { Authorization: token }
    }
    return axios.get(baseUrl, config)
}

const axiosPost = async (newObject) => {
    const config = {
        headers: { Authorization: token }
    }

    var odg = await axios.post(baseUrl, newObject, config)
    return odg
}

const axiosPut = (id, newObject) => {
    const config = {
        headers: { Authorization: token }
    }
    return axios.put(baseUrl + "/" + id, newObject, config)
}

const axiosDelete = (id) => {
    const config = {
        headers: { Authorization: token }
    }
    return axios.delete(baseUrl + "/" + id, config)
}

const axiosGetCategories = () => {
    const config = {
        headers: { Authorization: token }
    }
    return axios.get(baseUrlCategory, config)
}

const axiosDeleteCategory = (type, category) => {
    const config = {
        headers: { Authorization: token }
    }
    return axios.put(baseUrlCategory + "/" + type + "/" + category, config)
}

const axiosAddCategory = (newCategory) => {
    const config = {
        headers: { Authorization: token }
    }
    return axios.put(baseUrlCategory + "/add", newCategory, config)
}

const methods = { axiosGet, axiosPost, axiosPut, axiosDelete, axiosGetCategories, axiosDeleteCategory, axiosAddCategory, postaviToken }
export default methods