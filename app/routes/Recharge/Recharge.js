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
import { connect } from 'dva';
import { List, Button } from 'antd-mobile';
import Common from '../../common/index';
const Item = List.Item;
const {height, width, paddingTop} = Common.window;
const {MyIcon} = Common;


class Recharge extends Component{
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }

    componentDidMount() {
        this.props.dispatch({type: 'recharge/getCollectionAccounts'});
    }

    render(){
        const {from} = this.props;

        return (
            <View style={[styles.container,{height: from?height:height-50,paddingTop:from?paddingTop:0}]}>
                <List renderHeader={() => '线上充值'}>
                    <Item
                        thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
                        arrow="horizontal"
                        onClick={Actions.lineRecharge}
                    >支付宝</Item>
                    <Item
                        onClick={Actions.lineRecharge}
                        thumb={MyIcon('#71CA58','ios-chatbubbles')}
                        arrow="horizontal"
                    >微信</Item>
                </List>
                <List renderHeader={() => '线下充值'}>
                    <Item
                        thumb={MyIcon('#38A9ED','md-card')}
                        arrow="horizontal"
                        onClick={() => {Actions.selectAlipayAccount()}}
                    >支付宝转账</Item>
                    <Item
                        onClick={() => {}}
                        thumb={MyIcon('#213C7F','md-card')}
                    >银行转账</Item>
                </List>

                <View style={{flexDirection: 'row'}}>
                    <View style={styles.bottomView}>
                        <Button type="ghost" inline size="small" style={{width: 100,height: 35}}>
                            <Text>查看转账记录</Text>
                        </Button>
                    </View>
                    <View style={styles.bottomView}>

                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: width,
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

