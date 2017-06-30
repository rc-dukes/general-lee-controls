import * as express  from "express";
import {GeneralLee} from "../core/system/generalLee";

/** Router responsible for routing all wheels related api calls. */
export class WheelsRouter {
    private router: express.Router;

    constructor(private generalLee: GeneralLee) {
        this.router = express.Router();

        this.router.post('/turn-left', (req: express.Request, res: express.Response) => {
            this.handle(res, ()=> this.generalLee.wheels.turnLeft);
        });

        this.router.post('/turn-right', (req: express.Request, res: express.Response) => {
            this.handle(res, ()=> this.generalLee.wheels.turnRight);
        });

        this.router.post('/center', (req: express.Request, res: express.Response) => {
            this.handle(res, ()=> this.generalLee.wheels.center);
        });
    }

    /**
     * Gets the routes.
     * @returns {express.Router}
     */
    routes() {
        return this.router;
    }

    /**
     * Takes care of the request, when the general Lee is running.
     * @param res The response.
     * @param fn The function to perform.
     */
    private handle(res: express.Response, fn: Function) {
        console.log('handle wheels');
        if (this.generalLee.isRunning()) {
            fn();
            res.status(200);
        } else {
            res.status(409);
        }
        res.end();
    }
}