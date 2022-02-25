/* eslint-disable no-shadow */
import { Route, Routes } from 'react-router-dom';
import React, { Suspense } from 'react';
import Container from './views/Container/Container';
import Dashboard from './views/DashBoard/DashBoard';
import Payment from './views/PaymentPage/Payment';
import UserListPage from './views/UserPage/UserListPage';
import ProductListPage from './views/ProductPage/ProductListPage';

function App() {
  // null   Anyone Can go inside
  // true   only logged in user can go inside
  // false  logged in user can't go inside

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Container>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/user/list" element={<UserListPage />} />
            <Route path="/product/list" element={<ProductListPage />} />
          </Routes>
        </Container>
      </Suspense>
    </>
  );
}

export default App;
