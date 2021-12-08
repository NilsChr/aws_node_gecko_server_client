const EVENTS_UDP = {
    fromServer: {
        ready: "server:ready",
        playerJoined: "server:playerJoined",
        removePlayer: "server:removePlayer",
        update: "server:update",
        unitUseSkill: "server:useSkill"
    },
    fromClient: {
        playerInput: "client:playerInput",
        playerUseSkill: "client:useSkill"
    }
}

export default EVENTS_UDP;