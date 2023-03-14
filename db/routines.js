const client = require("./client");
const { attachActivitiesToRoutines } = require("./activities");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      INSERT INTO routines("creatorId", "isPublic", name, goal) 
      VALUES($1, $2, $3, $4) 
      RETURNING *;
    `,
      [creatorId, isPublic, name, goal]
    );
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
async function getRoutineById(id) {
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
  }
}

async function getRoutinesWithoutActivities() {
  try {
    const { rows: routineIds } = await client.query(
      `
      SELECT id
      FROM routines;
      `
    );

    const routine = await Promise.all(
      routineIds.map((routine) => getRoutineById(routine.id))
    );

    return routine;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getAllRoutines() {
  try {
    const { rows } = await client.query(
      `
      SELECT routines.*,
      users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId" = users.id
          
      `
    );
    return attachActivitiesToRoutines(rows);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getAllPublicRoutines() {
  try {
    const { rows } = await client.query(
      `
      SELECT routines.*,
      users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId" = users.id
      WHERE "isPublic" = true

      `
    );
    return attachActivitiesToRoutines(rows);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getAllRoutinesByUser({ username }) {
  try {
    const { rows } = await client.query(
      `
      SELECT routines.*,
      users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId" = users.id
      WHERE username = $1;
          
      `,
      [username]
    );
    return attachActivitiesToRoutines(rows);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getPublicRoutinesByUser({ username }) {
  try {
    const { rows } = await client.query(
      `
      SELECT routines.*,
      users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId" = users.id
      WHERE username = $1
      AND "isPublic" = true

          
      `,
      [username]
    );
    return attachActivitiesToRoutines(rows);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getPublicRoutinesByActivity({ id }) {}

async function updateRoutine({ id, ...fields }) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");
  try {
    if (setString.length > 0) {
      await client.query(
        `
          UPDATE routines
          SET ${setString}
          WHERE id=${id}
          RETURNING *;
        `,
        Object.values(fields)
      );
    }

    return await getRoutineById(id);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function destroyRoutine(id) {}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
