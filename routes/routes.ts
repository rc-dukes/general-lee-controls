import * as express from 'express';
import HeartbeatRouter from './heartbeat';
import WheelsRouter from './wheels';
import EngineRouter from './engine';
import {inject, injectable} from 'inversify';

/** Routes. */
@injectable()
class Routes {
    public router: express.Router;

    /** Constructor. */
    constructor(@inject('heartbeatRouter') private heartbeatRouter: HeartbeatRouter,
                @inject('engineRouter') private engineRouter: EngineRouter,
                @inject('wheelsRouter') private wheelsRouter: WheelsRouter) {
        this.router = express.Router();
        this.router.use('/heartbeat', this.heartbeatRouter.router);
        this.router.use('/engine', this.engineRouter.router);
        this.router.use('/wheels', this.wheelsRouter.router);
    }

    /**
     * Gets the routes.
     * @returns {Router}
     */
    routes() {
        return this.router;
    }
}

export default Routes;
