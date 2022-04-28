import { useState } from "react";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [placehold, setPlacehold] = useState("Enter Email");
  const [backgroundCss, setBackgroundCss] = useState("background");
  const [submitted, setSubmitted] = useState(false);
  const [labelContainer, setLabelContainer] = useState(
    "label-container-hidden"
  );

  const inputClickEvent = () => {
    setPlacehold("");
    setLabelContainer("label-container");
    setBackgroundCss("background-blur");
  };

  const retryHandler = (event) => {
    event.preventDefault();
    setSubmitted(false);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setSubmitted(true);

    axios
      .post(`http://localhost:5001/login`, {
        headers: {
          key: "Content-Type",
          accepts: "application/json",
        },
        data: {
          email: email,
        },
      })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (submitted === true) {
    return (
      <div>
        <div className={backgroundCss}></div>
        <div className="container">
          <p>Link sent to {email}!</p>
          <br />
          <br />
          <div className="button-container" onClick={retryHandler}>
            <button className="btn">Try again</button>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div className={backgroundCss}></div>
        <div className="container">
          <form className="add-form" onSubmit={submitHandler}>
            <div className="form-control">
              <div className={labelContainer}>
                <label>EMAIL</label>
              </div>
              <input
                type="p"
                placeholder={placehold}
                value={email}
                onClick={inputClickEvent}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="button-container">
              <button className="btn">Continue with email</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
};

export default Login;
