import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
  split,
  ApolloLink,
  Observable,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import "./index.css";

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
  console.log(
    "OLEN TÄÄLLÄ ERROR LINKISSÄ, TÄSSÄ GRAPHQL ERRORIT",
    graphQLErrors
  );
  console.log(
    "OLEN TÄÄLLÄ ERROR LINKISSÄ, TÄSSÄ NETWORK ERRORIT",
    networkError
  );
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
const splitLink = split(
  // * A function that's called for each operation to execute
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  // * The Link to use for an operation if the function returns a "truthy" value. (eg. subscription)
  wsLink,
  // * The Link to use for an operation if the function returns a "falsy" value. (eg. query or mutation)
  authLink.concat(httpLink)
);

const client = new ApolloClient({
  link: ApolloLink.from([errorLink, splitLink]),
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
