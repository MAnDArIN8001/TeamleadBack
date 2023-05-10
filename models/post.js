import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    comments: [{ user: mongoose.Schema.Types.ObjectId, text: String }],
    avatarUrl: String,
    imgUrl: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('post', PostSchema);
