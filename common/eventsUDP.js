const EVENTS_UDP = {
    fromServer: {
        ready: "server:ready",
        playerJoined: "server:playerJoined",
        playerDied: "server:playerDied",
        removePlayer: "server:removePlayer",
        update: "server:update",
        unitUseSkill: "server:useSkill",
        enteredNewZone: "server:enteredNewZone",

    },
    fromClient: {
        playerInput: "client:playerInput",
        playerUseSkill: "client:useSkill"
    }
}

export default EVENTS_UDP;