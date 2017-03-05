import React from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { TabBar } from 'antd-mobile';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import MyTabBar from '../components/MyTabBar';
import One from './One';

const tabBarItems = [
    {title: '首页', icon: 'md-home', component: One},
    {title: '充值', icon: 'logo-usd', component: One},
    {title: '动态', icon: 'ios-text', component: One},
    {title: '我的', icon: 'md-person', component: One},
];

//@todo 安卓icon兼容

export default class BasicTabBarExample extends React.Component <any, any> {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'redTab',
        };
    }

    renderContent(pageText) {
        return (
            <View style={{ flex: 1, alignItems: 'center', backgroundColor: 'white' }}>
                <Text style={{ margin: 50 }}>{pageText}</Text>
            </View>
        );
    }

    onChangeTab(obj){
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollableTabView
                    style={styles.main}
                    initialPage={0}
                    renderTabBar={() => <MyTabBar tabBarItems={tabBarItems} hasTimelineMassage={false}  hasNewMassage={true}/>}
                    tabBarPosition="bottom"
                    onChangeTab={this.onChangeTab.bind(this)}
                    locked={true}
                >
                    {
                        tabBarItems.map((controller, i) => {
                            let Component = controller.component;
                            return (
                                <View key={i} tabLabel={controller.icon}>
                                    <Component />
                                </View>
                            )
                        })
                    }
                </ScrollableTabView>
            </View>
        );
    }

}

const Common = {
    window: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    }
}

const styles = StyleSheet.create({
    container: {
        width: Common.window.width,
        height: Platform.OS == 'ios'?Common.window.height:Common.window.height-30
    },
    main: {
        paddingTop: Platform.OS == 'ios'?20:0,
        backgroundColor:'white'
    }
});