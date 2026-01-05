const express = require("express");
const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const app = express();

app.use(session({
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
  done(null, {
    name: profile.displayName,
    email: profile.emails[0].value
  });
}));

app.get("/", (req, res) => {
  res.send("SmartTime Google Auth Backend Running");
});

app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    const user = encodeURIComponent(JSON.stringify(req.user));
    res.redirect(`https://vivekanand1190.github.io/IDT1/?user=${user}`);
  }
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server started"));
