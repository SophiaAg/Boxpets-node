var express = require("express");
var router = express.Router();

router.get("/", function (req, res) {
    res.render("pages/LandingPage", {pagina:"LandingPage"});
});

router.get("/login", function (req, res) {
    res.render("pages/login");
});
router.get("/empresasLP", function (req, res) {
    res.render("pages/empresasLP");
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
