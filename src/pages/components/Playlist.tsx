import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
// import useSpotifyAuth from "~/hooks/useSpotifyAuth";

export interface SpotifyPlaylistProps {
  name: string;
  images: SpotifyImage[];
  index: number;
}

interface SpotifyImage {
  url: string;
  width: number;
  height: number;
}

const Playlist: React.FC<SpotifyPlaylistProps> = (props) => {
  const router = useRouter();
  // useEffect(() => {
  //   if (!router.isReady) {
  //     return;
  //   }
  //   console.log("IMAGES: ", props.index);

  //   const circleElement = document.querySelector(
  //     `[data-index='${props.index}']`,
  //   ) as Element;

  //   if (!circleElement) {
  //     console.error("No circle element found");
  //     return; // Exit useEffect if circleElement doesn't exist
  //   }
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       entries.forEach((entry) => {
  //         const circle = entry.target;
  //         if (entry.isIntersecting) {
  //           console.log("Animating circle #: ", props.index);
  //           circle.classList.remove("invisible");
  //           circle.classList.add("animate-roll");
  //           observer.unobserve(circle);
  //           circle.addEventListener("animationend", () => {
  //             console.log("Animation Ending");
  //             const siblingChild = circle
  //               .closest(".playlist-wrapper")
  //               ?.querySelector("#playlist-card") as HTMLElement; // Assuming the sibling child has an ID of 'card-body'
  //             if (siblingChild) {
  //               try {
  //                 siblingChild.style.opacity = "1";
  //               } catch (error) {
  //                 console.error(error);
  //               }
  //             }
  //           });
  //         } else {
  //           // circle.classList.add("hidden");
  //           circle.classList.remove("animate-roll");
  //         }
  //       });
  //     },
  //     {
  //       root: null, // relative to document viewport
  //       rootMargin: "0px",
  //       threshold: 0.9, // Adjust this according to your needs
  //     },
  //   );

  //   observer.observe(circleElement);

  //   return () => {
  //     if (circleElement) {
  //       observer.unobserve(circleElement);
  //     }
  //   };
  // }, [props.index, router.pathname, router.isReady]); // Your useEffect dependencies

  return (
    <div className="playlist-wrapper my-2 flex items-center overflow-hidden rounded-lg bg-purple-700 p-2 align-middle">
      <div data-index={props.index} className=" relative px-8 py-2">
        {props.images && props.images.length > 0 && props.images[0] && (
          <Image
            className="h-auto w-full rounded-lg bg-white object-cover object-center p-4"
            src={props.images[0].url || ""}
            alt={"Album Image " + 0}
            width={props.images[0].width / 4}
            height={props.images[0].height / 2}
          />
        )}
      </div>

      <div
        id="playlist-card"
        className="content-to-reveal flex flex-col justify-between p-4
            align-middle  transition-opacity duration-1000 ease-in-out sm:flex-1
            "
      >
        <div
          id="card-header"
          className=" mb-4 border-white p-2 font-semibold text-white"
        >
          <span className=" p-2 sm:text-sm md:text-3xl">
            Playlist: {props.name}
          </span>
        </div>
        <div id="card-body" className="mb-4 flex-1 p-2">
          <span>Lorem ipsum dolor sit ame</span>
        </div>

        <Link
          className="w-full rounded-xl bg-white py-2 text-center text-2xl font-semibold text-black transition duration-700 hover:bg-yellow-400"
          href={"split"}
        >
          Split Me
        </Link>
      </div>
    </div>
  );
};

export default Playlist;
