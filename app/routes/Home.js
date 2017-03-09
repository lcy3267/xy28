import React,{Component} from 'react';
import { View, Text, StyleSheet, StatusBar, Platform } from 'react-native';
import { TabBar } from 'antd-mobile';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import MyTabBar from '../components/MyTabBar';
import Index from './Index';
import Two from './Two';
import Common from '../common/index';

const tabBarItems = [
    {title: '首页', icon: 'md-home', component: Index},
    {title: '充值', icon: 'logo-usd', component:Two},
    {title: '动态', icon: 'ios-text', component: Index},
    {title: '我的', icon: 'md-person', component: Two},
];

//@todo 安卓icon兼容

export default class Home extends Component{

    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'redTab',
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content"/>
                <ScrollableTabView
                    style={styles.main}
                    initialPage={0}
                    renderTabBar={() => <MyTabBar tabBarItems={tabBarItems} hasTimelineMassage={false}  hasNewMassage={true}/>}
                    tabBarPosition="bottom"
                    onChangeTab={this.onChangeTab.bind(this)}
                    locked={false}
                >
                    {
                        tabBarItems.map((controller, i) => {
                            let Component = controller.component;
                            return (
                                <View key={i} tabLabel={controller.icon}>
                                    <View style={styles.title}>
                                        <Text style={styles.titleText}>游戏大厅</Text>
                                    </View>
                                    <Component height={{height:Common.window.height - 50}}/>
                                </View>
                            )
                        })
                    }
                </ScrollableTabView>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        width: Common.window.width,
        height: Platform.OS == 'ios'?Common.window.height:Common.window.height
    },
    main: {
    },
    title: {
        justifyContent: 'center',
        alignItems: 'center',
        width: Common.window.width,
        height: Platform.OS == 'ios'?60:50,
        paddingTop: Platform.OS == 'ios'?20:0,
        backgroundColor: 'black'
    },
    titleText: {
        fontSize: 18,
        color: 'white'
    },
});