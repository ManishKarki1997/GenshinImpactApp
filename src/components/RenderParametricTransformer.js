import React from 'react';
import {Image, View, Modal} from 'react-native';
import styled from 'styled-components/native';
import moment from 'moment';

import {Body, Heading2, Heading3, Small, SubtitleItalic} from './Typography';
import {useAppDispatchContext, useAppStateContext} from '../contexts';
import {getItem, setItem} from '../hooks/useAsyncStorage';
import {Header} from './styles';

const ParametricTransformer = () => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [tempResin, setTempResin] = React.useState(0);
  const [errorMessage, setErrorMessage] = React.useState('');

  const handleSetTimer = () => {};

  const handleAfterEnteringTimer = () => {};

  return (
    <Container>
      <HeaderWrapper>
        <Header>
          <Body>Parametric Transformer</Body>
        </Header>
        <TransformerOverview onPress={() => setModalVisible(true)}>
          <Image
            style={{height: 30, width: 30}}
            source={{
              uri: 'https://res.cloudinary.com/dnoibyqq2/image/upload/v1622270857/genshin-app/other-items/parametric-transformer.png',
            }}
          />
        </TransformerOverview>
      </HeaderWrapper>

      <TransformerWrapper>
        <TransformerItem>
          <Small>Reusable in about</Small>
          <Heading3>5 days, 3 hours, 5 seconds</Heading3>
        </TransformerItem>
      </TransformerWrapper>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <ModalBackground>
          <ClickableModalBg
            onPress={() => {
              setErrorMessage('');
              setModalVisible(false);
            }}
          />

          <ModalContentWrapper>
            <View style={{alignItems: 'center'}}>
              <Heading2>Last used time</Heading2>
              <SubtitleItalic>
                The last time you used the Parametric Transformer
              </SubtitleItalic>
              <View>
                <ResinInputTextBox
                  onChangeText={handleSetTimer}
                  onEndEditing={handleAfterEnteringTimer}
                  placeholder="Enter your current resin"
                  keyboardType="numeric"
                  maxLength={3}
                  style={{
                    borderColor: errorMessage ? 'red' : 'transparent',
                    borderWidth: errorMessage ? 1 : 0,
                  }}
                />
              </View>
              <Small style={{color: 'red'}}>{errorMessage}</Small>
            </View>
          </ModalContentWrapper>
        </ModalBackground>
      </Modal>
    </Container>
  );
};

const Container = styled.View`
  margin-bottom: 64px;
`;

const HeaderWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const TransformerWrapper = styled.View`
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.SECONDARY_BACKGROUND};
  padding: 8px 12px;
  border-radius: 5px;
`;

const TransformerItem = styled.View`
  align-items: center;
`;

const TransformerOverview = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const ModalBackground = styled.View`
  flex: 1;
  background-color: rgba(22, 35, 52, 0.9);
  justify-content: center;
  align-items: center;
`;

const ModalContentWrapper = styled.View`
  position: absolute;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 300px;
`;

const ClickableModalBg = styled.TouchableOpacity`
  flex: 1;
  width: 100%;
  height: 100%;
`;

const ResinInputTextBox = styled.TextInput`
  background-color: ${props => props.theme.PRIMARY_BACKGROUND};
  padding: 8px 12px;
  border-radius: 5px;
  margin-top: 8px;
`;

export default ParametricTransformer;
