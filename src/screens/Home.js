import React from 'react';
import {View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Body, Subtitle, Heading3, Small} from '../components/Typography';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import {Image} from 'react-native';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import Svg, {Circle, Path} from 'react-native-svg';

import CharactersScreen from './Characters';
import WeaponsScreen from './Weapons';
import DashboardScreen from './Dashboard';
import SettingsScreen from './Settings';

import {ThemeContext} from '../contexts/ThemeContext';
import {DarkTheme, LightTheme} from '../constants';

const Tab = createBottomTabNavigator();
const WeaponStack = createSharedElementStackNavigator();
const CharactersStack = createSharedElementStackNavigator();

// create different weapon and character stack because
// shared element didn't work when for these two tabs
const WeaponScreenStack = () => {
  return (
    <WeaponStack.Navigator>
      <WeaponStack.Screen
        options={{headerShown: false}}
        name="Weapons"
        component={WeaponsScreen}
      />
    </WeaponStack.Navigator>
  );
};
const CharactersScreenStack = () => {
  return (
    <CharactersStack.Navigator>
      <CharactersStack.Screen
        options={{headerShown: false}}
        name="Characters"
        component={CharactersScreen}
      />
    </CharactersStack.Navigator>
  );
};

const Home = ({navigation}) => {
  const {theme} = React.useContext(ThemeContext);
  const activeTheme = theme === 'light' ? LightTheme : DarkTheme;

  React.useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            style={{height: 48, width: 48, marginRight: 8}}
            source={require('assets/images/hutao-smug.png')}
          />
          <Body>Hutao Guide</Body>
        </View>
      ),
    });
  }, [navigation]);

  return (
    <Tab.Navigator
      tabBarOptions={{
        showLabel: false,
        iconStyle: {fontSize: 12, width: 12, height: 12},
        style: {
          backgroundColor: activeTheme.PRIMARY_BACKGROUND,
          borderTopColor: 'transparent',
        },
      }}>
      <Tab.Screen
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({color, size, focused}) => (
            <AntDesign
              name="home"
              size={24}
              color={
                focused
                  ? activeTheme.ACTIVE_ICON_COLOR
                  : activeTheme.INACTIVE_ICON_COLOR
              }
            />
          ),
        }}
        name="Dashboard"
        component={DashboardScreen}
      />
      <Tab.Screen
        options={{
          tabBarLabel: 'Characters',
          tabBarIcon: ({color, size, focused}) => (
            <Svg
              style={{width: 48, height: 48}}
              width={28}
              height={28}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 58 58">
              <Circle
                fill={
                  focused
                    ? activeTheme.ACTIVE_ICON_COLOR
                    : activeTheme.INACTIVE_ICON_COLOR
                }
                cx="20"
                cy="34.325"
                r="2"
              />
              <Path
                fill={
                  focused
                    ? activeTheme.ACTIVE_ICON_COLOR
                    : activeTheme.INACTIVE_ICON_COLOR
                }
                d="M53 47.325v-16.5c0-10.201-8.301-18.5-18.505-18.5h-6.061c-.064-.563-.058-1.589.465-2.239.404-.505 1.111-.761 2.101-.761h1v-2h-1c-1.627 0-2.859.508-3.662 1.509a4 4 0 00-.694 1.337c-.999-1.819-2.968-3.748-6.479-4.333l-.986-.165-.329 1.973.986.165c4.014.669 5.201 3.308 5.54 4.514h-1.87C13.301 12.325 5 20.624 5 30.825v16.5H0v2h10v2a1 1 0 001 1h11a1 1 0 001-1v-2h12v2a1 1 0 001 1h11a1 1 0 001-1v-2h10v-2h-5zm-32 3h-2v-3h-2v3h-1v-3h-2v3h-2v-2c0-1.103.9-2 2.006-2h4.988c1.106 0 2.006.897 2.006 2v2zm25 0h-2v-3h-2v3h-1v-3h-2v3h-2v-2c0-1.103.9-2 2.006-2h4.988c1.106 0 2.006.897 2.006 2v2zm1.858-3c-.448-1.72-2.002-3-3.864-3h-4.988c-1.861 0-3.416 1.28-3.864 3H22.858c-.448-1.72-2.003-3-3.864-3h-4.988c-1.861 0-3.416 1.28-3.864 3H7v-16.5c0-9.098 7.404-16.5 16.505-16.5h10.989c9.101 0 16.505 7.402 16.505 16.5v16.5h-3.141z"
              />
              <Circle
                fill={
                  focused
                    ? activeTheme.ACTIVE_ICON_COLOR
                    : activeTheme.INACTIVE_ICON_COLOR
                }
                cx="38"
                cy="34.325"
                r="2"
              />
            </Svg>
          ),
        }}
        name="Characters"
        component={CharactersScreenStack}
      />
      <Tab.Screen
        options={{
          tabBarLabel: 'Weapons',
          tabBarIcon: ({color, size, focused}) => (
            <MaterialCommunityIcons
              name="sword"
              size={24}
              color={
                focused
                  ? activeTheme.ACTIVE_ICON_COLOR
                  : activeTheme.INACTIVE_ICON_COLOR
              }
              // color={focused ? 'white' : color}
            />
            // <Image
            //   source={require("@assets/images/weapons/Snow-Tombed-Starsilver.png")}
            //   style={{ width: 26, height: 26 }}
            // />
          ),
        }}
        name="Weapons"
        component={WeaponScreenStack}
      />

      <Tab.Screen
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({color, size, focused}) => (
            <Feather
              name="settings"
              size={24}
              color={
                focused
                  ? activeTheme.ACTIVE_ICON_COLOR
                  : activeTheme.INACTIVE_ICON_COLOR
              }

              // color={focused ? 'white' : color}
            />
          ),
        }}
        name="Settings"
        component={SettingsScreen}
      />
    </Tab.Navigator>
  );
};

export default Home;
