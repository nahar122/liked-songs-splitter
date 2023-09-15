import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import Playlist, { SpotifyPlaylistProps } from "./components/Playlist";
import PageLayout from "./components/PageLayout";
import { useRouter } from "next/router";

const PlaylistDashboard = () => {
  const router = useRouter();

  const [currentPlaylists, setCurrentPlaylists] = useState<
    SpotifyPlaylistProps[]
  >([]);
  const { data: authStatus, data: authStatusLoading } =
    api.spotifyAppRouter.authenticateSpotify.useQuery();
  const { data: spotifyPlaylists, isLoading: spotifyPlaylistsLoading } =
    api.spotifyAppRouter.getCurrentUserPlaylists.useQuery();
  console.log(spotifyPlaylists);

  if (spotifyPlaylistsLoading) return <>Loading playlists...</>;
  if (!spotifyPlaylists)
    return <div className="mx-auto my-auto">Something went wrong</div>;
  return (
    <PageLayout>
      <div>
        <h1 className="mb-3 text-center text-5xl font-semibold">
          <span>
            Which <span className="text-yellow-400"> playlist </span>
            would you like to
            <span className="text-yellow-400"> split</span>?
          </span>
        </h1>
        {spotifyPlaylists && (
          <div className="flex flex-col">
            {spotifyPlaylists.map((playlist, index) => {
              return (
                <Playlist
                  key={index}
                  index={index}
                  name={playlist.name}
                  images={playlist.images.map((image) => {
                    return {
                      url: image.url,
                      width: image.width,
                      height: image.height,
                    };
                  })}
                />
              );
            })}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default PlaylistDashboard;
