import { useState } from "react";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

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
        <div className="background">
          <div className="container">
            <p>Link sent to {email}!</p>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div className="background">
          <div className="container">
            <form className="add-form" onSubmit={submitHandler}>
              <div className="form-control">
                <div className="label-container">
                  <label>EMAIL</label>
                </div>
                <input
                  type="p"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="button-container">
                <button className="btn">Continue with email</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
};

export default Login;
