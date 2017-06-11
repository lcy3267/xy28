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
            let rs = yield sendRequest(api.bet.records);
            if(rs && rs.err_code == 0 && rs.rules){
                callback && callback();
                yield put({ type: 'setList' , rules:rs.rules});
            }
        },
        *roomBetRecords({params, callback}, { put }) {
            let rs = yield sendRequest(api.bet.roomBetRecords, params);
            if(rs && rs.err_code == 0 && rs.records){
                callback && callback(rs.records);
            }
        },
        *cancelBet({params, callback, errCallback}){
            let rs = yield sendRequest(api.bet.cancelBet,params);
            if(rs && rs.err_code == 0 ){
                callback && callback();
            }else{
                errCallback && errCallback(rs);
            }
        },
    },

    reducers: {
        setList(state,{rules}) {
            return {...state,rules}
        },
    },
}