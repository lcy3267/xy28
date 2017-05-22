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
import { List, Toast } from 'antd-mobile';
import Common from '../../common/index';
const Item = List.Item;

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
                        <Image source={{uri: 'https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png'}}
                               style={{width: 68,height: 68}}
                        />
                    </View>
                    <View style={{flex: 3,justifyContent: 'center'}}>
                        <Text style={{height: 25}}>钱包余额</Text>
                        <Text>{user.info.integral} 元宝</Text>
                    </View>
                </View>
                <List>
                    <Item
                        thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
                        arrow="horizontal"
                        onClick={Actions.myBankCard}
                    >我的银行卡</Item>
                    <Item
                        onClick={() => {}}
                        thumb="https://zos.alipayobjects.com/rmsportal/UmbJMbWOejVOpxe.png" arrow="horizontal"
                    >充值</Item>
                    <Item
                        thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
                        arrow="horizontal"
                        onClick={() => {}}
                    >提现</Item>
                    <Item
                        onClick={() => {}}
                        thumb="https://zos.alipayobjects.com/rmsportal/UmbJMbWOejVOpxe.png" arrow="horizontal"
                    >充值记录</Item>
                    <Item
                        thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
                        arrow="horizontal"
                        onClick={() => {}}
                    >提现记录</Item>
                </List>
            </View>
        )
    }
}

const pageHeight = Common.window.height;

const styles = StyleSheet.create({
    container: {
        paddingTop: 65,
        width: Common.window.width,
        height: pageHeight,
        backgroundColor: '#F5F5F9'
    },
});

const mapStateToProps = ({user}) => {
    return {user};
};

export default connect(mapStateToProps)(Wallet);

