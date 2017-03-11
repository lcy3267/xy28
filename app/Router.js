import React from 'react';
import { Scene, Router } from 'react-native-router-flux';
import Home from './routes/Home';
import RoomList from './routes/RoomList';
import Room from './routes/Room';

const RouterComponent = () => {
  return (
    <Router sceneStyle={{ paddingTop: 0 }}>
      <Scene key="/">
        <Scene key="home" component={Home} initial={true} hideNavBar={true}/>
          {SetScene('roomList','北京28',RoomList)}
          {SetScene('room','初级房',Room)}
       </Scene>
    </Router>
  );
};

function SetScene(key,title,Component) {
    return (
        <Scene key={key} component={Component} hideNavBar={false}
               titleStyle={{color: 'white'}}  title={title} navigationBarStyle={{backgroundColor: '#323139'}}/>
    )
}

export default RouterComponent;
