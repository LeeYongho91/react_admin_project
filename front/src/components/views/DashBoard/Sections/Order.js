import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';
import { DateFormat } from '../../../utils/DateFormat';

function Order(props) {
  const renderHistory = props.history.map((el, idx) => (
    <TableRow
      key={idx}
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
      <TableCell component="th" scope="row">
        {idx + 1}
      </TableCell>
      <TableCell align="left">
        {DateFormat(el.product[0].dateOfPurchase)}
      </TableCell>
      <TableCell align="left">{el.product[0].paymentId}</TableCell>
      <TableCell align="left">{el.user[0].name}</TableCell>
      <TableCell align="left">{el.product[0].name}</TableCell>
      <TableCell align="left">
        {(el.product[0].price * el.product[0].quantity).toLocaleString()}
      </TableCell>
    </TableRow>
  ));
  return (
    <div>
      {' '}
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead style={{ backgroundColor: '#bbb' }}>
            <TableRow>
              <TableCell align="left">번호</TableCell>
              <TableCell align="left">주문일시</TableCell>
              <TableCell align="left">주문번호</TableCell>
              <TableCell align="left">주문자</TableCell>
              <TableCell align="left">주문상품</TableCell>
              <TableCell align="left">총 상품금액</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{renderHistory}</TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Order;
