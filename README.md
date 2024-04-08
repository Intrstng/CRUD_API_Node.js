# CRUD API

Implementation of simple CRUD API using in-memory database underneath.

[Link to task](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/crud-api/assignment.md)

### Building and running on localhost:

First install dependencies (all commands run **FROM THE ROOT** of the app):

```sh
npm install
```
### NPM running commands

To start the app in a development mode:

```sh
npm run start:dev
```

To start the app in a production mode:

```sh
npm run start:prod
```

To start the multiple instances of the app using the Node.js Cluster API in **development** mode:

```sh
npm run start:multi
```


To start the multiple instances of the app using the Node.js Cluster API in **production** mode:

```sh
npm run start:multi:prod
```

To run tests:
```sh
npm run test
```
To run tests with additional detailed output during test execution:
```sh
npm run test:verbose
```

To run tests that detect and report all open handles after a test suite or test case completes:
```sh
npm run test:detectOpenHandle
```

To delete _dist/bundle.js_:

```sh
npm run clean
```

To delete _dist/multi/bundle.js_ (version with multiple instances of the app with load balancer):

```sh
npm run clean:multi
```

## Before running the tests, make sure that all previous runs of the application are closed, especially other tests that were run previously.

### To test 500 Internal Server Error you can uncomment code in **Controller.js** and send request manually (in Postman for example).
```
// // You can uncomment this code to test the handling of 500 Internal Server Error
// throw new Error('Test: you simulated error 500 Internal Server Error');
```

**Tests have 3 scenarios**

Coverage reports of code (coverage collection) you can find after running tests in:
```sh
./src/coverage/coverage-final.json
```

### Type of USER record for API requests (JSON)

```sh
{

"username": "Spike",

"age": 33,

"hobbies": ["seafaring", "hunting"]

}
```

- **id** — unique identifier (string, uuid) **will be generated on server side**
- **username** — user's name (string, **required**)
- **age** — user's age (number, **required**)
- **hobbies** — user's hobbies (array of strings or empty array, **required**)

### After starting the app you can send requests to CREATE/READ/UPDATE/DELETE USER records to these endpoints:

**GET** `api/users` is used to get **all** USER records

**GET** `api/users/{userId}`
Provide a valid user uuii ID that already exists in the database.
**POST** `api/users`
Use following type of body:

```sh
{

"username": "Spike",

"age": 33,

"hobbies": ["seafaring", "hunting"]

}
```

**PUT** `api/users/{userId}`
Provide a valid user uuii ID that already exists in the database.
Use following type of body:

```sh
{

"username": "Anna",

"age": 24,

"hobbies": ["cooking", "gardening", "dancing"]

}
```

**DELETE** `api/users/{userId}`
Provide a valid user uuii ID that already exists in the database.

### Error handling
Requests to non-existing endpoints (e.g. `some-non/existing/resource`) are processed (the server responds with a `404` status code and the corresponding `human-friendly message`).
Server-side errors that occur during request processing are handled correctly (the server responds with a `500` status code and an associated `human-friendly message`).

Server answers with status code `400` and corresponds message if `userId` is invalid (not `uuid`).

Server answers with status code `404` and corresponds message if record with `id === userId` doesn't exist.

Server answers with status code `400` and corresponds message if request body does not contain required fields.


### Horizontal scaling for application with a load balancer

Implemented horizontal scaling for application, to run it enter in cli `npm run start:multi` or `npm run start:multi:prod`. After it will start multiple instances of application using the Node.js Cluster API (equal to the number of available parallelism - 1 on the host machine, each listening on port PORT + n) with a load balancer that distributes requests across them (using Round-robin algorithm).

_For example: available parallelism is 4, PORT is 4000. On run `npm run start:multi` it works following way:_

- On `localhost:5000/api` load balancer is listening for requests
- On `localhost:5001/api`, `localhost:5002/api`, `localhost:5003/api` workers are listening for requests from load balancer
- When user sends request to `localhost:5000/api`, load balancer sends this request to `localhost:5001/api`, next user request is sent to `localhost:5002/api` and so on.
- After sending request to `localhost:5003/api` load balancer starts from the first worker again (sends request to `localhost:5001/api`)
- State of db is consistent between different workers, for example:
    * First **POST** request addressed to `localhost:5001/api` creates user.
    * Second **GET** request addressed to `localhost:5002/api` returns created user.
    * Third **DELETE** request addressed to `localhost:5003/api` deletes created user.
    * Fourth **GET** request addressed to `localhost:5001/api` returns `404` status code for created user.