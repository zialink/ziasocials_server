import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserInputError } from "apollo-server";

import User from "../../models/users.js";
import {
  validateRegisterInput,
  validateLoginInput,
} from "../../util/validation.js";

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      username: user.username,
      name: user.name,
    },
    process.env.SECRET,
    { expiresIn: "1h" }
  );
};

const userResolvers = {
  Mutation: {
    async register(
      _,
      {
        registerInput: {
          firstName,
          lastName,
          username,
          email,
          password,
          confirmPassword,
        },
      }
    ) {
      const { errors, valid } = validateRegisterInput(
        firstName,
        lastName,
        username,
        email,
        password,
        confirmPassword
      );

      if (!valid) {
        throw new UserInputError("Errors:", { errors });
      }
      try {
        const verifyUsername = await User.findOne({ username });
        const verifyEmail = await User.findOne({ email });
        if (verifyUsername) {
          throw new UserInputError("Username already exist", {
            errors: {
              username: "This username already exist",
            },
          });
        }
        if (verifyEmail) {
          throw new UserInputError("Email address already exist", {
            errors: {
              email: "This Email address already exist",
            },
          });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
          email,
          username,
          password: hashedPassword,
          name: `${firstName} ${lastName}`,
          createdAt: new Date().toISOString(),
        });

        const user = await newUser.save();

        const token = generateToken(user);

        return {
          ...user._doc,
          id: user._id,
          token,
        };
      } catch (error) {
        console.log(error);
      }
    },

    async login(_, { username, password }) {
      const { valid, errors } = validateLoginInput(username, password);
      if (!valid) {
        throw new UserInputError("Errors: ", { errors });
      }

      try {
        const findUser = await User.findOne({
          $or: [{ email: username }, { username: username }],
        });

        if (!findUser) {
          errors.username = "User not found!";
          throw new UserInputError("Errors: ", { errors });
        }

        const comparePassword = await bcrypt.compare(
          password,
          findUser.password
        );
        if (!comparePassword) {
          errors.password = "Wrong credentials!";
          throw new UserInputError("Errors: ", { errors });
        }

        const token = generateToken(findUser);

        return {
          ...findUser._doc,
          id: findUser._id,
          token,
        };
      } catch (errors) {
        throw new UserInputError("Errors:", errors);
      }
    },
  },
};

export default userResolvers;
