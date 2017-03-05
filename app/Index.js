import React from 'react';
import { AppRegistry } from 'react-native';
import dva from 'dva/mobile';
import count from './models/count'
import Router from './Router'

const app = dva();
app.model(count);


app.router(() => <Router />);

export default app.start();