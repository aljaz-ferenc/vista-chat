import { useEffect, useRef, useState } from "react";
import "./SharedFilesLayout.scss";
import { useUser } from "../../UserContext";
import FullscreenImage from "../../components/FullscreenImage/FullscreenImage";
import { AiFillFile } from "react-icons/ai";

export default function SharedFilesLayout() {
  const [activeTab, setActiveTab] = useState("images");
  const { user } = useUser();
  const chat = user.chats.filter((ch) => ch._id === user.currentChat)[0];
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const thumbnailRef = useRef();
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (!user.name || !chat?.messages) return;
    const imgs = [];
    const fls = [];

    chat.messages.forEach((msg) => {
      if (msg.images.length > 0) imgs.push(msg.images);
      if (msg.files.length > 0) fls.push(msg.files);
    });

    setImages(imgs.flat());
    setFiles(fls.flat());
  }, [user, chat]);

  return (
    <div className="shared-files-layout">
      <h3>Shared Files</h3>
      <FullscreenImage
        image={selectedImage}
        setImage={setSelectedImage}
        excludedElements={[thumbnailRef]}
      />

      <nav className="shared-files-layout__tabs">
        <button
          onClick={() => setActiveTab("images")}
          className={activeTab === "images" ? "active" : ""}
        >
          Images
        </button>
        <button
          onClick={() => setActiveTab("files")}
          className={activeTab === "files" ? "active" : ""}
        >
          Files
        </button>
      </nav>
      {activeTab === "images" ? (
        <div className="shared-images">
          {images.length > 0 && (
            <div ref={thumbnailRef} className="shared-images__list">
              {images.map((img) => (
                <div key={img.id} className="shared-images__list--image">
                  <img
                    onClick={() => setSelectedImage(img.url)}
                    src={img.url}
                  />
                </div>
              ))}
            </div>
          )}
          {images.length === 0 && <p>No shared images yet...</p>}
        </div>
      ) : (
        <div className="shared-files">
          {files.length > 0 && (
            <div ref={thumbnailRef} className="shared-files__list">
              {files.map((file) => (
                <a
                  href={file.url}
                  key={file.id}
                  className="shared-files__list--file"
                >
                  <AiFillFile />
                  <span>{file.name}</span>
                </a>
              ))}
            </div>
          )}
          {files.length === 0 && <p>No shared files yet...</p>}
        </div>
      )}
    </div>
  );
}
