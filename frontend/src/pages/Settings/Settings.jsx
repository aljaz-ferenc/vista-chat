import { useEffect } from "react";
import { useUser } from "../../UserContext";
import "./Settings.scss";
import { updateUser } from "../../api/api";

export default function Settings() {
  const { user, setTheme } = useUser();

  function handleSetTheme(theme) {
    updateUser(user.id, { theme })
      .then(() => setTheme(theme))
      .catch(() => console.log("error setting theme"));
  }

  return (
    <div className="settings">
      <h2>Settings</h2>
      <div className="settings__theme">
      <button onClick={() => handleSetTheme("light")}>Light</button>
      <button onClick={() => handleSetTheme("dark")}>Dark</button>
      </div>
    </div>
  );
}
