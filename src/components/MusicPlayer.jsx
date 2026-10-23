import { useEffect, useRef } from 'react';

import { useMusic } from '../contexts/MusicContext';

export const MusicPlayer = () => {
    const {
        currentSong,
        currentTime,
        formatTime,
        duration,
        setDuration,
        setCurrentTime,
        nextSong,
        previousSong,
        play,
        pause,
        isPlaying,
        volume,
        setVolume,
        trackVersion,
    } = useMusic();

    const audioRef = useRef(null);
    const trackVersionRef = useRef(trackVersion);

    const handleTimeChange = (e) => {
        const audio = audioRef.current;
        if (!audio) return;
        const newTime = parseFloat(e.target.value);
        audio.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const handleVolumeChange = (e) => {
        setVolume(parseFloat(e.target.value));
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.volume = volume;
    }, [volume, currentSong]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleLoadedMetadata = () => {
            if (Number.isFinite(audio.duration)) {
                setDuration(audio.duration);
            }
        };

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
        };

        const handleEnded = () => {
            nextSong();
        };

        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('canplay', handleLoadedMetadata);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);

        if (audio.readyState >= 1) {
            handleLoadedMetadata();
        }

        return () => {
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('canplay', handleLoadedMetadata);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [setDuration, setCurrentTime, currentSong, nextSong]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !currentSong) return;

        const songChanged = trackVersionRef.current !== trackVersion;
        trackVersionRef.current = trackVersion;

        if (songChanged) {
            setCurrentTime(0);
            audio.src = currentSong.url;
            audio.load();
        }

        if (isPlaying) {
            audio.play().catch((error) => {
                if (error?.name !== 'AbortError') {
                    console.error('Error playing audio:', error);
                }
            });
        } else {
            audio.pause();
        }
    }, [isPlaying, currentSong, trackVersion, setCurrentTime]);

    if (!currentSong) {
        return (
            <div className="music-player">
                <p className="no-track">No songs available</p>
            </div>
        );
    }

    const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div className="music-player">
            <audio ref={audioRef} preload="metadata" src={currentSong.url} />

            <div className="track-info">
                <h3 className="track-title">{currentSong.title}</h3>
                <p className="track-artist">{currentSong.artist}</p>
            </div>
            <div className="progress-container">
                <span className="time">{formatTime(currentTime)}</span>
                <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    step="0.1"
                    value={currentTime || 0}
                    className="progress-bar"
                    onChange={handleTimeChange}
                    style={{ "--progress": `${progressPercentage}%` }}
                />
                <span className="time">{formatTime(duration)}</span>
            </div>
            <div className="controls">
                <button className="control-btn" onClick={previousSong}>⏮</button>
                <button className="control-btn play-btn" onClick={() => isPlaying ? pause() : play()}>{isPlaying ? '⏸' : '▶'}</button>
                <button className="control-btn" onClick={nextSong}>⏭</button>
            </div>
            <div className="volume-container">
                <span className="volume-icon">🔊</span>
                <input type="range" min="0" max="1" step="0.01" className="volume-bar" value={volume} onChange={handleVolumeChange} />
            </div>
        </div>
    );
};
