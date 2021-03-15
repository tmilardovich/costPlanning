const info = (...podaci) => {
    if (process.env.NODE_ENV !== "test") {
        console.log(...podaci)
    }
}

const greska = (...podaci) => {
    console.log(...podaci)
}

module.exports = { info, greska }