import {Engine} from "./engine";
import {Lights} from "./lights";
import {Wheels} from "./wheels";

/** The General Lee. */
export class GeneralLee {
    engine: Engine;
    lights: Lights;
    wheels: Wheels;
    running: boolean;

    /** Constructor. */
    constructor() {
        this.engine = new Engine();
        this.lights = new Lights();
        this.wheels = new Wheels();
        this.running = false;
    }

    /**
     * Indicates if the engine is running.
     * @returns {boolean} indicator The indicator.
     */
    isRunning(): boolean {
        return this.running;
    }

    /** Startup. */
    startup() {
        this.running = true;
        this.lights.turnOn();
        this.wheels.center();
        this.engine.stop();
    }

    /** Shutdown. */
    shutdown() {
        this.running = false;
        this.lights.turnOff();
        this.wheels.center();
        this.engine.stop();
    }
}