import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SHOP_SERVER } from '../Config';

function FileUpload(props) {
  const [Images, setImages] = useState([]);
  const [scrollView, setscrollView] = useState('hidden');

  const dropHandler = async files => {
    const formData = new FormData();
    console.log(files);
    const config = {
      header: { 'content-type': 'multipart/form-data' },
    };

    formData.append('file', files[0]);

    const { data } = await axios.post(`${SHOP_SERVER}/image`, formData, config);

    if (data.success) {
      console.log(data);
      setImages([...Images, data.filePath]);
      setscrollView('visible');
      props.refreshFunction([...Images, data.filePath]);
    }
  };

  const deleteHandler = image => {
    const currentIndex = Images.indexOf(image);

    const newImages = [...Images];
    newImages.splice(currentIndex, 1);

    setImages(newImages);
    props.refreshFunction(newImages);

    if (newImages.length === 0) {
      setscrollView('hidden');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
      <Dropzone onDrop={dropHandler}>
        {({ getRootProps, getInputProps }) => (
          <div
            style={{
              width: 300,
              height: 240,
              border: '1px solid lightgray',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '20px',
            }}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <FontAwesomeIcon icon="plus" style={{ fontSize: '3rem' }} />
          </div>
        )}
      </Dropzone>

      <div
        style={{
          display: 'flex',
          width: '316px',
          height: '240px',
          overflowX: 'scroll',
          visibility: scrollView,
        }}
      >
        {Images.map((image, index) => (
          <div onClick={() => deleteHandler(image)} key={index}>
            <img
              style={{ minWidth: '300px', width: '300px', height: '240px' }}
              alt="test"
              src={`http://localhost:5000/${image}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default FileUpload;
