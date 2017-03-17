/**
 * Created by chengyuan on 2017/3/11.
 */
/**
 * Created by chengyuan on 2017/3/5.
 */
import api from '../config/api';
import {sendRequest} from '../service/request';
import * as Storage from '../service/storage';
import {storageKey} from '../config';


export default {
    namespace: 'user',

    state: {
        info: null
    },

    subscriptions: {
        setup({ dispatch }) {
            dispatch({type: 'storageLogin'});
        },
    },

    effects: {
        *register({params,callback}, { put }) {
            let rs = yield sendRequest(api.user.register,params);
            if(rs && rs.err_code == 0){
                let info = {
                    user_id: rs.user_id
                }
                Storage.setItem(storageKey.userInfo, info);
                callback && callback(rs.user_id);
                yield put({ type: 'bindUser' , info});
            }
        },
        *storageLogin({},{put}){
            let info = yield Storage.getItem(storageKey.userInfo);
            if(info){
                yield put({type: 'bindUser', info});
            }
        },
        *login({params,callback},{put}){
            let rs = yield sendRequest(api.user.login,params);
            if(rs && rs.err_code == 0){
                let info = rs.user;
                Storage.setItem(storageKey.userInfo, info);
                callback && callback(rs.user);
                yield put({ type: 'bindUser' , info});
            }else{
                callback('error');
            }
        },
        *loginOut({callback},{put}){
            yield put({type: 'bindUser', info: null});
            Storage.removeItem(storageKey.userInfo);
            callback && callback();
        }
    },

    reducers: {
        bindUser(state,info) {
            return Object.assign({}, state, info);
        },
    },
}