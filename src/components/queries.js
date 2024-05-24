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
    genres
    id
  }
`;
const AUTHOR_DETAILS = gql`
  fragment AuthorDetails on Author {
    name
    born
    bookcount
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
const AUTHOR_UPDATED = gql`
  subscription {
    authorUpdated {
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
        born
        bookCount
      }
      published
      genres
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
};
