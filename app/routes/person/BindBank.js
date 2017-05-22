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
    TextInput,
    Image,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'dva';
import { List, Button, Toast, Picker } from 'antd-mobile';
import Common from '../../common/index';

class BindBank extends Component{
    // 构造
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        // 初始状态
        this.state = {
            params: {
                userName: undefined,
                bankName: undefined,
                bankAccount: undefined,
                bankAddress: undefined,
                password: undefined,
            }
        };
    }

    handleChange(value,key){
        let params = this.state.params;
        params[key] = value;
        this.setState({params});
    }

    doSubmit(){
        let isOk = true;
        let params = this.state.params;
        for(let k of Object.keys(params)) {
            if(!params[k]) {
                Toast.info('请将信息补充完整!!');
                isOk = false;
                break;
            };
        }
        if(isOk){
            this.props.dispatch({
                type: 'user/bindBank',
                params,
                callback: (rs)=>{
                    if(rs !== 'error'){
                        Toast.info('银行卡信息已提交!!');
                        Actions.pop();
                    }
                }
            });
        }

    }

    render(){

        const values =  [
            {
                label: '中国农业银行',
                value: '中国农业银行',
            },{
                label: '中国建设银行',
                value: '中国建设银行',
            },{
                label: '中国工商银行',
                value: '中国工商银行',
            },{
                label: '中国银行',
                value: '中国银行',
            },{
                label: '中国交通银行',
                value: '中国交通银行',
            },{
                label: '中国邮政储蓄银行',
                value: '中国邮政储蓄银行',
            },
        ]

        return (
            <ScrollView style={styles.container}>
                <View style={{backgroundColor: 'white',marginTop: 20, paddingBottom: 20}}>
                    <View style={styles.accountTitle}>
                        <Text style={{color: 'white'}}>银行信息</Text>
                    </View>
                    <View style={styles.inputView}>
                        <Text style={styles.inputLabel}>开户姓名: </Text>
                        <TextInput
                            onChangeText={(v)=>{this.handleChange(v,'userName')}}
                            underlineColorAndroid="transparent"
                            style={styles.myInput}/>
                    </View>
                    <View style={styles.inputView}>
                        <Text style={styles.inputLabel}>银行名称: </Text>
                        <Picker
                            value={this.state.params.bankName}
                            onChange={(v)=>{this.handleChange(v,'bankName')}}
                            data={values} cols={1}>
                            <List.Item
                                arrow="horizontal"
                                style={{paddingLeft: 0}}>
                                <Text>选择银行卡类型</Text>
                            </List.Item>
                        </Picker>
                    </View>
                    <View style={styles.inputView}>
                        <Text style={styles.inputLabel}>开户账号: </Text>
                        <TextInput
                            onChangeText={(v)=>{this.handleChange(v,'bankAccount')}}
                            underlineColorAndroid="transparent"
                            style={styles.myInput}/>
                    </View>
                    <View style={styles.inputView}>
                        <Text style={styles.inputLabel}>开户地址: </Text>
                        <TextInput
                            onChangeText={(v)=>{this.handleChange(v,'bankAddress')}}
                            underlineColorAndroid="transparent"
                            style={styles.myInput}/>
                    </View>
                    <View style={styles.inputView}>
                        <Text style={styles.inputLabel}>提现密码: </Text>
                        <TextInput
                            onChangeText={(v)=>{this.handleChange(v,'password')}}
                            underlineColorAndroid="transparent"
                            style={styles.myInput}/>
                    </View>
                </View>
                <View>
                    <Button type="primary" style={styles.commitButton}
                            onClick={this.doSubmit.bind(this)}
                    >绑定</Button>
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
        height: 65,
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

export default connect(mapStateToProps)(BindBank);

