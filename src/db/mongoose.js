const mongoose = require('mongoose')
// strict query is supposed to become depricated, so now it has to be set to false so it doesn't display warning in console
mongoose.set('strictQuery', false)

const connect = () => {
  mongoose.connect(process.env.MONGODB_URI, {
    //useNewUrlParser: true,
    //useUnifiedTopology: true
  })
  .then(() => {
    console.info('connected to the db')
  })
  .catch(err => {
    console.error('MongoDB connection unsuccessful, retry after 5 seconds. ', err)
    setTimeout(connect, 5000)
  })
}



const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.info("MongoDB connection is successful")
})

connect()

console.warn(`connection.readyState: ${db.readyState}`)
