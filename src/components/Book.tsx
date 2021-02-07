import React from 'react';

import styles from './Book.module.css';
import { BookResType } from '../types';
import { Link } from 'react-router-dom';
import moment from 'moment';

interface BookProps extends BookResType {
  bookId: number;
  title: string;
  message: string;
  author: string;
  url: string;
  createdAt: Date;
  deleteBook: (bookId: number) => void;
  goEdit: (bookId: number) => void;
}

// [project] 컨테이너에 작성된 함수를 컴포넌트에서 이용했다.
// [project] BookResType 의 응답 값을 이용하여, Book 컴포넌트를 완성했다.
const Book: React.FC<BookProps> = ({
  bookId,
  title,
  author,
  createdAt,
  url,
  deleteBook,
  goEdit,
}) => {
  return (
    <>
      <div className={styles.book}>
        <div className={styles.title}>
          <Link to={`/book/${bookId}`} className={styles.link_detail_title}>
            {title}
          </Link>
        </div>
        <div className={styles.author}>
          <Link to={`/book/${bookId}`} className={styles.link_detail_author}>
            {author}
          </Link>
        </div>
        <div className={styles.created}>
          {moment(createdAt).format('YYYY-MM-DD HH:mm:ss')}
        </div>
        <div className={styles.tooltips}>
          <Link to={url || '/'} target="_blank" className={styles.link_url}>
            <button type="button" className={styles.button_url}>
              주소
            </button>
          </Link>
          <button
            type="button"
            className={styles.button_edit}
            onClick={() => goEdit(bookId)}
          >
            수정
          </button>
          <button type="button" onClick={() => deleteBook(bookId)}>
            삭제
          </button>
        </div>
      </div>
    </>
  );
};

export default Book;
