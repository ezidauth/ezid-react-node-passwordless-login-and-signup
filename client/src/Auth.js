import { useState, useEffect } from "react";
import axios from "axios";

const Auth = () => {
  const [loginState, setLoginState] = useState("");
  const [protectedResource, setProtectedResource] = useState("");

  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code"); // This gets the code parameter from the URL

  //verify authentication
  useEffect(() => {
    axios
      .post("http://localhost:5001/auth", {
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          auth_code: code, // calling server with the authentication code
        },
      })
      .then((response) => {
        console.log(response);
        setLoginState("Success");
      })
      .catch((error) => {
        console.log(error);
        setLoginState("Failure");
      });
  }, [code]);

  const getAPIResource = (e) => {
    e.preventDefault();

    axios
      .get("http://localhost:5001/getData")
      .then((response) => {
        console.log(response);
        setProtectedResource(response);
        // By returning the id token, here you can set these tokens as cookies or save them to the users file system
      })
      .catch((error) => {
        setProtectedResource("Something went wrong - please try login again");
      });
  };

  // const getAPIResource = (e) => {
  //   e.preventDefault();

  //   axios
  //     .get("http://localhost:3001/getData")
  //     .then((response) => {
  //       console.log(response);
  //       setProtectedResource(response);
  //       // By returning the id token, here you can set these tokens as cookies or save them to the users file system
  //     })
  //     .catch((error) => {
  //       setProtectedResource("Something went wrong - please try login again");
  //     });
  // };

  if (loginState === "Success") {
    return (
      <div>
        <div className="background-blur"></div>
        <div className="container">
          <p className="statement">You're logged in!</p>
          <div className="button-container">
            <button className="btn" onClick={getAPIResource}>
              View My Details
            </button>
          </div>
          <p className="protected">{protectedResource}</p>
        </div>
      </div>
    );
  } else if (loginState === "Failure") {
    return (
      <div>
        <div className="background-blur"></div>
        <div className="container">
          <p className="statement">Login Failed! Please try again</p>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div className="background"></div>
        <div className="container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }
};

export default Auth;
