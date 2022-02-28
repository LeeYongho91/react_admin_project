import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import AccountCircle from '@mui/icons-material/AccountCircle';
import InputAdornment from '@mui/material/InputAdornment';
import { loadingToggleAction } from '../../../_actions/util_actions';
import { loginUser } from '../../../_actions/user_actions';

function LoginPage() {
  const dispatch = useDispatch();
  const [formErrorMessage, setFormErrorMessage] = useState('');
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email is invalid'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(12, 'Password must not exceed 12 characters'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  const onSubmit = async data => {
    try {
      const dataToSubmit = {
        email: data.email,
        password: data.password,
      };
      dispatch(loadingToggleAction(true));
      const res = await dispatch(loginUser(dataToSubmit));
      if (res.payload.loginSuccess) {
        dispatch(loadingToggleAction(false));
        navigate('/');
      } else {
        setFormErrorMessage('Check out your Account or Password again');
        dispatch(loadingToggleAction(false));
      }
    } catch (error) {
      console.log(error.response.data.message);
      setFormErrorMessage('Check out your Account or Password again');
      dispatch(loadingToggleAction(false));

      console.log(formErrorMessage);
    }
  };
  const handleKeyDown = event => {
    if (event.key === 'Enter') {
      handleSubmit(onSubmit);
    }
  };

  return (
    <div>
      <Box>
        <h4>로그인</h4>
        <Divider />
        <Paper sx={{ padding: 3 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <TextField
                required
                name="email"
                label="Email"
                className="login-email"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                margin="normal"
                style={{ width: '30%' }}
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
                // onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>
            <div>
              <TextField
                required
                name="password"
                label="Password"
                className="login-password"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                margin="normal"
                style={{ width: '30%' }}
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message}
                // onChange={handleChange}
                placeholder="Enter your password"
                type="password"
                onKeyDown={handleKeyDown}
              />
            </div>

            <Button
              color="primary"
              disabled={!isValid}
              variant="contained"
              size="large"
              type="submit"
            >
              로그인
            </Button>
          </form>
        </Paper>
      </Box>
    </div>
  );
}

export default LoginPage;
