require("./setting.js")
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const fs = require("fs");
const speed = require("performance-now");
const moment = require("moment-timezone");
const toMs = require('ms');
const ms = require('parse-ms');
const os = require('os');
const { sizeFormatter } = require('human-readable');
const { exec, execSync } = require("child_process");
const util = require('util');
const crypto = require("crypto");
const axios = require('axios');
const fetch = require('node-fetch');
const jimp_1 = require('jimp');
const QRCode = require('qrcode');

const { getGroupAdmins, runtime, sleep } = require("./function/myfunc");
const { color } = require('./function/console');
const { addResponList, delResponList, isAlreadyResponList, sendResponList, updateResponList, getDataResponList } = require('./function/respon-list');
const { addResponTesti, delResponTesti, isAlreadyResponTesti, updateResponTesti, getDataResponTesti } = require('./function/respon-testi');
const { expiredCheck, getAllSewa } = require("./function/sewa");
const { TelegraPh } = require('./function/uploader');
const path = require("path");
const { response } = require("express");
const { title } = require("process");
const { text } = require("figlet");
global.prefa = ['', '.']

moment.tz.setDefault("Asia/Jakarta").locale("id");

async function cekNick(game, id, zone = '') {
  if (game == "mobile-legends" || game == "life-after" || game == "genshin-impact") {
    let response = await axios.get(`https://arfystore.shop/api/nickname/${game}?id=${encodeURIComponent(id)}&zone=${encodeURIComponent(zone)}`)
    return response.data.data
  } else {
    let response = await axios.get(`https://arfystore.shop/api/nickname/${game}?id=${encodeURIComponent(id)}&zone=${encodeURIComponent(zone)}`)
    return decodeURIComponent(response.data.data.nickname)
  }
}

