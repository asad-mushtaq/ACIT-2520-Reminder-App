const express = require("express");
const app = express();
const session = require("express-session");
const path = require("path");
const ejsLayouts = require("express-ejs-layouts");
const reminderController = require("./controller/reminder_controller");
const userController = require("./controller/userController");

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);


app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: false }));

app.use(ejsLayouts);

app.set("view engine", "ejs");
const passport = require("./middleware/passport");
const { ensureAuthenticated } = require("./middleware/checkAuth");
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  if (req.user) {
    res.locals.loggedIn = true;
  } else {
    res.locals.loggedIn = false;
  }
  next();
})
// Routes start here

app.get("/reminders", ensureAuthenticated, reminderController.list);

app.get("/reminder/new",ensureAuthenticated, reminderController.new);

app.get("/reminder/:id",ensureAuthenticated, reminderController.listOne);

app.get("/reminder/:id/edit",ensureAuthenticated, reminderController.edit);

app.post("/reminder/",ensureAuthenticated, reminderController.create);

// Implement this yourself
app.post("/reminder/update/:id", ensureAuthenticated,reminderController.update);

// Implement this yourself
app.post("/reminder/delete/:id", ensureAuthenticated,reminderController.delete);

app.get("/login", (req, res) => {
  res.render("login");
});

app.get('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/reminders",
    failureRedirect: "/login",
  })
);

// Fix this to work with passport! The registration does not need to work, you can use the fake database for this.
// app.get("/register", authController.register);
// app.post("/register", authController.registerSubmit);

app.listen(3001, function () {
  console.log(
    "Server running. Visit: localhost:3001/reminders in your browser 🚀"
  );
});
