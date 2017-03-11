import React from 'react';
import { AppRegistry } from 'react-native';
import dva from 'dva/mobile';
import count from './models/count'
import user from './models/user'
import Router from './Router'

const app = dva();
app.model(count);
app.model(user);


app.router(() => <Router />);

export default app.start();