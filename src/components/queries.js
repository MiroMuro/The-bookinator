import { gql } from "@apollo/client";

const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    title
    published
    author {
      name
      born
      id
      bookCount
    }
    description
    genres
    id
  }
`;
const AUTHOR_DETAILS = gql`
  fragment AuthorDetails on Author {
    name
    born
    bookCount
    id
    description
  }
`;
const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`;
const AUTHOR_UPDATED = gql`
  subscription {
    authorUpdated {
      ...AuthorDetails
    }
  }
  ${AUTHOR_DETAILS}
`;

const AUTHOR_ADDED = gql`
  subscription {
    authorAdded {
      ...AuthorDetails
    }
  }
  ${AUTHOR_DETAILS}
`;

const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
      id
    }
  }
`;
const GET_SINGLE_BOOK = gql`
  query ($bookId: String!) {
    getBookById(bookId: $bookId) {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`;

const GET_SINGLE_AUTHOR = gql`
  query ($authorId: String!) {
    getAuthorById(authorId: $authorId) {
      ...AuthorDetails
    }
  }
  ${AUTHOR_DETAILS}
`;
const ALL_BOOKS = gql`
  query ($genre: String, $author: String) {
    allBooks(genre: $genre, author: $author) {
      title
      published
      author {
        name
        born
        id
      }
      description
      genres
      id
    }
  }
`;
const GET_USER = gql`
  query {
    me {
      username
      favoriteGenre
    }
  }
`;
const GET_BOOK_IMAGE = gql`
  query ($bookId: ID!) {
    getBookImage(bookId: $bookId)
  }
`;
const GET_AUTHOR_IMAGE = gql`
  query ($authorId: ID!) {
    getAuthorImage(authorId: $authorId)
  }
`;
const CREATE_BOOK = gql`
  mutation (
    $title: String!
    $author: String!
    $published: Int!
    $description: String
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      description: $description
      genres: $genres
    ) {
      id
      title
      author {
        name
        born
        bookCount
      }
      published
      description
      genres
    }
  }
`;

const CREATE_AUTHOR = gql`
  mutation ($name: String!, $born: Int, $description: String) {
    addAuthor(name: $name, born: $born, description: $description) {
      name
      born
      bookCount
      id
      description
    }
  }
`;
const ALL_GENRES = gql`
  query {
    allGenres
  }
`;
const UPDATE_AUTHOR = gql`
  mutation ($name: String!, $born: Int!) {
    editAuthor(name: $name, setBornTo: $born) {
      id
      name
      born
      bookCount
    }
  }
`;
const UPLOAD_BOOK_IMAGE = gql`
  mutation ($file: Upload!, $bookId: ID!) {
    uploadBookImage(file: $file, bookId: $bookId) {
      id
      imageId
    }
  }
`;
const UPLOAD_AUTHOR_IMAGE = gql`
  mutation ($file: Upload!, $authorId: ID!){
    uploadAuthorImage(file: $file, authorId: $authorId){
      id
      imageId
  }
`;
const LOGIN = gql`
  mutation ($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;
const REGISTER = gql`
  mutation ($username: String!, $password: String!, $favoriteGenre: String!) {
    createUser(
      username: $username
      password: $password
      favoriteGenre: $favoriteGenre
    ) {
      username
      favoriteGenre
    }
  }
`;
export {
  ALL_AUTHORS,
  ALL_BOOKS,
  CREATE_BOOK,
  UPDATE_AUTHOR,
  LOGIN,
  ALL_GENRES,
  GET_USER,
  BOOK_ADDED,
  REGISTER,
  AUTHOR_UPDATED,
  UPLOAD_BOOK_IMAGE,
  UPLOAD_AUTHOR_IMAGE,
  GET_BOOK_IMAGE,
  GET_AUTHOR_IMAGE,
  AUTHOR_ADDED,
  CREATE_AUTHOR,
  GET_SINGLE_BOOK,
  GET_SINGLE_AUTHOR,
};
