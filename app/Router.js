import React from 'react';
import { Scene, Router } from 'react-native-router-flux';
import One from './routes/One';
import Two from './routes/Two';
import Home from './routes/Home';

const RouterComponent = () => {
  return (
    <Router sceneStyle={{ paddingTop: 0 }}>
      <Scene key="/">
        <Scene key="home" component={Home} initial={true} hideNavBar={true}/>
        <Scene key="one" component={One} title="22222 Login" hideNavBar={true}/>
        <Scene key="two" component={Two} title="Please Login" />
      </Scene>
    </Router>
  );
};

export default RouterComponent;
