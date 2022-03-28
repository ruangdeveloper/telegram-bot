const process = require("process")
process.env.NTBA_FIX_319 = "1"
const express = require("express")
const axios = require("axios").default
const app = express()
const { Telegraf } = require("telegraf")
const BOT_TOKEN = process.env.BOT_TOKEN
const WORDPRESS_URL = process.env.WORDPRESS_URL
const WEBHOOK_HOST = process.env.WEBHOOK_HOST

const Bot = new Telegraf(BOT_TOKEN)
const secretPath = `/api/webhook`

Bot.start((ctx) => {
    console.log(ctx)
    ctx.reply("Halo Kak " + ctx.message.from.first_name, {
        reply_to_message_id: ctx.message.reply_to_message.message_id
    })
})

Bot.telegram.setWebhook(WEBHOOK_HOST + secretPath)

app.use(Bot.webhookCallback(secretPath))

module.exports = app
