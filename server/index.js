import express from "express"
import Harvest from "harvest"
import { getReport, getAccount } from "./lib/calculator"
// import { round } from "./lib/util";

require("dotenv-extended").load()

const app = express()

app.get("/api/auth", (req, res) => {
  const harvest = new Harvest({
    subdomain: process.env.HARVEST_SUBDOMAIN,
    redirect_uri: process.env.HARVEST_REDIRECT_URI,
    identifier: process.env.HARVEST_CLIENT_ID,
    secret: process.env.HARVEST_SECRET,
  })

  res.redirect(harvest.getAccessTokenURL())
})

app.get("/api/oauth-success", (req, res) => {
  const harvest = new Harvest({
    subdomain: process.env.HARVEST_SUBDOMAIN,
    redirect_uri: process.env.HARVEST_REDIRECT_URI,
    identifier: process.env.HARVEST_CLIENT_ID,
    secret: process.env.HARVEST_SECRET,
  })

  harvest.parseAccessCode(req.query.code, (accessToken) => {
    // console.log("Grabbed the access token to save", accessToken);
    res.json({
      harvest_token: accessToken,
    })
  },
  (err) => {
    res.status(500).json(err)
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

app.listen(5000, () => {
  // eslint-disable-next-line no-console
  console.log("Example app listening on port 5000!")
})
