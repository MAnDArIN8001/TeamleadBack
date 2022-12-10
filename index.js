import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import upload from './upload.js';
import cors from 'cors';

import {
  registrValidation,
  logInValidation,
  postCreateValidation,
} from './validations.js';

import checkAuth from './utils/checkAuth.js';

import * as UserController from './constrollers/UserConstroller.js';
import * as PostController from './constrollers/PostController.js';
import * as FriendController from './constrollers/FriendsController.js';

import handleValidationErrors from './utils/handleValidationErrors.js';

mongoose
  .connect(
    'mongodb+srv://admin:_Admin2358_@cluster0.4p5vl2f.mongodb.net/blog?retryWrites=true&w=majority'
  )
  .then(() => {
    console.log('db is ok');
  })
  .catch(err => {
    console.log('cant connect to db', err);
  });

const app = express();

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.post(
  '/auth/register',
  registrValidation,
  handleValidationErrors,
  UserController.register
);
app.post(
  '/auth/login',
  logInValidation,
  handleValidationErrors,
  UserController.logIn
);
app.post('/auth/logout', checkAuth, UserController.logOut);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(404).json({ message: 'connot get file' });
    }

    res.json(req.fileName);
  } catch (error) {
    return res.status(500).json({ message: 'something was wrong' });
  }
});

app.post('/photos/post', checkAuth, UserController.uploadPhoto);

app.post('/user/photo', checkAuth, UserController.changePhoto);
app.post('/users', checkAuth, FriendController.findByName);
app.get('/users/:id', UserController.getUser);

app.get('/friends', checkAuth, FriendController.getAllFriends);
app.post('/friends/add/:id', checkAuth, FriendController.addFriends);
app.delete('/friends/:id', checkAuth, FriendController.deleteFriend);

app.get('/post', PostController.getAll);
app.get('/post/:id', PostController.getOne);
app.post(
  '/post',
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.create
);
app.delete('/post/:id', checkAuth, PostController.remove);
app.patch(
  '/post/:id',
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update
);
app.get('/posts/:id', PostController.getAllWithId);

app.listen(4444, err => {
  if (err) {
    return console.log(err);
  }

  console.log('server is ok');
});
