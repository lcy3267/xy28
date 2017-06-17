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

class LineRecharge extends Component{
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
                        <Text style={{color: 'white'}}>提交充值信息</Text>
                    </View>
                    <View style={styles.inputView}>
                        <Text style={styles.inputLabel}>充值金额: </Text>
                        <TextInput
                            onChangeText={(v)=>{this.handleChange(v,'account_name')}}
                            underlineColorAndroid="transparent"
                            style={styles.myInput}/>
                    </View>
                    <View style={styles.inputView}>
                        <Text style={styles.inputLabel}>验证码: </Text>
                        <TextInput
                            onChangeText={(v)=>{this.handleChange(v,'account')}}
                            underlineColorAndroid="transparent"
                            style={styles.myInput}/>
                    </View>
                </View>
                <View style={{paddingLeft: 10,paddingRight: 10}}>
                    <Text style={styles.warnInfo}>*请提供有效的充值验证码</Text>
                    <Text style={styles.warnInfo}>*提交后5分钟之内到账</Text>
                    <Text style={styles.warnInfo}>*如有异常请联系客服</Text>
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
const {height, width, paddingTop} = Common.window;


const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
        backgroundColor: '#F5F5F9',
        paddingTop: paddingTop,
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
        zIndex: 999,
        left: (width-100)/2,
    },
    accountInfo: {
        height: 30,
        justifyContent: 'center',
        marginLeft: 20,
    },
    myInput: {
        width: width - 30,
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
        width: width-100,
        marginLeft: 50,
        marginTop: 20,
    }
});

const mapStateToProps = ({user}) => {
    return {user};
};

export default connect(mapStateToProps)(LineRecharge);

