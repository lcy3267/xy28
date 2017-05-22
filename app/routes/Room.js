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
    KeyboardAvoidingView,
} from 'react-native';
import SocketIOClient from "socket.io-client";
import { Actions } from 'react-native-router-flux';
import { connect } from 'dva/mobile';
import { Carousel, Button, Popup, Grid, Toast, Tabs } from 'antd-mobile';
import Common from '../common/index';
import config,{ combineRates } from '../config';
import { formatDate, GetDateStr } from '../common/FormatUtil'

const pageHeight = Common.window.height;
const pageWidth = Common.window.width;
const TabPane = Tabs.TabPane;


const showToastNoMask = (message) =>{
    Toast.info(message, 2, null, false);
}

class Room extends Component{
    // 构造
    constructor(props) {
        super(props);
        this.firstDom = this.firstDom.bind(this);
        this.loadEnd = this.loadEnd.bind(this);
        this.showPourList = this.showPourList.bind(this);
        this.doBottomPour = this.doBottomPour.bind(this);
        this.loadRoomGameRules = this.loadRoomGameRules.bind(this);

        let {roomId, roomType, isSpeak} = this.props;

        this.roomId = roomId;
        this.roomType = roomType;
        //是否允许发言
        this.is_speak = isSpeak;

        // 初始状态
        this.state = {
            lottery: {}, //上期开奖
            integral: 0,
            overTimes: null,
            messages: [],//type: 0 用户发言, -1:系统消息, 1~10:下注
            opening: false,
            dataSource: new ListView.DataSource({
                rowHasChanged: (p1, p2) => p1 !== p2,
            }),
        };
    }

    componentWillMount() {
        let {user, dispatch, is_speak} = this.props;
        if(!user.info){
            showToastNoMask('请先进行登录');
            Actions.pop();
            return;
        }

        Toast.loading('加载中...',15);

        //加载5条下注记录
        dispatch({type: 'bet/records'});

        //加载赔率规则
        this.loadRoomGameRules();

        const namespace = this.roomType == 1?'/bj':'/cnd';

        //链接房间
        this.socket = SocketIOClient(config.apiDomain+namespace, {jsonp: false});

        let login = ()=>{
            this.socket.emit("login", {user: user.info,roomId: this.roomId, roomType: this.roomType});
        }
        login();

        //监听用户加入房间
        this.socket.on('login', (data) => {
            Toast.hide();
            let {joinUser, lotteryRs, integral, opening} = data;
            if(joinUser.user_id == user.info.user_id){
                let serial_number = +lotteryRs.serial_number;
                this.setState({lottery: lotteryRs, serial_number, integral, opening},()=>{
                    Toast.hide();
                });
            }
        });

        // 监听下注信息
        this.socket.on('bet', (result) => {
            let messages = this.state.messages;
            messages.push(result.bet);
            this.setState({messages});
        });

        // 监听聊天
        this.socket.on('msg', (result) => {
            const {msg} = result;
            let messages = this.state.messages;
            if(msg.err_code == 0){
                messages.push(msg);

            }else if(msg.err_code == -1){
                let sysMsg = {
                    type: -1,
                    content: '您已经被管理员禁言'
                }
                messages.push(sysMsg);
            }
            this.setState({messages});

        });

        // 监听开奖结果
        this.socket.on('openResult', (result) => {
            const lottery = result.lotteryRs;
            this.setState({lottery, serial_number: +lottery.serial_number});
        });

        this.socket.on('updateStatus', (result) => {
            let time = result.time;
            let minute = Math.floor(time/60);
            let second = time%60;
            this.setState({opening: result.opening, overTimes: {minute, second}});
        });

        this.socket.on('updateIntegral', (data)=>{
            this.setState({integral: data.integral});
            if(data.winIntegral){
                this.setState({winIntegral: data.winIntegral});
            }
        });

        //监听赔率变动
        this.socket.on('updateRules', (rule)=>{
            Toast.info('管理修改了赔率设置!!', 4);
            dispatch({type: 'gameRules/list'});
        });

        //心跳包
        this.palpitationTimer = setInterval(()=>{
            this.socket.emit("palpitation");
        },2000);

        this.socket.on('palpitation', (data)=>{
            let { result } = data;
            if(result != 'success'){
                login();
            }
        });
    }

