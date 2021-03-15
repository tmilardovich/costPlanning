const express = require("express")
const podaciRouter = express.Router()
const Podatak = require('../models/podaci')
const Korisnik = require("../models/korisnik")
const jwt = require("jsonwebtoken")

const dohvatiToken = req => {

    const auth = req.get("authorization")
    if (auth && auth.toLowerCase().startsWith("bearer")) {
        return auth.substring(7)
    }
    return null
}

podaciRouter.get('/', (req, res) => {
    res.send('Hello')
})

podaciRouter.get('/api/podaci', async (req, res) => { //with auth

    //auth
    const token = dohvatiToken(req)
    const dekToken = jwt.verify(token, process.env.SECRET)
    if (!token || !dekToken.id) {
        return res.status(401).json({ error: "pogresan token" })
    }

    const korisnik = await Korisnik.findById(dekToken.id)

    const podaci = await Podatak.find({ korisnik: korisnik._id }).populate("korisnik", { ime: 1, username: 1 })
    res.json(podaci)
})

podaciRouter.get('/api/podaci/:id', async (req, res, next) => { //with auth

    //auth
    const token = dohvatiToken(req)
    const dekToken = jwt.verify(token, process.env.SECRET)
    if (!token || !dekToken.id) {
        return res.status(401).json({ error: "pogresan token" })
    }

    const korisnik = await Korisnik.findById(dekToken.id)
    const id = req.params.id

    var p = await Podatak.findById(id)

    if (p && String(p.korisnik) === String(korisnik._id)) {
        res.status(200).json(p).end()
    }
    else {
        res.status(404).end()
    }
})

podaciRouter.delete('/api/podaci/:id', async (req, res, next) => { //with auth
    const id = req.params.id

    //auth
    const token = dohvatiToken(req)
    const dekToken = jwt.verify(token, process.env.SECRET)
    if (!token || !dekToken.id) {
        return res.status(401).json({ error: "pogresan token" })
    }

    //provjeri je li autor
    const korisnik = await Korisnik.findById(dekToken.id)
    const originalniPodatak = await Podatak.findById(id)


    if (String(korisnik._id) !== String(originalniPodatak.korisnik)) {
        return res.status(401).json({ error: "niste autor podatka" })
    }

    //brisi
    await Podatak.findByIdAndRemove(id)

    //brisi i id iz korisnikove liste podataka
    korisnik.podaci = korisnik.podaci.filter(p => String(p) != String(originalniPodatak._id))
    await korisnik.save()

    res.status(204).end()
})

podaciRouter.post('/api/podaci', async (req, res, next) => {  //with auth 

    const podatak = req.body
    const token = dohvatiToken(req)
    const dekToken = jwt.verify(token, process.env.SECRET)
    if (!token || !dekToken.id) {
        return res.status(401).json({ error: "pogresan token" })
    }
    const korisnik = await Korisnik.findById(dekToken.id)

    const obj = new Podatak({
        type: podatak.type,
        category: podatak.category,
        date: new Date().toISOString().substring(0, 10),
        value: podatak.value,
        description: podatak.description,
        special: null,
        korisnik: korisnik._id
    })

    const saved = await obj.save()
    korisnik.podaci = korisnik.podaci.concat(saved._id)
    await korisnik.save()
    res.json(saved)
})

podaciRouter.put("/api/podaci/:id", async (req, res, next) => { //with auth
    const id = req.params.id
    const podatak = req.body

    const token = dohvatiToken(req)
    const dekToken = jwt.verify(token, process.env.SECRET)
    if (!token || !dekToken.id) {
        return res.status(401).json({ error: "pogresan token" })
    }

    const korisnik = await Korisnik.findById(dekToken.id)
    const originalniPodatak = await Podatak.findById(id)

    if (String(korisnik._id) !== String(originalniPodatak.korisnik)) {
        console.log(korisnik._id)
        console.log(originalniPodatak.korisnik)
        return res.status(401).json({ error: "niste autor podatka" })
    }

    const obj = {
        category: podatak.category,
        value: podatak.value,
        description: podatak.description
    }

    var p = await Podatak.findByIdAndUpdate(id, obj, { new: true })
    res.json(p)
})

podaciRouter.get("/api/categories", async (req, res) => { //with auth

    //auth
    const token = dohvatiToken(req)
    const dekToken = jwt.verify(token, process.env.SECRET)
    if (!token || !dekToken.id) {
        return res.status(401).json({ error: "pogresan token" })
    }

    const korisnik = await Korisnik.findById(dekToken.id)

    Podatak.find({ type: "special", korisnik: korisnik._id }).then(result => {
        console.log(result)
        res.json(result)
    })
})

podaciRouter.put("/api/categories/add", async (req, res) => { //with auth
    //auth
    const token = dohvatiToken(req)
    const dekToken = jwt.verify(token, process.env.SECRET)
    if (!token || !dekToken.id) {
        return res.status(401).json({ error: "pogresan token" })
    }

    const korisnik = await Korisnik.findById(dekToken.id)

    const obj = req.body

    var dbObject;
    Podatak.find({ type: "special", korisnik: korisnik._id }).then(result2 => {
        dbObject = result2[0].special

        if (obj.type == "income") {
            dbObject.income.push(obj.category)
        }
        else if (obj.type == "expediture") {
            dbObject.expediture.push(obj.category)
        }
        else {
            res.status(400).send({ error: "Bad syntax" })
        }

        Podatak.findOneAndUpdate({ type: "special", korisnik: korisnik._id }, { special: dbObject }, { new: true }).then(p => {
            res.json(p)
            console.log(p)
        })
    }).catch(err => console.log(err))




})

podaciRouter.put("/api/categories/:tip/:kateg", async (req, res) => { //with auth

    var auth = req.body.headers.Authorization
    if (auth && auth.toLowerCase().startsWith("bearer")) {
        auth = auth.substring(7)
    }
    else {
        auth = null
    }
    //auth
    const token = auth
    const dekToken = jwt.verify(token, process.env.SECRET)

    if (!token || !dekToken.id) {
        return res.status(401).json({ error: "pogresan token" })
    }

    const korisnik = await Korisnik.findById(dekToken.id)


    const tip = req.params.tip
    const kateg = req.params.kateg

    Podatak.find({ category: kateg, korisnik: korisnik._id }).then(result => {
        console.log(result)
        //[]
        //ako nema nijedan podatak s tom kategorijom => brisi

        if (!result.length) {
            var dbObject;
            Podatak.find({ type: "special", korisnik: korisnik._id }).then(result2 => {
                dbObject = result2[0].special

                if (tip == "income") {
                    const index = dbObject.income.indexOf(kateg)
                    if (index > -1) {
                        dbObject.income.splice(index, 1);
                    }
                }
                else if (tip == "expediture") {
                    const index = dbObject.expediture.indexOf(kateg)
                    if (index > -1) {
                        dbObject.expediture.splice(index, 1);
                    }
                }

                Podatak.findOneAndUpdate({ type: "special", korisnik: korisnik._id }, { special: dbObject }, { new: true }).then(p => {
                    res.json(p)
                    console.log(p)
                })

            })
        }
        else {
            res.status(400).send({ error: "Unable to delete category because it is used in other data." })
        }


    })
})

module.exports = podaciRouter