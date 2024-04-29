// ------------------------------------------------------------------------------
// initAPI.js
// Initializes the API and status pages
// ------------------------------------------------------------------------------

const { Collection, InteractionType } = require("discord.js");
const { blue, bold, underline, yellow, red, green } = require("colorette");
const fs = require("node:fs");
const express = require("express");
const app = express();
const { startAPI } = require("../errors/watchtower");
module.exports = {
  initAPI,
};

// ------------------------------------------------------------------------------

async function initAPI(client) {
  const { apiip, apiport, statip, statport } =
    require("../util/localStorage").config;
  const req = require("express/lib/request");
  require("../modules/api/express").init(apiport);
  const stats = require("../modules/stats");
  console.log(green("✅ Stats │ Stats online!"));
  stats(client);
  const data = { apiip, apiport, statip, statport };
  await startAPI(client, data);
};

// ------------------------------------------------------------------------------
