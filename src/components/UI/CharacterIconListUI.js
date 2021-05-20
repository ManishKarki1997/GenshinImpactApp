import React from "react";
import { Image } from "react-native";
import styled from "styled-components/native";

import { useNavigation } from "@react-navigation/native";
import { ThemeContext } from "../../contexts/ThemeContext";
import { DarkTheme, LightTheme } from "../../constants";

const CharacterListUI = ({ characters, imageSize, margin }) => {
  const navigation = useNavigation();

  const { theme } = React.useContext(ThemeContext);
  const activeTheme = theme === "light" ? LightTheme : DarkTheme;

  return (
    <MainWrapper>
      <CharacterIconListWrapper>
        {characters.map((c) => {
          return (
            <ImageWrapper
              onPress={() => {
                navigation.navigate("View Character", {
                  name: c.name,
                });
              }}
              style={{
                height: imageSize || 80,
                width: imageSize || 80,
                marginRight: margin || 10,
                backgroundColor: activeTheme.PRIMARY_BACKGROUND,
                borderRadius: 5,
              }}
              key={"character-" + c.name}
            >
              <Image
                source={{
                  uri: c.iconUrl,
                  // uri: `https://res.cloudinary.com/dnoibyqq2/image/upload/v1617899636/genshin-app/characters/${c.name.toLowerCase()}/card.png`,
                }}
                style={{ width: "100%", height: "100%", borderRadius: 5 }}
              />
            </ImageWrapper>
          );
        })}
      </CharacterIconListWrapper>
    </MainWrapper>
  );
};

const MainWrapper = styled.View`
  justify-content: center;
  width: 100%;
`;

const CharacterIconListWrapper = styled.View`
  width: 90%;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  margin: 20px auto;
`;

const ImageWrapper = styled.TouchableOpacity`
  margin-right: 10px;
  margin-bottom: 10px;
  width: 80px;
  height: 80px;
`;

export default CharacterListUI;
