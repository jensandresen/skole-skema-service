const express = require("express");
const app = express();
const moment = require("moment");
const {
  readSchedules,
  updateSchedules,
  getLastUpdated,
} = require("./schedules");

const interval = (process.env.INTERVAL || 5) * 60 * 1000;
const port = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/api/schedules", async (req, res) => {
  const schedules = await readSchedules();
  res.send({
    lastUpdated: getLastUpdated(),
    schedules: schedules.map((x) => {
      return {
        id: x.id,
        events: x.events,
      };
    }),
  });
});

app.get("/api/schedules/:id", async (req, res) => {
  const id = req.params.id;
  const schedules = await readSchedules();
  const result = schedules.find((x) => x.id == id);

  if (result) {
    res.send({
      id: result.id,
      lastUpdated: getLastUpdated(),
      events: result.events,
    });
  } else {
    res.sendStatus(404);
  }
});

app.get("/api/schedules/:id/today", async (req, res) => {
  const id = req.params.id;
  const schedules = await readSchedules();
  const result = schedules.find((x) => x.id == id);

  if (result) {
    const begin = moment.utc().startOf("day");
    const end = moment.utc().endOf("day");

    const events = result.events.filter((x) => {
      const eventStart = moment.utc(x.start);
      return eventStart.isBetween(begin, end);
    });

    res.send({
      id: result.id,
      lastUpdated: getLastUpdated(),
      events: events,
    });
  } else {
    res.sendStatus(404);
  }
});

app.get("/api/schedules/:id/:date", async (req, res) => {
  const id = req.params.id;
  const schedules = await readSchedules();
  const result = schedules.find((x) => x.id == id);

  if (result) {
    const begin = moment.utc(req.params.date).startOf("day");
    const end = moment.utc(req.params.date).endOf("day");

    const events = result.events.filter((x) => {
      const eventStart = moment.utc(x.start);
      return eventStart.isBetween(begin, end);
    });

    res.send({
      id: result.id,
      lastUpdated: getLastUpdated(),
      events: events,
    });
  } else {
    res.sendStatus(404);
  }
});

updateSchedules();
setInterval(async () => await updateSchedules(), interval);

app.listen(port, () => {
  const info = require("./package.json");
  console.log(`${info.name} started and listening on port ${port}...`);
});
