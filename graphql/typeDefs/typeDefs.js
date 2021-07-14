import { gql } from "apollo-server";

const typeDefs = gql`
  type Post {
    id: ID!
    title: String!
    caption: String!
    image: String!
    createdAt: String!
    username: String!
    comments: [Comment]!
    likes: [Like]!
    likeCount: Int
    commentCount: Int
  }

  type Comment {
    id: ID!
    body: String!
    username: String!
    createdAt: String!
    likes: [Like]!
  }

  type Like {
    id: ID!
    username: String!
    createdAt: String!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    username: String!
    createdAt: String!
    token: String!
  }

  input RegisterInput {
    firstName: String!
    lastName: String!
    username: String!
    email: String!
    password: String!
    confirmPassword: String!
  }

  type Query {
    getPosts: [Post]
    getPost(postId: ID!): Post
  }

  type Mutation {
    register(registerInput: RegisterInput!): User!
    login(username: String!, password: String!): User!
    createPost(title: String!, caption: String!, image: String): Post!
    editPost(
      postId: ID!
      title: String!
      caption: String!
      image: String
    ): Post!
    deletePost(postId: ID!): String!
    createComment(postId: ID!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post!
    likeComment(commentId: ID!, postId: ID!): Post!
  }

  type Subscription {
    newPost: Post!
  }
`;

export default typeDefs;
