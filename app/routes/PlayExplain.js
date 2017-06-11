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

class PlayExplain extends Component{
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            info: {},
        };
    }

    componentWillMount() {
    }

    render(){
        const {infoType} = this.props;

        console.log(infoType,'-=======')

        return (
            <ScrollView style={styles.container}>
                {infoType == 1?
                    <View style={styles.content}>
                        <View style={styles.title}>
                            <Text style={{fontSize: 20, color: '#CE6C87'}}>北京玩法说明</Text>
                        </View>
                        <View>
                            {line('北京28采用北京快乐8数据(09:00~23:55):')}
                            {line('北京快乐28开奖结果来源于国家福利彩票北京快乐8开奖号码,每5分钟一期,不停开奖。')}
                            {line('北京快乐8煤气开奖共开出20个号码,并按照从小到大的顺序依次排列。')}
                            {line('取其1-6位开奖号码并进行相加,和值的末位数作为幸运28开奖的第一位数值。')}
                            {line('取其7-12位开奖号码并进行相加,和值的末位数作为幸运28开奖的第二位数值。')}
                            {line('取其13-18位开奖号码并进行相加,和值的末位数作为幸运28开奖的第三位数值。')}
                            {line('将三位数值进行相加,得到的结果即为幸运28的开奖结果。')}
                        </View>
                    </View>:
                    <View style={styles.content}>
                        <View style={styles.title}>
                            <Text style={{fontSize: 20, color: '#CE6C87'}}>加拿大28玩法说明</Text>
                        </View>
                        <View>
                            {line('加拿大28数据(21:00~次日20:00)为正常销售时间,20:00~21:00(大约)为系统维护时间,具体情况依据加拿大28官网开售时间为准:')}
                            {line('加拿大28开奖结果来源于加拿大福利彩票的加拿大幸运28开奖结果。')}
                            {line('加拿大28每期开奖共开出20个号码,并按照从小到大的顺序依次排列:')}
                            {line('取其2、5、8、11、14、17位数进行相加,和值的末位作为幸运28的开奖的第一位数;')}
                            {line('取其3、6、9、12、15、18位数进行相加,和值的末位作为幸运28的开奖的第二位数;')}
                            {line('取其4、7、10、13、16、19位数进行相加,和值的末位作为幸运28的开奖的第三位数;')}
                            {line('将三位数值进行相加,得到的结果即为幸运28的开奖结果。')}
                            {line('幸运28玩法:')}
                            {line('28个号码,抽中即可或得奖励.玩法类型共有一下玩法:')}
                            {line('1、大,小,单,双')}
                            {line('2、小单,小双,大单,大双')}
                            {line('3、极小值(0-5),极大值(22-27)')}
                            {line('4、28个号码定位')}
                        </View>
                    </View>}

            </ScrollView>
        )
    }
}

const line = (text)=><View><Text style={{fontSize: 15,lineHeight:28,color: '#454545'}}>{text}</Text></View>

const {height, width, paddingTop} = Common.window;

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
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

export default connect()(PlayExplain);

