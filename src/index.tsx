import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ThemeProvider } from "@material-tailwind/react";
import { AppProvider } from "./context/AppContext";
// import { PermitProvider } from '../context/PermitContext';

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
const customTheme = {
  dialog: {
    styles: {
      base: {
        backdrop: {
          display: "grid",
          placeItems: "place-items-center",
          position: "fixed",
          top: 0,

          left: 0,
          width: "w-screen",
          height: "h-screen",
          backgroundColor: "bg-transparent",
          backgroundOpacity: "bg-opacity-60",
          backdropFilter: "backdrop-blur-xs",
        },
      },
    },
  },
};
root.render(
  <React.StrictMode>
    <ThemeProvider value={customTheme}>
      <AppProvider>
        <App />
      </AppProvider>
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
