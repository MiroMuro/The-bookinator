import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import Authors from "../components/Authors";
test("renders the Authors component", async () => {
  render(
    <ApolloProvider>
      <Authors />
    </ApolloProvider>
  );
  expect(screen.getByText("Authors")).toBeInTheDocument();
});
