export interface BookReqType {
  title: string;
  author: string;
  message: string;
  url: string;
}

export interface BookResType {
  bookId: number;
  ownerId: string;
  title: string;
  message: string;
  author: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
}

export interface LoginReqType {
  email: string;
  password: string;
}

export interface LoginResType {
  token: string;
}
