import geckos from "@geckos.io/server";
import { iceServers } from "@geckos.io/server";
import { SnapshotInterpolation } from "@geckos.io/snapshot-interpolation";
import GAME_UNIT_TYPES from "../../common/gameUnitTypes.js";
import ServerEnemy from "./serverEnemy.js";
import ServerPlayer from "./serverPlayer.js";
import registerEvents from "./transportEvents/index.js";
import MathHelpers from "../../common/MathHelpers.js";
import GAME_CONSTANS from "../../common/gameConstants.js";
import EVENTS_UDP from "../../common/eventsUDP.js";
import DB from "../db/dbConnection.js";
import FACTORY_GAMEOBJECT, {
  GAME_UNIT_CATEGORES,
} from "./factories/gameobject.factory.js";

export class Game {
  running = false;
  loop = null;
  loopSlow = null;
  gameobjects = [];
  players = [];
  channels = [];
  SIVaults = [];
  objFactory = null;

  constructor(server) {
    this.io = server;
    this.init(server);
    this.objFactory = new FACTORY_GAMEOBJECT(this);

    for (let i = 0; i < 5; i++) {
      let obj = this.objFactory.createObject(
        GAME_UNIT_CATEGORES.ENEMY,
        GAME_UNIT_TYPES.SKELETON_1,
        100 + i * 15,
        80 + i * 13
      );
      this.addGameObject(obj);
    }

    let boss = this.objFactory.createObject(
      GAME_UNIT_CATEGORES.ENEMY,
      GAME_UNIT_TYPES.BOSS,
      240,
      300
    );
    this.addGameObject(boss);

    
    /*
    let angel = this.objFactory.createObject(
      GAME_UNIT_CATEGORES.STATIC,
      GAME_UNIT_TYPES.GRAVEYARD_ANGEL,
      250,
      20
    );
    angel.animationState = 1;
    this.addGameObject(angel);
    */
  }

  destroy() {
    clearInterval(this.loop);
    clearInterval(this.loopSlow);
    this.loop = null;
    this.loopSlow = null;
    this.players = [];
    this.gameobjects = [];
    this.channels = [];
    this.SIVaults = [];
    this.running = false;
    this.io = null;
    console.log("Stopped", this);
  }

  init(server) {
    this.io = geckos({
      iceServers: process.env.NODE_ENV === "production" ? iceServers : [],
    });
    this.io.addServer(server);

    this.io.onConnection((channel) => {
      this.channels.push(channel);

      let newPlayer = this.objFactory.createObject(
        GAME_UNIT_CATEGORES.PLAYER,
        GAME_UNIT_TYPES.PLAYER,
        220,
        20
      );
      //console.log(newPlayer);
      newPlayer.id = channel.id;
      newPlayer.channel = channel;

      this.gameobjects.push(newPlayer);
      this.players[channel.id] = newPlayer;
      this.SIVaults[channel.id] = new SnapshotInterpolation(25);

      let withinRange = this.getGameObjectsWithinRange(
        newPlayer,
        GAME_CONSTANS.PLAYER_INCLUDE_ENEMIES_DISTANCE
      ).map((p) => p.parseForTransfer());

      channel.room.emit(EVENTS_UDP.fromServer.playerJoined, withinRange, {
        reliable: true,
      });

      registerEvents(channel, this);

      channel.onDisconnect(() => {
        console.log("Disconnect user " + channel.id);
        this.gameobjects.filter(o => o.target && o.target.id == channel.id).forEach(o => o.target = null);
        channel.room.emit(
          EVENTS_UDP.fromServer.removePlayer,
          { id: channel.id },
          { reliable: true }
        );
        this.removeGameObject(channel.id);

        this.channels.splice(this.channels.indexOf(channel.id), 1);
        delete this.SIVaults[channel.id];

        //this.SIVaults.splice(this.SIVaults.indexOf(channel.id), 1);
        //console.log(this.gameobjects.length);
        //console.log(this.channels);
        //console.log(this.SIVaults);
      });

      channel.emit(EVENTS_UDP.fromServer.ready);
    });
  }

  start() {

    DB.cache.zones.forEach(z => {
      console.log(z);
      if(z.graveyard.x !== -1) {
        let angel = this.objFactory.createObject(
          GAME_UNIT_CATEGORES.STATIC,
          GAME_UNIT_TYPES.GRAVEYARD_ANGEL,
          z.graveyard.x,
          z.graveyard.y
        );
        angel.animationState = 1;
        this.addGameObject(angel);
      }

    })


    this.running = true;
    if (this.loop != null || this.loopSlow != null) return;
    this.loop = setInterval(
      function () {
        this.update();
      }.bind(this),
      1000 / GAME_CONSTANS.SERVER_FPS
    );

    this.loopSlow = setInterval(
      function () {
        this.slowUpdate();
      }.bind(this),
      GAME_CONSTANS.SERVER_SLOW_FPS
    );
  }

  update() {
    // Run GameObject Logic
    this.gameobjects.forEach((o) => {
      o.tick(this.gameobjects);
    });
    //this.gameobjects = this.gameobjects.filter((go) => !go.dead);

    for (let i = this.channels.length; i >= 0; i--) {
      let channel = this.channels[i];
      if (!channel) continue;
      let player = this.players[channel.id];

      // Get all other game objects with range and create a snapshot
      // This way clients will not get every object in the world
      let gameObjectsWithinRange = this.gameobjects.filter(
        (p) =>
          !p.dead &&
          MathHelpers.getDistance(
            player.pos.x,
            player.pos.y,
            p.pos.x,
            p.pos.y
          ) < GAME_CONSTANS.PLAYER_INCLUDE_ENEMIES_DISTANCE
      );
      const vault = this.SIVaults[channel.id];
      if (!vault) continue;
      const snapshot = vault.snapshot.create(
        gameObjectsWithinRange.map((p) => p.parseForTransfer())
      );
      this.SIVaults[channel.id].vault.add(snapshot);
      channel.emit(EVENTS_UDP.fromServer.update, snapshot);
    }
  }

  slowUpdate() {
    this.gameobjects
      .filter((o) => o.type === GAME_UNIT_TYPES.PLAYER)
      .forEach((player) => {
        for (let i = 0; i < DB.cache.zones.length; i++) {
          let zone = DB.cache.zones[i];
          let inZone = zone.inWorld(player);
          //console.log(`${player.id}: (x:${player.pos.x} y:${player.pos.y}) in zone ${zone.id} = ${inZone}`);
          if (inZone && zone.id !== player.currentZone) {
            player.setZone(zone);
            break;
          }
        }
      });
  }

  addGameObject(obj) {
    this.gameobjects.push(obj);
  }

  removeGameObject(id) {
    this.gameobjects.splice(
      this.gameobjects.findIndex((p) => p.id == id),
      1
    );
  }

  getGameObjectsWithinRange(player, range) {
    return this.gameobjects.filter(
      (p) =>
        MathHelpers.getDistance(player.pos.x, player.pos.y, p.pos.x, p.pos.y) <
        range
    );
  }

  getPlayersWithinRange(player, range) {
    return this.gameobjects.filter(
      (p) =>
        p.type === GAME_UNIT_TYPES.PLAYER &&
        MathHelpers.getDistance(player.pos.x, player.pos.y, p.pos.x, p.pos.y) <
          range
    );
  }

  logState() {
    let s = [];
    console.log("LOGGING");
    this.gameobjects.forEach((g) => {
      //      console.log("HEY", g);
      let o = { ...g }; //JSON.parse(JSON.stringify(g));
      delete o.game;
      delete o.channel;
      s.push(o);
    });
    console.log(s);
  }
}
