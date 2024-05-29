import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useApolloClient } from "@apollo/client";

import { useMutation } from "@apollo/client";

import { CREATE_BOOK, ALL_AUTHORS, AUTHOR_UPDATED } from "./queries";
const NewBook = (props) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState("");
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);
  const [message, setMessage] = useState("Create new book");
  const { subscribeToMore } = useQuery(ALL_AUTHORS, {
    fetchPolicy: "cache-and-network",
  });
  //This is used to the listen for author updates and update the cache
  //for the authors correct bookCount after a book is added.
  useEffect(() => {
    const unsubscribe = subscribeToMore({
      //This is the subscription query
      document: AUTHOR_UPDATED,
      // The return values replaces the cache with the updated author.
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const updatedAuthor = subscriptionData.data.authorUpdated;

        return {
          allAuthors: prev.allAuthors.map((author) =>
            author.name === updatedAuthor.name ? updatedAuthor : author
          ),
        };
      },
    });

    return () => {
      unsubscribe();
      /*unsubscribeNewGenres();*/
    };
  }, [subscribeToMore]);

  //Mutation to add a new book
  const [addBook] = useMutation(CREATE_BOOK, {
    onError: (error) => {
      const messages = error.graphQLErrors.map((e) => e.message).join("\n");
      console.log(messages);
    },

    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  const submit = async (event) => {
    event.preventDefault();

    addBook({
      variables: { title, author, published: parseInt(published), genres },
    });

    setTitle("");
    setPublished("");
    setAuthor("");
    setGenres([]);
    setGenre("");
  };

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre("");
  };

  return (
    <div className="flex flex-col justify-end  basis-84">
      <h2 className="text-2xl font-bold">{message}</h2>
      <form
        className="flex flex-col border-gray-400 border-2 rounded-md overflow-hidden"
        onSubmit={submit}
      >
        <div className="flex justify-between border-b-2 border-gray-200 p-2 bg-red-200">
          Title
          <input
            minLength={2}
            required
            id="title"
            className="relative border-gray-400 border-2 mx-2 "
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div className=" flex justify-between border-b-2 border-gray-200 p-2 bg-red-200">
          Author
          <input
            minLength={4}
            required
            className="relative border-gray-400 border-2 mx-2 "
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div className=" flex justify-between border-b-2 border-gray-200 p-2 bg-red-200">
          Published
          <input
            required
            className="relative border-gray-400 border-2 mx-2 "
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div className="flex justify-between border-b-2 border-gray-200 p-2 bg-red-200">
          <button
            className="rounded-lg border-solid bg-white border-2 border-black my-2 p-1 hover:bg-black hover:text-white hover:border-transparent transition ease-linear duration-200 scale-100 transform hover:scale-110"
            onClick={addGenre}
            type="button"
          >
            Add genre
          </button>
          <input
            className="relative border-gray-400 border-2 mx-2 "
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
        </div>
        <div className=" border-b-2 border-gray-200 p-2 bg-red-200">
          <span>Genres: {genres.join(" ")}</span>
        </div>
        <div>
          <button
            className="flex flex-col ml-3 items-center rounded-lg w-1/2 border-solid border-2 text-center border-black my-2 p-1 hover:bg-black hover:text-white hover:border-transparent transition ease-linear duration-500 scale-100 transform hover:scale-110"
            type="submit"
          >
            Create book
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewBook;
