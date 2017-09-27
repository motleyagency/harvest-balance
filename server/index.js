import express from "express"
import Harvest from "harvest"
import path from "path"
import { get as getReport } from "./lib/report"
import { get as getAccount } from "./lib/account"

require("dotenv-extended").load()

const app = express()
const ROOT_FOLDER = path.resolve(__dirname, "..", "dist")
const PORT = process.env.SERVER_PORT || 5000

const getClient = (req) => {
  const token = req.get("harvest_token")
  const harvest = new Harvest({
    subdomain: process.env.HARVEST_SUBDOMAIN,
    access_token: token,
  })
  harvest.balanceAccessToken = token
  return harvest
}

const handleError = (err, res) => {
  if (err.error === "invalid_token") {
    res.status(401).json(err)
  } else {
    res.status(500).json(err)
  }
}

app.get("/api/auth", (req, res) => {
  const harvest = new Harvest({
    subdomain: process.env.HARVEST_SUBDOMAIN,
    redirect_uri: process.env.HARVEST_REDIRECT_URI,
    identifier: process.env.HARVEST_CLIENT_ID,
    secret: process.env.HARVEST_SECRET,
  })

  res.json({
    url: harvest.getAccessTokenURL(),
  })
})

app.get("/api/oauth-success", (req, res) => {
  const harvest = new Harvest({
    subdomain: process.env.HARVEST_SUBDOMAIN,
    redirect_uri: process.env.HARVEST_REDIRECT_URI,
    identifier: process.env.HARVEST_CLIENT_ID,
    secret: process.env.HARVEST_SECRET,
  })

  harvest.parseAccessCode(req.query.code, (err, accessToken) => {
    if (err) {
      console.error(err)
      handleError(err, res)
    } else {
      res.json({
        harvest_token: accessToken,
      })
    }
  })
})

app.get("/api/account", (req, res) => {
  getAccount(getClient(req), {}).then((account) => {
    res.json(account)
  }).catch((err) => {
    console.error(err)
    handleError(err, res)
  })
})

app.get("/api/balance", (req, res) => {
  const startDate = req.query.startDate

  getReport(getClient(req), { startDate }).then((report) => {
    res.json(report)
  }).catch((err) => {
    console.error(err)
    handleError(err, res)
  })
})

// all other requests gets forwarded to react
app.use("/", express.static(ROOT_FOLDER))

app.use((req, res) => {
  res.sendFile("index.html", { root: ROOT_FOLDER })
})

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Harvest Balance app running on port ${PORT}!`)
})
