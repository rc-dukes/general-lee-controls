import * as servoblaster from 'servoblaster';
import {injectable} from 'inversify';

/** Wheels.*/
@injectable()
class Wheels {
    SERVOBLASTER_ID_WHEEL = 2; // GPIO-18
    WHEEL_MAX_LEFT= 120;
    WHEEL_MAX_RIGHT= 190;
    WHEEL_CENTER= 155;
    WHEEL_STEP_SIZE= 5;

    wheelPosition: number;

    /** Constructor. */
    constructor() {
        this.wheelPosition = this.WHEEL_CENTER;
    }

    /** Turn the wheels to the left. */
    turnLeft() {
        this.wheelPosition = this.wheelPosition - this.WHEEL_STEP_SIZE;
        if (this.wheelPosition < this.WHEEL_MAX_LEFT) {
            this.wheelPosition = this.WHEEL_MAX_LEFT;
        }
        this.setWheels();
    }

    /** Center the wheels. */
    center() {
        this.wheelPosition = this.WHEEL_CENTER;
        this.setWheels();
    }

    /** Turn the wheels to the right. */
    turnRight() {
        this.wheelPosition = this.wheelPosition + this.WHEEL_STEP_SIZE;
        if (this.wheelPosition > this.WHEEL_MAX_RIGHT) {
            this.wheelPosition = this.WHEEL_MAX_RIGHT;
        }
        this.setWheels();
    }

    /** Sets the wheels. */
    private setWheels() {
        const stream = servoblaster.createWriteStream(this.SERVOBLASTER_ID_WHEEL);
        stream.write(this.wheelPosition);
        stream.end();
    }
}

export default Wheels;
