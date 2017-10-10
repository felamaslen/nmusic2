/*
 * Builds actions for communicating between the views and store,
 * with possible side effects
 */

const buildMessage = (type, payload) => ({ type, payload });

export const buildEffectAction = (type, payload) => effect => ({
    ...buildMessage(type, payload),
    effect: buildMessage(effect, payload)
});

export default buildMessage;

