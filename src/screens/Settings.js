import React from 'react';
import {View, Linking, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import SelectInput from 'react-native-select-input-ios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  Body,
  Heading3,
  Small,
  Subtitle,
  SubtitleItalic,
  VerySmall,
} from '../components/Typography';
import {
  ThemeContext,
  useSettingsDispatchContext,
  useSettingsStateContext,
} from '../contexts';
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
  const settingsValue = useSettingsStateContext();

  const {newUpdateInfo} = settingsValue;

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
              style={{
                backgroundColor: activeTheme.SECONDARY_BACKGROUND,
              }}
              value={selectedCharacterPosition}
              options={charactersPositionOptions}
              onSubmitEditing={val => handleCharacterPositionSettings(val)}
            />
          </SettingsItemRight>
        </SettingsItem>

        {newUpdateInfo && newUpdateInfo?.version > settingsValue.updateVersion && (
          <UpdateWrapper>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Heading3 style={{color: '#e04352'}}>Update Available</Heading3>
              <TouchableOpacity
                style={{
                  marginLeft: 4,
                  backgroundColor: '#e04352',
                  padding: 6,
                  borderRadius: 5,
                }}
                onPress={() => Linking.openURL(newUpdateInfo?.downloadUrl)}>
                <Small style={{color: 'white'}}>Download</Small>
              </TouchableOpacity>
            </View>

            <UpdateContentWrapper>
              {newUpdateInfo &&
                newUpdateInfo.fixes.map(fix => <Small>- {fix}</Small>)}
            </UpdateContentWrapper>
          </UpdateWrapper>
        )}

        <CreditsWrapper>
          <Body>Credits</Body>
          <CreditItem>
            <VerySmall>
              * All information are fetched from Genshin Wiki, HoneyHunter and
              GameWith.net website.
            </VerySmall>
          </CreditItem>

          <CreditItem>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 8,
              }}>
              <Small>* Hutao icon by</Small>
              <TouchableOpacity
                style={{marginLeft: 4}}
                onPress={() =>
                  Linking.openURL(
                    'https://twitter.com/AeEntropy/status/1366971148383232003',
                  )
                }>
                <Small>@AeEntropy</Small>
              </TouchableOpacity>
            </View>
          </CreditItem>
        </CreditsWrapper>

        <View style={{marginTop: 40}}>
          <Small>
            Want to create your own app or website like this? Use my free
          </Small>
          <TouchableOpacity
            onPress={() => Linking.openURL('https://genshin-api.netlify.app/')}>
            <Body style={{color: '#e04352'}}>Genshin API</Body>
          </TouchableOpacity>
        </View>
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

const CreditsWrapper = styled.View`
  background-color: ${props => props.theme.SECONDARY_BACKGROUND};
  margin-top: 50px;
  padding: 8px;
  border-radius: 5px;
`;

const UpdateWrapper = styled.View`
  margin-top: 50px;
  margin-top: 50px;
`;

const UpdateContentWrapper = styled.View`
  margin-top: 30px;
  background-color: ${props => props.theme.SECONDARY_BACKGROUND};
  padding: 16px;
  border-radius: 5px;
`;

const CreditItem = styled.View`
  margin: 8px 0;
`;

export default Settings;
