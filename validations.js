import { body } from 'express-validator';

export const logInValidation = [
  body('email', 'Incorrect mail format').isEmail(),
  body('password', 'Min password length is 5').isLength({ min: 5 }),
];

export const registrValidation = [
  body('email', 'Enter correct mail').isEmail(),
  body('password', 'Min password length is 5').isLength({ min: 5 }),
  body('fullName', 'Incorrect format').isLength({ min: 1 }),
  body('imgUrl').optional().isURL(),
];

export const postCreateValidation = [
  body('text', 'Enter post text').isLength({ min: 3 }).isString(),
  body('tags', 'Incorrect format').optional().isArray(),
  body('imgUrl').optional().isURL(),
];
