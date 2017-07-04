import {injectable} from "inversify";
import "reflect-metadata";
import * as servoblaster from "servoblaster";
export interface X {

}

/** Engine. */
@injectable()
class Engine {
    SERVOBLASTER_ID_MOTOR: number = 1; // GPIO-17
    SPEED_ZERO: number = 130;
    SPEED_STEP_SIZE: number = 1;

    MIN_SPEED_REVERSE: number = this.SPEED_ZERO - 9;
    MIN_SPEED_FORWARD: number = this.SPEED_ZERO + 8;
    MAX_SPEED_REVERSE: number = this.SPEED_ZERO - 50;
    MAX_SPEED_FORWARD: number = this.SPEED_ZERO + 90;

    currentSpeed: number;

    /** Constructor.*/
    constructor() {
        this.currentSpeed = this.SPEED_ZERO;
    }

    /** Increase the engine speed. */
    increaseSpeed() {
        this.currentSpeed = this.currentSpeed + this.SPEED_STEP_SIZE;
        if (this.currentSpeed > this.SPEED_ZERO && this.currentSpeed < this.MIN_SPEED_FORWARD) {
            this.currentSpeed = this.MIN_SPEED_FORWARD;
        } else if (this.currentSpeed > this.MIN_SPEED_REVERSE && this.currentSpeed < this.SPEED_ZERO) {
            this.currentSpeed = this.SPEED_ZERO;
        }

        if (this.currentSpeed > this.MAX_SPEED_FORWARD) {
            this.currentSpeed = this.MAX_SPEED_FORWARD;
        }

        this.setSpeed();
    }

    /** Decrease the engine speed. */
    decreaseSpeed() {
        this.currentSpeed = this.currentSpeed - this.SPEED_STEP_SIZE;

        if (this.currentSpeed < this.SPEED_ZERO && this.currentSpeed > this.MIN_SPEED_REVERSE) {
            this.currentSpeed = this.MIN_SPEED_REVERSE;
        } else if (this.currentSpeed < this.MIN_SPEED_FORWARD && this.currentSpeed > this.SPEED_ZERO) {
            this.currentSpeed = this.SPEED_ZERO;
        }

        if (this.currentSpeed < this.MAX_SPEED_REVERSE) {
            this.currentSpeed = this.MAX_SPEED_REVERSE;
        }
        this.setSpeed();
    }

    /** Stop the engine. */
    stop() {
        this.currentSpeed = this.SPEED_ZERO;
        this.setSpeed();
    }

    /** Sets the speed. */
    private setSpeed() {
        const stream = servoblaster.createWriteStream(this.SERVOBLASTER_ID_MOTOR);
        stream.write(this.currentSpeed);
        stream.end();
    }
}

export default Engine;