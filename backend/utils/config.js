require('dotenv').config()

const PORT = process.env.PORT

const password = process.env.ATLAS
const dbName = process.env.NODE_ENV === "test" ? 'podaci-api-test' : 'podaci-api'
const DB_URI = 'mongodb+srv://tmilardov:' + password + '@cluster0.ltc1n.mongodb.net/' + dbName + '?retryWrites=true&w=majority'

module.exports = { PORT, DB_URI }