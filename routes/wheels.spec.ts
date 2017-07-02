import * as sinon from "sinon";
import * as express from "express";
import {WheelsRouter} from "./wheels";
import {GeneralLee} from "../core/system/generalLee";
import {Wheels} from "../core/system/wheels";

describe('WheelsRouter', () => {
    let wheelsRouter: WheelsRouter;
    let generalLee: GeneralLee;

    let routerPostFn: sinon.SinonStub;
    let router: any;
    let routerFn: sinon.SinonStub;

    beforeEach(() => {
        generalLee = sinon.createStubInstance(GeneralLee);

        routerPostFn = sinon.stub();
        router = {post: routerPostFn};
        routerFn = sinon.stub(express, 'Router').callsFake(() => {
            return router;
        });
    });

    describe('constructor', () => {
        beforeEach(() => {
            wheelsRouter = new WheelsRouter(generalLee);
        });
        it('creates a new router', () =>
            sinon.assert.calledOnce(routerFn));

        it('registers the turn left action', () =>
            sinon.assert.calledWith(routerPostFn, '/turn-left', sinon.match(() => true)));

        it('registers the turn right action', () =>
            sinon.assert.calledWith(routerPostFn, '/turn-right', sinon.match(() => true)));

        it('registers the center action', () =>
            sinon.assert.calledWith(routerPostFn, '/center', sinon.match(() => true)));

        afterEach(() => {
            routerFn.restore();
            routerPostFn.reset();
        });
    });

    describe('routes', () => {
        beforeEach(() => {
            wheelsRouter = new WheelsRouter(generalLee);
        });
        it('gets the created router', () =>
            expect(wheelsRouter.routes()).toBe(router));

        afterEach(() => {
            routerFn.restore();
            routerPostFn.reset();
        });
    });

    describe('actions', () => {
        let generalLeeIsRunningFn: sinon.SinonStub;
        let generalLeeWheelsTurnLeftFn: sinon.SinonStub;
        let generalLeeWheelsTurnRightFn: sinon.SinonStub;
        let generalLeeWheelsCenterFn: sinon.SinonStub;

        let responseStatusFn: sinon.SinonStub;
        let responseEndFn: sinon.SinonStub;
        // The route callbacks
        let routes: { [endpoint: string]: Function };

        let request: any = {};
        let response: any;

        beforeEach(() => {
            generalLee.isRunning = generalLeeIsRunningFn = sinon.stub();
            generalLee.wheels = sinon.createStubInstance(Wheels);
            generalLee.wheels.turnLeft = generalLeeWheelsTurnLeftFn = sinon.stub();
            generalLee.wheels.turnRight = generalLeeWheelsTurnRightFn = sinon.stub();
            generalLee.wheels.center = generalLeeWheelsCenterFn = sinon.stub();

            responseStatusFn = sinon.stub();
            responseEndFn = sinon.stub();

            routes = {};

            routerPostFn.callsFake((endpoint: string, fn: Function) => {
                routes[endpoint] = fn;
            });

            response = {
                status: responseStatusFn,
                end: responseEndFn
            };

            wheelsRouter = new WheelsRouter(generalLee);
        });

        describe('while general lee is running', () => {
            beforeEach(() => {
                generalLeeIsRunningFn.returns(true);
            });

            it('turn left', () => {
                routes['/turn-left'](request, response);
                sinon.assert.calledOnce(generalLeeIsRunningFn);
                sinon.assert.calledOnce(generalLeeWheelsTurnLeftFn);
                sinon.assert.calledWith(responseStatusFn, 200);
                sinon.assert.calledOnce(responseEndFn);
            });

            it('turn right', () => {
                routes['/turn-right'](request, response);
                sinon.assert.calledOnce(generalLeeIsRunningFn);
                sinon.assert.calledOnce(generalLeeWheelsTurnRightFn);
                sinon.assert.calledWith(responseStatusFn, 200);
                sinon.assert.calledOnce(responseEndFn);
            });

            it('center', () => {
                routes['/center'](request, response);
                sinon.assert.calledOnce(generalLeeIsRunningFn);
                sinon.assert.calledOnce(generalLeeWheelsCenterFn);
                sinon.assert.calledWith(responseStatusFn, 200);
                sinon.assert.calledOnce(responseEndFn);
            });

            afterEach(() => {
                routerFn.restore();
                routerPostFn.reset();
                responseStatusFn.reset();
                responseEndFn.reset();
                generalLeeIsRunningFn.reset();
                generalLeeWheelsTurnLeftFn.reset();
                generalLeeWheelsTurnRightFn.reset();
                generalLeeWheelsCenterFn.reset();
            });
        });

        describe('while general lee is not running', () => {
            beforeEach(() => {
                generalLeeIsRunningFn.returns(false);
            });

            it('does not turn left', () => {
                routes['/turn-left'](request, response);
                sinon.assert.calledOnce(generalLeeIsRunningFn);
                sinon.assert.callCount(generalLeeWheelsTurnLeftFn, 0);
                sinon.assert.calledWith(responseStatusFn, 409);
                sinon.assert.calledOnce(responseEndFn);
            });

            it('does not turn right', () => {
                routes['/turn-right'](request, response);
                sinon.assert.calledOnce(generalLeeIsRunningFn);
                sinon.assert.callCount(generalLeeWheelsTurnRightFn, 0);
                sinon.assert.calledWith(responseStatusFn, 409);
                sinon.assert.calledOnce(responseEndFn);
            });

            it('does not center', () => {
                routes['/center'](request, response);
                sinon.assert.calledOnce(generalLeeIsRunningFn);
                sinon.assert.callCount(generalLeeWheelsCenterFn, 0);
                sinon.assert.calledWith(responseStatusFn, 409);
                sinon.assert.calledOnce(responseEndFn);
            });

            afterEach(() => {
                routerFn.restore();
                routerPostFn.reset();
                responseStatusFn.reset();
                responseEndFn.reset();
                generalLeeIsRunningFn.reset();
                generalLeeWheelsTurnLeftFn.reset();
                generalLeeWheelsTurnRightFn.reset();
                generalLeeWheelsCenterFn.reset();
            });
        });
    });
});