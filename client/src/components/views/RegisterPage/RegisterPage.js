import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import { registerUser } from "../../../_action/user_action";

const RegisterPage = (props) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const onChangeHandler = (event) => {
    const {
      target: { value, name }
    } = event;
    if (name === "email") {
      setEmail(value);
    } else if (name === "username") {
      setName(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "confirmpassword") {
      setConfirmPassword(value);
    }
  };
  const onSubmitHandler = (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      return alert("비밀번호가 일치하지 않습니다");
    }

    let body = {
      email,
      password,
      name
    };

    dispatch(registerUser(body)).then((response) => {
      if (response.payload.success) {
        props.history.push("/login");
      } else {
        alert("error");
      }
    });
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh"
      }}
    >
      <form
        style={{ display: "flex", flexDirection: "column" }}
        onSubmit={onSubmitHandler}
      >
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={onChangeHandler}
          name="email"
          required
        />
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={onChangeHandler}
          name="username"
          required
        />
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={onChangeHandler}
          name="password"
          required
        />
        <label>Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={onChangeHandler}
          name="confirmpassword"
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default withRouter(RegisterPage);
