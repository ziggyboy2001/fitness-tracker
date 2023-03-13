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
      RETURNING id, username;
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
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT * FROM users 
      WHERE username = $1;
    `,
      [username]
    );
    if (password === user.password) {
      delete user.password;
      return user;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getUserById(userId) {
  try {
    const {
      rows: [user]
    } = await client.query(
      `
      SELECT * FROM users
      WHERE id = $1;
      `,
      [userId]
    );
    console.log("!!!", userId)
    delete user.password;
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getUserByUsername(username) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT *
      FROM users
      WHERE username=$1;
      `,
      [username]
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
