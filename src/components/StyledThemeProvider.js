import React from "react";
import { ThemeProvider } from "styled-components";
import { ThemeContext } from "../contexts/ThemeContext";
import { DarkTheme, LightTheme } from "../constants";

const StyledThemeProvider = ({ children }) => {
  const { theme } = React.useContext(ThemeContext);
  return (
    <ThemeProvider theme={theme === "light" ? LightTheme : DarkTheme}>
      {children}
    </ThemeProvider>
  );
};

export default StyledThemeProvider;
