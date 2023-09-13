import Head from "next/head";
import PageLayout from "./components/PageLayout";
import Home from "./Home";
// import Play from "./components/PlaylistDashboard";
export default function Main() {
  return (
    <div className="break-words ">
      <Head>
        <title>Create T3 App</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageLayout>
        <Home />
      </PageLayout>
    </div>
  );
}
