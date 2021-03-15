const mongoose = require("mongoose")
const uniqueVal = require("mongoose-unique-validator")

const korisnikSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    ime: String,
    passHash: String,
    podaci: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Podatak"
    }]
})

korisnikSchema.plugin(uniqueVal)

korisnikSchema.set("toJSON", {
    transform: (doc, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
        delete ret.passHash
        return ret
    }
})

const Korisnik = mongoose.model("Korisnik", korisnikSchema, "korisnici")
module.exports = Korisnik