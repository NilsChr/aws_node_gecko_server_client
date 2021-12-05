import geckos from "@geckos.io/server";
import { iceServers } from "@geckos.io/server";

import { SnapshotInterpolation } from "@geckos.io/snapshot-interpolation";
import GAME_UNIT_TYPES from "../../client/factories/gameUnitTypes.js";
import ServerEnemy from "./serverEnemy.js";
import ServerPlayer from "./serverPlayer.js";
const SI = new SnapshotInterpolation();

export class Game {
  running = false;
  loop = null;
  gameobjects = [];

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
    let that = this;

    this.io.onConnection((channel) => {
      let newPlayer = new ServerPlayer(
        channel.id,
        20,
        20,
        GAME_UNIT_TYPES.PLAYER
      );
      this.gameobjects.push(newPlayer);
      channel.room.emit("playerJoined", this.gameobjects);

      channel.onDisconnect(() => {
        console.log("Disconnect user " + channel.id);

        channel.room.emit("removePlayer", channel.playerId);
      });

      channel.on("client:playerInput", (data) => {
        playerInput(channel.id, data);
      });

      function playerInput(id, input) {
        let player = that.gameobjects.find((p) => p.id == id);
        if (!player) return;

        if (input[0]) player.x--;
        if (input[1]) player.x++;
        if (input[2]) player.y++;
        if (input[3]) player.y--;
      }

      channel.emit("ready");
    });
  }

  start() {
    this.running = true;
    this.loop = setInterval(
      function () {
        this.update();
      }.bind(this),
      1000 / 30
    );
  }

  update() {

    this.gameobjects.filter(g => g.type !== GAME_UNIT_TYPES.PLAYER).forEach(o => {
        o.update(this.gameobjects);
    })

    const snapshot = SI.snapshot.create(this.gameobjects);

    // add the snapshot to the vault in case you want to access it later (optional)
    SI.vault.add(snapshot);

    // send the snapshot to the client (using geckos.io or any other library)
    this.io.emit("update", snapshot);
  }
}
