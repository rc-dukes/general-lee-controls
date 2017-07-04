import * as express from "express";
import GeneralLee from "../core/system/generalLee";
import {inject, injectable} from "inversify";

/** Router responsible for routing all engine related api calls. */
@injectable()
class EngineRouter {
    public router: express.Router;

    /** Constructor. */
    constructor(@inject("generalLee") private generalLee: GeneralLee) {
        this.router = express.Router();

        this.router.post('/increase-speed', (req: express.Request, res: express.Response) => {
            this.handle(res, () => this.generalLee.engine.increaseSpeed());
        });

        this.router.post('/decrease-speed', (req: express.Request, res: express.Response) => {
            this.handle(res, () => this.generalLee.engine.decreaseSpeed());
        });

        this.router.post('/break', (req: express.Request, res: express.Response) => {
            this.handle(res, () => this.generalLee.engine.stop());
        });
    }

    /**
     * Takes care of the request, when the general Lee is running.
     * @param res The response.
     * @param fn The function to perform.
     */
    private handle(res: express.Response, fn: Function) {
        if (this.generalLee.isRunning()) {
            fn();
            res.status(200);
        } else {
            res.status(409);
        }
        res.end();
    }
}

export default EngineRouter;