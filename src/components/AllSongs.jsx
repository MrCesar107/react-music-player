import { useMusic } from "../contexts/MusicContext";

export const AllSongs = () => {
  const { allSongs, handlePlaySong, currentSongIndex, isPlaying } = useMusic();

  return (
    <div className="all-songs">
      <h2>All Songs ({allSongs.length})</h2>
      <div className="songs-grid">
        {allSongs.map((song, index) => {
          const isCurrent = currentSongIndex === index;

          return (
            <div
              className={`song-card ${isCurrent ? "active" : ""}`}
              key={song.id}
              onClick={() => handlePlaySong(song, index)}
            >
              <div className="song-info">
                <h3 className="song-title">{song.title}</h3>
                <p className="song-artist">{song.artist}</p>
                <span className="song-duration">{song.duration}</span>
              </div>
              <div className="play-button">
                {isCurrent && isPlaying ? "⏸️" : "▶️"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
