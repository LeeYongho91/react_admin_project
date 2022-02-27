/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { auth } from '../_actions/user_actions';

export default function (SpecificComponent, option, adminRoute = null) {
  function AuthenticationCheck(props) {
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(async () => {
      // To know my current status, send Auth request
      const { payload } = await dispatch(auth());
      // Not Loggined in Status
      if (!payload.isAuth) {
        if (option) {
          navigate('/login');
        }
        // Loggined in Status
      } else if (adminRoute && !payload.isAdmin) {
        // supposed to be Admin page, but not admin person wants to go inside
        navigate('/');
      }
      // Logged in Status, but Try to go into log in page
      else if (option === false) {
        navigate('/');
      }
    }, []);

    return <SpecificComponent {...props} user={user} />;
  }
  return AuthenticationCheck;
}
