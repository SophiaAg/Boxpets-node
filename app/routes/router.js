var express = require("express");
var router = express.Router();

router.get("/", function (req, res) {
    res.render("pages/LandingPage", {pagina:"LandingPage"});
});

router.get("/login", function (req, res) {
    res.render("pages/login");
});

router.get("/pages", function (req, res) {
    res.render("pages/login", {pagina:"sss"});
});

router.get("/", function (req, res) {
    res.render("pages/LandingPage", {pagina:"LandingPage"});
});

router.get("/", function (req, res) {
    res.render("pages/LandingPage", {pagina:"LandingPage"});
});

router.get("/", function (req, res) {
    res.render("pages/LandingPage", {pagina:"LandingPage"});
});

router.get("/", function (req, res) {
    res.render("pages/LandingPage", {pagina:"LandingPage"});
});


module.exports = router;
