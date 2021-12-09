import dotenv from "dotenv";
dotenv.config();
import pg from "pg";
import { Zone } from "../game/world/zone.js";

console.log(process.env.DB_USER);
const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
});

const DB = {
  loadAll: async function (game) {
    let data = await this.zones.getAll();
    this.cache.zones = [];
    data.rows.forEach((z) => {
      let zone = new Zone(z.id, z.title, z.pos_x, z.pos_y, z.dim_x, z.dim_y);
      this.cache.zones.push(zone);
      this.cache.zones_map[zone.id] = zone;
    });
    game.start();
  },
  cache: {
    zones: [],
    zones_map: []
  },
  zones: {
    getAll: async function () {
      try {
        let res = await pool.query("SELECT * FROM zones ORDER BY id ASC");
        return res;
      } catch (e) {
        console.log(e);
        return [];
      }
    },
  },
};

export default DB;
