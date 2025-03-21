import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { Toaster } from "./components/ui/toaster.jsx";
import Footer from "./components/shopping-view/Footer.jsx";
import { TranslationProvider } from "react-google-multi-lang";
import { LanguageSwitcher } from "./lib/LanguageSwitcher.jsx";

// Remove dotenv import and polyfill for process
const TRANSLATION_API = import.meta.env.VITE_REACT_APP_TRANSLATION_API;

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      {/* <TranslationProvider apiKey={TRANSLATION_API} defaultLanguage="ar"> */}
      {/* <LanguageSwitcher /> */}
      <App />
      <Toaster />
      {/* </TranslationProvider> */}
    </Provider>
  </BrowserRouter>
);
