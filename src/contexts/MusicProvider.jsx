import { useCallback, useMemo, useState } from "react";

import { MusicContext } from "./MusicContext";

const songs = [
  {
    id: 1,
    title: "preview",
    artist: "Artist",
    url: "/songs/preview.mp3",
    duration: "02:05",
  },
  {
    id: 2,
    title: "Nocturne of Shadow",
    artist: "Artist",
    url: "/songs/nocturne-of-shadow.mp3",
    duration: "02:14",
  },
];

const formatTime = (time) => {
  if (!Number.isFinite(time)) return "00:00";

  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);

  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

export const MusicProvider = ({ children }) => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [trackVersion, setTrackVersion] = useState(0);
  const [playlists, setPlaylists] = useState([]);

  const currentSong = songs[currentSongIndex] ?? null;

  const handlePlaySong = useCallback(
    (song, index) => {
      const nextIndex = songs.findIndex((item) => item.id === song.id);
      const resolvedIndex = nextIndex === -1 ? index : nextIndex;

      if (resolvedIndex === currentSongIndex) {
        setIsPlaying((playing) => !playing);
        return;
      }

      setCurrentSongIndex(resolvedIndex);
      setTrackVersion((version) => version + 1);
      setIsPlaying(true);
    },
    [currentSongIndex],
  );

  const nextSong = useCallback(() => {
    if (songs.length === 0) return;

    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
    setTrackVersion((version) => version + 1);
    setIsPlaying(true);
  }, []);

  const previousSong = useCallback(() => {
    if (songs.length === 0) return;

    setCurrentSongIndex((prevIndex) =>
      prevIndex === 0 ? songs.length - 1 : prevIndex - 1,
    );
    setTrackVersion((version) => version + 1);
    setIsPlaying(true);
  }, []);

  const createPlaylist = (name) => {
    const newPlaylist = {
      id: Date.now(),
      name,
      songs: [],
    };

    setPlaylists((prev) => [...prev, newPlaylist]);
  };

  const addSongToPlaylist = (playlistId, song) => {
    setPlaylists((prev) =>
      prev.map((playlist) => {
        if (playlist.id === playlistId) {
          return { ...playlist, songs: [...playlist.songs, song] };
        } else {
          return playlist;
        }
      }),
    );
  };

  const deletePlaylist = (playlistId) => {
    setPlaylists((prev) =>
      prev.filter((playlist) => playlist.id !== playlistId),
    );
  };

  const play = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPlaying(false), []);

  const value = useMemo(
    () => ({
      allSongs: songs,
      handlePlaySong,
      currentSong,
      currentSongIndex,
      currentTime,
      setCurrentTime,
      formatTime,
      duration,
      setDuration,
      nextSong,
      previousSong,
      play,
      pause,
      isPlaying,
      volume,
      setVolume,
      trackVersion,
      playlists,
      createPlaylist,
      addSongToPlaylist,
      deletePlaylist,
      setPlaylists,
    }),
    [
      handlePlaySong,
      currentSong,
      currentSongIndex,
      currentTime,
      duration,
      nextSong,
      previousSong,
      play,
      pause,
      isPlaying,
      volume,
      trackVersion,
      playlists,
      createPlaylist,
      addSongToPlaylist,
      deletePlaylist,
      setPlaylists,
    ],
  );

  return (
    <MusicContext.Provider value={value}>{children}</MusicContext.Provider>
  );
};
