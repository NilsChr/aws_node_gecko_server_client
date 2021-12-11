import p5 from "p5";
import geckos from "@geckos.io/client";
import gameState from "./gameState.js";
import { SnapshotInterpolation } from "@geckos.io/snapshot-interpolation";
import UNIT_FACTORY from "./factories/unitFactory.js";
import INPUT from "./input.js";
import ASSET_MANAGER, {
  ASSET_KEYS,
} from "./managers/assetsManager/assetManager.js";
import GAME_OBJECT_RENDERER from "./systems/gameObjectRenderer.js";
import MATH_HELPERS from "../common/MathHelpers.js";
import GAME_CONSTANS from "../common/gameConstants.js";
import EVENTS_UDP from "../common/eventsUDP.js";
import { GO_ANIMATION_STATES } from "../common/gameObject.js";
import axios from "axios";
import registerClientEvents from "./transportEvents/index.js";
import ACTION_BAR from "./GUI/actionbar/actionbar.js";
const SI = new SnapshotInterpolation(GAME_CONSTANS.SERVER_FPS);

let url_prod = "http://70.34.203.138:3000";
let url_test = "http://localhost:3000";
let url = process.env.NODE_ENV === 'development' ? url_test : url_prod;

console.log(`Connecting to ${url}`);

axios.get(url + "/getZones").then((d) => {
  console.log(d.data);
  gameState.zones = d.data;
});

