import api from '../config/api';
import {sendRequest} from '../service/request';

export default {
    namespace: 'message',

    state: {
        systemMsgList: [],
        userMsgList: [],
    },

    effects: {
        *messageList({ params, callback }, { put }) {
            params.pageSize = 20;
            const path = params.type == 1?api.message.systemList : api.message.userMessages;
            let rs = yield sendRequest(path, params);
            if(rs && rs.err_code == 0){
                if(params.type == 1){
                    yield put({
                        type: 'setSystemMsgList' ,
                        systemMsgList: rs.systemList,
                        loadMore: params.pageIndex != 1,
                    });
                    callback && callback(rs.systemList)
                }else{
                    yield put({
                        type: 'setUserMsgList' ,
                        userMsgList: rs.userMessages,
                        loadMore: params.pageIndex != 1,
                    });
                    callback && callback(rs.userMessages)
                }
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
        setSystemMsgList(state,{ systemMsgList, loadMore }) {
            if(loadMore){
                let data = state.systemMsgList;
                systemMsgList = data.concat(systemMsgList);
            }
            return {...state, systemMsgList}
        },
        setUserMsgList(state,{ userMsgList, loadMore }) {
            if(loadMore){
                let data = state.userMsgList;
                userMsgList = data.concat(userMsgList);
            }
            return {...state, userMsgList}
        },
    },
}