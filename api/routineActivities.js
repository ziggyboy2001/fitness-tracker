const express = require("express");
const {
  getRoutineActivityById,
  updateRoutineActivity,
  destroyRoutineActivity,
} = require("../db");
const { requireUser } = require("./utils");
const router = express.Router();

// PATCH /api/routine_activities/:routineActivityId
router.patch("/:routineActivityId", requireUser, async (req, res, next) => {
  const routineActivityId = req.params.routineActivityId;
  try {
    const _routineActivity = await getRoutineActivityById(routineActivityId);

    if (!_routineActivity) {
      next({
        name: "RoutineActivityNotFoundError",
        message: `Routine activity ${routineActivityId} not found`,
      });
    }

    if (_routineActivity.creatorId !== req.user.id) {
      res.status(403);
      next({
        message: `User ${req.user.username} is not allowed to update ${_routineActivity.name}`,
        name: "UnauthorizedUpdateError",
      });
    }

    const RAObj = {
      id: routineActivityId,
      count: req.body.count,
      duration: req.body.duration,
    };

    const updatedRoutineActivity = await updateRoutineActivity(RAObj);
    res.send(updatedRoutineActivity);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/routine_activities/:routineActivityId
router.delete("/:routineActivityId", requireUser, async (req, res, next) => {
  try {
    const { routineActivityId } = req.params;
    const routineAct = await getRoutineActivityById(routineActivityId);

    if (routineAct && routineAct.creatorId === req.user.id) {
      const deletedRoutAct = await destroyRoutineActivity(routineActivityId);

      res.send(deletedRoutAct);
    } else {
      res.status(403);
      next(
        routineAct
          ? {
              name: "UnauthorizedUserError",
              message: `User ${req.user.username} is not allowed to delete ${routineAct.name}`,
            }
          : {
              name: "RoutineNotFoundError",
              message: `User ${req.user.username} is not allowed to delete ${routineAct.name}`,
            }
      );
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});
module.exports = router;
