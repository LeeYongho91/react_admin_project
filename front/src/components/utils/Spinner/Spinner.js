import { useState } from 'react';
import { css } from '@emotion/react';
import ClipLoader from 'react-spinners/ClipLoader';
import './Spinner.css';

// Can be a string as well. Need to ensure each key-value pair ends with ;
const override = css`
  z-index: 10000;
  position: absolute;
`;

function Spinner() {
  const [loading] = useState(true);
  const [color] = useState('#000');

  return (
    <div className="spinner-container">
      <ClipLoader color={color} loading={loading} css={override} size={80} />
    </div>
  );
}

export default Spinner;
