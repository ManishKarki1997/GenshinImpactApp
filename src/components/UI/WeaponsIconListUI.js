import React from 'react';
import {Image} from 'react-native';
import styled from 'styled-components/native';

import {useNavigation} from '@react-navigation/native';

const WeaponsListUI = ({weapons, imageSize, margin}) => {
  const navigation = useNavigation();

  if (!weapons) return <MainWrapper></MainWrapper>;

  return (
    <MainWrapper>
      <WeaponIconListWrapper>
        {weapons.map((c, index) => {
          return (
            <ImageWrapper
              onPress={() => {
                navigation.navigate('View Weapon', {
                  name: c.name,
                });
              }}
              style={{
                height: imageSize || 80,
                width: imageSize || 80,
                marginRight: margin || 10,
              }}
              key={'weapon-' + c.name + '-' + index}>
              <Image
                source={{
                  uri: c.iconUrl,
                }}
                // source={c.cardImageURL}
                style={{width: '100%', height: '100%', borderRadius: 5}}
              />
            </ImageWrapper>
          );
        })}
      </WeaponIconListWrapper>
    </MainWrapper>
  );
};

const MainWrapper = styled.View`
  justify-content: center;
  width: 100%;
`;

const WeaponIconListWrapper = styled.View`
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

export default WeaponsListUI;
