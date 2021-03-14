import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Add from '../components/Add';
import { logout as logoutSaga } from '../redux/modules/auth';
import { getBooks as getBooksSaga } from '../redux/modules/books';
import { addBook as addBookSaga } from '../redux/modules/books';
import { RootState } from '../redux/modules/rootReducer';

const AddContainer = () => {
  const dispatch = useDispatch();
  const logout = useCallback(() => {
    dispatch(logoutSaga());
  }, [dispatch]);

  const getBooks = useCallback(() => {
    dispatch(getBooksSaga());
  }, [dispatch]);
  const loading = useSelector<RootState, boolean>(
    (state) => state.books.loading,
  );
  const error = useSelector<RootState, Error | null>(
    (state) => state.books.error,
  );

  const addBook = useCallback(
    (book) => {
      dispatch(addBookSaga(book));
    },
    [dispatch],
  );

  if (error) return <div>error</div>;

  return (
    <Add
      loading={loading}
      logout={logout}
      addBook={addBook}
      getBooks={getBooks}
    />
  );
};

export default AddContainer;
