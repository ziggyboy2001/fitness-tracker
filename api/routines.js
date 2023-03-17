const express = require("express");
const router = express.Router();
const { createRoutine } = require("../db");
const { requireUser } = require("./utils");

// GET /api/routines

// POST /api/routines
router.post("/", requireUser, async (req, res, next) => {
  const { name, description = "" } = req.body;

  const postData = {
    authorId: req.user.id,
    name,
    description,
  };

  try {
    const post = await createRoutine(postData);
    if (post) {
      res.send(post);
    } else {
      next({ name: "PostCreationError", message: "Error creating post." });
    }
  } catch ({ name, message }) {
    next({
      name,
      message: `An activity with name ${postData.name} already exists`,
    });
  }
});
// PATCH /api/routines/:routineId

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = router;
