const express = require("express");
const { getAllPublicRoutines, createRoutine } = require("../db");
const router = express.Router();
const { requireUser } = require("./utils");

// GET /api/routines
router.get("/", async (req, res, next) => {
  try {
    const allRoutines = await getAllPublicRoutines();
    const routine = allRoutines.filter((routine) => {
      return routine;
    });

    res.send(routine);
  } catch ({ name, message }) {
    next({ name, message });
  }
});
// POST /api/routines
router.post("/", requireUser, async (req, res, next) => {
  const { isPublic, name, goal = "" } = req.body;
  const creatorId = req.user.id;
  const postData = {
    authorId: req.user.id,
    creatorId,
    isPublic,
    name,
    goal,
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
