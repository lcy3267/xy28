import api from '../config/api';
import {sendRequest} from '../service/request';


export default {
    namespace: 'recharge',

    state: {
        collectionAccounts: [],
    },

    effects: {
        *getCollectionAccounts({params,callback}, { put }) {
            let rs = yield sendRequest(api.recharge.getCollectionAccounts);
            if(rs && rs.err_code == 0){
                let collectionAccounts = rs.accounts;
                yield put({ type: 'setCollectionAccounts' , collectionAccounts});
                callback && callback();
            }
        },
        *doAlipayRecharge({params, callback}){
            let rs = yield sendRequest(api.recharge.doAlipayRecharge,params);
            if(rs && rs.err_code == 0){
                callback && callback(rs);
            }
        }
    },

    reducers: {
        bindUser(state,info) {
            return Object.assign({}, state, info);
        },
        setCollectionAccounts(state,{collectionAccounts}) {
            return {...state, collectionAccounts};
        },
    },
}