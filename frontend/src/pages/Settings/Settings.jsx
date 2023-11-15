import { useEffect, useState } from "react";
import { useUser } from "../../UserContext";
import "./Settings.scss";
import { changePassword, deleteAccount, logoutUser, updateUser } from "../../api/api";
import {useNavigate} from 'react-router'

export default function Settings() {
  const { user, setTheme } = useUser();
  const [password, setPassword] = useState("");
  const [newPass, setNewPass] = useState("");
  const [passConf, setPassConf] = useState("");
  const [accPass, setAccPass] = useState('')
  const navigate = useNavigate()
  const [changePassErr, setChangePassErr] = useState('')
  const [delAccErr, setDelAccErr] = useState('')

  function handleSetTheme(theme) {
    updateUser(user.id, { theme })
      .then(() => setTheme(theme))
      .catch(() => console.log("error setting theme"));
  }

  function handleChangePassword(e) {
    e.preventDefault();
    if (newPass !== passConf) return setChangePassErr('Passwords do not match');
    setChangePassErr('')
    setDelAccErr('')
    changePassword(user.id, password, newPass)
      .then(res => {
        if(res.status === 'success'){
          logoutUser()
            .then(() => navigate('/login'))
        }else{
          setChangePassErr(res.message)
        }
      })
  }

  function handleDeleteAccount(e){
    e.preventDefault()
    if(!accPass) return setDelAccErr('Password required')
    deleteAccount(user.id, accPass)
      .then(res => {
        if(res.status === 'success'){
          console.log('user deleted')
          navigate('/login')
        }else{
          setDelAccErr(res.message)
        }
      })
  }

  return (
    <div className="settings">
      <h1>Settings</h1>
      <div className="settings__theme">
        <h3>Theme</h3>
        <div className="input-group">
          <input
            type="radio"
            id="light"
            value="light"
            name="theme"
            onChange={() => handleSetTheme("light")}
          />
          <label htmlFor="light">Light</label>
        </div>
        <div className="input-group">
          <input
            type="radio"
            id="dark"
            value="dark"
            name="theme"
            onChange={() => handleSetTheme("dark")}
          />
          <label htmlFor="dark">Dark</label>
        </div>
      </div>
      <div className="account">
        <div className="account__password">
          <h3>Change Password</h3>
          <form onSubmit={handleChangePassword}>
            <div className="input-group">
              <label htmlFor="currentPass">Current Password</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                type="password"
                id="currentPass"
              />
            </div>
            <div className="input-group">
              <label htmlFor="newPass">New Password</label>
              <input
                onChange={(e) => setNewPass(e.target.value)}
                minLength={6}
                type="password"
                id="newPass"
              />
            </div>
            <div className="input-group">
              <label htmlFor="confPass">Confirm Password</label>
              <input
                onChange={(e) => setPassConf(e.target.value)}
                minLength={6}
                type="password"
                id="confPass"
              />
            </div>
            {changePassErr && (
              <small className="no-match-err">{changePassErr}</small>
            )}
            {/* {wrongPass && (
              <small>Password incorrect!</small>
            )} */}
            <button className="submit-btn" type="submit">
              Change Password
            </button>
          </form>
        </div>
        <div className="account__delete">
          <h3>
            Delete Account <small>This action cannot be undone!</small>
          </h3>
          <form onSubmit={handleDeleteAccount}>
            <div className="input-group">
              <label htmlFor="pass">Password</label>
              <input minLength={6} onChange={(e) => setAccPass(e.target.value)} type="password" id="pass" />
            </div>
            {delAccErr && (
              <small>{delAccErr}</small>
            )}
            <button className="submit-btn" type="submit">Delete Account</button>
          </form>
        </div>
      </div>
    </div>
  );
}
