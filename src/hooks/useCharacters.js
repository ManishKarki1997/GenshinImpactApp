import React from 'react';
import axios from 'axios';

const {API_URL} = require('../constants');

export const fetchCharacters = async ({infoDataSize = 'minimal'}) => {
  try {
    const url = `${API_URL}/api/characters?infoDataSize=${infoDataSize}`;
    const res = await axios.get(url);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const fetchCharacterDetail = async name => {
  try {
    const url = `${API_URL}/api/characters/info/${name}?infoDataSize=all`;
    const res = await axios.get(url);
    return res;
  } catch (error) {
    console.log(error);
  }
};
