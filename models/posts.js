import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  title: String,
  caption: String,
  image: String,
  createdAt: String,
  username: String,
  comments: [
    {
      body: String,
      username: String,
      createdAt: String,
    },
  ],
  likes: [
    {
      username: String,
      createdAt: String,
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
});

const Post = mongoose.model("Post", postSchema);

export default Post;
