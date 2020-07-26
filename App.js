// import an configure .env files
require("dotenv").config();

const Primus = require("primus");
// const fs = require("fs");

//getting  user router
const user_router = require("./modules/user/user.router");
const account_router = require("./modules/account/account.router");
const products_router = require("./modules/products/products.router");
const { error_handler, not_found } = require("./middleware/errors.handler");

const express = require("express");
const cors = require("cors");

//define app as an instance of express
const app = express();

//set db as an instance of the db I have locally on my pc
const db = require("./db/mongoose.connection");

app.use(cors());

//The process.env property returns an object containing the user environment
//Then we distructure what we need from that object
const { $PORT, API_HOST } = process.env;
// const port = API_PORT || 3030;
const port = $PORT || 3030;

//allows express the ability to json parse
app.use(express.json());

//test get method
app.get("/", function (req, res) {
  res.send("Hello from store");
});

//tells the app of an api endpoint called users
app.use("/products", products_router);
app.use("/api/users", user_router);
app.use("/account", account_router);

// central error handling
app.use(error_handler);

//when no routes were matched...
app.use("*", not_found);

//self excuting function to start the express api server

(async () => {
  //connect to mongo db
  await db.connect();
  //start listening on a certain port
  let server = await app.listen(port, API_HOST, () => {
    // console.log(`Store app listening on  http://${API_HOST}:${API_PORTAPI_PORT} !`);
    console.log(`Store app listening on  http://${API_HOST}:${port} !`);

    // fs.createReadStream(__dirname + "/public-chat-client.html");
  });
  //------------------------------------------------------------------**
  //-------------------------chat server------------------------------**
  //------------------------------------------------------------------**
  let primus = new Primus(server, { transformer: "sockjs" });

  primus.on("connection", (spark) => {
    console.log("--> spark.id: ", spark.id);
    spark.write("welcome to chat");
    spark.on("data", (data) => {
      //write incoming message to all connected sockets...
      primus.write(data);
    });
  });
})().catch(console.log);
