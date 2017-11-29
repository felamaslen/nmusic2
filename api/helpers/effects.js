/* eslint-disable prefer-reflect, no-invalid-this */
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

                    const nextValue = await value;

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

