const process = require("process")
process.env.NTBA_FIX_319 = "1"
const express = require("express")
const axios = require("axios").default
const app = express()
const TeleramBot = require("node-telegram-bot-api")
const { Telegraf } = require("telegraf")
const BOT_TOKEN = process.env.BOT_TOKEN
const WORDPRESS_URL = process.env.WORDPRESS_URL
const WEBHOOK_HOST = process.env.WEBHOOK_HOST
const Bot = new Telegraf(BOT_TOKEN)

Bot.start((ctx) => {
    ctx.replyWithHTML('<b>Selamat Datang</b>')
})

Bot.telegram.setWebhook(WEBHOOK_HOST + "/api/webhook/" + Bot.secretPathComponent())

app.use(Bot.webhookCallback("/api/webhook" + Bot.secretPathComponent()))

module.exports = app
