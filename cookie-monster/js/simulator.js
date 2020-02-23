const STEP_DELAY_MS = 900;

class Simulator {
    constructor() {
        this.queue = [];
        this.lock = false;
    }

    schedule(func) {
        this.queue.push(func);
        if (!this.lock) {
            this.lock = true;
            setTimeout(() => this.next(), STEP_DELAY_MS);
        }
    }

    next() {
        if (this.queue.length > 0) {
            let nextFunc = this.queue.shift();
            this.execute(nextFunc);
        } else {
            this.lock = false;
        }
    }

    execute(func) {
        this.lock = true;
        func();
        setTimeout(() => this.next(), STEP_DELAY_MS);
    }
}
