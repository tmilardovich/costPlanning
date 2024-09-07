const config = require('./utils/config')
const express = require('express')
require("express-async-errors")
const app = express()
const cors = require('cors')
const podaciRouter = require('./controllers/podaci')
const korisniciRouter = require('./controllers/korisnici')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

logger.info("Spajam se na", config.DB_URI)

mongoose.connect(config.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(result => {
    logger.info("Spojeni na bazu")
}).catch(error => {
    logger.greska("Greska pri spajanju", error.message)
})

app.use(cors())
app.use(express.json())
app.use(middleware.info)

//app, use('/api/podaci', podaciRouter)
app.use(podaciRouter)
app.use("/api/korisnici", korisniciRouter)
app.use("/api/login", loginRouter)

app.use(middleware.nepostojecaPutanja)
app.use(middleware.errorHandler)

module.exports = app