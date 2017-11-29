/* eslint-disable prefer-reflect, no-invalid-this */

class CallEffect {
    constructor(fn, args) {
        this.fn = fn;
        this.args = args;
        this.context = null;
    }
    run() {
        return Reflect.apply(this.fn, this.context, this.args);
    }
    valueOf() {
        return {
            type: '@@CALL@@',
            functionName: this.fn.name,
            args: this.args
        }
    }
}

class ApplyEffect extends CallEffect {
    constructor(context, fn, args) {
        super(fn, args);

        this.context = context;
    }
    valueOf() {
        return {
            ...super.valueOf(),
            type: '@@APPLY@@',
            context: this.context
        }
    }
}

function getNextValue(value) {
    if (value instanceof CallEffect || value instanceof ApplyEffect) {
        return value.run();
    }

    return value;
}

export function generatorToPromise(generatorFunction) {
    return function asyncFunction(...args) {
        const generator = generatorFunction.call(this, ...args);

        function next(error, result) {
            return new Promise(async (resolve, reject) => {
                if (error) {
                    return reject(error);
                }

                try {
                    const { value, done } = generator.next(result);

                    if (done) {
                        return resolve(result);
                    }

                    const nextValue = await (
                        value.constructor.name === 'GeneratorFunction'
                            ? generatorToPromise(value)
                            : getNextValue(value)
                    );

                    const nextState = await next(null, nextValue);

                    return resolve(nextState);
                }
                catch (err) {
                    return reject(err);
                }
            });
        }

        return next();
    }
}

export const call = (fn, ...args) => new CallEffect(fn, args);

export const apply = (context, fn, ...args) => new ApplyEffect(context, fn, ...args);

