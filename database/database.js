const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

mongoose.set('useCreateIndex', true);

//Build the connection string

let dbURI;

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
  // console.log('Mongoose default connection open to ' + dbURI);
});

// If the connection throws an error
mongoose.connection.on('error', function (err) {
  console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  // console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

module.exports = {
  mongoose,
  connect: async () => {
    mongoose.Promise = Promise;
    let connectionString;

    switch (process.env.NODE_ENV) {
      case 'test':
        const mongoServer = new MongoMemoryServer();
        let mongoUri = await mongoServer.getConnectionString()
        dbURI = mongoUri;
        //return mongoose.connect(mongoUri, { useNewUrlParser: true });
        break;
      case 'dev':
      default:
        dbURI = 'mongodb://localhost/users';
        break;
    }
    return mongoose.connect(dbURI, { useNewUrlParser: true });
  },
  disconnect: (done) => {
    mongoose.disconnect(done);
  },
};

// const mongoose = require('mongoose');

// (async function connect() {
//     const params = {
//         useNewUrlParser: true,
//         useFindAndModify: false,
//         useCreateIndex: true
//     }

//     mongoose.connect('mongodb://localhost/users', params, (err, db) => {
//         if (err) {
//             console.log('Error connection to DB ' + err);
//         }
//     });
// })();

// module.exports = this;