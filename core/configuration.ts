import {ContainerModule, interfaces} from "inversify";
import "reflect-metadata";
import Engine from "./system/engine";
import GeneralLee from "./system/generalLee";
import Wheels from "./system/wheels";
import Lights from "./system/lights";
import Heartbeat from "./heartbeat";

let coreContainerModule = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    bind<GeneralLee>("generalLee").to(GeneralLee);
    bind<Engine>("engine").to(Engine);
    bind<Wheels>("wheels").to(Wheels);
    bind<Lights>("lights").to(Lights);

    bind<Heartbeat>("heartbeat").to(Heartbeat);

});

export default coreContainerModule