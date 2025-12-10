//jshint esversion:6
import express from "express";
import { config } from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/users.js";
import { CLIENT_RENEG_LIMIT } from "tls";

config();

connectDB();

const app = express();

const PORT = process.env.PORT || 3000;
// middlewares
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// routes
app.get("/", (req, res) => {
  res.render("home");
});

app
  .route("/register")
  .get((req, res) => {
    res.render("register");
  })
  .post(async (req, res) => {
    try {
      const { username, password } = req.body;
      const existingUser = await User.findOne({ email: username });

      if (existingUser) {
        console.log("User already exists with email ", username);
        return res.redirect("/login");
      }

      const newUser = new User({
        email: username,
        password: password,
      });

      await newUser.save();
      console.log(newUser);
      res.render("secrets");
    } catch (err) {
      console.log(err);
    }
  });

app
  .route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post(async (req, res) => {
    try {
      const { username, password } = req.body;
      const existingUser = await User.findOne({ email: username });

      if (!existingUser) {
        console.log("User doesn't exists with email ", username);
        return res.redirect("/register");
      }

      if (existingUser.password !== password) {
        console.log("incorrect password");
        return res.redirect("/login");
      }

      res.render("secrets");
    } catch (err) {
      console.log(err);
    }
  });

// local server
app.listen(PORT, () => {
  console.log("Server started on port : ", PORT);
});
