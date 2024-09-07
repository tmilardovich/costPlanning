const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const korisnikSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    ime: String,
    passHash: String,
    podaci: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Podatak'
        }
    ]
});

korisnikSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });

const Korisnik = mongoose.model('Korisnik', korisnikSchema);
module.exports = Korisnik