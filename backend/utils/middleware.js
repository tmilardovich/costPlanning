const logger = require('./logger')

const info = (req, res, next) => {
    logger.info("Method: " + req.method)
    logger.info("Path: " + req.path)
    logger.info("Body: " + JSON.stringify(req.body))
    logger.info("***")
    next()
}

const nepostojecaPutanja = (req, res) => {
    res.status(404).send({
        error: "nepostojeca putanja"
    })
}

const errorHandler = (err, req, res, next) => {
    logger.greska("Middleware za greske")

    if (err.name === "CastError") {
        return res.status(400).send({ error: "Krivi format ID parametra" })
    }
    else if (err.name === "ValidationError") {
        return res.status(400).send({ error: err.message })
    }
    else if (err.name === "JsonWebTokenError") {
        return res.status(401).send({ error: "Neispravan token" })
    }
    next(err)
}

module.exports = { info, nepostojecaPutanja, errorHandler }