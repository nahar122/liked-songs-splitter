import { SavedTrack, Track } from "@spotify/web-api-ts-sdk";
import Image from "next/image";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";

export interface SpotifyPlaylistProps {
  name: string;
  images?: SpotifyImage[];
  index: number;
  id?: string;
  tracks?: Track[];
}

interface SpotifyImage {
  url: string;
  width: number;
  height: number;
}

const Playlist: React.FC<SpotifyPlaylistProps> = (props) => {
  const [localTracks, setLocalTracks] = useState<Track[]>(props.tracks || []); // New State for tracks
  const [id, setId] = useState<string>(props.id || "");
  const [showModal, setShowModal] = useState(false);
  const [inputFields, setInputFields] = useState<string[]>([""]);
  const [categories, setCategories] = useState<string[]>([]);
  const [queryInput, setQueryInput] = useState<
    {
      songId: string;
      album: {
        name: string;
        release_date: string;
        artists: { name: string }[];
      };
      artists: {
        name: string;
      }[];

      categories: string[];
    }[]
  >([]);

  const addInputField = () => {
    setInputFields([...inputFields, ""]);
  };

  const removeInputField = (index: number) => {
    if (inputFields.length <= 1) {
      return;
    }
    const newInputFields = [...inputFields];
    newInputFields.splice(index, 1);
    setInputFields(newInputFields);
  };

  const splitButtonHandler = () => {
    setShowModal(false);
    setCategories(inputFields);
  };

  // const { data: spotifyAuth } =
  //   api.spotifyAppRouter.authenticateSpotify.useQuery();

  if (id) {
    const { data: playlistTracks, isLoading: playlistTracksLoading } =
      api.spotifyAppRouter.getPlaylistTracks.useQuery(id, {
        // enabled: spotifyAuth?.message === "success",
      });
    useEffect(() => {
      if (playlistTracksLoading) return;
      setLocalTracks(
        playlistTracks?.map((track) => track.track as Track) || [],
      );
      console.log(`Playlist #${props.index} tracks: `, localTracks);
    }, [playlistTracks]);
  }

  // // Always call the hook, but conditionally prepare the input.

  useEffect(() => {
    console.log("Categories useEffectRan");
    if (localTracks) {
      console.log("local track reached");
      const localTracksAsOpenAIInput = localTracks.map((track) => {
        return {
          songId: track.id,
          album: {
            name: track.name,
            release_date: track.album.release_date,
            artists: track.album.artists.map((artist) => {
              return { name: artist.name };
            }),
          },
          artists: track.artists.map((artist) => {
            return {
              name: artist.name,
            };
          }),
          categories: categories,
        };
      });
      setQueryInput(localTracksAsOpenAIInput);
      mutation.mutate(localTracksAsOpenAIInput);
    }
  }, [categories]);

  const mutation = api.openAIRouter.authenticateOpenAI.useMutation();
  return (
    <div className="playlist-wrapper my-2 flex items-center overflow-hidden rounded-lg bg-purple-700 p-2 align-middle">
      <div data-index={props.index} className=" relative px-8 py-2">
        {props.images && props.images.length > 0 && props.images[0] && (
          <Image
            className="z-0 h-auto w-full rounded-lg bg-white object-cover object-center p-4"
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

        <button
          onClick={() => setShowModal(true)}
          className="rounded bg-blue-500 px-6 py-2 text-white"
        >
          Show Modal
        </button>

        {showModal && (
          <div className="fixed left-0 top-0 z-20 flex h-full w-full items-center justify-center bg-black bg-opacity-50">
            <div className="flex flex-col items-center justify-center rounded-lg bg-purple-600 p-2 text-center text-white sm:p-4">
              <h2 className="mb-4 text-2xl">
                Please specify the names of the categories
                <br />
                you would like to split your playlist in to.
              </h2>
              {inputFields.map((field, index) => (
                <div
                  key={index}
                  className="mb-4 flex items-center transition-colors"
                >
                  <label
                    className="mx-7 text-lg font-semibold "
                    htmlFor={`playlist-input-${index + 1}`}
                  >
                    Playlist #{index + 1}
                  </label>
                  <input
                    id={`playlist-input-${index + 1}`}
                    type="text"
                    value={field}
                    onChange={(e) => {
                      const newInputFields = [...inputFields];
                      newInputFields[index] = e.target.value;
                      setInputFields(newInputFields);
                    }}
                    className="mr-2 rounded border p-2 text-black"
                  />
                  {inputFields.length > 1 && (
                    <button
                      onClick={() => removeInputField(index)}
                      className="self-end rounded bg-red-500 px-4 py-2 font-bold text-black opacity-80 transition-all hover:bg-red-500 hover:opacity-100"
                    >
                      Remove
                    </button>
                  )}
                  {inputFields.length <= 1 && (
                    <button
                      onClick={() => removeInputField(index)}
                      className="invisible self-end rounded bg-red-500 px-4 py-2 font-bold text-black opacity-80 transition-all hover:bg-red-500 hover:opacity-100"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addInputField}
                className="mb-4 self-end rounded bg-white px-3 py-2 font-bold text-black opacity-80 transition-all hover:bg-blue-400 hover:opacity-100 "
              >
                Add Input
              </button>
              <div className="flex w-full justify-evenly">
                <button
                  onClick={splitButtonHandler}
                  className=" w-1/3 rounded bg-yellow-400 px-5 py-2 font-bold text-black opacity-80 transition-all hover:bg-yellow-400 hover:opacity-100"
                >
                  Split!
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-1/3  rounded bg-red-500 px-4 py-2 font-bold text-black opacity-80 transition-all hover:bg-red-500 hover:opacity-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        {/* <button
          className="w-full rounded-xl bg-white py-2 text-center text-2xl font-semibold text-black transition duration-700 hover:bg-yellow-400"
          // href={"split"}
          onClick={(e) => setShowDetails(!showDetails)}
        >
          Split Me
        </button> */}
      </div>
    </div>
  );
};

export default Playlist;
