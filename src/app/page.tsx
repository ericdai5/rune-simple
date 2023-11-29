"use client";
import App from "./list";
import React from "react";
import { Provider } from "react-redux";
import store from "@/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

let persistor = persistStore(store);

export default function Page() {
  return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
        <main>
          <App />
        </main>
        </PersistGate>
      </Provider>
  );
}
