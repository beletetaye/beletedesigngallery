require("dotenv").config();

const express = require("express");
const session = require("express-session");
const path = require("path");
const ejsEngine = require("ejs-mate");
const bodyParser = require("body-parser");
const Customer = require("./models/customer");
const Work = require("./models/work");
const Offer = require("./models/joboffer");
const Feedback = require("./models/feedback");
const mongoose = require("mongoose");
const multer = require("multer");
const { storage } = require("./cloudinary");
const Service = require("./models/services");

const upload = multer({ storage });
const app = express();

app.engine("ejs", ejsEngine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const requireLogin = (req, res, next) => {
  if (!req.session.userId) {
    res.redirect("/admin/login");
  } else {
    next();
  }
};

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
  console.log("Mongo connection established!!");
});

app.get("/", async (req, res) => {
  const works = await Work.find({});
  const services = await Service.find({});
  res.render("index", { works: works, services: services });
});

app.post("/contact", async (req, res) => {
  const newFeedback = new Feedback(req.body);
  await newFeedback.save();
  res.redirect("/");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post(
  "/register",
  upload.fields([{ name: "idcard" }, { name: "homeimage" }]),
  async (req, res) => {
    const idcard = req.files["idcard"][0];
    const homeimage = req.files["homeimage"][0];
    idcard.url = idcard.path;
    idcard.filename = idcard.filename;

    homeimage.url = homeimage.path;
    homeimage.filename = homeimage.filename;

    const newCustomer = new Customer(req.body);
    newCustomer.idcard = idcard;
    newCustomer.homeimage = homeimage;
    await newCustomer.save();
    console.log(newCustomer);
    res.redirect("/");
  }
);

app.get("/admin", requireLogin, async (req, res) => {
  const customers = await Customer.find({});
  const works = await Work.find({});
  const offers = await Offer.find({});
  const feedbacks = await Feedback.find({});
  let index = 0;
  let i = 0;
  let j = 0;
  res.render("admin", {
    customers: customers,
    index: index,
    works: works,
    offers: offers,
    i: i,
    j: j,
    feedbacks: feedbacks,
  });
});

app.get("/admin/login", (req, res) => {
  res.render("login");
});

app.post(
  "/admin/addwork",
  requireLogin,
  upload.single("image"),
  async (req, res) => {
    const file = req.file;
    file.url = file.path;
    file.filename = file.filename;

    const newWork = new Work(req.body);
    newWork.image = file;
    newWork.save();
    res.redirect("/admin");
  }
);
app.post(
  "/admin/addservice",
  requireLogin,
  upload.single("service_image"),
  async (req, res) => {
    const file = req.file;
    file.url = file.path;
    file.filename = file.filename;

    const newService = new Service(req.body);
    newService.service_image = file;
    newService.save();
    res.redirect("/admin");
  }
);

app.post("/admin/login", async (req, res) => {
  const { username, password } = req.body;
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (username === adminUsername) {
    if (password === adminPassword) {
      req.session.userId = adminUsername;
      res.redirect("/admin");
    } else {
      res.send("Username or password incorrect");
    }
  } else {
    res.redirect("/admin");
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/admin/login");
  });
});

app.get("/get", (req, res) => {
  res.render("get");
});

app.get("/aa", (req, res) => {
  res.render("aa");
});

app.get("/joff", (req, res) => {
  res.render("joff");
});

app.get("/getjoboffer", (req, res) => {
  res.render("regi");
});

app.post("/getjoboffer", upload.single("image"), async (req, res) => {
  const file = req.file;
  file.url = file.path;
  file.filename = file.filename;

  const newOffer = new Offer(req.body);
  newOffer.image = file;
  await newOffer.save();

  res.redirect("/");
});

app.get("*", (req, res) => {
  res.send("404 NOT FOUND!");
});

const port = 5000;

app.listen(5000, () => {
  console.log(`Server running on port ${port}`);
});
