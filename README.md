# reading-record-project

TypeScript, React와 Redux-saga로 구현한 독서 기록 사이트

> Fastcampus ByteDgree에서 진행한 프로젝트입니다.

<br/>

## ⚙ Stack

**TypeScript**

**React**

**Redux**

- redux-saga

<br/>

## 🖼 UI

![image](https://user-images.githubusercontent.com/70693728/111073634-cbd44300-8522-11eb-8387-20af634480e6.png)

- [Link](https://reading-record.netlify.app)
- [Problem & Solution 정리](https://heeyeonjeong.tistory.com/93?category=945817)

<br/>

## 📚 Features

- 책 추가 / 책 수정 / 책 삭제 / 책 목록 보기
- 로그인 / 로그아웃
- any 타입을 최대한 사용하지 않고, 정확한 타입 추론
- form 사용 시 uncontrolled component 방식 사용
- Container components와 Presentational components 분리하여 작성
- Ducks 패턴 사용

<br/>

## 내가 구현한 기능

- [ ] 로그인 / 로그아웃
- [x] 책 추가
- [x] 책 수정
- [x] 책 삭제
- [x] 책 목록 보기

<br/>

## 구조

- **Page**

  - Signin
  - Home
  - Add
  - Detail
  - Edit

<br/>

## ⏩ Redux-saga로 상태관리

```typescript
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

// 책 목록
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

// 책 추가
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

// 책 수정
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

//책 삭제
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
```
