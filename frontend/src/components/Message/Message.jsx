import { useRef, useState } from "react";
import { useUser } from "../../UserContext";
import "./Message.scss";
import FullscreenImage from "../FullscreenImage/FullscreenImage";
import { AiFillCloseCircle } from "react-icons/ai";
import { AiFillFile } from "react-icons/ai";
import { deleteMessage } from "../../api/api";
import { deleteFiles, deleteImages } from "../../../firebase";
import Avatar from "../Avatar/Avatar";
import { formatMessageTimestamp } from "../../utils/functions";

export default function Message({ message, users, messages }) {
  const { content: text, user, images, files } = message;
  const author = users.find((u) => u._id === user);
  const { user: thisUser } = useUser();
  const [selectedImage, setSelectedImage] = useState(null);
  const messageRef = useRef();
  const isOnline = thisUser.connectedUsers.some(
    (u) => u === author._id && u !== thisUser.id
  );

  function handleDeleteMessage() {
    if (message.images.length > 0) {
      deleteImages(images, thisUser.currentChat);
    }
    if (message.files.length > 0) {
      deleteFiles(files, thisUser.currentChat);
    }
    deleteMessage(message._id, thisUser.currentChat);
  }

  function isFirstFromUser() {
    const index = messages.findIndex((msg) => msg._id === message._id);

    if (messages[index - 1]?.user === author._id) return false;
    return true;
  }
  function isLastFromUser() {
    const index = messages.findIndex((msg) => msg._id === message._id);

    if (messages[index + 1]?.user === author._id) return false;
    return true;
  }
  const isFirst = isFirstFromUser();
  const isLast = isLastFromUser();

  return (
    <div
    style={{marginBottom: isLast ? '2rem' : '0'}}
      className={`message ${author._id === thisUser.id ? "mine" : "others"}`}
      ref={messageRef}
    >
      <FullscreenImage
        image={selectedImage}
        setImage={setSelectedImage}
        excludedElements={[messageRef]}
      />
      {isFirst && (
        <Avatar isOnline={isOnline} size={"2rem"} config={author.avatar} />
      )}
      <div className="content">
        <p className="text">{text}</p>
        <AiFillCloseCircle
          style={{ display: author._id !== thisUser.id && "none" }}
          className="delete-btn"
          size={15}
          color="rgb(150, 150 ,150)"
          onClick={handleDeleteMessage}
        />

        {isLast && <span className="content__time">
          {formatMessageTimestamp(message.timestamp)}
        </span>}
        {images.length > 0 && (
          <div className="content__images">
            {images.map((img, i) => {
              return (
                <img
                  key={img.id}
                  onClick={() => setSelectedImage(img.url)}
                  src={img.url}
                />
              );
            })}
          </div>
        )}
        {files?.length > 0 && (
          <div className="content__files">
            {files.map((file, i) => (
              <a key={i} className="file" href={file.url}>
                <AiFillFile />
                <p>{file.name}</p>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
