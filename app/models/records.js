import api from '../config/api';
import {sendRequest} from '../service/request';

export default {
    namespace: 'records',

    state: {

    },

    effects: {
        *betRecords({callback}, { put }) {
            let rs = yield sendRequest();
            if(rs && rs.err_code == 0 && rs.bet.userRecords){
                callback && callback(rs.records);
            }
        },
        *integralChangeRecords({params, callback, errCallback}){
            let rs = yield sendRequest(api.bet.integralChangeRecords, params);
            if(rs && rs.err_code == 0 ){
                callback && callback(rs.records);
            }else{
                errCallback && errCallback(rs);
            }
        },
        *userBetRecords({params, callback, errCallback}){
            let rs = yield sendRequest(api.bet.userBetRecords, params);
            if(rs && rs.err_code == 0 ){
                callback && callback(rs.records);
            }else{
                errCallback && errCallback(rs);
            }
        },
        *userWithDrawRecord({params, callback, errCallback}){
            let rs = yield sendRequest(api.withdraw.userWithDrawRecord, params);
            if(rs && rs.err_code == 0 ){
                callback && callback(rs.records);
            }else{
                errCallback && errCallback(rs);
            }
        },
    },

    reducers: {
    },
}