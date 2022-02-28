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
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import ButtonGroup from '@mui/material/ButtonGroup';
import { USER_SERVER } from '../../Config';
import { loadingToggleAction } from '../../../_actions/util_actions';
import Pagination from '../../utils/Pagination/Pagination';
import { DateFormat } from '../../utils/DateFormat';

function AdminListPage() {
  const d = new Date();

  const year = d.getFullYear(); // 년
  const month = d.getMonth(); // 월
  const day = d.getDate(); // 일

  // 1년전 전 구하기
  const newDate = new Date(year - 1, month, day);

  const [StartValue, setStartValue] = useState(newDate);
  const [Endvalue, setEndvalue] = useState(new Date());
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);

  const [type, setType] = useState('total');
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedBtn, setSelectedBtn] = useState(3);
  const [page, setPage] = useState(1);
  const [skip, setSkip] = useState(0);
  const [limit] = useState(5);
  const [count, setCount] = useState(0);

  const handleChange = event => {
    setType(event.target.value);
  };

  const search = async (Skip = skip) => {
    try {
      dispatch(loadingToggleAction(true));
      if (isNaN(Skip)) Skip = 0;
      const body = {
        type,
        searchTerm,
        startDate: StartValue,
        endDate: Endvalue,
        skip: Skip,
        limit,
      };

      const { data } = await axios.post(`${USER_SERVER}/admin/list`, body);
      console.log(data);
      setUsers(data.users);
      setCount(data.userCount);
      dispatch(loadingToggleAction(false));
    } catch (error) {
      console.log(error.response.data.error);
    }
  };

  const searchHandle = e => {
    setSearchTerm(e.target.value);
  };

  const groupButtonHandler = n => {
    setSelectedBtn(n);
    if (n === 1) {
      const weekBeforeDate = new Date(year, month, day - 7);
      setStartValue(weekBeforeDate);
    } else if (n === 2) {
      const thirtyBeforeDate = new Date(year, month, day - 30);
      setStartValue(thirtyBeforeDate);
    } else if (n === 3) {
      const yearBeforeDate = new Date(year - 1, month, day);
      setStartValue(yearBeforeDate);
    }
  };

  const renderHistory = users.map((user, idx) => (
    <TableRow
      key={idx}
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
      <TableCell component="th" scope="row">
        {skip + idx + 1}
      </TableCell>
      <TableCell align="left">{user.name}</TableCell>
      <TableCell align="left">{user.email}</TableCell>
      <TableCell align="left">{user.userType}</TableCell>
      <TableCell align="left">{DateFormat(user.createdAt)}</TableCell>
    </TableRow>
  ));

  const handlePageChange = pageValue => {
    setPage(pageValue);
    setSkip((pageValue - 1) * limit);
    search((pageValue - 1) * limit);
  };

  return (
    <div>
      <Box>
        <h4>운영자리스트</h4>
        <Divider />
        <Paper sx={{ padding: 3 }}>
          <div>운영자검색</div>
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
                        <MenuItem value="name">이름</MenuItem>
                        <MenuItem value="email">이메일</MenuItem>
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
                    <ButtonGroup
                      disableElevation
                      variant="contained"
                      color="primary"
                      size="large"
                      style={{ marginLeft: '20px' }}
                    >
                      <Button
                        color={selectedBtn === 1 ? 'success' : 'primary'}
                        onClick={() => groupButtonHandler(1)}
                      >
                        7일
                      </Button>
                      <Button
                        color={selectedBtn === 2 ? 'success' : 'primary'}
                        onClick={() => groupButtonHandler(2)}
                      >
                        30일
                      </Button>
                      <Button
                        color={selectedBtn === 3 ? 'success' : 'primary'}
                        onClick={() => groupButtonHandler(3)}
                      >
                        1년
                      </Button>
                    </ButtonGroup>
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
                  <TableCell align="left">번호</TableCell>
                  <TableCell align="left">이름</TableCell>
                  <TableCell align="left">이메일</TableCell>
                  <TableCell align="left">타입</TableCell>
                  <TableCell align="left">가입날짜</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{renderHistory}</TableBody>
            </Table>
          </TableContainer>
          {count !== 0 && (
            <Pagination
              handlePageChange={handlePageChange}
              count={count}
              limit={limit}
              pageOneRefrech={page}
            />
          )}
        </Paper>
      </Box>
    </div>
  );
}

export default AdminListPage;
