import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Edit from '../components/Edit';

import { getBooks as getBooksSaga } from '../redux/modules/books';
import { logout as logoutSaga } from '../redux/modules/auth';
import { editBook as editBookSaga } from '../redux/modules/books';
import { RootState } from '../redux/modules/rootReducer';
import { BookResType } from '../types';
import { useParams } from 'react-router-dom';

const EditContainer = () => {
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

  const { id }: any = useParams();

  const logout = useCallback(() => {
    dispatch(logoutSaga());
  }, [dispatch]);

  const getBooks = useCallback(() => {
    dispatch(getBooksSaga());
  }, [dispatch]);

  // [project] saga 함수를 실행하는 액션 생성 함수를 실행하는 함수를 컨테이너에 작성했다.
  // [project] 컨테이너에서 useDispatch, useSelector, useCallback 을 활용해서 중복없이 비동기 데이터를 보여주도록 처리했다.
  // [project] Edit 나 Detail 컴포넌트에서 새로고침 시, 리스트가 없는 경우, 리스트를 받아오도록 처리했다.

  const editBook = useCallback(
    (bookId, { title, author, message, url }) => {
      dispatch(editBookSaga(bookId, { title, author, message, url }));
    },
    [dispatch],
  );

  if (error) return <div>error</div>;

  return (
    <Edit
      book={
        books === null
          ? null
          : books.find((book) => book.bookId === parseInt(id))
      }
      loading={loading}
      logout={logout}
      getBooks={getBooks}
      editBook={editBook}
    />
  );
};

export default EditContainer;
