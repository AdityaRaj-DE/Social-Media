import mongoose, { Schema, models } from "mongoose";

const PostSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
    },
    imageUrl: {
      type: String, // Cloudinary / URL later
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Post = models.Post || mongoose.model("Post", PostSchema);
export default Post;
