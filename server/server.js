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

// ----------------- PROMISE VERSION (.THEN) -------------------------

// Once the user clicks the email link, the /auth page on the front end is loaded. This route is called upon page load
// app.post("/auth", (req, res) => {
//   // Getting authentication code and email from the request
//   authCode = req.body.data.auth_code; //authentication code from url
//   const enteredEmail = req.body.data.email; //get entered email

//   let access_token, id_token, refresh_token;

//   //setup request to /verify endpoint
//   const data = {
//     email: enteredEmail, //mandatory, email of end user
//     client_id: process.env.CLIENT_ID, //mandatory, this is your app's id that is provided, you can find this in your portal
//     client_secret: process.env.CLIENT_SECRET, //mandatory, app's secret that is provided, you can find this in your portal
//     auth_code: authCode, //mandatory, authentication code from the /send endpoint
//   };

//   // post to EZiD Verify

//   axios
//     .post("https://api.ezid.io/email-link/verify", data)

//     //get access and id token
//     .then((response) => {
//       // the response will contain an access token, id token and refresh token. You can save these to your user objects
//       // for identification
//       access_token = response.data.access_token;
//       id_token = response.data.id_token;
//       refresh_token = response.data.refresh_token;
//       // These tokens can be used to authenticate users. Typically, access tokens are stored with the user's credentials
//       // in a secure location. The id token can be sent to the frontend and used in any subsequent calls to verify a user.
//       // Refresh tokens can be used to gain access to another set of id and access tokens.

//       console.log(response.data);

//       // req = createAccessCookie(req, res, access_token);

//       // const cookieData = {
//       //   access_token: access_token,
//       // };
//       // console.log(typeof access_token);

//       // res.cookie("access_token", access_token, {
//       //   secure: false, // this determines whether or not the cookie requires an SSL or HTTPS connection to be retrieved.
//       //   // For this example, it is set to false as typically localhost does not have a HTTPS connection.
//       //   // For production applications, this is highly reccomended to be set to true
//       //   httpOnly: true,
//       //   // expires: expiryDate, // here you can set your own expiry. For the purposes of this example, it is set to 1 day
//       //   sameSite: "none",
//       // });

//       res.cookie("rememberme", "1", { maxAge: 900000, httpOnly: true });

//       console.log("Cookie creation: \n\n", res.cookies);

//       res.sendStatus(200);
//     })
//     .catch((error) => {
//       access_token = undefined;
//       id_token = undefined;
//       refresh_token = undefined;
//       console.log(error);
//       res.sendStatus(400); // catch and display any errors
//     });
//   if (access_token !== undefined) {
//     console.log("Cookie Creation");
//     res.cookie("rememberme", "1", { maxAge: 900000, httpOnly: true });
//   }
// });


// ----------------- ASYNC AWAIT VERSION -------------------------


// Once the user clicks the email link, the /auth page on the front end is loaded. This route is called upon page load
app.post("/auth", async (req, res) => {
  // Getting authentication code and email from the request
  authCode = req.body.data.auth_code; //authentication code from url
  const enteredEmail = req.body.data.email; //get entered email

  let access_token, id_token, refresh_token;

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
    console.log("Response is \n \n", response.data);
    const { access_token, id_token, refresh_token } = response.data;
    console.log("Access token is \n \n", typeof access_token, access_token);
    res
      .cookie("access_token", access_token, {
        secure: false, // this determines whether or not the cookie requires an SSL or HTTPS connection to be retrieved.
        // For this example, it is set to false as typically localhost does not have a HTTPS connection.
        // For production applications, this is highly reccomended to be set to true
        httpOnly: true,
        // expires: expiryDate, // here you can set your own expiry. For the purposes of this example, it is set to 1 day
        sameSite: "none",
      })
      .sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(401);
    next(error);
  }

  //get access and id token
  // the response will contain an access token, id token and refresh token. You can save these to your user objects
  // for identification

  // access_token = response.data.access_token;
  // id_token = response.data.id_token;
  // refresh_token = response.data.refresh_token;
  // These tokens can be used to authenticate users. Typically, access tokens are stored with the user's credentials
  // in a secure location. The id token can be sent to the frontend and used in any subsequent calls to verify a user.
  // Refresh tokens can be used to gain access to another set of id and access tokens.

  // console.log(response.data);

  // req = createAccessCookie(req, res, access_token);

  // const cookieData = {
  //   access_token: access_token,
  // };
  // console.log(typeof access_token);

  // res.cookie("access_token", access_token, {
  //   secure: false, // this determines whether or not the cookie requires an SSL or HTTPS connection to be retrieved.
  //   // For this example, it is set to false as typically localhost does not have a HTTPS connection.
  //   // For production applications, this is highly reccomended to be set to true
  //   httpOnly: true,
  //   // expires: expiryDate, // here you can set your own expiry. For the purposes of this example, it is set to 1 day
  //   sameSite: "none",
  // });

  // res.sendStatus(200);
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

function createAccessCookie(req, res, access_token) {
  // here we create a http-only cookie to send to the frontend for the access token
  if (!req.cookies || !req.cookies.access_token) {
    // check if the access_token cookie is present, if not, create cookie
    console.log("Creating Access Token Cookie");
    // This is creating an expiry date for the cookie
    const currentDate = new Date();
    const expiryDate = new Date(currentDate.getTime() + 86400000);

    const cookieData = {
      access_token: access_token,
    };
    console.log("The cookie data is: ", cookieData);

    res.cookie("access_token", JSON.stringify(cookieData), {
      secure: false, // this determines whether or not the cookie requires an SSL or HTTPS connection to be retrieved.
      // For this example, it is set to false as typically localhost does not have a HTTPS connection.
      // For production applications, this is highly reccomended to be set to true
      httpOnly: true,
      // expires: expiryDate, // here you can set your own expiry. For the purposes of this example, it is set to 1 day
      sameSite: "none",
    });
  }
}

async function authenticateUser(req, res, next) {
  //check if access_token cookie is present
  if (!req.cookies || !req.cookies.access_token) {
    console.log("Unauthorised - No access token");
    res.sendStatus(401); // Throw unauthorised if not found
  } else {
    console.log(req.cookies.access_token);

    const decodedToken = await verifyJWTToken(req.cookies.access_token, true);

    req.decoded_token = decodedToken;

    next();
  }
}

// function to verify JWT tokens. For the purpose of this example, we will use this to verify the access_token
async function verifyJWTToken(token, asymmetricAlg) {
  var decoded;

  // get key to verify JWT token
  const key = asymmetricAlg ? PUBLIC_KEY : process.env.TOKEN_SECRET;

  token = JSON.parse(token).access_token; // http cookie payload is formatted as JSON, decode this to find the access token
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
