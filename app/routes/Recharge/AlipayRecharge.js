import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Image,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'dva';
import { List, Button, Toast } from 'antd-mobile';
import Common from '../../common/index';

class AlipayRecharge extends Component{
    // 构造
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        // 初始状态
        this.state = {
            params: {
                user_id: this.props.user.info.user_id
            }
        };
    }

    handleChange(value,key){
        if(key == 'money') value = +value;
        let params = this.state.params;
        params[key] = value;
        this.setState({params});
    }

    doSubmit(){
        this.props.dispatch({
            type: 'recharge/doAlipayRecharge',
            params: this.state.params,
            callback: ()=>{
                Actions.pop();
                Toast.info('支付宝转账信息提交成功!');
            }
        });
    }

    render(){
        const {account} = this.props;

        return (
            <ScrollView style={styles.container}>
                <View style={{backgroundColor: 'white',marginTop: 20}}>
                    <View style={styles.accountTitle}>
                        <Text style={{color: 'white'}}>收款人信息</Text>
                    </View>
                    <View style={styles.accountInfo}>
                        <Text>收款账号: {account.account}</Text>
                    </View>
                    <View style={styles.accountInfo}>
                        <Text>收款户名: {account.account_name}</Text>
                    </View>
                </View>
                <View style={{backgroundColor: 'white',marginTop: 20}}>
                    <View style={styles.accountTitle}>
                        <Text style={{color: 'white'}}>转账信息</Text>
                    </View>
                    <View style={styles.inputView}>
                        <Text style={styles.inputLabel}>支付宝名称: </Text>
                        <TextInput
                            onChangeText={(v)=>{this.handleChange(v,'account_name')}}
                            underlineColorAndroid="transparent"
                            style={styles.myInput}/>
                    </View>
                    <View style={styles.inputView}>
                        <Text style={styles.inputLabel}>支付宝账号: </Text>
                        <TextInput
                            onChangeText={(v)=>{this.handleChange(v,'account')}}
                            underlineColorAndroid="transparent"
                            style={styles.myInput}/>
                    </View>
                    <View style={styles.inputView}>
                        <Text style={styles.inputLabel}>存款金额: </Text>
                        <TextInput
                            onChangeText={(v)=>{this.handleChange(v,'money')}}
                            underlineColorAndroid="transparent"
                            style={styles.myInput}/>
                    </View>
                </View>
                <View style={{paddingLeft: 10,paddingRight: 10}}>
                    <Text style={[styles.warnInfo,{marginTop: 15}]}>*请勿存入证书金额(样例 1000.32元、500.88元)
                        以免延误财务查收</Text>
                    <Text style={styles.warnInfo}>*转账完成后请保留单据作为核对证明</Text>
                    <Text style={styles.warnInfo}>*请确认填写转账金额与时间</Text>
                    <Text style={styles.warnInfo}>*每笔转账请提交一次</Text>
                </View>
                <View>
                    <Button type="primary" style={styles.commitButton}
                            onClick={this.doSubmit.bind(this)}
                    >提交</Button>
                </View>
            </ScrollView>
        )
    }
}

const pageHeight = Common.window.height;
const pageWidth = Common.window.width;

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
    },
    accountTitle: {
        width: 100,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        backgroundColor: '#7EB6EE',
        height: 24,
        top: -10,
        left: (pageWidth-100)/2,
    },
    accountInfo: {
        height: 30,
        justifyContent: 'center',
        marginLeft: 20,
    },
    myInput: {
        width: pageWidth - 30,
        height: 35,
        backgroundColor: 'white',
        padding: 0,
        marginTop: 6,
        borderColor: '#D6D6D6',
        borderWidth: 1,
        borderRadius: 5,
    },
    inputView: {
        height: 80,
        justifyContent: 'center',
        paddingLeft: 15,
    },
    inputLabel: {
        color: '#47B5F5'
    },
    warnInfo: {
        color: '#333333',
        fontSize: 12,
        marginTop: 5,
    },
    commitButton:{
        width: pageWidth-100,
        marginLeft: 50,
        marginTop: 20,
    }
});

const mapStateToProps = ({user}) => {
    return {user};
};

export default connect(mapStateToProps)(AlipayRecharge);

