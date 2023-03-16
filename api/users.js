/* eslint-disable no-useless-catch */
const express = require("express");
const {
  getUserByUsername,
  createUser,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
} = require("../db");
const { requireUser } = require("./utils");
const router = express.Router();
const jwt = require("jsonwebtoken");

// POST /api/users/register
router.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const _user = await getUserByUsername(username);

    if (_user) {
      next({
        name: "UserExistsError",
        message: `User ${username} is already taken.`,
      });
    }

    if (password.length < 8) {
      next({
        name: "PasswordError",
        message: "Password Too Short!",
      });
    }
    const user = await createUser({
      username,
      password,
    });
    const token = jwt.sign(
      {
        id: user.id,
        username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1w",
      }
    );

    res.send({
      message: "thank you for signing up",
      token,
      user,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// POST /api/users/login
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password",
    });
  }

  try {
    const user = await getUserByUsername(username);
    if (user && user.password == password) {
      // create token & return to user
      const id = user.id;
      const username = user.username;
      console.log("!!!!1", id, username);
      const token = jwt.sign({ id, username }, process.env.JWT_SECRET, {
        expiresIn: "168h",
      });

      res.send({ message: "you're logged in!", token, user });
    } else {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});
// GET /api/users/me

router.get("/me", requireUser, async (req, res, next) => {
  try {
    res.send(req.user);
  } catch (error) {
    next(error);
  }
});
// GET /api/users/:username/routines
router.get("/:username/routines", requireUser, async (req, res, next) => {
  let { username } = req.params;
  try {
    const userObject = await getUserByUsername(username);
    console.log(userObject, "USEROBJECT");
    if (!userObject) {
      next({
        name: "UserDoesNotExist",
        message: `User: ${username} Does Not Exist.`,
      });
    } else if (req.user && userObject.id === req.user.id) {
      const allRoutines = await getAllRoutinesByUser({ username });

      res.send(allRoutines);
    } else {
      const publicRoutines = await getPublicRoutinesByUser({ username });

      res.send(publicRoutines);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = router;
