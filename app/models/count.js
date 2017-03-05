/**
 * Created by chengyuan on 2017/3/5.
 */
export default {
    namespace: 'count',
    state: 0,
    reducers: {
        add(state) { return state + 1 },
    },
    effects: {
        *addDelay(action, { call, put }) {
            yield call(delay, 1000);
            yield put({ type: 'add' });
        },
    },
    subscriptions: {
        setup({ dispatch }) {
            dispatch({type: 'add'});
        },
    },
}