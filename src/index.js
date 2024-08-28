import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import process from "process";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
  ApolloLink,
  Observable,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import "./index.css";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

//Set the authorization token to the request headers
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("library-user-token");
  return {
    headers: {
      ...headers,
      authorization: token ? `bearer ${token}` : null,
    },
  };
});
// Create an http link for the apollo server. The uri is different depending on the environment.
const httpUri =
  process.env.NODE_ENV === "production"
    ? "https://baback.onrender.com"
    : "http://localhost:4000/";
const httpLink = createHttpLink({
  uri: httpUri,
});

const wsUri =
  process.env.NODE_ENV === "production"
    ? "wss://baback.onrender.com"
    : "ws://localhost:4000/";
// Create a websocket link for the apollo server. The uri is different depending on the environment.
const wsLink = new GraphQLWsLink(
  createClient({
    url: wsUri,
  })
);

const errorLink = onError(({ graphQLErrors, networkError }) => {
  //Instatiate the custom error object
  let customError;
  if (graphQLErrors) {
    //Handle GraphQL query errors. e.g. wrong credentials
    customError = {
      ...graphQLErrors[0],
      code: graphQLErrors[0].extensions.code,
    };
    customError.name = "GraphQL error";
  }
  if (networkError) {
    //Handle network errors. e.g. no internet connection, server down.
    //Attach a custom error message to the network error for the end user.
    customError = {
      ...networkError,
      message: "a network error occurred. Please try again later.",
      code: "NETWORK_ERROR",
    };
    customError.name = "Network error";
  }
  //
  return new Observable((observer) => {
    observer.error(customError);
  });
});

const uploadLink = createUploadLink({
  uri: httpUri,
  headers: {
    "x-apollo-operation-name": "uploadBookImage",
    "apollo-require-preflight": "true",
  },
});
const httpAndUploadLink = ApolloLink.from([
  authLink,
  ApolloLink.split(
    // Split based on the operation type (subscription vs. query/mutation)
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wsLink, // Use the WebSocket link for subscriptions
    uploadLink // Use the upload link for file uploads
      .concat(httpLink) // Use the combined link for queries and mutations
  ),
]);

const client = new ApolloClient({
  link: ApolloLink.from([errorLink, httpAndUploadLink]),
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
