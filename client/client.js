import p5 from "p5";
import geckos from "@geckos.io/client";
import gameState from "./gameState.js";

import { SnapshotInterpolation } from "@geckos.io/snapshot-interpolation";
import UNIT_FACTORY from "./factories/unitFactory.js";
import INPUT from "./input.js";
import ASSET_MANAGER from "./managers/assetManager.js";
import GAME_OBJECT_RENDERER from "./systems/gameObjectRenderer.js";
import GAME_UNIT_TYPES from "./factories/gameUnitTypes.js";
const SI = new SnapshotInterpolation(30);

let sketch = function (p) {
  let x = 100;
  let y = 100;

  let img = null;

  p.preload = function () {
    img = p.loadImage("assets/rpg_units.png");
    ASSET_MANAGER.loadAsset(p, "units", "./assets/rpg_units3.png");
  };

  p.setup = function () {
    p.createCanvas(700, 410);
    p.noSmooth();

    let channel = geckos({ port: 3000 });
    gameState.channel = channel;

    channel.onConnect((error) => {
      gameState.myId = channel.id;

      if (error) console.error(error.message);
      channel.on("update", (snapshot) => {
        console.log(snapshot.state.length);
        SI.snapshot.add(snapshot);
      });
      channel.on("ready", () => {
        console.log("Channel ready");
      });

      channel.on("playerJoined", (data) => {
        console.log("player joined!", data);
        //let players = data.filter(o => o.type == GAME_UNIT_TYPES.PLAYER);
        data.forEach((newObj) => {
          console.log(newObj);
          //let obj = gameState.gameobjects.find((g) => g.id === newObj.id);
          let obj = gameState.gameobjects.filter((g) => g != null && g.id === newObj.id)[0];
          if (!obj) {
            // UNIT_FACTORY.spawnUnit(newObj);
            UNIT_FACTORY.spawnUnit(newObj);
          }
        });
      });
    });
  };

  let frameCount = 0;
  p.draw = function () {
    frameCount++;
    p.background(0);

    p.fill(255);
    p.rect(x, y, 50, 50);

    //p.image(img, 40, 40);
    //p.image(ASSET_MANAGER.getAsset('units'), 40, 40);

    if (gameState.myId == null) return;

    SI.snapshot.create(gameState.gameobjects);

    const snapshot = SI.calcInterpolation("x y"); // [deep: string] as optional second parameter
    if (!snapshot) return;

    // access your state
    const { state } = snapshot;
    // apply the interpolated values to you game objects
    for (let i = 0; i < state.length; i++) {
      const { id, x, y } = state[i];
      let obj = gameState.gameobjects.find((p) => p.id === id);
      if (!obj) return;
      if (obj.id === gameState.myId) {
        //player.checkInput();
        //player.sx = x;
        //player.sy = y;
        gameState.clientPlayer.checkInput();
       // if(frameCount % 10 == 0) {
          obj.x = x;
          obj.y = y;
        //}
      } else {
        obj.x = x;
        obj.y = y;
      }
      //obj.update();
      GAME_OBJECT_RENDERER.renderObject(p, obj);
    }
  };

  p.keyPressed = function (e) {
    if (e.key === "p") {
      console.log(gameState);
    }
    if (e.key === INPUT.controls.MOVE_LEFT) INPUT.input.MOVE_LEFT = true;
    if (e.key === INPUT.controls.MOVE_RIGHT) INPUT.input.MOVE_RIGHT = true;
    if (e.key === INPUT.controls.MOVE_UP) INPUT.input.MOVE_UP = true;
    if (e.key === INPUT.controls.MOVE_DOWN) INPUT.input.MOVE_DOWN = true;
  };

  p.keyReleased = function (e) {
    if (e.key === INPUT.controls.MOVE_LEFT) INPUT.input.MOVE_LEFT = false;
    if (e.key === INPUT.controls.MOVE_RIGHT) INPUT.input.MOVE_RIGHT = false;
    if (e.key === INPUT.controls.MOVE_UP) INPUT.input.MOVE_UP = false;
    if (e.key === INPUT.controls.MOVE_DOWN) INPUT.input.MOVE_DOWN = false;
  };
};

let myp5 = new p5(sketch);
console.log(myp5);
