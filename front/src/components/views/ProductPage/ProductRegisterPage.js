import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Button from '@mui/material/Button';
import FileUpload from '../../utils/FileUpload';
import { loadingToggleAction } from '../../../_actions/util_actions';
import { SHOP_SERVER } from '../../Config';

function ProductRegisterPage(props) {
  const [Title, setTitle] = useState('');
  const [Description, setDescription] = useState('');
  const [Price, setPrice] = useState(0);
  const [Images, setImages] = useState([]);
  const dispatch = useDispatch();
  const titleChangeHander = e => {
    setTitle(e.currentTarget.value);
  };

  const DescriptionChangeHander = e => {
    setDescription(e.currentTarget.value);
  };

  const PriceChangeHander = e => {
    setPrice(parseInt(e.currentTarget.value, 10));
  };

  const updateImages = newImages => {
    setImages(newImages);
  };

  const submitHandler = async e => {
    e.preventDefault();

    if (!Title || !Description || !Price || !Images) {
      return alert('모든값을 넣어주세요.');
    }

    const body = {
      writer: props.user.userData._id,
      title: Title,
      description: Description,
      price: Price,
      images: Images,
    };

    try {
      dispatch(loadingToggleAction(true));
      const { data } = await axios.post(`${SHOP_SERVER}/upload`, body);
      console.log(data);

      if (data.success) {
        alert('상품 업로드에 성공하였습니다.');
        window.location.reload();
      } else {
        alert('상품 업로드에 실패하였습니다.');
      }
      dispatch(loadingToggleAction(false));
    } catch (error) {
      console.log(error.response.data);
    }
  };
  return (
    <div>
      <Box>
        <h4>상품등록</h4>
        <Divider />
        <Paper sx={{ padding: 3 }}>
          <div className="upload-content">
            <div className="upload-title">
              <h2 level={2}>상품 업로드</h2>
            </div>
            <form onSubmit={submitHandler}>
              <FileUpload refreshFunction={updateImages} />
              <br />
              <br />
              <div htmlFor="">이름</div>
              <TextField
                id="name"
                variant="outlined"
                required
                onChange={titleChangeHander}
                value={Title}
                style={{ width: '30%' }}
              />
              <br />
              <br />
              <div htmlFor="">설명</div>
              <TextareaAutosize
                onChange={DescriptionChangeHander}
                value={Description}
                minRows={3}
                style={{ width: '30%' }}
              />
              <br />
              <br />
              <div htmlFor="">가격</div>
              <TextField
                id="price"
                variant="outlined"
                required
                onChange={PriceChangeHander}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                type="number"
                style={{ width: '30%' }}
              />
              <br />
              <br />

              <Button
                color="primary"
                variant="contained"
                size="large"
                htmltype="submit"
                onClick={submitHandler}
              >
                업로드
              </Button>
            </form>
          </div>
        </Paper>
      </Box>
    </div>
  );
}

export default ProductRegisterPage;
