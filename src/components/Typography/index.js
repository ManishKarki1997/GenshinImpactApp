import React from 'react';
import styled from 'styled-components/native';

const Heading1 = styled.Text`
  line-height: 30px;
  font-size: 32px;
  font-family: 'Poppins-Black';
  color: ${props => props.theme.PRIMARY_TEXT};
`;

const Heading2 = styled.Text`
  line-height: 30px;
  font-size: 24px;
  font-family: 'Poppins-ExtraBold';
  color: ${props => props.theme.PRIMARY_TEXT};
`;

const Heading3 = styled.Text`
  line-height: 30px;
  font-size: 20px;
  font-family: 'Poppins-Bold';
  color: ${props => props.theme.PRIMARY_TEXT};
`;
const Body = styled.Text`
  font-size: 18px;
  font-family: 'Poppins-Regular';
  color: ${props => props.theme.PRIMARY_TEXT};
`;

const Small = styled.Text`
  font-size: 16px;
  font-family: 'Poppins-Regular';
  color: ${props => props.theme.PRIMARY_TEXT};
  line-height: 28px;
`;
const VerySmall = styled.Text`
  font-size: 12px;
  font-family: 'Poppins-Light';
  color: ${props => props.theme.PRIMARY_TEXT};
  line-height: 28px;
`;

const Subtitle = styled.Text`
  font-size: 16px;
  font-family: 'Poppins-Regular';
  color: ${props => props.theme.SECONDARY_TEXT};
`;

const SubtitleItalic = styled.Text`
  font-size: 16px;
  font-family: 'Poppins-Regular-Italic';
  color: ${props => props.theme.SECONDARY_TEXT};
  font-style: italic;
`;

export {
  Heading1,
  Heading2,
  Heading3,
  Subtitle,
  Body,
  Small,
  VerySmall,
  SubtitleItalic,
};
