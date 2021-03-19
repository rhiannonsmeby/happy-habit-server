const express = require('express');
const { requireAuth } = require('../middleware/jwt-auth');
const path = require('path');
const UsersService = require('./users-service');

const usersRouter = express.Router();
const jsonBodyParser = express.json();

usersRouter
    .route('/')
    .post(jsonBodyParser, (req, res, next) => {
        const { password, user_name } = req.body;

  //validate required fields

  for (const field of [
    'user_name',
    'password',
  ]) {
    if (!req.body[field]) {
      return res
        .status(400)
        .json({ error: { message: `Missing '${field}' in request body` } });
    }
  }

  //validate password

  const passwordError = UsersService.validatePassword(password);
  if (passwordError) {
    return res.status(400).json({ error: { message: passwordError } });
  }

  //validate username not already in db
  UsersService.hasUserWithUsername(req.app.get('db'), user_name)
    .then((hasUserName) => {
      if (hasUserName) {
        return res.status(400).json({
          error: {
            message: 'Username already taken',
          },
        });
      }

      //if all pass, hash pass and insert user
      return UsersService.hashPassword(password).then((hashPass) => {
        const newUser = {
          password: hashPass,
          user_name,
        };
        return UsersService.insertUser(req.app.get('db'), newUser).then(
          (user) => {
            return res
              .status(201)
              .location(path.posix.join(req.originalUrl, `/${user.id}`))
              .json(UsersService.serializeUser(user));
          }
        );
      });
    })
    .catch(next);
});

module.exports = usersRouter;