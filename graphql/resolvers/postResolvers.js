import Post from "../../models/posts.js";
import { AuthenticationError, UserInputError } from "apollo-server";

import { validatePostInput } from "../../util/validation.js";
import { checkAuth } from "../../util/checkAuth.js";

const postResolvers = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (error) {
        throw new Error(error);
      }
    },

    async getPost(_, { postId }) {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          errors.post = "Post not found!";
          throw new UserInputError("Errors: ", { errors });
        }
      } catch (error) {
        throw new Error(error);
      }
    },
  },

  Mutation: {
    async createPost(_, { title, caption, image }, context) {
      const { errors, valid } = validatePostInput(title, caption);

      if (!valid) {
        throw new UserInputError("Errors: ", { errors });
      }
      const user = checkAuth(context);

      try {
        const newPost = new Post({
          title,
          caption,
          image,
          user: user.id,
          username: user.username,
          createdAt: new Date().toISOString(),
        });

        const post = await newPost.save();

        context.pubsub.publish("NEW_POST", {
          newPost: post,
        });

        return post;
      } catch (error) {
        throw new Error(error);
      }
    },

    async editPost(_, { postId, title, caption, image }, context) {
      const { errors, valid } = validatePostInput(title, caption);

      if (!valid) {
        throw new UserInputError("Errors: ", { errors });
      }
      const user = checkAuth(context);

      try {
        const post = await Post.findById(postId);
        if (post.username === user.username) {
          await post.updateOne({
            title,
            caption,
            image,
          });
          post.save();
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

    async deletePost(_, { postId }, context) {
      const user = checkAuth(context);

      try {
        const post = await Post.findById(postId);

        if (post.username === user.username) {
          await post.delete();
          return "Post deleted successfully";
        } else {
          throw new AuthenticationError("Action not allowed!");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
  },

  Subscription: {
    newPost: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("NEW_POST"),
    },
  },
};

export default postResolvers;
