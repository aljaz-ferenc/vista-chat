import "./LoginForm.scss";
import { BsArrowRightCircleFill } from "react-icons/bs";
import { useForm } from "react-hook-form";
import { authenticateUser, loginUser } from "../../api/api";
import {useNavigate} from 'react-router-dom'
import useAuthAndUpdateUser from "../../utils/useAuthAndUpdateUser";

export default function LoginForm({ setState }) {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate()

  useAuthAndUpdateUser()

  function submitForm(formData){
    loginUser(formData)
      .then(res => {
        if(res.status === 'success') navigate('/chat/messages')
      })
  }

  return (
    <div className="login-form">
      <h2>Login</h2>
      <h4>Welcome back! Sign in to join the chat.</h4>
      <form noValidate onSubmit={handleSubmit(submitForm)}>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input {...register('email', {
            required: ['Email required']
          })} type="email" id="email" />
        </div>
        <div className="input-group">
          <label htmlFor="">Password</label>
          <input {...register('password', {
            required: ['Password required']
          })} type="password" id="password" />
        </div>
        <button>
          <span>Login</span>
          <span>
            <BsArrowRightCircleFill size={25} />
          </span>
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
