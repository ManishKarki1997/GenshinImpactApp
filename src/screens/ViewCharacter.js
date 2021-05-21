import React from 'react';
import styled from 'styled-components/native';
import {Image, ActivityIndicator, View, TouchableOpacity} from 'react-native';
import {SharedElement} from 'react-navigation-shared-element';
import {useNetInfo} from '@react-native-community/netinfo';

import {Body, Heading3, Small, Subtitle} from '../components/Typography';
import {LoadingIconWrapper} from '../components/styles';
import {ThemeContext} from '../contexts/ThemeContext';
import {DarkTheme, LightTheme} from '../constants';
import {
  findCharacterAscensionMaterialsInfo,
  findTalentUpgradeMaterials,
} from '../helpers';
import {useAppStateContext, useAppDispatchContext} from '../contexts';
import {fetchCharacterDetail} from '../hooks/useCharacters';

const combatTalentNamesStatic = {
  1: 'normal-attack',
  2: 'elemental-skill',
  3: 'elemental-burst',
};

const skillGifsToFileMap = {
  NORMAL: 'normal-attack',
  PRESS: 'skill-press',
  HOLD: 'skill-hold',
  BURST: 'burst',
};

const characterLevelUpHeaderInfo = [
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

const ViewCharacter = ({route, navigation}) => {
  const netInfo = useNetInfo();

  const {isLoading, currentlyViewingCharacter} = useAppStateContext();
  const appDispatch = useAppDispatchContext();

  const {theme} = React.useContext(ThemeContext);
  const activeTheme = theme === 'light' ? LightTheme : DarkTheme;

  const [activeSkillGifTab, setActiveSkillGifTab] =
    React.useState('Normal Attack');

  const [selectedCharacterLevel, setSelectedCharacterLevel] =
    React.useState(80);

  const [selectedTalentLevelUpLevel, setSelectedTalentLevelUpLevel] =
    React.useState(10);

  const [characterLevelAscensionInfo, setCharacterLevelAscensionInfo] =
    React.useState(null);

  const [characterTalentLevelUpInfo, setCharacterTalentLevelUpInfo] =
    React.useState(null);

  const [activeSkillGif, setActiveSkillGif] = React.useState(null);
  const [isLoadingSkillGif, setIsLoadingSkillGif] = React.useState(true);

  React.useEffect(() => {
    async function getCharacter() {
      appDispatch({
        type: 'SET_LOADING',
        payload: {
          isLoading: true,
        },
      });

      const res = await fetchCharacterDetail(route.params.name);

      appDispatch({
        type: 'SET_CURRENTLY_VIEWING_CHARACTER',
        payload: {
          character: res.data.payload.character,
        },
      });
    }

    getCharacter();
  }, [appDispatch, route.params.name]);

  React.useEffect(() => {
    if (!currentlyViewingCharacter) return;

    const skillType = currentlyViewingCharacter.combatSkills.find(
      c => c.name === activeSkillGifTab,
    );
    const exactVariant = skillType.variants.filter(
      v => v.type && v.description && v.fileName,
    )[0];

    setActiveSkillGif(exactVariant);
  }, [activeSkillGifTab, currentlyViewingCharacter]);

  React.useEffect(() => {
    navigation.setOptions({
      title: route.params.name,
    });
  }, [navigation, route.params.name]);

  React.useEffect(() => {
    if (!currentlyViewingCharacter) return;

    const allAscensionStatMats = findCharacterAscensionMaterialsInfo(
      currentlyViewingCharacter,
      selectedCharacterLevel,
    );
    setCharacterLevelAscensionInfo(allAscensionStatMats);
  }, [selectedCharacterLevel, currentlyViewingCharacter]);

  React.useEffect(() => {
    if (currentlyViewingCharacter) {
      const talentLvlInfoTemp = findTalentUpgradeMaterials(
        currentlyViewingCharacter,
        selectedTalentLevelUpLevel,
      ).filter(x => x);
      setCharacterTalentLevelUpInfo(talentLvlInfoTemp);
    }
  }, [selectedTalentLevelUpLevel, currentlyViewingCharacter]);

  return (
    <Container>
      <SharedElement id={`${route.params.name.toLowerCase()}-photo`}>
        <ImageWrapper>
          <Image
            source={{
              uri: `https://res.cloudinary.com/dnoibyqq2/image/upload/v1617899636/genshin-app/characters/${route.params.name}/compressed.jpg`,
            }}
            style={{
              height: '100%',
              width: '100%',
              borderRadius: 8,
            }}
          />
        </ImageWrapper>
      </SharedElement>

      {/* {isLoading && (
        <View>
          <ActivityIndicator size="large" color="#e04352" />
        </View>
      )} */}

      {currentlyViewingCharacter && (
        <>
          <SectionWrapper>
            <Header>
              <Small style={{color: 'white'}}>Bio</Small>
            </Header>
            <Small>{currentlyViewingCharacter.description}</Small>
          </SectionWrapper>

          {/* Character Ascension Costs Calculator */}
          <SectionWrapper>
            <Header>
              <Small style={{color: 'white'}}>Ascension Cost</Small>
            </Header>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                flexWrap: 'wrap',
                marginBottom: 20,
              }}>
              {characterLevelUpHeaderInfo.map((info, index) => {
                return (
                  <AscensionLevelWrapper
                    key={info.name + '-' + info.count + '-' + index}
                    onPress={() => setSelectedCharacterLevel(info.level)}
                    style={{
                      backgroundColor:
                        selectedCharacterLevel === info.level
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
              {characterLevelAscensionInfo &&
                characterLevelAscensionInfo.map((mat, index) => {
                  return (
                    <View
                      key={mat.name + '-material-' + index}
                      style={{
                        marginBottom: 20,
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

          {/* Talent books for the character */}
          <SectionWrapper>
            <Header>
              <Small style={{color: 'white'}}>Talent Books</Small>
            </Header>
            <View
              style={{
                flexDirection: 'row',
                // alignItems: "center",
                justifyContent: 'space-between',
                flexWrap: 'wrap',
              }}>
              {currentlyViewingCharacter.talentBook.map((talentBook, idx) => {
                return (
                  <View
                    key={'talent-book-' + talentBook.name + '-' + idx}
                    style={{
                      width: '45%',
                      // marginRight: 20,
                      marginBottom: 20,
                    }}>
                    <IconWrapper>
                      <Image
                        source={{uri: talentBook.iconUrl}}
                        style={{height: 60, width: 60}}
                      />
                    </IconWrapper>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        marginTop: 4,
                      }}>
                      <Small>{talentBook.name}</Small>
                    </View>
                  </View>
                );
              })}
            </View>
          </SectionWrapper>

          {/* Talent Boss Materials */}
          <SectionWrapper>
            <Header>
              <Small style={{color: 'white'}}>Talent Boss Material</Small>
            </Header>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}>
              {currentlyViewingCharacter.talentMaterial.map(
                (talentBossMaterial, idx) => {
                  return (
                    <View
                      key={'talent-book-' + talentBossMaterial.name + '-' + idx}
                      style={{
                        marginRight: 20,
                        marginBottom: 20,
                      }}>
                      <IconWrapper>
                        <Image
                          source={{uri: talentBossMaterial.iconUrl}}
                          style={{height: 60, width: 60}}
                        />
                      </IconWrapper>
                      <Small>{talentBossMaterial.name}</Small>
                    </View>
                  );
                },
              )}
            </View>
          </SectionWrapper>

          {/* Local Specialty */}
          <SectionWrapper>
            <Header>
              <Small style={{color: 'white'}}>Local Specialty</Small>
            </Header>
            <View
              style={{
                alignItems: 'center',
                flexWrap: 'wrap',
              }}>
              <IconWrapper style={{width: '35%'}}>
                <Image
                  source={{
                    uri: currentlyViewingCharacter.localSpecialty?.iconUrl,
                  }}
                  style={{height: 60, width: 60}}
                />
              </IconWrapper>
              <Small>{currentlyViewingCharacter.localSpecialty?.name}</Small>
            </View>
          </SectionWrapper>

          {/* Common Ascension Materials */}
          <SectionWrapper>
            <Header>
              <Small style={{color: 'white'}}>Common Ascension Materials</Small>
            </Header>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
              }}>
              {currentlyViewingCharacter.commonAscensionMaterials.map(
                (commonAscensionMaterial, idx) => {
                  return (
                    <View
                      key={
                        'talent-book-' +
                        commonAscensionMaterial.name +
                        '-' +
                        idx
                      }
                      style={{
                        width: '45%',
                        marginBottom: 20,
                        flexDirection: 'column',
                      }}>
                      <IconWrapper style={{width: '100%'}}>
                        <Image
                          source={{uri: commonAscensionMaterial.iconUrl}}
                          style={{height: 60, width: 60}}
                        />
                      </IconWrapper>
                      <Small>{commonAscensionMaterial.name}</Small>
                    </View>
                  );
                },
              )}
            </View>
          </SectionWrapper>

          {/* Talent Level up cost calculator */}
          <SectionWrapper>
            <Header>
              <Small style={{color: 'white'}}>
                Talent Level up Costs (Per Skill)
              </Small>
            </Header>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                flexWrap: 'wrap',
                marginBottom: 20,
              }}>
              {[...Array.from({length: 10}, (_, i) => i + 1)].map(n => {
                return (
                  n !== 1 && (
                    <AscensionLevelWrapper
                      onPress={() => setSelectedTalentLevelUpLevel(n)}
                      key={'talent-level-up-header=#' + n}
                      style={{
                        backgroundColor:
                          selectedTalentLevelUpLevel === n
                            ? activeTheme.SECONDARY_BACKGROUND
                            : null,
                      }}>
                      <Small>Lvl {n}</Small>
                    </AscensionLevelWrapper>
                  )
                );
              })}
            </View>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
              }}>
              {characterTalentLevelUpInfo &&
                characterTalentLevelUpInfo.map((talentLevelUpItem, idx) => {
                  return (
                    <View
                      key={'talent-item-' + talentLevelUpItem.name + '-' + idx}
                      style={{
                        width: '45%',
                        marginBottom: 20,
                        flexDirection: 'column',
                      }}>
                      <IconWrapper style={{width: '100%'}}>
                        <Image
                          source={{uri: talentLevelUpItem.iconUrl}}
                          style={{height: 60, width: 60}}
                        />
                      </IconWrapper>
                      <Small>
                        {talentLevelUpItem.count}x {talentLevelUpItem.name}
                      </Small>
                    </View>
                  );
                })}
            </View>
          </SectionWrapper>

          {/* Skills Gifs */}
          {netInfo.isConnected && (
            <SectionWrapper>
              <Header>
                <Small style={{color: 'white'}}>Skills Media</Small>
              </Header>

              <SkillsTabWrapper>
                {currentlyViewingCharacter.combatSkills.map((skill, index) => {
                  return (
                    skill.variants.some(x => x.fileName) && (
                      <SkillTab
                        key={'skill-tab-' + skill.name}
                        onPress={() => {
                          setActiveSkillGifTab(skill.name);
                          // setIsLoadingSkillGif(true);
                        }}
                        style={{
                          backgroundColor:
                            activeSkillGifTab === skill.name
                              ? activeTheme.SECONDARY_BACKGROUND
                              : null,
                        }}>
                        <Small>{skill.name}</Small>
                      </SkillTab>
                    )
                  );
                })}
              </SkillsTabWrapper>

              <SkillGifWrapper>
                {isLoadingSkillGif && (
                  <LoadingIconWrapper>
                    <ActivityIndicator size="small" color="#e04352" />
                  </LoadingIconWrapper>
                )}
                <Image
                  source={{
                    uri: `https://res.cloudinary.com/dnoibyqq2/image/upload/v1617899739/genshin-app/characters/${currentlyViewingCharacter.name.toLowerCase()}/gifs/${
                      skillGifsToFileMap[activeSkillGif?.type]
                    }`,
                  }}
                  onLoadStart={() => {
                    setIsLoadingSkillGif(true);
                  }}
                  onLoadEnd={() => {
                    setIsLoadingSkillGif(false);
                  }}
                  style={{width: '100%', height: '100%'}}
                />
              </SkillGifWrapper>
            </SectionWrapper>
          )}

          {/* Skills Description */}
          <SectionWrapper>
            <Header>
              <Small style={{color: 'white'}}>Skills</Small>
            </Header>

            {currentlyViewingCharacter.combatSkills.map(
              (combatSkill, index) => {
                return (
                  <ItemWrapper key={combatSkill + '-' + index}>
                    <ItemTextWrapper>
                      <Image
                        source={{
                          uri: `https://res.cloudinary.com/dnoibyqq2/image/upload/v1617899736/genshin-app/characters/${currentlyViewingCharacter.name.toLowerCase()}/icons/${
                            combatTalentNamesStatic[index + 1]
                          }.png`,
                        }}
                        style={{width: 30, height: 30, marginRight: 16}}
                      />

                      <View style={{flexShrink: 1}}>
                        <Heading3>
                          {currentlyViewingCharacter.skillTalents[index].name}
                        </Heading3>
                      </View>
                    </ItemTextWrapper>
                    <View style={{padding: 8}}>
                      <Small>
                        {
                          currentlyViewingCharacter.skillTalents[index]
                            .description
                        }
                      </Small>
                    </View>
                  </ItemWrapper>
                );
              },
            )}

            <Header>
              <Small style={{color: 'white'}}>Passive Talents</Small>
            </Header>

            {currentlyViewingCharacter.passiveTalents.map(
              (passiveTalent, index) => {
                return (
                  <ItemWrapper key={passiveTalent.name + '-' + index}>
                    <ItemTextWrapper>
                      <Image
                        source={{
                          uri: `https://res.cloudinary.com/dnoibyqq2/image/upload/v1617899736/genshin-app/characters/${currentlyViewingCharacter.name.toLowerCase()}/icons/t${
                            index + 1
                          }.png`,
                        }}
                        style={{width: 30, height: 30, marginRight: 16}}
                      />

                      <View style={{flexShrink: 1}}>
                        <Heading3>{passiveTalent.name}</Heading3>
                      </View>
                    </ItemTextWrapper>
                    <View style={{padding: 8}}>
                      <Small>{passiveTalent.description}</Small>
                    </View>
                  </ItemWrapper>
                );
              },
            )}
          </SectionWrapper>
          {/* Constellations Description */}
          <SectionWrapper>
            <Header>
              <Small style={{color: 'white'}}>Constellations</Small>
            </Header>

            {currentlyViewingCharacter.constellations.map(
              (constellation, index) => {
                return (
                  <ItemWrapper key={constellation.name + '-' + index}>
                    <ItemTextWrapper>
                      <Image
                        source={{
                          uri: `https://res.cloudinary.com/dnoibyqq2/image/upload/v1617899735/genshin-app/characters/${currentlyViewingCharacter.name.toLowerCase()}/icons/c${
                            index + 1
                          }.png`,
                        }}
                        style={{width: 30, height: 30, marginRight: 16}}
                      />

                      <View style={{flexShrink: 1}}>
                        <Heading3>{constellation.name}</Heading3>
                      </View>
                    </ItemTextWrapper>
                    <View style={{padding: 8, flexShrink: 1}}>
                      <Small>{constellation.description}</Small>
                    </View>
                  </ItemWrapper>
                );
              },
            )}
          </SectionWrapper>
        </>
      )}
    </Container>
  );
};

ViewCharacter.sharedElements = route => {
  const {name} = route.params;
  return [`${name.toLowerCase()}-photo`];
};

const Container = styled.ScrollView`
  padding: 16px 20px;
  flex: 1;
  background-color: ${props => props.theme.PRIMARY_BACKGROUND};
`;

const ImageWrapper = styled.View`
  width: 100%;
  height: 620px;
  /* border-radius: 8px; */
  overflow: hidden;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;
  margin-bottom: 32px;
`;

const Header = styled.View`
  background-color: #e04352;
  border-radius: 8px;
  align-self: flex-start;
  text-align: center;
  padding: 4px 16px;
  margin-bottom: 16px;
`;

const SectionWrapper = styled.View`
  width: 100%;
  margin-bottom: 48px;
  padding: 8px;
`;

const ItemWrapper = styled.View`
  width: 100%;
  margin-bottom: 16px;
  background-color: ${props => props.theme.SECONDARY_BACKGROUND};
  border-radius: 5px;
  padding: 8px;
`;
const ItemTextWrapper = styled.View`
  flex-direction: row;
  margin-left: 8px;
`;

const SkillsTabWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  /* justify-content: center; */
  flex-wrap: wrap;
`;

const SkillTab = styled.TouchableOpacity`
  border-radius: 5px;
  padding: 4px 8px;
  margin-right: 8px;
  margin-bottom: 8px;
`;

const SkillGifWrapper = styled.View`
  position: relative;
  background-color: ${props => props.theme.SECONDARY_BACKGROUND};
  width: 100%;
  height: 250px;
  border-radius: 5px;
  overflow: hidden;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const IconWrapper = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 2px;
  border-radius: 8px;
  background-color: ${props => props.theme.SECONDARY_BACKGROUND};
`;

const AscensionLevelWrapper = styled.TouchableOpacity`
  margin-right: 10px;
  margin-bottom: 15px;
  padding: 4px 10px;
  border-radius: 5px;
`;

export default ViewCharacter;
