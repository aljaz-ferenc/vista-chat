import "./LoginForm.scss";
import { BsArrowRightCircleFill } from "react-icons/bs";
import { useForm } from "react-hook-form";
import { loginUser } from "../../api/api";
import { useNavigate } from "react-router-dom";
import useAuthAndUpdateUser from "../../utils/useAuthAndUpdateUser";
import { useState } from "react";

export default function LoginForm({ setState }) {
  const { register, handleSubmit } = useForm();
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

  return (
    <div className="login-form">
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
