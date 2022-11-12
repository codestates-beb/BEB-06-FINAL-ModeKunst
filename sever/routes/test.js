const router = require("express").Router();

router.get("/", async (req, res) => {
  res.send("test");
});

router.post("/", async (req, res) => {
  res.send("test");
});

module.exports = router;
