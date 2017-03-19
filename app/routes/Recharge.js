/**
 * Created by chengyuan on 2017/3/11.
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'dva/mobile';
import { List, Button } from 'antd-mobile';
import Common from '../common/index';
const Item = List.Item;

class Recharge extends Component{
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }

    render(){
        return (
            <View style={styles.container}>
                <List renderHeader={() => '线上充值'}>
                    <Item
                        thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
                        arrow="horizontal"
                        onClick={() => {}}
                    >支付宝</Item>
                    <Item
                        onClick={() => {}}
                        thumb="https://zos.alipayobjects.com/rmsportal/UmbJMbWOejVOpxe.png" arrow="horizontal"
                    >微信</Item>
                    <View style={{width: '100%',justifyContent: 'center',alignItems: 'center',height: 50}}>
                        <Button type="primary" inline size="small" style={{width: 150,height: 30}}>
                            <Text>去支付</Text>
                        </Button>
                    </View>
                </List>
                <List renderHeader={() => '线下充值'}>
                    <Item
                        thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
                        arrow="horizontal"
                        onClick={() => {}}
                    >支付宝转账</Item>
                    <Item
                        onClick={() => {}}
                        thumb="https://zos.alipayobjects.com/rmsportal/UmbJMbWOejVOpxe.png" arrow="horizontal"
                    >银行转账</Item>
                </List>

                <View style={{flexDirection: 'row'}}>
                    <View style={styles.bottomView}>
                        <Button type="ghost" inline size="small" style={{width: 100,height: 35}}>
                            <Text>查看转账记录</Text>
                        </Button>
                    </View>
                    <View style={styles.bottomView}>
                        <Button type="ghost" inline size="small" style={{width: 100,height: 35}}>
                            <Text>联系客服</Text>
                        </Button>
                    </View>
                </View>
            </View>
        )
    }
}

const pageHeight = Common.window.height - 50;

const styles = StyleSheet.create({
    container: {
        width: Common.window.width,
        height: pageHeight,
        backgroundColor: '#F5F5F9'
    },
    bottomView: {
        flex: 1, height: 60,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

const mapStateToProps = (user) => {
    return {user};
};

export default connect(mapStateToProps)(Recharge);

