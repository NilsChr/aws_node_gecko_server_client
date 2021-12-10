


import express from "express";
import http from "http";
import https from "https";
import cors from "cors";
import path from "path";
import { Game } from "./game/game.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
import DB from "./db/dbConnection.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);

const game = new Game(server);
//game.start();

//DB
//let z = DB.zones.getAll();
//console.log(z);
DB.loadAll(game)


const port = 3000;

app.use(cors());

app.use("/", express.static(path.join(__dirname, "../client")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

app.get("/getState", (req, res) => {
  try {
    game.logState();
    return res.status(200).send();
    //return res.json({ objs: game.gameobject })
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


app.get("/getZones", (req, res) => {
  try {
    
    return res.status(200).send(DB.cache.zones);
    //return res.json({ objs: game.gameobject })
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

server.listen(port, () => {
  console.log("Express is listening on http://localhost:" + port);
});
