const express = require("express");
const {
  getAllPublicRoutines,
  createRoutine,
  updateRoutine,
  destroyRoutine,
  getRoutineById,
} = require("../db");
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
router.patch("/:routineId", requireUser, async (req, res, next) => {
  try {
    const { routineId } = req.params;
    const routineObject = await getRoutineById(routineId);
    if (!routineObject) {
      next({
        name: "not found",
        message: `Activity ${routineId} not found`,
      });
    } else {
      const { name, goal, isPublic } = req.body;
      if (req.user.id !== routineObject.creatorId) {
        res.status(403);
        next({
          name: "Unauthorized",
          message: `User ${req.user.username} is not allowed to update ${routineObject.name}`,
        });
      } else {
        const updatedRoutine = await updateRoutine({
          id: routineId,
          isPublic,
          name,
          goal,
        });
        res.send(updatedRoutine);
      }
    }
  } catch (error) {
    console.log(error);
  }
});
// DELETE /api/routines/:routineId

router.delete("/:routineId", requireUser, async (req, res, next) => {
  try {
    const { routineId } = req.params;
    const routine = await getRoutineById(routineId);

    if (routine && routine.creatorId === req.user.id) {
      await destroyRoutine(routineId);

      res.send(routine);
    } else {
      res.status(403);
      // if there was a routine, throw UnauthorizedUserError, otherwise throw routineNotFoundError
      next(
        routine
          ? {
              name: "UnauthorizedUserError",
              message: `User ${req.user.username} is not allowed to delete ${routine.name}`,
            }
          : {
              name: "RoutineNotFoundError",
              message: `User ${req.user.username} is not allowed to delete ${routine.name}`,
            }
      );
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// POST /api/routines/:routineId/activities

module.exports = router;
