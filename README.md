
# Book-App frontend

Front end for a React web-app made by me. My main motivation for creating this was to learn Tailwind and graphQL. <br/> 
This app has authentication. An authenticated user has more access to the app than an unauthenticated one. Below are the possible actions of both <br/>

UNAUTHENTICATED
- Browse and filter Books by genre
- Browse and search authors
- Register for the application

AUTHENTICATED 
- ... Same as unauthenticated
- Add books
- Add authors (while creating books)
- Modify author birthyear
- Login
- Logout






## Technologies used
Code quality
- Prettier
- ESLint
App logic
- React and JavaScript
- React router
- Apollo client for state management with GraphQL
Data fetching
- GraphQL
Visuals
- Tailwind
Testing
- Jest


## Layout structure of the app
The application is initialized in index.js which wraps App.js in the ApolloClient. App.js handle the routing and organization of the components.

```bash
.
└── BAfront/
    ├── src/
    │   ├── components/
    │   │   ├── AuthorFilter.jsx
    │   │   ├── Authors.js
    │   │   ├── BirthyearForm.jsx
    │   │   ├── Books.js
    │   │   ├── Genres.jsx
    │   │   ├── GenresDropdown.jsx
    │   │   ├── LoginForm.jsx
    │   │   ├── NewBooks.jsx
    │   │   ├── Recommendations.jsx
    │   │   ├── Registerform.jsx
    │   │   └── queries.js
    │   ├── static/images
    │   ├── App.js
    │   ├── index.css
    │   ├── index.js
    │   └── output.css
    ├── .gitignore
    ├── README.md
    ├── package-lock.json
    ├── package.json
    └── tailwind.config.js
```
## Book-App backend
For running this app (frontend + backend) completely locally follow this link and setup the backend for this project: https://github.com/MiroMuro/BABack 

## Run this frontend Locally

Clone the project

```bash
  git clone https://github.com/MiroMuro/BAfront.git
```

Go to the project directory

```bash
  cd BAfront
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

By default starts the development server at port 3000, and this will appear in the console.
```bash
Compiled successfully!

You can now view frontend in the browser.        

http://localhost:3000
```
The page will reload if you make edits.
Refer to this link if you wish to change the default port: https://tech.amikelive.com/node-830/reactjs-changing-default-port-3000-in-create-react-app/ 

## GraphQL API Reference

You can find all the Queries, Subscriptions, Mutations and Fragments in src/queries.js Knowledge of GraphQL is required to interpret them. <br/> Further info about the API can be found in README.md of the backend over here: https://github.com/MiroMuro/BABack


## Example usage

Below is an demo-video of using the app. You can register yourself in the app and play around.




## TO-DO
A list of features that will ship out later
- Custom book images
- Own profile page
- Single book page
- Single book deletion
- Book ratings
