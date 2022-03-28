const express = require("express")
const process = require("process")
const app = express()
const TeleramBot = require("node-telegram-bot-api")
const BOT_TOKEN = process.env.BOT_TOKEN
const WEBHOOK_URL = process.env.WEBHOOK_URL

const Bot = new TeleramBot(BOT_TOKEN, {
    polling: true,
})

app.get("/api", (req, res) => {
    res.send("There is nothing here")
})

app.post("/api/webhook", (req, res) => {
    
    Bot.setWebHook(WEBHOOK_URL).then(() => console.log("webhook set.")).catch((err) => console.log("webhook failed: " + err.message))
    
    Bot.onText(/\/start/, async (message) => {
        const options = {
            reply_to_message_id: message.message_id,
            parse_mode: "HTML",
            disable_web_page_preview: true
        }

        try {
            const firstName = (message.from?.first_name == undefined) ? "" : message.from?.first_name
            const lastName = (message.from?.last_name == undefined) ? "" : message.from?.last_name
            const text = `Halo kak ${firstName} ${lastName}`
            await Bot.sendMessage(message.chat.id, text, options)
        } catch (error) {
            console.log(error)
        }
    })
})

module.exports = app
