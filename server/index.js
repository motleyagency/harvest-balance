import express from "express"
import Harvest from "harvest"
import path from "path"
import { getReport, getAccount } from "./lib/calculator"

require("dotenv-extended").load()

const app = express()
const ROOT_FOLDER = path.resolve(__dirname, "..", "dist")

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
      res.status(500).json(err)
    } else {
      res.json({
        harvest_token: accessToken,
      })
    }
  })
})

app.get("/api/account", (req, res) => {
  const harvest = new Harvest({
    subdomain: process.env.HARVEST_SUBDOMAIN,
    access_token: req.get("harvest_token"),
  })
  getAccount(harvest).then((account) => {
    res.json(account)
  }).catch((err) => {
    res.status(500).json(err)
  })
})

app.get("/api/balance", (req, res) => {
  const harvest = new Harvest({
    subdomain: process.env.HARVEST_SUBDOMAIN,
    access_token: req.get("harvest_token"),
  })
  const startDate = req.query.startDate

  getReport(harvest, { startDate }).then((report) => {
    res.json(report)
  }).catch((err) => {
    res.status(500).json(err)
  })
})

// all other requests gets forwarded to react
app.use("/", express.static(ROOT_FOLDER))

app.use((req, res) => {
  res.sendFile("index.html", { root: ROOT_FOLDER })
})

app.listen(5000, () => {
  // eslint-disable-next-line no-console
  console.log("Harvest Balance app running on port 5000!")
})
