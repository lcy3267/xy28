/**
 * Created by chengyuan on 2017/5/6.
 */
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
import { List, Button, Toast } from 'antd-mobile';
import Common from '../../common/index';

class SetWithdrawPwd extends Component{
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

        return (
            <ScrollView style={styles.container}>
                <View style={{backgroundColor: 'white',marginTop: 20, paddingBottom: 20}}>
                    <View style={styles.accountTitle}>
                        <Text style={{color: 'white'}}>提现密码</Text>
                    </View>
                    <View style={styles.inputView}>
                        <Text style={styles.inputLabel}>密码: </Text>
                        <TextInput
                            onChangeText={(v)=>{this.handleChange(v,'account_name')}}
                            underlineColorAndroid="transparent"
                            style={styles.myInput}/>
                    </View>
                    <View style={styles.inputView}>
                        <Text style={styles.inputLabel}>确认密码: </Text>
                        <TextInput
                            onChangeText={(v)=>{this.handleChange(v,'account_name')}}
                            underlineColorAndroid="transparent"
                            style={styles.myInput}/>
                    </View>
                </View>
                <View>
                    <Button type="primary" style={styles.commitButton}
                            onClick={this.doSubmit.bind(this)}
                    >设置</Button>
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

export default connect(mapStateToProps)(SetWithdrawPwd);

