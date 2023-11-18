import { useRef, useState } from "react";
import "./MessageInput.scss";
import { FaPaperPlane } from "react-icons/fa";
import { BsImages } from "react-icons/bs";
import { BsEmojiSmile } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";
import { PiFilesLight } from "react-icons/pi";
import { sendFiles, sendImages } from "../../../firebase";
import { sendMessage } from "../../api/api";
import { useUser } from "../../UserContext";

export default function MessageInput({
  emojiPickerIsOpen,
  openEmojiPickerBtnRef,
  setInput,
  images,
  files,
  input,
  setImages,
  otherIsTyping,
  chatId,
  setFiles,
  setThumbnails
}) {
  const imageInputRef = useRef();
  const fileInputRef = useRef();
  const inputFieldRef = useRef();

  const {
    user: thisUser,
    resetCurrentChat,
    updateChat,
    setCurrentChat,
    addBatch,
  } = useUser();

  async function handleSendMessage(e) {
    e.preventDefault();
    if (images.length === 0 && files.length === 0 && !input) return;
    let imagesArr = [];

    if (images.length > 0) {
      imagesArr = await sendImages(images, chatId);
    }

    let filesArr = [];
    if (files.length > 0) {
      filesArr = await sendFiles(files, chatId);
    }

    sendMessage(input, thisUser.id, chatId, imagesArr, filesArr).then((res) => {
      setImages([]);
      setFiles([]);
      setThumbnails([]);
      setInput("");
      console.log("message sent");
    });
  }

  function handleUploadImage(e) {
    const thumbs = Array.from(e.target.files).map((file) => {
      return URL.createObjectURL(file);
    });
    setThumbnails(thumbs);
    const images = Array.from(e.target.files);
    setImages(images);
  }

  function handleUploadFile(e) {
    const files = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...files]);
  }

  function handleSelectEmoji(e) {
    setInput((prev) => `${prev} ${e.emoji}`);
  }

  return (
    <form onSubmit={handleSendMessage} className="messages-input">
      <input
        onChange={(e) => setInput(e.target.value)}
        value={input}
        type="text"
        ref={inputFieldRef}
      />
      <button type="submit" className="send-message-btn">
        <FaPaperPlane className="icon" color="#fff" />
      </button>
      <button className="upload-img-btn" type="button">
        <BsImages
          onClick={() => imageInputRef.current.click()}
          color="#6690ea"
          size={25}
        />
      </button>

      <button className="upload-file-btn" type="button">
        <PiFilesLight
          onClick={() => fileInputRef.current.click()}
          color="#6690ea"
          size={30}
        />
      </button>

      <button
        className="emojis-btn"
        type="button"
        onClick={() => setEmojiPickerIsOpen(true)}
        ref={openEmojiPickerBtnRef}
      >
        <BsEmojiSmile color="#6690ea" size={25} />
      </button>
      <input
        onChange={handleUploadImage}
        accept="image/*"
        ref={imageInputRef}
        type="file"
        hidden
        multiple
      />
      <input
        onChange={handleUploadFile}
        accept="audio/*, video/*, text/*, application/pdf"
        ref={fileInputRef}
        type="file"
        hidden
        multiple
      />
      {emojiPickerIsOpen && (
        <div className="emoji-picker" ref={emojiPickerRef}>
          <EmojiPicker onEmojiClick={handleSelectEmoji} />
        </div>
      )}
      {otherIsTyping && (
        <p className="is-typing">{otherUser.name} is typing...</p>
      )}
    </form>
  );
}
