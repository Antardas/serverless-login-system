import React, { useRef, useState } from "react";
import logIn from "../images/login-image.jpg";

const Login = () => {
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  console.log(process.env.MAIL_USER);
  const [inputValue, setInputValue] = useState({
    email: "",
    otp: "",
  });
  const [existsOTP, setExistsOTP] = useState(false);
  const handlerInputChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const createOTP = (e) => {
    fetch(`/api/createOtp?email=${inputValue.email}`, {
      // `http://localhost:4000/createOtp/${inputValue.email}`
      method: "GET",
      credentials: "same-origin",
    })
      .then((res) => res.json())
      .then((data) => {
        // cookies('randomKey')
        console.log(data);
        setExistsOTP(data.success);
        setSuccess(data.success);
        setMessage(data.message);
      })
      .catch((err) => {
        console.log(err.message);
      });
    e.preventDefault();
  };
  const verifyOTP = (e) => {
    fetch(
      `http://localhost:4000/validateOTP/${inputValue.otp}/${inputValue.email}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setExistsOTP(data.success);
        setSuccess(data.success);
        setMessage(data.message);
        // inputValue.email = "";
        // inputValue.otp = "";
      });
    e.preventDefault();
  };
  return (
    <div>
      <div className="nav-bar">
        <div>Logo</div>
        <div>
          <button>Login</button>
        </div>
      </div>
      <h1>
        Log<span className="login-text">in</span>
      </h1>
      <div>
        <img className="login-image" src={logIn} alt="login" />
      </div>
      {!existsOTP && (
        <form onSubmit={(e) => createOTP(e)}>
          <input
            type="email"
            className="input-box"
            id="email"
            placeholder="Enter Your email"
            name="email"
            value={inputValue.email}
            onChange={handlerInputChange}
          />
          <input type="submit" className="submit-btn" />
        </form>
      )}
      {success && inputValue.email && (
        <form onSubmit={(e) => verifyOTP(e)}>
          <input
            type="text"
            className="input-box"
            id="otp"
            name="otp"
            placeholder="Enter your OTP"
            value={inputValue.otp}
            onChange={handlerInputChange}
          />
          <input type="submit" className="submit-btn" />
        </form>
      )}
      {message && <h1>{message}</h1>}
    </div>
  );
};

export default Login;
