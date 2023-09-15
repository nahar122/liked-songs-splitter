import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    const bottomElement = document.querySelector(`[id='bottom']`);

    if (!bottomElement) {
      console.error("Top element not found");
      return; // Exit useEffect if circleElement doesn't exist
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const bottomDiv = entry.target;
          if (entry.isIntersecting) {
            bottomDiv.classList.remove("invisible");
            bottomDiv.classList.add("slide-in-right");
            observer.unobserve(bottomDiv);
          } else {
            bottomDiv.classList.add("invisible");
            bottomDiv.classList.remove("slide-in-right");
          }
        });
      },
      {
        threshold: 0.8, // Adjust this according to your needs
      },
    );

    observer.observe(bottomElement);
  }, []); // Your useEffect dependencies

  useEffect(() => {
    const topElement = document.querySelector(`[id='top']`);

    if (!topElement) {
      console.error("Top element not found");
      return; // Exit useEffect if circleElement doesn't exist
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const topDiv = entry.target;
          if (entry.isIntersecting) {
            topDiv.classList.remove("invisible");
            topDiv.classList.add("slide-in-left");
            observer.unobserve(topDiv);
          } else {
            topDiv.classList.add("invisible");
            topDiv.classList.remove("slide-in-left");
          }
        });
      },
      {
        threshold: 0.6, // Adjust this according to your needs
      },
    );

    observer.observe(topElement);
  }, []); // Your useEffect dependencies

  useEffect(() => {
    const startSplittingButtomElement = document.querySelector(
      `[id='start-splitting-button']`,
    );

    if (!startSplittingButtomElement) {
      console.error("Start Splitting Button not found");
      return; // Exit useEffect if circleElement doesn't exist
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const topDiv = entry.target;
          if (entry.isIntersecting) {
            topDiv.classList.remove("opacity-0");
            topDiv.classList.add("opacity-1");
            observer.unobserve(topDiv);
          } else {
            topDiv.classList.add("opacity-0");
            topDiv.classList.remove("opacity-1");
          }
        });
      },
      {
        threshold: 0.8, // Adjust this according to your needs
      },
    );

    observer.observe(startSplittingButtomElement);
  }, []); // Your useEffect dependencies

  return (
    <div className=" flex h-full w-full flex-col items-center gap-8 text-center md:max-w-6xl">
      <section className="flex flex-col justify-center align-middle ">
        <h1 className="flex flex-wrap items-center justify-center p-4 text-center text-6xl">
          <span className="font-bold text-white sm:text-xl md:text-4xl">
            Welcome to
          </span>
          <span className="animate-bg ml-4 rounded-md bg-purple-800 p-3 font-bold text-yellow-400 transition-all">
            VibeSplit:
          </span>
        </h1>
        <h1 className="text-center text-4xl">
          where every song finds its{" "}
          <span className="font-bold text-yellow-400">home</span>
          <br />
          through the power of{" "}
          <span className="font-bold text-yellow-400">AI</span>.
        </h1>
      </section>
      <section className="mt-12">
        <div className="flex flex-col gap-4 text-3xl">
          <div
            id="top"
            className="invisible grid grid-cols-4 grid-rows-1 items-center justify-items-center"
          >
            <div className="col-span-4 row-start-2 mx-4 flex flex-col gap-4 rounded-lg bg-purple-800 p-4 md:col-span-3 md:row-start-1">
              <h4 className="border-b-4 border-yellow-200 p-4 font-bold text-yellow-300">
                Enhance Your Listening Experience
              </h4>

              <p className="h-full w-full">
                Ever felt the drag of meticulously scrolling through your
                playlist, desperately seeking that one track that matches the
                moment?
                <br />
                <i className="text-yellow-400">
                  Say goodbye to playlist fatigue.
                </i>
              </p>
              <p>
                Introducing <b className="text-yellow-400">VibeSplit</b>—the
                smart solution that employs AI to categorize your music into{" "}
                <b>distinct, mood-specific</b> playlists.
              </p>
            </div>
            <Image
              className="hexagon col-span-2 col-start-2 row-start-1 w-full md:col-span-1 md:row-start-1"
              src={"/phoneScreen.png"}
              alt="test_image"
              width={400}
              height={5}
            />
          </div>
          <div
            id="bottom"
            className="grid grid-cols-4 grid-rows-1 items-center justify-center justify-items-center align-middle"
          >
            <Image
              className="hexagon col-span-2 col-start-2 w-full self-center md:col-span-1"
              src={"/test.png"}
              alt="test_image"
              width={400}
              height={400}
            />
            <div className="col-span-4 mx-4 flex flex-col gap-4 rounded-lg bg-purple-800 p-4 md:col-span-3">
              <h4 className="border-b-4 border-yellow-200 p-4 font-bold text-yellow-300">
                Your Music, Your Categories
              </h4>
              <p className="h-full w-full">
                With <b className="text-yellow-400">VibeSplit</b>, the power of
                personalization is in your hands. Select a playlist, define your
                own <i>custom categories</i>, and let the algorithm work its
                magic.
                <br />
                I`&apos;`ts not just easy—it `&apos;`s
                <b className="text-yellow-400">effortless.</b>
              </p>
            </div>
          </div>
        </div>
      </section>
      <Link
        id="start-splitting-button"
        href={"playlist-dashboard"}
        className="w-1/2 rounded-xl bg-white p-4 text-2xl font-bold text-black transition-all duration-500 ease-in-out hover:bg-yellow-400"
      >
        Start Splitting Now
      </Link>
    </div>
  );
};

export default Home;
