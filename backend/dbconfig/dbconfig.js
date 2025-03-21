 var mongoose = require('mongoose');
//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/GrowwUp';
mongoose.connect(mongoDB, { useNewUrlParser: true });
 //Get the default connection
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// const mongoose = require('mongoose');

// // Connection URI (replace <db_password> with your actual password)
// const mongoDB = 'mongodb+srv://dkmishra2701:<db_password>@growwup.hpjew.mongodb.net/?retryWrites=true&w=majority&appName=GrowwUp';

// // Updated connection options (useNewUrlParser and useUnifiedTopology are no longer needed in newer versions)
// mongoose.connect(mongoDB)
//   .then(() => {
//     console.log('Successfully connected to MongoDB Atlas');
//   })
//   .catch(err => {
//     console.error('MongoDB connection error:', err);
//     process.exit(1); // Exit with failure code
//   });

// // Get the default connection
// const db = mongoose.connection;

// // Additional event listeners for MongoDB connection
// db.on('error', (err) => {
//   console.error('MongoDB connection error:', err);
// });

// db.on('disconnected', () => {
//   console.log('MongoDB disconnected');
// });

// db.on('reconnected', () => {
//   console.log('MongoDB reconnected');
// });

// // Export the connection
// module.exports = db;