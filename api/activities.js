const express = require("express");
const router = express.Router();
const { getAllActivities, createActivity, updateActivity, getActivityById } = require("../db");
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
router.patch("/:activityId", requireUser, async (req, res, next) => {
  try{
    const { activityId } = req.params;
  const getActivityId = await getActivityById(activityId)
  if (!getActivityId) {
    next({
      name: "not found",
      message: `Activity ${activityId} not found`
    })
  }else {
    const { name, description } = req.body;
    try{
    const updatedActivity = await updateActivity({id: activityId, name, description});
    res.send(updatedActivity)
  }catch (error){
      next({ name: "", message: `An activity with name ${name} already exists` });
      console.log(error)
    }
  } 
  }catch (error){
    console.log(error)
  }
});

module.exports = router;
