//jshint esversion:6
import express from "express";
import { config } from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/users.js";
import bcrypt from "bcryptjs";

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

      let hash = await bcrypt.hash(password, 10);

      console.log(hash);

      const newUser = new User({
        email: username,
        password: hash,
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

      let isMatch = await bcrypt.compare(password, existingUser.password);

      if (!isMatch) {
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
