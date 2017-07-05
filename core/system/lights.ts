import * as servoblaster from 'servoblaster';
import {injectable} from 'inversify';

/** Lights. */
@injectable()
class Lights {
    SERVOBLASTER_ID_LED = 6; // GPIO-24
    LED_ON = 250;
    LED_OFF = 0;

    on: boolean;

    /** Constructor. */
    constructor() {
        this.on = false;
    }

    /** Turn the lights on. */
    turnOn() {
        this.on = true;
        this.setLights();
    }

    /** Turn the lights off. */
    turnOff() {
        this.on = false;
        this.setLights();
    }

    /** Sets the speed. */
    private setLights() {
        const stream = servoblaster.createWriteStream(this.SERVOBLASTER_ID_LED);
        stream.write(this.on ? this.LED_ON : this.LED_OFF);
        stream.end();
    }
}

export default Lights;
