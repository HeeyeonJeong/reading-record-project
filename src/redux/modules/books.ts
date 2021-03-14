import { BookReqType, BookResType } from '../../types';
import { createActions, handleActions } from 'redux-actions';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import BookService from '../../services/BookService';
import { AnyAction } from 'redux';
import { getBooksFromState } from '../utils';
import { getTokenFromState } from '../utils';
import { push } from 'connected-react-router';

export interface BooksState {
  books: BookResType[] | null;
  loading: boolean;
  error: Error | null;
}

const initialState: BooksState = {
  books: null,
  loading: false,
  error: null,
};

const options = {
  prefix: 'my-books/books',
};

export const { success, pending, fail } = createActions(
  {
    SUCCESS: (books: BookResType[]) => ({ books }),
  },
  'PENDING',
  'FAIL',
  options,
);

const reducer = handleActions<BooksState, any>(
  {
    PENDING: (state) => ({
      ...state,
      loading: true,
      error: null,
    }),
    SUCCESS: (state, action) => ({
      books: action.payload.books,
      loading: false,
      error: null,
    }),
    FAIL: (state, action) => ({
      ...state,
      loading: false,
      error: action.payload,
    }),
  },
  initialState,
  options,
);

export default reducer;

export const { addBook, editBook, deleteBook, getBooks } = createActions(
  {
    ADD_BOOK: (book: BookReqType) => ({
      book,
    }),
    EDIT_BOOK: (bookId: number, book: BookReqType) => ({
      bookId,
      book,
    }),
    DELETE_BOOK: (bookId: number) => ({ bookId }),
  },
  'GET_BOOKS',
  options,
);

export function* sagas() {
  yield takeEvery(`${options.prefix}/GET_BOOKS`, getBooksSaga);
  yield takeEvery(`${options.prefix}/ADD_BOOK`, addBookSaga);
  yield takeEvery(`${options.prefix}/EDIT_BOOK`, editBookSaga);
  yield takeEvery(`${options.prefix}/DELETE_BOOK`, deleteBookSaga);
}

function* getBooksSaga() {
  try {
    yield put(pending());
    const token: string = yield select(getTokenFromState);
    const books: BookResType[] = yield call(BookService.getBooks, token);
    yield put(success(books));
  } catch (e) {
    yield put(fail(new Error(e?.response?.data?.error || 'UNKNOWN_ERROR')));
  }
}

interface addBookSagaAction extends AnyAction {
  payload: {
    book: BookReqType;
  };
}

function* addBookSaga(action: addBookSagaAction) {
  try {
    yield put(pending());
    const token: string = yield select(getTokenFromState);
    const book = action.payload.book;
    const bookData = yield call(BookService.addBook, token, book);
    const books: BookResType[] = yield select(getBooksFromState);
    yield put(success(books.concat(bookData)));
    yield put(push('/'));
  } catch (e) {
    yield put(fail(new Error(e?.response?.data?.error || 'UNKNOWN_ERROR')));
  }
}

interface editBookSagaAction extends AnyAction {
  payload: {
    bookId: number;
    book: BookReqType;
  };
}

function* editBookSaga(action: editBookSagaAction) {
  try {
    yield put(pending());
    const token: string = yield select(getTokenFromState);
    const bookId = action.payload.bookId;
    const book = action.payload.book;
    const bookData = yield call(BookService.editBook, token, bookId, book);
    const books: BookResType[] = yield select(getBooksFromState);
    yield put(
      success(
        books.map((book) =>
          book.bookId === bookData.bookId ? bookData : book,
        ),
      ),
    );
    yield put(push('/'));
  } catch (e) {
    yield put(fail(new Error(e?.response?.data?.error || 'UNKNOWN_ERROR')));
  }
}

interface delteBookSagaAction extends AnyAction {
  payload: {
    bookId: number;
  };
}

function* deleteBookSaga(action: delteBookSagaAction) {
  try {
    yield put(pending());
    const token: string = yield select(getTokenFromState);
    const bookId = action.payload.bookId;
    yield call(BookService.deleteBook, token, bookId);
    const books: BookResType[] = yield select(getBooksFromState);
    yield put(
      success(books.filter((book) => book.bookId !== action.payload.bookId)),
    );
  } catch (e) {
    yield put(fail(new Error(e?.response?.data?.error || 'UNKNOWN_ERROR')));
  }
}
