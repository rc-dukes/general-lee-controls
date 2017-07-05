import * as express from 'express';
import GeneralLee from '../core/system/generalLee';
import Heartbeat from '../core/heartbeat';
import {inject, injectable} from 'inversify';

/** Router responsible for routing all heartbeat related api calls. */
@injectable()
class HeartbeatRouter {
    public router: express.Router;

    /** Constructor. */
    constructor(@inject('generalLee') private generalLee: GeneralLee,
                @inject('heartbeat') private heartbeat: Heartbeat) {
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
}

export default HeartbeatRouter;
