//Registration Input Validation
const validateRegisterInput = (
  firstName,
  lastName,
  username,
  email,
  password,
  confirmPassword
) => {
  const errors = {};

  if (firstName.trim() === "") {
    errors.firstName = "First name must not be empty";
  }
  if (lastName.trim() === "") {
    errors.lastName = "Last name must not be empty";
  }
  if (username.trim() === "") {
    errors.username = "Username must not be empty";
  }
  if (email.trim() === "") {
    errors.email = "email must not be empty";
  } else {
    const regEx =
      /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.email = "Email must be a valid email address";
    }
  }
  if (password.trim() === "") {
    errors.password = "Password must not be empty";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords must match";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

//Login Input Validation
const validateLoginInput = (username, password) => {
  const errors = {};
  if (username.trim() === "") {
    errors.username = "Username must not be empty";
  }
  if (password.trim() === "") {
    errors.password = "Password must not be empty";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

//Create Post Input Validation
const validatePostInput = (title, caption) => {
  const errors = {};
  if (title.trim() == "") {
    errors.title = "Please give your post a title!";
  }
  if (caption.trim() == "") {
    errors.caption = "Please give your post a caption";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

export { validateRegisterInput, validateLoginInput, validatePostInput };
