import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { getSpotifyAccessToken } from "../utils/getSpotifyAccessToken";
import { SimplifiedPlaylist } from "@spotify/web-api-ts-sdk";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";

const spotifyBaseUrl = "https://api.spotify.com/v1";
let sdk: SpotifyApi;

export const clerkRouter = router({
  getSpotifyAccessToken: protectedProcedure
    .output(z.object({ access_token: z.union([z.null(), z.string()]) }))
    .query(async (opts) => {
      return await getSpotifyAccessToken(opts.ctx.auth.userId);
    }),
});

export const spotifyRouter = router({
  authenticateSpotify: protectedProcedure
    .output(z.object({ message: z.string() }))
    .query(async (opts) => {
      if (
        !process.env.SPOTIFY_CLIENT_ID ||
        !process.env.SPOTIFY_CLIENT_SECRET
      ) {
        return { message: "failed" };
      }
      sdk = SpotifyApi.withClientCredentials(
        process.env.SPOTIFY_CLIENT_ID,
        process.env.SPOTIFY_CLIENT_SECRET,
        [
          "playlist-read-private",
          "playlist-read-collaborative",
          "user-library-read",
        ],
      );
      const accessToken = (await sdk.authenticate()).accessToken;
      accessToken.access_token = (
        await getSpotifyAccessToken(opts.ctx.auth.userId)
      ).access_token;
      sdk = SpotifyApi.withAccessToken(
        process.env.SPOTIFY_CLIENT_ID,
        accessToken,
      );
      await sdk.authenticate();
      return {
        message: "success",
      };
    }),
  getCurrentUserPlaylists: protectedProcedure
    // .output(z.object({playlists: Simplified}))
    .query(async (opts) => {
      await sdk.authenticate();
      let currentUserPlaylistsResponse =
        await sdk.currentUser.playlists.playlists();
      let playlists = currentUserPlaylistsResponse.items;
      while (currentUserPlaylistsResponse.next) {
        playlists = [...playlists, ...currentUserPlaylistsResponse.items];
        currentUserPlaylistsResponse =
          await sdk.currentUser.playlists.playlists();
      }

      return playlists;
    }),
});
