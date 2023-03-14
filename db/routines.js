const client = require("./client");

async function createRoutine({ creatorId, isPublic, name, goal }) {}
//   try {
//   const {
//     rows: [user],
//   } = await client.query(
//     `
//       INSERT INTO routines("creatorId", "isPublic", name, goal) 
//       VALUES($1, $2, $3, $4) 
//       RETURNING *;
//     `,
//     [creatorId, isPublic, name, goal]
//   );
//   return user;
// } catch (error) {
//   console.log(error);
//   throw error;
// }
async function getRoutineById(id) {}

async function getRoutinesWithoutActivities() {}

async function getAllRoutines() {}

async function getAllPublicRoutines() {}

async function getAllRoutinesByUser({ username }) {}

async function getPublicRoutinesByUser({ username }) {}

async function getPublicRoutinesByActivity({ id }) {}

async function updateRoutine({ id, ...fields }) {}

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
