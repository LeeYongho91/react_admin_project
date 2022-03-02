import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import Chart from './Sections/Chart';
import { SHOP_SERVER } from '../../Config';
import { loadingToggleAction } from '../../../_actions/util_actions';
import Deposit from './Sections/Deposit';
import Order from './Sections/Order';

const date = new Date().toLocaleDateString();
let today = Date.parse(date);
const result = [];

const dateSetting = todayDate => {
  const year = new Date(todayDate).getFullYear();
  let month = new Date(todayDate).getMonth() + 1;
  if (month < 10) month = `0${month}`;
  let day = new Date(todayDate).getDate();
  if (day < 10) day = `0${day}`;
  return `${year}-${month}-${day}`;
};
result.push(dateSetting(today));
for (let i = 0; i < 6; i++) {
  today -= 86400000;
  result.push(dateSetting(today));
}

function DashboardContent() {
  const dispatch = useDispatch();
  const [price, setPrice] = useState([]);
  const [deposit, setDeposit] = useState(0);
  const [history, setHistory] = useState([]);
  const getWeekPayment = async () => {
    try {
      dispatch(loadingToggleAction(true));
      const response = await axios.get(`${SHOP_SERVER}/history/week`);
      const newPrice = Array.from({ length: 7 }, () => 0);

      for (let i = 0; i < result.length; i++) {
        for (let j = 0; j < response.data.history.length; j++) {
          if (result[i] === response.data.history[j]._id.month_day) {
            newPrice[newPrice.length - 1 - i] =
              response.data.history[j].totalPrice;
          }
        }
      }

      setPrice(newPrice);
      setDeposit(response.data.recentSum);
      setHistory(response.data.recentHistory);

      dispatch(loadingToggleAction(false));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (price.length === 0) {
      getWeekPayment();
    }
  });
  return (
    <Grid container spacing={3}>
      {/* Chart */}
      <Grid item xs={12} md={8} lg={9}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 450,
          }}
        >
          <Chart price={price} />
        </Paper>
      </Grid>
      {/* Recent Deposits */}
      <Grid item xs={12} md={4} lg={3}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 240,
          }}
        >
          <Deposit deposit={deposit} result={result} />
        </Paper>
      </Grid>
      {/* Recent Orders */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          <Order history={history} />
        </Paper>
      </Grid>
    </Grid>
  );
}

export default DashboardContent;
