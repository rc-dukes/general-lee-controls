import CommandKey from './commandKey';
import Timer = NodeJS.Timer;
(() => {
    registerKeyDownListener();
    registerKeyPressListener();
    registerClicks();


    /** Register the keydown listener. */
    function registerKeyDownListener() {
        $(document).keydown((event) => {
            if (event.which === CommandKey.TURN_LEFT) {
                turnLeft();
            } else if (event.which === CommandKey.TURN_RIGHT) {
                turnRight();
            } else if (event.which === CommandKey.INCREASE_SPEED) {
                increaseSpeed();
            } else if (event.which === CommandKey.DECREASE_SPEED) {
                decreaseSpeed();
            }
        });
    }

    /** Register the keypress listener. */
    function registerKeyPressListener() {
        $(document).keypress((event) => {
            if (event.which === CommandKey.BREAK) {
                stop();
            } else if (event.which === CommandKey.CENTER_WHEELS) {
                center();
            }
        });
    }

    /** Register the click listener. */
    function registerClicks() {
        $('.turn-left').click(() => turnLeft());
        $('.turn-right').click(() => turnRight());
        $('.center-wheels').click(() => center());
        $('.increase-speed').click(() => increaseSpeed());
        $('.decrease-speed').click(() => decreaseSpeed());
        $('.break').click(() => stop());

        let interval: Timer;

        /** toggle the connection. */
        $('.ignition').click(() => {
            if (interval === undefined) {
                interval = setInterval(() => {
                    $.get('heartbeat', () => {
                    });
                }, 100);
            } else {
                clearInterval(interval);
                interval = undefined;
            }
        });
    }

    /** Turn wheels left. */
    function turnLeft() {
        performAction('.turn-left', 'wheels/turn-left');
    }

    /** Turn wheels right. */
    function turnRight() {
        performAction('.turn-right', 'wheels/turn-right');
    }

    /** Center wheels. */
    function center() {
        performAction('.center-wheels', 'wheels/center');
    }

    /** Increase speed. */
    function increaseSpeed() {
        performAction('.increase-speed', 'engine/increase-speed');
    }

    /** Decrease speed. */
    function decreaseSpeed() {
        performAction('.decrease-speed', 'engine/decrease-speed');
    }

    /** Break. */
    function stop() {
        performAction('.break', 'engine/break')
    }

    /**
     * Perform the action.
     * @param className The class name.
     * @param url The url.
     */
    function performAction(className: string, url: string) {
        $(className).addClass('highlighted');
        $.post(url).then(() => {
            setTimeout(() => {
                $(className).removeClass('highlighted');
            }, 50);
        }).fail(() => {
            setTimeout(() => {
                $(className).removeClass('highlighted');
            }, 50);
        });
    }
})();
