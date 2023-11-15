import { useParams } from "react-router";
import "./Messages.scss";
import { useEffect, useRef, useState } from "react";
import { getChatById, getPreviousBatch, sendMessage } from "../../api/api";
import { useUser } from "../../UserContext";
import { FaPaperPlane } from "react-icons/fa";
import Message from "../Message/Message";
import { PulseLoader } from "react-spinners";
import { BsImages } from "react-icons/bs";
import Thumbnail from "../Thumbnail/Thumbnail";
import { sendFiles, sendImages } from "../../../firebase";
import Avatar from "../Avatar/Avatar";
import { BsEmojiSmile } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";
import { PiFilesLight } from "react-icons/pi";
import { AiOutlineFile } from "react-icons/ai";
import { IoIosCloseCircleOutline } from "react-icons/io";

export default function Messages() {
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);
  const [input, setInput] = useState("");
  const [isLoadingBatch, setIsLoadingBatch] = useState(false);
  const [emojiPickerIsOpen, setEmojiPickerIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false)
  const [otherIsTyping, setOtherIsTyping] = useState(false)
  const {
    user: thisUser,
    resetCurrentChat,
    updateChat,
    setCurrentChat,
    addBatch,
  } = useUser();

  const messagesElementRef = useRef();
  const requestedBatchRef = useRef(null);
  const imageInputRef = useRef();
  const fileInputRef = useRef();
  const inputFieldRef = useRef();
  const emojiPickerRef = useRef();
  const openEmojiPickerBtnRef = useRef();
  const { chatId } = useParams();
  const chat = thisUser?.chats.find((chat) => chat?._id === chatId);
  const otherUser = chat?.users.find((u) => u?._id !== thisUser.id);
  const timerRef = useRef()
  const firstRenderRef = useRef(true)

  useEffect(() => {
    updateChat(chatId);
    return () => {
      resetCurrentChat();
    };
  }, []);

  useEffect(() => {
    if (
      !messagesElementRef.current ||
      !thisUser.lastBatch ||
      thisUser.lastBatch === 1
    )
      return;

    messagesElementRef.current.addEventListener("scroll", (e) => {
      if (
        thisUser.lastBatch <= 2 ||
        thisUser.lastBatch === requestedBatchRef.current
      )
        return;

      if (messagesElementRef.current.scrollTop === 0) {
        requestedBatchRef.current = thisUser.lastBatch;
        setIsLoadingBatch(true);
        getPreviousBatch(thisUser.lastBatch - 2, chatId)
          .then((res) => {
            const messages = res.data.messages;
            addBatch(chatId, messages);
            setIsLoadingBatch(false);
          })
          .finally(() => {
            setIsLoadingBatch(false);
          });
      }
    });
  }, [messagesElementRef.current, thisUser.lastBatch]);

  useEffect(() => {
    if (!chatId || !thisUser.id) return;
    setCurrentChat(chatId);
    getChatById(chatId, thisUser.id, true).then((res) => {
      const updatedChat = res.data.chat;
      updatedChat.messages = res.data.messages;
      updatedChat.lastBatch = res.data.lastBatch;
      updateChat(updatedChat);
    });
  }, [chatId, thisUser.id]);

  useEffect(() => {
    if (!messagesElementRef.current) return;
    setIsTyping(false)
    messagesElementRef.current.scrollTo({
      top:
        messagesElementRef.current.scrollHeight -
        messagesElementRef.current.clientHeight,
      behavior: "smooth",
    });
  }, [chat, messagesElementRef.current]);


  useEffect(() => {
    if(!input) return
    if(firstRenderRef.current){
      firstRenderRef.current = false
      return
    }

    setIsTyping(true)
    
    timerRef.current = setTimeout(() => {
      setIsTyping(false)

    }, 1000)

    return () => {
      clearTimeout(timerRef.current)
    }
  }, [input])

  useEffect(() => {
    if(!thisUser.socket) return

    if(isTyping){
      thisUser.socket.emit('isTyping', true, thisUser.id, otherUser._id, chat._id)
    }
    if(!isTyping){
      thisUser.socket.emit('isTyping', false, thisUser.id, otherUser._id, chat._id)
    }
  }, [isTyping])

  useEffect(() => {
    if(!thisUser.socket) return

    thisUser.socket.on('isTyping', bool => {
     setOtherIsTyping(bool)
    })
  }, [thisUser.socket])


  async function handleSendMessage(e) {
    e.preventDefault();
    if (images.length === 0 && files.length === 0 && !input) return;
    let imagesArr = [];

    if (images.length > 0) {
      imagesArr = await sendImages(images, chatId);
    }

    let filesArr = []
    if(files.length > 0){
      filesArr = await sendFiles(files, chatId)
    }

    sendMessage(input, thisUser.id, chatId, imagesArr, filesArr)
      .then(res => {
          console.log(res)
          setImages([]);
          setFiles([])
          setThumbnails([]);
          setInput("");
      })
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
    const files = Array.from(e.target.files)
    setFiles(prev => [...prev, ...files]);
  }

  function handleRemoveFile(fileId){
    setFiles(prev => prev.filter(file => file.id !== fileId))
  }

  function handleSelectEmoji(e) {
    setInput((prev) => `${prev} ${e.emoji}`);
  }


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        emojiPickerRef.current &&
        openEmojiPickerBtnRef.current &&
        !emojiPickerRef.current.contains(e.target) &&
        !openEmojiPickerBtnRef.current.contains(e.target)
      )
        setEmojiPickerIsOpen(false);
    };

    document.body.addEventListener("click", handleClickOutside);

    return () => document.body.removeEventListener("click", handleClickOutside);
  }, []);

  if (thisUser.name === "") {
    return <></>;
  }

  return (
    <div className="messages">
      {chat && (
        <div ref={messagesElementRef} className="messages__main">
          <div className="messages__top">
            <div className="users">
              {chat && chat.users.length === 2 ? (
                <div className="user-info" key={otherUser._id}>
                  <h2>{otherUser.name}</h2>
                  <Avatar size={'10rem'} config={otherUser.avatar} />
                  <p>
                    This is the beginning of your conversation with{" "}
                    {otherUser.name}
                  </p>
                </div>
              ) : (
                <div></div>
              )}
              <hr />
            </div>
          </div>
          <div className="messages__list">
            {isLoadingBatch && (
              <PulseLoader color="#6690ea" className="loader" />
            )}
            {chat?.messages &&
              chat.messages.map((msg, i) => {
                return (
                  <Message
                    message={msg}
                    messages={chat.messages}
                    users={chat.users}
                    key={msg._id}
                  />
                  );
                })}
          </div>
            
        </div>
      )}
      {thumbnails.length > 0 && (
        <div className="messages__thumbnails">
          {thumbnails.map((thumb, i) => (
            <Thumbnail
              index={i}
              setImages={setImages}
              setThumbnails={setThumbnails}
              key={thumb}
              thumb={thumb}
            />
          ))}
        </div>
      )}
      {files.length > 0 && (
        <div className="files">
          {files.map((file, i) => (
            <div key={file.name}>
              <AiOutlineFile size={50}/>
              <span>{file.name}</span>
              <IoIosCloseCircleOutline size={25} onClick={() => handleRemoveFile(file.id)} className="remove-btn"/>
            </div>
          ))}
        </div>
      )}
      <form onSubmit={handleSendMessage} className="messages__input">
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
        {otherIsTyping && <p className="is-typing">{otherUser.name} is typing...</p>}
      </form>
    </div>
  );
}
