import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const setItem = async (key, item, setRawValue) => {
  await AsyncStorage.setItem(key, setRawValue ? item : JSON.stringify(item));
};

export const getItem = async (key, getRawValue) => {
  const item = await AsyncStorage.getItem(key);
  if (getRawValue) {
    return item;
  }

  return typeof item === 'string' ? item : JSON.parse(item);
};
