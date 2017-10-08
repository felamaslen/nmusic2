import { createReducer } from 'redux-create-reducer';

import * as AC from '../constants/actions';

import initialState from '../initialState';

function createReducerObject(array) {
    return array.reduce((obj, item) => {
        obj[item[0]] = (reduction, action) => item[1](reduction, action.payload);

        return obj;
    }, {});
}

const reducers = createReducerObject([
]);

export default createReducer(initialState, reducers);

