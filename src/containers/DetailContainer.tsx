import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Detail from '../components/Detail';
import { logout as logoutSaga } from '../redux/modules/auth';
import { getBooks as getBooksSaga } from '../redux/modules/books';
import { useParams } from 'react-router-dom';
import { RootState } from '../redux/modules/rootReducer';
import { BookResType } from '../types';
import { push } from 'connected-react-router';

const DetailContainer = () => {
  const dispatch = useDispatch();

  const books = useSelector<RootState, BookResType[] | null>(
    (state) => state.books.books,
  );

  const logout = useCallback(() => {
    dispatch(logoutSaga());
  }, [dispatch]);

  const { id }: any = useParams();

  const getBooks = useCallback(() => {
    dispatch(getBooksSaga());
  }, [dispatch]);

  const goEdit = useCallback(
    (bookId) => {
      dispatch(push(`/edit/${bookId}`));
    },
    [dispatch],
  );

  return (
    <Detail
      book={
        books === null
          ? null
          : books.find((book) => book.bookId === parseInt(id))
      }
      logout={logout}
      goEdit={goEdit}
      getBooks={getBooks}
    />
  );
};

export default DetailContainer;
