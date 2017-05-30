import api from '../config/api';
import {sendRequest} from '../service/request';

export default {
    namespace: 'message',

    state: {
        systemList: [],
    },

    effects: {
        *systemList({ params, callback }, { put }) {
            params.pageSize = 20;
            let rs = yield sendRequest(api.message.systemList, params);
            if(rs && rs.err_code == 0){
                yield put({
                    type: 'setList' ,
                    systemList: rs.systemList,
                    loadMore: params.pageIndex != 1,
                });
                callback && callback(rs.systemList)
            }
        },
        *detail({ params, callback }, { put }) {
            let rs = yield sendRequest(api.message.detail, params);
            if(rs && rs.err_code == 0){
                callback && callback(rs.info);
            }
        },
    },

    reducers: {
        setList(state,{ systemList, loadMore }) {
            if(loadMore){
                let data = state.systemList;
                systemList = data.concat(systemList);
            }
            return {...state, systemList}
        },
    },
}