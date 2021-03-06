import Engine from './engine';
import * as sinon from 'sinon';
import * as servoblaster from 'servoblaster';
import {Container} from 'inversify';

describe('Engine', () => {
    let engine: Engine;
    let servoblasterCreateWriteStreamFn: sinon.SinonStub;
    let streamWriteFn: sinon.SinonStub;
    let streamEndFn: sinon.SinonStub;

    beforeEach(() => {
        const container = new Container();
        container.bind<Engine>('engine').to(Engine);
        engine = container.get<Engine>('engine');
        const stream: servoblaster.Stream = {
            write: (value: number) => {
            },
            end: () => {
            }
        };
        streamWriteFn = sinon.stub(stream, 'write');
        streamEndFn = sinon.stub(stream, 'end');
        servoblasterCreateWriteStreamFn = sinon.stub(servoblaster, 'createWriteStream').callsFake(() => {
            return stream;
        });
    });

    describe('constructor', () => {
        it('sets the current speed to zero', () =>
            expect(engine.currentSpeed).toBe(engine.SPEED_ZERO));
    });

    describe('increaseSpeed', () => {
        describe('from stand still', () => {
            it('sets the current speed to the minimal speed forward setting', () => {
                const expected = engine.MIN_SPEED_FORWARD;

                engine.increaseSpeed();

                expect(engine.currentSpeed).toBe(expected);
                sinon.assert.calledWith(servoblasterCreateWriteStreamFn, engine.SERVOBLASTER_ID_MOTOR);
                sinon.assert.calledWith(streamWriteFn, expected);
                sinon.assert.called(streamEndFn);
            });
        });

        describe('while driving forward', () => {
            it('increases the current speed with the speed step size setting', () => {
                const expected = engine.MIN_SPEED_FORWARD + engine.SPEED_STEP_SIZE;
                engine.currentSpeed = engine.MIN_SPEED_FORWARD;

                engine.increaseSpeed();

                expect(engine.currentSpeed).toBe(expected);
                sinon.assert.calledWith(servoblasterCreateWriteStreamFn, engine.SERVOBLASTER_ID_MOTOR);
                sinon.assert.calledWith(streamWriteFn, expected);
                sinon.assert.called(streamEndFn);
            });
        });

        describe('while driving reverse', () => {
            it('decreases the current speed with the speed step size setting', () => {
                const expected = engine.MAX_SPEED_REVERSE + engine.SPEED_STEP_SIZE;
                engine.currentSpeed = engine.MAX_SPEED_REVERSE;

                engine.increaseSpeed();

                expect(engine.currentSpeed).toBe(expected);
                sinon.assert.calledWith(servoblasterCreateWriteStreamFn, engine.SERVOBLASTER_ID_MOTOR);
                sinon.assert.calledWith(streamWriteFn, expected);
                sinon.assert.called(streamEndFn);
            });
        });

        describe('while driving at the maximum speed', () => {
            it('does not update the current speed', () => {
                const expected = engine.MAX_SPEED_FORWARD;
                engine.currentSpeed = expected;

                engine.increaseSpeed();

                expect(engine.currentSpeed).toBe(expected);
                sinon.assert.calledWith(servoblasterCreateWriteStreamFn, engine.SERVOBLASTER_ID_MOTOR);
                sinon.assert.calledWith(streamWriteFn, expected);
                sinon.assert.called(streamEndFn);
            });
        });

        describe('while in reverse but below the minimal speed reverse setting', () => {
            it('sets the current speed to zero', () => {
                const expected = engine.SPEED_ZERO;
                engine.currentSpeed = engine.MIN_SPEED_REVERSE + 1;

                engine.increaseSpeed();

                expect(engine.currentSpeed).toBe(expected);
                sinon.assert.calledWith(servoblasterCreateWriteStreamFn, engine.SERVOBLASTER_ID_MOTOR);
                sinon.assert.calledWith(streamWriteFn, expected);
                sinon.assert.called(streamEndFn);
            });
        });
    });

    describe('decreaseSpeed', () => {
        describe('from stand still', () => {
            it('sets the current speed to the minimal speed reverse setting', () => {
                const expected = engine.MIN_SPEED_REVERSE;

                engine.decreaseSpeed();

                expect(engine.currentSpeed).toBe(expected);
                sinon.assert.calledWith(servoblasterCreateWriteStreamFn, engine.SERVOBLASTER_ID_MOTOR);
                sinon.assert.calledWith(streamWriteFn, expected);
                sinon.assert.called(streamEndFn);
            });
        });

        describe('while driving reverse', () => {
            it('increases the current speed with the speed step size setting', () => {
                const expected = engine.MIN_SPEED_REVERSE - engine.SPEED_STEP_SIZE;
                engine.currentSpeed = engine.MIN_SPEED_REVERSE;

                engine.decreaseSpeed();

                expect(engine.currentSpeed).toBe(expected);
                sinon.assert.calledWith(servoblasterCreateWriteStreamFn, engine.SERVOBLASTER_ID_MOTOR);
                sinon.assert.calledWith(streamWriteFn, expected);
                sinon.assert.called(streamEndFn);
            });
        });

        describe('while driving forward', () => {
            it('decreases the current speed with the speed step size setting', () => {
                const expected = engine.MAX_SPEED_FORWARD - engine.SPEED_STEP_SIZE;
                engine.currentSpeed = engine.MAX_SPEED_FORWARD;

                engine.decreaseSpeed();

                expect(engine.currentSpeed).toBe(expected);
                sinon.assert.calledWith(servoblasterCreateWriteStreamFn, engine.SERVOBLASTER_ID_MOTOR);
                sinon.assert.calledWith(streamWriteFn, expected);
                sinon.assert.called(streamEndFn);
            });
        });

        describe('while driving at the maximum speed', () => {
            it('does not update the current speed', () => {
                const expected = engine.MAX_SPEED_REVERSE;
                engine.currentSpeed = expected;

                engine.decreaseSpeed();

                expect(engine.currentSpeed).toBe(expected);
                sinon.assert.calledWith(servoblasterCreateWriteStreamFn, engine.SERVOBLASTER_ID_MOTOR);
                sinon.assert.calledWith(streamWriteFn, expected);
                sinon.assert.called(streamEndFn);
            });
        });

        describe('while in forward but below the minimal speed forward setting', () => {
            it('sets the current speed to zero', () => {
                const expected = engine.SPEED_ZERO;
                engine.currentSpeed = engine.MIN_SPEED_FORWARD - 1;

                engine.decreaseSpeed();

                expect(engine.currentSpeed).toBe(expected);
                sinon.assert.calledWith(servoblasterCreateWriteStreamFn, engine.SERVOBLASTER_ID_MOTOR);
                sinon.assert.calledWith(streamWriteFn, expected);
                sinon.assert.called(streamEndFn);
            });
        });
    });

    describe('stop', () => {
        describe('while driving reverse', () => {
            it('sets the current speed to zero', () => {
                const expected = engine.SPEED_ZERO;
                engine.currentSpeed = engine.MAX_SPEED_REVERSE;

                engine.stop();

                expect(engine.currentSpeed).toBe(expected);
            });
        });

        describe('while driving forward', () => {
            it('sets the current speed to zero', () => {
                const expected = engine.SPEED_ZERO;
                engine.currentSpeed = engine.MAX_SPEED_FORWARD;

                engine.stop();

                expect(engine.currentSpeed).toBe(expected);
            });
        });
    });

    afterEach(() => {
        servoblasterCreateWriteStreamFn.restore();
        streamWriteFn.restore();
        streamEndFn.restore();
    });
});
