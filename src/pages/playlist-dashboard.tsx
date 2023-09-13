import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import Playlist, { SpotifyPlaylistProps } from "./components/Playlist";
import PageLayout from "./components/PageLayout";
import { useRouter } from "next/router";

interface SpotifyAuth {
  token: string;
  scopes: string[];
}

const PlaylistDashboard = () => {
  const router = useRouter();
  const [spotifyAuth, setSpotifyAuth] = useState<SpotifyAuth>({
    token: "",
    scopes: [],
  });

  const [currentPlaylists, setCurrentPlaylists] = useState<
    SpotifyPlaylistProps[]
  >([]);
  const { data, isLoading } = api.example.getAuth0AccessCode.useQuery();
  console.log(data);
  useEffect(() => {
    setSpotifyAuth({
      token: data?.token,
      scopes: data?.scopes,
    });
  }, [data]);
  const { data: spotifyPlaylistData, isLoading: spotifyPlaylistsLoading } =
    api.example.getPlaylists.useQuery(spotifyAuth);
  console.log("Spotify Playlist Response: ", spotifyPlaylistData);

  useEffect(() => {
    if (!spotifyPlaylistsLoading) {
      const newPlaylists =
        spotifyPlaylistData?.items?.map((playlist) => ({
          name: playlist.name,
          images: playlist.images,
        })) ?? []; // Fallback to an empty array if not iterable

      setCurrentPlaylists([...currentPlaylists, ...newPlaylists]);
    }
  }, [spotifyPlaylistData]);

  useEffect(() => {
    console.log("Animating circles...");

    const circles = document.querySelectorAll(".circle");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const circle = entry.target;
          if (entry.isIntersecting) {
            circle.classList.remove("invisible");
            circle.classList.add("animate-roll");
            observer.unobserve(circle);
            circle.addEventListener("animationend", () => {
              const siblingChild = circle
                .closest(".playlist-wrapper")
                ?.querySelector("#playlist-card"); // Assuming the sibling child has an ID of 'card-body'
              if (siblingChild) {
                siblingChild.style.opacity = "1";
              }
            });

            return;
          }
          circle.classList.add("invisible");
          circle.classList.remove("animate-roll");
        });
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.85, // Adjust this according to your needs
      },
    );

    circles.forEach((circle) => {
      observer.observe(circle);
    });

    return () => {
      circles.forEach((circle) => observer.unobserve(circle));
    };
  }, [currentPlaylists, router.pathname]); // Your useEffect dependencies

  // const { data: spotifyLikedSongsData, isLoading: spotifyLikedSongsLoading } =
  //   api.example.getLikedSongs.useQuery(spotifyAuth);
  // console.log("Spotify Liked Songs Response: ", spotifyLikedSongsData);
  // if (spotifyLikedSongsLoading) return <div>Loading...</div>;

  if (spotifyPlaylistsLoading) return <>Loading playlists...</>;
  if (!spotifyPlaylistData) return <div>Something went wrong</div>;
  {
    console.log(currentPlaylists);
  }
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
        {currentPlaylists !== undefined && (
          <div className="flex flex-col">
            {currentPlaylists.map((playlist, index) => {
              return (
                <Playlist
                  key={index}
                  name={playlist.name}
                  images={playlist?.images.map((image) => {
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