    loadRoomGameRules(){
        //获取赔率
        this.props.dispatch({
            type: 'gameRules/roomGameRule',
            params: {
                roomId: this.roomId,
            },
            callback: (gameRules)=>{
                this.setState({ gameRules });
            }
        });
    }

    componentWillUnmount() {
        this.socket && this.socket.disconnect();
        // 如果存在this.timer，则使用clearTimeout清空。
        // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
        this.timer && clearTimeout(this.timer);
        this.palpitationTimer && clearTimeout(this.palpitationTimer);
    }

    loadEnd(){
        this.refs.mylistView.scrollToEnd();
    }

    getBjOpenTime = ()=>{
        var myDate = new Date();

        let currentMinute = myDate.getMinutes(); //当前分钟数
        let currentSecond = myDate.getSeconds(); // 当前秒数

        let single = currentMinute%10; //个位分分钟数
        let next = single >= 5?10:5;

        let minute = next - single -1;
        let second = 60 - currentSecond -1;

        this.setState({time: {minute,second}});
    }

    showPourList(){
        const onMaskClose = () => {
            return false;
        };
        let option = {
            animationType: 'slide-up',
            maskClosable: true,
            onMaskClose,
        };
        Popup.show(<PopupContent bottomPour={this.bottomPour.bind(this)} {...this.props} gameRules={this.state.gameRules}/>,option);
    }

    //下注
    bottomPour(betType, betMoney, playType){
        if(!betType){
            alert('请选择下注类型');
            return false
        };
        if(!betMoney){
            alert('请输入下注金额');
            return false;
        };
        this.doBottomPour({betType, betMoney, playType});
        Popup.hide();
    }

    //下注
    doBottomPour({betType,betMoney,playType}){
        if(this.state.opening) return;
        let {user: {info}} = this.props;
        var bet = {
            user: getSendUser(info),
            playType,
            type: playType == 1 ? betType : null,
            money: betMoney,
            number: playType == 2 ? betType : null,
            serial_number: this.state.serial_number+1
        };
        this.socket.emit('bet', bet);
    }

