// const e = require("cors");
const client = require("./client");

// database functions

// user functions
async function createUser({ username, password }) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `INSERT INTO users(username, password)
      VALUES ($1, $2)
      ON CONFLICT (username) DO NOTHING
      RETURNING *;
      `,
      [username, password]
    );
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getUser({ username, password }) {
  try {
    const { rows } = await client.query(
      `
      SELECT username, password
      FROM users;
    `,
      [username, password]
    );
    return rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getUserById(userId) {
  try {
    const { rows } = await client.query(
      `
      SELECT * FROM users
      WHERE "id"=${userId}
      `
    );
    return rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getUserByUsername(userName) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT *
      FROM users
      WHERE "userName"=$1;
      `,
      [userName]
    );

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};
