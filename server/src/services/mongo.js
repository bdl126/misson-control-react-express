const mongoose = require('mongoose')

const MONGO_URL = "mongodb+srv://nasa-api:pakUdsq8e2BRZmzY@nasacluster.cqovlbb.mongodb.net/nasa?retryWrites=true&w=majority"
mongoose.connection.once('open', () => {
    console.log("MongoDb ready");
})

mongoose.connection.on('error', (err)=>[
    console.error(err)
])


async function mongoConnect()  {
    await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect()  {
    await mongoose.disconnect();
}

module.exports = {
    mongoConnect,
    mongoDisconnect
}