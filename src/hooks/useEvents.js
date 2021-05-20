import React from 'react';
import axios from 'axios';

const {API_URL} = require('../constants');

export const fetchEvents = async () => {
  const url = `${API_URL}/api/events`;
  const res = await axios.get(url);
  return res;
};
