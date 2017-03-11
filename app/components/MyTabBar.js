import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import OcIcon from 'react-native-vector-icons/Octicons';

const MyTableBar = React.createClass({

  propTypes: {
    goToPage: React.PropTypes.func,
    activeTab: React.PropTypes.number,
    tabs: React.PropTypes.array,
  },

  render() {
    return <View style={[styles.tabs, this.props.style, ]}>
      {this.props.tabs.map((tab, i) => {
        return <TouchableOpacity
            key={tab}
            activeOpacity={1}
            onPress={() => this.props.goToPage(i)}
            style={styles.tab}>
          <Icon
              name={tab}
              size={25}
              color={this.props.activeTab === i ? '#C3B267' : '#494748'}
              ref={(icon) => { tab[i] = icon; }}
          />
          {this.props.hasNewMassage&&i==3?
                <OcIcon style={{position: 'absolute',left: 54,top:2}} name="primitive-dot" color="red" size={12}/>
                :null
          }
          {this.props.hasTimelineMassage&&i==2?
              <OcIcon style={{position: 'absolute',left: 54,top:2}} name="primitive-dot" color="red" size={12}/>
              :null
          }
          <Text style={[styles.iconTile,{color:this.props.activeTab === i ? '#C3B267' : '#494748'}]}>{this.props.tabBarItems[i].title}</Text>
        </TouchableOpacity>;
      })}
    </View>;
  },
});

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1718',
  },
  tabs: {
    height: 50,
    flexDirection: 'row',
    //borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  iconTile: {
    height: 12,
    fontSize: 10,
  }
});

export default MyTableBar;
