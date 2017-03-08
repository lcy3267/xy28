import React from 'react';
import { Scene, Router } from 'react-native-router-flux';
import Home from './routes/Home';

const RouterComponent = () => {
  return (
    <Router sceneStyle={{ paddingTop: 0 }}>
      <Scene key="/">
        <Scene key="home" component={Home} initial={true} hideNavBar={true}/>
      </Scene>
    </Router>
  );
};

export default RouterComponent;
