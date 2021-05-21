import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';

import {NavigationContainer} from '@react-navigation/native';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';

import {
  HomeScreen,
  CharactersScreen,
  ViewCharacterScreen,
  ViewWeaponScreen,
  WeaponsScreen,
} from '../screens';
import {useThemeContext} from '../contexts';
import {DarkTheme, LightTheme} from '../constants';
import {Heading3} from './Typography';

const Stack = createSharedElementStackNavigator();

const StackNavigation = () => {
  const {toggleTheme, theme} = useThemeContext();
  const activeTheme = theme === 'dark' ? DarkTheme : LightTheme;

  const sharedElementOption = () => ({
    gestureEnabled: false,
    transitionSpec: {
      open: {
        animation: 'timing',
        config: {duration: 300, delay: 2},
      },
      close: {animation: 'timing', config: {duration: 300}},
    },
    cardStyleInterpolator: ({current: {progress}}) => {
      return {
        cardStyle: {
          opacity: progress,
        },
      };
    },
  });

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: activeTheme.HEADER_BACKGROUND,
          },
          headerleftContainerStyle: {
            paddingHorizontal: 16,
          },
          headerRightContainerStyle: {
            paddingHorizontal: 16,
          },
          headerTitle: ({children}) => {
            return <Heading3>{children}</Heading3>;
          },
          headerBackImage: () => (
            <Ionicons
              name="arrow-back"
              size={20}
              color={activeTheme.OPPOSITE_PRIMARY_BACKGROUND}
            />
          ),
          headerRight: () => (
            <Feather
              onPress={() => toggleTheme()}
              name="sun"
              size={20}
              color={activeTheme.OPPOSITE_PRIMARY_BACKGROUND}
            />
          ),
        }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="View Weapon"
          component={ViewWeaponScreen}
          options={() => sharedElementOption()}
        />
        <Stack.Screen
          name="View Character"
          component={ViewCharacterScreen}
          options={() => sharedElementOption()}
          // sharedElementsConfig={(route, otherRoute, showing) => {
          //   const { name } = route.params;
          //   return [
          //     {
          //       id: `${name.toLowerCase()}-photo`,
          //       animation: "fade",
          //       resize: "cover",
          //       align: "left-top",
          //     },
          //   ];
          // }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigation;
