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
import { Carousel, Button, Popup, Grid, Toast, Tabs, Modal } from 'antd-mobile';
import Common from '../common/index';
import config,{ combineRates } from '../config';
import { getDate, GetDateStr } from '../common/FormatUtil'
import RoomPopover from '../components/RoomPopover';

const {height, width, paddingTop} = Common.window;


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

        let {roomId} = this.props;

        this.roomId = roomId;
        /*this.roomLevel = roomLevel;
        this.roomType = roomType;
        //是否允许发言
        this.is_speak = isSpeak;*/

        // 初始状态
        this.state = {
            room: {
                room_type: 0,
                is_speak: 0,
                level: 0,
            },
            lottery: {
            }, //上期开奖
            integral: 0,
            overTimes: null,
            messages: [],//type: 0 用户发言, -1:系统消息, string:下注
            opening: false,
            isClose: false,
            cancelBets: [],//用户取消下注的序号
            dataSource: new ListView.DataSource({
                rowHasChanged: (p1, p2) => p1 !== p2,
            }),
        };
    }

    componentWillMount() {
        let {user, dispatch} = this.props;
        if(!user.info){
            showToastNoMask('请先进行登录');
            Actions.pop();
            return;
        }

        Toast.loading('加载中...',15);

        this.loadRoomInfo(()=>{
            //加载赔率规则
            this.loadRoomGameRules();

            //加载5条下注记录
            dispatch({
                type: 'bet/roomBetRecords',
                params: {
                    roomId: this.roomId,
                },
                callback: (records)=>{
                    records = records.map((record)=>{
                        record.playType = record.play_type;
                        record.money = record.bottom_pour_money;
                        record.number = record.bottom_pour_number;
                        record.type = record.bottom_pour_type;
                        record.user = {
                            user_id: record.user_id,
                            name: record.name,
                            avatar_picture_url: record.avatar_picture_url,
                        };
                        return record;
                    })
                    this.setState({messages: records.reverse()});
                }
            });

            const namespace = this.state.room.room_type == 1?'/bj':'/cnd';

            //链接房间
            this.socket = SocketIOClient(config.apiDomain+namespace, {jsonp: false});
            
            let login = ()=>{
                this.socket.emit("login",
                    {
                        user: user.info,
                        roomId: this.roomId,
                        roomLevel: this.state.room.level,
                        roomType: this.state.room.room_type
                    }
                );
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

            this.socket.on('systemMsg', (data) => {
                const {content} = data;
                let messages = this.state.messages;
                let sysMsg = {
                    type: -1,
                    content,
                }
                messages.push(sysMsg);
                this.setState({messages});

            });

            // 监听开奖结果
            this.socket.on('openResult', (data) => {
                const lottery = data.lotteryRs;
                const {one, two, third, sum, serial_number} = lottery;
                let result = `${one} + ${two} + ${third} = ${sum} `;
                let messages = this.state.messages;
                let sysMsg = {
                    type: -1,
                    content: `[${serial_number}]期已开奖,开奖结果为:[${result}],[${(+serial_number)+1}]期可以开始下注`,
                }
                messages.push(sysMsg);
                this.setState({messages, lottery, serial_number: +serial_number});
            });

            this.socket.on('updateStatus', (result) => {
                const {opening, time, isClose} = result;
                let minute = Math.floor(time/60);
                let second = time%60;
                this.setState({opening: opening, overTimes: {minute, second}, isClose});
            });

            this.socket.on('updateIntegral', (data)=>{
                const {integral, winIntegral} = data;
                this.setState({integral});
                if(winIntegral) this.setState({winIntegral});
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
        });
    }

    loadRoomInfo = (callback)=>{
        this.props.dispatch({
            type: 'rooms/getRoomInfo',
            params: { roomId: this.roomId },
            callback: (room)=>{
                this.setState({room},()=>{
                    callback && callback();
                });
            }
        })
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

        if(this.state.integral < betMoney){
            showToastNoMask('余额不足!');
            return;
        }

        if(!betType && betType != 0){
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
        //防止重复点击
        if(this.beting == true) return;
        this.beting = true;
        setTimeout(()=>{
            this.beting = false;
        },1000);
        this.socket.emit('bet', bet);
    }

    sendMessage(e){

        if(this.state.room.is_speak == -1) {
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

    cancelBet = (bet, cancelIndex)=>{

        let cancel = ()=>{
            if(this.state.opening){
                showToastNoMask('已封盘不能取消!');
                return;
            }
            if(bet.serial_number != this.state.serial_number+1){
                showToastNoMask('不能取消往期投注!');
                return;
            }
            this.props.dispatch({
                type: 'bet/cancelBet',
                params: {id: bet.id},
                callback: ()=>{
                    let cancelBets = this.state.cancelBets;
                    cancelBets.push(cancelIndex);
                    this.setState({cancelBets});
                    showToastNoMask('成功取消下注!');
                }
            })
        }

        Modal.alert('','确定取消下注吗?',
            [
                { text: '点错了', onPress: () => console.log('cancel')},
                { text: '取消下注', onPress: () => cancel()},
            ]
        )

    }

    render(){
        const { messages, lottery, isClose, opening} = this.state;

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
                               disabled={opening || isClose}
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
                               underlineColorAndroid="transparent"
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
        const {serial_number, winIntegral, isClose, room: { room_type }} = this.state;

        return (
            <View style={{backgroundColor: '#45A2FF',height: 64,flexDirection: 'row'}}>
                <View style={{flex: 1, justifyContent: 'center',alignItems: 'center'}}>
                {isClose?
                    [
                        <Text key="1" style={{color: 'white',marginBottom: 3}}>本房间的游戏时间为</Text>,
                        <Text key="2" style={{color: 'white'}}>{room_type == 1?'09:00~23:55':'21:00~次日20:00'}</Text>
                    ]:
                    [
                        <Text key="1" style={{color: 'white', fontSize: 13}}>距离 {serial_number?serial_number+1:'?'} 期截止</Text>,
                        <Text key="2" style={{color: 'white', fontSize: 18,marginTop: 4}}>{openTimeStr}</Text>
                    ]
                }
                </View>
                <View style={{flex: 1, alignItems: 'center',flexDirection: 'row'}}>
                    <View style={{width: 1,height: '68%',backgroundColor: 'white'}} />
                    <View style={{marginLeft: 50, alignItems: 'center'}}>
                        <View style={{flexDirection: 'row', marginBottom: 3}}>
                            <Text style={{color: '#2035A0', fontSize: 13}}>余额</Text>
                            <Text style={{color: winIntegral > 0 ?'red':'white',fontSize: 12,
                         marginLeft: 15}}>{winIntegral?winIntegral:''}</Text>
                        </View>
                        <View >
                            <Text style={{color: 'white'}}>{this.state.integral}  元宝</Text>
                        </View>
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
            hasDouble = '双';
        }
        return (
            <View style={{height: 35,backgroundColor: 'white', alignItems: 'center',
               paddingLeft: 12,borderBottomWidth: 1, borderBottomColor: '#DEDEDE',flexDirection: 'row'}}>
                <Text>第  <Text style={styles.number}>{lottery.serial_number}</Text>  期</Text>
                <Text style={[styles.number,{marginLeft: 20}]}>{lottery.one || lottery.one == 0?`${result}(${hasMax},${hasDouble},${hasMax+hasDouble})`:'加载中'}</Text>
            </View>
        );
    }

    //type: 0 用户发言, -1:系统消息, string:下注
    _renderRow(item, sectionID, rowID){
        let {user} = this.props;
        let content = null;
        if(item.type == 0){
            content = item.user.user_id !== user.info.user_id?this.letfMessageView(item):this.rightMessageView(item);
        }else if(item.type == -1){
            content = this.systemMessageView(item.content);
        }else{
            content = item.user.user_id !== user.info.user_id?this.leftBetMessageView(item):this.rightBetMessageView(item, rowID)
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
                <View style={{maxWidth: '75%', backgroundColor: '#DEDEDE',
                 marginVertical: 8, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 4}}>
                    <Text style={{fontSize: 12,color: 'black', lineHeight: 20}}>{content}</Text>
                </View>
            </View>
        )
    }

    letfMessageView(item){
        return (
            <View style={styles.item}>
                <View>
                    <TouchableOpacity style={styles.imageView}>
                        <Image style={styles.itemImage} source={require('../asset/person.jpg')}/>
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
                        <Image style={styles.itemImage} source={require('../asset/person.jpg')}/>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }


    leftBetMessageView(bet){

        let betTypeStr = bet.playType == 1 ? combineRates[bet.type] : bet.number;


        return (
            <View>
                <View style={styles.timeView}>
                    <Text style={styles.time}>{getDate(bet.created_at)}</Text>
                </View>
                <View style={styles.item}>
                    <View>
                        <TouchableOpacity style={styles.imageView}>
                            <Image style={styles.itemImage} source={require('../asset/person.jpg')}/>
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
            </View>
        )
    }

    rightBetMessageView(bet, rowID){

        if(this.state.cancelBets.indexOf(rowID) > -1) return null;

        let betTypeStr = bet.playType == 1 ? combineRates[bet.type] : bet.number;

        const time = bet.updated_at ? getDate(bet.created_at) : bet.created_at;

        return (
            <View>
                <View style={styles.timeView}>
                    <Text style={styles.time}>{time}</Text>
                </View>
                <View style={[styles.item,{justifyContent:'flex-end'}]}>
                    <TouchableOpacity activeOpacity={1}  onPress={()=>{this.cancelBet(bet, rowID)}}
                        style={styles.itemContentView}>
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
                                <Image style={styles.itemImage} source={require('../asset/person.jpg')}/>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
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
            tabKey: 0,
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
                        onPress={()=>{this.setState({select1: key, betType: key, playType: 1,select2:undefined})}}
                        style={[key == this.state.select1 ?
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
                            onPress={()=>{this.setState({select2: key,betType: key, playType: 2, select1:undefined})}}
                            style={[key == this.state.select2 ?
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
            <View style={{backgroundColor: '#48B0FF', paddingBottom:this.state.hasPosition && Platform.OS == 'ios'?220:0}}>
                <Icon onClick={()=>{this.tabMove(0)}}
                      name='md-arrow-dropleft' size={30}
                      style={{color: 'white',position: 'absolute', top: 10, left: 60}}/>
                <Icon onPress={()=>{this.tabMove(1)}}
                      name='md-arrow-dropright' size={30}
                      style={{color: 'white',position: 'absolute', top: 10, right: 60}}/>
                <Carousel dots={false} selectedIndex={0}>
                    <View key="1">
                        <View style={{height: 50,justifyContent: 'center',alignItems: 'center'}}>
                            <Text style={{color: 'white'}}>大小单双</Text>
                        </View>
                        <View style={{flexDirection: 'row',flexWrap: 'wrap'}}>
                            {combineRuleView}
                        </View>
                    </View>
                    <View>
                        <View style={{height: 50,justifyContent: 'center',alignItems: 'center'}}>
                            <Text style={{color: 'white'}}>猜数字</Text>
                        </View>
                        <ScrollView style={{height: 100}}>
                            {singleRuleView}
                        </ScrollView>
                    </View>
                </Carousel>


                <View style={[{flexDirection: 'row', height: 40,justifyContent: 'space-between',paddingHorizontal: 20}]}>
                    <Button size="small" type="ghost"
                            style={{borderRadius: 4,height: 30,borderColor: 'white'}}>
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
                        underlineColorAndroid="transparent"
                        onChangeText={this.moneyChange}
                        style={{width: '50%',backgroundColor: 'white',height: 35}}/>
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
        width: width,
        height: height,
        flexDirection: 'column',
        paddingTop: paddingTop,
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
        paddingBottom: 12,
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
        maxWidth: width-164,
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
        backgroundColor: 'white',
        borderRadius: 4,
        height: 30,
    },
    timeView: {
        width: 110,
        marginLeft: (width - 115)/2,
        borderRadius: 4,
        backgroundColor: '#CBCBCB',
        padding: 1,
    },
    time: {
        fontSize: 12,
        color: 'white',
        textAlign: 'center'
    }
});

const mapStateToProps = ({gameRules,user}) => {
    return {gameRules,user};
};

export default connect(mapStateToProps)(Room);