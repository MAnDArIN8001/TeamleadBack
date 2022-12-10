import friend from '../models/friend.js';
import user from '../models/user.js';

export const addFriends = async (req, res) => {
  try {
    const userId = req.params.id;

    const friend = await user.findById(userId);
    const curentUser = await user.findById(req.userId);

    if (!friend || !curentUser) {
      return res.status(404).json({ message: 'not found' });
    }

    const { passwordHash, ...newFriend } = friend._doc;

    for (const key of curentUser.friends) {
      if (key.email === newFriend.email) {
        return res.status(400).json({ message: 'u already have this friend' });
      }
    }

    await user.updateOne(
      {
        _id: req.userId,
      },
      {
        friends: [newFriend, ...curentUser.friends],
      }
    );

    res.json(newFriend);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Cant find such user' });
  }
};

export const findByName = async (req, res) => {
  try {
    const users = await user.find({ fullName: req.body.fullName });

    res.json(users);
  } catch (error) {}
};

export const deleteFriend = (req, res) => {
  try {
    const friendId = req.params.id;

    friend.findOneAndDelete(
      {
        _id: friendId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: 'impossible to connect' });
        }

        if (!doc) {
          return res.status(404).json({ message: 'no such friends' });
        }

        res.json({ sucses: true });
      }
    );
  } catch (error) {}
};

export const getAllFriends = async (req, res) => {
  try {
    const curentUser = await user.findById(req.userId);

    if (!curentUser) {
      return res.status(500).json({ message: 'impossible to connect' });
    }

    res.json(curentUser.friends);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Cant find such user' });
  }
};
