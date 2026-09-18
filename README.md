# Rbay

Rbay is a small auction marketplace prototype built with SvelteKit, TypeScript, and Redis.

The project was created to practice using Redis data structures in a realistic application. It includes user authentication, server-side sessions, auction items, bidding, likes, item rankings, page caching, seed data, and an experimental background worker.

> This is a learning and prototype project. Some features are incomplete and should be improved before production use.

## Features

- User signup and signin
- Server-side session management
- Redis-backed authentication sessions
- Create auction items
- View auction item details
- Place bids on items
- Store bid history
- Like and unlike items
- Track item views
- Sort items by views and ending time
- Redis page caching for selected pages
- Seed data generation
- Svelte component-based frontend
- TypeScript support
- Experimental worker process for background jobs

## Technologies

- [SvelteKit](https://kit.svelte.dev/)
- [Svelte](https://svelte.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Node.js](https://nodejs.org/)
- [Redis](https://redis.io/)
- [Luxon](https://moment.github.io/luxon/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Keygrip](https://github.com/expressjs/keygrip)
- `scrypt` for password hashing
- Prettier for code formatting

## Architecture

The project uses SvelteKit for both the frontend and server-side route handlers.

```text
Browser
   |
   v
SvelteKit pages and route handlers
   |
   v
Middleware
   |
   +-- Session management
   +-- Error handling
   +-- Page caching
   |
   v
Service layer
   |
   +-- Authentication services
   +-- Redis query modules
   +-- Serialization/deserialization
   +-- Utility functions
   |
   v
Redis
   |
   +-- Users
   +-- Sessions
   +-- Auction items
   +-- Bid history
   +-- Likes
   +-- Sorted indexes
   +-- Cached pages
```

## Redis Data Model

Redis is used as the main data store.

The project uses several Redis data structures:

| Redis structure | Purpose |
|---|---|
| Hashes | Store users, sessions, and auction items |
| Sets | Store usernames and liked items |
| Sorted sets | Rank items by views and ending time |
| Lists | Store bid history |
| Strings | Store cached page HTML |

## Project Structure

```text
.
├── cli/                         # Command-line utilities
├── seeds/                       # Seed data and seed scripts
├── src/
│   ├── lib/
│   │   ├── components/          # Reusable Svelte components
│   │   └── util/                # Frontend utilities
│   ├── routes/                  # Svelte pages and server routes
│   │   ├── auth/                # Signup, signin, and signout
│   │   ├── dashboard/           # Authenticated dashboard pages
│   │   ├── items/               # Item listing, details, likes, and bids
│   │   └── users/               # User pages
│   ├── services/
│   │   ├── auth/                # Authentication logic
│   │   ├── middlewares/         # Session, cache, and error middleware
│   │   ├── queries/              # Redis data-access modules
│   │   ├── redis/               # Redis client and locking utilities
│   │   └── utils/               # Shared backend utilities
│   ├── hooks.ts                 # Application middleware setup
│   └── app.css                  # Global styles
├── worker/                      # Background worker experiments
├── static/                      # Static assets
├── package.json
├── svelte.config.js
├── tailwind.config.cjs
└── tsconfig.json
```

## Requirements

Before running the project, install:

- Node.js
- npm
- Redis

You can verify that Redis is running with:

```bash
redis-cli ping
```

The expected response is:

```text
PONG
```

## Installation

Clone the repository:

```bash
git clone https://github.com/abdellaziizz/Rbay.git
cd Rbay
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root:

```env
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PW=
COOKIE_KEY=replace-with-a-long-random-secret
```

Use a strong random value for `COOKIE_KEY` outside local development.

## Running the Project

Start the development server:

```bash
npm run dev
```

To start the server and open it in a browser:

```bash
npm run dev -- --open
```

The application is usually available at:

```text
http://localhost:3000
```

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the SvelteKit development server |
| `npm run build` | Build the application |
| `npm run preview` | Preview the production build |
| `npm run check` | Run Svelte and TypeScript checks |
| `npm run check:watch` | Run checks in watch mode |
| `npm run lint` | Check formatting with Prettier |
| `npm run format` | Format the project with Prettier |
| `npm run seed` | Generate and insert seed data |
| `npm run worker` | Start the experimental worker |
| `npm run cli` | Run CLI utilities |
| `npm run sandbox` | Run the sandbox script |

## Main Application Flows

### Authentication

Users can create an account and sign in through the authentication routes.

Authentication uses:

- Password hashing with Node.js `scrypt`
- Redis-backed sessions
- Signed session cookies using Keygrip

### Auction Items

Authenticated users can create auction items with:

- Name
- Description
- Image URL
- Duration
- Starting price
- Owner

Items are stored in Redis hashes and indexed using Redis sorted sets.

### Bidding

Users can place bids on active items.

The application checks:

- Whether the item exists
- Whether the bid is higher than the current price
- Whether the auction has ended

Bid history is stored in a Redis list.

### Likes

Users can like or unlike items. User likes are stored in Redis sets, which prevents duplicate likes from the same user.

### Caching

Selected static pages are cached in Redis to reduce repeated rendering work.

Currently cached pages include:

- `/about`
- `/privacy`
- `/auth/signin`
- `/auth/signup`

## Development Notes

This repository is primarily intended for learning and experimentation with Redis and SvelteKit.

Some areas still require additional implementation and hardening before production use:

- More complete request validation
- Consistent API response formats
- Better authorization checks
- More secure cookie configuration
- Rate limiting for authentication and bidding
- More robust Redis transactions or Lua scripts
- Complete search and filtering functionality
- More complete ranking functionality
- Automated tests
- Structured logging
- Production deployment configuration

## Security Considerations

For production usage, the following should be implemented or reviewed:

- Use a strong, mandatory cookie signing secret
- Set cookies as `HttpOnly`, `Secure`, and `SameSite`
- Validate all request bodies and query parameters
- Apply rate limiting to signup, signin, and bidding
- Avoid returning sensitive authentication details
- Add authorization checks for protected actions
- Use HTTPS
- Add security headers
- Validate and constrain auction duration and bid amounts
- Monitor Redis access and credentials
- Store secrets outside the repository

## Testing

Automated tests are not currently included in the project.

Important tests to add include:

- User signup and duplicate username handling
- Signin with valid and invalid credentials
- Session creation and persistence
- Auction item creation
- Invalid item input
- Bid validation
- Bidding after auction expiration
- Like and unlike behavior
- Redis serialization and deserialization
- Missing item and missing user responses

## Future Improvements

Planned or recommended improvements include:

- Add a complete test suite
- Add request validation with a schema-validation library
- Implement search and filtering
- Implement sorting by price and popularity
- Add pagination to item lists and bid history
- Add background processing for expired auctions
- Improve Redis transaction safety
- Add Docker and Docker Compose configuration
- Add GitHub Actions for checks and tests
- Add API documentation
- Add screenshots and a live demo
- Improve error responses and logging

## Portfolio Description

A concise description for a portfolio or CV:

> Built a Redis-backed auction marketplace prototype with SvelteKit and TypeScript. Implemented server-side sessions, password hashing, auction item management, bidding, likes, Redis hashes, sets, sorted sets, bid history lists, and page caching.

## License

No license has been specified yet.
