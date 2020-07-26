const mongoose = require("mongoose");

// const { DB_URI } = process.env;

// const uri = DB_URI;
const { DB_HOST, DB_PORT, DB_NAME, DB_URI } = process.env;

// const uri = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;
const uri = DB_URI;

//all the option you want to set when connecting to mongodb
//some are required to eliminate mongodb default warnings
const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  autoIndex: false, // Don't build indexes
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0,
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4, // Use IPv4, skip trying IPv6
};

// a wrapper for the actual mongoose.connect function to connect to the db
// this connect function is now a db function so you can do: await db.connect
const connect = async () => {
  await mongoose.connect(uri, options);
  console.log(`Connected to Mongo DB at ${uri}`);
};

module.exports = { connect };
