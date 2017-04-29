import React from 'react';
import { Scene, Router } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import Home from './routes/Home';
import RoomList from './routes/RoomList';
import Room from './routes/Room';
import Register from './routes/auth/Register';
import PersonSet from './routes/person/PersonSet';
import SelectAlipayAccount from './routes/recharge/SelectAlipayAccount';
import AlipayRecharge from './routes/recharge/AlipayRecharge';

const RouterComponent = () => {
  return (
    <Router sceneStyle={{ paddingTop: 0 }}>
      <Scene key="/">
        <Scene key="home" component={Home} initial={true} hideNavBar={true}/>
          {SetScene('roomList','北京28',RoomList)}
          {SetScene('register','注册',Register)}
          {SetScene('personSet','设置',PersonSet)}
          {SetScene('selectAlipayAccount','选择支付宝账号',SelectAlipayAccount)}
          {SetScene('alipayRecharge','支付宝转账',AlipayRecharge)}
          {SetScene('room','初级房',Room,<Icon
              onPress={()=>alert("Right button")}
              name="md-add" color='white' size={25}/>,false)}
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

function SetScene(key,title,Component,rightIcon = null,initial=false) {
    return (
        <Scene key={key} component={Component} hideNavBar={false} initial={initial}
               renderRightButton={()=>rightIcon}
               titleStyle={{color: 'white'}}  title={title} navigationBarStyle={{backgroundColor: '#323139'}}/>
    )
}

export default RouterComponent;
