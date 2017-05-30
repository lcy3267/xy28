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
        info: null,
        isSetWithdrawPwd: undefined,
    },

    subscriptions: {
        setup({ dispatch }) {
            dispatch({type: 'storageLogin'});
        },
    },

    effects: {
        *register({params, callback, errCallback}, { put }) {
            let rs = yield sendRequest(api.user.register, params);
            if(rs && rs.err_code == 0){
                let info = rs.user;
                Storage.setItem(storageKey.userInfo, info);
                Storage.setItem(storageKey.token, rs.token);
                callback && callback(rs.user_id);
                yield put({ type: 'bindUser' , info});
            }
        },
        *storageLogin({key, callback},{put}){
            let info = yield Storage.getItem(storageKey.userInfo);
            if(info){
                const account = info.account;
                const password = info.password;
                yield put({
                    type: 'login',
                    params: {account, password},
                    errCallback: ()=>{
                        Storage.clear(storageKey.userInfo);
                    }
                });
                callback && callback();
            }
        },
        *login({params, callback, errCallback},{put}){
            let rs = yield sendRequest(api.user.login, params);
            if(rs && rs.err_code == 0){
                let info = rs.user;
                info.password = params.password;
                Storage.setItem(storageKey.userInfo, info);
                Storage.setItem(storageKey.token, rs.token);
                callback && callback(rs.user);
                yield put({ type: 'bindUser' , info});
                yield put({type: 'queryWithdrawPwd'});
            }else{
                yield put({ type: 'bindUser' , null});
                errCallback && errCallback(rs);
            }
        },
        *loginOut({callback},{put}){
            yield put({type: 'bindUser', info: null});
            Storage.removeItem(storageKey.userInfo);
            callback && callback();
        },
        *getUserInfo({},{put}){
            let rs = yield sendRequest(api.user.getUserInfo);
            if(rs && rs.err_code == 0){
                const info = rs.user;
                yield put({ type: 'bindUser' , info});
            }
        },
        *bindBank({params, callback, errCallback},{put}){
            let rs = yield sendRequest(api.user.bindBank,params);
            if(rs && rs.err_code == 0){
                callback && callback(rs.user);
            }else{
                errCallback && errCallback(rs);
            }
        },
        *getBankCards({callback}){
            let rs = yield sendRequest(api.user.getBankCards);
            if(rs && rs.err_code == 0){
                callback && callback(rs.cards);
            }else{
                callback('error');
            }
        },
        *queryWithdrawPwd({callback},{put}){
            let rs = yield sendRequest(api.withdraw.queryWithdrawPwd);
            if(rs && rs.err_code == 0){
                yield put({type: 'isSetWithdrawPwd', isSetWithdrawPwd: true});
            }else if(rs.err_code == 401){
                yield put({type: 'storageLogin'});
            }else{
                yield put({type: 'isSetWithdrawPwd', isSetWithdrawPwd: false});
            }
        },
        *setWithdrawPwd({params, callback, errCallback},{put}){
            let rs = yield sendRequest(api.withdraw.setWithdrawPwd, params);
            if(rs && rs.err_code == 0){
                callback && callback();
                yield put({type: 'isSetWithdrawPwd', isSetWithdrawPwd: true});
            }else{
                errCallback && errCallback(rs);
            }
        },
        *withdraw({params, callback, errCallback}){
            let rs = yield sendRequest(api.withdraw.withdraw, params);
            if(rs && rs.err_code == 0){
                callback && callback();
            }else{
                errCallback && errCallback(rs);
            }
        },
    },

    reducers: {
        bindUser(state,info) {
            return Object.assign({}, state, info);
        },
        isSetWithdrawPwd(state, { isSetWithdrawPwd }){
            return Object.assign({}, state, {isSetWithdrawPwd});
        }
    },
}