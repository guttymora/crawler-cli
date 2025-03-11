type Callback = () => any;

class CommanderError extends Error {
    constructor(message?: string) {
        super(message);
    }
}

class Commander {
    private queue: Callback[] = [];

    async exec() {
        while (this.queue.length > 0) {
            const cb = this.queue.shift();
            if (!cb) break;
            try {
                await cb();
            } catch (err) {
                throw new CommanderError(`Error in ${cb.name}`);
            }
        }
    }

    pipe(cb: Callback) {
        this.queue.push(cb);
        return this;
    }
}

export { Commander };
