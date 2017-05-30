import React from 'react';
import { AppRegistry } from 'react-native';
import dva from 'dva/mobile';
import user from './models/user';
import gameRules from './models/gameRules';
import recharge from './models/recharge';
import rooms from './models/rooms';
import bet from './models/bet';
import message from './models/message';
import records from './models/records';
import Router from './Router'

const app = dva();
app.model(user);
app.model(gameRules);
app.model(recharge);
app.model(rooms);
app.model(bet);
app.model(message);
app.model(records);

app.router(() => <Router />);

export default app.start();