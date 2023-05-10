import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import User from '../models/user.js';
import Picture from '../models/picture.js';

export const register = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new User({
      email: req.body.email,
      fullName: req.body.fullName,
      passwordHash: hash,
      avatarUrl: '',
      friends: [],
      isAuth: false,
    });

    const newUser = await doc.save();

    const token = jwt.sign(
      {
        _id: User._id,
      },
      'secret123',
      {
        expiresIn: '60d',
      }
    );

    const { passwordHash, ...userDate } = newUser._doc;

    res.json({
      ...userDate,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'impossible to connect' });
  }
};

export const logIn = async (req, res) => {
  try {
    const isUser = await User.findOne({ email: req.body.email });

    if (!isUser) {
      return res.status(404).json({
        message: 'wrong mail or password!',
      });
    }

    const isValidPassword = await bcrypt.compare(
      req.body.password,
      isUser._doc.passwordHash
    );

    if (!isValidPassword) {
      return res.status(404).json({
        message: 'wrong mail or password',
      });
    }

    const token = jwt.sign(
      {
        _id: isUser._id,
      },
      'secret123',
      {
        expiresIn: '30d',
      }
    );

    const currentUser = User.findOneAndUpdate(
      {
        email: isUser.email,
      },
      {
        $set: { isAuth: true },
      },
      {
        returnDocument: 'after',
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: 'impossible to connect' });
        }

        if (!doc) {
          console.log(err);
          return res.status(404).json({ message: 'no such user' });
        }

        const { passwordHash, ...userDate } = doc._doc;

        res.json({
          ...userDate,
          token,
        });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'impossible to connect' });
  }
};

export const logOut = async (req, res) => {
  try {
    console.log(req.body, 'yes');
    await User.updateOne({ _id: req.userId }, { isAuth: false });

    req.userId = null;

    res.json({ status: 'ok' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'impossible to connect' });
  }
};

export const getMe = async (req, res) => {
  try {
    const isUser = await User.findById(req.userId);

    if (!isUser) {
      return res.status(404).json({ message: 'no such user!' });
    }

    const { passwordHash, ...userDate } = isUser._doc;

    res.json({
      ...userDate,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'impossible to connect' });
  }
};

export const getUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: 'not found' });
    }

    res.json(user);
  } catch (error) {
    return res.status(500).json({ message: 'server error' });
  }
};

export const changePhoto = async (req, res) => {
  try {
    User.findOneAndUpdate(
      {
        _id: req.body.id,
      },
      {
        avatarUrl: req.body.avatarUrl,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: 'impossible to connect' });
        }

        if (!doc) {
          return res.status(404).json({ message: 'no such posts' });
        }

        res.json({
          ...doc._doc,
          token: (req.headers.authorization || '').replace(/Bearer\s?/, ''),
        });
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'server ' });
  }
};

export const uploadPhoto = async (req, res) => {
  try {
    const tags = req.body.tags;

    const curentUser = await User.findById({ _id: req.userId });

    const { _id } = curentUser;

    const doc = new Picture({
      pictureUrl: req.fileName,
      tags: tags,
      viewsCount: 0,
      user: _id,
    });

    const newPicture = doc.save();

    res.json({ sucses: true });
  } catch (error) {
    res.status(404).json({ message: 'something was wrong' });
  }
};

export const getPhoto = async (req, res) => {
  try {
    const id = req.params.id;

    const { avatarUrl } = await User.findById({ _id: id });

    res.status(200).json(avatarUrl);
  } catch (error) {
    res.status(404).json({ message: 'something was wrong' });
  }
};
