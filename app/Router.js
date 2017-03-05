import React from 'react';
import { Scene, Router } from 'react-native-router-flux';
import One from './routes/One';
import Two from './routes/Two';

const RouterComponent = () => {
  return (
    <Router sceneStyle={{ paddingTop: 65 }}>
      <Scene key="/">
        <Scene key="one" component={One} title="Please Login" />
        <Scene key="two" component={Two} title="Please Login" />
      </Scene>
    </Router>
  );
};

export default RouterComponent;
