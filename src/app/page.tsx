"use client";
import App from "./list";
import React from "react";
import { Provider } from "react-redux";
import store from "@/redux/store";

export default function Page() {
  return (
      <Provider store={store}>
        <main>
          <App />
        </main>
      </Provider>
  );
}
