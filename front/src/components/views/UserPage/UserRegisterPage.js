import React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import moment from 'moment';
import Button from '@mui/material/Button';
import { loadingToggleAction } from '../../../_actions/util_actions';
import { registerUser } from '../../../_actions/user_actions';

function UserRegisterPage() {
  const dispatch = useDispatch();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required('이메일은 필수입니다.')
      .email('이메일 양식을 확인해주세요.'),
    password: Yup.string()
      .required('비밀번호는 필수입니다.')
      .matches(
        /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,12}$/,
        '비밀번호는 8 ~ 12자 이며, 숫자/영문/특수문자를 모두 포함해야 합니다.',
      ),
    name: Yup.string().required('이름은 필수입니다,'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], '비밀번호가 다릅니다.')
      .required('비밀번호 확인은 필수입니다.'),
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
        name: data.name,
        password: data.password,
        image: `http://gravatar.com/avatar/${moment().unix()}?d=identicon`,
      };
      dispatch(loadingToggleAction(true));
      const res = await dispatch(registerUser(dataToSubmit));
      if (res.payload.success) {
        dispatch(loadingToggleAction(false));
        alert('등록이 완료되었습니다.');
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <Box>
        <h4>유저등록</h4>
        <Divider />
        <Paper sx={{ padding: 3 }}>
          <div>
            <TextField
              id="email"
              label="Email"
              variant="outlined"
              margin="normal"
              required
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
              style={{ width: '30%' }}
            />
          </div>

          <div>
            <TextField
              id="name"
              label="Name"
              variant="outlined"
              margin="normal"
              required
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
              style={{ width: '30%' }}
            />
          </div>

          <div>
            <TextField
              id="password"
              label="Password"
              variant="outlined"
              margin="normal"
              type="password"
              required
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
              style={{ width: '30%' }}
            />
          </div>

          <div>
            <TextField
              id="confirmPassword"
              label="Password Confirm"
              variant="outlined"
              margin="normal"
              type="password"
              required
              {...register('confirmPassword')}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              style={{ width: '30%' }}
            />
          </div>
          <Button
            color="primary"
            variant="contained"
            disabled={!isValid}
            size="large"
            onClick={handleSubmit(onSubmit)}
          >
            등록
          </Button>
        </Paper>
      </Box>
    </div>
  );
}

export default UserRegisterPage;
