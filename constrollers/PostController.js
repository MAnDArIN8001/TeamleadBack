import post from '../models/post.js';
import user from '../models/user.js';

export const create = async (req, res) => {
  try {
    const auther = await user.findById({
      _id: req.userId,
    });

    const doc = new post({
      text: req.body.text,
      tags: req.body.tags,
      imageUrl: req.body.imageUrl,
      user: req.userId,
      avatarUrl: auther.avatarUrl,
    });

    const newPost = await doc.save();

    res.json(newPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'impossible to connect' });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    post.findOneAndDelete(
      {
        _id: postId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: 'impossible to connect' });
        }

        if (!doc) {
          return res.status(404).json({ message: 'no such posts' });
        }

        res.json({ sucses: true });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'impossible to connect' });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await post.updateOne(
      {
        _id: postId,
      },
      {
        text: req.body.text,
        tags: req.body.tags,
        imageUrl: req.body.imageUrl,
        user: req.userId,
      }
    );

    res.json({ sucses: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'impossible to connect' });
  }
};

export const getAll = async (req, res) => {
  try {
    const posts = await post.find();

    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'impossible to connect' });
  }
};

export const getAllWithId = async (req, res) => {
  try {
    const userId = req.params.id;

    const userPosts = await post.find({ user: userId });

    if (!userPosts) {
      res.json({ message: 'no posts' });
    }

    res.json(userPosts);
  } catch (error) {
    console.log(error);
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    post.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
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
          return res.status(404).json({ message: 'no such posts' });
        }

        res.json(doc);
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'impossible to connect' });
  }
};
