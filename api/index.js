const express = require("express")
const app = express()

app.get("/api", (req, res) => {
    res.send("There is nothing here")
})

module.exports = app
