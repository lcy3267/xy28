/**
 * Created by chengyuan on 2017/3/11.
 */
/**
 * Created by chengyuan on 2017/3/5.
 */
import api from '../config/api';
import {sendRequest} from '../service/request';

export default {
    namespace: 'bet',

    state: {
        rules: [],
    },

    subscriptions: {
    },

    effects: {
        *records({callback}, { put }) {
            let rs = yield sendRequest(api.gameRoles.list);
            if(rs && rs.err_code == 0 && rs.rules){
                callback && callback();
                yield put({ type: 'setList' , rules:rs.rules});
            }
        },
    },

    reducers: {
        setList(state,{rules}) {
            return {...state,rules}
        },
    },
}