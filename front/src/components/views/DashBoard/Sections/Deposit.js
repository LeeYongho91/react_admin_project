import * as React from 'react';
import Typography from '@mui/material/Typography';
import Title from './Title';

export default function Deposits(props) {
  return (
    <>
      <Title>Recent Deposits</Title>
      <Typography component="p" variant="h4">
        ₩ {props.deposit.toLocaleString()}
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        {props.result[props.result.length - 1]} ~ {props.result[0]}
      </Typography>
    </>
  );
}
