import React from 'react';
import './Pagination.css';
import Pagination from 'react-js-pagination';

const Paging = props => {
  const handlePageChange = pageValue => {
    props.handlePageChange(pageValue);
  };
  return (
    <Pagination
      activePage={props.pageOneRefrech}
      itemsCountPerPage={props.limit}
      totalItemsCount={props.count}
      pageRangeDisplayed={5}
      prevPageText="‹"
      nextPageText="›"
      onChange={handlePageChange}
    />
  );
};
export default Paging;
