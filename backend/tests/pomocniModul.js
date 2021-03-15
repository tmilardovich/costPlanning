const Korisnik = require("../models/korisnik")
const Podatak = require("../models/podaci")

var data = [
    {
        type: "special",
        category: "",
        date: "",
        value: 0,
        description: "",
        id: 1,
        special: {
            income: ["wage", "other"],
            expediture: ["education", "food", "other"]
        },
        korisnik: null
    },
    {
        type: "income",
        category: "wage",
        date: "2021-02-12",
        value: 1000,
        description: "opis1",
        id: 2,
        special: null,
        korisnik: null
    },
    {
        type: "expediture",
        category: "food",
        date: "2021-02-12",
        value: 500,
        description: "opis2",
        id: 3,
        special: null,
        korisnik: null
    }
]

const dohvatiPodatke = async () => {
    const podaci = await Podatak.find({})
    return podaci.map(p => p.toJSON())
}

const dohvatiKorisnike = async () => {
    const podaci = await Korisnik.find({})
    return podaci.map(p => p.toJSON())
}

module.exports = { data, dohvatiPodatke, dohvatiKorisnike }