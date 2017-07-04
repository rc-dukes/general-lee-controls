import {ContainerModule, interfaces} from "inversify";
import "reflect-metadata";
import HeartbeatRouter from "./heartbeat";
import EngineRouter from "./engine";
import WheelsRouter from "./wheels";
import Routes from "./routes";

let routesContainerModule = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    bind<EngineRouter>("engineRouter").to(EngineRouter);
    bind<WheelsRouter>("wheelsRouter").to(WheelsRouter);
    bind<HeartbeatRouter>("heartbeatRouter").to(HeartbeatRouter);
    bind<Routes>("routes").to(Routes);
});

export default routesContainerModule