const express = require("express")
const process = require("process")
const axios = require("axios").default
const app = express()
const TeleramBot = require("node-telegram-bot-api")
const BOT_TOKEN = process.env.BOT_TOKEN
const WORDPRESS_URL = process.env.WORDPRESS_URL
const WEBHOOK_URL = process.env.WEBHOOK_URL

const Bot = new TeleramBot(BOT_TOKEN, {
    polling: true,
})

app.get("/api", (req, res) => {
    res.send("There is nothing here")
})

app.get("/api/webhook/set", (req, res) => {
    Bot.setWebHook(WEBHOOK_URL).then(() => {
        res.send("Webhook set.")
    }).catch((err) => {
        console.log(err)
        res.send("webhook failed")
    })
})

app.post("/api/webhook", async (req, res) => {
    Bot.setWebHook(WEBHOOK_URL).then(() => {
        // nothing
    }).catch((err) => {
        console.log(err)
    })
    Bot.onText(/\/start/, async (message) => {
        try {
            const options = {
                reply_to_message_id: message.message_id,
                parse_mode: "HTML",
                disable_web_page_preview: false
            }
            const firstName = (message.from?.first_name == undefined) ? "" : message.from?.first_name
            const lastName = (message.from?.last_name == undefined) ? "" : message.from?.last_name
            const text = `Halo kak ${firstName} ${lastName}`
            await Bot.sendMessage(message.chat.id, text, options)
        } catch (error) {
            console.log(error)
        }
    })

    Bot.onText(/\/terbaru/, async (message) => {
        try {
            const options = {
                reply_to_message_id: message.message_id,
                parse_mode: "HTML",
                disable_web_page_preview: false
            }

            const axiosResponse = await axios.get(WORDPRESS_URL + "/wp-json/wp/v2/posts?per_page=3")
            let text = ""
            axiosResponse.data.forEach((post) => {
                text = text + post.title.rendered + "\n" + post.link + "\n\n"
            })
            await Bot.sendMessage(message.chat.id, text, options)
        } catch (error) {
            console.log(error)
        }
    })
})

module.exports = app
