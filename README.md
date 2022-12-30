<h1 align="center">A User Management Program</h1>

## Prerequisites

- [mongoose](#mongoose)
- [MongoDB](#mongodb)
- [Express](#express)
- [JWT](#jwt)
- [bcrypt](#bcrypt)
- [CORS](#cors)

## mongoose

***Mongoose*** provides these ***functions***：

- ***Connect*** with MongoDB and monitor the connection status.
- ***Create*** the ***Schem***a & ***Model*** of MongoDB collection.
- ***Provide*** related functions for ***CRUD*** operations

## MongoDB

MongoDB is an open-source document database that uses a flexible schema for storing data. We use it to perform ***CRUD*** operations with mongoose in Node.js applications.

## Express

***Express*** is mainly responsible for：

- Handle with web requests and responses.
- Handle with Web APIs Routing.
- Execute various middleware functions.

## JWT

The 「package：***jsonwebtoken***」 is mainly responsible for：

- Generate a JWT
  - Use the sign() method to generate a JWT.

- Verify a JWT
  - Use the verify() method to complete Token verification and return the decoded Payload.

## bcrypt

The 「package：***bcrypt***」 is mainly responsible for：

- Encrypt the user password
  - Use the hash() method to encrypt the user password.

- Check the user password
  - Use the compare() method to check if the password entered by the user is the same as the password stored in MongoDB.

## CORS

CORS provides a ***Express middleware*** that can be used to enable ***CORS*** with various options for cross domain web applications.
