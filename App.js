import React from 'react';

import {ThemeProvider, SettingsProvider, AppProvider} from './src/contexts';
import {StyledThemeProvider, StackNavigation} from './src/components';

import {enableScreens} from 'react-native-screens';

enableScreens(false);

const App = () => {
  return (
    <SettingsProvider>
      <AppProvider>
        <ThemeProvider>
          <StyledThemeProvider>
            <StackNavigation />
          </StyledThemeProvider>
        </ThemeProvider>
      </AppProvider>
    </SettingsProvider>
  );
};

export default App;
