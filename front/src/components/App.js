/* eslint-disable no-shadow */
import { Route, Routes } from 'react-router-dom';
import React, { Suspense } from 'react';
import Container from './views/Container/Container';
import Dashboard from './views/DashBoard/DashBoard';
import Payment from './views/PaymentPage/Payment';
import UserListPage from './views/UserPage/UserListPage';
import ProductListPage from './views/ProductPage/ProductListPage';
import ProductRegisterPage from './views/ProductPage/ProductRegisterPage';
import UserRegisterPage from './views/UserPage/UserRegisterPage';
import LoginPage from './views/LoginPage/LoginPage';
import Auth from '../hoc/auth';

import './utils/fontawesome';

function App() {
  // null   Anyone Can go inside
  // true   only logged in user can go inside
  // false  logged in user can't go inside

  const AuthDashboardPage = Auth(Dashboard, null);
  const AuthLoginPage = Auth(LoginPage, false);
  const AuthPaymentPage = Auth(Payment, true);
  const AuthUserListPage = Auth(UserListPage, true);
  const AuthUserRegisterPage = Auth(UserRegisterPage, true);
  const AuthProductListPage = Auth(ProductListPage, true);
  const AuthProductRegisterPage = Auth(ProductRegisterPage, true);

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Container>
          <Routes>
            <Route path="/" element={<AuthDashboardPage />} />
            <Route path="/payment" element={<AuthPaymentPage />} />
            <Route path="/user/list" element={<AuthUserListPage />} />
            <Route path="/user/register" element={<AuthUserRegisterPage />} />
            <Route path="/product/list" element={<AuthProductListPage />} />
            <Route
              path="/product/register"
              element={<AuthProductRegisterPage />}
            />
            <Route path="/login" element={<AuthLoginPage />} />
          </Routes>
        </Container>
      </Suspense>
    </>
  );
}

export default App;
