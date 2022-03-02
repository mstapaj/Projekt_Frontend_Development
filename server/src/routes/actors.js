const express = require("express");
const client = require('../config/psqlClient');
const router = express.Router({mergeParams: true});

router.get('/', async (req, res) => {
    const actors = await client.query("SELECT * FROM actor");
    return res.send(actors.rows);
});


module.exports = router;
