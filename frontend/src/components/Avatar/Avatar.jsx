import { useUser } from "../../UserContext";
import AvatarComponent, { genConfig } from "react-nice-avatar";
import "./Avatar.scss";
import { BsPersonCircle } from "react-icons/bs";

export default function Avatar({ size, config }) {
  const { user } = useUser();

  return (
    <>
      {config ? (
        <AvatarComponent
          {...config}
          style={{ width: size, height: size }}
          className="avatar"
        />
      ) : (
        <BsPersonCircle size={size} color={user.theme === 'light' ? 'rgb(75, 75, 75)' : 'white'} />
      )}
    </>
  );
}
