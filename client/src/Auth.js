import { useState, useEffect } from "react";
import axios from "axios";

const Auth = () => {
  const [loginState, setLoginState] = useState(false);
  const [protectedResource, setProtectedResource] = useState("");

  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code"); // This gets the code parameter from the URL

  //verify authentication
  useEffect(() => {
    axios
      .post("/auth", {
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          auth_code: code, // calling server with the authentication code
        },
      })
      .then((response) => {
        console.log(response);
        setLoginState(true);
      })
      .catch((error) => {
        console.log(error);
        setLoginState(false);
      });
  }, [code]);

  const getAPIResource = (e) => {
    e.preventDefault();

    axios
      .get("/getData") // see server.js for this route. It returns some dummy data
      .then((response) => {
        console.log(response.data);
        setProtectedResource(response.data);
      })
      .catch((error) => {
        console.log(error);
        setLoginState(false);
      });
  };

  if (loginState) {
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
          {protectedResource.email != null ? (
            <>
              <p className="protected">{`Email: ${protectedResource.email}`}</p>
              <p className="protected">{`Logins: ${protectedResource.logins}`}</p>
            </>
          ) : null}
        </div>
      </div>
    );
  } else if (!loginState) {
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
