const fetch = require("node-fetch");
const ical = require("ical");
const path = require("path");
const fs = require("fs");
const moment = require("moment");

const dataFile = process.env.DATAFILE || path.resolve(__dirname, "./data.json");

function getFileUpdatedDate(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.mtime;
  } catch {
    return null;
  }
}

function parseEvents(text) {
  const list = new Array();
  const data = ical.parseICS(text);

  for (let k in data) {
    if (data.hasOwnProperty(k)) {
      var ev = data[k];
      if (data[k].type == "VEVENT") {
        list.push(ev);
      }
    }
  }

  return list;
}

function extractThisWeekAndNextOnly(events) {
  const weekStart = moment.utc().day(1).startOf("day");
  const weekEnd = moment
    .utc()
    .day(0 + 7 + 7)
    .endOf("day");

  return events.filter((x) => {
    const eventStart = moment.utc(x.start);
    return eventStart.isBetween(weekStart, weekEnd);
  });
}

function sort(events) {
  const origin = events || [];
  return origin.sort((a, b) => {
    return new Date(a.start).getTime() - new Date(b.start).getTime();
  });
}

async function readSchedules() {
  const content = fs.readFileSync(dataFile, { encoding: "utf8" });
  const data = JSON.parse(content);
  return data || [];
}

async function saveSchedules(schedules) {
  const content = JSON.stringify(schedules, null, 2);
  fs.writeFileSync(dataFile, content);
}

function transform(events) {
  return (events || []).map((x) => {
    return {
      id: x.uid,
      start: moment.utc(x.start),
      end: moment.utc(x.end),
      title: x.summary,
      description: x.description,
    };
  });
}

function downloadSchedule(fetchUrl) {
  return fetch(fetchUrl)
    .then((response) => response.text())
    .then(parseEvents)
    .then(extractThisWeekAndNextOnly)
    .then(sort)
    .then(transform);
}

async function updateSchedules() {
  const schedules = await readSchedules();

  for (let i = 0; i < schedules.length; i++) {
    const schedule = schedules[i];
    console.log("Downloading fresh schedule for " + schedule.id);

    const freshEvents = await downloadSchedule(schedule.fetchUrl);
    schedule.events = freshEvents;
  }

  await saveSchedules(schedules);
}

exports.updateSchedules = updateSchedules;
exports.readSchedules = readSchedules;
exports.getLastUpdated = () => getFileUpdatedDate(dataFile);
