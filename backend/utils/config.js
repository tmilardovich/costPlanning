require('dotenv').config()

const PORT = process.env.PORT

const password = process.env.ATLAS
const dbName = process.env.NODE_ENV === "test" ? 'podaci-api-test' : 'podaci-api'
const DB_URI = "mongodb+srv://tmilardov:" + password + "@cluster1.ltc1n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1";
module.exports = { PORT, DB_URI }