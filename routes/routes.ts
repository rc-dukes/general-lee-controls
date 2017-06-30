import {Router}  from "express";
import {GeneralLee} from "../core/system/generalLee";
import {Heartbeat} from "../core/heartbeat";
import {HeartbeatRouter} from "./heartbeat";
import {WheelsRouter} from "./wheels";
import {EngineRouter} from "./engine";

/** Routes. */
export class Routes {
    private router: Router;

    /**
     * Constructor.
     * @param generalLee The general lee.
     * @param heartbeat The heartbeat.
     */
    constructor(private generalLee: GeneralLee, private heartbeat: Heartbeat) {
        this.router = Router();

        const heartbeatRouter = new HeartbeatRouter(generalLee, heartbeat);
        const wheelsRouter = new WheelsRouter(generalLee);
        const engineRouter = new EngineRouter(generalLee);

        this.router.use('/heartbeat', heartbeatRouter.routes());
        this.router.use('/wheels', wheelsRouter.routes());
        this.router.use('/engine', engineRouter.routes());
    }

    /**
     * Gets the routes.
     * @returns {Router}
     */
    routes() {
        return this.router;
    }
}