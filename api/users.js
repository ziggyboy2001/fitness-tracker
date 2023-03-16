/* eslint-disable no-useless-catch */
const express = require("express");
const { getUserByUsername, createUser } = require("../db");
const router = express.Router();
const jwt = require("jsonwebtoken")

// POST /api/users/register
router.post("/register", async (req, res, next) => {
    const {username, password} = req.body;
    try{
        const _user = await getUserByUsername(username)

        if (_user) {
            next({
              name: "UserExistsError",
              message: `User ${username} is already taken.`,
            });
          }

          if (password.length < 8){
            next({
                name:"PasswordError",
                message: "Password Too Short!",
            })
          }
          const user = await createUser({
            username,
            password,
          });  
          const token = jwt.sign(
            {
              id: user.id,
              username,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: "1w",
            }
          );
        
            res.send({
                message: "thank you for signing up",
                token,
                user,
              });
            } catch ({ name, message }) {
              next({ name, message });
            }
          }); 



// POST /api/users/login

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = router;
