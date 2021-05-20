import React from "react";
import styled from "styled-components/native";
import { ActivityIndicator, FlatList, Image } from "react-native";
import { SharedElement } from "react-navigation-shared-element";

import { Body } from "../components/Typography";
import { fetchCharacters } from "../hooks/useCharacters";

import { useAppStateContext, useAppDispatchContext } from "../contexts";

const CharactersScreen = ({ navigation }) => {
  const { isLoading, characters } = useAppStateContext();
  const appDispatch = useAppDispatchContext();

  const [isCharactersImageLoadedObj, setIsCharactersImageLoadedObj] =
    React.useState(null);

  React.useEffect(() => {
    async function getCharacters() {
      appDispatch({
        type: "SET_LOADING",
        payload: {
          isLoading: true,
        },
      });

      const res = await fetchCharacters({ infoDataSize: "minimal" });

      appDispatch({
        type: "SET_CHARACTERS",
        payload: {
          characters: res.data.payload.characters,
        },
      });

      const tempObj = {};
      res.data.payload.characters.forEach((c) => {
        tempObj[c.name] = false;
      });

      setIsCharactersImageLoadedObj(tempObj);
    }

    getCharacters();
  }, []);

  const renderItem = ({ item }) => {
    return (
      <CharacterItem
        onPress={() =>
          navigation.navigate("View Character", {
            name: item.name,
          })
        }
      >
        <SharedElement id={`${item.name.toLowerCase()}-photo`}>
          <ImageWrapper>
            {isCharactersImageLoadedObj &&
              isCharactersImageLoadedObj[item.name] !== undefined && (
                <LoadingIconWrapper>
                  <ActivityIndicator size="small" color="#e04352" />
                </LoadingIconWrapper>
              )}
            <Image
              // resizeMode="cover"
              style={{ width: 160, height: "100%" }}
              source={{
                uri: `https://res.cloudinary.com/dnoibyqq2/image/upload/v1617899636/genshin-app/characters/${item.name.toLowerCase()}/card.png`,
              }}
              onLoadEnd={() => {
                setIsCharactersImageLoadedObj({
                  ...isCharactersImageLoadedObj,
                  [item.name]: false,
                });
              }}
            />
          </ImageWrapper>
        </SharedElement>
        <TextWrapper>
          <Body>{item.name}</Body>
        </TextWrapper>
      </CharacterItem>
    );
  };

  return (
    <Container>
      {isLoading && (
        <LoadingIconWrapper>
          <ActivityIndicator size="small" color="#e04352" />
        </LoadingIconWrapper>
      )}
      {characters && (
        <FlatList
          style={{ flex: 1 }}
          columnWrapperStyle={{ justifyContent: "space-around" }}
          numColumns={2}
          data={characters}
          keyExtractor={(item) => item.name}
          renderItem={renderItem}
        />
      )}
    </Container>
  );
};

const Container = styled.View`
  padding: 16px 24px;
  flex: 1;
  background-color: ${(props) => props.theme.PRIMARY_BACKGROUND};
`;

const CharacterItem = styled.TouchableOpacity`
  margin-bottom: 32px;
  /* background-color: ${(props) => props.theme.SECONDARY_BACKGROUND}; */
`;

const TextWrapper = styled.View`
  padding: 4px 8px;
`;

const ImageWrapper = styled.View`
  height: 280px;
  border-radius: 8px;
  overflow: hidden;
`;

const LoadingIconWrapper = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  justify-content: center;
  align-items: center;
`;

export default CharactersScreen;
