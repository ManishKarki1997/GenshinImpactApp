import React from 'react';
import styled from 'styled-components/native';
import {
  Image,
  ActivityIndicator,
  View,
  Button,
  TouchableOpacity,
} from 'react-native';
import {SharedElement} from 'react-navigation-shared-element';

import {
  Body,
  Heading2,
  Heading3,
  Small,
  Subtitle,
  SubtitleItalic,
  VerySmall,
} from '../components/Typography';
import {Header, SectionWrapper} from '../components/styles';
import {
  ThemeContext,
  useAppStateContext,
  useAppDispatchContext,
} from '../contexts';
import {DarkTheme, LightTheme} from '../constants';

import {
  FlexboxListWrapper,
  FlexboxListItem,
  LoadingIconWrapper,
} from '../components/styles/BasicUI';
import {NoImageBlock} from '../components/styles';
import {findWeaponUpgradeInfo} from '../helpers';

import {fetchWeaponDetail} from '../hooks/useWeapons';

const weaponLevelUpHeaderInfo = [
  {
    name: 'A1',
    level: 20,
  },
  {
    name: 'A2',
    level: 40,
  },
  {
    name: 'A3',
    level: 50,
  },
  {
    name: 'A4',
    level: 60,
  },
  {
    name: 'A5',
    level: 70,
  },
  {
    name: 'A6',
    level: 80,
  },
];