    sendMessage(e){

        if(this.is_speak == -1) {
            showToastNoMask('该房间已被禁言!');
            return;
        }

        let msg = e.nativeEvent.text;
        if(msg){
            let {user: {info}} = this.props;
            const item = {
                type: 0,
                user: getSendUser(info),
                content: msg
            }
            this.socket.emit('msg', {msg: item});
            this.setState({text: null});
        }
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
                               disabled={this.state.opening}
                               onClick={this.showPourList}
                               type="primary" style={{width: 62,height: 32,borderRadius: 4}}>
                               <Text style={{fontSize: 14,width: '100%'}}>下注</Text>
                           </Button>
                       </View>
                       <View style={{flex: 1,height: '100%',justifyContent: 'center',
                                    alignItems: 'center',paddingLeft: 10,paddingRight: 10}}>
                           <TextInput
                               returnKeyType="send"
                               style={{height: 35, backgroundColor: 'white', width: '100%'}}
                               onChangeText={(text) => this.setState({text})}
                               onSubmitEditing={this.sendMessage.bind(this)}
                               value={this.state.text}
                            />
                       </View>
                   </View>
               </KeyboardAvoidingView>
           </View>
        )
    }

    firstDom(lottery){
        let overTimes = this.state.overTimes;
        let openTimeStr = this.state.opening?'封盘中':`${overTimes?overTimes.minute:'?'} 分 ${overTimes?overTimes.second:'?'}秒`;
        const serial_number = this.state.serial_number;
        return (
            <View style={{backgroundColor: '#45A2FF',height: 64,flexDirection: 'row'}}>
                <View style={{flex: 1, justifyContent: 'center',alignItems: 'center'}}>
                    <Text style={{color: 'white', fontSize: 13}}>距离 {serial_number?this.state.serial_number+1:'?'} 期截止</Text>
                    <Text style={{color: 'white', fontSize: 18,marginTop: 4}}>{openTimeStr}</Text>
                </View>
                <View style={{flex: 1, alignItems: 'center',flexDirection: 'row'}}>
                    <View style={{width: 1,height: '68%',backgroundColor: 'white'}} />
                    <View style={{marginLeft: 40}}>
                        <Text style={{color: 'white'}}>{this.state.integral}</Text>
                        <Text style={{color: 'red', marginLeft: 15}}>{this.state.winIntegral?this.state.winIntegral:''}</Text>
                    </View>
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

    _renderRow(item){
        let {user} = this.props;
        let content = null;
        if(item.type == 0){
            content = item.user.user_id !== user.info.user_id?this.letfMessageView(item):this.rightMessageView(item);
        }else if(item.type == -1){
            content = this.systemMessageView(item.content);
        }else{
            content = item.user.user_id !== user.info.user_id?this.leftBetMessageView(item):this.rightBetMessageView(item)
        }
        return(
            <View onLayout={()=>{
                if(this.state.messages.length > 5){
                    this.loadEnd();
                }
            }}>{content}</View>
        )
    }

    systemMessageView(content){
        return (
            <View style={{width: '100%', alignItems: 'center'}}>
                <View style={{backgroundColor: '#DEDEDE', marginVertical: 8, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 4}}>
                    <Text style={{color: 'black'}}>{content}</Text>
                </View>
            </View>
        )
    }

    letfMessageView(item){
        return (
            <View style={styles.item}>
                <View>
                    <TouchableOpacity style={styles.imageView}>
                        <Image style={styles.itemImage} source={require('../asset/level_3.jpg')}/>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection: 'column', paddingRight: 110}}>
                    <View style={{height: 15,paddingLeft: 0}}>
                        <Text style={{fontSize: 12}}>{item.user.name}</Text>
                    </View>
                    <View style={{backgroundColor: '#47B5F5',borderRadius: 5,padding: 8, flexWrap: 'wrap'}}>
                        <Text style={{color: 'white', flexWrap: 'wrap'}}>{item.content}</Text>
                    </View>
                </View>
            </View>
        )
    }

    rightMessageView(item){
        return (
            <View style={[styles.item,{justifyContent:'flex-end'}]}>
                <View style={{flexDirection: 'column', marginLeft: 110}}>
                    <View style={{height: 15,paddingLeft: 0}}>
                        <Text style={{fontSize: 12, textAlign: 'right'}}>{item.user.name}</Text>
                    </View>
                    <View style={{backgroundColor: '#47B5F5',flexDirection: 'column',borderRadius: 5,padding: 8}}>
                        <Text style={{color: 'white'}}>{item.content}</Text>
                    </View>
                </View>
                <View>
                    <TouchableOpacity style={styles.imageView}>
                        <Image style={styles.itemImage} source={require('../asset/level_3.jpg')}/>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }


    leftBetMessageView(bet){

        console.log(bet);

        let betTypeStr = bet.playType == 1 ? combineRates[bet.type] : `单点(${bet.number})`;

        return (
            <View style={styles.item}>
                <View>
                    <TouchableOpacity style={styles.imageView}>
                        <Image style={styles.itemImage} source={require('../asset/level_3.jpg')}/>
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
                                <Text style={{color: 'white'}}>投注类型: {betTypeStr}</Text>
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

    rightBetMessageView(bet){


        let betTypeStr = bet.playType == 1 ? combineRates[bet.type] : bet.number;

        return (
            <View style={[styles.item,{justifyContent:'flex-end'}]}>
                <View style={styles.itemContentView}>
                    <View style={{flexDirection: 'column',width: 220}}>
                        <View style={{height: 15}}>
                            <Text style={{fontSize: 12, textAlign: 'right'}}>{bet.user.name}</Text>
                        </View>
                        <View style={{backgroundColor: '#F16B00',flexDirection: 'column',borderRadius: 5,padding: 8}}>
                            <View style={{flexDirection: 'row'}}>
                                <View style={{flex: 1}}>
                                    <Text style={{color: 'white'}}>{bet.serial_number}期</Text>
                                </View>
                                <View style={{flex: 1}}>
                                    <Text style={{color: 'white'}}>投注类型: {betTypeStr}</Text>
                                </View>
                            </View>
                            <View style={{marginTop: 5}}>
                                <Text style={{color: 'white'}}>金额: {bet.money}元宝</Text>
                            </View>
                        </View>
                    </View>
                    <View>
                        <TouchableOpacity style={styles.imageView}>
                            <Image style={styles.itemImage} source={require('../asset/level_1.jpg')}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

import Icon from 'react-native-vector-icons/Ionicons';


class PopupContent extends Component {

    // 构造
    constructor(props) {
        super(props);
        this.moneyChange = this.moneyChange.bind(this);
        // 初始状态
        this.state = {
            tabKey: 1,
        };
    }

    bottomPour(){
        this.props.bottomPour(this.state.betType, this.state.betMoney, this.state.playType);
    }

    moneyChange(betMoney){
        this.setState({betMoney});
    }

    updatePosition(hasPosition){
        this.setState({hasPosition});
    }

    callback(key) {
        console.log('onChange', key);
    }

    handleTabClick(key) {
        console.log('onTabClick', key);
    }

    tabMove = (key)=>{
        this.setState({
            tabKey: key,
        });
    }

    render() {
        let gameRules = this.props.gameRules;

        let combineRate = gameRules[0],
            newSingleRate = gameRules[1];

        let centerStyle = {alignItems: 'center',justifyContent: 'center'};

        let combineRuleView = [];

        for(let key of Object.keys(combineRate)){
            combineRuleView[combineRate[key].index] = (
                <View key={key} style={{width: '20%',height: 50,paddingHorizontal: 20}}>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={()=>{this.setState({selectRule: key, betType: key, playType: 1})}}
                        style={[key == this.state.selectRule ?
                            {borderWidth: 1,borderColor: 'white'} : null,centerStyle]}>
                        <Text style={{color: 'white'}}>{combineRates[key]}</Text>
                        <Text style={{color: 'white'}}>1:{combineRate[key].value}</Text>
                    </TouchableOpacity>
                </View>
            )
        }

        let singleRuleView = [];

        newSingleRate.map((rates, index)=>{
            let arr = [];
            rates.map((rate, second)=>{
                const key = (index * 5) + second;
                arr.push(
                    <View key={key} style={{width: '20%',height: 50,paddingHorizontal: 10}}>
                        <TouchableOpacity
                            key={key}
                            activeOpacity={1}
                            onPress={()=>{this.setState({betType: key, playType: 2})}}
                            style={[key == this.state.betType ?
                                {borderWidth: 1,borderColor: 'white'} : null,centerStyle]}>
                            <Text style={{color: 'white'}}>{key}</Text>
                            <Text style={{color: 'white'}}>1 : {rate}</Text>
                        </TouchableOpacity>
                    </View>
                )
            });
            singleRuleView.push(<View key={index} style={{width: '100%',flexDirection: 'row',flexWrap: 'wrap'}}>{arr}</View>)
        });

        return (
            <View style={{backgroundColor: '#48B0FF', paddingBottom:this.state.hasPosition?220:0}}>
                <View style={[{flexDirection: 'row',height: 50},centerStyle]}>
                    <Icon onPress={()=>{this.tabMove(1)}} name='md-arrow-dropleft' size={30} style={{color: 'white'}}/>
                    <Text style={{color: 'white', marginLeft: 100, marginRight: 100}}>大小单双</Text>
                    <Icon onPress={()=>{this.tabMove(2)}} name='md-arrow-dropright' size={30} style={{color: 'white'}}/>
                </View>

                <View style={{width: '200%', flexDirection: 'row', left: this.state.tabKey == 2?-pageWidth:0, }}>

                    <View style={{flex: 1,height: 100,flexDirection: 'row',flexWrap: 'wrap'}}>
                        {combineRuleView}
                    </View>

                    <ScrollView style={{flex: 1,height: 100}}>
                        {singleRuleView}
                    </ScrollView>
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

function getSendUser(info) {
    return {
        user_id: info.user_id,
        name: info.name,
        avatar_picture_url: info.avatar_picture_url
    }
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
    ruleContent: {
        flex: 1,
        height: 100,
        flexDirection: 'row',
        flexWrap: 'wrap',
        overflow: 'hidden'
    },
    ruleButton: {
        backgroundColor: 'white',borderRadius: 4,
        height: 30,
    },
});

const mapStateToProps = ({gameRules,user}) => {
    return {gameRules,user};
};

export default connect(mapStateToProps)(Room);