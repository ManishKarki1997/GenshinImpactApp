import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const setItem = async (key, item) => {
  await AsyncStorage.setItem(key, JSON.stringify(item));
};

export const getItem = async (key) => {
  const item = await AsyncStorage.getItem(key);
  return typeof item === "string" ? item : JSON.parse(item);
};
