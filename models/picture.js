import mongoose from 'mongoose';

const PictureShema = new mongoose.Schema(
  {
    pictureUrl: {
      type: String,
      required: true,
    },
    tags: {
      type: Array,
      default: [],
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
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('picture', PictureShema);
