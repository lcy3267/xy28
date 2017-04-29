import React,{Component} from 'react';
import { View, Text, StyleSheet, StatusBar, Platform } from 'react-native';
import { TabBar } from 'antd-mobile';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import MyTabBar from '../components/MyTabBar';
import Index from './Index';
import Recharge from './recharge/Recharge';
import Message from './Message';
import My from './person/My';
import Login from './auth/Login';
import Common from '../common/index';
import CommonComponent from '../components/Common';
import { connect } from 'dva/mobile';

const tabBarItems = [
    {title: '首页', icon: 'md-home', component: Index, headText: '游戏大厅'},
    {title: '充值', icon: 'logo-usd', component: Recharge, headText: '充值'},
    {title: '消息', icon: 'ios-text', component: Message, headText: '消息'},
    {title: '我的', icon: 'md-person', component: My,headText: '我的'},
];

//@todo 安卓icon兼容
class Home extends Component{

    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'redTab',
        };
    }

    componentWillMount() {
    }

    onChangeTab(){}

    render() {
        let {user} = this.props;

        return (
            <View style={styles.container}>
                <CommonComponent />
                <StatusBar barStyle="light-content"/>
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
                                    <View style={styles.title}>
                                        <Text style={styles.titleText}>{controller.headText?controller.headText: '游戏大厅'}</Text>
                                    </View>
                                    {!user.info && i > 0?
                                        <Login />:
                                        <Component height={{height:Common.window.height - 50}}/>
                                    }
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
        height: Platform.OS == 'ios'?64:54,
        paddingTop: Platform.OS == 'ios'?20:0,
        backgroundColor: '#323139'
    },
    titleText: {
        fontSize: 18,
        color: 'white'
    },
});

const mapStateToProps = ({user}) => {
    return {user};
};

export default connect(mapStateToProps)(Home);