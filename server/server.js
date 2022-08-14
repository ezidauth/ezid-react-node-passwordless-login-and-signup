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

app.post("/login", async (req, res) => {
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
  try {
    const response = await axios.post(
      "https://api.ezid.io/email-link/send",
      data,
      headers
    );
    console.log(response.data);
    res.sendStatus(200); // return successful if the result of the API call was successful
  } catch (error) {
    console.log(error);
  }
});

// Once the user clicks the email link, the /auth page on the front end is loaded. This route is called upon page load
app.post("/auth", async (req, res) => {
  // Getting authentication code and email from the request
  authCode = req.body.data.auth_code; //authentication code from url
  const enteredEmail = req.body.data.email; //get entered email

  var access_token, id_token, refresh_token;

  //setup request to /verify endpoint
  const data = {
    email: enteredEmail, //mandatory, email of end user
    client_id: process.env.CLIENT_ID, //mandatory, this is your app's id that is provided, you can find this in your portal
    client_secret: process.env.CLIENT_SECRET, //mandatory, app's secret that is provided, you can find this in your portal
    auth_code: authCode, //mandatory, authentication code from the /send endpoint
  };

  // post to EZiD Verify
  try {
    const response = await axios.post(
      "https://api.ezid.io/email-link/verify",
      data
    );

    //get access and id token
    // the response will contain an access token, id token and refresh token. You can save these to your user objects
    // for identification
    access_token = response.data.access_token;
    id_token = response.data.id_token;
    refresh_token = response.data.refresh_token;
    console.log(response.data);
    // These tokens can be used to authenticate users. Typically, access tokens are validated
    // to provision access to a protected resource. ID Tokens are typically for identifying a user or
    // displaying their information. Refresh tokens can be used to gain access to another set of id and access tokens.

    // This is creating an expiry date for the cookie
    const currentDate = new Date();
    const expiryDate = new Date(currentDate.getTime() + 86400000);

    res
      .cookie("access_token", access_token, {
        secure: false, // this determines whether or not the cookie requires an SSL or HTTPS connection to be retrieved.
        // For this example, it is set to false as typically localhost does not have a HTTPS connection.
        // For production applications, this is highly reccomended to be set to true
        httpOnly: true,
        expires: expiryDate, // here you can set your own expiry. For the purposes of this example, it is set to 1 day
        sameSite: "lax",
      })
      .sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(401);
  }
});

// this is an example of a resource that requires an authenticated user. The authenticateUser function is a middleware that should be present on all protected routes
app.get("/getData", authenticateUser, (req, res) => {
  // The decoded access token can now be used to obtain user information (eg. from a database)
  console.log(req.decoded_token);

  //For the purposes of this demo, we will assume that the token got the following user data
  res.send({
    email: "JohnDoe@gmail.com",
    logins: "12345",
  });
});

async function authenticateUser(req, res, next) {
  //check if access_token cookie is present
  if (!req.headers.cookie) {
    console.log("Unauthorised - No access token");
    res.sendStatus(401); // Throw unauthorised if not found
  } else {
    const decodedToken = await verifyJWTToken(
      req.headers.cookie.split("=")[1],
      true
    );
    req.decoded_token = decodedToken;
    next();
  }
}

// function to verify JWT tokens. For the purpose of this example, we will use this to verify the access_token
async function verifyJWTToken(token, asymmetricAlg) {
  var decoded;

  // get key to verify JWT token
  const key = asymmetricAlg ? PUBLIC_KEY : process.env.TOKEN_SECRET;

  try {
    decoded = jwt.verify(token, key);
  } catch (err) {
    console.log("JWT error " + err);
    if (err == "TokenExpiredError: jwt expired") {
      console.log("JWT Expired");
      decoded = "JWT Expired";
    } else {
      decoded = "JWT Verification Failed";
      console.log("JWT Verification Failed");
    }
  }

  return decoded; //return the decoded token
}
