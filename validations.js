import { body } from 'express-validator';

export const logInValidation = [
  body('email', 'incorrect mail format').isEmail(),
  body('password', 'min password length is 5 symbols').isLength({ min: 5 }),
];

export const registrValidation = [
  body('email', 'enter correct mail').isEmail(),
  body('password', 'enter strong password').isLength({ min: 6 }),
  body('fullName', 'incorrect format').isLength({ min: 1 }),
  body('imgUrl').optional().isURL(),
];

export const postCreateValidation = [
  body('text', 'enter post text').isLength({ min: 3 }).isString(),
  body('tags', 'incorrect format').optional().isArray(),
  body('imgUrl').optional().isURL(),
];
