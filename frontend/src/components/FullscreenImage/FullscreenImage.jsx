import { createPortal } from 'react-dom'
import './FullscreenImage.scss'
import { AiOutlineClose } from "react-icons/ai";
import { useEffect, useRef } from 'react';
import useClickOutside from '../../utils/useClickOutside';


export default function FullscreenImage({image, setImage, excludedElements}) {
  const imageRef = useRef()
  useClickOutside(setImage, excludedElements)

  return (
    <>
    {image &&
        createPortal(
            <div className="fullscreen-image">
            <img ref={imageRef} src={image} />
          </div>,
          document.body
          )}
          </>
  )
}
