const express = require("express");
const router = express.Router();
const { getAllActivities, createActivity } = require("../db");
const { requireUser } = require("./utils");
// GET /api/activities/:activityId/routines

// GET /api/activities
router.get("/", async (req, res, next) => {
  try {
    const allActivities = await getAllActivities();
    const activities = allActivities.filter((activity) => {
      return activity;
    });

    res.send(activities);
  } catch ({ name, message }) {
    next({ name, message });
  }
});
// POST /api/activities
router.post("/", requireUser, async (req, res, next) => {
  const { name, description = "" } = req.body;

  const postData = {
    authorId: req.user.id,
    name,
    description,
  };

  try {
    const post = await createActivity(postData);
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
// PATCH /api/activities/:activityId

module.exports = router;
