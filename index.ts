import {GeneralLee} from "./core/system/generalLee";
import {Heartbeat} from "./core/heartbeat";
import * as express from "express";
import {Routes} from "./routes/routes";

(() => {
    const SERVER_PORT: number = 3001;

    const generalLee = new GeneralLee();
    const heartbeat = new Heartbeat(generalLee);
    const app = express();

    heartbeat.start();

    app.use('/', new Routes(generalLee, heartbeat).routes());

    app.listen(SERVER_PORT, () => {
        console.log('General lee is listening on port', SERVER_PORT);
    });
})();