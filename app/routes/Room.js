/**
 * Created by chengyuan on 2017/3/5.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    ListView,
    Platform,
    TextInput,
    KeyboardAvoidingView
} from 'react-native';
import SocketIOClient from "socket.io-client";
import { Actions } from 'react-native-router-flux';
import { connect } from 'dva/mobile';
import { Carousel, Button, Popup, Grid, Toast } from 'antd-mobile';
import Common from '../common/index';
import config from '../config';

const pageHeight = Common.window.height;

const showToastNoMask = (message) =>{
    Toast.info(message, 2, null, false);
}

class Room extends Component{
    // 构造
    constructor(props) {
        super(props);
        this.leftMassageView = this.leftMassageView.bind(this);
        this.firstDom = this.firstDom.bind(this);
        this.loadEnd = this.loadEnd.bind(this);
        this.showPourList = this.showPourList.bind(this);
        this.sendMessage = this.sendMessage.bind(this);

        let messages = [];

        for (let i = 0; i < 13; i++){
            //messages.push(this.getData());
        }

        // 初始状态
        this.state = {
            lottery: {}, //上期开奖
            times: this.getSecond(),
            messages: messages,
            dataSource: new ListView.DataSource({
                rowHasChanged: (p1, p2) => p1 !== p2,
            }),
        };
    }

    componentWillMount() {
        let {user,roomId} = this.props;
        if(!user.info){
            showToastNoMask('请先进行登录');
            Actions.pop();
            return;
        }
        Toast.loading('加载中...',10);
        //获取开奖时间
        this.timer = setInterval(()=>{
            this.setState({times: this.getSecond()})
        },500);
        //链接房间
        this.socket = SocketIOClient(config.socketDomain, {jsonp: false});

        this.socket.emit("login", {user: user.info,roomId: roomId});
        
        //监听用户加入房间
        this.socket.on('login', (data) => {
            let {joinUser,lotteryRs} = data;
            if(joinUser.user_id == user.info.user_id){
                this.setState({lottery: lotteryRs},()=>{
                    Toast.hide();
                });
            }
        });

        // 监听下注信息
        this.socket.on('bet', (bet) => {
            let messages = this.state.messages;
            messages.push(bet);
            this.setState({messages});
        });
    }

    componentWillUnmount() {
        this.socket && this.socket.disconnect();
        // 如果存在this.timer，则使用clearTimeout清空。
        // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
        this.timer && clearTimeout(this.timer);
    }

    loadEnd(){
        this.refs.mylistView.scrollToEnd();
    }

    getSecond(){
        var myDate = new Date();

        let currentMinute = myDate.getMinutes(); //当前分钟数
        let currentSecond = myDate.getSeconds(); // 当前秒数

        let single = currentMinute%10; //个位分分钟数
        let next = single >= 5?10:5;

        let minute = next - single -1;
        let second = 60 - currentSecond -1;


        return {minute,second};
    }

    showPourList(){
        const onMaskClose = () => {
        };
        let option = {
            animationType: 'slide-up',
            maskClosable: true,
            onMaskClose,
        };
        Popup.show(<PopupContent bottomPour={this.bottomPour.bind(this)} {...this.props}/>,option);
    }

    //下注
    bottomPour(betType,betMoney){
        if(!betType) return showToastNoMask('请选择下注类型');
        if(!betMoney) return showToastNoMask('请输入下注金额');
        this.sendMessage({betType,betMoney});
        Popup.hide();
    }

    //发送消息
    sendMessage({betType,betMoney}){
        let {user} = this.props;
        let lottery = this.state.lottery;
        var bet = {
            user: user.info,
            type: betType,
            money: betMoney,
            number: null,
            serial_number: lottery.serial_number+1
        };
        this.socket.emit('bet', bet);
    }

    render(){
        let lottery = this.state.lottery;
        let messages = this.state.messages;
        return (
           <View style={styles.container}>
               {this.firstDom(lottery)}
               {this.secondDom(lottery)}
               <KeyboardAvoidingView behavior="padding" style={{flex: 1,flexDirection:'column'}}>
                   <View style={{flex: 1}}>
                       {messages.length>0?<ListView
                           ref='mylistView'
                           dataSource={this.state.dataSource.cloneWithRows(messages)}
                           renderRow={this._renderRow.bind(this)}
                           style={{width: '100%',height: '100%'}}
                       />:null}

                   </View>
                   <View style={{height: 50,backgroundColor: '#E9E9E9',flexDirection: 'row'}}>
                       <View style={{width: 80,height: '100%', justifyContent: 'center',alignItems: 'center'}}>
                           <Button
                               onClick={this.showPourList}
                               type="primary" style={{width: 62,height: 32,borderRadius: 4}}>
                               <Text style={{fontSize: 14,width: '100%'}}>下注</Text>
                           </Button>
                       </View>
                       <View style={{flex: 1,height: '100%',justifyContent: 'center',
                                    alignItems: 'center',paddingLeft: 10,paddingRight: 10}}>
                           <TextInput
                                style={{height: 35, backgroundColor: 'white', width: '100%'}}
                                onChangeText={(text) => this.setState({text})}
                                value={this.state.text}
                            />
                       </View>
                   </View>
               </KeyboardAvoidingView>
           </View>
        )
    }

    firstDom(lottery){
        let times = this.state.times;
        return (
            <View style={{backgroundColor: '#45A2FF',height: 64,flexDirection: 'row'}}>
                <View style={{flex: 1, justifyContent: 'center',alignItems: 'center'}}>
                    <Text style={{color: 'white', fontSize: 13}}>距离 {lottery.serial_number+1} 期截止</Text>
                    <Text style={{color: 'white', fontSize: 18,marginTop: 4}}>{times.minute} 分 {times.second}秒</Text>
                </View>
                <View style={{flex: 1, alignItems: 'center',flexDirection: 'row'}}>
                    <View style={{width: 1,height: '68%',backgroundColor: 'white'}} />
                    <View style={{marginLeft: 40}}><Text style={{color: 'white'}}>哈哈哈哈哈哈</Text></View>
                </View>
            </View>
        );
    }

    secondDom(lottery){
        let result = `${lottery.one} + ${lottery.two} + ${lottery.third} = ${lottery.sum} `;
        let hasMax = '大';
        let hasDouble = '单';
        if(lottery.sum <= 13){
            hasMax = '小'
        }
        if(lottery.sum % 2 == 0){
            hasDouble = '双'
        }
        return (
            <View style={{height: 35,backgroundColor: 'white', alignItems: 'center',
               paddingLeft: 12,borderBottomWidth: 1, borderBottomColor: '#DEDEDE',flexDirection: 'row'}}>
                <Text>第  <Text style={styles.number}>{lottery.serial_number}</Text>  期</Text>
                <Text style={[styles.number,{marginLeft: 20}]}>{lottery.one || lottery.one == 0?`${result}(${hasMax},${hasDouble},${hasMax+hasDouble})`:'加载中'}</Text>
            </View>
        );
    }

    _renderRow(bet){
        let {user} = this.props;
        return(
            <View onLayout={()=>{
                if(this.state.messages.length > 5){
                    this.loadEnd();
                }
            }}>
                {bet.user.user_id !== user.info.user_id?this.leftMassageView(bet):this.leftMassageView(bet)}
            </View>
        )
    }


    leftMassageView(bet){
        return (
            <View style={styles.item}>
                <View>
                    <TouchableOpacity style={styles.imageView}>
                        <Image style={styles.itemImage} source={require('../asset/th.jpg')}/>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection: 'column',width: 220}}>
                    <View style={{height: 15,paddingLeft: 0}}>
                        <Text style={{fontSize: 12}}>{bet.user.name}</Text>
                    </View>
                    <View style={{backgroundColor: '#F16B00',flexDirection: 'column',borderRadius: 5,padding: 8}}>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{flex: 1}}>
                                <Text style={{color: 'white'}}>{bet.serial_number}期</Text>
                            </View>
                            <View style={{flex: 1}}>
                                <Text style={{color: 'white'}}>投注类型: {formatRule(bet.type)}</Text>
                            </View>
                        </View>
                        <View style={{marginTop: 5}}>
                            <Text style={{color: 'white'}}>金额: {bet.money}元宝</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    rightMassageView(data){
        let {userInfo} = this.props;
        let user = userInfo.user;
        let myHead = user.avatar_url?user.avatar_url:user.avatar_picture_url?user.avatar_picture_url:defaultHead;
        return (
            <View style={[styles.item,{justifyContent:'flex-end'}]}>
                <View style={styles.itemContentView}>
                    <View style={[styles.itemContent,{backgroundColor:'#2d343a',right:-12}]}>
                        <Text style={[styles.itemContentText,{color:'white'}]}>{data.content}</Text>
                    </View>
                    <View style={styles.grayAngle}>
                        <Image style={styles.grayAngleImage} source={require('../asset/blackAngle.png')}/>
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.imageView}
                    onPress={()=>{
                        this._goToPersonCenter(data)
                    }}
                >
                    <Image style={styles.itemImage} source={{uri:myHead}}/>
                </TouchableOpacity>
            </View>
        )
    }
}

class PopupContent extends Component {

    // 构造
    constructor(props) {
        super(props);
        this.moneyChange = this.moneyChange.bind(this);
        // 初始状态
        this.state = {};
    }

    bottomPour(){
        this.props.bottomPour(this.state.betType,this.state.betMoney);
    }

    moneyChange(betMoney){
        this.setState({betMoney});
    }

    updatePosition(hasPosition){
        this.setState({hasPosition});
    }

    render() {
        let {rules} = this.props.gameRules;

        let firstRules = rules.filter((rule)=>rule.type != -1);

        let centerStyle = {alignItems: 'center',justifyContent: 'center'};

        return (
            <View behavior='position:100' style={{backgroundColor: '#48B0FF',paddingBottom:this.state.hasPosition?220:0}}>
                <View style={[{height: 50},centerStyle]}>
                    <Text style={{color: 'white'}}>大小单双</Text>
                </View>
                <View style={{height: 100,flexDirection: 'row',flexWrap: 'wrap'}}>
                    {firstRules.map((rule,i)=>{
                        return (
                            <View key={i} style={{width: '20%',height: 50,paddingHorizontal: 20}}>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={()=>{this.setState({selectRule:i,betType:rule.type})}}
                                    style={[i == this.state.selectRule ?
                                        {borderWidth: 1,borderColor: 'white'} : null,centerStyle]}>
                                    <Text style={{color: 'white'}}>{formatRule(rule.type)}</Text>
                                    <Text style={{color: 'white'}}>1:{rule.rate}</Text>
                                </TouchableOpacity>
                            </View>
                        );
                    })}
                </View>
                <View style={[{flexDirection: 'row', height: 40,justifyContent: 'space-between',paddingHorizontal: 20}]}>
                    <Button size="small" type="ghost" style={{borderRadius: 4,height: 30,borderColor: 'white'}}>
                        <Text style={{color: 'white',}}>赔率说明</Text>
                    </Button>
                    <Button
                        onClick={()=>{this.moneyChange(10+'')}}
                        size="small" style={[styles.ruleButton,{marginLeft: 90}]}>
                        <Text style={{color: 'black'}}>最小投注</Text>
                    </Button>
                    <Button
                        onClick={()=>{this.moneyChange(this.state.betMoney*2+'')}}
                        size="small" style={styles.ruleButton}>
                        <Text style={{color: 'black'}}>双倍投注</Text>
                    </Button>
                </View>
                <View style={[{flexDirection: 'row',height: 40,justifyContent: 'space-between',paddingHorizontal: 20}]}>
                    <Text style={{height: 30,textAlign: 'center',marginTop: 3}}>投注金额:</Text>
                    <TextInput
                        onFocus={this.updatePosition.bind(this,true)}
                        onBlur={this.updatePosition.bind(this,false)}
                        keyboardType="numeric"
                        value={this.state.betMoney}
                        onChangeText={this.moneyChange}
                        style={{width: '50%',backgroundColor: 'white',height: 30}}/>
                    <Button
                        onClick={this.bottomPour.bind(this)}
                        size="small" style={[styles.ruleButton,{backgroundColor: 'red',width: 60,borderWidth: 0}]}>
                        <Text style={{color: 'white'}}>投注</Text>
                    </Button>
                </View>
            </View>
        );
    }
}

function formatRule(type){
    let str = ['大','小','单','双','大单','大双','小单','小双','极大','极小'];
    return str[type-1];
}

const styles = StyleSheet.create({
    container: {
        width: Common.window.width,
        height: pageHeight,
        flexDirection: 'column',
        paddingTop: 64,
    },
    card: {
        flex: 1,
        borderWidth: 3,
        borderColor: '#F8592C',
        margin: 8,
        marginTop: 5,
        marginBottom: 5,
        borderRadius: 5,
    },
    sceneStyle: {
        backgroundColor: 'black'
    },
    titleStyle: {
        backgroundColor: 'black'
    },
    number: {
        fontSize:15, color: '#6DB1EA', fontWeight: '500'
    },
    item:{
        flexDirection: 'row',
        paddingTop: 8,
        paddingBottom: 8,
        width: '100%'
    },
    imageView: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: 66,
    },
    itemImage: {
        width: 44,
        height: 44,
        borderRadius: 22,
        marginBottom: 6,
    },
    itemContentView: {
        flexDirection: 'row',
    },
    grayAngle: {
        justifyContent: 'flex-end',
        zIndex:99,
    },
    grayAngleImage: {
        width:20,
        height: 24,
        bottom: -1,
    },
    itemContent: {
        maxWidth: Common.window.width-164,
        backgroundColor: '#e6e6e6',
        borderRadius: 4,
        padding: 10,
        justifyContent: 'center'
    },
    itemContentText: {
        fontSize: 12,
        color: 'white',
    },
    massageContent: {
        flex: 1,
    },
    massageView: {
        flexDirection: 'row',
        height: 50,
        backgroundColor: '#e6e6e6',
        alignItems: 'center'
    },
    massageInputView: {
        flex: 1,
    },
    massageInput: {
        marginLeft: 22,
        height: 33,
        borderWidth: 2,
        borderColor: 'white',
        backgroundColor: 'white',
        borderRadius: 3,
        padding: 0,
        paddingLeft: 10,
        fontSize: 12,
    },
    massageSendView: {
        width: 54,
        alignItems: 'center'
    },
    massageSendButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'white',
        borderColor: '#ddd',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ruleButton: {
        backgroundColor: 'white',borderRadius: 4,
        height: 30,
    }
});

const mapStateToProps = ({gameRules,user}) => {
    return {gameRules,user};
};

export default connect(mapStateToProps)(Room);