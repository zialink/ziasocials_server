import dotenv from "dotenv";
import { ApolloServer, PubSub } from "apollo-server";

import typeDefs from "./graphql/typeDefs/typeDefs.js";
import resolvers from "./graphql/resolvers/index.js";
import connectDB from "./config/db.js";

dotenv.config({ path: "./config/config.env" });
const PORT = process.env.PORT || 4500;

connectDB();

const pubsub = new PubSub();

const server = new ApolloServer({
  cors: {
    origin: "*",
    credentials: true,
  },
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub }),
});

server.listen(PORT).then((res) => {
  console.log(`Server running at ${res.url}`);
});
