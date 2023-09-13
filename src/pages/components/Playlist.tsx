import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
// import useSpotifyAuth from "~/hooks/useSpotifyAuth";

export interface SpotifyPlaylistProps {
  name: string;
  images: SpotifyImage[];
}

interface SpotifyImage {
  url: string;
  width: number;
  height: number;
}

const Playlist: React.FC<SpotifyPlaylistProps> = (props) => {
  console.log("IMAGES: ", props.images);

  return (
    <div className="playlist-wrapper my-2 flex overflow-hidden rounded-lg bg-purple-700 p-2 align-middle">
      {props.images.length > 0 && props.images[0] && (
        <>
          <div className="circle invisible relative px-8 py-2">
            <Image
              className="h-auto w-full rounded-full bg-white object-cover object-center p-4"
              src={props.images[0].url}
              alt={"Album Image " + 0}
              width={props.images[0].width / 2}
              height={props.images[0].height / 2}
            />
          </div>

          <div
            id="playlist-card"
            className="content-to-reveal flex flex-col justify-between p-4
            align-middle opacity-0 transition-opacity duration-1000 ease-in-out sm:flex-1
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
              className="w-full rounded-full  bg-white py-2 text-center text-xl text-black transition hover:bg-yellow-400"
              href={"split"}
            >
              Split Me
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Playlist;
