import React from 'react';
import {View} from 'react-native';
import styled from 'styled-components/native';
import SelectInput from 'react-native-select-input-ios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {Body, Heading3, Small, Subtitle} from '../components/Typography';
import {ThemeContext, useSettingsDispatchContext} from '../contexts';
import {DarkTheme, LightTheme} from '../constants';

const charactersPositionOptions = [
  {
    value: 'BELOW',
    label: 'Below the Material',
  },
  {
    value: 'MODAL',
    label: 'Modal',
  },
];

const Settings = () => {
  const {theme} = React.useContext(ThemeContext);
  const activeTheme = theme === 'light' ? LightTheme : DarkTheme;

  const settingsDispatch = useSettingsDispatchContext();

  const [selectedCharacterPosition, setSelectedCharacterPosition] =
    React.useState('MODAL');

  const handleCharacterPositionSettings = async val => {
    setSelectedCharacterPosition(val);
    await AsyncStorage.setItem('characters-position-in-dashboard', val);

    settingsDispatch({
      type: 'SET_CHARACTER_POSITION_IN_HOME_PAGE_MATERIALS',
      payload: {
        characterPositionInHomePageMaterials: val,
      },
    });
  };

  // React.useEffect(() => {
  //   async function getSelectedCharacterPosition() {
  //     const storedSelectedCharacterPosition =
  //       (await AsyncStorage.getItem("characters-position-in-dashboard")) ||
  //       "MODAL";

  //     settingsDispatch({
  //       type: "SET_CHARACTER_POSITION_IN_HOME_PAGE_MATERIALS",
  //       payload: {
  //         characterPositionInHomePageMaterials: storedSelectedCharacterPosition,
  //       },
  //     });

  //     setSelectedCharacterPosition(storedSelectedCharacterPosition);
  //   }

  //   getSelectedCharacterPosition();
  // }, []);

  return (
    <Container>
      <Heading3>Settings</Heading3>

      <View style={{marginTop: 20}}>
        <SettingsItem>
          <SettingsItemLeft>
            <Small>Characters' position in the home page</Small>
          </SettingsItemLeft>
          <SettingsItemRight>
            <SelectInput
              style={{backgroundColor: activeTheme.SECONDARY_BACKGROUND}}
              value={selectedCharacterPosition}
              options={charactersPositionOptions}
              onSubmitEditing={val => handleCharacterPositionSettings(val)}
            />
          </SettingsItemRight>
        </SettingsItem>
      </View>
    </Container>
  );
};

const Container = styled.View`
  padding: 16px 24px;
  flex: 1;
  background-color: ${props => props.theme.PRIMARY_BACKGROUND};
`;

const SettingsItem = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const SettingsItemLeft = styled.View`
  max-width: 60%;
`;

const SettingsItemRight = styled.View`
  width: 40%;
`;

export default Settings;
