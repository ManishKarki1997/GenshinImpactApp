import React from 'react';
import {Image, View, Modal} from 'react-native';
import styled from 'styled-components/native';
import moment from 'moment';

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
import {cancelNotification, scheduleNotification} from '../helpers';
import {NotificationIds} from '../constants';

const ResinTimer = () => {
  const appDispatch = useAppDispatchContext();
  const appState = useAppStateContext();

  const {currentResin, lastSetResinTime} = appState?.resinInfo;
  const {slackTimeInMinsForTimer} = useSettingsStateContext();

  const [modalVisible, setModalVisible] = React.useState(false);
  const [tempResin, setTempResin] = React.useState(0);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [replenishTime, setReplenishTime] = React.useState(0);
  const [totalTimeElapsed, setTotalTimeElapsed] = React.useState(0);
  const [isResinReplenished, setIsResinReplenished] = React.useState(false);
  const [absoluteReplenishTime, setAbsoluteReplenishTime] = React.useState('');

  const timer = React.useRef();

  const handleSetResin = num => {
    if (isNaN(num.trim())) {
      setErrorMessage('Please enter valid number');
      return;
    }

    if (num.trim() > 160) {
      setErrorMessage('Resin cannot be greater than 160.');
    }

    setTempResin(num > 160 ? 160 : num);

    if (!isNaN(num.trim()) && num < 160) {
      setErrorMessage('');
    }
  };

  const handleAfterEnteringResin = async () => {
    setErrorMessage('');
    setModalVisible(false);
    setIsResinReplenished(false);

    const resinInfo = {
      currentResin: parseInt(tempResin),
      lastSetResinTime: Date.now(),
    };

    if (tempResin >= 160) {
      setAbsoluteReplenishTime('');
    } else {
      const tempAbsoluteRefilTime = moment(
        moment().add((160 - tempResin) * 8, 'minutes'),
      ).format('HH:mm A');

      setAbsoluteReplenishTime(tempAbsoluteRefilTime);
    }

    appDispatch({
      type: 'SET_RESIN_INFO',
      payload: {
        resinInfo,
      },
    });

    setItem('genshin-app-resin-info', resinInfo);

    const remainingResinToRefill = 160 - tempResin;
    const remainingHours = (remainingResinToRefill * 8) / 60;
    cancelNotification(NotificationIds.RESIN_NOTIFICATION_ID);

    scheduleNotification({
      id: NotificationIds.RESIN_NOTIFICATION_ID,
      title: 'Resin Replenished',
      message:
        slackTimeInMinsForTimer == 0
          ? 'Your resin has been fully replenished.'
          : `Your resin will be fully replenished in about ${slackTimeInMinsForTimer} minutes.`,
      date:
        remainingResinToRefill * 8 <= slackTimeInMinsForTimer
          ? new Date(Date.now() + 3000)
          : new Date(Date.now() + remainingHours * 60 * 60 * 1000),
    });
  };

  const calculateTimeLeft = () => {
    let timeLeft = [];
    const remainingResinToRefill = 160 - currentResin;
    const remainingMinsUntilFullResin = remainingResinToRefill * 8;
    const currentDateTime = new Date();

    // x = milliseconds
    const timeTillFull = moment(lastSetResinTime || currentDateTime)
      .add(remainingMinsUntilFullResin, 'minutes')
      .format('x');

    const diff = parseInt(timeTillFull) - currentDateTime;

    if (diff > 0) {
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
        .toString()
        .padStart(2, '0');

      const minutes = Math.floor((diff / 1000 / 60) % 60)
        .toString()
        .padStart(2, '0');

      const seconds = Math.floor((diff / 1000) % 60)
        .toString()
        .padStart(2, '0');

      timeLeft = [hours, minutes, seconds];
    } else {
      setIsResinReplenished(true);

      const resinInfo = {
        currentResin: 160,
        lastSetResinTime,
      };

      appDispatch({
        type: 'SET_RESIN_INFO',
        payload: {
          resinInfo,
        },
      });
    }
    return timeLeft;
  };

  React.useEffect(() => {
    timer.current = setInterval(() => {
      setTotalTimeElapsed(prev => prev + 1);
      setReplenishTime(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentResin, lastSetResinTime, replenishTime]);

  // check if resin info is stored in async storage
  React.useEffect(() => {
    async function checkAsyncStorageForResinInfo() {
      const resinInfo = JSON.parse(await getItem('genshin-app-resin-info'));
      if (!resinInfo) {
        appDispatch({
          type: 'SET_RESIN_INFO',
          payload: {
            resinInfo: {
              currentResin: 0,
              lastSetResinTime: Date.now(),
            },
          },
        });

        const tempAbsoluteRefilTime = moment(
          moment().add(21, 'hours').add(20, 'minutes'),
        ).format('HH:mm A');

        setAbsoluteReplenishTime(tempAbsoluteRefilTime);

        return;
      }

      const replenishedResin = Math.floor(
        moment.duration(moment().diff(resinInfo.lastSetResinTime)).minutes() /
          8,
      );

      resinInfo.currentResin = resinInfo.currentResin + replenishedResin;

      if (resinInfo.currentResin == 160) {
        setAbsoluteReplenishTime('');
      } else {
        const tempAbsoluteRefilTime = moment(
          moment().add((160 - resinInfo.currentResin) * 8, 'minutes'),
        ).format('HH:mm A');

        setAbsoluteReplenishTime(tempAbsoluteRefilTime);
      }

      appDispatch({
        type: 'SET_RESIN_INFO',
        payload: {
          resinInfo: resinInfo,
        },
      });
    }

    checkAsyncStorageForResinInfo();
  }, []);

  return (
    <Container>
      <HeaderWrapper>
        <Header style={{flexDirection: 'row', alignItems: 'center'}}>
          <Body style={{color: 'white'}}>Resin Timer</Body>
          <VerySmall style={{marginLeft: 8, color: 'white'}}>(Beta)</VerySmall>
        </Header>

        <ResinOverview onPress={() => setModalVisible(true)}>
          <Image
            style={{height: 30, width: 30}}
            source={{
              uri: 'https://res.cloudinary.com/dnoibyqq2/image/upload/v1620827585/genshin-app/other-items/fragile-resin.png',
            }}
          />

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: 5,
            }}>
            {/* every 8 minutes, add 1 resin */}
            <Body>
              {parseInt(currentResin) +
                parseInt(Math.floor(totalTimeElapsed / 480))}
            </Body>
            <Body> / </Body>
            <Body>160</Body>
          </View>
        </ResinOverview>
      </HeaderWrapper>

      <ResinTimerWrapper>
        <ResinTimerItem>
          <Small>Fully Replenish in </Small>
          <Heading2>
            {isResinReplenished
              ? 'Resin Replenished'
              : !replenishTime || replenishTime.length == 0
              ? '00:00:00'
              : `${replenishTime[0]}:${replenishTime[1]}:${replenishTime[2]}`}
          </Heading2>
          {absoluteReplenishTime !== '' && (
            <Small> at {absoluteReplenishTime}</Small>
          )}
        </ResinTimerItem>
      </ResinTimerWrapper>

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
              <Heading2 style={{color: 'white'}}>Set current resin</Heading2>
              <SubtitleItalic>( Max 160 )</SubtitleItalic>
              <View>
                <ResinInputTextBox
                  onChangeText={handleSetResin}
                  onEndEditing={handleAfterEnteringResin}
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
  margin-top: 16px;
  margin-bottom: 64px;
`;

const HeaderWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const ResinTimerWrapper = styled.View`
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.SECONDARY_BACKGROUND};
  padding: 8px 12px;
  border-radius: 5px;
`;

const ResinTimerItem = styled.View`
  align-items: center;
`;

const ResinOverview = styled.TouchableOpacity`
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
  color: ${props => props.theme.PRIMARY_TEXT};
  padding: 8px 12px;
  border-radius: 5px;
  margin-top: 8px;
`;

export default ResinTimer;
