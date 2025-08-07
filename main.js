require("./setting.js")
const { default: makeWASocket, useMultiFileAuthState, makeInMemoryStore, jidDecode, delay } = require("@whiskeysockets/baileys");
const chalk = require('chalk');
const readline = require('readline');
const pino = require('pino');
const fs = require("fs");
const figlet = require("figlet");
const PhoneNumber = require('awesome-phonenumber');
const moment = require('moment');
const time = moment(new Date()).format('HH:mm:ss DD/MM/YYYY');
const { execSync } = require("child_process");
const cron = require("node-cron");
const mongoose = require("mongoose");
const _ = require('lodash');

const axios = require('axios');

setInterval(async () => {
  await axios.get("https://arfystore.shop/system/cron/deposit.php")
  await axios.get("https://arfystore.shop/system/cron/status.php")
  await axios.get("https://arfystore.shop/system/cron/order-qris.php")
}, 30 * 1000);

const { smsg, getBuffer } = require("./function/myfunc.js");
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./function/uploader.js');
const { color } = require('./function/console.js');
const { nocache } = require('./function/chache.js');
const { groupResponseWelcome, groupResponseRemove, groupResponsePromote, groupResponseDemote } = require('./function/respon-group.js');
const { getProvider } = require('./function/database.js');
const toJSON = j => JSON.stringify(j, null, '\t')

const question = (text) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  return new Promise((resolve) => {
    rl.question(text, resolve)
  })
}

//Database mongodb
var low
try {
  low = require('lowdb')
} catch (e) {
  low = require('./function/lowdb')
}
const { Low, JSONFile } = low
const mongoDB = require('./function/mongodb')

if (mongoURL !== "") {
  db = new Low(new mongoDB(mongoURL))
  const mongo = mongoose.connection;
  mongo.on('error', console.error.bind(console, 'Connection error:'));
  mongo.once('open', async () => {
    await delay(1000)
    console.log(chalk.green('</> Success connect to MongoDb.'))
  });

  DATABASE = db // Backwards Compatibility
  loadDatabase = async function loadDatabase() {
    if (db.READ) return new Promise((resolve) => setInterval(function () { (!db.READ ? (clearInterval(this), resolve(db.data == null ? loadDatabase() : db.data)) : null) }, 1 * 1000))
    if (db.data !== null) return
    db.READ = true
    await db.read()
    db.READ = false
    db.data = {
      list: [],
      testi: [],
      chat: {},
      sewa: {},
      type: type,
      users: {},
      profit: {},
      topup: {},
      setting: {},
      deposit: {},
      persentase: {},
      customProfit: {},
      ...(db.data || {})
    }
    db.chain = _.chain(db.data)
  }
  loadDatabase()

  if (db == null) loadDatabase()

  if (db) setInterval(async () => {
    if (global.db.data) await db.write()
  }, 5 * 1000)
}

