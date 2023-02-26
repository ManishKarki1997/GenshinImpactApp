import React from "react";
import styled from "styled-components/native";
import { ActivityIndicator, FlatList, Image, View } from "react-native";
import { SharedElement } from "react-navigation-shared-element";

import {
  Body,
  Heading3,
  Small,
  Subtitle,
  SubtitleItalic,
  VerySmall,
} from "../components/Typography";

import { fetchWeapons } from "../hooks/useWeapons";

import { LoadingIconWrapper, NoImageBlock } from "../components/styles";
import { ThemeContext } from "../contexts/ThemeContext";
import { DarkTheme, LightTheme } from "../constants";

import { useAppStateContext, useAppDispatchContext } from "../contexts";

const weaponTypes = ["All", "Claymore", "Polearm", "Sword", "Bow", "Catalyst"];

const Weapons = ({ navigation }) => {
  const { isLoading, weapons } = useAppStateContext();
  const appDispatch = useAppDispatchContext();

  const { theme } = React.useContext(ThemeContext);
  const activeTheme = theme === "light" ? LightTheme : DarkTheme;

  const [selectedWeaponType, setSelectedWeaponType] = React.useState("All");
  const [filteredWeaponsByType, setFilteredWeaponsByType] = React.useState([]);

  React.useEffect(() => {
    async function getWeapons() {
      appDispatch({
        type: "SET_LOADING",
        payload: {
          isLoading: true,
        },
      });

      const res = await fetchWeapons({ infoDataSize: "minimal" });

      appDispatch({
        type: "SET_WEAPONS",
        payload: {
          weapons: res.data.payload.weapons,
        },
      });
    }

    getWeapons();
  }, []);

  const renderItem = ({ item }) => {
    return (
      <WeaponItem
        onPress={() =>
          navigation.navigate("View Weapon", {
            name: item.name,
          })
        }
      >
        <SharedElement id={`weapon-${item.name.toLowerCase()}-photo`}>
          <ImageWrapper>
            {item.isReleased ? (
              <Image
                style={{ width: 150, height: 150 }}
                source={{ uri: item.iconUrl }}
              />
            ) : (
              <NoImageBlock style={{ width: "100%", height: 150 }}>
                <Heading3>Unreleased</Heading3>
              </NoImageBlock>
            )}
          </ImageWrapper>
        </SharedElement>
        <TextWrapper>
          <Small>{item.name}</Small>
        </TextWrapper>
      </WeaponItem>
    );
  };

  React.useEffect(() => {
    if (!weapons) return;

    if (selectedWeaponType === "All") {
      setFilteredWeaponsByType(
        weapons.sort(
          (a, b) => b.isReleased - a.isReleased || b.rarity - a.rarity
        )
      );
    } else {
      const filtered = weapons
        .filter((w) => w.weaponType === selectedWeaponType)
        .sort((a, b) => b.isReleased - a.isReleased || b.rarity - a.rarity);

      setFilteredWeaponsByType(filtered);
    }
  }, [selectedWeaponType, weapons]);

  return (
    <Container>
      {isLoading && (
        <LoadingIconWrapper>
          <ActivityIndicator size="small" color="#e04352" />
        </LoadingIconWrapper>
      )}

      {!isLoading && weapons && (
        <View style={{ flex: 1, marginBottom: 20 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {weaponTypes.map((weaponType) => {
              return (
                <WeaponTypeTextWrapper
                  onPress={() => setSelectedWeaponType(weaponType)}
                  style={{
                    backgroundColor:
                      selectedWeaponType === weaponType
                        ? activeTheme.SECONDARY_BACKGROUND
                        : null,
                  }}
                  key={"weapon-type-" + weaponType}
                >
                  <Body>{weaponType}</Body>
                </WeaponTypeTextWrapper>
              );
            })}
          </View>
          <FlatList
            style={{ flex: 1, marginTop: 20 }}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            numColumns={2}
            data={filteredWeaponsByType.sort()}
            keyExtractor={(item, index) => item.name + "-" + index}
            renderItem={renderItem}
          />
        </View>
      )}
    </Container>
  );
};

const Container = styled.View`
  padding: 16px 24px;
  flex: 1;
  background-color: ${(props) => props.theme.PRIMARY_BACKGROUND};
`;

const WeaponItem = styled.TouchableOpacity`
  margin-bottom: 32px;
  width: 45%;
`;

const TextWrapper = styled.View`
  padding: 4px 8px;
  flex-direction: row;
  margin-top: 8px;
  justify-content: center;
`;

const ImageWrapper = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  overflow: hidden;
`;

const WeaponTypeTextWrapper = styled.TouchableOpacity`
  margin-right: 10px;
  margin-bottom: 15px;
  padding: 4px 10px;
  border-radius: 5px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export default Weapons;
