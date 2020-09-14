
const express = require("express")
const helmet = require("helmet")
const cors = require("cors")
const session = require("express-session")
const knexSessionStore = require("connect-session-knex")(session)
const dbConnection = require("../database/connection")

const usersRouter = require("../user/users-router")
const server = express()

const sessionConfiguration = {
  name: "monster", //default value is sid
  secret: process.env.SESSION_SECRET || "keep it secret", //key for encryption
  cookie: {
    maxAge: 1000 * 60 * 10, //10 minutes
    secure: process.env.USE_SECURE_COOKIES || false, //send the cookie only over https
    httpOnly: true, //prevent JS code on client from accessing this cookie
  },
  resave: false,
  saveUninitialized: true, //read docs, it's related to GDPR compliance
  store: new knexSessionStore({
    knex: dbConnection,
    tablename: "session",
    sidfieldname: "sid",
    createtable: true,
    clearInterval: 1000 * 60 * 30, //tiem to check and remove expired sessions from database
  }),
}

server.use(session(sessionConfiguration)) //enable session support

server.use(helmet())
server.use(express.json())
server.use(cors())

server.use("/api", usersRouter)

server.get("/", (req, res) => {
  res.json({ api: "up" })
})

//middle, hosited 

module.exports = server