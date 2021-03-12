# User Service

The User Service provides a means of communication between the backend and Firestore via HTTP requests. It is intended to receive HTTP requests containing user data (_*validated for consistency*_) which is then persisted to Google's Firestore database.

## Info

There are several moving pieces to this micro-service which may deceptively seem confusing upon first glance. The steps from request to persistence are as follows:

1. Express is the 'conductor' of the microservice. It receives HTTP requests from users (_i.e._ the frontend) containing data regarding a Telescope user (_see:_ `src/models/user.js`).
2. This data is validated by [celebrate](https://www.npmjs.com/package/celebrate) (_see:_ `src/models/celebrateSchema.js`) to ensure consistent integrity.
3. Only when all data is accepted is a user object constructed (_see:_ `src/models/user.js`) and persisted to our db (_see:_ `src/routes/user.js`).

Since Firestore requires unique private API keys in order to work with the production (online) version of the database, the Firestore emulator has instead been configured and is ready for dev use. This ensures that code that passes tests locally will function as intended remotely. If (_when_) changes are required, simply create your change (and accompanying unit test), and run the test runner.

Our services contain a native version of the Firestore Emulator for use, but an native version can also be run (see Usage).

### About Firestore

Firestore is a NoSQL database for mobile, web, and server development from Firebase and Google Cloud. Firestore is comprised of collections (which hold documents) and documents (which hold NoSQL data).

More info can be found on the [Firebase documentation page](https://firebase.google.com/docs/firestore), or for the more visually inclined [on the youtube page](https://www.youtube.com/playlist?list=PLl-K7zZEsYLluG5MCVEzXAQ7ACZBCuZgZ).

## Requirements

\- Node.js - version 8.0 or higher.

\- Java - version 1.8 or higher (used with the Emulator.)

The Local Emulator Suite must be installed on your machine in order to run the Firestore emulator. Information on how to install it can be found [here](https://firebase.google.com/docs/emulator-suite/install_and_configure) (or via `npm install -g firebase-tools`).

## Install

from inside /api/src/user:

```
npm install
```

from root:

```
npm install:user-service
```

## Usage

```
# normal mode (to be fixed with final prod structure)
npm start

# running firestore emulator locally
npm run emu

# test runner (must be used in conjunction with emu)
npm run jest (or npm run test to run both)

# dev mode with automatic restarts
npm run dev
```

By default the server is running on http://localhost:6666/.

### Examples

Customized HTTP requests can be made with a tool like Postman:

1. `npm run emu`
2. `npm run dev`

or alternatively, by running the test runner (using testing data) instead:

1. `npm run test` (or `npm run emu, npm run dev, npm run jest`)

---

\- `GET /user/:id` - returns 200 with the user specified by the id, or 404 if a user does not exist.

\- `GET /users` - returns 200 with all Telescope users in an array, or 404 if the `users` collection is empty.

\- `POST /user` - returns 201 if a Telescope user was successfully validated and added to the db, or 400 if the user already exists. (_An example of the JSON data to send as the POST body can be found in `api/user/test/user.test.js`_)

\- `PUT /user/:id` - returns 200 if a Telescope user's data was successfully updated, or 400 if the user could not be found in the db. (_An example of the JSON data to send as the POST body can be found in `api/user/test/user.test.js`_)

\- `DELETE /user/:id` - returns 200 when the user is deleted, or 404 if a user to delete could not be found.

## Docker (section currently incomplete)

\- To build and tag: `docker build . -t telescope_img_svc:latest`

\- To run locally: `docker run -p 4444:4444 telescope_img_svc:latest`
