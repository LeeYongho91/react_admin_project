import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import Button from '@mui/material/Button';
import TableHead from '@mui/material/TableHead';
import Select from '@mui/material/Select';
// import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { SHOP_SERVER } from '../../Config';
import { loadingToggleAction } from '../../../_actions/util_actions';

function Payment() {
  const [StartValue, setStartValue] = useState(new Date());
  const [Endvalue, setEndvalue] = useState(new Date());
  const dispatch = useDispatch();
  const [payments, setPayments] = useState([]);

  const [type, setType] = useState('total');
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = event => {
    setType(event.target.value);
  };

  const search = async () => {
    try {
      dispatch(loadingToggleAction(true));
      const body = {
        type,
        searchTerm,
        startDate: StartValue,
        endDate: Endvalue,
      };
      const { data } = await axios.post(`${SHOP_SERVER}/history`, body);
      console.log(data);
      setPayments(data.payments);
      dispatch(loadingToggleAction(false));
    } catch (error) {
      console.log(error.response.data.error);
    }
  };

  const searchHandle = e => {
    setSearchTerm(e.target.value);
  };

  const renderHistory = payments.map((/* History, idx */) => (
    <TableRow
      key={1}
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
      <TableCell component="th" scope="row">
        dd
      </TableCell>
      <TableCell align="right">dd</TableCell>
      <TableCell align="right">dd</TableCell>
      <TableCell align="right">dd</TableCell>
      <TableCell align="right">dd</TableCell>
    </TableRow>
  ));

  return (
    <div>
      <Box>
        <h4>주문조회</h4>
        <Divider />
        <Paper sx={{ padding: 3 }}>
          <div>주문검색</div>
          <TableContainer component={Paper} sx={{ marginTop: 2 }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableBody>
                <TableRow
                  key={1}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    style={{ width: '20%', backgroundColor: '#bbb' }}
                  >
                    검색어
                  </TableCell>
                  <TableCell align="left">
                    <FormControl
                      style={{ width: '150px', marginRight: '10px' }}
                    >
                      <Select
                        value={type}
                        onChange={handleChange}
                        inputProps={{ 'aria-label': 'Without label' }}
                      >
                        <MenuItem value="total">=통합검색=</MenuItem>
                        <MenuItem value="name">주문자</MenuItem>
                        <MenuItem value="paymentId">주문번호</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      id="outlined-basic"
                      label="검색어"
                      value={searchTerm}
                      onChange={e => searchHandle(e)}
                    />
                  </TableCell>
                </TableRow>
                <TableRow
                  key={2}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    style={{ width: '20%', backgroundColor: '#bbb' }}
                  >
                    기간검색
                  </TableCell>
                  <TableCell align="left">
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        views={['day']}
                        label="기간 시작"
                        inputFormat="yyyy-MM-dd"
                        mask="____-__-__"
                        value={StartValue}
                        onChange={newValue => {
                          setStartValue(newValue);
                        }}
                        renderInput={params => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                    <span
                      style={{
                        lineHeight: 4,
                        paddingLeft: 10,
                        paddingRight: 10,
                        width: 50,
                      }}
                    >
                      ~
                    </span>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        views={['day']}
                        label="기간 종료"
                        inputFormat="yyyy-MM-dd"
                        mask="____-__-__"
                        value={Endvalue}
                        onChange={newValue => {
                          setEndvalue(newValue);
                        }}
                        renderInput={params => (
                          <TextField {...params} sizs="small" />
                        )}
                      />
                    </LocalizationProvider>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <div style={{ textAlign: 'center', margin: '30px' }}>
            <Button
              color="primary"
              variant="contained"
              size="large"
              onClick={search}
            >
              검색
            </Button>
          </div>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead style={{ backgroundColor: '#bbb' }}>
                <TableRow>
                  <TableCell>번호</TableCell>
                  <TableCell align="right">주문일시</TableCell>
                  <TableCell align="right">주문번호</TableCell>
                  <TableCell align="right">주문자</TableCell>
                  <TableCell align="right">주문상품</TableCell>
                  <TableCell align="right">총 상품금액</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{renderHistory}</TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </div>
  );
}

export default Payment;
