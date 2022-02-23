import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import TextField from '@mui/material/TextField';

function DashboardContent() {
  const [value, setValue] = useState(new Date());

  return (
    <Grid container spacing={3}>
      {/* Chart */}
      <Grid item xs={12} md={8} lg={9}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 240,
          }}
        >
          차트
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              views={['day']}
              label="Just date"
              inputFormat="yyyy-MM-dd"
              value={value}
              onChange={newValue => {
                setValue(newValue);
              }}
              renderInput={params => (
                <TextField {...params} helperText={null} />
              )}
            />
          </LocalizationProvider>
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
          디포짓
        </Paper>
      </Grid>
      {/* Recent Orders */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          오더
        </Paper>
      </Grid>
    </Grid>
  );
}

export default DashboardContent;
