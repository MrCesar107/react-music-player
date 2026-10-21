import { useState, useEffect } from 'react';

const songs = [
    {
        id: 1,
        title: "preview",
        artist: "Artist",
        url: "/songs/preview.mp3",
        duration: "02:05",
    }
];

export const useMusic = () => {
    const [allSongs, setAllSongs] = useState(songs);
    const [currentSong, setCurrentSong] = useState(songs[0]);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);

    const handlePlaySong = (song, index) => {
        setCurrentSong(song);
        setCurrentSongIndex(index);
    };

    const formatTime = (time) => {
        if (isNaN(time)) return '00:00';
        
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);

        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const nextSong = () => {
        setCurrentSongIndex((prevSong) => {
            const nextIndex = (prevSong + 1) % allSongs.length;
            setCurrentSong(allSongs[nextIndex]);
            return nextIndex;
        });
        setIsPlaying(true);
    };

    const previousSong = () => {
        setCurrentSongIndex((prevSong) => {
            const nextIndex = prevSong === 0 ? allSongs.length - 1 : prevSong - 1;
            setCurrentSong(allSongs[nextIndex]);
            return nextIndex;
        })
        setIsPlaying(true);
    };

    const play = () => setIsPlaying(true);
    const pause = () => setIsPlaying(false);

    return {
        allSongs,
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
    };
}
