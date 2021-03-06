const process = require("process")
const express = require("express")
const axios = require("axios").default
const app = express()
const { Telegraf } = require("telegraf")

const BOT_TOKEN = process.env.BOT_TOKEN
const WORDPRESS_URL = process.env.WORDPRESS_URL
const WEBHOOK_HOST = process.env.WEBHOOK_HOST
const BOT_ADMIN_USERNAME = process.env.BOT_ADMIN_USERNAME
const BOT_ADMIN_ID = process.env.BOT_ADMIN_ID

const Bot = new Telegraf(BOT_TOKEN)
const secretPath = `/api/webhook/${BOT_TOKEN}`

Bot.start((ctx) => {
    try {
        const text = `Halo kak ${ctx.message.from.first_name}. Aku adalah bot telegram Ruang Developer.\nKalo kakak belum tau, Ruang Developer adalah sebuah situs blog yang berisi tentang informasi, tips & trik seputar dunia teknologi dan pengembangan aplikasi. Kakak bisa kunjungi di https://www.ruangdeveloper.com.`

        ctx.reply(text, {
            reply_to_message_id: ctx.message.message_id
        })
    } catch (error) {
        ctx.reply("Maaf sepertinya sedang terjadi kesalahan", {
            reply_to_message_id: ctx.message.message_id
        })
        console.log(error)
    }
})

Bot.command("terbaru", async (ctx) => {
    try {
        let text = ""
        const axiosResponse = await axios.get(WORDPRESS_URL + "/wp-json/wp/v2/posts?per_page=5")
        axiosResponse.data.forEach((post) => {
            text = text + post.title.rendered + "\n" + post.link + "\n\n"
        })
        ctx.reply(text, {
            reply_to_message_id: ctx.message.message_id
        })
    } catch (error) {
        ctx.reply("Maaf sepertinya sedang terjadi kesalahan", {
            reply_to_message_id: ctx.message.message_id
        })
        console.log(error)
    }
})


// Only bot admin can access this commands
Bot.command("probe_me", (ctx) => {
    try {
        if (ctx.message.chat.username == BOT_ADMIN_USERNAME) {
            ctx.reply(JSON.stringify(ctx.message.chat))
        }
    } catch (error) {
        ctx.reply("maaf sepertinya sedang terjadi kesalahan", {
            reply_to_message_id: ctx.message.message_id
        })
        console.log(error)
    }
})

Bot.command("probe_group", (ctx) => {
    try {
        if (ctx.from.id == BOT_ADMIN_ID) {
            ctx.reply(JSON.stringify(ctx.message.chat))
        }
    } catch (error) {
        ctx.reply("maaf sepertinya sedang terjadi kesalahan", {
            reply_to_message_id: ctx.message.message_id
        })
        console.log(error)
    }
})

Bot.telegram.setWebhook(WEBHOOK_HOST + secretPath)

app.use(Bot.webhookCallback(secretPath))

module.exports = app