async function startronzz() {

  //Database jika tidak mengisi url mongodb
  const dbclass = await getProvider();
  const mydb = new dbclass.Local();
  global.mydb = mydb;

  if (mongoURL == "") {
    global.db = await mydb.read();
    const defaultDbData = {
      list: [],
      testi: [],
      chat: {},
      type: type,
      users: {},
      sewa: {},
      profit: {},
      topup: {},
      setting: {},
      deposit: {},
      persentase: {},
      customProfit: {}
    };

    let changed = false;
    if (!global.db.data) {
      global.db.data = {};
      changed = true;
    }

    for (const key in defaultDbData) {
      if (global.db.data[key] === undefined) {
        global.db.data[key] = defaultDbData[key];
        changed = true;
      }
    }

    if (changed) {
      await mydb.write(global.db.data);
    }

    setInterval(async () => {
      await mydb.write(global.db)
    }, 5 * 1000);
  }

  console.log(chalk.bold.green(figlet.textSync('Arfy', {
    font: 'Standard',
    horizontalLayout: 'default',
    vertivalLayout: 'default',
    whitespaceBreak: false
  })))
  delay(100)
  console.log(chalk.yellow(`${chalk.red('[ CREATOR EZY ]')}\n\n${chalk.italic.magenta(`SV Ezy\nNomor: 0895630880006\nSebut nama👆,`)}\n\n\n${chalk.red(`ADMIN MENYEDIAKAN`)}\n${chalk.white(`- SC BOT TOPUP\n- WEB TOPUP arfystore.shop\n- WEB KEBSOS arfystore.web.id`)}`))

  require('./index')
  nocache('../index', module => console.log(chalk.greenBright(`[ ${botName} ]  `) + time + chalk.cyanBright(` "./index.js" telah diupdate!`)))

  const store = makeInMemoryStore({
    logger: pino().child({
      level: 'silent',
      stream: 'store'
    })
  })

  const { state, saveCreds } = await useMultiFileAuthState('./session')

  const ronzz = makeWASocket({
    logger: pino({ level: "silent" }),
    printQRInTerminal: !pairingCode,
    auth: state,
    browser: ['Ubuntu', 'Chrome', '20.0.04']
  })

  if (pairingCode && !ronzz.authState.creds.registered) {
    const phoneNumber = await question(color('\n\nSilahkan masukkan nomor Whatsapp bot anda, awali dengan 62:\n', 'magenta'));
    const code = await ronzz.requestPairingCode(phoneNumber.trim(), "ARFYZYT1")
    console.log(color(`⚠︎ Phone number:`, "gold"), color(`${phoneNumber}`, "white"))
    console.log(color(`⚠︎ Pairing code:`, "gold"), color(`${code}`, "white"))
  }

  ronzz.ev.on("connection.update", ({ connection }) => {
    if (connection === "open") {
      console.log("CONNECTION OPEN ( +" + ronzz.user?.["id"]["split"](":")[0] + " || " + ronzz.user?.["name"] + " )")
    }
    if (connection === "close") {
      console.log("Connection closed, tolong hapus file session dan scan ulang");
      startronzz()
    }
    if (connection === "connecting") {
      if (ronzz.user) {
        console.log("CONNECTION FOR ( +" + ronzz.user?.["id"]["split"](":")[0] + " || " + ronzz.user?.["name"] + " )")
      }
    }
  })

  store.bind(ronzz.ev)

  ronzz.ev.on('messages.upsert', async chatUpdate => {
    try {
      for (let mek of chatUpdate.messages) {
        if (!mek.message) return
        mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
        const m = smsg(ronzz, mek, store)
        if (mek.key && mek.key.remoteJid === 'status@broadcast') return
        if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return
        require('./index')(ronzz, m, mek)
      }
    } catch (err) {
      console.log(err)
    }
  })

  ronzz.ev.process(async (events) => {
    if (events['presence.update']) {
      await ronzz.sendPresenceUpdate('available')
    }
    if (events['messages.upsert']) {
      const upsert = events['messages.upsert']
      for (let msg of upsert.messages) {
        if (msg.key.remoteJid === 'status@broadcast') return
      }
    }
    if (events['creds.update']) {
      await saveCreds()
    }
  })

  ronzz.ws.on('CB:call', async (json) => {
    const callerId = json.content[0].attrs['call-creator']
    if (db.data.setting[ronzz.user?.["id"]["split"](":")[0] + "@s.whatsapp.net"].anticall && json.content[0].tag == 'offer') {
      ronzz.sendMessage(callerId, { text: `Kamu telah di blok oleh bot, karena kamu menelpon bot!!\n\nJika tidak sengaja silahkan hubungi owner agar dibuka blocknya!!\nNomor owner : wa.me/${ownerNomer}` })
      setTimeout(() => {
        ronzz.updateBlockStatus(callerId, 'block')
      }, 1000)
    }
  })

  async function autoBackup() {
    let lsOptions = (await execSync("cd options/sticker && ls")).toString().split("\n").filter(pe => pe !== "Ronzz" && pe != "")
    lsOptions.map(async i => await execSync(`cd options/sticker && rm ${toJSON(i)}`))
    await delay(1000)
    let ls = (await execSync("ls")).toString().split("\n").filter((pe) =>
      pe != "node_modules" &&
      pe != "session" &&
      pe != "package-lock.json" &&
      pe != "yarn.lock" &&
      pe != ".npm" &&
      pe != ".cache" &&
      pe != ""
    )
    await execSync(`zip -r backup.zip ${ls.join(" ")}`)
    await delay(500)
    try {
      await delay(10 * 1000)
      await ronzz.sendMessage(ownerNomer + "@s.whatsapp.net", {
        "document": fs.readFileSync('./backup.zip'),
        "fileName": "SC-TOPUP-ARFY-SHOP.zip",
        "mimetype": "application/zip",
        "caption": "Sukses backup script"
      }).catch(err => console.log("Failed send backup to Whatsapp"))
      await delay(500)
      await execSync('rm backup.zip')
    } catch (err) {
      console.log(err);
    }
  }
  
  cron.schedule("0 0 * * *", async () => {
    autoBackup()
  }, {
    timezone: "Asia/Jakarta"
  })

  ronzz.ev.on('group-participants.update', async (update) => {
    if (!db.data.chat[update.id].welcome) return
    groupResponseDemote(ronzz, update)
    groupResponsePromote(ronzz, update)
    groupResponseWelcome(ronzz, update)
    groupResponseRemove(ronzz, update)
  })

  ronzz.getName = (jid, withoutContact = false) => {
    var id = ronzz.decodeJid(jid)
    withoutContact = ronzz.withoutContact || withoutContact
    let v
    if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
      v = store.contacts[id] || {}
      if (!(v.name || v.subject)) v = ronzz.groupMetadata(id) || {}
      resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
    })
    else v = id === '0@s.whatsapp.net' ? { id, name: 'WhatsApp' } : id === ronzz.decodeJid(ronzz.user.id) ? ronzz.user : (store.contacts[id] || {})
    return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
  }

  ronzz.sendContact = async (jid, contact, quoted = '', opts = {}) => {
    let list = []
    for (let i of contact) {
      list.push({
        lisplayName: ownerNomer.includes(i) ? ownerName : await ronzz.getName(i + '@s.whatsapp.net'),
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${ownerNomer.includes(i) ? ownerName : await ronzz.getName(i + '@s.whatsapp.net')}\nFN:${ownerNomer.includes(i) ? ownerName : await ronzz.getName(i + '@s.whatsapp.net')}\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
      })
    }
    list.push({
      lisplayName: "Ezy",
      vcard: "BEGIN:VCARD\nVERSION:3.0\nN:Ezy\nFN:Ezy\nitem1.TEL;waid=62895630880006\nitem1.X-ABLabel:Ponsel\nitem2.EMAIL;type=INTERNET:aryg0022@gmail.com\nitem2.X-ABLabel:Email\nitem3.URL:https://arfystore.shop\nitem3.X-ABLabel:YouTube\nitem4.ADR:;;;;;Indonesia\nitem4.X-ABLabel:Region\nEND:VCARD"
    })
    return ronzz.sendMessage(jid, { contacts: { displayName: `${list.length} Kontak`, contacts: list }, ...opts }, { quoted })
  }

  ronzz.sendImage = async (jid, path, caption = '', quoted = '', options) => {
    let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
    return await ronzz.sendMessage(jid, { image: buffer, caption: caption, ...options }, { quoted })
  }

  ronzz.decodeJid = (jid) => {
    if (!jid) return jid
    if (/:\d+@/gi.test(jid)) {
      let decode = jidDecode(jid) || {}
      return decode.user && decode.server && decode.user + '@' + decode.server || jid
    } else return jid
  }

  ronzz.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
    let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
    let buffer
    if (options && (options.packname || options.author)) {
      buffer = await writeExifImg(buff, options)
    } else {
      buffer = await imageToWebp(buff)
    }
    await ronzz.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted }).then(response => {
      fs.unlinkSync(buffer)
      return response
    })
  }

  ronzz.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
    let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
    let buffer
    if (options && (options.packname || options.author)) {
      buffer = await writeExifVid(buff, options)
    } else {
      buffer = await videoToWebp(buff)
    }
    await ronzz.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted }).then(response => {
      fs.unlinkSync(buffer)
      return response
    })
  }

  return ronzz
}

startronzz()