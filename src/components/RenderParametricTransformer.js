import React from 'react';
import {Image, View, Modal} from 'react-native';
import styled from 'styled-components/native';
import moment from 'moment';

import NumericInput from 'react-native-numeric-input';

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

  const {lastSetParametricTransformer, parametricTransformerTime} =
    useAppStateContext();

  const [modalVisible, setModalVisible] = React.useState(false);
  const [lastUsedTransformerDateTime, setLastUsedTransformerDateTime] =
    React.useState(() => new Date());
  const [errorMessage, setErrorMessage] = React.useState('');
  const [replenishTime, setReplenishTime] = React.useState(0);
  const timer = React.useRef();

  const [isReusable, setIsReusable] = React.useState(false);

  const [remainingDays, setRemainingDays] = React.useState(0);
  const [remainingHours, setRemainingHours] = React.useState(0);
  const [remainingMinutes, setRemainingMinutes] = React.useState(0);

  // check if parametric transformer info is stored in async storage
  React.useEffect(() => {
    async function checkAsyncStorageForParametricTransformer() {
      const lastSetParametricTransformerData = await getItem(
        'genshin-app-parametric-transformer-time',
      );

      appDispatch({
        type: 'SET_PARAMETRIC_TRANSFORMER_TIME',
        payload: {
          parametricTransformerTime: JSON.parse(
            lastSetParametricTransformerData,
          ),
        },
      });
    }

    checkAsyncStorageForParametricTransformer();
  }, []);

  const handleSetTimer = () => {
    if (
      (remainingDays == 6 && remainingHours > 22) ||
      (remainingDays == 6 && remainingHours == 22 && remainingMinutes > 0)
    ) {
      setErrorMessage('Max transformer reset value is 6 days 22 hours.');
      return;
    }

    const parametricTransformerTime = {
      days: remainingDays,
      hours: remainingHours,
      mins: remainingMinutes,
      lastSetDate: Date.now(),
    };

    appDispatch({
      type: 'SET_PARAMETRIC_TRANSFORMER_TIME',
      payload: {
        parametricTransformerTime,
      },
    });
    setItem(
      'genshin-app-parametric-transformer-time',
      parametricTransformerTime,
    );

    cancelNotification(NotificationIds.TRANSFORMER_NOTIFICATION_ID);

    const resetDateTime = moment()
      .add(remainingDays, 'days')
      .add(remainingHours, 'hours')
      .add(remainingMinutes, 'minutes');

    const notificationScheduleDate =
      moment.duration(resetDateTime).asMinutes() <=
      moment
        .duration(moment().add(slackTimeInMinsForTimer, 'minutes'))
        .asMinutes()
        ? new Date(Date.now() + 1 * 1000)
        : new Date(resetDateTime);

    scheduleNotification({
      id: NotificationIds.TRANSFORMER_NOTIFICATION_ID,
      title: 'Parametric Transformer',
      message: `You can probably use your Parametric Transformer ${
        slackTimeInMinsForTimer == 0
          ? 'now'
          : 'in about ' + slackTimeInMinsForTimer + ' minutes'
      }.`,
      date: notificationScheduleDate,
    });
    setModalVisible(false);

    setErrorMessage('');
  };

  const calculateTimeLeft = () => {
    let timeLeft = [];

    const currentDateTime = new Date();
    if (parametricTransformerTime.lastSetDate === null) {
      return timeLeft;
    }

    const dateTimeTillReset = moment(parametricTransformerTime.lastSetDate)
      .add(parametricTransformerTime.days, 'days')
      .add(parametricTransformerTime.hours, 'hours')
      .add(parametricTransformerTime.mins, 'minutes')
      .format('x');

    const diff = moment(dateTimeTillReset - moment(currentDateTime));

    if (diff < 0) {
      setIsReusable(true);
      return timeLeft;
    }

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
    return timeLeft;
  };

  React.useEffect(() => {
    timer.current = setInterval(() => {
      setReplenishTime(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            {isReusable
              ? 'Now'
              : !replenishTime || replenishTime.length == 0
              ? '0 days, 0 hrs, 0 mins, 0s'
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
              <Heading2 style={{color: 'white'}}>Remaining Time</Heading2>
              <SubtitleItalic>
                Until the Parametric Timer resets.
              </SubtitleItalic>
              <TimerInputWrapper>
                <InputItem>
                  <NumericInput
                    type="up-down"
                    value={remainingDays}
                    onChange={value => setRemainingDays(value)}
                    textColor="#fff"
                    rounded
                    totalWidth={100}
                    totalHeight={50}
                    minValue={0}
                    maxValue={6}
                  />
                  <Small>Days</Small>
                </InputItem>
                <InputItem>
                  <NumericInput
                    value={remainingHours}
                    type="up-down"
                    onChange={value => setRemainingHours(value)}
                    textColor="#fff"
                    rounded
                    totalWidth={100}
                    totalHeight={50}
                    minValue={0}
                    maxValue={23}
                  />
                  <Small>Hours</Small>
                </InputItem>
                <InputItem>
                  <NumericInput
                    type="up-down"
                    value={remainingMinutes}
                    onChange={value => setRemainingMinutes(value)}
                    textColor="#fff"
                    rounded
                    totalWidth={100}
                    totalHeight={50}
                    minValue={0}
                    maxValue={59}
                  />
                  <Small>Mins</Small>
                </InputItem>
              </TimerInputWrapper>
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
  margin-bottom: 16px;
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
  background-color: transparent;
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

const InputItem = styled.View`
  align-items: center;
`;

const TimerInputWrapper = styled.View`
  margin-top: 20px;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
`;

export default ParametricTransformer;
