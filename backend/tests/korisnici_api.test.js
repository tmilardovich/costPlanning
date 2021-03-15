const bcrypt = require("bcrypt")
const Korisnik = require("../models/korisnik")
const pomocniModul = require("./pomocniModul")
const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const api = supertest(app)

beforeEach(async () => {
    await Korisnik.deleteMany({})
    const passHash = await bcrypt.hash("secret", 10)
    const korisnik = new Korisnik({
        username: "tomo",
        ime: "tomislav",
        passHash: passHash
    })
    await korisnik.save()
})

test("dodavanje novog korisnika", async () => {

    const korisnici = await pomocniModul.dohvatiKorisnike()
    const novi = {
        username: "drugi",
        ime: "another",
        pass: "oarwa"
    }

    await api.post("/api/korisnici").send(novi).expect(200).expect('Content-Type', /application\/json/)

    const kraj = await pomocniModul.dohvatiKorisnike()
    expect(kraj).toHaveLength(korisnici.length + 1)

    const imena = kraj.map(k => k.username)
    expect(imena).toContain(novi.username)
})

test("greska ako postoji username", async () => {
    const korisnici = await pomocniModul.dohvatiKorisnike()
    const novi = {
        username: "tomo",
        ime: "another",
        pass: "oarwa"
    }

    const rez = await api.post("/api/korisnici").send(novi).expect(400)
        .expect('Content-Type', /application\/json/)


    const kraj = await pomocniModul.dohvatiKorisnike()
    expect(kraj).toHaveLength(korisnici.length)

    expect(rez.body.error).toContain("`username` to be unique")
})

afterAll(async () => {
    await mongoose.connection.close()
})