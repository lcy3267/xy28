/**
 * Created by chengyuan on 2017/5/6.
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Image
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'dva/mobile';
import Icon from 'react-native-vector-icons/Ionicons';
import { List, Toast } from 'antd-mobile';
import Common from '../../common/index';
const Item = List.Item;
const {MyIcon} = Common;

class Wallet extends Component{
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }

    render(){

        let {user} = this.props;

        return (
            <View style={styles.container}>
                <View style={{flexDirection: 'row',padding: 10,backgroundColor: 'white',marginBottom: 20}}>
                    <View style={{flex: 1}}>
                        <View style={{width: 60,height: 60, borderRadius: 30,
                backgroundColor: '#38A9ED',alignItems: 'center',justifyContent:'center'}}>
                            <Icon name='ios-briefcase' color='white' size={40}/>
                        </View>
                    </View>
                    <View style={{flex: 3,justifyContent: 'center'}}>
                        <Text style={{height: 25}}>钱包余额</Text>
                        <Text>{user.info.integral} 元宝</Text>
                    </View>
                </View>
                <List>
                    <Item
                        thumb={MyIcon('#213C7F','md-card')}
                        arrow="horizontal"
                        onClick={Actions.myBankCard}
                    >我的银行卡</Item>
                    <Item
                        arrow="horizontal"
                        onClick={()=>{Actions.recharge({from: 'wallet'})}}
                        thumb={MyIcon('red','md-archive')}
                    >充值</Item>
                    <Item
                        thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
                        arrow="horizontal"
                        onClick={Actions.withdraw}
                    >提现</Item>
                    <Item
                        arrow="horizontal"
                        onClick={Actions.rechargeRecord}
                        thumb={MyIcon('#FC3D39','ios-pulse')}
                    >充值记录</Item>
                    <Item
                        thumb={MyIcon('#FDA951','ios-pulse')}
                        arrow="horizontal"
                        onClick={Actions.withdrawRecord}
                    >提现记录</Item>
                </List>
            </View>
        )
    }
}

const {height, width, paddingTop} = Common.window;

const styles = StyleSheet.create({
    container: {
        paddingTop: paddingTop,
        width: width,
        height: height,
        backgroundColor: '#F5F5F9'
    },
});

const mapStateToProps = ({user}) => {
    return {user};
};

export default connect(mapStateToProps)(Wallet);

