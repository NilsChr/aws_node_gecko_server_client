const EVENTS_UDP = {
  fromServer: {
    restart: "server:restart",
    ready: "server:ready",
    playerJoined: "server:playerJoined",
    playerDied: "server:playerDied",
    removePlayer: "server:removePlayer",
    update: "server:update",
    unitUseSkill: "server:useSkill",
    enteredNewZone: "server:enteredNewZone",
    chatSent: "server:chatSent",
  },
  fromClient: {
    playerInput: "client:playerInput",
    playerUseSkill: "client:useSkill",
    chatSent: "client:chatSent",
  },
};

export default EVENTS_UDP;
