import { useUser } from "../../UserContext";
import AvatarComponent, { genConfig } from "react-nice-avatar";
import "./Avatar.scss";
import { BsPersonCircle } from "react-icons/bs";
import { GoDotFill } from "react-icons/go";

export default function Avatar({ size, config, isOnline = false }) {
  const { user } = useUser();

  return (
    <>
      {config ? (
        <div className="avatar-container">
          {isOnline && (
            <GoDotFill
              size={20}
              className="avatar-container__online-status"
              color="rgb(0, 187, 0)"
            />
          )}
          <AvatarComponent
            {...config}
            style={{ width: size, height: size }}
            className="avatar"
          />
        </div>
      ) : (
        <BsPersonCircle
          size={size}
          color={user.theme === "light" ? "rgb(75, 75, 75)" : "white"}
        />
      )}
    </>
  );
}
