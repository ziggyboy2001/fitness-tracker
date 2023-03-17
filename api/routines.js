const express = require('express');
const { getAllPublicRoutines } = require('../db');
const router = express.Router();

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

// PATCH /api/routines/:routineId

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = router;
