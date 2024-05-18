import { GeistSans } from "geist/font/sans";
import { type AppType } from "next/app";
import { Koulen } from "next/font/google";

import "~/styles/globals.css";

export const koulen = Koulen({
	weight: '400',
	subsets: ['latin'],
	display: 'swap',
})

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <main className={GeistSans.className}>
      <Component {...pageProps} />
    </main>
  );
};

export default MyApp;
