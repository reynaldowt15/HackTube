# Social Media Mobile Application

A mobile social networking application built with React Native and Expo. Users can create accounts, publish posts, browse a feed, interact with posts through likes and comments, and follow other users.

The mobile client communicates with a GraphQL API. The backend uses MongoDB for persistent data and Redis to cache the posts feed.

## Features

- **User authentication** — Register and log in with email and password.
- **User profiles** — View user information, followers, and following relationships.
- **Social feed** — Retrieve posts with author information.
- **Create posts** — Publish text content with tags and an optional image URL.
- **Engagement** — Like posts and add comments.
- **Follow users** — Create a following relationship with another account.
- **GraphQL API** — Queries and mutations are defined with Apollo Server.
- **Feed caching** — Redis caches the posts query for 60 seconds and the cache is invalidated when post-related mutations occur.
- **Mobile navigation** — React Navigation provides the app's navigation structure.
- **Secure token storage integration** — The client uses Expo SecureStore for its authentication token.

## Tech Stack

| Layer          | Technologies              |
| -------------- | ------------------------- |
| Mobile         | React Native, Expo        |
| Navigation     | React Navigation          |
| API client     | Apollo Client, GraphQL    |
| Backend API    | Node.js, Apollo Server    |
| Database       | MongoDB                   |
| Cache          | Redis, ioredis            |
| Authentication | JSON Web Tokens, bcryptjs |
| Secure storage | Expo SecureStore          |

## Architecture

```text
React Native / Expo app
        |
        | GraphQL requests + Bearer JWT
        v
Apollo Server
        |
        +---- MongoDB (users, posts, follows)
        |
        +---- Redis (posts feed cache)
```

## Getting Started

### Prerequisites

- Node.js (Node.js 20 or later is required by the Apollo Server dependency)
- npm
- Expo Go or an Android/iOS development environment
- A MongoDB instance
- A Redis instance

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd <repository-directory>
```

### 2. Configure the backend

```bash
cd server
npm install
cp .env.example .env
```

Configure `server/.env`:

```dotenv
PORT=4000
MONGODB_URI=<your-mongodb-connection-string>
MONGODB_DATABASE=<your-mongodb-database>
JWT_SECRET=<your-strong-secret>
REDIS_URI=<your-redis-connection-string>
```

Start the GraphQL server:

```bash
node index.js
```

The server listens on the port specified by `PORT` and prints its GraphQL endpoint when ready.

### 3. Configure the mobile app

```bash
cd app
npm install
```

The Apollo Client endpoint is currently configured in `app/config/apollo.js`:

```js
const httpLink = new HttpLink({
  uri: "https://hacktube-api.reynaldowt15.id/",
});
```

Change this URI to your own deployed GraphQL endpoint, or to the reachable LAN address of your local development server. A physical device generally cannot access the computer's backend through `localhost`.

Start Expo:

```bash
npx expo start
```

Then open the project with Expo Go or a configured simulator/emulator.

## GraphQL API Overview

The schema is organized into user, post, and follow modules under `server/schemas/`.

### Queries

| Query                          | Purpose                                   |
| ------------------------------ | ----------------------------------------- |
| `posts`                        | Retrieve posts with author details        |
| `postById(postId)`             | Retrieve a post by its ID                 |
| `users`                        | Retrieve users                            |
| `userByUsernameOrName(search)` | Search users by name or username          |
| `userById`                     | Retrieve the authenticated user's profile |

### Mutations

| Mutation                         | Purpose                       |
| -------------------------------- | ----------------------------- |
| `register(...)`                  | Create a user account         |
| `login(email, password)`         | Authenticate and return a JWT |
| `addPost(content, tags, imgUrl)` | Publish a post                |
| `addComment(postId, content)`    | Add a comment to a post       |
| `addLike(postId)`                | Like a post                   |
| `followAccount(idFollowing)`     | Follow another user           |

Most queries and post/follow mutations require a valid bearer token. Registration and login are used to obtain the token.

## Project Structure

```text
.
├── app/
│   ├── components/
│   ├── config/
│   ├── context/
│   ├── navigations/
│   ├── screens/
│   ├── styles/
│   └── utils/
└── server/
    ├── config/
    ├── models/
    ├── schemas/
    └── index.js
```
