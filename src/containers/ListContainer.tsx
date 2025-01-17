import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import List from '../components/List';
import { logout as logoutSaga } from '../redux/modules/auth';
import { getBooks as getBooksSaga } from '../redux/modules/books';
import { deleteBook as deleteBookSaga } from '../redux/modules/books';
import { push } from 'connected-react-router';
import { RootState } from '../redux/modules/rootReducer';
import { BookResType } from '../types';

const ListContainer: React.FC = () => {
  const dispatch = useDispatch();

  const books = useSelector<RootState, BookResType[] | null>(
    (state) => state.books.books,
  );
  const loading = useSelector<RootState, boolean>(
    (state) => state.books.loading,
  );
  const error = useSelector<RootState, Error | null>(
    (state) => state.books.error,
  );

  const goAdd = useCallback(() => {
    dispatch(push('/add'));
  }, [dispatch]);

  const goEdit = useCallback(
    (bookId) => {
      dispatch(push(`/edit/${bookId}`));
    },
    [dispatch],
  );

  const getBooks = useCallback(() => {
    dispatch(getBooksSaga());
  }, [dispatch]);

  const logout = useCallback(() => {
    dispatch(logoutSaga());
  }, [dispatch]);

  const deleteBook = useCallback(
    (bookId) => {
      dispatch(deleteBookSaga(bookId));
    },
    [dispatch],
  );

  if (error) return <div>error</div>;

  return (
    <List
      books={books}
      loading={loading}
      goAdd={goAdd}
      goEdit={goEdit}
      logout={logout}
      getBooks={getBooks}
      deleteBook={deleteBook}
    />
  );
};

export default ListContainer;
