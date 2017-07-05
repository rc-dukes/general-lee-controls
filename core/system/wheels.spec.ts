import * as sinon from 'sinon';
import * as servoblaster from 'servoblaster';
import {Stream} from 'servoblaster';
import Wheels from './wheels';
import {Container} from 'inversify';

describe('Wheels', () => {
    let wheels: Wheels;
    let servoblasterCreateWriteStreamFn: sinon.SinonStub;
    let streamWriteFn: sinon.SinonStub;
    let streamEndFn: sinon.SinonStub;

    beforeEach(() => {
        const container = new Container();
        container.bind<Wheels>('wheels').to(Wheels);
        wheels = container.get<Wheels>('wheels');
        let stream: Stream = {
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
        it('sets the wheel position to center', () =>
            expect(wheels.wheelPosition).toBe(wheels.WHEEL_CENTER));
    });

    describe('turnLeft', () => {
        describe('from center', () => {
            it('decreases current wheel position with the wheel step size setting ', () => {
                const expected = wheels.WHEEL_CENTER - wheels.WHEEL_STEP_SIZE;

                wheels.turnLeft();

                expect(wheels.wheelPosition).toBe(expected);
                sinon.assert.calledWith(servoblasterCreateWriteStreamFn, wheels.SERVOBLASTER_ID_WHEEL);
                sinon.assert.calledWith(streamWriteFn, expected);
                sinon.assert.called(streamEndFn);
            });
        });

        describe('while turned right', () => {
            it('decreases current wheel position with the wheel step size setting ', () => {
                wheels.wheelPosition = wheels.WHEEL_MAX_RIGHT;
                const expected = wheels.wheelPosition - wheels.WHEEL_STEP_SIZE;

                wheels.turnLeft();

                expect(wheels.wheelPosition).toBe(expected);
                sinon.assert.calledWith(servoblasterCreateWriteStreamFn, wheels.SERVOBLASTER_ID_WHEEL);
                sinon.assert.calledWith(streamWriteFn, expected);
                sinon.assert.called(streamEndFn);
            });
        });

        describe('while turned left', () => {
            it('decreases current wheel position with the wheel step size setting ', () => {
                wheels.wheelPosition = wheels.WHEEL_CENTER - 20;
                const expected = wheels.wheelPosition - wheels.WHEEL_STEP_SIZE;

                wheels.turnLeft();

                expect(wheels.wheelPosition).toBe(expected);
                sinon.assert.calledWith(servoblasterCreateWriteStreamFn, wheels.SERVOBLASTER_ID_WHEEL);
                sinon.assert.calledWith(streamWriteFn, expected);
                sinon.assert.called(streamEndFn);
            });
        });

        describe('while wheel position is at the maximum left position', () => {
            it('does not update the wheel position', () => {
                const expected = wheels.WHEEL_MAX_LEFT;
                wheels.wheelPosition = expected;

                wheels.turnLeft();

                expect(wheels.wheelPosition).toBe(expected);
                sinon.assert.calledWith(servoblasterCreateWriteStreamFn, wheels.SERVOBLASTER_ID_WHEEL);
                sinon.assert.calledWith(streamWriteFn, expected);
                sinon.assert.called(streamEndFn);
            });
        });
    });

    describe('turnRight', () => {
        describe('from center', () => {
            it('increases current wheel position with the wheel step size setting ', () => {
                const expected = wheels.WHEEL_CENTER + wheels.WHEEL_STEP_SIZE;

                wheels.turnRight();

                expect(wheels.wheelPosition).toBe(expected);
                sinon.assert.calledWith(servoblasterCreateWriteStreamFn, wheels.SERVOBLASTER_ID_WHEEL);
                sinon.assert.calledWith(streamWriteFn, expected);
                sinon.assert.called(streamEndFn);
            });
        });

        describe('while turned left', () => {
            it('increases current wheel position with the wheel step size setting ', () => {
                wheels.wheelPosition = wheels.WHEEL_MAX_LEFT;
                const expected = wheels.wheelPosition + wheels.WHEEL_STEP_SIZE;

                wheels.turnRight();

                expect(wheels.wheelPosition).toBe(expected);
                sinon.assert.calledWith(servoblasterCreateWriteStreamFn, wheels.SERVOBLASTER_ID_WHEEL);
                sinon.assert.calledWith(streamWriteFn, expected);
                sinon.assert.called(streamEndFn);
            });
        });

        describe('while turned right', () => {
            it('increases current wheel position with the wheel step size setting ', () => {
                wheels.wheelPosition = wheels.WHEEL_CENTER + 20;
                const expected = wheels.wheelPosition + wheels.WHEEL_STEP_SIZE;

                wheels.turnRight();

                expect(wheels.wheelPosition).toBe(expected);
                sinon.assert.calledWith(servoblasterCreateWriteStreamFn, wheels.SERVOBLASTER_ID_WHEEL);
                sinon.assert.calledWith(streamWriteFn, expected);
                sinon.assert.called(streamEndFn);
            });
        });

        describe('while wheel position is at the maximum right position', () => {
            it('does not update the wheel position', () => {
                const expected = wheels.WHEEL_MAX_RIGHT;
                wheels.wheelPosition = expected;

                wheels.turnRight();

                expect(wheels.wheelPosition).toBe(expected);
                sinon.assert.calledWith(servoblasterCreateWriteStreamFn, wheels.SERVOBLASTER_ID_WHEEL);
                sinon.assert.calledWith(streamWriteFn, expected);
                sinon.assert.called(streamEndFn);
            });
        });
    });

    describe('center', () => {
        describe('while turned left', () => {
            it('sets the current wheel position to center', () => {
                const expected = wheels.WHEEL_CENTER;
                wheels.wheelPosition = wheels.WHEEL_MAX_LEFT;

                wheels.center();

                expect(wheels.wheelPosition).toBe(expected);
            });
        });

        describe('while turned right', () => {
            it('sets the current wheel position to center', () => {
                const expected = wheels.WHEEL_CENTER;
                wheels.wheelPosition = wheels.WHEEL_MAX_RIGHT;

                wheels.center();

                expect(wheels.wheelPosition).toBe(expected);
            });
        });
    });

    afterEach(() => {
        servoblasterCreateWriteStreamFn.restore();
        streamWriteFn.restore();
        streamEndFn.restore();
    });
});