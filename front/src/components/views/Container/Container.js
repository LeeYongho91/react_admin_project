import React from 'react';
import { useSelector } from 'react-redux';
import ContainerChild from './ContainerChild';
import Spinner from '../../utils/Spinner/Spinner';

function Container({ children }) {
  const util = useSelector(state => state.util);

  return (
    <div className="container">
      <ContainerChild>{children}</ContainerChild>
      {util.showLoading && <Spinner />}
    </div>
  );
}

export default Container;
