import { useEffect, useState } from "react";
import { useUser } from "../../UserContext";
import "./Profile.scss";
import { updateUser } from "../../api/api";
import { genConfig } from "react-nice-avatar";
import Avatar from "../../components/Avatar/Avatar";
import { formatDate } from "../../utils/functions";

export default function Profile() {
  const { user, updateUser: updateUserContext } = useUser();
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [work, setWork] = useState("");
  const [education, setEducation] = useState("");
  const [gender, setGender] = useState("");
  const [tempAvatar, setTempAvatar] = useState(null);

  function handleUpdateUserData(e) {
    e.preventDefault();
    const userData = {
      name,
      email,
      phone,
      birthDate,
      education,
      work,
      gender,
      avatar: tempAvatar,
    };
    updateUser(user.id, userData).then((res) => {
      if (res.status === "success") {
        updateUserContext(res.data);
      }
    });
  }

  useEffect(() => {
    if (!user.name) return;
    setName(user.name);
    setEmail(user.email);
    setBirthDate(formatDate(user.birthDate) || null);
    setPhone(user.phone || "");
    setWork(user.work || "");
    setEducation(user.education || "");
    setGender(user.gender || "");
  }, [user]);

  function handleGenerateAvatar() {
    if (!gender) return;
    setTempAvatar(genConfig({ sex: gender === "male" ? "man" : "woman" }));
  }

  return (
    <div className="profile">
      <div className="profile__container">
        <div className="profile__info">
          <h2>Update your info</h2>
          <form onSubmit={handleUpdateUserData}>
            <div className="input-group">
              <label htmlFor="name">
                FULL NAME <span>*</span>
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label htmlFor="email">
                EMAIL <span>*</span>
              </label>
              <input
                type="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
            <div className="input-group">
              <label htmlFor="birth">BIRTH DATE</label>
              <input
                type="date"
                id="birth"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label htmlFor="phone">PHONE NUMBER</label>
              <input
                type="text"
                id="phone"
                onChange={(e) => setPhone(e.target.value)}
                value={phone}
              />
            </div>
            <div className="input-group">
              <label htmlFor="education">EDUCATION</label>
              <input
                type="text"
                id="education"
                onChange={(e) => setEducation(e.target.value)}
                value={education}
              />
            </div>
            <div className="input-group">
              <label htmlFor="work">WORK</label>
              <input
                type="text"
                id="work"
                onChange={(e) => setWork(e.target.value)}
                value={work}
              />
            </div>
            <button>Update</button>
          </form>
        </div>
        <div className="profile__avatar">
          <h2>Avatar</h2>
          <Avatar size="10rem" config={tempAvatar || user.avatar} />
          <div className="gender">
            <div>
              <input
                onChange={(e) => setGender("male")}
                checked={gender === "male"}
                name="gender"
                id="male"
                type="radio"
                value={gender}
              />
              <label htmlFor="male">Male</label>
            </div>
            <div>
              <input
                onChange={(e) => setGender("female")}
                checked={gender === "female"}
                name="gender"
                id="female"
                type="radio"
                value={gender}
              />
              <label htmlFor="female">Female</label>
            </div>
          </div>
          <button
            onClick={handleGenerateAvatar}
            disabled={!gender}
            type="button"
            className="profile__avatar--generate-btn"
          >
            Generate Avatar
          </button>
        </div>
      </div>
    </div>
  );
}
