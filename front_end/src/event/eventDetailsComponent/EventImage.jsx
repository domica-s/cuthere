import React, { useEffect, useState } from 'react';
import { FaRegCaretSquareDown } from 'react-icons/fa';
import ImageGallery from 'react-image-gallery';

function EventImage(props) {
    const [Images, setImages] = useState([]);

    useEffect(()=> {
        if (props.detail.images && props.detail.images.length > 0){
            let images = [] ;

            props.detail.images && props.detail.images.map(item => {
                images.push({
                    original: `http://localhost:8080/${item}`,
                    thumbnail: `http://localhost:8080/${item}`
                })
            })
            setImages(images)
        }
    }, [props.detail])


  return (
      <div> 
          <ImageGallery items = {Images} />
      </div>
  )
}

export default EventImage