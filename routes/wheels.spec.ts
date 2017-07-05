import * as sinon from 'sinon';
import * as express from 'express';
import WheelsRouter from './wheels';
import GeneralLee from '../core/system/generalLee';
import Wheels from '../core/system/wheels';
import {Container} from 'inversify';

describe('WheelsRouter', () => {
    let wheelsRouter: WheelsRouter;
    let generalLee: GeneralLee;
    let wheels: Wheels;
    let generalLeeIsRunningFn: sinon.SinonStub;
    let generalLeeWheelsTurnLeftFn: sinon.SinonStub;
    let generalLeeWheelsTurnRightFn: sinon.SinonStub;
    let generalLeeWheelsCenterFn: sinon.SinonStub;

    let responseStatusFn: sinon.SinonStub;
    let responseEndFn: sinon.SinonStub;

    const request: any = {};
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

        wheels = sinon.createStubInstance(Wheels);
        generalLeeWheelsTurnLeftFn = sinon.stub();
        generalLeeWheelsTurnRightFn = sinon.stub();
        generalLeeWheelsCenterFn = sinon.stub();
        generalLee.wheels = wheels;
        generalLee.wheels.turnLeft = generalLeeWheelsTurnLeftFn;
        generalLee.wheels.turnRight = generalLeeWheelsTurnRightFn;
        generalLee.wheels.center = generalLeeWheelsCenterFn;

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
        container.bind<GeneralLee>('generalLee').toConstantValue(generalLee);
        container.bind<WheelsRouter>('wheelsRouter').to(WheelsRouter);

        wheelsRouter = container.get<WheelsRouter>('wheelsRouter');
    });

    describe('constructor', () => {
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
        it('gets the created router', () =>
            expect(wheelsRouter.router).toBe(router));

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
