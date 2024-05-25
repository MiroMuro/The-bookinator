import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";

import { updateCache, updateAuthorCache } from "../App";
import { useMutation } from "@apollo/client";

import { CREATE_BOOK, ALL_BOOKS, ALL_AUTHORS, AUTHOR_UPDATED } from "./queries";
const NewBook = (props) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState("");
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);

  const { loading, error, data, subscribeToMore } = useQuery(ALL_AUTHORS, {
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
    return () => unsubscribe();
  }, [subscribeToMore]);

  //Mutation to add a new book
  const [addBook] = useMutation(CREATE_BOOK, {
    onError: (error) => {
      const messages = error.graphQLErrors.map((e) => e.message).join("\n");
      console.log(messages);
    },
    update: (cache, response) => {
      //Update the cache with the new book
      updateCache(cache, { query: { ALL_BOOKS } }, response.data.addBook);
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
    <div className="flex flex-col justify-end border-gray-200 border-2 basis-84">
      <form className="flex flex-col border-black border-2" onSubmit={submit}>
        <div className="flex justify-between border-b-2 border-gray-200 p-2 bg-red-200">
          Title
          <input
            id="title"
            className="relative border-gray-400 border-2 mx-2 "
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div className=" flex justify-between border-b-2 border-gray-200 p-2 bg-red-200">
          Author
          <input
            className="relative border-gray-400 border-2 mx-2 "
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div className=" flex justify-between border-b-2 border-gray-200 p-2 bg-red-200">
          Published
          <input
            className="relative border-gray-400 border-2 mx-2 "
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div className="flex justify-between border-b-2 border-gray-200 p-2 bg-red-200">
          <button
            className="rounded-lg border-solid border-2 border-black m-2 p-1 hover:bg-black hover:text-white hover:border-transparent transition ease-linear duration-200 scale-100 transform hover:scale-110"
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
        <div className="flex flex-col ml-3 items-center rounded-lg w-1/2 border-solid border-2 text-center border-black my-2 p-1 hover:bg-black hover:text-white hover:border-transparent transition ease-linear duration-500 scale-100 transform hover:scale-110">
          <button type="submit">Create book</button>
        </div>
      </form>
    </div>
  );
};

export default NewBook;
