import React from 'react';
import axios from 'axios';

const {API_URL} = require('../constants');

export const fetchMaterialsForTheDay = async day => {
  const url = `${API_URL}/api/generalinfo/materials/${day}`;
  const res = await axios.get(url);

  return res;
};

export const fetchLatestUpdateInfo = async () => {
  const url = `${API_URL}/api/updates/latest`;

  const res = await axios.get(url);

  return res;
};
