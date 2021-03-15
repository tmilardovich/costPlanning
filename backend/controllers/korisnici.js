const bcrypt = require("bcrypt")
const korisniciRouter = require("express").Router()
const Korisnik = require("../models/korisnik")
const podaci = require("../models/podaci")
const Podatak = require("../models/podaci")

korisniciRouter.post("/", async (req, res) => {

    const sadrzaj = req.body
    const passHash = await bcrypt.hash(sadrzaj.pass, 10)

    const korisnik = new Korisnik({
        username: sadrzaj.username,
        ime: sadrzaj.ime,
        passHash: passHash
    })

    const spremljeniKorisnik = await korisnik.save()

    const obj = new Podatak({
        type: "special",
        category: "",
        date: "",
        value: 0,
        description: "",
        special: {
            income: ["wage", "other"],
            expediture: ["education", "other", "food"]
        },
        korisnik: spremljeniKorisnik.id
    })

    const saved = await obj.save()
    korisnik.podaci = korisnik.podaci.concat(saved._id)
    await korisnik.save()
    res.status(200).send({
        msg: "uspjesno"
    })
})

korisniciRouter.get("/", async (req, res) => {
    const korisnici = await Korisnik.find({}).populate("podaci")
    res.json(korisnici)
})

module.exports = korisniciRouter