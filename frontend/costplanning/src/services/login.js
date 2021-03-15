import axios from "axios"
const baseUrl = "http://localhost:3001/api/login"
const regUrl = "http://localhost:3001/api/korisnici"

const prijava = async (podaci) => {
    const odg = await axios.post(baseUrl, podaci)
    return odg.data
}

const registracija = async (podaci) => {
    const odg = await axios.post(regUrl, podaci)
    return odg.data
}

var methods = { prijava, registracija }
export default methods