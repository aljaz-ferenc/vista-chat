import "./LoginForm.scss";
import { BsArrowRightCircleFill } from "react-icons/bs";
import { useForm } from "react-hook-form";
import { loginUser } from "../../api/api";
import { useNavigate } from "react-router-dom";
import useAuthAndUpdateUser from "../../utils/useAuthAndUpdateUser";
import { useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";

export default function LoginForm({ setState }) {
  const { register, handleSubmit, setValue } = useForm();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useAuthAndUpdateUser();

  function submitForm(formData) {
    loginUser(formData)
      .then((res) => {
        if (res.status === "success") navigate("/chat/messages");
        if (res.status === "fail") {
          throw new Error(res.message);
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  }

  function setTestData1() {
    setValue("email", "user1@email.com");
    setValue("password", "user1234");
  }

  function setTestData2() {
    setValue("email", "user3@email.com");
    setValue("password", "user1234");
  }

  return (
    <div className="login-form">
      <div className="login-form__test">
        <p>
          For <strong>testing</strong>, you can open the app in two browsers and login with
          two different test users.
        </p>
        <p>
          Feel free to send messages. A message can be deleted and removed from the database by
          hovering over it and clicking <AiFillCloseCircle />.
        </p>
        <div className="login-form__test--users">
          <button onClick={setTestData1}>Test User 1</button>
          <button onClick={setTestData2}>Test User 2</button>
        </div>
      </div>
      <h2>Login</h2>
      <h4>Welcome back! Sign in to join the chat.</h4>
      <form noValidate onSubmit={handleSubmit(submitForm)}>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            {...register("email", {
              required: ["Email required"],
            })}
            type="email"
            id="email"
          />
        </div>
        <div className="input-group">
          <label htmlFor="">Password</label>
          <input
            {...register("password", {
              required: ["Password required"],
            })}
            type="password"
            id="password"
          />
        </div>
        <button>
          <small className="error">{error}</small>
          <span>
            <BsArrowRightCircleFill size={25} className="button-arrow" />
          </span>
          <span>Login</span>
        </button>
      </form>
      <div className="form-sub">
        <span>Don't have an account? </span>
        <span onClick={() => setState("register")} className="link">
          Register!
        </span>
      </div>
    </div>
  );
}
