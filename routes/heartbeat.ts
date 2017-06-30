import * as express  from "express";
import {GeneralLee} from "../core/system/generalLee";
import {Heartbeat} from "../core/heartbeat";

/** Router responsible for routing all heartbeat related api calls. */
export class HeartbeatRouter {
    private router: express.Router;

    /**
     * Constructor.
     * @param generalLee The general lee.
     * @param heartbeat The heartbeat.
     */
    constructor(private generalLee: GeneralLee, private heartbeat: Heartbeat) {
        this.router = express.Router();

        this.router.get('/', (req: express.Request, res: express.Response) => {
            this.heartbeat.last = new Date().getTime();
            if (!this.generalLee.isRunning()) {
                this.generalLee.startup();
            }
            res.status(200);
            res.end();
        });
    }

    /**
     * Gets the routes.
     * @returns {express.Router}
     */
    routes() {
        return this.router;
    }
}