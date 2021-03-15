const mongoose = require("mongoose")

const podaciSchema = new mongoose.Schema({
    type: String,
    category: String,
    date: String,
    value: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    special: mongoose.Schema.Types.Mixed,
    korisnik: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Korisnik"
    }
})

podaciSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = doc._id.toString()
        delete ret._id
        delete ret.__v
        return ret
    }
})

module.exports = mongoose.model('Podatak', podaciSchema, "data")