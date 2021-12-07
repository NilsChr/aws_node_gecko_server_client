import geckos from "@geckos.io/server";
import { iceServers } from "@geckos.io/server";

import { SnapshotInterpolation, Vault } from "@geckos.io/snapshot-interpolation";
import GAME_UNIT_TYPES from "../../client/factories/gameUnitTypes.js";
import ServerEnemy from "./serverEnemy.js";
import ServerPlayer from "./serverPlayer.js";
import registerEvents from "./transportEvents/index.js";
//import MathHelpers from "./util/MathHelpers.js";
import MathHelpers from "../../common/MathHelpers.js";

const SI = new SnapshotInterpolation();

export class Game {
  running = false;
  loop = null;
  gameobjects = [];
  players = [];
  channels = [];
  SIVaults = [];

  constructor(server) {
    this.io = server;
    this.init(server);

    
    for(let i = 0; i < 5; i++) {
        let testSkeleton = new ServerEnemy(i, 100 + (i*15),80+(i*13), GAME_UNIT_TYPES.SKELETON_1);
        this.gameobjects.push(testSkeleton);
    }
    /*
    let testSkeleton = new ServerEnemy(1, 100, 80, GAME_UNIT_TYPES.SKELETON_1);
    this.gameobjects.push(testSkeleton);

    let testSkeleton2 = new ServerEnemy(5, 140, 80, GAME_UNIT_TYPES.SKELETON_1);
    this.gameobjects.push(testSkeleton2);
    */
  }

  init(server) {
    this.io = geckos({
      iceServers: process.env.NODE_ENV === "production" ? iceServers : [],
    });
    this.io.addServer(server);

    this.io.onConnection((channel) => {
      this.channels.push(channel);
      let newPlayer = new ServerPlayer(
        channel.id,
        20,
        20,
        GAME_UNIT_TYPES.PLAYER
      );

      this.gameobjects.push(newPlayer);
      this.players[channel.id] = newPlayer;
      this.SIVaults[channel.id] = new SnapshotInterpolation();

      channel.room.emit("playerJoined", this.gameobjects);

      registerEvents(channel, this);

      channel.onDisconnect(() => {
        console.log("Disconnect user " + channel.id);
        this.removeGameObject(channel.id);
        channel.room.emit("removePlayer", channel.playerId);
        this.channels.splice(this.channels.indexOf(channel.id), 1);
        this.SIVaults.splice(this.SIVaults.indexOf(channel.id), 1);
        console.log(this.gameobjects.length);
        console.log(this.channels);
        console.log(this.SIVaults);

      });

      channel.emit("ready");
    });
  }

  start() {
    this.running = true;
    this.loop = setInterval(
      function () {
        this.update();
      }.bind(this),
      1000 / 24
    );
  }

  removeGameObject(id) {
    this.gameobjects.splice(this.gameobjects.findIndex(p => p.id == id), 1);
  }

  update() {

    // Run Enemies Logic
    /*this.gameobjects.filter(g => g.type !== GAME_UNIT_TYPES.PLAYER).forEach(o => {
        o.update(this.gameobjects);
    })*/
    this.gameobjects.forEach(o => {
      o.update(this.gameobjects);
    })

    // Only send state of things within rang
    //let updatedGameObjects = this.gameobjects.filter(p => p.hasChanged());
    
    for(let i = this.channels.length; i >= 0; i--) {
      let channel = this.channels[i];
      if(!channel) continue;
      let player = this.players[channel.id];
      let gameObjectsWithinRange = this.gameobjects.filter(p => MathHelpers.getDistance(player.x, player.y, p.x, p.y) < 150);
      const snapshot = this.SIVaults[channel.id].snapshot.create(gameObjectsWithinRange.map(p => p.parseForTransfer()));
      //SI.vault.add(snapshot);
      this.SIVaults[channel.id].vault.add(snapshot);
      //this.io.emit("update", snapshot);
      channel.emit("update", snapshot);
    }

    /* Send whole state to all user

    const snapshot = SI.snapshot.create(this.gameobjects.map(p => p.parseForTransfer()));
    //const snapshot = SI.snapshot.create(this.gameobjects);

    // add the snapshot to the vault in case you want to access it later (optional)
    SI.vault.add(snapshot);

    // send the snapshot to the client (using geckos.io or any other library)
    this.io.emit("update", snapshot);

    */
  }
}
