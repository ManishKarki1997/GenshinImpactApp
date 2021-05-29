import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AsyncStorageKeys} from '../constants';

export const ThemeContext = React.createContext('dark');

export const useThemeContext = () => React.useContext(ThemeContext);

const ThemeProvider = ({children, ...rest}) => {
  const [theme, setTheme] = React.useState('dark');

  const toggleTheme = async existingTheme => {
    if (existingTheme) {
      setTheme(existingTheme);
    } else {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      await AsyncStorage.setItem(AsyncStorageKeys.APP_THEME, newTheme);
    }
  };

  React.useEffect(() => {
    async function getTheme() {
      const storedTheme = await AsyncStorage.getItem(
        AsyncStorageKeys.APP_THEME,
      );
      if (storedTheme) {
        setTheme(storedTheme);
      }
    }

    getTheme();
  }, []);

  return (
    <ThemeContext.Provider value={{theme, toggleTheme, ...rest}}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
