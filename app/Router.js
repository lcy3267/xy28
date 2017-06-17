import React from 'react';
import {View} from 'react-native';
import { Scene, Router } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import Home from './routes/Home';
import RoomList from './routes/RoomList';
import Room from './routes/Room';
import Register from './routes/auth/Register';
import PersonSet from './routes/person/PersonSet';
import Wallet from './routes/person/Wallet';
import BindBank from './routes/person/BindBank';
import SetWithdrawPwd from './routes/person/SetWithdrawPwd';
import SetLoginPwd from './routes/person/SetLoginPwd';
import MyBankCard from './routes/person/MyBankCard';
import Recharge from './routes/recharge/Recharge';
import SelectAlipayAccount from './routes/recharge/SelectAlipayAccount';
import AlipayRecharge from './routes/recharge/AlipayRecharge';
import LineRecharge from './routes/recharge/LineRecharge';
import Withdraw from './routes/withdraw/Withdraw';
import MessageDetail from './routes/message/Detail';
import IntegralChangeRecord from './routes/records/IntegralChangeRecord';
import BetRecord from './routes/records/BetRecord';
import WithdrawRecord from './routes/records/WithdrawRecord';
import RollbackRecord from './routes/records/RollbackRecord';
import Trend from './routes/Trend';
import { Popover, } from 'antd-mobile';
import RoomPopover from './components/RoomPopover';
import PlayExplain from './routes/PlayExplain';

const RouterComponent = () => {
  return (
    <Router sceneStyle={{ paddingTop: 0 }}>
      <Scene key="/">
        <Scene key="home" component={Home} initial={true} hideNavBar={true}/>
          {SetScene('roomList', '房间列表', RoomList)}
          {SetScene('register', '注册', Register)}
          {SetScene('personSet', '设置', PersonSet)}
          {SetScene('recharge', '选择支付宝账号', Recharge)}
          {SetScene('selectAlipayAccount', '选择支付宝账号', SelectAlipayAccount)}
          {SetScene('alipayRecharge', '支付宝转账', AlipayRecharge)}
          {SetScene('lineRecharge', '线上充值', LineRecharge)}
          {SetScene('wallet', '钱包', Wallet)}
          {SetScene('bindBank', '设置', BindBank)}
          {SetScene('setWithdrawPwd', '提现密码', SetWithdrawPwd)}
          {SetScene('setLoginPwd', '修改登录密码', SetLoginPwd)}
          {SetScene('myBankCard', '银行卡', MyBankCard)}
          {SetScene('withdraw', '提现', Withdraw)}
          {SetScene('messageDetail', '消息详情', MessageDetail)}
          {SetScene('changeRecords', '账变记录', IntegralChangeRecord)}
          {SetScene('betRecord', '下注记录', BetRecord)}
          {SetScene('withdrawRecord', '提现记录', WithdrawRecord)}
          {SetScene('rollbackRecord', '我的回水', RollbackRecord)}
          {SetScene('trend', '走势图', Trend)}
          {SetScene('room', '房间', Room, RoomPopover,false)}
          {SetScene('playExplain', '玩法说明', PlayExplain, null, false)}
       </Scene>
    </Router>
  );
};

class TabIcon extends React.Component {
    render(){
        return (
            <Text style={{color: this.props.selected ? 'red' :'black'}}>{this.props.title}</Text>
        );
    }
}

function SetScene(key,title,Component,RightIcon = null,initial=false) {
    return (
        <Scene key={key} component={Component} hideNavBar={false} initial={initial}
               renderRightButton={
               (e)=>{
                   if(key == 'room') {
                    return <RightIcon title={e.title}/>;
                   }else{
                    return null;
                   }
               }}
               titleStyle={{color: 'white'}}  title={title} navigationBarStyle={{backgroundColor: '#323139'}}/>
    )
}

export default RouterComponent;
