import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import "~/styles/hexagon.css";
import "~/styles/animations.css";
import { ClerkProvider } from "@clerk/nextjs";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider>
      <Component {...pageProps} />;
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
