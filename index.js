const debug = require("debug")("app:startup");
const config = require("config");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const home = require("./routes/home");
const courses = require("./routes/courses");
const logger = require("./middleware/logger");
const authenticator = require("./middleware/authenticator");

const app = express();

app.set("view engine", "pug");
app.set("views", "./views"); // default

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(helmet());

app.use("/api/courses", courses);
app.use("/", home);

// Configuration
console.log(`Application Name: ${config.get("name")}`);
console.log(`Mail Server: ${config.get("mail.host")}`);
console.log(`Mail Password: ${config.get("mail.password")}`);

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  debug("Morgan enabled...");
}

app.use(logger);
app.use(authenticator);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
