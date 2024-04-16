import { gql } from "@apollo/client";

const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    title
    published
    author {
      name
      born
      id
    }
    genres
    id
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
const BOOK_DELETED = gql`
  subscription {
    bookDeleted {
      title
      author {
        name
      }
      id
    }
  }
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
const ALL_BOOKS = gql`
  query ($genre: String, $author: String) {
    allBooks(genre: $genre, author: $author) {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`;
const GET_USER = gql`
  query {
    me {
      username
      favoriteGenre
    }
  }
`;
const CREATE_BOOK = gql`
  mutation (
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      title
      author {
        name
      }
      published
      genres
    }
  }
`;
const DELETE_BOOK = gql`
  mutation deleteBook($id: ID!) {
    deleteBook(id: $id) {
      title
      author {
        name
      }
      id
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
      name
      born
      bookCount
      id
    }
  }
`;
const LOGIN = gql`
  mutation ($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
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
  DELETE_BOOK,
  BOOK_DELETED,
};
