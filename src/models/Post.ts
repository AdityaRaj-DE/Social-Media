import mongoose, { Schema, Types } from "mongoose";

const commentSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const postSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: String,
    imageUrl: String,
    likes: [{ type: Types.ObjectId, ref: "User" }],

    // ✅ COMMENTS
    comments: [commentSchema],
  },
  { timestamps: true }
);
postSchema.index({
  content: "text",
});

export default mongoose.models.Post ||
  mongoose.model("Post", postSchema);
