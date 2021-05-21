/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import styled from 'styled-components/native';
import {
  Image,
  View,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  Body,
  Heading2,
  Heading3,
  Small,
  Subtitle,
  SubtitleItalic,
  VerySmall,
} from '../components/Typography';

import {
  SectionWrapper,
  Header,
  FlexboxListWrapper,
  FlexboxListItem,
  IconWrapper,
  LoadingIconWrapper,
} from '../components/styles';

import {
  useSettingsStateContext,
  useAppStateContext,
  useAppDispatchContext,
  useSettingsDispatchContext,
} from '../contexts';

import {fetchMaterialsForTheDay} from '../hooks/useGeneralInfo';
import {getItem} from '../hooks/useAsyncStorage';

import CharacterIconListUI from '../components/UI/CharacterIconListUI';
import WeaponIconListUI from '../components/UI/WeaponsIconListUI';
import RenderEvents from '../components/UI/RenderEvents';

const weekDays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const date = new Date();

const Dashboard = () => {
  const {isLoading, talentBooksToFarmForTheDay, weaponAscMatsToFarmForTheDay} =
    useAppStateContext();

  const appDispatch = useAppDispatchContext();
  const settingsDispatch = useSettingsDispatchContext();

  const settingsValue = useSettingsStateContext();

  const [todaysDay, setTodaysDay] = React.useState(null);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedMaterialInfo, setSelectedMaterialInfo] = React.useState(null);

  React.useEffect(() => {
    setTodaysDay(weekDays[date.getDay()]);

    async function handleCharacterPositionSetting() {
      const characterPositionInHomePageMaterials = await getItem(
        'characters-position-in-dashboard',
      );

      settingsDispatch({
        type: 'SET_CHARACTER_POSITION_IN_HOME_PAGE_MATERIALS',
        payload: {
          characterPositionInHomePageMaterials:
            characterPositionInHomePageMaterials || 'MODAL',
        },
      });
    }

    handleCharacterPositionSetting();
  }, [settingsDispatch]);

  React.useEffect(() => {
    if (!todaysDay) return;
    setSelectedMaterialInfo(null);

    async function getMatsForTheDay() {
      appDispatch({
        type: 'SET_LOADING',
        payload: {
          isLoading: true,
        },
      });

      const res = await fetchMaterialsForTheDay(todaysDay);

      appDispatch({
        type: 'SET_MATS_FOR_A_DAY',
        payload: {
          talentBooks: res.data.payload.talentBooks,
          ascensionMaterials: res.data.payload.ascensionMaterials,
        },
      });
    }

    getMatsForTheDay();
  }, [appDispatch, todaysDay]);

  return (
    <Container>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Heading2>{todaysDay}</Heading2>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            disabled={isLoading}
            style={{marginRight: 8}}
            onPress={() => {
              const prevDay = weekDays.findIndex(x => x === todaysDay) - 1;

              setTodaysDay(
                weekDays[prevDay < 0 ? weekDays.length - 1 : prevDay],
              );
            }}>
            <Ionicons name="arrow-back-outline" size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity
            disabled={isLoading}
            onPress={() => {
              const nextDay = weekDays.findIndex(x => x === todaysDay) + 1;

              setTodaysDay(
                weekDays[nextDay > weekDays.length - 1 ? 0 : nextDay],
              );
            }}>
            <Ionicons name="arrow-forward-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {settingsValue.characterPositionInHomePageMaterials === 'MODAL' && (
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(22, 35, 52, 0.9)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
              style={{
                flex: 1,
                width: '100%',
                height: '100%',
              }}></TouchableOpacity>
            <View
              style={{
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginHorizontal: 'auto',
                }}>
                <Small>
                  {selectedMaterialInfo &&
                    selectedMaterialInfo.type === 'TALENT_BOOK' &&
                    'Characters'}
                  {selectedMaterialInfo &&
                    selectedMaterialInfo.type === 'WEAPON_ASCENSION_MATERIAL' &&
                    'Weapons'}
                  &nbsp; that use
                </Small>

                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 1,
                    paddingHorizontal: 20,
                  }}>
                  <Heading2>
                    {selectedMaterialInfo &&
                    selectedMaterialInfo.type === 'TALENT_BOOK'
                      ? selectedMaterialInfo?.name
                      : selectedMaterialInfo?.itemName}
                  </Heading2>
                </View>
              </View>

              {selectedMaterialInfo &&
                selectedMaterialInfo.type === 'TALENT_BOOK' &&
                !isLoading &&
                typeof talentBooksToFarmForTheDay === 'object' && (
                  <CharacterIconListUI
                    characters={
                      talentBooksToFarmForTheDay.find(
                        t => t.name === selectedMaterialInfo?.name,
                      ).characters
                    }
                    imageSize={48}
                  />
                )}

              {selectedMaterialInfo &&
                selectedMaterialInfo.type === 'WEAPON_ASCENSION_MATERIAL' &&
                !isLoading &&
                typeof weaponAscMatsToFarmForTheDay === 'object' && (
                  <WeaponIconListUI
                    weapons={
                      weaponAscMatsToFarmForTheDay.find(
                        m => m.categoryName === selectedMaterialInfo?.name,
                      ).weapons
                    }
                    imageSize={48}
                  />
                )}
            </View>
          </View>
        </Modal>
      )}

      {/* Talent books for the selected day */}
      <SectionWrapper style={{marginTop: 20}}>
        <Header>
          <Body style={{color: 'white'}}>Talent Books</Body>
        </Header>

        {isLoading && (
          <View>
            <ActivityIndicator size="small" color="#e04352" />
          </View>
        )}

        <FlexboxListWrapper>
          {talentBooksToFarmForTheDay &&
            talentBooksToFarmForTheDay.map(book => {
              return (
                <FlexboxListItem
                  disabled={
                    settingsValue.characterPositionInHomePageMaterials ===
                    'BELOW'
                  }
                  onPress={() => {
                    setSelectedMaterialInfo({
                      name: book.name,
                      type: 'TALENT_BOOK',
                    });
                    setModalVisible(true);
                  }}
                  style={{width: '45%'}}
                  key={'talent-book-' + book.name}>
                  <IconWrapper style={{marginBottom: 5}}>
                    <Image
                      style={{width: 80, height: 80}}
                      source={{uri: book.iconUrl}}
                    />
                  </IconWrapper>
                  <View
                    style={{justifyContent: 'center', flexDirection: 'row'}}>
                    <Body>{book.name}</Body>
                  </View>

                  {settingsValue.characterPositionInHomePageMaterials ===
                    'BELOW' && (
                    <CharacterIconListUI
                      characters={book.characters}
                      imageSize={40}
                      margin={4}
                    />
                  )}
                </FlexboxListItem>
              );
            })}
        </FlexboxListWrapper>
      </SectionWrapper>

      {/* Weapon ascension materials for the selected day */}
      <SectionWrapper style={{marginTop: 0}}>
        <Header>
          <Body style={{color: 'white'}}>Weapon Ascension Materials</Body>
        </Header>

        {isLoading && (
          <View>
            <ActivityIndicator size="small" color="#e04352" />
          </View>
        )}

        <FlexboxListWrapper>
          {weaponAscMatsToFarmForTheDay &&
            weaponAscMatsToFarmForTheDay.map(ascMat => {
              return (
                <FlexboxListItem
                  disabled={
                    settingsValue.characterPositionInHomePageMaterials ===
                    'BELOW'
                  }
                  onPress={() => {
                    setSelectedMaterialInfo({
                      name: ascMat.categoryName,
                      itemName: ascMat.name,
                      type: 'WEAPON_ASCENSION_MATERIAL',
                    });
                    setModalVisible(true);
                  }}
                  style={{
                    width: '45%',
                    marginBottom: todaysDay === 'Sunday' ? 30 : null,
                  }}
                  key={'weapon-ascension-material-' + ascMat.categoryName}>
                  <IconWrapper style={{marginBottom: 5}}>
                    <Image
                      style={{width: 80, height: 80}}
                      source={{uri: ascMat.iconUrl}}
                    />
                  </IconWrapper>
                  <View
                    style={{justifyContent: 'center', flexDirection: 'row'}}>
                    <Body>{ascMat.name}</Body>
                  </View>

                  {settingsValue.characterPositionInHomePageMaterials ===
                    'BELOW' && (
                    <WeaponIconListUI
                      weapons={ascMat.weapons}
                      imageSize={40}
                      margin={4}
                    />
                  )}
                </FlexboxListItem>
              );
            })}
        </FlexboxListWrapper>
      </SectionWrapper>

      <RenderEvents />
    </Container>
  );
};

const Container = styled.ScrollView`
  padding: 16px 24px;
  flex: 1;
  background-color: ${props => props.theme.PRIMARY_BACKGROUND};
`;

export default Dashboard;
