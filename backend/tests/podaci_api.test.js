const mongoose = require("mongoose")
const supertest = require("supertest")
const Podatak = require("../models/podaci")
const Korisnik = require("../models/korisnik")
const bcrypt = require("bcrypt")

const app = require("../app")
const api = supertest(app)

const pomocniModul = require("./pomocniModul")
const auth = {
    "username": "tomo",
    "pass": "secret"
}

async function dodajKorisnikaIVratiID() {
    await Korisnik.deleteMany({})
    const passHash = await bcrypt.hash("secret", 10)
    const korisnik = new Korisnik({
        username: "tomo",
        ime: "tomislav",
        passHash: passHash
    })
    await korisnik.save()
    const spremljeniKorisnik = await Korisnik.findOne({ username: "tomo" })
    const korisnikID = spremljeniKorisnik._id
    return korisnikID
}

beforeEach(async () => {
    await Podatak.deleteMany({})

    const idKorisnika = await dodajKorisnikaIVratiID()
    var d = pomocniModul.data[0]
    d.korisnik = idKorisnika


    let podatak = new Podatak(d)
    await podatak.save()

    d = pomocniModul.data[1]
    d.korisnik = idKorisnika
    podatak = new Podatak(d)
    await podatak.save()

    d = pomocniModul.data[2]
    d.korisnik = idKorisnika
    podatak = new Podatak(d)
    await podatak.save()

    //nac id svih poruka i dodat ih korisniku
    const svi = await Podatak.find({})
    const korisnik = await Korisnik.findById(idKorisnika)
    var lista = []
    svi.forEach(element => {
        lista.push(element._id)
    });
    korisnik.podaci = korisnik.podaci.concat(lista)

    await korisnik.save()

    const korisnik2 = await Korisnik.findById(idKorisnika)

})

test("podaci se vracaju kao json", async () => {

    //zatrazit token
    const rez = await api.post("/api/login").send(auth)
    const token = rez.body.token

    await api.get("/api/podaci").auth(token, { type: 'bearer' }).expect(200).expect('Content-Type', /application\/json/)
})

test("baza ima 3 podatka", async () => {
    //zatrazit token
    const rez = await api.post("/api/login").send(auth)
    const token = rez.body.token

    const odgovor = await api.get("/api/podaci").auth(token, { type: 'bearer' })
    expect(odgovor.body).toHaveLength(pomocniModul.data.length)
})

test("provjera opisa podatka", async () => {
    //zatrazit token
    const rez = await api.post("/api/login").send(auth)
    const token = rez.body.token

    const odg = await api.get("/api/podaci").auth(token, { type: 'bearer' })
    const opis = odg.body.map(p => p.description)
    expect(opis).toContain("opis1")
})

test("dodavavnje ispravne poruke", async () => {
    const novi = {
        type: "income",
        category: "food",
        value: 50,
        description: "opis3",
        special: null
    }
    //zatrazit token
    const rez = await api.post("/api/login").send(auth)
    const token = rez.body.token

    await api.post("/api/podaci").send(novi).auth(token, { type: 'bearer' }).expect(200).expect('Content-Type', /application\/json/)

    const odg = await pomocniModul.dohvatiPodatke()
    const desc = odg.map(p => p.description)

    expect(desc).toContain("opis3")
    expect(odg).toHaveLength(pomocniModul.data.length + 1)
})

test("vraca pogresku kod spremanja bez value", async () => {
    const novi = {
        type: "income",
        category: "food",
        description: "opis4",
        special: null
    }
    //zatrazit token
    const rez = await api.post("/api/login").send(auth)
    const token = rez.body.token

    await api.post("/api/podaci").send(novi).auth(token, { type: 'bearer' }).expect(400)

    const odg = await pomocniModul.dohvatiPodatke()

    expect(odg).toHaveLength(pomocniModul.data.length)
})

test("dohvacanje jednog podatka", async () => {

    //zatrazit token
    const rez = await api.post("/api/login").send(auth)
    const token = rez.body.token

    const podaci = await Podatak.find({ username: token.username })

    const podatak = podaci[1]

    const odg = await api.get("/api/podaci/" + podatak.id).auth(token, { type: 'bearer' }).expect(200).expect('Content-Type', /application\/json/)

    expect(odg.body).toStrictEqual(JSON.parse(JSON.stringify(podatak)))
})

test("brisanje podatka", async () => {
    const podaci = await pomocniModul.dohvatiPodatke()
    const brisi = podaci[1]

    //zatrazit token
    const rez = await api.post("/api/login").send(auth)
    const token = rez.body.token

    await api.delete("/api/podaci/" + brisi.id).auth(token, { type: 'bearer' }).expect(204)

    const nakonBrisanja = await pomocniModul.dohvatiPodatke()
    expect(nakonBrisanja.length).toBe(podaci.length - 1)

    const desc = nakonBrisanja.map(p => p.description)
    expect(desc).not.toContain(brisi.description)

})

test("azuriranje podatka", async () => {
    const podaci = await pomocniModul.dohvatiPodatke()
    const azuririraniPodatak = {
        category: "other",
        value: 55,
        description: "azurirani podatak"
    }
    //zatrazit token
    const rez = await api.post("/api/login").send(auth)
    const token = rez.body.token

    const podatakNakonAzuriranja = await api.put("/api/podaci/" + podaci[2].id).send(azuririraniPodatak).auth(token, { type: 'bearer' })

    const objekt = {
        ...podatakNakonAzuriranja.body,
        category: "other",
        value: 55,
        description: "azurirani podatak"
    }
    expect(podatakNakonAzuriranja.body).toStrictEqual(objekt)

})

afterAll(done => {
    mongoose.connection.close()
    done()
})