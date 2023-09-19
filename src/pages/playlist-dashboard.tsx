import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import Playlist, { SpotifyPlaylistProps } from "./components/Playlist";
import PageLayout from "./components/PageLayout";
import { useRouter } from "next/router";
import { Track } from "@spotify/web-api-ts-sdk";

const PlaylistDashboard = () => {
  const { data: spotifyAuth } =
    api.spotifyAppRouter.authenticateSpotify.useQuery();

  const { data: spotifyLikedSongs, isLoading: spotifyLikedSongsLoading } =
    api.spotifyAppRouter.getCurrentUserLikedSongs.useQuery(undefined, {
      enabled: spotifyAuth?.message === "success",
    });
  const { data: spotifyPlaylists, isLoading: spotifyPlaylistsLoading } =
    api.spotifyAppRouter.getCurrentUserPlaylists.useQuery(undefined, {
      enabled: spotifyAuth?.message === "success",
    });

  if (!spotifyLikedSongs && !spotifyPlaylistsLoading) return <>Loading</>;

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

        {spotifyLikedSongs && (
          <div className="flex flex-col">
            <Playlist
              key={0}
              index={0}
              name={"Liked Songs"}
              images={[{ url: "/likedSongs.png", width: 800, height: 400 }]}
              tracks={spotifyLikedSongs.map((track) => track.track)}
            />
            {spotifyPlaylists &&
              spotifyPlaylists.map((playlist, index) => {
                return (
                  <Playlist
                    key={index + 1}
                    index={index + 1}
                    name={playlist.name}
                    id={playlist.id}
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
