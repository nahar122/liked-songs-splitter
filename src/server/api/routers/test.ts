import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { getSpotifyAccessToken } from "../utils/getSpotifyAccessToken";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import {
  DiscussServiceClient,
  TextServiceClient,
} from "@google-ai/generativelanguage";
import { GoogleAuth } from "google-auth-library";
import {
  ISplittedSongsInput,
  isArrayOfSplittedSongsOutput,
} from "../utils/helpers";
import aiConfig from "./aiConfigText.json";

// const MODEL_NAME = "models/chat-bison-001";

let sdk: SpotifyApi;
let client: TextServiceClient;

export const clerkRouter = router({
  getSpotifyAccessToken: protectedProcedure
    .output(z.object({ access_token: z.union([z.null(), z.string()]) }))
    .query(async (opts) => {
      return await getSpotifyAccessToken(opts.ctx.auth.userId);
    }),
});

export const openAPIRouter = router({
  authenticateOpenAI: protectedProcedure
    .input(
      z.array(
        z.object({
          songId: z.string(),
          album: z.object({
            name: z.string(),
            release_date: z.string(),
            artists: z.array(
              z.object({
                name: z.string(),
              }),
            ),
          }),
          artists: z.array(
            z.object({
              name: z.string(),
            }),
          ),
          categories: z.array(z.string()),
        }),
      ),
    )
    .mutation(async (opts) => {
      const { input } = opts;
      const apiKey = process.env.PALM_API_KEY;

      if (!apiKey) {
        return { message: "palm api key not found" };
      }

      if (input.length === 0 || input.length > 200) {
        return { message: "song length 0" };
      }

      if (!client) {
        client = new TextServiceClient({
          authClient: new GoogleAuth().fromAPIKey(apiKey),
        });
      }

      console.log("Songs Processing:", input.length);

      let offset = 0;
      let limit = 5;
      let allSortedSongs: ISplittedSongsInput["data"] = [];
      while (true) {
        let splicedSongs = input.slice(offset, offset + limit);

        if (splicedSongs.length === 0) {
          break;
        }

        console.log(
          `Processing songs ${offset + 1}-${offset + limit + 1}/${
            input.length
          }`,
        );

        const regex: RegExp = /\[(.*)\]/s;
        let matchFound = false;
        let finalMatch: ISplittedSongsInput["data"] = [];
        let numAttempts = 0;
        while (!matchFound && numAttempts < 3) {
          console.log("Generating AI Response...");
          const result = await client
            .generateText({
              model: aiConfig.model_name,
              temperature: aiConfig.temperature,
              candidateCount: aiConfig.candidate_count,
              topK: aiConfig.top_k,
              topP: aiConfig.top_p,
              prompt: {
                text: `${aiConfig.prompt}\n${input}`,
              },
            })
            .then((result) => {
              return result[0].candidates;
            });

          result?.forEach((candidate) => {
            console.log("Response: ", candidate.output);
            const matches = candidate.output?.match(regex);
            if (matches) {
              matches.forEach((potentialMatch) => {
                // console.log("Match: ", match);
                try {
                  let parsedPotentialMatch = JSON.parse(potentialMatch);
                  if (isArrayOfSplittedSongsOutput(parsedPotentialMatch)) {
                    matchFound = true;
                    finalMatch = parsedPotentialMatch;
                  }
                } catch (e) {
                  console.error(e);
                }
              });
            }
          });
          numAttempts += 1;
        }

        if (finalMatch.length === 0) {
          finalMatch = input.map((song) => {
            return {
              songId: song.songId,
              category: "",
            };
          });
        }

        allSortedSongs = [...allSortedSongs, ...finalMatch];

        offset += limit;
      }

      return {
        sortedSongs: allSortedSongs,
      };
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
      // await sdk.authenticate();
      if (!sdk) {
        console.error("Not authenticated to spotify");
        return [];
      }
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
  getCurrentUserLikedSongs: protectedProcedure.query(async (opts) => {
    // await sdk.authenticate();
    if (!sdk) {
      console.error("Not authenticated to spotify");
      return [];
    }
    let currentUserLikedSongs = await sdk.currentUser.tracks.savedTracks(50, 0);
    let likedSongs = currentUserLikedSongs.items;
    while (currentUserLikedSongs.next) {
      likedSongs = [...likedSongs, ...currentUserLikedSongs.items];
      currentUserLikedSongs = await sdk.currentUser.tracks.savedTracks(
        50,
        currentUserLikedSongs.offset + currentUserLikedSongs.limit + 1,
      );
    }

    return likedSongs;
  }),
  getPlaylistTracks: protectedProcedure
    .input(z.string())
    .query(async (opts) => {
      const { input } = opts;
      // await sdk.authenticate();
      if (!sdk) {
        console.error("Not authenticated to spotify");
        return [];
      }
      let playlistTracksResponse = await sdk.playlists.getPlaylistItems(
        input,
        undefined,
        undefined,
        50,
      );
      let tracks = playlistTracksResponse.items;
      while (playlistTracksResponse.next) {
        tracks = [...tracks, ...playlistTracksResponse.items];
        playlistTracksResponse = await sdk.playlists.getPlaylistItems(
          input,
          undefined,
          undefined,
          50,
          playlistTracksResponse.offset + playlistTracksResponse.limit + 1,
        );
      }
      return tracks;
    }),
});
