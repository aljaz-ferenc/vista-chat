import './RegisterForm.scss';
import { BsArrowRightCircleFill } from "react-icons/bs";
import {useForm} from 'react-hook-form'
import { registerUser } from '../../api/api';
import { useNavigate } from 'react-router';

export default function RegisterForm({setState}) {
  const {register, handleSubmit} = useForm()
  const navigate = useNavigate()

  function submitForm(formData){
    registerUser(formData)
      .then(res => {
        if(res.status === 'success') navigate('/chat/profile')
      })
  }

  return (
    <div className="register-form">
      <h2>Register</h2>
      <h4>New here? Register to start chatting!</h4>
      <form onSubmit={handleSubmit(submitForm)}>
        <div className="input-group">
          <label htmlFor="name">Name</label>
          <input {...register('name')} type="text" id="name" />
        </div>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input {...register('email')} type="email" id="email" />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input {...register('password')} type="password" id="password" />
        </div>
        <div className="input-group">
          <label htmlFor="password-confirm">Confirm password</label>
          <input {...register('passwordConfirm')} type="password" id="password-confirm" />
        </div>
        <button>
          <span>Register</span>
          <span>
            <BsArrowRightCircleFill size={25} />
          </span>
        </button>
      </form>
      <div className='form-sub'>
      <span>Already have an account? </span><span onClick={() => setState('login')} className='link'>Login!</span>
      </div>
    </div>
  );
}
