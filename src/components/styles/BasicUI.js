import React from 'react';
import styled from 'styled-components/native';

const Header = styled.View`
  background-color: ${props => props.theme.SECTION_TITLE_BACKGROUND};
  /* background-color: #e04352; */
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

const FlexboxListWrapper = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

const FlexboxListItem = styled.TouchableOpacity`
  margin-right: 12px;
  margin-bottom: 12px;
`;

const NoImageBlock = styled.View`
  /* width: 100%; */
  background-color: #162334;
  height: 100px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const IconWrapper = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 2px;
  margin-bottom: 16px;
  border-radius: 8px;
  background-color: ${props => props.theme.SECONDARY_BACKGROUND};
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

export {
  Header,
  SectionWrapper,
  FlexboxListWrapper,
  FlexboxListItem,
  NoImageBlock,
  IconWrapper,
  LoadingIconWrapper,
};
