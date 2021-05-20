import React from 'react';
import axios from 'axios';

const {API_URL} = require('../constants');

export const fetchWeapons = async ({infoDataSize = 'minimal'}) => {
  try {
    const url = `${API_URL}/api/weapons?infoDataSize=${infoDataSize}`;
    const res = await axios.get(url);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const fetchWeaponDetail = async name => {
  try {
    const url = `${API_URL}/api/weapons/info/${name}`;
    const res = await axios.get(url);
    return res;
  } catch (error) {
    console.log(error);
  }
};
