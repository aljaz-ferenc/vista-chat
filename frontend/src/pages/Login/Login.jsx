import "./Login.scss";
import image from "../../assets/login-img2.svg";

import LoginForm from "../../components/LoginForm/LoginForm";
import RegisterForm from "../../components/RegisterForm/RegisterForm";
import { useEffect, useState } from "react";

export default function Login() {
  const [state, setState] = useState("login");

  return (
    <div className="login-page">
      <div className="login-page__image">
        <img src={image} alt="" />
      </div>
      <div className="login-page__content">
        {state === "login" ? (
          <LoginForm setState={setState} />
        ) : (
          <RegisterForm setState={setState} />
        )}
      </div>
    </div>
  );
}
