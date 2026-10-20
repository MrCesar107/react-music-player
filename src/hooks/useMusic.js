import { useState, useEffect } from 'react';

const songs = [
    {
        id: 1,
        title: "preview",
        artist: "Artist",
        url: "/songs/preview.mp3",
        duration: "03:00",
    }
];

export const useMusic = () => {
    const [allSongs, setAllSongs] = useState(songs);
    const [currentSong, setCurrentSong] = useState(null);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);

    const handlePlaySong = (song, index) => {
        setCurrentSong(song);
        setCurrentSongIndex(index);
    }

    return { allSongs, handlePlaySong, currentSong, currentSongIndex };
}
