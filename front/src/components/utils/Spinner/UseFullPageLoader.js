import React, { useState } from 'react';
import Spinner from './Spinner';

const UseFullPageLoader = () => {
  const [loading, setLoading] = useState(false);

  return [
    loading ? <Spinner /> : null,
    () => setLoading(true), // Show loader
    () => setLoading(false), // Hide Loader
  ];
};

export default UseFullPageLoader;
