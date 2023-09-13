import {
  router,
  protectedProcedure,
  // protectedProcedureWithSpotify,
} from "../trpc";

export const protectedRouter = router({
  getAuth0AccessCode: protectedProcedure.query(async ({ ctx }) => {
    console.log("Context: ", ctx);
    const userId = ctx?.auth?.userId;
    const url = `https://api.clerk.com/v1/users/${ctx?.auth?.userId}/oauth_access_tokens/spotify`;
    const token = process.env?.CLERK_SECRET_KEY;
    console.log(userId);
    if (token) {
      console.log(token);
      try {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then((res) => res.json());
        console.log("RESPONSE: ", response);
        return response[0];
      } catch (error) {
        console.error("Failed to get spotify access code: ", error);
      }
    }
    return {
      message: "failed to get spotify access code",
    };
  }),
  getPlaylists: protectedProcedure
    .input(Object)
    .query(async ({ ctx, input }) => {
      // console.log(input);
      if (input.token.length === 0) {
        return {
          message: "invalid token",
        };
      }
      let id: string;
      try {
        const response = await fetch("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: `Bearer ${input.token}`,
          },
        }).then((res) => res.json());
        console.log("User Profile: ", response);
        id = response.id;
      } catch (error) {
        console.error("Failed to get Spotify user ID:", error);
      }

      try {
        const response = await fetch(
          "https://api.spotify.com/v1/me/playlists",
          {
            headers: {
              Authorization: `Bearer ${input.token}`,
            },
          },
        ).then((res) => res.json());
        console.log("Playlists: ", response);
        // id = response.id;
        return response;
      } catch (error) {
        console.error("Failed to get playlists: ", error);
      }
      return {
        message: "failed to get playlists",
      };
    }),
  getLikedSongs: protectedProcedure
    .input(Object)
    .query(async ({ ctx, input }) => {
      if (input.token.length === 0) {
        return {
          message: "invalid token",
        };
      }
      let id: string;
      try {
        const response = await fetch("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: `Bearer ${input.token}`,
          },
        }).then((res) => res.json());
        console.log("User Profile: ", response);
        id = response.id;
      } catch (error) {
        console.error("Failed to get Spotify user ID:", error);
      }

      try {
        const limit = 50;
        var response = await fetch(
          `https://api.spotify.com/v1/me/tracks?limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${input.token}`,
            },
          },
        ).then((res) => res.json());
        // console.log("Liked Songs: ", response);
        const max_attempts = 10;
        var current_attempts = 0;
        var likedSongs: typeof response.items = [];
        while (
          response &&
          response.next !== null &&
          response.next !== undefined &&
          current_attempts < max_attempts
        ) {
          console.log(
            "Fetching liked songs. Current offset link: ",
            response.next,
          );
          response = await fetch(`${response.next}`, {
            headers: {
              Authorization: `Bearer ${input.token}`,
            },
          }).then((res) => res.json());
          likedSongs = [...likedSongs, ...response.items];
          current_attempts += 1;
        }
        return {
          likedSongs,
        };
      } catch (error) {
        console.error("Failed to get liked songs: ", error);
      }
      return {
        message: "failed to get liked songs",
      };
    }),
});
