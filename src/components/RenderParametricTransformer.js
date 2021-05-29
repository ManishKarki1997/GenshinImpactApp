import React from 'react';
import {Image, View, Modal} from 'react-native';
import styled from 'styled-components/native';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';

import {
  Body,
  Heading2,
  Heading3,
  Small,
  SubtitleItalic,
  VerySmall,
} from './Typography';
import {
  useAppDispatchContext,
  useAppStateContext,
  useSettingsStateContext,
} from '../contexts';
import {getItem, setItem} from '../hooks/useAsyncStorage';
import {Header} from './styles';

import {scheduleNotification, cancelNotification} from '../helpers';
import {NotificationIds} from '../constants';

const ParametricTransformer = () => {
  const appDispatch = useAppDispatchContext();

  const {slackTimeInMinsForTimer} = useSettingsStateContext();

  const {lastSetParametricTransformer} = useAppStateContext();

  const [modalVisible, setModalVisible] = React.useState(false);
  const [lastUsedTransformerDateTime, setLastUsedTransformerDateTime] =
    React.useState(() => new Date());
  const [errorMessage, setErrorMessage] = React.useState('');
  const [replenishTime, setReplenishTime] = React.useState(0);
  const timer = React.useRef();

  // check if resin info is stored in async storage
  React.useEffect(() => {
    async function checkAsyncStorageForParametricTransformer() {
      const lastSetParametricTransformerData = await getItem(
        'genshin-app-parametric-transformer-time',
        true,
      );

      if (!lastSetParametricTransformerData) {
        appDispatch({
          type: 'SET_PARAMETRIC_TRANSFORMER',
          payload: {
            lastSetParametricTransformer: new Date(),
          },
        });
        return;
      }

      appDispatch({
        type: 'SET_PARAMETRIC_TRANSFORMER',
        payload: {
          lastSetParametricTransformer: new Date(
            lastSetParametricTransformerData,
          ),
        },
      });
    }

    checkAsyncStorageForParametricTransformer();
  }, []);

  const handleSetTimer = () => {
    const timeSetInFuture = moment().isBefore(lastUsedTransformerDateTime);

    const timeSetBefore6Days = moment
      .duration(moment().diff(lastUsedTransformerDateTime))
      .asHours();

    // 166 = 6 days 22 hrs, the reset time for parametric transformer
    if (timeSetBefore6Days > 0 && timeSetBefore6Days > 166) {
      setErrorMessage('Time cannot be 6 days and 22 hours before.');
      return;
    }

    if (timeSetInFuture) {
      setErrorMessage('Time cannot be set in the future');
      return;
    }

    setErrorMessage('');

    appDispatch({
      type: 'SET_PARAMETRIC_TRANSFORMER',
      payload: {
        lastSetParametricTransformer: lastUsedTransformerDateTime,
      },
    });

    setItem(
      'genshin-app-parametric-transformer-time',
      lastUsedTransformerDateTime.toString(),
      true,
    );

    cancelNotification(NotificationIds.TRANSFORMER_NOTIFICATION_ID);

    const elapsedHours = moment
      .duration(moment().diff(lastSetParametricTransformer))
      .asHours();

    const remainingHours = 166 - elapsedHours;
    const remainingMins = Math.round(remainingHours * 60);

    console.log({remainingMins, slackTimeInMinsForTimer});

    scheduleNotification({
      id: NotificationIds.TRANSFORMER_NOTIFICATION_ID,
      title: 'Parametric Transformer',
      message: 'You can probably use your Parametric Transformer now.',
      date:
        remainingMins <= slackTimeInMinsForTimer
          ? new Date(Date.now() + 3 * 1000)
          : new Date(Date.now() + remainingHours * 60 * 60 * 1000),
    });

    setModalVisible(false);
  };

  const calculateTimeLeft = () => {
    let timeLeft = [];

    const currentDateTime = new Date();

    const elapsedHours = moment
      .duration(moment().diff(lastSetParametricTransformer))
      .asHours();

    const remainingMins = (166 - elapsedHours) * 60;

    // x = milliseconds
    const timeTillFull = moment(currentDateTime)
      .add(remainingMins, 'minutes')
      .format('x');

    const diff = parseInt(timeTillFull) - currentDateTime;

    if (diff > 0) {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24)).toString();

      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
        .toString()
        .padStart(2, '0');

      const minutes = Math.floor((diff / 1000 / 60) % 60)
        .toString()
        .padStart(2, '0');

      const seconds = Math.floor((diff / 1000) % 60)
        .toString()
        .padStart(2, '0');

      timeLeft = [days, hours, minutes, seconds];
    }
    return timeLeft;
  };

  //   Bug : skips a second,
  // resin timer works properly, but not this timer

  React.useEffect(() => {
    timer.current = setInterval(() => {
      setReplenishTime(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer.current);
  }, [
    lastUsedTransformerDateTime,
    lastSetParametricTransformer,
    replenishTime,
  ]);

  return (
    <Container>
      <HeaderWrapper>
        <Header style={{flexDirection: 'row', alignItems: 'center'}}>
          <Body style={{color: 'white'}}>Parametric Transformer</Body>
          <VerySmall style={{marginLeft: 8}}>(Beta)</VerySmall>
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
          <Heading3>
            {!replenishTime || replenishTime.length == 0
              ? 'x days, y hrs, z mins, 0 s'
              : `${replenishTime[0]} days, ${replenishTime[1]} hrs, ${replenishTime[2]} mins, ${replenishTime[3]}s`}
          </Heading3>
        </TransformerItem>
      </TransformerWrapper>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <ModalBackground>
          <ClickableModalBg
            onPress={() => {
              handleSetTimer();
            }}
          />

          <ModalContentWrapper>
            <View style={{alignItems: 'center'}}>
              <Heading2 style={{color: 'white'}}>Last used time</Heading2>
              <SubtitleItalic>
                The last time you used the Parametric Transformer
              </SubtitleItalic>
              <View style={{marginTop: 20}}>
                <DatePicker
                  date={lastUsedTransformerDateTime}
                  onDateChange={setLastUsedTransformerDateTime}
                  mode="datetime"
                  textColor="white"
                  fadeToColor="rgba(22, 35, 52, 0.9)"
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
