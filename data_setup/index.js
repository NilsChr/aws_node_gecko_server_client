import DB from "../server/db/dbConnection.js";
import db_zones from "./db_zones.js";

console.log("Filling world");

var stringToColour = function (str) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  var colour = "#";
  for (var i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 0xff;
    colour += ("00" + value.toString(16)).substr(-2);
  }
  return colour;
};

let input = db_zones.split("\n");
console.log(input.length);
let modes = {
  STARTED: 1,
  BUILD_POS: 2,
  MAP_POS: 3,
  UPLOAD: 4,
};
let mode = modes.STARTED;

let map_positions = [];
let px = 0;
let py = 0;
let dim = 200; //400;

let i = 0;
do {
  //console.log(i, input[i], mode);
  if (input[i] == "layout") {
    mode = modes.BUILD_POS;
    console.log("Bulding pos");
    continue;
  }
  if (input[i] == "data") {
    mode = modes.MAP_POS;
    console.log("Mapping title");

    continue;
  }
  switch (mode) {
    case modes.BUILD_POS:
      buildPos(input[i]);
      break;
    case modes.MAP_POS:
      mapTitle(input[i]);
      break;
  }
  //console.log(input[i]);
} while (i++ < input.length - 1);

function buildPos(row) {
  for (let i = 0; i < row.length; i++) {
    let c = row.charAt(i);
    let z = {
      id: c,
      title: "",
      color: "",
      x: px * dim,
      y: py * dim,
      dim: dim,
    };
    map_positions.push(z);
    px++;
  }
  py++;
  px = 0;
}

function mapTitle(row) {
  let r = row.split(" ");
  let m = map_positions.filter((z) => z.id == r[0])[0];
  if (!m) return;
  m.title = r[1];
  m.color = stringToColour(m.title);
}

let complete = 0;
map_positions.forEach((m) => {
  DB.zones.uploadZone(m);

  if (complete++ == map_positions.length) {
    console.log("Done");
  }
});
