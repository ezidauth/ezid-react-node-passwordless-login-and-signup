const express = require("express");
const cors = require("cors");
const axios = require("axios");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const fs = require("fs");
const port = process.env.PORT || 5001;

const app = express();
app.use(express.json());
app.use(cors());

app.listen(port);
console.log("Server started on port: ", port);

const PUBLIC_KEY = fs.readFileSync("public_key.pem"); // Ensure you have EZiD's public key! You can find this in our docs

//Now Calling EZiD API's

app.post("/login", (req, res) => {
  //first get email from request
  const enteredEmail = req.body.data.email;
  console.log(enteredEmail);

  // setup request to EZiD /send endpoint
  const headers = {
    "Content-Type": "application/json",
    "user-agent": req.headers["user-agent"],
  };

  const data = {
    email: enteredEmail, //mandatory, email of end user
    client_id: process.env.CLIENT_ID, //mandatory, this is your app's id that is provided
    client_secret: process.env.CLIENT_SECRET, //mandatory, app's secret that is provided
    expiry: "3600000", // optional, in milliseconds; default "300000"
    push_email: "Yes", //optional if you don't want to send email; default "Yes"
    base_url_email_link: "http://localhost:3000/auth", // go to frontend mandatory; the base url of the email link sent is this; Default "http://localhost:3000"
    callback_url: "http://localhost:3000/home",
  };

  // post to EZiD /send endpoint
  axios
    .post("https://api.ezid.io/email-link/send", data, headers)
    .then((response) => {
      console.log(response.data);
      res.sendStatus(200); // return successful if the result of the API call was successful
    })
    .catch((error) => console.log(error)); // display the error if the call is unsuccessful
});

// Once the user clicks the email link, the /auth page on the front end is loaded. This route is called upon page load
app.post("/auth", (req, res) => {
  // Getting authentication code and email from the request
  authCode = req.body.data.auth_code; //authentication code from url
  const enteredEmail = req.body.data.email; //get entered email

  //setup request to /verify endpoint
  const data = {
    email: enteredEmail, //mandatory, email of end user
    client_id: process.env.CLIENT_ID, //mandatory, this is your app's id that is provided, you can find this in your portal
    client_secret: process.env.CLIENT_SECRET, //mandatory, app's secret that is provided, you can find this in your portal
    auth_code: authCode, //mandatory, authentication code from the /send endpoint
  };

  // post to EZiD Verify

  axios
    .post("https://api.ezid.io/email-link/verify", data)

    //get access and id token
    .then((response) => {
      // the response will contain an access token, id token and refresh token. You can save these to your user objects
      // for identification
      const accessToken = response.data.access_token;
      const idToken = response.data.id_token;
      const refreshToken = response.data.refresh_token;
      // These tokens can be used to authenticate users. Typically, access tokens are stored with the user's credentials
      // in a secure location. The id token can be sent to the frontend and used in any subsequent calls to verify a user.
      // Refresh tokens can be used to gain access to another set of id and access tokens.

      console.log(response.data);

      res.sendStatus(200);
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(400); // catch and display any errors
    });
});
