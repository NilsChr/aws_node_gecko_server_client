export default {
  SERVER_URL: null,
  channel: null,
  myId: null,
  clientPlayer: null,
  clientPlayerGameObject: null,
  gameobjects: [],
  currentZone: 1,
  zones: [],

  removeGameObject: function(id) {
    console.log("DELETING", id)

    console.log(this.gameobjects.length)
    for(let i = this.gameobjects.length-1; i>=0; i--) {
      if(this.gameobjects[i].id == id) {
        console.log("deleted", id)

        this.gameobjects.splice(i,1);
        break;
      }
    }
    console.log(this.gameobjects.length)

  }
};