let sketch = function (p) {
  const cameraScale = 4;

  p.preload = function () {
    ASSET_MANAGER.loadAsset(p, ASSET_KEYS.UNITS, "./assets/rpg_units4.png");
    ASSET_MANAGER.loadAsset(p, ASSET_KEYS.GRAVEYARD, "./assets/graveyard.png");
  };

  p.setup = function () {
    let can = p.createCanvas(window.innerWidth, window.innerHeight);
    can.parent("game");
    p.drawingContext.blur = 10;
    p.noSmooth();

    let channel = geckos({ port: 3000 });
    gameState.channel = channel;

    registerClientEvents(channel);

    channel.onConnect((error) => {
      gameState.myId = channel.id;
      if (error) console.error(error.message);

      channel.on(EVENTS_UDP.fromServer.update, (snapshot) => {
        SI.snapshot.add(snapshot);

        snapshot.state.forEach((s) => {
          let unit = gameState.gameobjects.filter((g) => g.id == s.id)[0];
          if (!unit) {
            UNIT_FACTORY.spawnUnit(s);
          }
        });
      });

      channel.on(EVENTS_UDP.fromServer.ready, () => {
        console.log("Channel ready");
      });

      channel.on(EVENTS_UDP.fromServer.playerJoined, (data) => {
        //console.log("player joined!", data);
        let go = gameState.gameobjects;
        data.forEach((newObj) => {
          let obj = go.filter((g) => g != null && g.id === newObj.id)[0];
          if (!obj) {
            UNIT_FACTORY.spawnUnit(newObj);
          }
        });
      });

      channel.on(EVENTS_UDP.fromServer.removePlayer, (data) => {
        console.log("Remove player", data);
        gameState.removeGameObject(data.id);
      });

      channel.on(EVENTS_UDP.fromServer.unitUseSkill, (data) => {
        //console.log("UNIT USED skill, ", data);
        if (data.attackerId == gameState.myId) {
          ACTION_BAR.triggerCooldown(data);
        }
        let unit = gameState.gameobjects.find((o) => o.id == data.attackerId);
        unit.setAnimationState(1);
        setTimeout(() => {
          unit.setAnimationState(GO_ANIMATION_STATES.IDLE);
        }, 230);
      });
    });
  };

  let frameCount = 0;
  p.draw = function () {
    p.imageMode(p.CENTER);
    frameCount++;
    p.background(0);

    if (gameState.zones.length == 0) return;

    if (gameState.myId == null) return;

    let player = gameState.clientPlayerGameObject;
    if (!player) return;

    SI.snapshot.create(gameState.gameobjects);

    const snapshot = SI.calcInterpolation("x y");
    //    console.log("snapshot", snapshot != null);

    if (!snapshot) {
      return;
    }
    // if (!snapshot) return;

    //let { state } = snapshot;
    let state = [];
    if (snapshot) state = snapshot.state;

    p.push();
    p.translate(
      -(player.x * cameraScale) + p.width / 2,
      -(player.y * cameraScale) + p.height / 2
    );
    p.scale(cameraScale, cameraScale);

    gameState.zones.forEach((z) => {
      if (z.dim) {
        p.fill(z.color);
        p.text(z.title, z.pos.x, z.pos.y);
        p.rect(z.pos.x, z.pos.y, z.dim.x, z.dim.y);
      }
    });

    //gameState.gameobjects = gameState.gameobjects.sort((a,b) => a.y - b.y);
    state = state.sort((a, b) => a.y - b.y);

    for (let i = 0; i < state.length; i++) {
      const { id, x, y, animationState, isGhost } = state[i];
      let obj = gameState.gameobjects.find((p) => p.id === id);
      if (!obj) {
        //console.log('no obj', id)
        continue;
      }
      if (obj.id === gameState.myId) {
        gameState.clientPlayer.checkInput();
      } else {
        let dist = MATH_HELPERS.getDistance(player.x, player.y, obj.x, obj.y);
        if (dist > GAME_CONSTANS.PLAYER_DESTROY_NOT_SEEN_ENEMIES_DISTANCE) {
          gameState.gameobjects.splice(gameState.gameobjects.indexOf(obj), 1);
        }
      }
      //obj.setAnimationState(animationState);
      obj.x = x;
      obj.y = y;
      obj.isGhost = isGhost;

      GAME_OBJECT_RENDERER.renderObject(p, obj);
      obj.update();
    }
    p.pop();

    if (gameState.clientPlayerGameObject.isGhost) {
      //p.filter(p.GRAY);
      p.fill(0, 0, 0, 150);
      p.rect(0, 0, p.width, p.height);
    }
  };

  p.keyPressed = function (e) {
    if (e.key === "p") {
      console.log(gameState);
      console.log();
    }
    if (e.key === "+") {
      axios.get(url + "/getState").then((d) => {
        console.log(d);
      });
    }
    if (e.key === "?") {
      axios.get(url + "/restart").then((d) => {
        console.log(d);
        location.reload();
      });
    }
    if (e.key === INPUT.controls.MOVE_LEFT) INPUT.input.MOVE_LEFT = true;
    if (e.key === INPUT.controls.MOVE_RIGHT) INPUT.input.MOVE_RIGHT = true;
    if (e.key === INPUT.controls.MOVE_UP) INPUT.input.MOVE_UP = true;
    if (e.key === INPUT.controls.MOVE_DOWN) INPUT.input.MOVE_DOWN = true;

    if (e.key === INPUT.controls.SKILL_1)
      gameState.clientPlayer.useSkill(INPUT.input.SKILL_1);
  };

  p.keyReleased = function (e) {
    if (e.key === INPUT.controls.MOVE_LEFT) INPUT.input.MOVE_LEFT = false;
    if (e.key === INPUT.controls.MOVE_RIGHT) INPUT.input.MOVE_RIGHT = false;
    if (e.key === INPUT.controls.MOVE_UP) INPUT.input.MOVE_UP = false;
    if (e.key === INPUT.controls.MOVE_DOWN) INPUT.input.MOVE_DOWN = false;
  };

  p.mousePressed = function () {
    console.log("clicked");
    let mouse = {
      player: {
        x: gameState.clientPlayerGameObject.x,
        y: gameState.clientPlayerGameObject.y,
      },
      screenPos: {
        x: p.mouseX,
        y: p.mouseY,
      },
      screenToWorldPos: {
        x:
          gameState.clientPlayerGameObject.x +
          (p.mouseX - p.width / 2) / cameraScale,
        y:
          gameState.clientPlayerGameObject.y +
          (p.mouseY - p.height / 2) / cameraScale,
      },
    };
    console.log(mouse);
  };
};

let myp5 = new p5(sketch);
console.log(myp5);
