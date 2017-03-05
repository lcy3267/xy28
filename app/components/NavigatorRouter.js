/**
 * Created by starlight36
 */
import React, { Component } from 'react';
import { Platform, BackAndroid, Navigator, View, StyleSheet ,ToastAndroid} from 'react-native';

export default class NavigatorRouter extends Component {

    static contextTypes = {
        router: React.PropTypes.object.isRequired,
    };

    static childContextTypes = {
        addBackButtonListener: React.PropTypes.func,
        removeBackButtonListener: React.PropTypes.func,
    };

    constructor() {
        super();
        this.isSynchronizingRoute = false;
        this.backHandlers = [];
        this.handleBackButton = this.handleBackButton.bind(this);
        this.handleRouteChange = this.handleRouteChange.bind(this);
        this.handleNavigatorDidFocus = this.handleNavigatorDidFocus.bind(this);
    }

    componentDidMount() {
        BackAndroid.addEventListener('hardwareBackPress', this.handleBackButton);
        this.context.router.listen(this.handleRouteChange);
    }

    componentWillUnmount() {
        BackAndroid.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    shouldComponentUpdate() {
        return false;
    }

    getChildContext() {
        return {
            addBackButtonListener: this.addBackButtonListener.bind(this),
            removeBackButtonListener: this.removeBackButtonListener.bind(this),
        };
    }

    addBackButtonListener(listener) {
        this.backHandlers.push(listener);
    }

    removeBackButtonListener(listener) {
        this.backHandlers = this.backHandlers.filter((handler) => handler !== listener);
    }

    handleBackButton() {
        const nav = this.refs.navigator;
         const routers = nav.getCurrentRoutes();
         if (routers.length > 1) {
             const top = routers[routers.length - 1];
             if (top.ignoreBack || top.component.ignoreBack){
                 // 路由或组件上决定这个界面忽略back键
                 return true;
             }
             const handleBack = top.handleBack || top.component.handleBack;
             if (handleBack) {
                 // 路由或组件上决定这个界面自行处理back键
                 return handleBack();
             }
             // 默认行为： 退出当前界面。
             nav.pop();
             return true;
         }else{
             if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
                 //最近2秒内按过back键，可以退出应用。
                 return false;
             }
             this.lastBackPressed = Date.now();
             ToastAndroid.show('再按一次退出应用',ToastAndroid.SHORT);
             return true;
         }
    }

    handleRouteChange(location) {
        setTimeout(() => {
            // Skip change route when synchronize route from navigator.
            if (this.isSynchronizingRoute) return;

            const route = {
                location,
                query: location.query,
                component: this.props.children,
            };

            if (location.action === 'PUSH') {
                this.refs.navigator.push(route);
            } else if (location.action === 'POP') {
                const routes = this.refs.navigator.getCurrentRoutes().filter(
                    route => (location.pathname === '/' && route.root)
                    || (route.location && route.location.key === location.key)
                );
                this.refs.navigator.popToRoute(routes[0]);
            } else if (location.action === 'REPLACE') {
                this.refs.navigator.replace(route);
            }
        }, 0);
    }

    handleNavigatorDidFocus(route) {
        const current = this.props.location;
        if ((route.root && current.pathname === '/')
            || (route.location && route.location.key === current.key)) return;
        this.isSynchronizingRoute = true;
        this.context.router.goBack();
        this.isSynchronizingRoute = false;
    }

    render() {
        return (
            <Navigator
                ref="navigator"
                style={[styles.container]}
                initialRoute={{ root: true, component: this.props.children }}
                configureScene={this.configureScene}
                renderScene={this.renderScene}
                onDidFocus={this.handleNavigatorDidFocus}
            />
        );
    }

    configureScene(route) {
        if (route.query) {
            if (route.query.anim === 'floatFromBottom') {
                return Platform.OS === 'android' ?
                    Navigator.SceneConfigs.FloatFromBottomAndroid : Navigator.SceneConfigs.FloatFromRight;
            }

            if (Platform.OS === 'ios' && route.query.anim === 'floatFromLeft') {
                return Navigator.SceneConfigs.FloatFromLeft;
            }

            if (Platform.OS === 'ios' && route.query.anim === 'floatFromRight') {
                return Navigator.SceneConfigs.FloatFromRight;
            }

            if (Platform.OS === 'ios' && route.query.anim === 'pushFromRight') {
                return Navigator.SceneConfigs.PushFromRight;
            }
        }

        return Navigator.SceneConfigs.FloatFromRight;
    }

    renderScene(route) {
        if (route.component) {
            return React.cloneElement(route.component, {
                location: route.location,
                query: route.query,
            });
        }
        return <View />;
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        //backgroundColor: 'black',
    },
});