const ViewWeapon = ({route, navigation}) => {
  const {name} = route.params;
  const {theme} = React.useContext(ThemeContext);
  const activeTheme = theme === 'light' ? LightTheme : DarkTheme;

  const {isLoading, currentlyViewingWeapon} = useAppStateContext();
  const appDispatch = useAppDispatchContext();

  const [selectedWeaponLevelNo, setSelectedWeaponLevelNo] = React.useState(80);
  const [weaponUpgradeInfo, setWeaponUpgradeInfo] = React.useState(null);

  React.useEffect(() => {
    navigation.setOptions({
      title: name.length > 16 ? `${name.substring(0, 12)}...` : name,
    });
  }, [currentlyViewingWeapon, name, navigation]);

  React.useEffect(() => {
    if (!currentlyViewingWeapon) return;

    const tempWeaponUpgradeInfo = findWeaponUpgradeInfo(
      currentlyViewingWeapon,
      selectedWeaponLevelNo,
    );
    setWeaponUpgradeInfo(tempWeaponUpgradeInfo);
  }, [selectedWeaponLevelNo, currentlyViewingWeapon]);

  React.useEffect(() => {
    async function getWeaponDetail() {
      appDispatch({
        type: 'SET_LOADING',
        payload: {
          isLoading: true,
        },
      });

      const res = await fetchWeaponDetail(route.params.name);

      appDispatch({
        type: 'SET_CURRENTLY_VIEWING_WEAPON',
        payload: {
          weapon: res.data.payload.weapon,
        },
      });
    }

    getWeaponDetail();
  }, [appDispatch, route.params.name]);

  return (
    <Container>
      <SharedElement
        style={{
          justifyContent: 'center',
        }}
        id={`weapon-${name.toLowerCase()}-photo`}>
        <View style={{justifyContent: 'center', flexDirection: 'row'}}>
          <ImageWrapper>
            <Image
              source={{
                uri: `https://res.cloudinary.com/dnoibyqq2/image/upload/v1620834711/genshin-app/weapons/${route.params.name
                  .split("'")
                  .join('_')
                  .split(' ')
                  .join('-')}.png`,
              }}
              style={{
                width: '100%',
                height: '100%',
                justifyContent: 'center',
              }}
            />
            {/* {currentlyViewingWeapon.isReleased ? (
              <Image
                source={{
                  uri: `https://res.cloudinary.com/dnoibyqq2/image/upload/v1620834711/genshin-app/weapons/${route.params.name
                    .split("'")
                    .join('_')
                    .split(' ')
                    .join('-')}.png`,
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  justifyContent: 'center',
                }}
              />
            ) : (
              <NoImageBlock style={{width: '100%', height: 150}}>
                <Heading3>N/A</Heading3>
              </NoImageBlock>
            )} */}
          </ImageWrapper>
        </View>
      </SharedElement>

      <MainWrapper style={{minHeight: 300}}>
        {isLoading ? (
          <LoadingIconWrapper>
            <ActivityIndicator size="large" color="#e04352" />
          </LoadingIconWrapper>
        ) : (
          currentlyViewingWeapon && (
            <>
              <TextWrapper>
                <Heading2>{currentlyViewingWeapon.rarity}*</Heading2>
                <Body>({currentlyViewingWeapon.weaponType})</Body>
                <Heading3 style={{marginBottom: 16, justifyContent: 'center'}}>
                  {currentlyViewingWeapon.name}
                </Heading3>
                <Subtitle>{currentlyViewingWeapon.passiveAbility}</Subtitle>
                <SubtitleItalic>
                  {currentlyViewingWeapon.description}
                </SubtitleItalic>
              </TextWrapper>

              {/* materials used to ascend this weapon */}
              <SectionWrapper style={{marginTop: 32}}>
                <Header>
                  <Body style={{color: 'white'}}>Ascension Materials</Body>
                </Header>

                <FlexboxListWrapper>
                  {currentlyViewingWeapon.ascensionMaterials.length === 0 && (
                    <Small>Weapon Yet To Be Released</Small>
                  )}
                  {currentlyViewingWeapon.ascensionMaterials.map(m => {
                    return (
                      <FlexboxListItem
                        key={'ascension-material-' + m.name}
                        style={{width: '45%', marginBottom: 24}}>
                        <IconWrapper>
                          <Image
                            style={{height: 80, width: 80}}
                            source={{uri: m.iconUrl}}
                          />
                        </IconWrapper>
                        <Small>{m.name}</Small>
                      </FlexboxListItem>
                    );
                  })}
                </FlexboxListWrapper>
              </SectionWrapper>

              {/* Weapon ascension cost calculator */}
              <SectionWrapper>
                <Header>
                  <Small style={{color: 'white'}}>Ascension Cost</Small>
                </Header>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    marginBottom: 30,
                  }}>
                  {weaponLevelUpHeaderInfo.map((info, index) => {
                    return (
                      <AscensionLevelWrapper
                        key={info.name + '-' + info.count + '-' + index}
                        onPress={() => setSelectedWeaponLevelNo(info.level)}
                        style={{
                          backgroundColor:
                            selectedWeaponLevelNo === info.level
                              ? activeTheme.SECONDARY_BACKGROUND
                              : null,
                        }}>
                        <Small>
                          {info.name} Lv({info.level})
                        </Small>
                      </AscensionLevelWrapper>
                    );
                  })}
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                  }}>
                  {weaponUpgradeInfo &&
                    weaponUpgradeInfo.map((mat, index) => {
                      return (
                        <View
                          key={mat?.name + '-material-' + index}
                          style={{
                            marginBottom: 30,
                            width: '45%',
                            flexDirection: 'column',
                            alignItems: 'center',
                          }}>
                          <IconWrapper style={{width: '100%', height: 70}}>
                            <Heading3>{mat.count} x </Heading3>
                            <Image
                              source={{uri: mat.iconUrl}}
                              style={{height: 50, width: 50}}
                            />
                          </IconWrapper>
                          <Small>{mat.name}</Small>
                        </View>
                      );
                    })}
                </View>
              </SectionWrapper>

              {/* characters that can use this weapon */}
              {/* <SectionWrapper style={{ marginTop: 32 }}>
            <Header>
              <Body>Applicable Characters</Body>
            </Header>

            <FlexboxListWrapper>
              {currentlyViewingWeapon.characters.map((m) => {
                return (
                  <FlexboxListItem
                    key={"applicable-character-" + m.name}
                    onPress={() =>
                      navigation.navigate("View Character", {
                        name: m.name,
                      })
                    }
                    style={{ marginRight: 20, marginBottom: 20 }}
                  >
                    <Image
                      style={{ height: 80, width: 80, borderRadius: 5 }}
                      source={{ uri: m.cardImageURL }}
                    />
                    <Small>{m.name}</Small>
                  </FlexboxListItem>
                );
              })}
            </FlexboxListWrapper>
          </SectionWrapper>
        */}
            </>
          )
        )}
      </MainWrapper>
    </Container>
  );
};

ViewWeapon.sharedElements = route => {
  const {name} = route.params;
  return [`weapon-${name.toLowerCase()}-photo`];
};

const Container = styled.ScrollView`
  padding: 16px 20px;
  flex: 1;
  background-color: ${props => props.theme.PRIMARY_BACKGROUND};
`;

const MainWrapper = styled.View`
  margin-top: 32px;
`;

const TextWrapper = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ImageWrapper = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  overflow: hidden;
  width: 200px;
  height: 180px;
`;

const AscensionLevelWrapper = styled.TouchableOpacity`
  margin-right: 10px;
  margin-bottom: 15px;
  padding: 4px 10px;
  border-radius: 5px;
`;

const IconWrapper = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 2px;
  margin-bottom: 16px;
  border-radius: 8px;
  background-color: ${props => props.theme.SECONDARY_BACKGROUND};
`;

export default ViewWeapon;
