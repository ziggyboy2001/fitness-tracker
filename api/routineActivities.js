const express = require("express");
const { getRoutineActivityById, updateRoutineActivity } = require("../db");
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

module.exports = router;
