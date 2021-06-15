import { AuthenticationError, UserInputError } from "apollo-server-errors";
import Post from "../../models/posts.js";
import { checkAuth } from "../../util/checkAuth.js";

const commentResolvers = {
  Mutation: {
    createComment: async (_, { postId, body }, context) => {
      const { username } = checkAuth(context);

      if (body.trim() === "") {
        throw new UserInputError("Empty Comment", {
          errors: {
            body: "Comment body must not be empty",
          },
        });
      }
      try {
        const post = await Post.findById(postId);

        if (post) {
          post.comments.unshift({
            body,
            username,
            createdAt: new Date().toISOString(),
          });
          await post.save();
          return post;
        } else {
          throw new UserInputError("Post not found", {
            errors: {
              post: "Post not found!",
            },
          });
        }
      } catch (error) {
        throw new Error(error);
      }
    },

    deleteComment: async (_, { postId, commentId }, context) => {
      const { username } = checkAuth(context);

      try {
        const post = await Post.findById(postId);
        if (post) {
          const commentIndex = post.comments.findIndex(
            (c) => c.id === commentId
          );
          if (post.comments[commentIndex].username === username) {
            post.comments.splice(commentIndex, 1);
            await post.save();
          } else {
            throw new AuthenticationError("Action not allowed!");
          }

          return post;
        } else {
          throw new UserInputError("Post not found!");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};

export default commentResolvers;
