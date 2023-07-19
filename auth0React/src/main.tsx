import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Auth0Provider } from "@auth0/auth0-react";

// const domain: string = import.meta.env.REACT_APP_AUTH0_DOMAIN;
// console.log(domain);
// const clientId: string = import.meta.env.REACT_APP_AUTH0_CLIENT_ID;
const domain = "dev-epm452zh4vwovkb3.us.auth0.com";
const clientId = "2EGa3q8qFvn3kePN1k0MnNNwH1VDEbys";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);
