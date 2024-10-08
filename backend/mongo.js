const mongoose = require("mongoose")
const password = process.env.ATLAS
const dbName = 'podaci-api'

const url = "mongodb+srv://tmilardov:" + password + "@cluster1.ltc1n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1";

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const podaciSchema = new mongoose.Schema({
    type: String,
    category: String,
    date: String,
    value: Number,
    description: String,
    special: mongoose.Schema.Types.Mixed
})

const Podatak = mongoose.model('Podatak', podaciSchema, "data")

const noviPodatak = new Podatak({

    type: "expediture",
    category: "food",
    date: "2012-12-01",
    value: 700,
    description: "hrana",
    special: null
})

/*
noviPodatak.save().then(result => {
    console.log("Spremljeno")
    console.log(result)
    mongoose.connection.close()
})
*/
/*
console.log("OKE")
Podatak.find({}).then(response => {
    response.forEach(p => {

        console.log(p)
    })
    mongoose.connection.close()
})
*/