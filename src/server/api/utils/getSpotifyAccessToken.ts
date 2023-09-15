import { clerkClient } from "@clerk/nextjs";

export async function getSpotifyAccessToken(userId: string) {
  const spotifyAccessTokenFromClerk = await clerkClient.users
    .getUserOauthAccessToken(userId, "oauth_spotify")
    .then((res) => res.at(0)?.token);
  return spotifyAccessTokenFromClerk
    ? { access_token: spotifyAccessTokenFromClerk }
    : { access_token: "" };
}
