/**
 * Created by chengyuan on 2017/3/11.
 */
/**
 * Created by chengyuan on 2017/3/5.
 */
import api from '../config/api';
import {sendRequest} from '../service/request';


export default {
    namespace: 'user',

    state: {
        info: null,
    },

    subscriptions: {
        setup({ dispatch }) {
            //dispatch({type: 'add'});
        },
    },

    effects: {
        *register({params,callback}, { put }) {
            console.log('>>>');
            console.log(params);
            let rs = yield sendRequest(api.user.register,params);
            if(rs && rs.err_code == 0){
                callback && callback(rs.id);
                yield put({ type: 'bindUser' });
            }
        },
    },

    reducers: {
        bindUser(state,info) {
            return {...state,info}
        },
    },
}