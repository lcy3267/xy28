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
import md5 from 'blueimp-md5';
import {md5Key} from '../../config';


class SetWithdrawPwd extends Component{
    // 构造
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        // 初始状态
        this.state = {
        }
    }

    componentWillMount() {
    }

    handleChange(value,key){
        if(key == 'money') value = +value;
        let params = this.state.params;
        params[key] = value;
        this.setState({params});
    }

    doSubmit(){
        const {pwd, confirmPwd, oldPwd} = this.state;

        if(!oldPwd){
            Toast.info('请输入原密码', 2, null, false);
            return;
        }
        if(!pwd){
            Toast.info('请输入密码', 2, null, false);
            return;
        }
        if(pwd != confirmPwd){
            Toast.info('确认密码错误,请重新输入', 2, null, false);
            return;
        }

        this.props.dispatch({
            type: 'user/updateLoginPwd',
            params: {
                pwd: md5(md5Key+pwd),
                oldPwd: md5(md5Key+oldPwd)
            },
            callback: ()=>{
                Actions.pop();
                Toast.info('密码修改成功!');
            },
            errCallback: (rs)=>{
                if(rs.err_code == 201){
                    Toast.info('原密码错误,请重新输入', 2, null, false);
                }
            }
        });
        
    }

    render(){

        const { user: { isSetWithdrawPwd } } = this.props;

        if(isSetWithdrawPwd == undefined) return null;

        return (
            <ScrollView style={styles.container}>
                <View style={{backgroundColor: 'white',marginTop: 20, paddingBottom: 20}}>
                    <View style={styles.inputView}>
                        <Text style={styles.inputLabel}>原密码: </Text>
                        <TextInput
                            onChangeText={(v)=>{this.setState({oldPwd: v})}}
                            underlineColorAndroid="transparent" secureTextEntry={true}
                            style={styles.myInput}/>
                    </View>
                    <View style={styles.inputView}>
                        <Text style={styles.inputLabel}>密码: </Text>
                        <TextInput
                            onChangeText={(v)=>{this.setState({pwd: v})}}
                            underlineColorAndroid="transparent" secureTextEntry={true}
                            style={styles.myInput}/>
                    </View>
                    <View style={styles.inputView}>
                        <Text style={styles.inputLabel}>确认密码: </Text>
                        <TextInput
                            onChangeText={(v)=>{this.setState({confirmPwd: v})}}
                            underlineColorAndroid="transparent" secureTextEntry={true}
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
        width: width-100,
        marginLeft: 50,
        marginTop: 20,
    }
});

const mapStateToProps = ({user}) => {
    return {user};
};

export default connect(mapStateToProps)(SetWithdrawPwd);

