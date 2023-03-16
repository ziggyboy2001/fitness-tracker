const express = require("express");
const router = express.Router();
const { getAllActivities } = require("../db");
const { requireUser } = require("./utils");
// GET /api/activities/:activityId/routines
router.get("/", async (req, res, next) => {
  try {
    const allActivities = await getAllActivities();
    const activities = allActivities.filter((activity) => {
      if (activity.id) {
        return activity.id || (req.user && activity.id === req.user.id);
      }
      console.log(activity.id, "1234ACTIVITIES");
    });

    res.send({
      activities,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});
// GET /api/activities

// POST /api/activities

// PATCH /api/activities/:activityId

module.exports = router;
