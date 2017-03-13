import React from 'react';
import { AppRegistry } from 'react-native';
import dva from 'dva/mobile';
import user from './models/user'
import gameRules from './models/gameRules'
import Router from './Router'

const app = dva();
app.model(user);
app.model(gameRules);

app.router(() => <Router />);

export default app.start();