import './Thumbnail.scss'
import {IoMdCloseCircle} from 'react-icons/io'

export default function Thumbnail({thumb, setThumbnails, setImages, index}) {

    function handleRemoveImage(){

        setThumbnails(prev => {
           const newThumbs = prev.filter((th) => {
            return th !== thumb
        })
        return newThumbs
        })

        setImages(prev => {
            const newImages = prev.filter((_, i) => i !== index)
            return newImages
        })
    }

  return (
    <div className="thumbnail">
        <IoMdCloseCircle onClick={handleRemoveImage} color='white' className='thumbnail__close-btn'/>
      <img src={thumb} />
    </div>
  );
}
