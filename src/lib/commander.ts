type Callback = () => any;

class CommanderError extends Error {
    public readonly originalError: Error;
    public readonly commandName: string;

    constructor(message: string, originalError: Error, commandName: string) {
        super(message);
        this.name = 'CommanderError';
        this.originalError = originalError;
        this.commandName = commandName;
        
        // Ensure proper prototype chain for instanceof checks
        Object.setPrototypeOf(this, CommanderError.prototype);
    }

    toString(): string {
        return `[${this.name}] ${this.message}\nCommand: ${this.commandName}\nOriginal Error: ${this.originalError.message}`;
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
                const error = err instanceof Error ? err : new Error(String(err));
                throw new CommanderError(
                    `Command execution failed`,
                    error,
                    cb.name || 'anonymous'
                );
            }
        }
    }

    pipe(cb: Callback) {
        this.queue.push(cb);
        return this;
    }
}

export { Commander };
