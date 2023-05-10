import post from '../models/post.js';
import user from '../models/user.js';

export const create = async (req, res) => {
  try {
    const auther = await user.findById({
      _id: req.userId,
    });

    const doc = new post({
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      user: req.userId,
      avatarUrl: auther.avatarUrl,
      comments: [],
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

export const addComment = async (req, res) => {
  try {
    const postId = req.body.id;
    const currentPost = await post.findById(postId);

    const newComment = { user: req.body.user, text: req.body.text };

    console.log(req.body);

    await post.updateOne(
      {
        _id: postId,
      },
      {
        comments: [...currentPost?.comments, newComment],
      }
    );

    return res.status(200).json({ message: 'ok' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
