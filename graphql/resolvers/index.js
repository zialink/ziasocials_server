import postResolvers from "./postResolvers.js";
import commentResolvers from "./commentsResolvers.js";
import userResolvers from "./userResolvers.js";
import likeResolvers from "./likeResolvers.js";

const resolvers = {
  Post: {
    likeCount: (parent) => parent.likes.length,
    commentCount: (parent) => parent.comments.length,
  },
  Query: {
    ...postResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postResolvers.Mutation,
    ...commentResolvers.Mutation,
    ...likeResolvers.Mutation,
  },
  Subscription: {
    ...postResolvers.Subscription,
  },
};

export default resolvers;
