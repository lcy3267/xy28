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

class SelectAlipayAccount extends Component{
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }

    render(){

        const {recharge: {collectionAccounts}} = this.props;
        const alipayAccounts = collectionAccounts.filter((account)=>account.type == 1);

        return (
            <View style={styles.container}>
                <List renderHeader={() => '支付宝账号'}>
                    {alipayAccounts.map((account, index)=>{
                        return (
                            <Item
                                key={index}
                                thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
                                arrow="horizontal"
                                onClick={() => {Actions.alipayRecharge({account})}}
                            >
                                <View style={{height: 30}}><Text>收款账号:    {account.account}</Text></View>
                                <View><Text>收款户名:    {account.account_name}</Text></View>
                            </Item>
                        );
                    })}

                </List>
            </View>
        )
    }
}

const pageHeight = Common.window.height;

const styles = StyleSheet.create({
    container: {
        width: Common.window.width,
        height: pageHeight,
        backgroundColor: '#F5F5F9',
        paddingTop: 64,
    },
    bottomView: {
        flex: 1, height: 60,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

const mapStateToProps = ({recharge}) => {
    return {recharge};
};

export default connect(mapStateToProps)(SelectAlipayAccount);

