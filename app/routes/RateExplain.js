/**
 * Created by chengyuan on 2017/3/5.
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    ScrollView,
    View,
    TouchableOpacity,
} from 'react-native';
import { connect } from 'dva/mobile';
import Common from '../common/index';
import RoomPopover  from '../components/RoomPopover';

class RateExplain extends Component{
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            rules: [],
        };
    }

    componentWillMount() {
        const {commonId, combineId, dispatch} = this.props;
        console.log(commonId,'-========',combineId);
        dispatch({
            type: 'rooms/specialGameRuleInfo',
            params: {commonId, combineId},
            callback: (rules)=>{
                this.setState({rules})
            }
        });
    }

    render(){
        const {rules} = this.state;

        console.log(rules);

        let rule = rules.filter(r=>r.rule_type == 1)[0];
        rule = rule?rule:{};
        let ruleSpe = rules.filter(r=>r.rule_type == 2)[0];
        ruleSpe = ruleSpe?ruleSpe:{};

        return (
            <ScrollView style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.title}>
                        <Text style={{fontSize: 20, color: '#CE6C87'}}>特殊说明</Text>
                    </View>
                    <View>
                        {line('(1) 单注10~5000, 总注10000封顶')}
                        {line(`(2) 大小单双总注<=${rule.level_2}时,如遇开13、14，大小单双赔率${rule.rate_1}倍.`)}
                        {line(`(3) 大小单双总注${rule.level_2+1} ~ ${rule.level_3}时,如遇开13、14，大小单双赔率${rule.rate_2}倍.`)}
                        {line(`(4) 大小单双总注>${rule.level_3}时,如遇开13、14，大小单双赔率${rule.rate_3}倍.`)}
                        {line(`(5) 组合总注<=${ruleSpe.level_2}时,如遇开13、14，大小单双赔率${ruleSpe.rate_1}倍.`)}
                        {line(`(6) 组合单双总注${ruleSpe.level_2+1} ~ ${rule.level_3}时,如遇开13、14，大小单双赔率${ruleSpe.rate_2}倍.`)}
                        {line(`(7) 组合单双总注>${ruleSpe.level_3}时,如遇开13、14，大小单双赔率${ruleSpe.rate_3}倍.`)}
                    </View>
                </View>
            </ScrollView>
        )
    }
}

const line = (text)=><View><Text style={{fontSize: 15,lineHeight:28,color: '#454545'}}>{text}</Text></View>

const {height, width, paddingTop} = Common.window;

const styles = StyleSheet.create({
    container: {
        width: width,
        flexDirection: 'column',
        paddingTop: paddingTop,
        backgroundColor: '#F3F3F3',
    },
    content: {
        padding: 20,
        backgroundColor: 'white',
    },
    contentText:{
    },
    title: {
        paddingBottom: 20,
    },
});

export default connect()(RateExplain);

