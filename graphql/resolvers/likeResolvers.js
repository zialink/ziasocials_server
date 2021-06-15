import { UserInputError } from "apollo-server-errors";

import Post from "../../models/posts.js";
import { checkAuth } from "../../util/checkAuth.js";

const likeResolvers = {
  Mutation: {
    likePost: async (_, { postId }, context) => {
      const { username } = checkAuth(context);

      try {
        const post = await Post.findById(postId);
        if (post) {
          if (post.likes.find((like) => like.username === username)) {
            post.likes = post.likes.filter(
              (like) => like.username !== username
            );
          } else {
            post.likes.push({
              username,
              createdAt: new Date().toISOString(),
            });
          }
          await post.save();
          return post;
        } else {
          throw new UserInputError("Post not found");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};

export default likeResolvers;
