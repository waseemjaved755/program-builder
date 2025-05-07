import { Provider } from "react-redux";
import { store } from "@/store";
import type { AppProps } from "next/app";
import "@/app/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}
