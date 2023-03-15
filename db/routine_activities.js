const client = require("./client");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
        INSERT INTO routine_activities( "routineId",
        "activityId",
        count,
        duration)
        VALUES($1, $2, $3, $4)
        RETURNING *;
      `,
      [routineId, activityId, count, duration]
    );
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getRoutineActivityById(id) {
  try {
  const {
    rows: [routine],
  } = await client.query(
    `
    SELECT * 
    FROM routines
    WHERE id = $1;
    `,
    [id]
  );

  return routine;
} catch (error) {
  console.log(error);
  throw {
    name: "RoutineNotFoundError",
    message: "Could not find routine with id given",
  };
}}

async function getRoutineActivitiesByRoutine({ id }) {
  try {
    const { rows } = await client.query(
      `
      SELECT *
      FROM routine_activities
      WHERE routine_activities."routineId" = $1
      `,
      [id]
    );
    return rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function updateRoutineActivity({ id, ...fields }) {
  const setString = Object.keys(fields).map((key, index) => `"${key}"=$${index + 1}`)
  .join(", ");
  try {
    if (setString.length > 0) {
      const { rows: [routine_activity], } = await client.query(
        `
        UPDATE routine_activities
        SET ${setString}
        WHERE id=${id}
        RETURNING *;
        `,
        Object.values(fields)
      );
      return routine_activity;
    }
  } catch (error) {
    console.error(error)
    throw error;
  }
}

async function destroyRoutineActivity(id) {}

async function canEditRoutineActivity(routineActivityId, userId) {}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
