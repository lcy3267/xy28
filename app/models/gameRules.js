/**
 * Created by chengyuan on 2017/3/11.
 */
/**
 * Created by chengyuan on 2017/3/5.
 */
import api from '../config/api';
import {sendRequest} from '../service/request';

export default {
    namespace: 'gameRules',

    state: {
    },

    subscriptions: {
    },

    effects: {

        *roomGameRule({params, callback},) {
            let rs = yield sendRequest(api.gameRoles.roomGameRule, params);
            if(rs && rs.err_code == 0){
                let gameRules = rs.rules;
                
                let combineRule = gameRules.filter((rule)=>rule.play_type == 1),
                    combineRate = JSON.parse(combineRule[0].combine_rates);

                let singleRule = gameRules.filter((rule)=>rule.play_type == 2),
                    singleRate = singleRule[0].single_point_rates.split('|');

                singleRate.map((rate, index)=>{
                    singleRate[14+index] = singleRate[13-index];
                });

                let newSingleRate = [];
                for(let i = 0,len = singleRate.length; i < len; i += 5){
                    newSingleRate.push(singleRate.slice(i,i+5));
                }
                
                callback && callback([combineRate, newSingleRate]);
            }
        },
    },

    reducers: {
    },
}