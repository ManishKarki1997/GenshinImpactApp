import React from "react";
import styled from "styled-components/native";

import { fetchEvents } from "../../hooks/useEvents";
import {
  Body,
  Heading2,
  Heading3,
  Small,
  Subtitle,
  VerySmall,
} from "../Typography";

import {
  SectionWrapper,
  Header,
  FlexboxListWrapper,
  FlexboxListItem,
  IconWrapper,
  LoadingIconWrapper,
} from "../styles";
import {
  ActivityIndicator,
  View,
  Image,
  Modal,
  TouchableOpacity,
} from "react-native";

const RenderEvents = () => {
  const [events, setEvents] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(null);
  const [modalVisible, setModalVisible] = React.useState(false);

  const [selectedEvent, setSelectedEvent] = React.useState(null);

  React.useEffect(() => {
    async function handleFetchEvents() {
      setIsLoading(true);

      const res = await fetchEvents();
      if (!res.data.error) {
        setEvents(res.data.payload.events);
        setIsLoading(false);
      }
    }

    handleFetchEvents();
  }, []);

  return (
    <Container>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(22, 35, 52, 0.9)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setModalVisible(!modalVisible);
            }}
            style={{
              flex: 1,
              width: "100%",
              height: "100%",
            }}
          ></TouchableOpacity>
          <View
            style={{
              position: "absolute",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <View
              style={{
                // justifyContent: "center",
                // alignItems: "center",
                // marginHorizontal: "auto",
                width: "100%",
                minHeight: 300,
              }}
            >
              {selectedEvent && (
                <>
                  <Image
                    source={{ uri: selectedEvent.imageUrl }}
                    style={{ height: 200, width: "100%" }}
                  />

                  <View
                    style={{
                      alignItems: "center",
                      paddingHorizontal: 10,
                      paddingVertical: 10,
                    }}
                  >
                    <Heading2>{selectedEvent.name}</Heading2>
                    <Subtitle>{selectedEvent.subtitle}</Subtitle>

                    <Heading3 style={{ marginTop: 10 }}>Duration</Heading3>
                    <Duration>
                      <Small>{selectedEvent.durationStart}</Small>
                      <Body> - </Body>
                      <Small>{selectedEvent.durationEnd}</Small>
                    </Duration>
                    <Small>Server Time</Small>
                  </View>
                </>
              )}
            </View>
          </View>
        </View>
      </Modal>

      <SectionWrapper>
        <Header>
          <Body>Events</Body>
        </Header>

        {isLoading && (
          <View>
            <ActivityIndicator size="small" color="#e04352" />
          </View>
        )}

        {!isLoading &&
          events &&
          events.map((e) => {
            return (
              <Event
                onPress={() => {
                  setSelectedEvent(e);
                  setModalVisible(true);
                }}
                key={e._id}
              >
                <ImageWrapper>
                  <Image
                    source={{ uri: e.imageUrl }}
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </ImageWrapper>

                <EventInfoWrapper>
                  <Heading3>{e.name}</Heading3>
                  <VerySmall>Start - {e.durationStart}</VerySmall>
                  <VerySmall>End - {e.durationEnd}</VerySmall>

                  {e.rewards.map((r) => {
                    return (
                      <RewardWrapper key={"reward-" + r.name}>
                        <Small style={{ marginRight: 8 }}>&bull;</Small>
                        {r.count !== "" && (
                          <Body style={{ marginRight: 8 }}>{r.count}</Body>
                        )}

                        <VerySmall>{r?.name}</VerySmall>
                      </RewardWrapper>
                    );
                  })}
                  {/* <Subtitle>{e.subtitle}</Subtitle> */}
                </EventInfoWrapper>
              </Event>
            );
          })}
      </SectionWrapper>
    </Container>
  );
};

const Container = styled.View`
  background-color: ${(props) => props.theme.PRIMARY_BACKGROUND};
`;

const Event = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.SECONDARY_BACKGROUND};
  padding: 10px 20px;
  border-radius: 5px;
  margin-bottom: 20px;

  flex-direction: row;
  /* align-items: center; */
`;

const ImageWrapper = styled.View`
  width: 100px;
  height: 100px;
  margin-right: 10px;
`;

const EventInfoWrapper = styled.View`
  flex-shrink: 1;
`;

const RewardWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Duration = styled.View`
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
`;

export default RenderEvents;