module.exports = async (ronzz, m, mek) => {
  try {
    const { isQuotedMsg, fromMe } = m
    if (fromMe) return
    const tanggal = moment.tz('Asia/Jakarta').format('DD MMMM YYYY')
    const jamwib = moment.tz('Asia/Jakarta').format('HH:mm:ss')
    const dt = moment.tz('Asia/Jakarta').format('HH')
    const content = JSON.stringify(mek.message)
    const type = Object.keys(mek.message)[0];
    const from = m.chat
    const chats = (m.mtype === 'conversation') ? m.message.conversation : (m.mtype == 'imageMessage') ? m.message.imageMessage.caption : (m.mtype == 'videoMessage') ? m.message.videoMessage.caption : (m.mtype == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (m.mtype == 'buttonsResponseMessage') && m.message.buttonsResponseMessage.selectedButtonId ? m.message.buttonsResponseMessage.selectedButtonId : (m.mtype == 'listResponseMessage') && m.message.listResponseMessage.singleSelectReply.selectedRowId ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (m.mtype == 'templateButtonReplyMessage') && m.message.templateButtonReplyMessage.selectedId ? m.message.templateButtonReplyMessage.selectedId : (m.mtype == 'interactiveResponseMessage') && JSON.parse(m.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id ? JSON.parse(m.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id : (m.mtype == 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text) : ""
    const toJSON = j => JSON.stringify(j, null, '\t')
    const prefix = prefa ? /^[°•π÷×¶∆£¢€¥®=????+✓_=|~!?@#%^&.©^]/gi.test(chats) ? chats.match(/^[°•π÷×¶∆£¢€¥®=????+✓_=|~!?@#%^&.©^]/gi)[0] : "" : prefa ?? '#'
    const isGroup = m.isGroup
    const sender = m.isGroup ? (mek.key.participant ? mek.key.participant : mek.participant) : mek.key.remoteJid
    const isOwner = [ronzz.user.id, ...owner].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(sender) ? true : false
    const pushname = m.pushName
    const budy = (typeof m.text == 'string' ? m.text : '')
    const args = chats.trim().split(/ +/).slice(1);
    const q = args.join(" ");
    const command = chats.replace(prefix, '').trim().split(/ +/).shift().toLowerCase()
    const botNumber = ronzz.user.id.split(':')[0] + '@s.whatsapp.net'
    const groupMetadata = isGroup ? await ronzz.groupMetadata(from) : ''
    const groupName = isGroup ? groupMetadata.subject : ''
    const groupId = isGroup ? groupMetadata.id : ''
    const groupMembers = isGroup ? groupMetadata.participants : ''
    const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
    const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
    const isGroupAdmins = groupAdmins.includes(sender)
    const participants = isGroup ? await groupMetadata.participants : ''

    const isImage = (m.mtype == 'imageMessage')
    const isQuotedImage = isQuotedMsg ? content.includes('imageMessage') ? true : false : false
    const isVideo = (m.mtype == 'videoMessage')
    const isQuotedVideo = isQuotedMsg ? content.includes('videoMessage') ? true : false : false
    const isSewa = db.data.sewa[from] ? true : false
    const isAndroid = db.data.users[sender] !== undefined ? db.data.users[sender].device == "android" : false

    function parseMention(text = '') {
      return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
    }

    const reply = (teks, options = {}) => { ronzz.sendMessage(from, { text: teks, mentions: parseMention(teks), ...options }, { quoted: m }) }
    const Reply = (teks) => ronzz.sendMessage(from, {
      headerType: 1,
      image: fs.readFileSync(thumbnail),
      caption: teks,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        mentionedJid: parseMention(teks),
        externalAdReply: {
          title: botName,
          body: `By ${ownerName}`,
          thumbnailUrl: ppuser,
          sourceUrl: '',
          mediaType: 1,
          renderLargerThumbnail: false
        }
      }
    }, { quoted: m })
    const sendDaftar = async () => {
      if (isGroup) await reply("Bot sudah mengirimkan format pendaftaran di private chat.")
      await ronzz.sendMessage(sender, {
        text: `👋 Hello *@${sender.split("@")[0]}* silahkan daftar ke database bot terlebih dahulu jika ingin menggunakan fitur bot.`,
        footer: `${botName} © ${ownerName}`,
        mentions: [sender],
        buttonText: "Klik untuk memilih device",
        sections: [
          {
            title: "📱 LIST DEVICE",
            rows: [
              {
                title: "Android",
                rowId: ".verify android"
              },
              {
                title: "iPhone",
                rowId: ".verify iphone"
              },
              {
                title: "Windows",
                rowId: ".verify windows"
              }
            ]
          }
        ]
      }, { quoted: m })
    }

    const mentionByTag = m.mtype == "extendedTextMessage" && m.message.extendedTextMessage.contextInfo != null ? m.message.extendedTextMessage.contextInfo.mentionedJid : []
    const mentionByReply = m.mtype == "extendedTextMessage" && m.message.extendedTextMessage.contextInfo != null ? m.message.extendedTextMessage.contextInfo.participant || "" : ""
    const mention = typeof (mentionByTag) == 'string' ? [mentionByTag] : mentionByTag
    mention != undefined ? mention.push(mentionByReply) : []

    async function downloadAndSaveMediaMessage(type_file, path_file) {
      if (type_file === 'image') {
        var stream = await downloadContentFromMessage(m.message.imageMessage || m.message.extendedTextMessage?.contextInfo.quotedMessage.imageMessage, 'image')
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
          buffer = Buffer.concat([buffer, chunk])
        }
        fs.writeFileSync(path_file, buffer)
        return path_file
      }
      else if (type_file === 'video') {
        var stream = await downloadContentFromMessage(m.message.videoMessage || m.message.extendedTextMessage?.contextInfo.quotedMessage.videoMessage, 'video')
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
          buffer = Buffer.concat([buffer, chunk])
        }
        fs.writeFileSync(path_file, buffer)
        return path_file
      } else if (type_file === 'sticker') {
        var stream = await downloadContentFromMessage(m.message.stickerMessage || m.message.extendedTextMessage?.contextInfo.quotedMessage.stickerMessage, 'sticker')
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
          buffer = Buffer.concat([buffer, chunk])
        }
        fs.writeFileSync(path_file, buffer)
        return path_file
      } else if (type_file === 'audio') {
        var stream = await downloadContentFromMessage(m.message.audioMessage || m.message.extendedTextMessage?.contextInfo.quotedMessage.audioMessage, 'audio')
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
          buffer = Buffer.concat([buffer, chunk])
        }
        fs.writeFileSync(path_file, buffer)
        return path_file
      }
    }

    try {
      var ppuser = await ronzz.profilePictureUrl(sender, "image")
    } catch {
      var ppuser = "https://telegra.ph/file/8dcf2bc718248d2dd189b.jpg"
    }

    async function createDeposit(nominal, path) {
      let signature = crypto
        .createHash('md5')
        .update(api_id + api_key)
        .digest('hex')

      let keys = new URLSearchParams({
        'api_key': api_key,
        'sign': signature,
        'nominal': parseInt(nominal)
      })

      let response = await fetch('https://arfystore.shop/api/deposit/create', {
        'headers': {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        'method': 'POST',
        'body': keys
      })
      let res = await response.json()

      QRCode.toFile(path, res.data.qr_string, { margin: 2, scale: 10 })

      return {
        ...res.data,
        path: path
      }
    }

    async function statusDeposit(reff_id) {
      let signature = crypto
        .createHash('md5')
        .update(api_id + api_key)
        .digest('hex')

      let keys = new URLSearchParams({
        'api_key': api_key,
        'sign': signature,
        'reff_id': reff_id
      })

      let response = await fetch('https://arfystore.shop/api/deposit/status', {
        'headers': {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        'method': 'POST',
        'body': keys
      })
      let res = await response.json()

      return res.data
    }

    async function cancelDeposit(reff_id) {
      let signature = crypto
        .createHash('md5')
        .update(api_id + api_key)
        .digest('hex')

      let keys = new URLSearchParams({
        'api_key': api_key,
        'sign': signature,
        'reff_id': reff_id
      })

      let response = await fetch('https://arfystore.shop/api/deposit/cancel', {
        'headers': {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        'method': 'POST',
        'body': keys
      })
      let res = await response.json()

      return res.data
    }

    async function getProduk(kategori) {
      let signature = crypto
        .createHash('md5')
        .update(api_id + api_key)
        .digest('hex')

      let keys = new URLSearchParams({
        'api_key': api_key,
        'sign': signature
      })

      let response = await fetch('https://arfystore.shop/api/layanan', {
        'headers': {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        'method': 'POST',
        'body': keys
      })
      let res = await response.json()
      let produk = await res.data.filter(i => i.category.toLowerCase() == kategori)

      return produk
    }

    async function getHarga(code) {
      let signature = crypto
        .createHash('md5')
        .update(api_id + api_key)
        .digest('hex')

      let keys = new URLSearchParams({
        'api_key': api_key,
        'sign': signature,
        'code': code
      })

      let response = await fetch('https://arfystore.shop/api/list-harga', {
        'headers': {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        'method': 'POST',
        'body': keys
      })
      let res = await response.json()

      return res.data
    }

    async function pepe(media) {
      const jimp = await jimp_1.read(media)
      const min = jimp.getWidth()
      const max = jimp.getHeight()
      const cropped = jimp.crop(0, 0, min, max)
      return {
        img: await cropped.scaleToFit(720, 720).getBufferAsync(jimp_1.MIME_JPEG),
        preview: await cropped.normalize().getBufferAsync(jimp_1.MIME_JPEG)
      }
    }

    function digit() {
      return Math.ceil(Math.floor(Math.random() * 200))
    }

    const formatp = sizeFormatter({
      std: 'JEDEC',
      decimalPlaces: 2,
      keepTrailingZeroes: false,
      render: (literal, symbol) => `${literal} ${symbol}B`,
    })

    //Ucapan waktu
    if (dt >= 0) {
      var ucapanWaktu = ('Selamat Malam🌃')
    }
    if (dt >= 4) {
      var ucapanWaktu = ('Selamat Pagi🌄')
    }
    if (dt >= 12) {
      var ucapanWaktu = ('Selamat Siang☀️')
    }
    if (dt >= 16) {
      var ucapanWaktu = ('️ Selamat Sore🌇')
    }
    if (dt >= 23) {
      var ucapanWaktu = ('Selamat Malam🌙')
    }

    if (!db.data.persentase["feeDepo"]) db.data.persentase["feeDepo"] = Number(feeDepo)
    if (!db.data.persentase["bronze"]) db.data.persentase["bronze"] = Number(bronze)
    if (!db.data.persentase["silver"]) db.data.persentase["silver"] = Number(silver)
    if (!db.data.persentase["gold"]) db.data.persentase["gold"] = Number(gold)
    if (!db.data.profit["bronze"]) db.data.profit["bronze"] = Number(nBronze)
    if (!db.data.profit["silver"]) db.data.profit["silver"] = Number(nSilver)
    if (!db.data.profit["gold"]) db.data.profit["gold"] = Number(nGold)
    if (!db.data.topup) db.data.topup = {}
    if (!db.data.setting[botNumber]) db.data.setting[botNumber] = {
      autoread: true,
      autoketik: false,
      anticall: true
    }
    if (isGroup && !db.data.chat[from]) db.data.chat[from] = {
      welcome: false,
      antilink: false,
      antilink2: false,
      sDone: "",
      sProses: ""
    }

    function Styles(text, style = 1) {
      var xStr = 'abcdefghijklmnopqrstuvwxyz1234567890'.split('');
      var yStr = Object.freeze({
        1: 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘqʀꜱᴛᴜᴠᴡxʏᴢ1234567890'
      });
      var replacer = [];
      xStr.map((v, i) => replacer.push({
        original: v,
        convert: yStr[style].split('')[i]
      }));
      var str = text.toLowerCase().split('');
      var output = [];
      str.map(v => {
        const find = replacer.find(x => x.original == v);
        find ? output.push(find.convert) : output.push(v);
      });
      return output.join('');
    }

    function toRupiah(angka) {
      var saldo = '';
      var angkarev = angka.toString().split('').reverse().join('');
      for (var i = 0; i < angkarev.length; i++)
        if (i % 3 == 0) saldo += angkarev.substr(i, 3) + '.';
      return '' + saldo.split('', saldo.length - 1).reverse().join('');
    }

    function hargaSetelahProfit(harga, role, kategori) {
      if (db.data.customProfit[kategori.toLowerCase()] !== undefined) {
        if (db.data.customProfit[kategori.toLowerCase()] == "persen") {
          let fee = (db.data.persentase[role] / 100) * Number(harga)
          let total = Number(harga) + Number(Math.ceil(fee))
          return total
        } else if (db.data.customProfit[kategori.toLowerCase()] == "nominal") {
          let total = Number(harga) + Number(db.data.profit[role])
          return total
        }
      } else if (db.data.type == "persen") {
        let fee = (db.data.persentase[role] / 100) * Number(harga)
        let total = Number(harga) + Number(Math.ceil(fee))
        return total
      } else if (db.data.type == "nominal") {
        let total = Number(harga) + Number(db.data.profit[role])
        return total
      }
    }

    expiredCheck(ronzz, m, groupId)

    if (db.data.topup[sender] !== undefined && !fromMe && chats !== "") {
      if (db.data.topup[sender].session == "INPUT-TUJUAN") {
        if (db.data.topup[sender].data.operator == "TPG Diamond Mobile Legends" || db.data.topup[sender].data.operator == "TPT Life After Credit") {
          if (!chats.split(" ")[1]) return reply("Untuk produk Mobile Legends dan LifeAfter penggunaannya seperti dibawah ini\nContoh:\n12345678 (12345) ❌\n12345678 12345 ✅")
          let userId = chats.split(" ")[0]
          let zoneId = chats.split(" ")[1]
          let nickname = ""

          if (db.data.topup[sender].data.operator == "TPG Diamond Mobile Legends") {
            let cekMl = await cekNick("mobile-legends", userId, zoneId)
            nickname = cekMl.nickname
          } else if (db.data.topup[sender].data.operator == "TPG Life After Credit") {
            let zoneIdLife = ""

            if (isNaN(zoneId)) {
              let cekLife = await cekNick("life-after", userId, zoneId)
              zoneId = cekLife.server
              nickname = cekLife.nickname
            } else {
              switch (zoneId) {
                case '500001':
                  zoneIdLife = "miskatown"
                  break
                case '500002':
                  zoneIdLife = "sandcastle"
                  break
                case '500003':
                  zoneIdLife = "mouthswamp"
                  break
                case '500004':
                  zoneIdLife = "redwoodtown"
                  break
                case '500005':
                  zoneIdLife = "obelisk"
                  break
                case '500006':
                  zoneIdLife = "newland"
                  break
                case '500007':
                  zoneIdLife = "chaosoutpost"
                  break
                case '500008':
                  zoneIdLife = "ironstride"
                  break
                case '500009':
                  zoneIdLife = "crystalthornsea"
                  break
                case '510001':
                  zoneIdLife = "fallforest"
                  break
                case '510002':
                  zoneIdLife = "mountsnow"
                  break
                case '520001':
                  zoneIdLife = "nancycity"
                  break
                case '520002':
                  zoneIdLife = "charlestown"
                  break
                case '520003':
                  zoneIdLife = "snowhighlands"
                  break
                case '520004':
                  zoneIdLife = "santopany"
                  break
                case '520005':
                  zoneIdLife = "levincity"
                  break
                case '520006':
                  zoneIdLife = "milestone"
                  break
                case '520007':
                  zoneIdLife = "chaoscity"
                  break
                case '520008':
                  zoneIdLife = "twinislands"
                  break
                case '520009':
                  zoneIdLife = "hopewall"
                  break
                case '520010':
                  zoneIdLife = "labyrinthsea"
                  break
              }

              let cekLife = await cekNick("life-after", userId, zoneIdLife)
              nickname = cekLife.nickname
            }
          }

          let teks = `*🧾 KONFIRMASI TOPUP 🧾*\n\n*Kode Produk:* ${db.data.topup[sender].data.code}\n*User Id:* ${userId} (${zoneId})\n*Nickname:* ${nickname}\n\n「  DETAIL PRODUCT ✅  」\n*Kategori:* ${db.data.topup[sender].data.category}\n*Produk:* ${db.data.topup[sender].data.name}\n*Harga:* Rp${toRupiah(db.data.topup[sender].data.price)}\n\nPeriksa apakah inputan sudah benar, jika salah maka akan gagal.`
          if (isAndroid) {
            ronzz.sendMessage(from, {
              footer: `${botName} © ${ownerName}`,
              buttons: [
                {
                  buttonId: 'lanjut_topup', buttonText: { displayText: 'Lanjut' }, type: 1,
                }, {
                  buttonId: 'batal_topup', buttonText: { displayText: 'Batal' }, type: 1,
                }
              ],
              headerType: 1,
              viewOnce: true,
              image: fs.readFileSync(thumbnail),
              caption: teks,
              contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                mentionedJid: parseMention(teks),
                externalAdReply: {
                  title: botName,
                  body: `By ${ownerName}`,
                  thumbnailUrl: ppuser,
                  sourceUrl: '',
                  mediaType: 1,
                  renderLargerThumbnail: false
                }
              }
            }, { quoted: m })
          } else {
            ronzz.sendMessage(from, {
              text: teks,
              footer: `${botName} © ${ownerName}`,
              buttonText: "Klik untuk memilih opsi",
              sections: [
                {
                  title: "OPSI TOPUP",
                  rows: [
                    {
                      title: "Lanjut",
                      rowId: "lanjut_topup",
                      description: "Untuk melanjutkan proses topup"
                    },
                    {
                      title: "Batal",
                      rowId: "batal_topup",
                      description: "Untuk membatalkan proses topup"
                    }
                  ]
                }
              ]
            }, { quoted: m })
          }
          db.data.topup[sender].data.id = chats.split(" ")[0]
          db.data.topup[sender].data.zone = chats.split(" ")[1]
          db.data.topup[sender].data.nickname = nickname
        } else if (db.data.topup[sender].data.category == "Games") {
          let nickname = ""
          if (db.data.topup[sender].data.operator == "TPG Diamond Free Fire" || db.data.topup[sender].data.operator == "TPG Free Fire Denom Unik") {
            nickname = await cekNick("free-fire", chats)
          } else if (db.data.topup[sender].data.operator == "TPG Game Mobile PUBG") {
            nickname = await cekNick("pubg-mobile", chats)
          } else if (db.data.topup[sender].data.operator == "TPG Goldstar Super Sus") {
            nickname = await cekNick("super-sus", chats)
          } else if (db.data.topup[sender].data.operator == "TPG Honor of Kings") {
            nickname = await cekNick("honor-of-kings", chats)
          } else if (db.data.topup[sender].data.operator == "TPG Call Of Duty") {
            nickname = await cekNick("call-of-duty-mobile", chats)
          } else if (db.data.topup[sender].data.operator == "TPG Point Blank Zepetto") {
            nickname = await cekNick("point-blank", chats)
          } else if (db.data.topup[sender].data.operator == "TPG Genshin Impact Crystals") {
            let cekGenshin = await cekNick("genshin-impact", chats)
            nickname = cekGenshin.nickname
          } else if (db.data.topup[sender].data.operator == "TPG Candy Sausage Man") {
            nickname = await cekNick("sausage-man", chats)
          } else if (db.data.topup[sender].data.operator == "TPG Valorant Points") {
            nickname = await cekNick("valorant", chats)
          } else {
            nickname = ""
          }

          let teks = `*🧾 KONFIRMASI TOPUP 🧾*\n\n*Kode Produk:* ${db.data.topup[sender].data.code}\n*User Id:* ${chats}\n*Nickname:* ${nickname}\n\n「  DETAIL PRODUCT ✅  」\n*Kategori:* ${db.data.topup[sender].data.category}\n*Produk:* ${db.data.topup[sender].data.name}\n*Harga:* Rp${toRupiah(db.data.topup[sender].data.price)}\n\nPeriksa apakah inputan sudah benar, jika salah maka akan gagal.`
          if (isAndroid) {
            ronzz.sendMessage(from, {
              footer: `${botName} © ${ownerName}`,
              buttons: [
                {
                  buttonId: 'lanjut_topup', buttonText: { displayText: 'Lanjut' }, type: 1,
                }, {
                  buttonId: 'batal_topup', buttonText: { displayText: 'Batal' }, type: 1,
                }
              ],
              headerType: 1,
              viewOnce: true,
              image: fs.readFileSync(thumbnail),
              caption: teks,
              contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                mentionedJid: parseMention(teks),
                externalAdReply: {
                  title: botName,
                  body: `By ${ownerName}`,
                  thumbnailUrl: ppuser,
                  sourceUrl: '',
                  mediaType: 1,
                  renderLargerThumbnail: false
                }
              }
            }, { quoted: m })
          } else {
            ronzz.sendMessage(from, {
              text: teks,
              footer: `${botName} © ${ownerName}`,
              buttonText: "Klik untuk memilih opsi",
              sections: [
                {
                  title: "OPSI TOPUP",
                  rows: [
                    {
                      title: "Lanjut",
                      rowId: "lanjut_topup",
                      description: "Untuk melanjutkan proses topup"
                    },
                    {
                      title: "Batal",
                      rowId: "batal_topup",
                      description: "Untuk membatalkan proses topup"
                    }
                  ]
                }
              ]
            }, { quoted: m })
          }
          db.data.topup[sender].data.id = chats
          db.data.topup[sender].data.nickname = nickname
        } else if (db.data.topup[sender].data.category == "E-Wallet") {
          let nickname = ""
          if (db.data.topup[sender].data.operator == "Top Up Saldo DANA") {
            nickname = await cekNick("dana", chats)
          } else if (db.data.topup[sender].data.operator == "Top Up Saldo Gopay Customer") {
            nickname = await cekNick("gopay", chats)
          } else if (db.data.topup[sender].data.operator == "Top Up Saldo GRAB Customer" || db.data.topup[sender].data.operator == "Top Up Saldo GRAB Voucher") {
            nickname = await cekNick("grab", chats)
          } else if (db.data.topup[sender].data.operator == "Top Up Saldo GRAB Driver") {
            nickname = await cekNick("grab-driver", chats)
          } else if (db.data.topup[sender].data.operator == "Top Up Saldo iSaku Indomaret") {
            nickname = await cekNick("isaku", chats)
          } else if (db.data.topup[sender].data.operator == "Top Up Saldo LinkAja") {
            nickname = await cekNick("linkaja", chats)
          } else if (db.data.topup[sender].data.operator == "Top Up Saldo OVO Admin") {
            nickname = await cekNick("ovo", chats)
          } else if (db.data.topup[sender].data.operator == "Top Up Saldo Shopee Admin") {
            nickname = await cekNick("shopee-pay", chats)
          } else {
            nickname = ""
          }

          let teks = `*🧾 KONFIRMASI TOPUP 🧾*\n\n*Kode Produk:* ${db.data.topup[sender].data.code}\n*Nomor:* ${chats}\n*Nickname:* ${nickname}\n\n「  DETAIL PRODUCT ✅  」\n*Kategori:* ${db.data.topup[sender].data.category}\n*Produk:* ${db.data.topup[sender].data.name}\n*Harga:* Rp${toRupiah(db.data.topup[sender].data.price)}\n\nPeriksa apakah inputan sudah benar, jika salah maka akan gagal.`
          if (isAndroid) {
            ronzz.sendMessage(from, {
              footer: `${botName} © ${ownerName}`,
              buttons: [
                {
                  buttonId: 'lanjut_topup', buttonText: { displayText: 'Lanjut' }, type: 1,
                }, {
                  buttonId: 'batal_topup', buttonText: { displayText: 'Batal' }, type: 1,
                }
              ],
              headerType: 1,
              viewOnce: true,
              image: fs.readFileSync(thumbnail),
              caption: teks,
              contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                mentionedJid: parseMention(teks),
                externalAdReply: {
                  title: botName,
                  body: `By ${ownerName}`,
                  thumbnailUrl: ppuser,
                  sourceUrl: '',
                  mediaType: 1,
                  renderLargerThumbnail: false
                }
              }
            }, { quoted: m })
          } else {
            ronzz.sendMessage(from, {
              text: teks,
              footer: `${botName} © ${ownerName}`,
              buttonText: "Klik untuk memilih opsi",
              sections: [
                {
                  title: "OPSI TOPUP",
                  rows: [
                    {
                      title: "Lanjut",
                      rowId: "lanjut_topup",
                      description: "Untuk melanjutkan proses topup"
                    },
                    {
                      title: "Batal",
                      rowId: "batal_topup",
                      description: "Untuk membatalkan proses topup"
                    }
                  ]
                }
              ]
            }, { quoted: m })
          }
          db.data.topup[sender].data.id = chats
          db.data.topup[sender].data.nickname = nickname
        } else if (db.data.topup[sender].data.category == "Token PLN") {
          let nickname = await cekNick("pln", chats)

          let teks = `*🧾 KONFIRMASI TOPUP 🧾*\n\n*Kode Produk:* ${db.data.topup[sender].data.code}\n*Nomor PLN:* ${chats}\n*Nickname:* ${nickname}\n\n「  DETAIL PRODUCT ✅  」\n*Kategori:* ${db.data.topup[sender].data.category}\n*Produk:* ${db.data.topup[sender].data.name}\n*Harga:* Rp${toRupiah(db.data.topup[sender].data.price)}\n\nPeriksa apakah inputan sudah benar, jika salah maka akan gagal.`
          ronzz.sendMessage(from, {
            footer: `${botName} © ${ownerName}`,
            buttons: [
              {
                buttonId: 'lanjut_topup', buttonText: { displayText: 'Lanjut' }, type: 1,
              }, {
                buttonId: 'batal_topup', buttonText: { displayText: 'Batal' }, type: 1,
              }
            ],
            headerType: 1,
            viewOnce: true,
            image: fs.readFileSync(thumbnail),
            caption: teks,
            contextInfo: {
              forwardingScore: 999,
              isForwarded: true,
              mentionedJid: parseMention(teks),
              externalAdReply: {
                title: botName,
                body: `By ${ownerName}`,
                thumbnailUrl: ppuser,
                sourceUrl: '',
                mediaType: 1,
                renderLargerThumbnail: false
              }
            }
          }, { quoted: m })
          db.data.topup[sender].data.id = chats
          db.data.topup[sender].data.nickname = nickname
        } else {
          let teks = `*🧾 KONFIRMASI TOPUP 🧾*\n\n*Kode Produk:* ${db.data.topup[sender].data.code}\n*Tujuan:* ${chats}\n\n「  DETAIL PRODUCT ✅  」\n*Kategori:* ${db.data.topup[sender].data.category}\n*Produk:* ${db.data.topup[sender].data.name}\n*Harga:* Rp${toRupiah(db.data.topup[sender].data.price)}\n\nPeriksa apakah inputan sudah benar, jika salah maka akan gagal.`
          if (isAndroid) {
            ronzz.sendMessage(from, {
              footer: `${botName} © ${ownerName}`,
              buttons: [
                {
                  buttonId: 'lanjut_topup', buttonText: { displayText: 'Lanjut' }, type: 1,
                }, {
                  buttonId: 'batal_topup', buttonText: { displayText: 'Batal' }, type: 1,
                }
              ],
              headerType: 1,
              viewOnce: true,
              image: fs.readFileSync(thumbnail),
              caption: teks,
              contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                mentionedJid: parseMention(teks),
                externalAdReply: {
                  title: botName,
                  body: `By ${ownerName}`,
                  thumbnailUrl: ppuser,
                  sourceUrl: '',
                  mediaType: 1,
                  renderLargerThumbnail: false
                }
              }
            }, { quoted: m })
          } else {
            ronzz.sendMessage(from, {
              text: teks,
              footer: `${botName} © ${ownerName}`,
              buttonText: "Klik untuk memilih opsi",
              sections: [
                {
                  title: "OPSI TOPUP",
                  rows: [
                    {
                      title: "Lanjut",
                      rowId: "lanjut_topup",
                      description: "Untuk melanjutkan proses topup"
                    },
                    {
                      title: "Batal",
                      rowId: "batal_topup",
                      description: "Untuk membatalkan proses topup"
                    }
                  ]
                }
              ]
            }, { quoted: m })
          }
          db.data.topup[sender].data.id = chats
        }
        db.data.topup[sender].session = "KONFIRMASI-TOPUP"
      } else if (db.data.topup[sender].session == "KONFIRMASI-TOPUP") {
        if (command == "lanjut_topup") {
          if (db.data.users[sender].saldo < db.data.topup[sender].data.price) {
            db.data.topup[sender].payment = "QRIS"
            reply("Saldo kamu tidak mencukupi untuk melakukan transaksi ini, sesaat lagi bot akan mengirimkan Pembayaran Otomatis.")

            let amount = Number(db.data.topup[sender].data.price)
            let fee = Number(digit())

            let pay = await createDeposit(amount + fee, `./options/sticker/${db.data.topup[sender].id}`)
            db.data.topup[sender].reffId = pay.reff_id
            fee = fee + Number(pay.fee)

            let time = Date.now() + toMs("10m");
            let expirationTime = new Date(time);
            let timeLeft = Math.max(0, Math.floor((expirationTime - new Date()) / 60000));
            let currentTime = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
            let expireTimeJakarta = new Date(currentTime.getTime() + timeLeft * 60000);
            let hours = expireTimeJakarta.getHours().toString().padStart(2, '0');
            let minutes = expireTimeJakarta.getMinutes().toString().padStart(2, '0');
            let formattedTime = `${hours}:${minutes}`

            await sleep(500)
            let cap
            if (db.data.topup[sender].data.operator == "TPG Diamond Mobile Legends" || db.data.topup[sender].data.operator == "TPT Life After Credit") {
              cap = `*🧾 MENUNGGU PEMBAYARAN 🧾*\n\n*Kode Produk:* ${db.data.topup[sender].data.code}\n*User Id:* ${db.data.topup[sender].data.id} (${db.data.topup[sender].data.zone})\n*Nickname:* ${db.data.topup[sender].data.nickname}\n\n「  DETAIL PRODUCT ✅  」\n*Kategori:* ${db.data.topup[sender].data.category}\n*Produk:* ${db.data.topup[sender].data.name}\n*Harga:* Rp${toRupiah(amount)}\n*Fee Qris:* Rp${fee}\n*Total Harga:* Rp${toRupiah(amount + fee)}\n*Waktu:* ${timeLeft} menit\n\nSilahkan scan Qris di atas sebelum ${formattedTime} untuk melakukan pembayaran.\n`
            } else if (db.data.topup[sender].data.category == "Games") {
              cap = `*🧾 MENUNGGU PEMBAYARAN 🧾*\n\n*Kode Produk:* ${db.data.topup[sender].data.code}\n*User Id:* ${db.data.topup[sender].data.id}\n*Nickname:* ${db.data.topup[sender].data.nickname}\n\n「  DETAIL PRODUCT ✅  」\n*Kategori:* ${db.data.topup[sender].data.category}\n*Produk:* ${db.data.topup[sender].data.name}\n*Harga:* Rp${toRupiah(amount)}\n*Fee Qris:* Rp${fee}\n*Total Harga:* Rp${toRupiah(amount + fee)}\n*Waktu:* ${timeLeft} menit\n\nSilahkan scan Qris di atas sebelum ${formattedTime} untuk melakukan pembayaran.\n`
            } else if (db.data.topup[sender].data.category == "E-Wallet") {
              cap = `*🧾 MENUNGGU PEMBAYARAN 🧾*\n\n*Kode Produk:* ${db.data.topup[sender].data.code}\n*Nomor:* ${db.data.topup[sender].data.id}\n*Nickname:* ${db.data.topup[sender].data.nickname}\n\n「  DETAIL PRODUCT ✅  」\n*Kategori:* ${db.data.topup[sender].data.category}\n*Produk:* ${db.data.topup[sender].data.name}\n*Harga:* Rp${toRupiah(amount)}\n*Fee Qris:* Rp${fee}\n*Total Harga:* Rp${toRupiah(amount + fee)}\n*Waktu:* ${timeLeft} menit\n\nSilahkan scan Qris di atas sebelum ${formattedTime} untuk melakukan pembayaran.\n`
            } else if (db.data.topup[sender].data.category == "Token PLN") {
              cap = `*🧾 MENUNGGU PEMBAYARAN 🧾*\n\n*Kode Produk:* ${db.data.topup[sender].data.code}\n*Nomor PLN:* ${db.data.topup[sender].data.id}\n*Nickname:* ${db.data.topup[sender].data.nickname}\n\n「  DETAIL PRODUCT ✅  」\n*Kategori:* ${db.data.topup[sender].data.category}\n*Produk:* ${db.data.topup[sender].data.name}\n*Harga:* Rp${toRupiah(amount)}\n*Fee Qris:* Rp${fee}\n*Total Harga:* Rp${toRupiah(amount + fee)}\n*Waktu:* ${timeLeft} menit\n\nSilahkan scan Qris di atas sebelum ${formattedTime} untuk melakukan pembayaran.\n`
            } else {
              cap = `*🧾 MENUNGGU PEMBAYARAN 🧾*\n\n*Kode Produk:* ${db.data.topup[sender].data.code}\n*Tujuan:* ${db.data.topup[sender].data.id}\n\n「  DETAIL PRODUCT ✅  」\n*Kategori:* ${db.data.topup[sender].data.category}\n*Produk:* ${db.data.topup[sender].data.name}\n*Harga:* Rp${toRupiah(amount)}\n*Fee Qris:* Rp${fee}\n*Total Harga:* Rp${toRupiah(amount + fee)}\n*Waktu:* ${timeLeft} menit\n\nSilahkan scan Qris di atas sebelum ${formattedTime} untuk melakukan pembayaran.\n`
            }
            let mess = await ronzz.sendMessage(from, { image: fs.readFileSync(pay.path), caption: cap }, { quoted: m })

            let statusPay = false
            while (!statusPay) {
              await sleep(10 * 1000)
              if (Date.now() >= time) {
                statusPay = true
                await ronzz.sendMessage(from, { delete: mess.key })
                await cancelDeposit(pay.reff_id)
                reply("Transaksi dibatalkan karena telah melewati batas expired.")
                delete db.data.topup[sender]
              }
              try {
                let dataDepo = await statusDeposit(pay.reff_id)

                if (dataDepo.status == "Success") {
                  statusPay = true
                  await ronzz.sendMessage(from, { delete: mess.key })
                  let signature = crypto
                    .createHash('md5')
                    .update(api_id + api_key + db.data.topup[sender].id)
                    .digest('hex')

                  let keysOrder = new URLSearchParams({
                    'api_key': api_key,
                    'sign': signature,
                    'reff_id': db.data.topup[sender].id,
                    'code': db.data.topup[sender].data.code,
                    'target': `${db.data.topup[sender].data.id}${db.data.topup[sender].data.zone}`
                  })

                  await fetch('https://arfystore.shop/api/transaksi/create', {
                    'headers': {
                      'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    'method': 'POST',
                    'body': keysOrder
                  })
                    .then(response => response.json())
                    .then(async res => {
                      if (!res.result) {
                        if (isAndroid) {
                          ronzz.sendMessage(from, {
                            footer: `${botName} © ${ownerName}`,
                            buttons: [
                              {
                                buttonId: 'saldo', buttonText: { displayText: 'Saldo' }, type: 1,
                              }
                            ],
                            headerType: 1,
                            viewOnce: true,
                            image: fs.readFileSync(thumbnail),
                            caption: `Pesanan dibatalkan!\nAlasan: ${res.message}\n\nUang akan dimasukkan ke saldo Anda`,
                            contextInfo: {
                              forwardingScore: 999,
                              isForwarded: true,
                              externalAdReply: {
                                title: botName,
                                body: `By ${ownerName}`,
                                thumbnailUrl: ppuser,
                                sourceUrl: '',
                                mediaType: 1,
                                renderLargerThumbnail: false
                              }
                            }
                          }, { quoted: m })
                        } else {
                          ronzz.sendMessage(from, {
                            text: `Pesanan dibatalkan!\nAlasan: ${res.message}\n\nUang akan dimasukkan ke saldo Anda`,
                            footer: `${botName} © ${ownerName}`,
                            buttonText: "Klik untuk melihat saldo",
                            sections: [
                              {
                                title: "INFORMASI ANDA",
                                rows: [
                                  {
                                    title: "Saldo",
                                    rowId: ".saldo"
                                  }
                                ]
                              }
                            ]
                          }, { quoted: m })
                        }
                        db.data.users[sender].saldo += db.data.topup[sender].data.price
                        delete db.data.topup[sender]
                      } else {
                        if (db.data.topup[sender].data.operator == "TPG Diamond Mobile Legends") {
                          await Reply(`*⏳「 TRANSAKSI PENDING 」⏳*\n*${db.data.topup[sender].data.name}*\n\n*» Reff Id:* ${db.data.topup[sender].id}\n*» User Id:* ${db.data.topup[sender].data.id} (${db.data.topup[sender].data.zone})\n*» Nickname:* ${db.data.topup[sender].data.nickname}\n*» Harga:* Rp${toRupiah(db.data.topup[sender].data.price)}\n*» Fee Qris:* Rp${fee}\n*» Total Bayar:* Rp${toRupiah(amount + fee)}\n\n_Harap ditunggu ya kak._`)
                        } else if (db.data.topup[sender].data.category == "Games") {
                          await Reply(`*⏳「 TRANSAKSI PENDING 」⏳*\n*${db.data.topup[sender].data.name}*\n\n*» Reff Id:* ${db.data.topup[sender].id}\n*» User Id:* ${db.data.topup[sender].data.id}\n*» Nickname:* ${db.data.topup[sender].data.nickname}\n*» Harga:* Rp${toRupiah(db.data.topup[sender].data.price)}\n*» Fee Qris:* Rp${fee}\n*» Total Bayar:* Rp${toRupiah(amount + fee)}\n\n_Harap ditunggu ya kak._`)
                        } else if (db.data.topup[sender].data.category == "E-Wallet") {
                          await Reply(`*⏳「 TRANSAKSI PENDING 」⏳*\n*${db.data.topup[sender].data.name}*\n\n*» Reff Id:* ${db.data.topup[sender].id}\n*» Nomor:* ${db.data.topup[sender].data.id}\n*» Nickname:* ${db.data.topup[sender].data.nickname}\n*» Harga:* Rp${toRupiah(db.data.topup[sender].data.price)}\n*» Fee Qris:* Rp${fee}\n*» Total Bayar:* Rp${toRupiah(amount + fee)}\n\n_Harap ditunggu ya kak._`)
                        } else if (db.data.topup[sender].data.category == "Token PLN") {
                          await Reply(`*⏳「 TRANSAKSI PENDING 」⏳*\n*${db.data.topup[sender].data.name}*\n\n*» Reff Id:* ${db.data.topup[sender].id}\n*» Nomor PLN:* ${db.data.topup[sender].data.id}\n*» Nickname:* ${db.data.topup[sender].data.nickname}\n*» Harga:* Rp${toRupiah(db.data.topup[sender].data.price)}\n*» Fee Qris:* Rp${fee}\n*» Total Bayar:* Rp${toRupiah(amount + fee)}\n\n_Harap ditunggu ya kak._`)
                        } else {
                          await Reply(`*⏳「 TRANSAKSI PENDING 」⏳*\n*${db.data.topup[sender].data.name}*\n\n*» Reff Id:* ${db.data.topup[sender].id}\n*» Tujuan:* ${db.data.topup[sender].data.id}\n*» Harga:* Rp${toRupiah(db.data.topup[sender].data.price)}\n*» Fee Qris:* Rp${fee}\n*» Total Bayar:* Rp${toRupiah(amount + fee)}\n\n_Harap ditunggu ya kak._`)
                        }
                      }

                      while (db.data.topup[sender] !== undefined) {
                        let signatureStatus = crypto
                          .createHash('md5')
                          .update(api_id + api_key)
                          .digest('hex')

                        let keysStatus = new URLSearchParams({
                          'api_key': api_key,
                          'sign': signatureStatus,
                          'reff_id': db.data.topup[sender].id
                        })

                        await fetch('https://arfystore.shop/api/transaksi/status', {
                          'headers': {
                            'Content-Type': 'application/x-www-form-urlencoded'
                          },
                          'method': 'POST',
                          'body': keysStatus
                        })
                          .then(response => response.json())
                          .then(async resStatus => {

                            if (resStatus.data.status == "Success") {
                              if (db.data.topup[sender].data.operator == "TPG Diamond Mobile Legends") {
                                await Reply(`*✅「 TRANSAKSI SUKSES 」✅*\n*${db.data.topup[sender].data.name}*\n\n*» Reff Id:* ${db.data.topup[sender].id}\n*» User Id:* ${db.data.topup[sender].data.id} (${db.data.topup[sender].data.zone})\n*» Nickname:* ${db.data.topup[sender].data.nickname}\n*» Harga:* Rp${toRupiah(db.data.topup[sender].data.price)}\n*» Fee Qris:* Rp${fee}\n*» Total Bayar:* Rp${toRupiah(amount + fee)}\n\n*» SN:*\n${resStatus.data.sn}\n\n_Terimakasih kak sudah order.️_`)
                              } else if (db.data.topup[sender].data.category == "Games") {
                                await Reply(`*✅「 TRANSAKSI SUKSES 」✅*\n*${db.data.topup[sender].data.name}*\n\n*» Reff Id:* ${db.data.topup[sender].id}\n*» User Id:* ${db.data.topup[sender].data.id}\n*» Nickname:* ${db.data.topup[sender].data.nickname}\n*» Harga:* Rp${toRupiah(db.data.topup[sender].data.price)}\n*» Fee Qris:* Rp${fee}\n*» Total Bayar:* Rp${toRupiah(amount + fee)}\n\n*» SN:*\n${resStatus.data.sn}\n\n_Terimakasih kak sudah order.️_`)
                              } else if (db.data.topup[sender].data.category == "E-Wallet") {
                                await Reply(`*✅「 TRANSAKSI SUKSES 」✅*\n*${db.data.topup[sender].data.name}*\n\n*» Reff Id:* ${db.data.topup[sender].id}\n*» Nomor:* ${db.data.topup[sender].data.id}\n*» Nickname:* ${db.data.topup[sender].data.nickname}\n*» Harga:* Rp${toRupiah(db.data.topup[sender].data.price)}\n*» Fee Qris:* Rp${fee}\n*» Total Bayar:* Rp${toRupiah(amount + fee)}\n\n*» SN:*\n${resStatus.data.sn}\n\n_Terimakasih kak sudah order.️_`)
                              } else if (db.data.topup[sender].data.category == "Token PLN") {
                                await Reply(`*✅「 TRANSAKSI SUKSES 」✅*\n*${db.data.topup[sender].data.name}*\n\n*» Reff Id:* ${db.data.topup[sender].id}\n*» Nomor PLN:* ${db.data.topup[sender].data.id}\n*» Nickname:* ${db.data.topup[sender].data.nickname}\n*» Harga:* Rp${toRupiah(db.data.topup[sender].data.price)}\n*» Fee Qris:* Rp${fee}\n*» Total Bayar:* Rp${toRupiah(amount + fee)}\n\n*» SN:*\n${resStatus.data.sn}\n\n_Terimakasih kak sudah order.️_`)
                              } else {
                                await Reply(`*✅「 TRANSAKSI SUKSES 」✅*\n*${db.data.topup[sender].data.name}*\n\n*» Reff Id:* ${db.data.topup[sender].id}\n*» Tujuan:* ${db.data.topup[sender].data.id}\n*» Harga:* Rp${toRupiah(db.data.topup[sender].data.price)}\n*» Fee Qris:* Rp${fee}\n*» Total Bayar:* Rp${toRupiah(amount + fee)}\n\n*» SN:*\n${resStatus.data.sn}\n\n_Terimakasih kak sudah order.️_`)
                              }
                              delete db.data.topup[sender]
                            }
                            if (resStatus.data.status == "Canceled") {
                              db.data.users[sender].saldo += db.data.topup[sender].data.price
                              if (isAndroid) {
                                ronzz.sendMessage(from, {
                                  footer: `${botName} © ${ownerName}`,
                                  buttons: [
                                    {
                                      buttonId: 'saldo', buttonText: { displayText: 'Saldo' }, type: 1,
                                    }
                                  ],
                                  headerType: 1,
                                  viewOnce: true,
                                  image: fs.readFileSync(thumbnail),
                                  caption: `Pesanan dibatalkan!\nAlasan: ${resStatus.message}\n\nUang akan dimasukkan ke saldo Anda`,
                                  contextInfo: {
                                    forwardingScore: 999,
                                    isForwarded: true,
                                    externalAdReply: {
                                      title: botName,
                                      body: `By ${ownerName}`,
                                      thumbnailUrl: ppuser,
                                      sourceUrl: '',
                                      mediaType: 1,
                                      renderLargerThumbnail: false
                                    }
                                  }
                                }, { quoted: m })
                              } else {
                                ronzz.sendMessage(from, {
                                  text: `Pesanan dibatalkan!\nAlasan: ${resStatus.message}\n\nUang akan dimasukkan ke saldo Anda`,
                                  footer: `${botName} © ${ownerName}`,
                                  buttonText: "Klik untuk melihat saldo",
                                  sections: [
                                    {
                                      title: "INFORMASI ANDA",
                                      rows: [
                                        {
                                          title: "Saldo",
                                          rowId: ".saldo"
                                        }
                                      ]
                                    }
                                  ]
                                }, { quoted: m })
                              }
                              delete db.data.topup[sender]
                            }
                          })
                        await sleep(5 * 1000)
                      }
                    })
                }
              } catch (err) {
                statusPay = true
                await ronzz.sendMessage(from, { delete: mess.key })
                await cancelDeposit(pay.reff_id)
                reply("Server maintenance, silahkan hubungi owner!")
                console.log("Error checking transaction status:", err);
                delete db.data.topup[sender]
              }
            }
            fs.unlinkSync(pay.path)
          } else if (db.data.users[sender].saldo >= db.data.topup[sender].data.price) {
            let signature = crypto
              .createHash('md5')
              .update(api_id + api_key + db.data.topup[sender].id)
              .digest('hex')

            let keysOrder = new URLSearchParams({
              'api_key': api_key,
              'sign': signature,
              'reff_id': db.data.topup[sender].id,
              'code': db.data.topup[sender].data.code,
              'target': `${db.data.topup[sender].data.id}${db.data.topup[sender].data.zone}`
            })

            await fetch('https://arfystore.shop/api/transaksi/create', {
              'headers': {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              'method': 'POST',
              'body': keysOrder
            })
              .then(response => response.json())
              .then(async res => {
                if (!res.result) {
                  if (isAndroid) {
                    ronzz.sendMessage(from, {
                      footer: `${botName} © ${ownerName}`,
                      buttons: [
                        {
                          buttonId: 'saldo', buttonText: { displayText: 'Saldo' }, type: 1,
                        }
                      ],
                      headerType: 1,
                      viewOnce: true,
                      image: fs.readFileSync(thumbnail),
                      caption: `Pesanan dibatalkan!\nAlasan: ${res.message}\n\nUang akan dimasukkan ke saldo Anda`,
                      contextInfo: {
                        forwardingScore: 999,
                        isForwarded: true,
                        externalAdReply: {
                          title: botName,
                          body: `By ${ownerName}`,
                          thumbnailUrl: ppuser,
                          sourceUrl: '',
                          mediaType: 1,
                          renderLargerThumbnail: false
                        }
                      }
                    }, { quoted: m })
                  } else {
                    ronzz.sendMessage(from, {
                      text: `Pesanan dibatalkan!\nAlasan: ${res.message}\n\nUang akan dimasukkan ke saldo Anda`,
                      footer: `${botName} © ${ownerName}`,
                      buttonText: "Klik untuk melihat saldo",
                      sections: [
                        {
                          title: "INFORMASI ANDA",
                          rows: [
                            {
                              title: "Saldo",
                              rowId: ".saldo"
                            }
                          ]
                        }
                      ]
                    }, { quoted: m })
                  }
                  delete db.data.topup[sender]
                } else {
                  if (db.data.topup[sender].data.operator == "TPG Diamond Mobile Legends") {
                    await Reply(`*⏳「 TRANSAKSI PENDING 」⏳*\n*${db.data.topup[sender].data.name}*\n\n*» Reff Id:* ${db.data.topup[sender].id}\n*» User Id:* ${db.data.topup[sender].data.id} (${db.data.topup[sender].data.zone})\n*» Nickname:* ${db.data.topup[sender].data.nickname}\n*» Harga:* Rp${toRupiah(db.data.topup[sender].data.price)}\n\n_Harap ditunggu ya kak._`)
                  } else if (db.data.topup[sender].data.category == "Games") {
                    await Reply(`*⏳「 TRANSAKSI PENDING 」⏳*\n*${db.data.topup[sender].data.name}*\n\n*» Reff Id:* ${db.data.topup[sender].id}\n*» User Id:* ${db.data.topup[sender].data.id}\n*» Nickname:* ${db.data.topup[sender].data.nickname}\n*» Harga:* Rp${toRupiah(db.data.topup[sender].data.price)}\n\n_Harap ditunggu ya kak._`)
                  } else if (db.data.topup[sender].data.category == "E-Wallet") {
                    await Reply(`*⏳「 TRANSAKSI PENDING 」⏳*\n*${db.data.topup[sender].data.name}*\n\n*» Reff Id:* ${db.data.topup[sender].id}\n*» Nomor:* ${db.data.topup[sender].data.id}\n*» Nickname:* ${db.data.topup[sender].data.nickname}\n*» Harga:* Rp${toRupiah(db.data.topup[sender].data.price)}\n\n_Harap ditunggu ya kak._`)
                  } else if (db.data.topup[sender].data.category == "Token PLN") {
                    await Reply(`*⏳「 TRANSAKSI PENDING 」⏳*\n*${db.data.topup[sender].data.name}*\n\n*» Reff Id:* ${db.data.topup[sender].id}\n*» Nomor PLN:* ${db.data.topup[sender].data.id}\n*» Nickname:* ${db.data.topup[sender].data.nickname}\n*» Harga:* Rp${toRupiah(db.data.topup[sender].data.price)}\n\n_Harap ditunggu ya kak._`)
                  } else {
                    await Reply(`*⏳「 TRANSAKSI PENDING 」⏳*\n*${db.data.topup[sender].data.name}*\n\n*» Reff Id:* ${db.data.topup[sender].id}\n*» Tujuan:* ${db.data.topup[sender].data.id}\n*» Harga:* Rp${toRupiah(db.data.topup[sender].data.price)}\n\n_Harap ditunggu ya kak._`)
                  }
                }

                while (db.data.topup[sender] !== undefined) {
                  let signatureStatus = crypto
                    .createHash('md5')
                    .update(api_id + api_key)
                    .digest('hex')

                  let keysStatus = new URLSearchParams({
                    'api_key': api_key,
                    'sign': signatureStatus,
                    'reff_id': db.data.topup[sender].id
                  })

                  await fetch('https://arfystore.shop/api/transaksi/status', {
                    'headers': {
                      'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    'method': 'POST',
                    'body': keysStatus
                  })
                    .then(response => response.json())
                    .then(async resStatus => {

                      if (resStatus.data.status == "Success") {
                        if (db.data.topup[sender].data.operator == "TPG Diamond Mobile Legends") {
                          await Reply(`*✅「 TRANSAKSI SUKSES 」✅*\n*${db.data.topup[sender].data.name}*\n\n*» Reff Id:* ${db.data.topup[sender].id}\n*» User Id:* ${db.data.topup[sender].data.id} (${db.data.topup[sender].data.zone})\n*» Nickname:* ${db.data.topup[sender].data.nickname}\n*» Harga:* Rp${toRupiah(db.data.topup[sender].data.price)}\n\n*» SN:*\n${resStatus.data.sn}\n\n_Terimakasih kak sudah order.️_`)
                        } else if (db.data.topup[sender].data.category == "Games") {
                          await Reply(`*✅「 TRANSAKSI SUKSES 」✅*\n*${db.data.topup[sender].data.name}*\n\n*» Reff Id:* ${db.data.topup[sender].id}\n*» User Id:* ${db.data.topup[sender].data.id}\n*» Nickname:* ${db.data.topup[sender].data.nickname}\n*» Harga:* Rp${toRupiah(db.data.topup[sender].data.price)}\n\n*» SN:*\n${resStatus.data.sn}\n\n_Terimakasih kak sudah order.️_`)
                        } else if (db.data.topup[sender].data.category == "E-Wallet") {
                          await Reply(`*✅「 TRANSAKSI SUKSES 」✅*\n*${db.data.topup[sender].data.name}*\n\n*» Reff Id:* ${db.data.topup[sender].id}\n*» Nomor:* ${db.data.topup[sender].data.id}\n*» Nickname:* ${db.data.topup[sender].data.nickname}\n*» Harga:* Rp${toRupiah(db.data.topup[sender].data.price)}\n\n*» SN:*\n${resStatus.data.sn}\n\n_Terimakasih kak sudah order.️_`)
                        } else if (db.data.topup[sender].data.category == "Token PLN") {
                          await Reply(`*✅「 TRANSAKSI SUKSES 」✅*\n*${db.data.topup[sender].data.name}*\n\n*» Reff Id:* ${db.data.topup[sender].id}\n*» Nomor PLN:* ${db.data.topup[sender].data.id}\n*» Nickname:* ${db.data.topup[sender].data.nickname}\n*» Harga:* Rp${toRupiah(db.data.topup[sender].data.price)}\n\n*» SN:*\n${resStatus.data.sn}\n\n_Terimakasih kak sudah order.️_`)
                        } else {
                          await Reply(`*✅「 TRANSAKSI SUKSES 」✅*\n*${db.data.topup[sender].data.name}*\n\n*» Reff Id:* ${db.data.topup[sender].id}\n*» Tujuan:* ${db.data.topup[sender].data.id}\n*» Nickname:* ${db.data.topup[sender].data.nickname}\n*» Harga:* Rp${toRupiah(db.data.topup[sender].data.price)}\n\n*» SN:*\n${resStatus.data.sn}\n\n_Terimakasih kak sudah order.️_`)
                        }
                        db.data.users[sender].saldo -= db.data.topup[sender].data.price
                        delete db.data.topup[sender]
                      }
                      if (resStatus.data.status == "Canceled") {
                        if (isAndroid) {
                          ronzz.sendMessage(from, {
                            footer: `${botName} © ${ownerName}`,
                            buttons: [
                              {
                                buttonId: 'saldo', buttonText: { displayText: 'Saldo' }, type: 1,
                              }
                            ],
                            headerType: 1,
                            viewOnce: true,
                            image: fs.readFileSync(thumbnail),
                            caption: `Pesanan dibatalkan!\nAlasan: ${resStatus.message}\n\nUang akan dimasukkan ke saldo Anda`,
                            contextInfo: {
                              forwardingScore: 999,
                              isForwarded: true,
                              externalAdReply: {
                                title: botName,
                                body: `By ${ownerName}`,
                                thumbnailUrl: ppuser,
                                sourceUrl: '',
                                mediaType: 1,
                                renderLargerThumbnail: false
                              }
                            }
                          }, { quoted: m })
                        } else {
                          ronzz.sendMessage(from, {
                            text: `Pesanan dibatalkan!\nAlasan: ${resStatus.message}\n\nUang akan dimasukkan ke saldo Anda`,
                            footer: `${botName} © ${ownerName}`,
                            buttonText: "Klik untuk melihat saldo",
                            sections: [
                              {
                                title: "INFORMASI ANDA",
                                rows: [
                                  {
                                    title: "Saldo",
                                    rowId: ".saldo"
                                  }
                                ]
                              }
                            ]
                          }, { quoted: m })
                        }
                        delete db.data.topup[sender]
                      }
                    })
                  await sleep(5 * 1000)
                }
              })
          }
        } else if (command == "batal_topup") {
          if (db.data.topup[sender].payment == "QRIS") {
            await cancelDeposit(db.data.topup[sender].reffId)
          }
          reply(`Baik kak, topup dengan id *${db.data.topup[sender].id}* dibatalkan.`)
          delete db.data.topup[sender]
        }
      }
    }

    if (command == "payqris") {
      if (db.data.deposit[sender] == undefined) {
        db.data.deposit[sender] = {
          ID: crypto.randomBytes(5).toString("hex").toUpperCase(),
          session: "amount",
          name: pushname,
          date: tanggal,
          number: sender,
          payment: "QRIS",
          data: {
            id: "",
            amount_deposit: "",
            fee: "",
            total_deposit: ""
          }
        }
        reply("Oke kak mau deposit berapa?\n\nContoh: 15000")
      } else {
        if (isAndroid) {
          ronzz.sendMessage(from, {
            footer: `${botName} © ${ownerName}`,
            buttons: [
              { buttonId: 'batal_depo', buttonText: { displayText: 'Batal' }, type: 1 }
            ],
            headerType: 1,
            viewOnce: true,
            text: "Proses deposit kamu masih ada yang belum terselesaikan.",
            contextInfo: {
              forwardingScore: 999,
              isForwarded: true,
              externalAdReply: {
                title: botName,
                body: `By ${ownerName}`,
                thumbnailUrl: ppuser,
                sourceUrl: '',
                mediaType: 1,
                renderLargerThumbnail: false
              }
            }
          }, { quoted: m })
        } else {
          ronzz.sendMessage(from, {
            text: "Proses deposit kamu masih ada yang belum terselesaikan.",
            footer: `${botName} © ${ownerName}`,
            buttonText: "Klik untuk melihat opsi",
            sections: [
              {
                title: 'OPSI DEPOSIT',
                rows: [
                  {
                    title: 'Batal',
                    rowId: 'batal_depo'
                  }
                ]
              }
            ]
          }, { quoted: m })
        }
      }
    }
    if (command == "paywallet") {
      if (db.data.deposit[sender] == undefined) {
        db.data.deposit[sender] = {
          ID: crypto.randomBytes(5).toString("hex").toUpperCase(),
          session: "amount",
          name: pushname,
          date: tanggal,
          number: sender,
          payment: "E-WALLET",
          data: {
            amount_deposit: "",
            fee: "",
            total_deposit: ""
          }
        }
        reply("Oke kak mau deposit berapa?\n\nContoh: 15000")
      } else {
        if (isAndroid) {
          ronzz.sendMessage(from, {
            footer: `${botName} © ${ownerName}`,
            buttons: [
              { buttonId: 'batal_depo', buttonText: { displayText: 'Batal' }, type: 1 }
            ],
            headerType: 1,
            viewOnce: true,
            text: "Proses deposit kamu masih ada yang belum terselesaikan.",
            contextInfo: {
              forwardingScore: 999,
              isForwarded: true,
              externalAdReply: {
                title: botName,
                body: `By ${ownerName}`,
                thumbnailUrl: ppuser,
                sourceUrl: '',
                mediaType: 1,
                renderLargerThumbnail: false
              }
            }
          }, { quoted: m })
        } else {
          ronzz.sendMessage(from, {
            text: "Proses deposit kamu masih ada yang belum terselesaikan.",
            footer: `${botName} © ${ownerName}`,
            buttonText: "Klik untuk melihat opsi",
            sections: [
              {
                title: 'OPSI DEPOSIT',
                rows: [
                  {
                    title: 'Batal',
                    rowId: 'batal_depo'
                  }
                ]
              }
            ]
          }, { quoted: m })
        }
      }
    }

    if (db.data.deposit[sender] !== undefined && !fromMe && chats !== "") {
      if (db.data.deposit[sender].session == "amount") {
        if (isNaN(chats)) return reply("Masukan hanya angka ya")
        let feeDepo = (Number(db.data.persentase["feeDepo"]) / 100) * parseInt(chats)
        let feeQris = feeDepo + Number(digit())
        let fee = db.data.deposit[sender].payment == "QRIS" ? Number(feeQris) : Number(feeDepo)
        if (db.data.deposit[sender].payment == "QRIS") {
          let depo = await createDeposit(parseInt(chats) + parseInt(fee), `./options/sticker/${db.data.deposit[sender].ID}.jpg`)
          fee = parseInt(fee) + parseInt(depo.fee)

          db.data.deposit[sender].data.id = depo.reff_id
        }

        db.data.deposit[sender].data.fee = Number(fee)
        db.data.deposit[sender].data.total_deposit = parseInt(chats) + Number(fee)
        db.data.deposit[sender].data.amount_deposit = parseInt(chats)
        db.data.deposit[sender].session = "konfirmasi_deposit";

        let teks = `*🧾 KONFIRMASI DEPOSIT 🧾*\n\n*ID:* ${db.data.deposit[sender].ID}\n*Nomor:* ${sender.split('@')[0]}\n*Payment:* ${db.data.deposit[sender].payment}\n*Jumlah Deposit:* Rp${toRupiah(parseInt(chats))}\n*Pajak:* Rp${toRupiah(Number(fee))}\n*Total Pembayaran:* Rp${toRupiah(parseInt(chats) + Number(fee))}\n\n_Deposit akan dibatalkan otomatis apabila terdapat kesalahan input._`
        if (isAndroid) {
          ronzz.sendMessage(from, {
            footer: `${botName} © ${ownerName}`,
            buttons: [
              {
                buttonId: 'lanjut_depo', buttonText: { displayText: 'Lanjut' }, type: 1,
              }, {
                buttonId: 'batal_depo', buttonText: { displayText: 'Batal' }, type: 1,
              }
            ],
            headerType: 1,
            viewOnce: true,
            image: fs.readFileSync(thumbnail),
            caption: teks,
            contextInfo: {
              forwardingScore: 999,
              isForwarded: true,
              mentionedJid: parseMention(teks),
              externalAdReply: {
                title: botName,
                body: `By ${ownerName}`,
                thumbnailUrl: ppuser,
                sourceUrl: '',
                mediaType: 1,
                renderLargerThumbnail: false
              }
            }
          }, { quoted: m })
        } else {
          ronzz.sendMessage(from, {
            text: teks,
            footer: `${botName} © ${ownerName}`,
            buttonText: "Klik untuk memilih opsi",
            sections: [
              {
                title: "OPSI DEPOSIT",
                rows: [
                  {
                    title: "Lanjut",
                    rowId: "lanjut_depo",
                    description: "Untuk melanjutkan proses deposit"
                  },
                  {
                    title: "Batal",
                    rowId: "batal_depo",
                    description: "Untuk membatalkan proses deposit"
                  }
                ]
              }
            ]
          }, { quoted: m })
        }
      } else if (db.data.deposit[sender].session === "konfirmasi_deposit") {
        if (command == "lanjut_depo") {
          if (db.data.deposit[sender].payment === "QRIS") {
            let time = Date.now() + toMs("10m");
            let expirationTime = new Date(time);
            let timeLeft = Math.max(0, Math.floor((expirationTime - new Date()) / 60000));
            let currentTime = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
            let expireTimeJakarta = new Date(currentTime.getTime() + timeLeft * 60000);
            let hours = expireTimeJakarta.getHours().toString().padStart(2, '0');
            let minutes = expireTimeJakarta.getMinutes().toString().padStart(2, '0');
            let formattedTime = `${hours}:${minutes}`

            await sleep(500)
            let pyqrs = `*🧾 MENUNGGU PEMBAYARAN 🧾*

Silahkan scan Qris di atas sebelum ${formattedTime} dan transfer dengan nominal yang benar, jika sudah Bot akan otomatis konfirmasi deposit.`
            let mess = await ronzz.sendMessage(from, { image: fs.readFileSync(`./options/sticker/${db.data.deposit[sender].ID}.jpg`), caption: pyqrs }, { quoted: m })

            while (db.data.deposit[sender] !== undefined) {
              await sleep(10 * 1000)
              if (Date.now() >= time) {
                await ronzz.sendMessage(from, { delete: mess.key })
                await cancelDeposit(db.data.deposit[sender].data.id)

                reply("Deposit dibatalkan karena telah melewati batas expired.")

                fs.unlinkSync(`./options/sticker/${db.data.deposit[sender].ID}.jpg`)
                delete db.data.deposit[sender]
              }
              try {
                let dataDepo = await statusDeposit(db.data.deposit[sender].data.id)

                if (dataDepo.status == "Success") {
                  await ronzz.sendMessage(from, { delete: mess.key })

                  let text_sukses = `*✅「 DEPOSIT SUKSES 」✅*

ID: ${db.data.deposit[sender].ID}
Nomer: @${sender.split('@')[0]}
Payment: ${db.data.deposit[sender].payment}
Tanggal: ${db.data.deposit[sender].date}
Jumlah Deposit: Rp${toRupiah(db.data.deposit[sender].data.amount_deposit)}
Pajak: Rp${toRupiah(Number(db.data.deposit[sender].data.fee))}
Total Bayar: Rp${toRupiah(db.data.deposit[sender].data.total_deposit)}`
                  if (isAndroid) {
                    ronzz.sendMessage(from, {
                      footer: `${botName} © ${ownerName}`,
                      buttons: [
                        {
                          buttonId: 'saldo', buttonText: { displayText: 'Saldo' }, type: 1,
                        }
                      ],
                      headerType: 1,
                      viewOnce: true,
                      image: fs.readFileSync(thumbnail),
                      caption: `${text_sukses}\n\n_Deposit kamu telah dikonfirmasi otomatis oleh Bot, silahkan cek saldo Anda.`,
                      contextInfo: {
                        forwardingScore: 999,
                        isForwarded: true,
                        externalAdReply: {
                          title: botName,
                          body: `By ${ownerName}`,
                          thumbnailUrl: ppuser,
                          sourceUrl: '',
                          mediaType: 1,
                          renderLargerThumbnail: false
                        }
                      }
                    }, { quoted: m })
                  } else {
                    ronzz.sendMessage(from, {
                      text: `${text_sukses}\n\n_Deposit kamu telah dikonfirmasi otomatis oleh Bot, silahkan cek saldo Anda.`,
                      footer: `${botName} © ${ownerName}`,
                      buttonText: "Klik untuk melihat saldo",
                      sections: [
                        {
                          title: "INFORMASI ANDA",
                          rows: [
                            {
                              title: "Saldo",
                              rowId: ".saldo"
                            }
                          ]
                        }
                      ]
                    })
                  }
                  await ronzz.sendMessage(ownerNomer + "@s.whatsapp.net", { text: text_sukses, mentions: [sender] })

                  db.data.users[sender].saldo += Number(db.data.deposit[sender].data.amount_deposit)

                  fs.unlinkSync(`./options/sticker/${db.data.deposit[sender].ID}.jpg`)
                  delete db.data.deposit[sender]
                }
              } catch (err) {
                await ronzz.sendMessage(from, { delete: mess.key })
                await cancelDeposit(db.data.deposit[sender].data.id)

                reply("Server maintenance, silahkan hubungi owner!")
                console.log("Error checking transaction status:", err);

                fs.unlinkSync(`./options/sticker/${db.data.deposit[sender].ID}.jpg`)
                delete db.data.deposit[sender]
              }
            }
          } else if (db.data.deposit[sender].payment == "E-WALLET") {
            let py_wallet = `*PAYMENT E-WALLET*

*DANA*
NOMER: ${payment.dana.nope}
A/N: ${payment.dana.an}

*GOPAY*
NOMER: ${payment.gopay.nope}
A/N: ${payment.gopay.an}

*OVO*
NOMER: ${payment.ovo.nope}
A/N: ${payment.ovo.an}

_Silahkan transfer dengan nomor yang sudah tertera, jika sudah harap kirim bukti foto dengan caption *bukti* untuk di acc oleh Admin._`
            reply(py_wallet)
          }
        } else if (command === "batal_depo") {
          if (db.data.deposit[sender].payment == "QRIS") {
            await cancelDeposit(db.data.deposit[sender].data.id)
          }
          reply(`Baik kak, deposit dengan ID: ${db.data.deposit[sender].ID} dibatalkan`)
          delete db.data.deposit[sender]
        }
      }
    }

    if (isAlreadyResponList(chats.toLowerCase())) {
      let get_data_respon = getDataResponList(chats.toLowerCase())
      if (get_data_respon.isImage === false) {
        ronzz.sendMessage(from, { text: get_data_respon.response }, {
          quoted: m
        })
      } else {
        ronzz.sendMessage(from, {
          image: {
            url: get_data_respon.image_url
          },
          caption: get_data_respon.response
        }, {
          quoted: m
        })
      }
    }

    if (isAlreadyResponTesti(chats.toLowerCase())) {
      var get_data_respon = getDataResponTesti(chats.toLowerCase())
      ronzz.sendMessage(from, {
        image: {
          url: get_data_respon.image_url
        },
        caption: get_data_respon.response
      }, {
        quoted: m
      })
    }

    if (isGroup && db.data.chat[from].antilink) {
      let gc = await ronzz.groupInviteCode(from)
      if (chats.match(/(`https:\/\/chat.whatsapp.com\/${gc}`)/gi)) {
        if (!isBotGroupAdmins) return
        reply(`*GROUP LINK DETECTOR*\n\nAnda tidak akan dikick oleh bot, karena yang anda kirim adalah link group ini.`)
      } else if ((chats.match("http://") || chats.match("https://")) && !chats.match(`https://chat.whatsapp.com/${gc}`)) {
        if (!isBotGroupAdmins) return
        if (!isOwner && !isGroupAdmins) {
          await ronzz.sendMessage(from, { delete: m.key })
          ronzz.sendMessage(from, { text: `*GROUP LINK DETECTOR*\n\nMaaf @${sender.split('@')[0]}, sepertinya kamu mengirimkan link, maaf kamu akan di kick.`, mentions: [sender] })
          await sleep(500)
          ronzz.groupParticipantsUpdate(from, [sender], "remove")
        }
      }
    }

    if (isGroup && db.data.chat[from].antilink2) {
      let gc = await ronzz.groupInviteCode(from)
      if ((chats.match("http://") || chats.match("https://")) && !chats.match(`https://chat.whatsapp.com/${gc}`)) {
        if (!isBotGroupAdmins) return
        if (!isOwner && !isGroupAdmins) {
          await ronzz.sendMessage(from, { delete: m.key })
          ronzz.sendMessage(from, { text: `*GROUP LINK DETECTOR*\n\nMaaf @${sender.split('@')[0]}, sepertinya kamu mengirimkan link, lain kali jangan kirim link yaa.`, mentions: [sender] })
        }
      }
    }

    if (db.data.setting[botNumber].autoread) ronzz.readMessages([m.key])
    if (db.data.setting[botNumber].autoketik) ronzz.sendPresenceUpdate('composing', from)
    if (chats) console.log('->[\x1b[1;32mCMD\x1b[1;37m]', color(moment(m.messageTimestamp * 1000).format('DD/MM/YYYY HH:mm:ss'), 'yellow'), color(`${prefix + command} [${args.length}]`), 'from', color(pushname), isGroup ? 'in ' + color(groupName) : '')

    switch (command) {
      case 'menu': {
        if (db.data.users[sender] == undefined) return sendDaftar()
        if (isGroup && db.data.users[sender].device !== "android") return reply(`Bot hanya bisa diakses di private chat karena kamu menggunakan device ${db.data.users[sender].device.slice(0, 1).toUpperCase() + db.data.users[sender].device.slice(1)}`)
        let more = String.fromCharCode(8206)
        let readmore = more.repeat(4001)
        let teks = global.menu(prefix, sender, pushname) + `
${readmore}
*☘ ᴛʜᴀɴᴋs ᴛᴏ ☘*
• @Whiskeysockets (Baileys)
• Ezy (Creator)
• ${ownerName} (Owner)
• All pengguna bot`
        if (isAndroid) {
          ronzz.sendMessage(from, {
            footer: `${botName} © ${ownerName}`,
            buttons: [
              {
                buttonId: '.sc', buttonText: { displayText: 'Script 📥' }, type: 1,
              }, {
                buttonId: '.owner', buttonText: { displayText: 'Owner 👤' }, type: 1,
              },
              {
                buttonId: 'action',
                buttonText: { displayText: 'ini pesan interactiveMeta' },
                type: 4,
                nativeFlowInfo: {
                  name: 'single_select',
                  paramsJson: JSON.stringify({
                    title: 'Klik untuk melihat menu',
                    sections: [
                      {
                        title: 'INFORMATION',
                        rows: [
                          {
                            title: 'Saldo 💳',
                            description: 'Menampilkan saldo kamu',
                            id: '.saldo'
                          },
                          {
                            title: 'List Harga 💰',
                            description: 'Menampilkan list harga layanan',
                            id: '.produk'
                          }
                        ]
                      },
                      {
                        title: 'LIST MENU',
                        highlight_label: 'Recommend',
                        rows: [
                          {
                            title: 'All Menu 📚',
                            description: 'Menampilkan semua menu',
                            id: '.allmenu'
                          },
                          {
                            title: 'Group Menu 🏢',
                            description: 'Menampilkan menu group',
                            id: '.groupmenu'
                          },
                          {
                            title: 'Info Bot 📌',
                            description: 'Menampilkan info bot',
                            id: '.infobot'
                          },
                          {
                            title: 'Owner Menu 🔑',
                            description: 'Menampilkan menu owner',
                            id: '.ownermenu'
                          },
                          {
                            title: 'Stalker Menu 📰',
                            description: 'Menampilkan menu cek nickname game',
                            id: '.stalkermenu'
                          },
                          {
                            title: 'Store Menu 🛒',
                            description: 'Menampilkan menu store',
                            id: '.storemenu'
                          },
                          {
                            title: 'Topup Menu 📥',
                            description: 'Menampilkan menu topup',
                            id: '.topupmenu'
                          }
                        ]
                      }
                    ]
                  })
                }
              }
            ],
            headerType: 1,
            viewOnce: true,
            image: fs.readFileSync(thumbnail),
            caption: teks,
            contextInfo: {
              forwardingScore: 999,
              isForwarded: true,
              mentionedJid: parseMention(teks),
              externalAdReply: {
                title: botName,
                body: `By ${ownerName}`,
                thumbnailUrl: ppuser,
                sourceUrl: '',
                mediaType: 1,
                renderLargerThumbnail: false
              }
            }
          }, { quoted: m })
        } else {
          ronzz.sendMessage(from, {
            text: teks,
            footer: `${botName} © ${ownerName}`,
            mentions: parseMention(teks),
            buttonText: "Klik untuk melihat menu",
            sections: [
              {
                title: 'INFORMATION',
                rows: [
                  {
                    title: "Script 📥",
                    description: "Menampilkan script",
                    rowId: ".sc"
                  },
                  {
                    title: "Owner 👤",
                    description: "Mengirim nomor Owner",
                    rowId: ".owner"
                  },
                  {
                    title: 'Saldo 💳',
                    description: 'Menampilkan saldo kamu',
                    rowId: '.saldo'
                  },
                  {
                    title: 'List Harga 💰',
                    description: 'Menampilkan list harga layanan',
                    rowId: '.produk'
                  }
                ]
              },
              {
                title: 'LIST MENU',
                rows: [
                  {
                    title: 'All Menu 📚',
                    description: 'Menampilkan semua menu',
                    rowId: '.allmenu'
                  },
                  {
                    title: 'Group Menu 🏢',
                    description: 'Menampilkan menu group',
                    rowId: '.groupmenu'
                  },
                  {
                    title: 'Info Bot 📌',
                    description: 'Menampilkan info bot',
                    rowId: '.infobot'
                  },
                  {
                    title: 'Owner Menu 🔑',
                    description: 'Menampilkan menu owner',
                    rowId: '.ownermenu'
                  },
                  {
                    title: 'Stalker Menu 📰',
                    description: 'Menampilkan menu cek nickname game',
                    rowId: '.stalkermenu'
                  },
                  {
                    title: 'Store Menu 🛒',
                    description: 'Menampilkan menu store',
                    rowId: '.storemenu'
                  },
                  {
                    title: 'Topup Menu 📥',
                    description: 'Menampilkan menu topup',
                    rowId: '.topupmenu'
                  }
                ]
              }
            ]
          }, { quoted: m })
        }
      }
        break

      case 'allmenu': {
        if (db.data.users[sender] == undefined) return sendDaftar()
        if (isGroup && db.data.users[sender].device !== "android") return reply(`Bot hanya bisa diakses di private chat karena kamu menggunakan device ${db.data.users[sender].device.slice(0, 1).toUpperCase() + db.data.users[sender].device.slice(1)}`)
        let teks = global.allmenu(prefix, sender, pushname) + `

*☘ ᴛʜᴀɴᴋs ᴛᴏ ☘*
• @Whiskeysockets (Baileys)
• Ezy (Creator)
• ${ownerName} (Owner)
• All pengguna bot`
        if (isAndroid) {
          ronzz.sendMessage(from, {
            footer: `${botName} © ${ownerName}`,
            buttons: [
              {
                buttonId: '.sc', buttonText: { displayText: 'Script 📥' }, type: 1,
              }, {
                buttonId: '.owner', buttonText: { displayText: 'Owner 👤' }, type: 1,
              },
              {
                buttonId: 'action',
                buttonText: { displayText: 'ini pesan interactiveMeta' },
                type: 4,
                nativeFlowInfo: {
                  name: 'single_select',
                  paramsJson: JSON.stringify({
                    title: 'Klik untuk melihat list menu',
                    sections: [
                      {
                        title: 'INFORMATION',
                        rows: [
                          {
                            title: 'Saldo 💳',
                            description: 'Menampilkan saldo kamu',
                            id: '.saldo'
                          },
                          {
                            title: 'List Harga 💰',
                            description: 'Menampilkan list harga layanan',
                            id: '.produk'
                          }
                        ]
                      }
                    ]
                  })
                }
              }
            ],
            headerType: 1,
            viewOnce: true,
            image: fs.readFileSync(thumbnail),
            caption: teks,
            contextInfo: {
              forwardingScore: 999,
              isForwarded: true,
              mentionedJid: parseMention(teks),
              externalAdReply: {
                title: botName,
                body: `By ${ownerName}`,
                thumbnailUrl: ppuser,
                sourceUrl: '',
                mediaType: 1,
                renderLargerThumbnail: false
              }
            }
          }, { quoted: m })
        } else {
          ronzz.sendMessage(from, {
            text: teks,
            footer: `${botName} © ${ownerName}`,
            mentions: parseMention(teks),
            buttonText: "Klik untuk melihat list menu",
            sections: [
              {
                title: 'INFORMATION',
                rows: [
                  {
                    title: "Script 📥",
                    description: "Menampilkan script",
                    rowId: ".sc"
                  },
                  {
                    title: "Owner 👤",
                    description: "Mengirim nomor Owner",
                    rowId: ".owner"
                  },
                  {
                    title: 'Saldo 💳',
                    description: 'Menampilkan saldo kamu',
                    rowId: '.saldo'
                  },
                  {
                    title: 'List Harga 💰',
                    description: 'Menampilkan list harga layanan',
                    rowId: '.produk'
                  }
                ]
              }
            ]
          }, { quoted: m })
        }
      }
        break

      case 'groupmenu': case 'grupmenu': {
        if (db.data.users[sender] == undefined) return sendDaftar()
        if (isGroup && db.data.users[sender].device !== "android") return reply(`Bot hanya bisa diakses di private chat karena kamu menggunakan device ${db.data.users[sender].device.slice(0, 1).toUpperCase() + db.data.users[sender].device.slice(1)}`)
        let teks = global.groupmenu(prefix, sender, pushname) + `

*☘ ᴛʜᴀɴᴋs ᴛᴏ ☘*
• @Whiskeysockets (Baileys)
• Ezy (Creator)
• ${ownerName} (Owner)
• All pengguna bot`
        if (isAndroid) {
          ronzz.sendMessage(from, {
            footer: `${botName} © ${ownerName}`,
            buttons: [
              {
                buttonId: '.sc', buttonText: { displayText: 'Script 📥' }, type: 1,
              }, {
                buttonId: '.owner', buttonText: { displayText: 'Owner 👤' }, type: 1,
              },
              {
                buttonId: 'action',
                buttonText: { displayText: 'ini pesan interactiveMeta' },
                type: 4,
                nativeFlowInfo: {
                  name: 'single_select',
                  paramsJson: JSON.stringify({
                    title: 'Klik untuk melihat list menu',
                    sections: [
                      {
                        title: 'INFORMATION',
                        rows: [
                          {
                            title: 'Saldo 💳',
                            description: 'Menampilkan saldo kamu',
                            id: '.saldo'
                          },
                          {
                            title: 'List Harga 💰',
                            description: 'Menampilkan list harga layanan',
                            id: '.produk'
                          }
                        ]
                      }
                    ]
                  })
                }
              }
            ],
            headerType: 1,
            viewOnce: true,
            image: fs.readFileSync(thumbnail),
            caption: teks,
            contextInfo: {
              forwardingScore: 999,
              isForwarded: true,
              mentionedJid: parseMention(teks),
              externalAdReply: {
                title: botName,
                body: `By ${ownerName}`,
                thumbnailUrl: ppuser,
                sourceUrl: '',
                mediaType: 1,
                renderLargerThumbnail: false
              }
            }
          }, { quoted: m })
        } else {
          ronzz.sendMessage(from, {
            text: teks,
            footer: `${botName} © ${ownerName}`,
            mentions: parseMention(teks),
            buttonText: "Klik untuk melihat list menu",
            sections: [
              {
                title: 'INFORMATION',
                rows: [
                  {
                    title: "Script 📥",
                    description: "Menampilkan script",
                    rowId: ".sc"
                  },
                  {
                    title: "Owner 👤",
                    description: "Mengirim nomor Owner",
                    rowId: ".owner"
                  },
                  {
                    title: 'Saldo 💳',
                    description: 'Menampilkan saldo kamu',
                    rowId: '.saldo'
                  },
                  {
                    title: 'List Harga 💰',
                    description: 'Menampilkan list harga layanan',
                    rowId: '.produk'
                  }
                ]
              }
            ]
          }, { quoted: m })
        }
      }
        break

      case 'infobot': {
        if (db.data.users[sender] == undefined) return sendDaftar()
        if (isGroup && db.data.users[sender].device !== "android") return reply(`Bot hanya bisa diakses di private chat karena kamu menggunakan device ${db.data.users[sender].device.slice(0, 1).toUpperCase() + db.data.users[sender].device.slice(1)}`)
        let teks = global.infobot(prefix, sender, pushname) + `

*☘ ᴛʜᴀɴᴋs ᴛᴏ ☘*
• @Whiskeysockets (Baileys)
• Ezy (Creator)
• ${ownerName} (Owner)
• All pengguna bot`
        if (isAndroid) {
          ronzz.sendMessage(from, {
            footer: `${botName} © ${ownerName}`,
            buttons: [
              {
                buttonId: '.sc', buttonText: { displayText: 'Script 📥' }, type: 1,
              }, {
                buttonId: '.owner', buttonText: { displayText: 'Owner 👤' }, type: 1,
              },
              {
                buttonId: 'action',
                buttonText: { displayText: 'ini pesan interactiveMeta' },
                type: 4,
                nativeFlowInfo: {
                  name: 'single_select',
                  paramsJson: JSON.stringify({
                    title: 'Klik untuk melihat list menu',
                    sections: [
                      {
                        title: 'INFORMATION',
                        rows: [
                          {
                            title: 'Saldo 💳',
                            description: 'Menampilkan saldo kamu',
                            id: '.saldo'
                          },
                          {
                            title: 'List Harga 💰',
                            description: 'Menampilkan list harga layanan',
                            id: '.produk'
                          }
                        ]
                      }
                    ]
                  })
                }
              }
            ],
            headerType: 1,
            viewOnce: true,
            image: fs.readFileSync(thumbnail),
            caption: teks,
            contextInfo: {
              forwardingScore: 999,
              isForwarded: true,
              mentionedJid: parseMention(teks),
              externalAdReply: {
                title: botName,
                body: `By ${ownerName}`,
                thumbnailUrl: ppuser,
                sourceUrl: '',
                mediaType: 1,
                renderLargerThumbnail: false
              }
            }
          }, { quoted: m })
        } else {
          ronzz.sendMessage(from, {
            text: teks,
            footer: `${botName} © ${ownerName}`,
            mentions: parseMention(teks),
            buttonText: "Klik untuk melihat list menu",
            sections: [
              {
                title: 'INFORMATION',
                rows: [
                  {
                    title: "Script 📥",
                    description: "Menampilkan script",
                    rowId: ".sc"
                  },
                  {
                    title: "Owner 👤",
                    description: "Mengirim nomor Owner",
                    rowId: ".owner"
                  },
                  {
                    title: 'Saldo 💳',
                    description: 'Menampilkan saldo kamu',
                    rowId: '.saldo'
                  },
                  {
                    title: 'List Harga 💰',
                    description: 'Menampilkan list harga layanan',
                    rowId: '.produk'
                  }
                ]
              }
            ]
          }, { quoted: m })
        }
      }
        break

      case 'ownermenu': {
        if (db.data.users[sender] == undefined) return sendDaftar()
        if (isGroup && db.data.users[sender].device !== "android") return reply(`Bot hanya bisa diakses di private chat karena kamu menggunakan device ${db.data.users[sender].device.slice(0, 1).toUpperCase() + db.data.users[sender].device.slice(1)}`)
        let teks = global.ownermenu(prefix, sender, pushname) + `

*☘ ᴛʜᴀɴᴋs ᴛᴏ ☘*
• @Whiskeysockets (Baileys)
• Ezy (Creator)
• ${ownerName} (Owner)
• All pengguna bot`
        if (isAndroid) {
          ronzz.sendMessage(from, {
            footer: `${botName} © ${ownerName}`,
            buttons: [
              {
                buttonId: '.sc', buttonText: { displayText: 'Script 📥' }, type: 1,
              }, {
                buttonId: '.owner', buttonText: { displayText: 'Owner 👤' }, type: 1,
              },
              {
                buttonId: 'action',
                buttonText: { displayText: 'ini pesan interactiveMeta' },
                type: 4,
                nativeFlowInfo: {
                  name: 'single_select',
                  paramsJson: JSON.stringify({
                    title: 'Klik untuk melihat list menu',
                    sections: [
                      {
                        title: 'INFORMATION',
                        rows: [
                          {
                            title: 'Saldo 💳',
                            description: 'Menampilkan saldo kamu',
                            id: '.saldo'
                          },
                          {
                            title: 'List Harga 💰',
                            description: 'Menampilkan list harga layanan',
                            id: '.produk'
                          }
                        ]
                      }
                    ]
                  })
                }
              }
            ],
            headerType: 1,
            viewOnce: true,
            image: fs.readFileSync(thumbnail),
            caption: teks,
            contextInfo: {
              forwardingScore: 999,
              isForwarded: true,
              mentionedJid: parseMention(teks),
              externalAdReply: {
                title: botName,
                body: `By ${ownerName}`,
                thumbnailUrl: ppuser,
                sourceUrl: '',
                mediaType: 1,
                renderLargerThumbnail: false
              }
            }
          }, { quoted: m })
        } else {
          ronzz.sendMessage(from, {
            text: teks,
            footer: `${botName} © ${ownerName}`,
            mentions: parseMention(teks),
            buttonText: "Klik untuk melihat list menu",
            sections: [
              {
                title: 'INFORMATION',
                rows: [
                  {
                    title: "Script 📥",
                    description: "Menampilkan script",
                    rowId: ".sc"
                  },
                  {
                    title: "Owner 👤",
                    description: "Mengirim nomor Owner",
                    rowId: ".owner"
                  },
                  {
                    title: 'Saldo 💳',
                    description: 'Menampilkan saldo kamu',
                    rowId: '.saldo'
                  },
                  {
                    title: 'List Harga 💰',
                    description: 'Menampilkan list harga layanan',
                    rowId: '.produk'
                  }
                ]
              }
            ]
          }, { quoted: m })
        }
      }
        break

      case 'storemenu': {
        if (db.data.users[sender] == undefined) return sendDaftar()
        if (isGroup && db.data.users[sender].device !== "android") return reply(`Bot hanya bisa diakses di private chat karena kamu menggunakan device ${db.data.users[sender].device.slice(0, 1).toUpperCase() + db.data.users[sender].device.slice(1)}`)
        let teks = global.storemenu(prefix, sender, pushname) + `

*☘ ᴛʜᴀɴᴋs ᴛᴏ ☘*
• @Whiskeysockets (Baileys)
• Ezy (Creator)
• ${ownerName} (Owner)
• All pengguna bot`
        if (isAndroid) {
          ronzz.sendMessage(from, {
            footer: `${botName} © ${ownerName}`,
            buttons: [
              {
                buttonId: '.sc', buttonText: { displayText: 'Script 📥' }, type: 1,
              }, {
                buttonId: '.owner', buttonText: { displayText: 'Owner 👤' }, type: 1,
              },
              {
                buttonId: 'action',
                buttonText: { displayText: 'ini pesan interactiveMeta' },
                type: 4,
                nativeFlowInfo: {
                  name: 'single_select',
                  paramsJson: JSON.stringify({
                    title: 'Klik untuk melihat list menu',
                    sections: [
                      {
                        title: 'INFORMATION',
                        rows: [
                          {
                            title: 'Saldo 💳',
                            description: 'Menampilkan saldo kamu',
                            id: '.saldo'
                          },
                          {
                            title: 'List Harga 💰',
                            description: 'Menampilkan list harga layanan',
                            id: '.produk'
                          }
                        ]
                      }
                    ]
                  })
                }
              }
            ],
            headerType: 1,
            viewOnce: true,
            image: fs.readFileSync(thumbnail),
            caption: teks,
            contextInfo: {
              forwardingScore: 999,
              isForwarded: true,
              mentionedJid: parseMention(teks),
              externalAdReply: {
                title: botName,
                body: `By ${ownerName}`,
                thumbnailUrl: ppuser,
                sourceUrl: '',
                mediaType: 1,
                renderLargerThumbnail: false
              }
            }
          }, { quoted: m })
        } else {
          ronzz.sendMessage(from, {
            text: teks,
            footer: `${botName} © ${ownerName}`,
            mentions: parseMention(teks),
            buttonText: "Klik untuk melihat list menu",
            sections: [
              {
                title: 'INFORMATION',
                rows: [
                  {
                    title: "Script 📥",
                    description: "Menampilkan script",
                    rowId: ".sc"
                  },
                  {
                    title: "Owner 👤",
                    description: "Mengirim nomor Owner",
                    rowId: ".owner"
                  },
                  {
                    title: 'Saldo 💳',
                    description: 'Menampilkan saldo kamu',
                    rowId: '.saldo'
                  },
                  {
                    title: 'List Harga 💰',
                    description: 'Menampilkan list harga layanan',
                    rowId: '.produk'
                  }
                ]
              }
            ]
          }, { quoted: m })
        }
      }
        break

      case 'stalkermenu': {
        if (db.data.users[sender] == undefined) return sendDaftar()
        if (isGroup && db.data.users[sender].device !== "android") return reply(`Bot hanya bisa diakses di private chat karena kamu menggunakan device ${db.data.users[sender].device.slice(0, 1).toUpperCase() + db.data.users[sender].device.slice(1)}`)
        let teks = global.stalkermenu(prefix, sender, pushname) + `

*☘ ᴛʜᴀɴᴋs ᴛᴏ ☘*
• @Whiskeysockets (Baileys)
• Ezy (Creator)
• ${ownerName} (Owner)
• All pengguna bot`
        if (isAndroid) {
          ronzz.sendMessage(from, {
            footer: `${botName} © ${ownerName}`,
            buttons: [
              {
                buttonId: '.sc', buttonText: { displayText: 'Script 📥' }, type: 1,
              }, {
                buttonId: '.owner', buttonText: { displayText: 'Owner 👤' }, type: 1,
              },
              {
                buttonId: 'action',
                buttonText: { displayText: 'ini pesan interactiveMeta' },
                type: 4,
                nativeFlowInfo: {
                  name: 'single_select',
                  paramsJson: JSON.stringify({
                    title: 'Klik untuk melihat list menu',
                    sections: [
                      {
                        title: 'INFORMATION',
                        rows: [
                          {
                            title: 'Saldo 💳',
                            description: 'Menampilkan saldo kamu',
                            id: '.saldo'
                          },
                          {
                            title: 'List Harga 💰',
                            description: 'Menampilkan list harga layanan',
                            id: '.produk'
                          }
                        ]
                      }
                    ]
                  })
                }
              }
            ],
            headerType: 1,
            viewOnce: true,
            image: fs.readFileSync(thumbnail),
            caption: teks,
            contextInfo: {
              forwardingScore: 999,
              isForwarded: true,
              mentionedJid: parseMention(teks),
              externalAdReply: {
                title: botName,
                body: `By ${ownerName}`,
                thumbnailUrl: ppuser,
                sourceUrl: '',
                mediaType: 1,
                renderLargerThumbnail: false
              }
            }
          }, { quoted: m })
        } else {
          ronzz.sendMessage(from, {
            text: teks,
            footer: `${botName} © ${ownerName}`,
            mentions: parseMention(teks),
            buttonText: "Klik untuk melihat list menu",
            sections: [
              {
                title: 'INFORMATION',
                rows: [
                  {
                    title: "Script 📥",
                    description: "Menampilkan script",
                    rowId: ".sc"
                  },
                  {
                    title: "Owner 👤",
                    description: "Mengirim nomor Owner",
                    rowId: ".owner"
                  },
                  {
                    title: 'Saldo 💳',
                    description: 'Menampilkan saldo kamu',
                    rowId: '.saldo'
                  },
                  {
                    title: 'List Harga 💰',
                    description: 'Menampilkan list harga layanan',
                    rowId: '.produk'
                  }
                ]
              }
            ]
          }, { quoted: m })
        }
      }
        break

      case 'topupmenu': {
        if (db.data.users[sender] == undefined) return sendDaftar()
        if (isGroup && db.data.users[sender].device !== "android") return reply(`Bot hanya bisa diakses di private chat karena kamu menggunakan device ${db.data.users[sender].device.slice(0, 1).toUpperCase() + db.data.users[sender].device.slice(1)}`)
        let teks = global.topupmenu(prefix, sender, pushname) + `

*☘ ᴛʜᴀɴᴋs ᴛᴏ ☘*
• @Whiskeysockets (Baileys)
• Ezy (Creator)
• ${ownerName} (Owner)
• All pengguna bot`
        if (isAndroid) {
          ronzz.sendMessage(from, {
            footer: `${botName} © ${ownerName}`,
            buttons: [
              {
                buttonId: '.sc', buttonText: { displayText: 'Script 📥' }, type: 1,
              }, {
                buttonId: '.owner', buttonText: { displayText: 'Owner 👤' }, type: 1,
              },
              {
                buttonId: 'action',
                buttonText: { displayText: 'ini pesan interactiveMeta' },
                type: 4,
                nativeFlowInfo: {
                  name: 'single_select',
                  paramsJson: JSON.stringify({
                    title: 'Klik untuk melihat list menu',
                    sections: [
                      {
                        title: 'INFORMATION',
                        rows: [
                          {
                            title: 'Saldo 💳',
                            description: 'Menampilkan saldo kamu',
                            id: '.saldo'
                          },
                          {
                            title: 'List Harga 💰',
                            description: 'Menampilkan list harga layanan',
                            id: '.produk'
                          }
                        ]
                      }
                    ]
                  })
                }
              }
            ],
            headerType: 1,
            viewOnce: true,
            image: fs.readFileSync(thumbnail),
            caption: teks,
            contextInfo: {
              forwardingScore: 999,
              isForwarded: true,
              mentionedJid: parseMention(teks),
              externalAdReply: {
                title: botName,
                body: `By ${ownerName}`,
                thumbnailUrl: ppuser,
                sourceUrl: '',
                mediaType: 1,
                renderLargerThumbnail: false
              }
            }
          }, { quoted: m })
        } else {
          ronzz.sendMessage(from, {
            text: teks,
            footer: `${botName} © ${ownerName}`,
            mentions: parseMention(teks),
            buttonText: "Klik untuk melihat list menu",
            sections: [
              {
                title: 'INFORMATION',
                rows: [
                  {
                    title: "Script 📥",
                    description: "Menampilkan script",
                    rowId: ".sc"
                  },
                  {
                    title: "Owner 👤",
                    description: "Mengirim nomor Owner",
                    rowId: ".owner"
                  },
                  {
                    title: 'Saldo 💳',
                    description: 'Menampilkan saldo kamu',
                    rowId: '.saldo'
                  },
                  {
                    title: 'List Harga 💰',
                    description: 'Menampilkan list harga layanan',
                    rowId: '.produk'
                  }
                ]
              }
            ]
          }, { quoted: m })
        }
      }
        break

      case 'deposit': case 'depo': {
        if (db.data.users[sender] == undefined) return sendDaftar()
        if (isGroup && db.data.users[sender].device !== "android") return reply(`Bot hanya bisa diakses di private chat karena kamu menggunakan device ${db.data.users[sender].device.slice(0, 1).toUpperCase() + db.data.users[sender].device.slice(1)}`)
        let teks = `Hai *@${sender.split('@')[0]}*\nIngin melakukan deposit? silahkan pilih payment di bawah ini`
        if (isAndroid) {
          ronzz.sendMessage(from, {
            footer: `${botName} © ${ownerName}`,
            buttons: [
              {
                buttonId: 'action',
                buttonText: { displayText: 'ini pesan interactiveMeta' },
                type: 4,
                nativeFlowInfo: {
                  name: 'single_select',
                  paramsJson: JSON.stringify({
                    title: 'Klik untuk melihat payment',
                    sections: [
                      {
                        title: 'PAYMENT',
                        rows: [
                          {
                            title: 'Qris',
                            description: 'Sistem: Otomatis',
                            id: '.payqris'
                          },
                          {
                            title: 'E-Wallet',
                            description: 'Sistem: Manual',
                            id: '.paywallet'
                          }
                        ]
                      }
                    ]
                  })
                }
              }
            ],
            headerType: 1,
            viewOnce: true,
            image: fs.readFileSync(thumbnail),
            caption: teks,
            contextInfo: {
              forwardingScore: 999,
              isForwarded: true,
              mentionedJid: parseMention(teks),
              externalAdReply: {
                title: botName,
                body: `By ${ownerName}`,
                thumbnailUrl: ppuser,
                sourceUrl: '',
                mediaType: 1,
                renderLargerThumbnail: false
              }
            }
          }, { quoted: m })
        } else {
          ronzz.sendMessage(from, {
            text: teks,
            footer: `${botName} © ${ownerName}`,
            mentions: parseMention(teks),
            buttonText: "Klik untuk melihat payment",
            sections: [
              {
                title: 'PAYMENT',
                rows: [
                  {
                    title: 'Qris',
                    description: 'Sistem: Otomatis',
                    rowId: '.payqris'
                  },
                  {
                    title: 'E-Wallet',
                    description: 'Sistem: Manual',
                    rowId: '.paywallet'
                  }
                ]
              }
            ]
          }, { quoted: m })
        }
      }
        break

      case 'bukti': {
        if (db.data.users[sender] == undefined) return
        if (db.data.deposit[sender] == undefined) return
        if (!isImage && !isQuotedImage) return reply(`Kirim gambar dengan caption *${prefix}bukti* atau reply gambar yang sudah dikirim dengan caption *${prefix}bukti*`)
        let media = await downloadAndSaveMediaMessage('image', `./options/sticker/${sender.split('@')[0]}.jpg`)
        let caption_bukti = `*🧾 DEPOSIT USER 🧾*

*ID:* ${db.data.deposit[sender].ID}
*Nomer:* @${sender.split('@')[0]}
*Payment:* ${db.data.deposit[sender].payment}
*Tanggal:* ${db.data.deposit[sender].date}
*Jumlah Deposit:* Rp${toRupiah(db.data.deposit[sender].data.amount_deposit)}
*Pajak:* Rp${toRupiah(Number(db.data.deposit[sender].data.fee))}
*Total Bayar:* Rp${toRupiah(db.data.deposit[sender].data.total_deposit)}

Ada yang deposit nih kak, coba dicek saldonya`
        if (db.data.users[`${ownerNomer}@s.whatsapp.net`].device == "android") {
          await ronzz.sendMessage(`${ownerNomer}@s.whatsapp.net`, {
            footer: `${botName} © ${ownerName}`,
            buttons: [
              {
                buttonId: `.accdepo ${sender.split('@')[0]}`, buttonText: { displayText: 'Accept' }, type: 1,
              }, {
                buttonId: `.rejectdepo ${sender.split('@')[0]}`, buttonText: { displayText: 'Reject' }, type: 1,
              }
            ],
            headerType: 1,
            viewOnce: true,
            image: fs.readFileSync(media),
            caption: caption_bukti,
            contextInfo: {
              forwardingScore: 999,
              isForwarded: true,
              mentionedJid: parseMention(caption_bukti),
            }
          })
        } else {
          await ronzz.sendMessage(`${ownerNomer}@s.whatsapp.net`, {
            image: fs.readFileSync(media)
          })
          await sleep(500)
          await ronzz.sendMessage(`${ownerNomer}@s.whatsapp.net`, {
            text: caption_bukti,
            footer: `${botName} © ${ownerName}`,
            mentions: parseMention(caption_bukti),
            buttonText: "Klik untuk memilih opsi",
            sections: [
              {
                title: "OPSI DEPOSIT",
                rows: [
                  {
                    title: "Accept",
                    description: "Untuk terima deposit user",
                    rowId: `.accdepo ${sender.split('@')[0]}`
                  },
                  {
                    title: "Reject",
                    description: "Untuk tolak deposit user",
                    rowId: `.rejectdepo ${sender.split('@')[0]}`
                  }
                ]
              }
            ]
          })
        }
        await reply(`Mohon tunggu yaa kak, sampai di acc oleh Owner`)
        fs.unlinkSync(media)
      }
        break

      case 'accdepo': {
        if (!isOwner) return
        if (!q) return reply(`Contoh: ${prefix + command} 628xxx`)
        let orang = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net"
        db.data.users[orang].saldo += Number(db.data.deposit[orang].data.amount_deposit)

        let text_sukses = `*✅「 DEPOSIT SUKSES 」✅*

*ID:* ${db.data.deposit[orang].ID}
*Nomer:* @${db.data.deposit[orang].number.split('@')[0]}
*Payment:* ${db.data.deposit[orang].payment}
*Tanggal:* ${db.data.deposit[orang].date}
*Jumlah Deposit:* Rp${toRupiah(db.data.deposit[orang].data.amount_deposit)}
*Pajak:* Rp${toRupiah(Number(db.data.deposit[orang].data.fee))}
*Total Bayar:* Rp${toRupiah(db.data.deposit[orang].data.total_deposit)}`
        await reply(text_sukses)
        if (db.data.users[orang].device == "android") {
          await ronzz.sendMessage(orang, {
            footer: `${botName} © ${ownerName}`,
            buttons: [
              {
                buttonId: `.saldo`, buttonText: { displayText: 'Saldo' }, type: 1,
              }
            ],
            headerType: 1,
            viewOnce: true,
            image: fs.readFileSync(thumbnail),
            caption: `${text_sukses}\n\n_Deposit kamu telah dikonfirmasi oleh Owner, silahkan cek saldo Anda.`,
            contextInfo: {
              forwardingScore: 999,
              isForwarded: true,
              mentionedJid: parseMention(text_sukses),
            }
          })
        } else {
          await ronzz.sendMessage(orang, {
            text: `${text_sukses}\n\n_Deposit kamu telah dikonfirmasi oleh Owner, silahkan cek saldo Anda.`,
            footer: `${botName} © ${ownerName}`,
            mentions: parseMention(text_sukses),
            buttonText: "Klik untuk melihat saldo",
            sections: [
              {
                title: "INFORMASI ANDA",
                rows: [
                  {
                    title: "Saldo",
                    rowId: ".saldo"
                  }
                ]
              }
            ]
          })
        }
        delete db.data.deposit[orang]
      }
        break

      case 'rejectdepo': {
        if (!isOwner) return
        if (!q) return reply(`Contoh: ${prefix + command} 628xxx`)
        let orang = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net"
        await reply(`Sukses reject deposit dengan ID: ${db.data.deposit[orang].ID}`)
        await ronzz.sendMessage(db.data.deposit[orang].number, { text: `Maaf deposit dengan ID: *${db.data.deposit[orang].ID}* ditolak, Jika ada kendala silahkan hubungin owner bot.\nwa.me/${ownerNomer}` })
        delete db.data.deposit[orang]
      }
        break

      case 'saldo': {
        if (db.data.users[sender] == undefined) return sendDaftar()
        if (isGroup && db.data.users[sender].device !== "android") return reply(`Bot hanya bisa diakses di private chat karena kamu menggunakan device ${db.data.users[sender].device.slice(0, 1).toUpperCase() + db.data.users[sender].device.slice(1)}`)
        reply(`*CHECK YOUR INFO*
        
 _• *Name:* ${pushname}_
 _• *Nomer:* ${sender.split('@')[0]}_
 _• *Device:* ${db.data.users[sender].device.slice(0, 1).toUpperCase() + db.data.users[sender].device.slice(1)}_
 _• *Role:* ${db.data.users[sender].role.slice(0, 1).toUpperCase() + db.data.users[sender].role.slice(1)}_
 _• *Saldo:* Rp${toRupiah(db.data.users[sender].saldo)}_
        
*Note:*
_Saldo hanya bisa untuk transaksi._
_Jika ingin mengganti device ketik *${prefix}setdevice*_`)
      }
        break

      case 'addsaldo': {
        if (!isOwner) return reply(mess.owner)
        if (!q.split(",")[1]) return reply(`Contoh: ${prefix + command} 628xx,20000`)
        let orang = q.split(",")[0].replace(/[^0-9]/g, '') + "@s.whatsapp.net"
        if (db.data.users[orang] !== undefined) {
          db.data.users[orang].saldo += parseInt(q.split(",")[1])
        } else {
          db.data.users[orang] = {
            saldo: parseInt(q.split(",")[1]),
            role: "bronze"
          }
        }
        await sleep(50)
        reply(`*SALDO USER*\nNomor: @${orang.split('@')[0]}\nSaldo: Rp${toRupiah(db.data.users[orang].saldo)}`)
      }
        break

      case 'minsaldo': {
        if (!isOwner) return reply(mess.owner)
        if (!q.split(",")[1]) return reply(`Contoh: ${prefix + command} 628xx,20000`)
        let orang = q.split(",")[0].replace(/[^0-9]/g, '') + "@s.whatsapp.net"
        if (db.data.users[orang] == undefined || db.data.users[orang].saldo <= 0) return reply("Dia belum terdaftar di database users.")
        if (db.data.users[orang].saldo < parseInt(q.split(",")[1])) return reply(`Dia saldonya Rp${toRupiah(db.data.users[orang].saldo)}, jadi jangan melebihi Rp${toRupiah(db.data.users[orang].saldo)} yah kak??`)
        db.data.users[orang].saldo -= parseInt(q.split(",")[1])
        await sleep(50)
        reply(`*SALDO USER*\nNomor: @${orang.split('@')[0]}\nSaldo: Rp${toRupiah(db.data.users[orang].saldo)}`)
      }
        break

      case 'produk': {
        if (db.data.users[sender] == undefined) return sendDaftar()
        if (isGroup && db.data.users[sender].device !== "android") return reply(`Bot hanya bisa diakses di private chat karena kamu menggunakan device ${db.data.users[sender].device.slice(0, 1).toUpperCase() + db.data.users[sender].device.slice(1)}`)
        if (!q) {
          let teks = `Hai *@${sender.split('@')[0]}*\nSilahkan klik button di bawah ini untuk melihat list kategori`
          let kategori = ["Games", "Data", "Pulsa", "Token PLN", "Voucher Games", "E-Wallet"]
          var sortFunc = (a, b) => {
            var textA = a.toLowerCase()
            var textB = b.toLowerCase()
            if (textA > textB) return 1
            if (textA < textB) return -1
          }
          kategori.sort(sortFunc)

          let rows = []

          if (isAndroid) {
            kategori.map(i => {
              rows.push({
                title: i,
                description: `Melihat list produk dengan kategori ${i}`,
                id: `.produk ${i}`
              })
            })

            ronzz.sendMessage(from, {
              footer: `${botName} © ${ownerName}`,
              buttons: [
                {
                  buttonId: 'action',
                  buttonText: { displayText: 'ini pesan interactiveMeta' },
                  type: 4,
                  nativeFlowInfo: {
                    name: 'single_select',
                    paramsJson: JSON.stringify({
                      title: 'Klik untuk melihat kategori',
                      sections: [
                        {
                          title: 'LIST KATEGORI',
                          rows
                        }
                      ]
                    })
                  }
                }
              ],
              headerType: 1,
              viewOnce: true,
              image: fs.readFileSync(thumbnail),
              caption: teks,
              contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                mentionedJid: parseMention(teks),
                externalAdReply: {
                  title: botName,
                  body: `By ${ownerName}`,
                  thumbnailUrl: ppuser,
                  sourceUrl: '',
                  mediaType: 1,
                  renderLargerThumbnail: false
                }
              }
            }, { quoted: m })
          } else {
            kategori.map(i => {
              rows.push({
                title: i,
                description: `Melihat list produk dengan kategori ${i}`,
                rowId: `.produki ${i}`
              })
            })

            ronzz.sendMessage(from, {
              text: teks,
              footer: `${botName} © ${ownerName}`,
              mentions: parseMention(teks),
              buttonText: "Klik untuk melihat kategori",
              sections: [
                {
                  title: "LIST KATEGORI",
                  rows
                }
              ]
            }, { quoted: m })
          }
        } else {
          let teks = `Hai *@${sender.split('@')[0]}*\nSilahkan klik button di bawah ini untuk melihat list produk dengan kategori ${q}`
          let produk = await getProduk(q.toLowerCase())
          let rows = []

          if (isAndroid) {
            produk.map(i => {
              rows.push({
                title: i.name,
                description: `Melihat list harga produk ${i.name}`,
                id: `.listharga ${i.code}|${i.name}|${q}`
              })
            })

            ronzz.sendMessage(from, {
              footer: `${botName} © ${ownerName}`,
              buttons: [
                {
                  buttonId: 'action',
                  buttonText: { displayText: 'ini pesan interactiveMeta' },
                  type: 4,
                  nativeFlowInfo: {
                    name: 'single_select',
                    paramsJson: JSON.stringify({
                      title: 'Klik untuk melihat produk',
                      sections: [
                        {
                          title: 'LIST PRODUK',
                          rows
                        }
                      ]
                    })
                  }
                }
              ],
              headerType: 1,
              viewOnce: true,
              image: fs.readFileSync(thumbnail),
              caption: teks,
              contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                mentionedJid: parseMention(teks),
                externalAdReply: {
                  title: botName,
                  body: `By ${ownerName}`,
                  thumbnailUrl: ppuser,
                  sourceUrl: '',
                  mediaType: 1,
                  renderLargerThumbnail: false
                }
              }
            }, { quoted: m })
          } else {
            produk.map(i => {
              rows.push({
                title: i.name,
                description: `Melihat list harga produk ${i.name}`,
                rowId: `.listharga ${i.code}|${i.name}|${q}`
              })
            })

            ronzz.sendMessage(from, {
              text: teks,
              footer: `${botName} © ${ownerName}`,
              mentions: parseMention(teks),
              buttonText: "Klik untuk melihat produk",
              sections: [
                {
                  title: "LIST PRODUK",
                  rows
                }
              ]
            }, { quoted: m })
          }
        }
      }
        break

      case 'listharga': {
        if (db.data.users[sender] == undefined) return sendDaftar()
        if (isGroup && db.data.users[sender].device !== "android") return reply(`Bot hanya bisa diakses di private chat karena kamu menggunakan device ${db.data.users[sender].device.slice(0, 1).toUpperCase() + db.data.users[sender].device.slice(1)}`)
        if (!q.split("|")[2]) return
        let teks = `Hai *@${sender.split('@')[0]}*\nSilahkan klik button di bawah ini untuk melihat list harga produk ${q.split("|")[1]}`
        let listHarga = await getHarga(q.split("|")[0])
        let rows = []
        if (isAndroid) {
          listHarga.map(i => {
            rows.push({
              title: i.name,
              description: `Harga: Rp${toRupiah(hargaSetelahProfit(i.price, db.data.users[sender].role, i.category))} | Status: ${i.status ? "✅" : "❌"}`,
              id: `tp ${i.code}|${q.split("|")[2]}|${hargaSetelahProfit(i.price, db.data.users[sender].role, i.category)}|${i.name}|${i.operator}`
            })
          })

          ronzz.sendMessage(from, {
            footer: `${botName} © ${ownerName}`,
            buttons: [
              {
                buttonId: 'action',
                buttonText: { displayText: 'ini pesan interactiveMeta' },
                type: 4,
                nativeFlowInfo: {
                  name: 'single_select',
                  paramsJson: JSON.stringify({
                    title: 'Klik untuk melihat harga',
                    sections: [
                      {
                        title: `LIST HARGA PRODUK ${q.split("|")[1].toUpperCase()}`,
                        rows
                      }
                    ]
                  })
                }
              }
            ],
            headerType: 1,
            viewOnce: true,
            image: fs.readFileSync(thumbnail),
            caption: teks,
            contextInfo: {
              forwardingScore: 999,
              isForwarded: true,
              mentionedJid: parseMention(teks),
              externalAdReply: {
                title: botName,
                body: `By ${ownerName}`,
                thumbnailUrl: ppuser,
                sourceUrl: '',
                mediaType: 1,
                renderLargerThumbnail: false
              }
            }
          }, { quoted: m })
        } else {
          listHarga.map(i => {
            rows.push({
              title: i.name,
              description: `Harga: Rp${toRupiah(hargaSetelahProfit(i.price, db.data.users[sender].role, i.category))} | Status: ${i.status ? "✅" : "❌"}`,
              rowId: `tp ${i.code}|${q.split("|")[2]}|${hargaSetelahProfit(i.price, db.data.users[sender].role, i.category)}|${i.name}|${i.operator}`
            })
          })

          ronzz.sendMessage(from, {
            text: teks,
            footer: `${botName} © ${ownerName}`,
            mentions: parseMention(teks),
            buttonText: "Klik untuk melihat harga",
            sections: [
              {
                title: `LIST HARGA PRODUK ${q.split("|")[1].toUpperCase()}`,
                rows
              }
            ]
          }, { quoted: m })
        }
      }
        break

      case 'tp': {
        if (db.data.users[sender] == undefined) return sendDaftar()
        if (isGroup && db.data.users[sender].device !== "android") return reply(`Bot hanya bisa diakses di private chat karena kamu menggunakan device ${db.data.users[sender].device.slice(0, 1).toUpperCase() + db.data.users[sender].device.slice(1)}`)
        if (!q.split("|")[4]) return
        if (!db.data.topup[sender]) {
          let data = q.split("|")
          db.data.topup[sender] = {
            id: crypto.randomBytes(5).toString("hex").toUpperCase(),
            session: "INPUT-TUJUAN",
            payment: "",
            reffId: "",
            name: pushname,
            date: tanggal,
            data: {
              code: data[0],
              name: data[3],
              price: Number(data[2]),
              category: data[1],
              operator: data[4],
              id: "",
              zone: "",
              nickname: ""
            }
          }
          if (data[1] == "Games" || data[1] == "Voucher Games") {
            reply("Silahkan kirim id game kamu\n\n*# Note*\nUntuk produk Mobile Legends dan LifeAfter penggunaannya seperti dibawah ini\nContoh:\n12345678 (12345) ❌\n12345678 12345 ✅")
          } else {
            reply("Silahkan kirim no tujuan.")
          }
        } else {
          if (isAndroid) {
            ronzz.sendMessage(from, {
              footer: `${botName} © ${ownerName}`,
              buttons: [
                {
                  buttonId: 'batal_topup', buttonText: { displayText: 'Batal' }, type: 1,
                }
              ],
              headerType: 1,
              viewOnce: true,
              image: fs.readFileSync(thumbnail),
              caption: "Proses topup kamu masih ada yang belum terselesaikan.",
              contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                externalAdReply: {
                  title: botName,
                  body: `By ${ownerName}`,
                  thumbnailUrl: ppuser,
                  sourceUrl: '',
                  mediaType: 1,
                  renderLargerThumbnail: false
                }
              }
            }, { quoted: m })
          } else {
            ronzz.sendMessage(from, {
              text: "Proses topup kamu masih ada yang belum terselesaikan.",
              footer: `${botName} © ${ownerName}`,
              buttonText: "Klik untuk memilih opsi",
              sections: [
                {
                  title: "OPSI TOPUP",
                  rows: [
                    {
                      title: "Batal",
                      description: "Untuk membatalkan topup",
                      rowId: "batal_topup"
                    }
                  ]
                }
              ]
            }, { quoted: m })
          }
        }
      }
        break

      case 'cekml': {
        if (db.data.users[sender] == undefined) return sendDaftar()
        if (isGroup && db.data.users[sender].device !== "android") return reply(`Bot hanya bisa diakses di private chat karena kamu menggunakan device ${db.data.users[sender].device.slice(0, 1).toUpperCase() + db.data.users[sender].device.slice(1)}`)
        let userId = q.split(" ")[0]
        let zoneId = q.split(" ")[1]
        if (!zoneId) return reply(`Contoh: ${prefix + command} id zone`)

        let cekMl = await cekNick("mobile-legends", userId, zoneId)

        let response = await fetch(`https://restcountries.com/v3.1/name/${name.toLowerCase()}`)
        let res = await response.json()
        let countryCode = res[0].cca2.toUpperCase()
        let countryBendera = await String.fromCodePoint(...countryCode.split('').map(char => 127397 + char.charCodeAt()))
        reply(`*STALK MOBILE LEGENDS*\n\n*» Id:* ${userId} (${zoneId})\n*» Region:* ${cekMl.region} ${countryBendera}\n*» Nickname:* ${cekMl.nickname}`)
      }
        break

      case 'cekla': {
        if (db.data.users[sender] == undefined) return sendDaftar()
        if (isGroup && db.data.users[sender].device !== "android") return reply(`Bot hanya bisa diakses di private chat karena kamu menggunakan device ${db.data.users[sender].device.slice(0, 1).toUpperCase() + db.data.users[sender].device.slice(1)}`)
        let userId = q.split(" ")[0]
        let zoneId = q.split(" ")[1]
        if (!zoneId) return reply(`Contoh: ${prefix + command} id zone`)
        let cekLife

        if (isNaN(zoneId)) {
          cekLife = await cekNick("life-after", userId, zoneId)
        } else {
          switch (zoneId) {
            case '500001':
              zoneId = "miskatown"
              break
            case '500002':
              zoneId = "sandcastle"
              break
            case '500003':
              zoneId = "mouthswamp"
              break
            case '500004':
              zoneId = "redwoodtown"
              break
            case '500005':
              zoneId = "obelisk"
              break
            case '500006':
              zoneId = "newland"
              break
            case '500007':
              zoneId = "chaosoutpost"
              break
            case '500008':
              zoneId = "ironstride"
              break
            case '500009':
              zoneId = "crystalthornsea"
              break
            case '510001':
              zoneId = "fallforest"
              break
            case '510002':
              zoneId = "mountsnow"
              break
            case '520001':
              zoneId = "nancycity"
              break
            case '520002':
              zoneId = "charlestown"
              break
            case '520003':
              zoneId = "snowhighlands"
              break
            case '520004':
              zoneId = "santopany"
              break
            case '520005':
              zoneId = "levincity"
              break
            case '520006':
              zoneId = "milestone"
              break
            case '520007':
              zoneId = "chaoscity"
              break
            case '520008':
              zoneId = "twinislands"
              break
            case '520009':
              zoneId = "hopewall"
              break
            case '520010':
              zoneId = "labyrinthsea"
              break
          }

          cekLife = await cekNick("life-after", userId, zoneId)
        }
        reply(`*STALK LIFE AFTER*\n\n*» Id:* ${userId} (${cekLife.server})\n*» Server:* ${cekLife.region}\n*» Nickname:* ${cekLife.nickname}`)
      }
        break

      case 'cekff': case 'cekpubg': case 'cekhok': case 'cekgi': case 'cekpb': case 'ceksm': case 'ceksus': case 'cekvalo': case 'cekcod': {
        if (db.data.users[sender] == undefined) return sendDaftar()
        if (isGroup && db.data.users[sender].device !== "android") return reply(`Bot hanya bisa diakses di private chat karena kamu menggunakan device ${db.data.users[sender].device.slice(0, 1).toUpperCase() + db.data.users[sender].device.slice(1)}`)
        if (!q) return reply(`Contoh: ${prefix + command} id`)

        if (command == "cekff") {
          let nickname = await cekNick("free-fire", q)
          reply(`*STALK FREE FIRE*\n\n*» Id:* ${q}\n*» Nickname:* ${nickname}`)
        } else if (command == "cekpubg") {
          let nickname = await cekNick("pubg-mobile", q)
          reply(`*STALK PUBG MOBILE*\n\n*» Id:* ${q}\n*» Nickname:* ${nickname}`)
        } if (command == "cekhok") {
          let nickname = await cekNick("honor-of-kings", q)
          reply(`*STALK HONOR OF KINGS*\n\n*» Id:* ${q}\n*» Nickname:* ${nickname}`)
        } if (command == "cekgi") {
          let cekGi = await cekNick("genshin-impact", q)
          reply(`*STALK GENSHIN IMPACT*\n\n*» Id:* ${q}\n*» Server:* ${cekGi.server}\n*» Nickname:* ${cekGi.nickname}`)
        } if (command == "cekpb") {
          let nickname = await cekNick("point-blank", q)
          reply(`*STALK POINT BLANK*\n\n*» Id:* ${q}\n*» Nickname:* ${nickname}`)
        } if (command == "ceksm") {
          let nickname = await cekNick("sausage-man", q)
          reply(`*STALK SAUSAGE MAN*\n\n*» Id:* ${q}\n*» Nickname:* ${nickname}`)
        } if (command == "ceksus") {
          let nickname = await cekNick("super-sus", q)
          reply(`*STALK SUPER SUS*\n\n*» Id:* ${q}\n*» Nickname:* ${nickname}`)
        } if (command == "cekvalo") {
          let nickname = await cekNick("valorant", q)
          reply(`*STALK VALORANT*\n\n*» Id:* ${q}\n*» Nickname:* ${nickname}`)
        } if (command == "cekcod") {
          let nickname = await cekNick("call-of-duty-mobile", q)
          reply(`*STALK CALL OF DUTY MOBILE*\n\n*» Id:* ${q}\n*» Nickname:* ${nickname}`)
        }
      }
        break

      case 'cekdana': case 'cekgopay': case 'cekgopaydriver': case 'cekgrab': case 'cekgrabdriver': case 'cekisaku': case 'ceklinkaja': case 'cekovo': case 'cekshopeepay': case 'cekpln': {
        if (db.data.users[sender] == undefined) return sendDaftar()
        if (isGroup && db.data.users[sender].device !== "android") return reply(`Bot hanya bisa diakses di private chat karena kamu menggunakan device ${db.data.users[sender].device.slice(0, 1).toUpperCase() + db.data.users[sender].device.slice(1)}`)
        if (!q) return reply(`Contoh: ${prefix + command} no`)

        if (command == "cekdana") {
          let nickname = await cekNick("dana", q)
          reply(`*STALK DANA*\n\n*» Nomor:* ${q}\n*» Nickname:* ${nickname}`)
        } else if (command == "cekgopay") {
          let nickname = await cekNick("gopay", q)
          reply(`*STALK GOPAY*\n\n*» Nomor:* ${q}\n*» Nickname:* ${nickname}`)
        } else if (command == "cekgopaydriver") {
          let nickname = await cekNick("gopay-driver", q)
          reply(`*STALK GOPAY DRIVER*\n\n*» Nomor:* ${q}\n*» Nickname:* ${nickname}`)
        } else if (command == "cekgrab") {
          let nickname = await cekNick("grab", q)
          reply(`*STALK GRAB*\n\n*» Nomor:* ${q}\n*» Nickname:* ${nickname}`)
        } else if (command == "cekgrabdriver") {
          let nickname = await cekNick("grab-driver", q)
          reply(`*STALK GRAB DRIVER*\n\n*» Nomor:* ${q}\n*» Nickname:* ${nickname}`)
        } else if (command == "cekisaku") {
          let nickname = await cekNick("isaku", q)
          reply(`*STALK ISAKU*\n\n*» Nomor:* ${q}\n*» Nickname:* ${nickname}`)
        } else if (command == "ceklinkaja") {
          let nickname = await cekNick("linkaja", q)
          reply(`*STALK LINKAJA*\n\n*» Nomor:* ${q}\n*» Nickname:* ${nickname}`)
        } else if (command == "cekovo") {
          let nickname = await cekNick("ovo", q)
          reply(`*STALK OVO*\n\n*» Nomor:* ${q}\n*» Nickname:* ${nickname}`)
        } else if (command == "cekshopeepay") {
          let nickname = await cekNick("shopee-pay", q)
          reply(`*STALK SHOPEE PAY*\n\n*» Nomor:* ${q}\n*» Nickname:* ${nickname}`)
        } else if (command == "cekpln") {
          let nickname = await cekNick("pln", q)
          reply(`*STALK PLN*\n\n*» Nomor:* ${q}\n*» Nickname:* ${nickname}`)
        }
      }
        break

      case 'upgrade': {
        if (db.data.users[sender] == undefined) return sendDaftar()
        if (isGroup && db.data.users[sender].device !== "android") return reply(`Bot hanya bisa diakses di private chat karena kamu menggunakan device ${db.data.users[sender].device.slice(0, 1).toUpperCase() + db.data.users[sender].device.slice(1)}`)
        if (q.toLowerCase() == "silver") {
          if (db.data.users[sender].role == "gold") return reply("Role kamu sudah tertinggi")

          let fee = Number(digit())
          let amount = Number(uSilver)

          let pay = await createDeposit(amount + fee, `./options/sticker/${sender.split("@")[0]}.jpg`)
          fee = fee + Number(pay.fee)

          let time = Date.now() + toMs("10m");
          let expirationTime = new Date(time);
          let timeLeft = Math.max(0, Math.floor((expirationTime - new Date()) / 60000));
          let currentTime = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
          let expireTimeJakarta = new Date(currentTime.getTime() + timeLeft * 60000);
          let hours = expireTimeJakarta.getHours().toString().padStart(2, '0');
          let minutes = expireTimeJakarta.getMinutes().toString().padStart(2, '0');
          let formattedTime = `${hours}:${minutes}`

          await sleep(500)
          let cap = `*🧾 MENUNGGU PEMBAYARAN 🧾*\n\n*Produk Name:* Upgrade Role Silver\n*Harga:* Rp${toRupiah(uSilver)}\n*Fee:* Rp${toRupiah(Number(fee))}\n*Total:* Rp${toRupiah(amount + fee)}\n*Waktu:* ${timeLeft} menit\n\nSilahkan scan Qris di atas sebelum ${formattedTime} untuk melakukan pembayaran.\n`;
          let mess = await ronzz.sendMessage(from, { image: fs.readFileSync(pay.path), caption: cap }, { quoted: m })

          let statusPay = false
          while (!statusPay) {
            await sleep(10000)
            if (Date.now() >= time) {
              statusPay = true
              await cancelDeposit(pay.reff_id)
              await ronzz.sendMessage(from, { delete: mess.key })
              reply("Pembayaran dibatalkan karena telah melewati batas expired.")
            }
            try {
              let data = await statusDeposit(pay.reff_id)

              if (data.status == "Success") {
                statusPay = true
                await ronzz.sendMessage(from, { delete: mess.key })
                db.data.users[sender].role = "silver"

                await reply(`Sukses upgrade role ke silver
        
*╭────「 TRANSAKSI DETAIL 」───*
*┊・ 📦| Nama Barang:* Upgrade Role Silver 
*┊・ 🏷️| Harga Barang:* Rp${toRupiah(uSilver)}
*┊・ 🛍️| Fee:* Rp${toRupiah(fee)}
*┊・ 💰| Total Bayar:* Rp${toRupiah(amount + fee)}
*┊・ 📅| Tanggal:* ${tanggal}
*┊・ ⏰| Jam:* ${jamwib} WIB
*╰┈┈┈┈┈┈┈┈*`);

                await ronzz.sendMessage(ownerNomer + "@s.whatsapp.net", {
                  text: `Hai Owner,
Ada yang upgrade role!
        
*╭────「 TRANSAKSI DETAIL 」───*
*┊・ 📮| Nomer:* @${sender.split("@")[0]}
*┊・ 📦| Nama Barang:* Upgrade Role Silver 
*┊・ 🏷️| Harga Barang:* Rp${toRupiah(uSilver)}
*┊・ 🛍️| Fee:* Rp${toRupiah(fee)}
*┊・ 💰| Total Bayar:* Rp${toRupiah(amount + fee)}
*┊・ 📅| Tanggal:* ${tanggal}
*┊・ ⏰| Jam:* ${jamwib} WIB
*╰┈┈┈┈┈┈┈┈*`, mentions: [sender]
                })
              }
            } catch (error) {
              statusPay = true
              await cancelDeposit(pay.reff_id)
              reply("Pesanan dibatalkan!")
              console.log("Error checking transaction status:", error);
            }
          }
          fs.unlinkSync(pay.path)
        } else if (q.toLowerCase() == "gold") {
          if (db.data.users[sender].role == "silver") {
            let fee = Number(digit())
            let amount = Number(uGold) - Number(uSilver)

            let pay = await createDeposit(amount + fee, `./options/sticker/${sender.split("@")[0]}.jpg`)
            fee = fee + Number(pay.fee)

            let time = Date.now() + toMs("10m");
            let expirationTime = new Date(time);
            let timeLeft = Math.max(0, Math.floor((expirationTime - new Date()) / 60000));
            let currentTime = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
            let expireTimeJakarta = new Date(currentTime.getTime() + timeLeft * 60000);
            let hours = expireTimeJakarta.getHours().toString().padStart(2, '0');
            let minutes = expireTimeJakarta.getMinutes().toString().padStart(2, '0');
            let formattedTime = `${hours}:${minutes}`

            await sleep(500)
            let cap = `*🧾 MENUNGGU PEMBAYARAN 🧾*\n\n*Produk Name:* Upgrade Role Gold\n*Harga:* Rp${toRupiah(Number(uGold) - Number(uSilver))}\n*Fee:* Rp${toRupiah(Number(fee))}\n*Total:* Rp${toRupiah(amount + fee)}\n*Waktu:* ${timeLeft} menit\n\nDikarenakan role Kamu sebelumnya Silver, maka harga upgrade role ke Gold adalah Rp${toRupiah(Number(uGold) - Number(uSilver))}\n\nSilahkan scan Qris di atas sebelum ${formattedTime} untuk melakukan pembayaran.\n`;
            let mess = await ronzz.sendMessage(from, { image: fs.readFileSync(pay.path), caption: cap }, { quoted: m })

            let statusPay = false;

            while (!statusPay) {
              await sleep(10000)
              if (Date.now() >= time) {
                statusPay = true
                await cancelDeposit(pay.reff_id)
                await ronzz.sendMessage(from, { delete: mess.key })
                reply("Pembayaran dibatalkan karena telah melewati batas expired.")
              }
              try {
                let data = await statusDeposit(pay.reff_id)

                if (data.status == "Success") {
                  statusPay = true
                  await ronzz.sendMessage(from, { delete: mess.key })
                  db.data.users[sender].role = "gold"

                  await reply(`Sukses upgrade role ke Gold
        
*╭────「 TRANSAKSI DETAIL 」───*
*┊・ 📌| Role Sebelum:* Silver
*┊・ 📦| Nama Barang:* Upgrade Role Gold
*┊・ 🏷️| Harga Barang:* Rp${toRupiah(Number(uGold) - Number(uSilver))}
*┊・ 🛍️| Fee:* Rp${toRupiah(Number(fee))}
*┊・ 💰| Total Bayar:* Rp${toRupiah(amount + fee)}
*┊・ 📅| Tanggal:* ${tanggal}
*┊・ ⏰| Jam:* ${jamwib} WIB
*╰┈┈┈┈┈┈┈┈*`);

                  await ronzz.sendMessage(ownerNomer + "@s.whatsapp.net", {
                    text: `Hai Owner,
Ada yang upgrade role!
        
*╭────「 TRANSAKSI DETAIL 」───*
*┊・ 📮| Nomer:* @${sender.split("@")[0]}
*┊・ 📌| Role Sebelum:* Silver
*┊・ 📦| Nama Barang:* Upgrade Role Gold
*┊・ 🏷️| Harga Barang:* Rp${toRupiah(Number(uGold) - Number(uSilver))}
*┊・ 🛍️| Fee:* Rp${toRupiah(Number(fee))}
*┊・ 💰| Total Bayar:* Rp${toRupiah(amount + fee)}
*┊・ 📅| Tanggal:* ${tanggal}
*┊・ ⏰| Jam:* ${jamwib} WIB
*╰┈┈┈┈┈┈┈┈*`, mentions: [sender]
                  })
                }
              } catch (error) {
                statusPay = true
                await cancelDeposit(pay.reff_id)
                reply("Pesanan dibatalkan!")
                console.log("Error checking transaction status:", error);
              }
            }
            fs.unlinkSync(pay.path)
          } else {
            let fee = Number(digit())
            let amount = Number(uGold)

            let pay = await createDeposit(amount + fee, `./options/sticker/${sender.split("@")[0]}.jpg`)
            fee = fee + Number(pay.fee)

            let time = Date.now() + toMs("10m");
            let expirationTime = new Date(time);
            let timeLeft = Math.max(0, Math.floor((expirationTime - new Date()) / 60000));
            let currentTime = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
            let expireTimeJakarta = new Date(currentTime.getTime() + timeLeft * 60000);
            let hours = expireTimeJakarta.getHours().toString().padStart(2, '0');
            let minutes = expireTimeJakarta.getMinutes().toString().padStart(2, '0');
            let formattedTime = `${hours}:${minutes}`

            await sleep(500)
            let cap = `*🧾 MENUNGGU PEMBAYARAN 🧾*\n\n*Produk Name:* Upgrade Role Gold\n*Harga:* Rp${toRupiah(uGold)}\n*Fee:* Rp${toRupiah(Number(fee))}\n*Total:* Rp${toRupiah(amount + fee)}\n*Waktu:* ${timeLeft} menit\n\nSilahkan scan Qris di atas sebelum ${formattedTime} untuk melakukan pembayaran.\n`;
            let mess = await ronzz.sendMessage(from, { image: fs.readFileSync(pay.path), caption: cap }, { quoted: m })

            let statusPay = false
            while (!statusPay) {
              await sleep(10000)
              if (Date.now() >= time) {
                statusPay = true
                await cancelDeposit(pay.reff_id)
                await ronzz.sendMessage(from, { delete: mess.key })
                reply("Pembayaran dibatalkan karena telah melewati batas expired.")
              }
              try {
                let data = await statusDeposit(pay.reff_id)
                let response = await axios.get(`https://gateway.okeconnect.com/api/mutasi/qris/${merchantId}/${apikey_orkut}`)
                let result = response.data.data.find(i => i.type == "CR" && i.qris == "static" && parseInt(i.amount) == parseInt(amount))
                console.log(result)

                if (data.status == "Success") {
                  statusPay = true
                  await ronzz.sendMessage(from, { delete: mess.key })
                  db.data.users[sender].role = "gold"

                  await reply(`Sukses upgrade role ke Gold
        
*╭────「 TRANSAKSI DETAIL 」───*
*┊・ 📦| Nama Barang:* Upgrade Role Gold
*┊・ 🏷️| Harga Barang:* Rp${toRupiah(uGold)}
*┊・ 🛍️| Fee:* Rp${toRupiah(Number(fee))}
*┊・ 💰| Total Bayar:* Rp${toRupiah(amount + fee)}
*┊・ 📅| Tanggal:* ${tanggal}
*┊・ ⏰| Jam:* ${jamwib} WIB
*╰┈┈┈┈┈┈┈┈*`);

                  await ronzz.sendMessage(ownerNomer + "@s.whatsapp.net", {
                    text: `Hai Owner,
Ada yang upgrade role!
        
*╭────「 TRANSAKSI DETAIL 」───*
*┊・ 📮| Nomer:* @${sender.split("@")[0]}
*┊・ 📦| Nama Barang:* Upgrade Role Gold
*┊・ 🏷️| Harga Barang:* Rp${toRupiah(uGold)}
*┊・ 🛍️| Fee:* Rp${toRupiah(Number(fee))}
*┊・ 💰| Total Bayar:* Rp${toRupiah(amount + fee)}
*┊・ 📅| Tanggal:* ${tanggal}
*┊・ ⏰| Jam:* ${jamwib} WIB
*╰┈┈┈┈┈┈┈┈*`, mentions: [sender]
                  })
                }
              } catch (error) {
                statusPay = true
                await cancelDeposit(pay.reff_id)
                reply("Pesanan dibatalkan!")
                console.log("Error checking transaction status:", error);
              }
            }
            fs.unlinkSync(pay.path)
          }
        } else {
          if (isAndroid) {
            ronzz.sendMessage(from, {
              footer: `${botName} © ${ownerName}`,
              buttons: [
                {
                  buttonId: 'action',
                  buttonText: { displayText: 'ini pesan interactiveMeta' },
                  type: 4,
                  nativeFlowInfo: {
                    name: 'single_select',
                    paramsJson: JSON.stringify({
                      title: 'Click To List',
                      sections: [
                        {
                          title: 'LIST ROLE',
                          rows: [
                            {
                              title: `Silver (Rp${toRupiah(db.data.users[sender].role == "silver" ? 0 : uSilver)})`,
                              description: `Benefit: fee produk menjadi ${db.data.type == "persen" ? `${db.data.persentase["silver"]}%` : `+Rp${toRupiah(db.data.profit["silver"])}`}`,
                              id: ".upgrade silver"
                            },
                            {
                              title: `Gold (Rp${toRupiah(db.data.users[sender].role == "silver" ? Number(uGold) - Number(uSilver) : uGold)})`,
                              description: `Benefit: fee produk menjadi ${db.data.type == "persen" ? `${db.data.persentase["gold"]}%` : `+Rp${toRupiah(db.data.profit["gold"])}`}`,
                              id: ".upgrade gold"
                            }
                          ]
                        }
                      ]
                    })
                  }
                }
              ],
              headerType: 1,
              viewOnce: true,
              image: fs.readFileSync(thumbnail),
              caption: `Silahkan pilih role di bawah ini.`,
              contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                externalAdReply: {
                  title: botName,
                  body: `By ${ownerName}`,
                  thumbnailUrl: ppuser,
                  sourceUrl: '',
                  mediaType: 1,
                  renderLargerThumbnail: false
                }
              }
            }, { quoted: m })
          } else {
            ronzz.sendMessage(from, {
              text: "Silahkan pilih role di bawah ini.",
              footer: `${botName} © ${ownerName}`,
              buttonText: "Klik untuk melihat role",
              sections: [
                {
                  title: "LIST ROLE",
                  rows: [
                    {
                      title: `Silver (Rp${toRupiah(db.data.users[sender].role == "silver" ? 0 : uSilver)})`,
                      description: `Benefit: fee produk menjadi ${db.data.type == "persen" ? `${db.data.persentase["silver"]}%` : `+Rp${toRupiah(db.data.profit["silver"])}`}`,
                      rowId: ".upgrade silver"
                    },
                    {
                      title: `Gold (Rp${toRupiah(db.data.users[sender].role == "silver" ? Number(uGold) - Number(uSilver) : uGold)})`,
                      description: `Benefit: fee produk menjadi ${db.data.type == "persen" ? `${db.data.persentase["gold"]}%` : `+Rp${toRupiah(db.data.profit["gold"])}`}`,
                      rowId: ".upgrade gold"
                    }
                  ]
                }
              ]
            }, { quoted: m })
          }
        }
      }
        break

      case 'profile': {
        if (!isOwner) return reply(mess.owner)
        let signature = crypto
          .createHash('md5')
          .update(api_id + api_key)
          .digest('hex')

        let keys = new URLSearchParams({
          'api_key': api_key,
          'sign': signature
        })

        fetch('https://arfystore.shop/api/profile', {
          'headers': {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          'method': 'POST',
          'body': keys
        })
          .then(response => response.json())
          .then(res => {
            let teks = `*👤「 PROFILE PROVIDER 」👤*\n\n*» Name:* ${res.data.full_name}\n*» Username:* ${res.data.username}\n*» Email:* ${res.data.email}\n*» Saldo:* Rp${toRupiah(res.data.saldo)}\n*» Level:* ${res.data.level}`
            reply(teks)
          })
      }
        break

      case 'cekip': {
        if (!isOwner) return reply(mess.owner)
        if (isGroup) return reply(mess.private)
        fetch("https://api64.ipify.org?format=json")
          .then((response) => response.json())
          .then(res => {
            reply('Silahkan sambungkan IP (' + res.ip + ') tersebut ke provider.')
          })
      }
        break

      case 'settype': {
        if (!isOwner) return reply(mess.owner)
        if (q.toLowerCase() == "persen") {
          db.data.type = "persen"
          reply("Sukses ubah type profit menjadi persentase")
        } else if (q.toLowerCase() == "nominal") {
          db.data.type = "nominal"
          reply("Sukses ubah type profit menjadi nominal")
        } else {
          if (isAndroid) {
            ronzz.sendMessage(from, {
              footer: `${botName} © ${ownerName}`,
              buttons: [
                {
                  buttonId: 'action',
                  buttonText: { displayText: 'ini pesan interactiveMeta' },
                  type: 4,
                  nativeFlowInfo: {
                    name: 'single_select',
                    paramsJson: JSON.stringify({
                      title: 'Klik untuk melihat type',
                      sections: [
                        {
                          title: 'LIST TYPE PROFIT',
                          rows: [
                            {
                              title: `Persentase`,
                              description: `Type profit menjadi persentase`,
                              id: ".settype persen"
                            },
                            {
                              title: `Nominal`,
                              description: `Type profit menjadi nominal`,
                              id: ".settype nominal"
                            }
                          ]
                        }
                      ]
                    })
                  }
                }
              ],
              headerType: 1,
              viewOnce: true,
              image: fs.readFileSync(thumbnail),
              caption: `Silahkan pilih type profit di bawah ini.`,
              contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                externalAdReply: {
                  title: botName,
                  body: `By ${ownerName}`,
                  thumbnailUrl: ppuser,
                  sourceUrl: '',
                  mediaType: 1,
                  renderLargerThumbnail: false
                }
              }
            }, { quoted: m })
          } else {
            ronzz.sendMessage(from, {
              text: "Silahkan pilih type profit di bawah ini.",
              footer: `${botName} © ${ownerName}`,
              buttonText: "Klik untuk melihat type",
              sections: [
                {
                  title: "LIST TYPE PROFIT",
                  rows: [
                    {
                      title: `Persentase`,
                      description: `Type profit menjadi persentase`,
                      rowId: ".settype persen"
                    },
                    {
                      title: `Nominal`,
                      description: `Type profit menjadi nominal`,
                      rowId: ".settype nominal"
                    }
                  ]
                }
              ]
            }, { quoted: m })
          }
        }
      }
        break

      case 'setprofit': {
        if (!isOwner) return reply(mess.owner)
        if (db.data.type == "persen") {
          if (!q.split(" ")[1]) return reply(`Penggunaan: ${prefix + command} role persen\n\nContoh: ${prefix + command} bronze 5\n\nRole tersedia\n- bronze\n- silver\n- gold`)
          if (isNaN(q.split(" ")[1])) return reply(`Persentase hanya angka\n\nPenggunaan: ${prefix + command} role persen\n\nContoh: ${prefix + command} role 5\n\nRole tersedia\n- bronze\n- silver\n- gold`)
          if (q.split(" ")[1].replace(",", ".") < 0.1) return reply('Minimal persentase 0.1%')
          db.data.persentase[q.split(" ")[0].toLowerCase()] = Number(q.split(" ")[1].replace(",", "."))
          reply(`Persentase untuk role ${q.split(" ")[0]} telah diset menjadi ${q.split(" ")[1]}%`)
        } else if (db.data.type == "nominal") {
          if (!q.split(" ")[1]) return reply(`Penggunaan: ${prefix + command} role nominal\n\nContoh: ${prefix + command} bronze 1000\n\nRole tersedia\n- bronze\n- silver\n- gold`)
          if (isNaN(q.split(" ")[1])) return reply(`Nominal hanya angka\n\nPenggunaan: ${prefix + command} role nominal\n\nContoh: ${prefix + command} bronze 1000\n\nRole tersedia\n- bronze\n- silver\n- gold`)
          if (q.split(" ")[1] < 1) return reply('Minimal nominal Rp1')
          db.data.profit[q.split(" ")[0].toLowerCase()] = Number(q.split(" ")[1])
          reply(`Nominal profit untuk role ${q.split(" ")[0]} telah diset menjadi Rp${toRupiah(Number(q.split(" ")[1]))}`)
        }
      }
        break

      case 'customprofit': {
        if (!isOwner) return reply(mess.owner)
        let data = q.split("|")
        if (!data[0]) return reply(`Contoh: ${prefix + command} persen/nominal`)
        if (!data[1] && data[0] !== "persen" && data[0] !== "nominal") return reply("Type profit tersedia persen/nominal")
        if (data[0] && !data[1]) {
          let kategori = ["Games", "Data", "Pulsa", "PLN", "E-Money"]
          var sortFunc = (a, b) => {
            var textA = a.toLowerCase()
            var textB = b.toLowerCase()
            if (textA > textB) return 1
            if (textA < textB) return -1
          }
          kategori.sort(sortFunc)

          let rows = []

          if (isAndroid) {
            kategori.map(i => {
              rows.push({
                title: i,
                description: `Custom profit untuk kategori ${i}`,
                id: `.${command} ${i}|${data[0].toLowerCase()}`
              })
            })

            ronzz.sendMessage(from, {
              footer: `${botName} © ${ownerName}`,
              buttons: [
                {
                  buttonId: 'action',
                  buttonText: { displayText: 'ini pesan interactiveMeta' },
                  type: 4,
                  nativeFlowInfo: {
                    name: 'single_select',
                    paramsJson: JSON.stringify({
                      title: 'Klik untuk melihat kategori',
                      sections: [
                        {
                          title: 'LIST KATEGORI',
                          rows
                        }
                      ]
                    })
                  }
                }
              ],
              headerType: 1,
              viewOnce: true,
              image: fs.readFileSync(thumbnail),
              caption: `Silahkan pilih kategori yang tersedia di bawah ini.`,
              contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                externalAdReply: {
                  title: botName,
                  body: `By ${ownerName}`,
                  thumbnailUrl: ppuser,
                  sourceUrl: '',
                  mediaType: 1,
                  renderLargerThumbnail: false
                }
              }
            }, { quoted: m })
          } else {
            kategori.map(i => {
              rows.push({
                title: i,
                description: `Custom profit untuk kategori ${i}`,
                rowId: `.${command} ${i}|${data[0].toLowerCase()}`
              })

              ronzz.sendMessage(from, {
                text: "Silahkan pilih kategori yang tersedia di bawah ini.",
                footer: `${botName} © ${ownerName}`,
                buttonText: "Klik untuk melihat kategori",
                sections: [
                  {
                    title: "LIST KATEGORI",
                    rows
                  }
                ]
              }, { quoted: m })
            })
          }
        } else if (data[1]) {
          db.data.customProfit[data[0].toLowerCase().replaceAll('-', '')] = data[1]
          reply(`Sukses custom profit untuk kategori ${data[0]} menjadi ${data[1]}`)
        }
      }
        break

      case 'delcustomprofit': {
        if (!isOwner) return reply(mess.owner)
        let kategori = ["Games", "Data", "Pulsa", "PLN", "E-Money"]
        var sortFunc = (a, b) => {
          var textA = a.toLowerCase()
          var textB = b.toLowerCase()
          if (textA > textB) return 1
          if (textA < textB) return -1
        }
        kategori.sort(sortFunc)

        let rows = []

        if (isAndroid) {
          kategori.map(i => {
            rows.push({
              title: i,
              description: `Delete custom profit untuk kategori ${i}`,
              id: `.${command} ${i.replaceAll('-', '')}`
            })
          })

          if (!q) return ronzz.sendMessage(from, {
            footer: `${botName} © ${ownerName}`,
            buttons: [
              {
                buttonId: 'action',
                buttonText: { displayText: 'ini pesan interactiveMeta' },
                type: 4,
                nativeFlowInfo: {
                  name: 'single_select',
                  paramsJson: JSON.stringify({
                    title: 'Klik untuk melihat kategori',
                    sections: [
                      {
                        title: 'LIST KATEGORI',
                        rows
                      }
                    ]
                  })
                }
              }
            ],
            headerType: 1,
            viewOnce: true,
            image: fs.readFileSync(thumbnail),
            caption: `Silahkan pilih kategori yang tersedia di bawah ini.`,
            contextInfo: {
              forwardingScore: 999,
              isForwarded: true,
              externalAdReply: {
                title: botName,
                body: `By ${ownerName}`,
                thumbnailUrl: ppuser,
                sourceUrl: '',
                mediaType: 1,
                renderLargerThumbnail: false
              }
            }
          }, { quoted: m })
        } else {
          kategori.map(i => {
            rows.push({
              title: i,
              description: `Delete custom profit untuk kategori ${i}`,
              rowId: `.${command} ${i.replaceAll('-', '')}`
            })
          })

          if (!q) return ronzz.sendMessage(from, {
            text: "Silahkan pilih kategori yang tersedia di bawah ini.",
            footer: `${botName} © ${ownerName}`,
            buttonText: "Klik untuk melihat kategori",
            sections: [
              {
                title: "LIST KATEGORI",
                rows
              }
            ]
          }, { quoted: m })
        }
        delete db.data.customProfit[q.toLowerCase()]
        reply(`Sukses delete custom profit dengan kategori ${q}`)
      }
        break

      case 'sticker': case 's': case 'stiker': {
        if (isImage || isQuotedImage) {
          let media = await downloadAndSaveMediaMessage('image', `./options/sticker/${tanggal}.jpg`)
          reply(mess.wait)
          ronzz.sendImageAsSticker(from, media, m, { packname: `${packname}`, author: `${author}` })
        } else if (isVideo || isQuotedVideo) {
          let media = await downloadAndSaveMediaMessage('video', `./options/sticker/${tanggal}.mp4`)
          reply(mess.wait)
          ronzz.sendVideoAsSticker(from, media, m, { packname: `${packname}`, author: `${author}` })
        } else {
          reply(`Kirim/reply gambar/vidio dengan caption *${prefix + command}*`)
        }
      }
        break

      case 'addsewa': {
        if (!isOwner) return reply(mess.owner)
        if (!isGroup) return reply(mess.group)
        if (!q) return reply(`Ex: ${prefix + command} hari\n\nContoh: ${prefix + command} 30d`)
        db.data.sewa[from] = {
          id: from,
          expired: Date.now() + toMs(q)
        }
        Reply(`*SEWA ADDED*\n\n*ID*: ${groupId}\n*EXPIRED*: ${ms(toMs(q)).days} days ${ms(toMs(q)).hours} hours ${ms(toMs(q)).minutes} minutes\n\nBot akan keluar secara otomatis dalam waktu yang sudah di tentukan.`)
      }
        break

      case 'delsewa': {
        if (!isOwner) return reply(mess.owner)
        if (!isGroup) return reply(mess.group)
        delete db.data.sewa[from]
        reply('Sukses delete sewa di group ini.')
      }
        break

      case 'ceksewa': {
        if (!isGroupAdmins && !isOwner) return reply(mess.admin)
        if (!isGroup) return reply(mess.group)
        if (!isSewa) return reply('Kamu belum sewa bot.')
        let cekExp = ms(db.data.sewa[from].expired - Date.now())
        Reply(`*SEWA EXPIRED*\n\n*ID*: ${groupId}\n*SEWA EXPIRED*: ${cekExp.days} days ${cekExp.hours} hours ${cekExp.minutes} minutes`)
      }
        break

      case 'listsewa': {
        if (!isOwner) return reply(mess.owner)
        if (db.data.sewa == 0) return reply('Belum ada list sewa di database')
        let teks = '*LIST SEWA BOT*\n\n'
        let sewaKe = 0
        for (let i = 0; i < getAllSewa().length; i++) {
          sewaKe++
          teks += `${sewaKe}. ${getAllSewa()[i]}\n\n`
        }
        Reply(teks)
      }
        break

      case 'kalkulator': {
        if (!q) return reply(`Contoh: ${prefix + command} + 5 6\n\nList kalkulator:\n+\n-\n÷\n×`)
        if (q.split(" ")[0] == "+") {
          let q1 = Number(q.split(" ")[1])
          let q2 = Number(q.split(" ")[2])
          reply(`${q1 + q2}`)
        } else if (q.split(" ")[0] == "-") {
          let q1 = Number(q.split(" ")[1])
          let q2 = Number(q.split(" ")[2])
          reply(`${q1 - q2}`)
        } else if (q.split(" ")[0] == "÷") {
          let q1 = Number(q.split(" ")[1])
          let q2 = Number(q.split(" ")[2])
          reply(`${q1 / q2}`)
        } else if (q.split(" ")[0] == "×") {
          let q1 = Number(q.split(" ")[1])
          let q2 = Number(q.split(" ")[2])
          reply(`${q1 * q2}`)
        }
      }
        break

      case 'welcome': {
        if (!isGroup) return reply(mess.group)
        if (!isGroupAdmins && !isOwner) return reply(mess.admin)
        if (!q) return reply(`Contoh: ${prefix + command} on/off`)
        if (q.toLowerCase() == "on") {
          if (db.data.chat[from].welcome) return reply('Welcome sudah aktif di grup ini.')
          db.data.chat[from].welcome = true
          reply('Sukses mengaktifkan welcome di grup ini.')
        } else if (q.toLowerCase() == "off") {
          if (!db.data.chat[from].welcome) return reply('Welcome sudah tidak aktif di grup ini.')
          db.data.chat[from].welcome = false
          reply('Sukses menonaktifkan welcome di grup ini.')
        }
      }
        break

      case 'antilink': {
        if (!isGroup) return reply(mess.group)
        if (!isGroupAdmins && !isOwner) return reply(mess.admin)
        if (!q) return reply(`Contoh: ${prefix + command} on/off`)
        if (q.toLowerCase() == "on") {
          if (db.data.chat[from].antilink) return reply('Antilink sudah aktif di grup ini.')
          db.data.chat[from].antilink = true
          reply('Sukses mengaktifkan antilink di grup ini.')
        } else if (q.toLowerCase() == "off") {
          if (!db.data.chat[from].antilink) return reply('Antilink sudah tidak aktif di grup ini.')
          db.data.chat[from].antilink = false
          reply('Sukses menonaktifkan antilink di grup ini.')
        }
      }
        break

      case 'antilinkv2': {
        if (!isGroup) return reply(mess.group)
        if (!isGroupAdmins && !isOwner) return reply(mess.admin)
        if (!q) return reply(`Contoh: ${prefix + command} on/off`)
        if (q.toLowerCase() == "on") {
          if (db.data.chat[from].antilink2) return reply('Antilinkv2 sudah aktif di grup ini.')
          db.data.chat[from].antilink2 = true
          reply('Sukses mengaktifkan antilinkv2 di grup ini.')
        } else if (q.toLowerCase() == "off") {
          if (!db.data.chat[from].antilink2) return reply('Antilinkv2 sudah tidak aktif di grup ini.')
          db.data.chat[from].antilink2 = false
          reply('Sukses menonaktifkan antilinkv2 di grup ini.')
        }
      }
        break

      case 'anticall': {
        if (!isOwner) return reply(mess.owner)
        if (!q) return reply(`Contoh: ${prefix + command} on/off`)
        if (q.toLowerCase() == "on") {
          if (db.data.chat[from].anticall) return reply('Anticall sudah aktif.')
          db.data.chat[from].anticall = true
          reply('Sukses mengaktifkan anticall.')
        } else if (q.toLowerCase() == "off") {
          if (!db.data.chat[from].anticall) return reply('Anticall sudah tidak aktif.')
          db.data.chat[from].anticall = false
          reply('Sukses menonaktifkan anticall.')
        }
      }
        break

      case 'kick': {
        if (!isGroup) return reply(mess.group)
        if (!isGroupAdmins) return reply(mess.admin)
        if (!isBotGroupAdmins) return reply(mess.botAdmin)
        let number;
        if (q.length !== 0) {
          number = q.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
          ronzz.groupParticipantsUpdate(from, [number], "remove")
            .then(res => reply('Sukses...'))
            .catch((err) => reply(mess.error.api))
        } else if (isQuotedMsg) {
          number = m.quoted.sender
          ronzz.groupParticipantsUpdate(from, [number], "remove")
            .then(res => reply('Sukses...'))
            .catch((err) => reply(mess.error.api))
        } else {
          reply('Tag atau balas pesan orang yang ingin dikeluarkan dari grup.')
        }
      }
        break

      case 'promote': {
        if (!isGroup) return reply(mess.group)
        if (!isGroupAdmins) return reply(mess.admin)
        if (!isBotGroupAdmins) return reply(mess.botAdmin)
        let number;
        if (q.length !== 0) {
          number = q.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
          ronzz.groupParticipantsUpdate(from, [number], "promote")
            .then(res => ronzz.sendMessage(from, { text: `Sukses menjadikan @${number.split("@")[0]} sebagai admin`, mentions: [number] }, { quoted: m }))
            .catch((err) => reply(mess.error.api))
        } else if (isQuotedMsg) {
          number = m.quoted.sender
          ronzz.groupParticipantsUpdate(from, [number], "promote")
            .then(res => ronzz.sendMessage(from, { text: `Sukses menjadikan @${number.split("@")[0]} sebagai admin`, mentions: [number] }, { quoted: m }))
            .catch((err) => reply(mess.error.api))
        } else {
          reply('Tag atau balas pesan orang yang ingin dijadikan admin.')
        }
      }
        break

      case 'demote': {
        if (!isGroup) return reply(mess.group)
        if (!isGroupAdmins) return reply(mess.admin)
        if (!isBotGroupAdmins) return reply(mess.botAdmin)
        let number;
        if (q.length !== 0) {
          number = q.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
          ronzz.groupParticipantsUpdate(from, [number], "demote")
            .then(res => ronzz.sendMessage(from, { text: `Sukses menjadikan @${number.split("@")[0]} sebagai anggota group`, mentions: [number] }, { quoted: m }))
            .catch((err) => reply(mess.error.api))
        } else if (isQuotedMsg) {
          number = m.quoted.sender
          ronzz.groupParticipantsUpdate(from, [number], "demote")
            .then(res => ronzz.sendMessage(from, { text: `Sukses menjadikan @${number.split("@")[0]} sebagai anggota group`, mentions: [number] }, { quoted: m }))
            .catch((err) => reply(mess.error.api))
        } else {
          reply('Tag atau balas pesan orang yang ingin dijadikan anggota group.')
        }
      }
        break

      case 'revoke':
        if (!isGroup) return reply(mess.group)
        if (!isGroupAdmins) return reply(mess.admin)
        if (!isBotGroupAdmins) return reply(mess.botAdmin)
        await ronzz.groupRevokeInvite(from)
          .then(res => {
            reply('Sukses menyetel tautan undangan grup ini.')
          }).catch(() => reply(mess.error.api))
        break

      case 'linkgrup': case 'linkgroup': case 'linkgc': {
        if (!isGroup) return reply(mess.group)
        if (!isBotGroupAdmins) return reply(mess.botAdmin)
        let url = await ronzz.groupInviteCode(from).catch(() => reply(mess.errorApi))
        url = 'https://chat.whatsapp.com/' + url
        reply(url)
      }
        break

      case 'del': case 'delete': {
        if (!isGroup) return reply(mess.group)
        if (!isGroupAdmins && !isOwner) return reply(mess.admin)
        if (!isQuotedMsg) return reply(`Reply chat yang ingin dihapus dengan caption *${prefix + command}*`)
        if (m.quoted.fromMe) {
          await ronzz.sendMessage(from, { delete: { fromMe: true, id: m.quoted.id, remoteJid: from } })
        } else if (!m.quoted.fromMe) {
          if (!isBotGroupAdmins) return reply(mess.botAdmin)
          await ronzz.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: m.quoted.id, participant: m.quoted.sender } })
        }
      }
        break

      case 'blok': case 'block':
        if (!isOwner && !fromMe) return reply(mess.owner)
        if (!q) return reply(`Contoh: ${prefix + command} 628xxx`)
        await ronzz.updateBlockStatus(q.replace(/[^0-9]/g, '') + '@s.whatsapp.net', "block") // Block user
        reply('Sukses block nomor.')
        break

      case 'unblok': case 'unblock':
        if (!isOwner && !fromMe) return reply(mess.owner)
        if (!q) return reply(`Contoh: ${prefix + command} 628xxx`)
        await ronzz.updateBlockStatus(q.replace(/[^0-9]/g, '') + '@s.whatsapp.net', "unblock") // Block user
        reply('Sukses unblock nomor.')
        break

      case 'script': case 'sc':
        reply(`Mau pake scriptnya?\n\n*hubungi owner jika perlu*\https://wa.me/message/7WQO4ZF63JQ6F1\n\nSudah termasuk tutorial.\nKalau error difixs.\nPasti dapet update dari *Ezy.*\nSize script ringan.\nAnti ngelag/delay.`)
        break

      case 'owner':
        ronzz.sendContact(from, [ownerNomer], m)
        break

      case 'creator':
        ronzz.sendMessage(from, { text: 'Creator sc ini adalah\n@62895630880006 (Ezy)', mentions: ['62895630880006@s.whatsapp.net'] }, { quoted: m })
        break

      case 'tes': case 'runtime':
        reply(`*STATUS : BOT ONLINE*\n_Runtime : ${runtime(process.uptime())}_`)
        break

      case 'ping':
        let timestamp = speed()
        let latensi = speed() - timestamp
        reply(`Kecepatan respon _${latensi.toFixed(4)} Second_\n\n*💻 INFO SERVER*\nHOSTNAME: ${os.hostname}\nRAM: ${formatp(os.totalmem() - os.freemem())} / ${formatp(os.totalmem())}\nCPUs: ${os.cpus().length} core`)
        break

      case 'setdone':
        if (!isGroup) return reply(mess.group)
        if (!isGroupAdmins && !isOwner) return reply(mess.admin)
        if (db.data.chat[from].sDone.length !== 0) return reply(`Set done sudah ada di group ini.`)
        if (!q) return reply(`Gunakan dengan cara *${prefix + command} teks*\n\nList function:\n@tag : untuk tag orang\n@tanggal\n@jam\n@status`)
        db.data.chat[from].sDone = q
        reply(`Sukses set done`)
        break

      case 'deldone':
        if (!isGroup) return reply(mess.group)
        if (!isGroupAdmins && !isOwner) return reply(mess.admin)
        if (db.data.chat[from].sDone.length == 0) return reply(`Belum ada set done di sini.`)
        db.data.chat[from].sDone = ""
        reply(`Sukses delete set done`)
        break

      case 'changedone':
        if (!isGroup) return reply(mess.group)
        if (!isGroupAdmins && !isOwner) return reply(mess.admin)
        if (!q) return reply(`Gunakan dengan cara *${prefix + command} teks*\n\nList function:\n@tag : untuk tag orang\n@tanggal\n@jam\n@status`)
        db.data.chat[from].sDone = q
        reply(`Sukses mengganti teks set done`)
        break

      case 'setproses':
        if (!isGroup) return reply(mess.group)
        if (!isGroupAdmins && !isOwner) return reply(mess.admin)
        if (db.data.chat[from].sProses.length !== 0) return reply(`Set proses sudah ada di group ini.`)
        if (!q) return reply(`Gunakan dengan cara *${prefix + command} teks*\n\nList function:\n@tag : untuk tag orang\n@tanggal\n@jam\n@status`)
        db.data.chat[from].sProses = q
        reply(`Sukses set proses`)
        break

      case 'delproses':
        if (!isGroup) return reply(mess.group)
        if (!isGroupAdmins && !isOwner) return reply(mess.admin)
        if (db.data.chat[from].sProses.length == 0) return reply(`Belum ada set proses di sini.`)
        db.data.chat[from].sProses = ""
        reply(`Sukses delete set proses`)
        break

      case 'changeproses':
        if (!isGroup) return reply(mess.group)
        if (!isGroupAdmins && !isOwner) return reply(mess.admin)
        if (!q) return reply(`Gunakan dengan cara *${prefix + command} teks*\n\nList function:\n@tag : untuk tag orang\n@tanggal\n@jam\n@status`)
        db.data.chat[from].sProses = q
        reply(`Sukses ganti teks set proses`)
        break

      case 'done': {
        if (!isGroup) return (mess.group)
        if (!isGroupAdmins && !isOwner) return (mess.admin)
        if (q.startsWith("@")) {
          if (db.data.chat[from].sDone.length !== 0) {
            let textDone = db.data.chat[from].sDone
            ronzz.sendMessage(from, { text: textDone.replace('tag', q.replace(/[^0-9]/g, '')).replace('@jam', jamwib).replace('@tanggal', tanggal).replace('@status', 'Berhasil'), mentions: [q.replace(/[^0-9]/g, '') + '@s.whatsapp.net'] });
          } else {
            ronzz.sendMessage(from, { text: `「 *TRANSAKSI BERHASIL* 」\n\n\`\`\`📆 TANGGAL : ${tanggal}\n⌚ JAM : ${jamwib}\n✨ STATUS: Berhasil\`\`\`\n\nTerimakasih @${q.replace(/[^0-9]/g, '')} next order yaa🙏`, mentions: [q.replace(/[^0-9]/g, '') + '@s.whatsapp.net'] }, { quoted: m });
          }
        } else if (isQuotedMsg) {
          if (db.data.chat[from].sDone.length !== 0) {
            let textDone = db.data.chat[from].sDone
            ronzz.sendMessage(from, { text: textDone.replace('tag', m.quoted.sender.split("@")[0]).replace('@jam', jamwib).replace('@tanggal', tanggal).replace('@status', 'Berhasil'), mentions: [m.quoted.sender] }, { quoted: m })
          } else {
            ronzz.sendMessage(from, { text: `「 *TRANSAKSI BERHASIL* 」\n\n\`\`\`📆 TANGGAL : ${tanggal}\n⌚ JAM : ${jamwib}\n✨ STATUS: Berhasil\`\`\`\n\nTerimakasih @${m.quoted.sender.split("@")[0]} next order yaa🙏`, mentions: [m.quoted.sender] })
          }
        } else {
          reply('Reply atau tag orangnya')
        }
      }
        break

      case 'proses':
        if (!isGroup) return (mess.group)
        if (!isGroupAdmins && !isOwner) return (mess.admin)
        if (isQuotedMsg) {
          if (db.data.chat[from].sProses.length !== 0) {
            let textProses = db.data.chat[from].sProses
            ronzz.sendMessage(from, { text: textProses.replace('tag', m.quoted.sender.split("@")[0]).replace('@jam', jamwib).replace('@tanggal', tanggal).replace('@status', 'Pending'), mentions: [m.quoted.sender] }, { quoted: m });
          } else {
            ronzz.sendMessage(from, { text: `「 *TRANSAKSI PENDING* 」\n\n\`\`\`📆 TANGGAL : ${tanggal}\n⌚ JAM : ${jamwib}\n✨ STATUS: Pending\`\`\`\n\nPesanan @${m.quoted.sender.split("@")[0]} sedang diproses🙏`, mentions: [m.quoted.sender] });
          }
        } else if (q.startsWith("@")) {
          if (db.data.chat[from].sProses.length !== 0) {
            let textProses = db.data.chat[from].sProses
            ronzz.sendMessage(from, { text: textProses.replace('tag', q.replace(/[^0-9]/g, '')).replace('@jam', jamwib).replace('@tanggal', tanggal).replace('@status', 'Pending'), mentions: [q.replace(/[^0-9]/g, '') + '@s.whatsapp.net'] });
          } else {
            ronzz.sendMessage(from, { text: `「 *TRANSAKSI PENDING* 」\n\n\`\`\`📆 TANGGAL : ${tanggal}\n⌚ JAM : ${jamwib}\n✨ STATUS: Pending\`\`\`\n\nPesanan @${q.replace(/[^0-9]/g, '')} sedang diproses🙏`, mentions: [q.replace(/[^0-9]/g, '') + '@s.whatsapp.net'] }, { quoted: m });
          }
        } else {
          reply('Reply atau tag orangnya')
        }
        break

      case 'list': {
        if (db.data.users[sender] == undefined) return sendDaftar()
        if (isGroup && db.data.users[sender].device !== "android") return reply(`Bot hanya bisa diakses di private chat karena kamu menggunakan device ${db.data.users[sender].device.slice(0, 1).toUpperCase() + db.data.users[sender].device.slice(1)}`)
        if (db.data.list.length === 0) return reply(`Belum ada list respon di database`)
        let teks = `Hai @${sender.split("@")[0]}\nBerikut list dari Owner saya`
        var sortFunc = (a, b) => {
          var textA = a.key.toLowerCase()
          var textB = b.key.toLowerCase()
          if (textA > textB) return 1
          if (textA < textB) return -1
        }
        db.data.list.sort(sortFunc)
        let rows = []
        if (isAndroid) {
          for (let x of db.data.list) {
            rows.push({
              title: `🛍️ ${x.key.toUpperCase()}`,
              id: x.key
            })
          }

          ronzz.sendMessage(from, {
            footer: `${botName} © ${ownerName}`,
            buttons: [
              {
                buttonId: 'action',
                buttonText: { displayText: 'ini pesan interactiveMeta' },
                type: 4,
                nativeFlowInfo: {
                  name: 'single_select',
                  paramsJson: JSON.stringify({
                    title: 'Klik untuk melihat list',
                    sections: [
                      {
                        title: 'LIST MESSAGE',
                        rows
                      }
                    ]
                  })
                }
              }
            ],
            headerType: 1,
            viewOnce: true,
            image: fs.readFileSync(thumbnail),
            caption: teks,
            contextInfo: {
              forwardingScore: 999,
              isForwarded: true,
              mentionedJid: parseMention(teks),
              externalAdReply: {
                title: botName,
                body: `By ${ownerName}`,
                thumbnailUrl: ppuser,
                sourceUrl: '',
                mediaType: 1,
                renderLargerThumbnail: false
              }
            }
          }, { quoted: m })
        } else {
          for (let x of db.data.list) {
            rows.push({
              title: `🛍️ ${x.key.toUpperCase()}`,
              rowId: x.key
            })
          }

          ronzz.sendMessage(from, {
            text: teks,
            footer: `${botName} © ${ownerName}`,
            mentions: parseMention(teks),
            buttonText: "Klik untuk melihat list",
            sections: [
              {
                title: "LIST MESSAGE",
                rows
              }
            ]
          }, { quoted: m })
        }
      }
        break

      case 'testi': {
        if (db.data.users[sender] == undefined) return sendDaftar()
        if (isGroup && db.data.users[sender].device !== "android") return reply(`Bot hanya bisa diakses di private chat karena kamu menggunakan device ${db.data.users[sender].device.slice(0, 1).toUpperCase() + db.data.users[sender].device.slice(1)}`)
        if (db.data.testi.length === 0) return reply(`Belum ada list testi di database`)
        let teks = `Hai @${sender.split("@")[0]}\nBerikut list testi Owner saya`
        var sortFunc = (a, b) => {
          var textA = a.key.toLowerCase()
          var textB = b.key.toLowerCase()
          if (textA > textB) return 1
          if (textA < textB) return -1
        }
        db.data.testi.sort(sortFunc)
        let rows = []

        if (isAndroid) {
          for (let x of db.data.testi) {
            rows.push({
              title: `🛍️ ${x.key.toUpperCase()}`,
              id: x.key
            })
          }
          ronzz.sendMessage(from, {
            footer: `${botName} © ${ownerName}`,
            buttons: [
              {
                buttonId: 'action',
                buttonText: { displayText: 'ini pesan interactiveMeta' },
                type: 4,
                nativeFlowInfo: {
                  name: 'single_select',
                  paramsJson: JSON.stringify({
                    title: 'Klik untuk melihat testi',
                    sections: [
                      {
                        title: 'LIST TESTI',
                        rows
                      }
                    ]
                  })
                }
              }
            ],
            headerType: 1,
            viewOnce: true,
            image: fs.readFileSync(thumbnail),
            caption: teks,
            contextInfo: {
              forwardingScore: 999,
              isForwarded: true,
              mentionedJid: parseMention(teks),
              externalAdReply: {
                title: botName,
                body: `By ${ownerName}`,
                thumbnailUrl: ppuser,
                sourceUrl: '',
                mediaType: 1,
                renderLargerThumbnail: false
              }
            }
          }, { quoted: m })
        } else {
          for (let x of db.data.testi) {
            rows.push({
              title: `🛍️ ${x.key.toUpperCase()}`,
              id: x.key
            })
          }

          ronzz.sendMessage(from, {
            text: teks,
            footer: `${botName} © ${ownerName}`,
            mentions: parseMention(teks),
            buttonText: "Klik untuk melihat testi",
            sections: [
              {
                title: "LIST TESTI",
                rows
              }
            ]
          }, { quoted: m })
        }
      }
        break

      case 'addlist': {
        if (!isOwner) return reply(mess.owner)
        if (!q.includes("|")) return reply(`Gunakan dengan cara ${prefix + command} *key|response*\n\n_Contoh_\n\n${prefix + command} tes|apa`)
        if (isAlreadyResponList(q.split("|")[0])) return reply(`List respon dengan key: *${q.split("|")[0]}* sudah ada di database.`)
        if (isImage || isQuotedImage) {
          let media = await downloadAndSaveMediaMessage('image', `./options/sticker/${sender}.jpg`)
          let tph = await TelegraPh(media)
          addResponList(q.split("|")[0], q.split("|")[1], true, tph)
          reply(`Berhasil menambah list menu *${q.split("|")[0]}*`)
          fs.unlinkSync(media)
        } else {
          addResponList(q.split("|")[0], q.split("|")[1], false, '-')
          reply(`Berhasil menambah list respon *${q.split("|")[0]}*`)
        }
      }
        break

      case 'addtesti': {
        if (!isOwner) return reply(mess.owner)
        if (isImage || isQuotedImage) {
          if (!q.includes("|")) return reply(`Gunakan dengan cara ${prefix + command} *key|response*\n\n_Contoh_\n\n${prefix + command} tes|apa`)
          if (isAlreadyResponTesti(q.split("|")[0])) return reply(`List respon dengan key : *${q.split("|")[0]}* sudah ada.`)
          let media = await downloadAndSaveMediaMessage('image', `./options/sticker/${sender}.jpg`)
          let tph = await TelegraPh(media)
          addResponTesti(q.split("|")[0], q.split("|")[1], true, tph)
          reply(`Berhasil menambah list testi *${q.split("|")[0]}*`)
          fs.unlinkSync(media)
        } else {
          reply(`Kirim gambar dengan caption ${prefix + command} *key|response* atau reply gambar yang sudah ada dengan caption ${prefix + command} *key|response*`)
        }
      }
        break

      case 'dellist':
        if (!isGroupAdmins && !isOwner) return reply(mess.admin)
        if (db.data.list.length === 0) return reply(`Belum ada list message di database`)
        if (!q) return reply(`Gunakan dengan cara ${prefix + command} *key*\n\n_Contoh_\n\n${prefix + command} hello`)
        if (!isAlreadyResponList(q)) return reply(`List respon dengan key *${q}* tidak ada di database!`)
        delResponList(q)
        reply(`Sukses delete list respon dengan key *${q}*`)
        break

      case 'deltesti':
        if (!isOwner) return reply(mess.owner)
        if (db.data.testi.length === 0) return reply(`Belum ada list testi di database`)
        if (!q) return reply(`Gunakan dengan cara ${prefix + command} *key*\n\n_Contoh_\n\n${prefix + command} hello`)
        if (!isAlreadyResponTesti(q)) return reply(`List testi dengan key *${q}* tidak ada di database!`)
        delResponTesti(q)
        reply(`Sukses delete list testi dengan key *${q}*`)
        break

      case 'setlist': {
        if (!isGroupAdmins && !isOwner) return reply(mess.admin)
        if (!q.includes("|")) return reply(`Gunakan dengan cara ${prefix + command} *key|response*\n\n_Contoh_\n\n${prefix + command} test|apa`)
        if (!isAlreadyResponList(q.split("|")[0])) return reply(`List respon dengan key *${q.split("|")[0]}* tidak ada di group ini.`)
        if (isImage || isQuotedImage) {
          let media = await downloadAndSaveMediaMessage('image', `./options/sticker/${sender}.jpg`)
          let tph = await TelegraPh(media)
          updateResponList(q.split("|")[0], q.split("|")[1], true, tph)
          reply(`Berhasil mengganti list menu *${q.split("|")[0]}*`)
          fs.unlinkSync(media)
        } else {
          updateResponList(q.split("|")[0], q.split("|")[1], false, '-')
          reply(`Berhasil mengganti list respon *${q.split("|")[0]}*`)
        }
      }
        break

      case 'settesti': {
        if (!isOwner) return reply(mess.owner)
        if (!q.includes("|")) return reply(`Gunakan dengan cara ${prefix + command} *key|response*\n\n_Contoh_\n\n${prefix + command} tes|apa`)
        if (!isAlreadyResponTesti(q.split("|")[0])) return reply(`List testi dengan key *${q.split("|")[0]}* tidak ada di database.`)
        if (isImage || isQuotedImage) {
          let media = await downloadAndSaveMediaMessage('image', `./options/sticker/${sender}.jpg`)
          let tph = await TelegraPh(media)
          updateResponTesti(q.split("|")[0], q.split("|")[1], true, tph)
          reply(`Berhasil mengganti list testi *${q.split("|")[0]}*`)
          fs.unlinkSync(media)
        } else {
          reply(`Kirim gambar dengan caption ${prefix + command} *key|response* atau reply gambar yang sudah ada dengan caption ${prefix + command} *key|response*`)
        }
      }
        break

      case 'open':
        if (!isGroup) return reply(mess.group)
        if (!isGroupAdmins && !isOwner) return reply(mess.admin)
        if (!isBotGroupAdmins) return reply(mess.botAdmin)
        await ronzz.groupSettingUpdate(from, 'not_announcement')
        await reply(`Sukses mengizinkan semua peserta dapat mengirim pesan ke grup ini.`)
        break

      case 'close':
        if (!isGroup) return reply(mess.group)
        if (!isGroupAdmins && !isOwner) return reply(mess.admin)
        if (!isBotGroupAdmins) return reply(mess.botAdmin)
        await ronzz.groupSettingUpdate(from, 'announcement')
        await reply(`Sukses mengizinkan hanya admin yang dapat mengirim pesan ke grup ini.`)
        break

      case 'tagall':
        if (!isGroup) return reply(mess.group)
        if (!isGroupAdmins && !isOwner) return reply(mess.admin)
        let teks = `══✪〘 *👥 TAG ALL* 〙✪══\n\n${q ? q : 'Tidak ada pesan'}\n`
        for (let mem of participants) {
          teks += `➲ @${mem.id.split('@')[0]}\n`
        }
        ronzz.sendMessage(from, { text: teks, mentions: participants.map(a => a.id) })
        break

      case 'hidetag': case 'ht': case 'h': {
        if (!isGroup) return reply(mess.group)
        if (!isGroupAdmins && !isOwner) return reply(mess.admin)
        let mem = groupMembers.map(i => i.id)
        if (isImage || isQuotedImage) {
          let media = await downloadAndSaveMediaMessage('image', `./options/sticker/${sender}.jpg`)
          await ronzz.sendMessage(from, { image: fs.readFileSync(media), caption: q ? q : '', mentions: mem })
          fs.unlinkSync(media)
        } else {
          ronzz.sendMessage(from, { text: q ? q : '', mentions: mem })
        }
      }
        break

      case 'setdesc':
        if (!isGroup) return reply(mess.group)
        if (!isGroupAdmins && !isOwner) return reply(mess.admin)
        if (!isBotGroupAdmins) return reply(mess.botAdmin)
        if (!q) return reply(`Contoh: ${prefix + command} New Description by ${ownerName}`)
        await ronzz.groupUpdateDescription(from, q)
          .then(res => {
            reply(`Sukses set deskripsi group.`)
          }).catch(() => reply(mess.error.api))
        break

      case 'setppgrup': case 'setppgc':
        if (!isGroup) return reply(mess.group)
        if (!isGroupAdmins && !isOwner) return reply(mess.admin)
        if (!isBotGroupAdmins) return reply(mess.botAdmin)
        if (isImage || isQuotedImage) {
          var media = await downloadAndSaveMediaMessage('image', `ppgc${from}.jpeg`)
          try {
            let { img } = await pepe(media)
            await ronzz.query({ tag: 'iq', attrs: { to: from, type: 'set', xmlns: 'w:profile:picture' }, content: [{ tag: 'picture', attrs: { type: 'image' }, content: img }] })
            fs.unlinkSync(media)
            reply(`Sukses set pp group.`)
          } catch {
            var data = await ronzz.updateProfilePicture(from, { url: media })
            fs.unlinkSync(media)
            reply(`Sukses set pp group.`)
          }
        } else {
          reply(`Kirim/balas gambar dengan caption ${prefix + command} untuk mengubah foto profil grup`)
        }
        break

      case 'verify': {
        if (db.data.users[sender] !== undefined) return reply("Kamu sudah terdaftar di database bot.")
        if (!q) return
        if (q.toLowerCase() !== "android" && q.toLowerCase() !== "iphone" && q.toLowerCase() !== "windows") return
        let teks = `*✅「 DAFTAR SUKSES 」✅*
        
*» Nomor:* ${sender.split("@")[0]}
*» Nama:* ${pushname}
*» Saldo:* Rp0
*» Device:* ${q.slice(0, 1).toUpperCase() + q.slice(1)}
*» Role:* ${isOwner ? "Gold" : "Bronze"}`
        db.data.users[sender] = {
          saldo: 0,
          role: isOwner ? "gold" : "bronze",
          device: q.toLowerCase()
        }
        await Reply(teks)
      }
        break

      case 'setdevice': {
        if (db.data.users[sender] == undefined) return sendDaftar()
        if (isGroup && db.data.users[sender].device !== "android") return reply(`Bot hanya bisa diakses di private chat karena kamu menggunakan device ${db.data.users[sender].device.slice(0, 1).toUpperCase() + db.data.users[sender].device.slice(1)}`)
        if (!q) return reply(`Contoh: ${prefix + command} android\n\n*Device tersedia:*\n1. Android\n2. iPhone\n3. Windows`)
        if (q.toLowerCase() !== "android" && q.toLowerCase() !== "iphone" && q.toLowerCase() !== "windows") return reply(`Contoh: ${prefix + command} android\n\n*Device tersedia:*\n1. Android\n2. iPhone\n3. Windows`)
        db.data.users[sender].device = q.toLowerCase()
        await reply(`Sukses set device menjadi ${q.slice(0, 1).toUpperCase() + q.slice(1)}`)
      }
        break

      case 'backup': {
        if (!isOwner) return reply(mess.owner)
        await reply('Mengumpulkan semua file ke folder...')
        let ls = (await execSync("ls")).toString().split("\n").filter((pe) =>
          pe != "node_modules" &&
          pe != "session" &&
          pe != "package-lock.json" &&
          pe != "yarn.lock" &&
          pe != ".npm" &&
          pe != ".cache" &&
          pe != ""
        )
        if (isGroup) reply('Script akan dikirim lewat PC!')
        await execSync(`zip -r SC-BACKUP.zip ${ls.join(" ")}`)
        await ronzz.sendMessage(sender, {
          document: await fs.readFileSync("./SC-BACKUP.zip"),
          mimetype: "application/zip",
          fileName: "SC-BACKUP.zip",
          caption: "Sukses backup Script"
        }, { quoted: m })
        await execSync("rm -rf SC-BACKUP.zip");
      }
        break

      default:
        if (budy.startsWith('=>')) {
          if (!isOwner) return
          function Return(sul) {
            sat = JSON.stringify(sul, null, 2)
            bang = util.format(sat)
            if (sat == undefined) {
              bang = util.format(sul)
            }
            return reply(bang)
          }
          try {
            reply(util.format(eval(`(async () => { ${budy.slice(3)} })()`)))
          } catch (e) {
            reply(String(e))
          }
        }
        if (budy.startsWith('>')) {
          if (!isOwner) return
          try {
            let evaled = await eval(budy.slice(2))
            if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
            await reply(evaled)
          } catch (err) {
            reply(String(err))
          }
        }
        if (budy.startsWith('$')) {
          if (!isOwner) return
          let qur = budy.slice(2)
          exec(qur, (err, stdout) => {
            if (err) return reply(err)
            if (stdout) {
              reply(stdout)
            }
          })
        }
    }
  } catch (err) {
    console.log(color('[ERROR]', 'red'), err)
  }
}