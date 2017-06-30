'use strict';
import {GeneralLee} from "./system/generalLee";

/**
 * Heartbeat is the unit that monitors if there is an active connection.
 * When no connection is present, the engine will be turned off.
 */
export class Heartbeat {
    HEARTBEAT_INTERVAL_MS: number = 150;
    last: number;

    /**
     * Constructor.
     * @param generalLee The general lee.
     */
    constructor(private generalLee: GeneralLee) {
        this.last = 0;
    }

    /**
     * Starts the heartbeat, which listens every HEARTBEAT_INTERVAL_MS to see if there is still a connection.
     * When no connection is present, the engine will be shut down.
     */
    start() {
        setInterval(() => {
            let currentTime = new Date().getTime();
            if (currentTime - this.last > (3 * this.HEARTBEAT_INTERVAL_MS)) {
                // missed 2 heartbeats
                if (this.generalLee.isRunning()) {
                    this.generalLee.shutdown();
                }
            }
        }, this.HEARTBEAT_INTERVAL_MS);
    }
}