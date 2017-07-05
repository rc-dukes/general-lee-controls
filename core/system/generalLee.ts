import {inject, injectable} from 'inversify';
import Engine from './engine';
import Wheels from './wheels';
import Lights from './lights';

/** The General Lee. */
@injectable()
class GeneralLee {
    @inject('engine') public engine: Engine;
    @inject('wheels') public wheels: Wheels;
    @inject('lights') public lights: Lights;
    running: boolean;

    /** Constructor. */
    constructor() {
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

export default GeneralLee;