import * as sinon from "sinon";
import * as express from "express";
import EngineRouter from "./engine";
import GeneralLee from "../core/system/generalLee";
import Engine from "../core/system/engine";
import {Container} from "inversify";

describe('EngineRouter', () => {
    let engineRouter: EngineRouter;
    let generalLee: GeneralLee;
    let engine: Engine;
    let generalLeeIsRunningFn: sinon.SinonStub;
    let generalLeeEngineIncreaseSpeedFn: sinon.SinonStub;
    let generalLeeEngineDecreaseSpeedFn: sinon.SinonStub;
    let generalLeeEngineBreakFn: sinon.SinonStub;

    let responseStatusFn: sinon.SinonStub;
    let responseEndFn: sinon.SinonStub;

    let request: any = {};
    let response: any;

    let routerPostFn: sinon.SinonStub;
    let router: any;
    let routerFn: sinon.SinonStub;

    // The route callbacks
    let routes: { [endpoint: string]: Function };

    beforeEach(() => {
        generalLee = sinon.createStubInstance(GeneralLee);
        generalLeeIsRunningFn = sinon.stub();
        generalLee.isRunning = generalLeeIsRunningFn;

        engine = sinon.createStubInstance(Engine);
        generalLeeEngineIncreaseSpeedFn = sinon.stub();
        generalLeeEngineDecreaseSpeedFn = sinon.stub();
        generalLeeEngineBreakFn = sinon.stub();
        generalLee.engine = engine;
        generalLee.engine.increaseSpeed = generalLeeEngineIncreaseSpeedFn;
        generalLee.engine.decreaseSpeed = generalLeeEngineDecreaseSpeedFn;
        generalLee.engine.stop = generalLeeEngineBreakFn;

        responseStatusFn = sinon.stub();
        responseEndFn = sinon.stub();
        routerPostFn = sinon.stub();

        routes = {};

        routerPostFn.callsFake((endpoint: string, fn: Function) => {
            routes[endpoint] = fn;
        });

        response = {
            status: responseStatusFn,
            end: responseEndFn
        };
        router = {post: routerPostFn};
        routerFn = sinon.stub(express, 'Router').callsFake(() => {
            return router;
        });

        const container = new Container();
        container.bind<GeneralLee>("generalLee").toConstantValue(generalLee);
        container.bind<EngineRouter>("engineRouter").to(EngineRouter);

        engineRouter = container.get<EngineRouter>("engineRouter");
    });

    describe('constructor', () => {
        it('creates a new router', () =>
            sinon.assert.calledOnce(routerFn));

        it('registers the increase speed action', () =>
            sinon.assert.calledWith(routerPostFn, '/increase-speed', sinon.match(() => true)));

        it('registers the decrease speed action', () =>
            sinon.assert.calledWith(routerPostFn, '/decrease-speed', sinon.match(() => true)));

        it('registers the break action', () =>
            sinon.assert.calledWith(routerPostFn, '/break', sinon.match(() => true)));

        afterEach(() => {
            routerFn.restore();
            routerPostFn.reset();
        });
    });

    describe('routes', () => {
        it('gets the created router', () =>
            expect(engineRouter.router).toBe(router));

        afterEach(() => {
            routerFn.restore();
            routerPostFn.reset();
        });
    });

    describe('actions', () => {
        describe('while general lee is running', () => {
            beforeEach(() => {
                generalLeeIsRunningFn.returns(true);
            });

            it('increase speed', () => {
                routes['/increase-speed'](request, response);
                sinon.assert.calledOnce(generalLeeIsRunningFn);
                sinon.assert.calledOnce(generalLeeEngineIncreaseSpeedFn);
                sinon.assert.calledWith(responseStatusFn, 200);
                sinon.assert.calledOnce(responseEndFn);
            });

            it('decrease speed', () => {
                routes['/decrease-speed'](request, response);
                sinon.assert.calledOnce(generalLeeIsRunningFn);
                sinon.assert.calledOnce(generalLeeEngineDecreaseSpeedFn);
                sinon.assert.calledWith(responseStatusFn, 200);
                sinon.assert.calledOnce(responseEndFn);
            });

            it('break', () => {
                routes['/break'](request, response);
                sinon.assert.calledOnce(generalLeeIsRunningFn);
                sinon.assert.calledOnce(generalLeeEngineBreakFn);
                sinon.assert.calledWith(responseStatusFn, 200);
                sinon.assert.calledOnce(responseEndFn);
            });

            afterEach(() => {
                routerFn.restore();
                routerPostFn.reset();
                responseStatusFn.reset();
                responseEndFn.reset();
                generalLeeIsRunningFn.reset();
                generalLeeEngineIncreaseSpeedFn.reset();
                generalLeeEngineDecreaseSpeedFn.reset();
                generalLeeEngineBreakFn.reset();
            });
        });

        describe('while general lee is not running', () => {
            beforeEach(() => {
                generalLeeIsRunningFn.returns(false);
            });

            it('does not increase speed', () => {
                routes['/increase-speed'](request, response);
                sinon.assert.calledOnce(generalLeeIsRunningFn);
                sinon.assert.callCount(generalLeeEngineIncreaseSpeedFn, 0);
                sinon.assert.calledWith(responseStatusFn, 409);
                sinon.assert.calledOnce(responseEndFn);
            });

            it('does not decrease speed', () => {
                routes['/decrease-speed'](request, response);
                sinon.assert.calledOnce(generalLeeIsRunningFn);
                sinon.assert.callCount(generalLeeEngineDecreaseSpeedFn, 0);
                sinon.assert.calledWith(responseStatusFn, 409);
                sinon.assert.calledOnce(responseEndFn);
            });

            it('does not break', () => {
                routes['/break'](request, response);
                sinon.assert.calledOnce(generalLeeIsRunningFn);
                sinon.assert.callCount(generalLeeEngineBreakFn, 0);
                sinon.assert.calledWith(responseStatusFn, 409);
                sinon.assert.calledOnce(responseEndFn);
            });

            afterEach(() => {
                routerFn.restore();
                routerPostFn.reset();
                responseStatusFn.reset();
                responseEndFn.reset();
                generalLeeIsRunningFn.reset();
                generalLeeEngineIncreaseSpeedFn.reset();
                generalLeeEngineDecreaseSpeedFn.reset();
                generalLeeEngineBreakFn.reset();
            });
        });
    });
});