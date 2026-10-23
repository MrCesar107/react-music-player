import { useState, useEffect } from 'react';
import { useMusic } from '../contexts/MusicContext';

export const Playlists = () => {
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);

    const { createPlaylist, playlists, allSongs, addSongToPlaylist, currentSongIndex, handlePlaySong, deletePlaylist, setPlaylists } = useMusic();

    useEffect(() => {
        const storedPlaylists = localStorage.getItem("music-player-playlists-react");
        
        if (storedPlaylists) {
            setPlaylists(JSON.parse(storedPlaylists));
        }
    }, []);

    useEffect(() => {
        if (playlists.length > 0) {
            localStorage.setItem("music-player-playlists-react", JSON.stringify(playlists));
        } else {
            localStorage.removeItem("music-player-playlists-react");
        }
    }, [playlists]);

    const filteredSongs = allSongs.filter((song) => {
        const matches =
            song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            song.artist.toLowerCase().includes(searchQuery.toLowerCase());

        const alreadyInPlaylist = selectedPlaylist?.songs.some(
            (playlistSong) => playlistSong.id === song.id
        );
        
        return matches && !alreadyInPlaylist;
    });

    const handleCreatePlaylist = () => {
        if (newPlaylistName.trim()) {
            createPlaylist(newPlaylistName.trim());
            setNewPlaylistName('');
        }
    };

    const handleAddSong = (song) => {
        if (selectedPlaylist) {
            addSongToPlaylist(selectedPlaylist.id, song);
            setShowDropdown(false);
            setSearchQuery("");
        }
    }

    const handlePlayingFromPlaylist = (song) => {
        const globalIndex = allSongs.findIndex((s) => s.id === song.id);
        handlePlaySong(song, globalIndex);
    }

    const deletePlaylistConfirmation = (playlist) => {
        if (window.confirm("Are you sure you want to delete this playlist?")) {
            deletePlaylist(playlist.id);
        }
    }

    return (
        <div className="playlists">
            <h2>Playlists</h2>
            <div className="create-playlist">
                <h3>Create New Playlist</h3>
                <div className="playlist-form">
                    <input type="text" className="playlist-input" placeholder="Enter playlist name" onChange={(e) => setNewPlaylistName(e.target.value)} value={newPlaylistName} />
                    <button className="create-btn" onClick={handleCreatePlaylist}>Create</button>
                </div>
            </div>
            <div className="playlists-lists">
                {playlists.length === 0 ? (<p className="empty-message">No playlists yet</p>) : (playlists.map((playlist, key) => (
                    <div key={key} className="playlist-item">
                        <div className="playlist-header">
                            <h3 className="playlist-name">{playlist.name}</h3>
                            <div className="playlist-actions">
                                <button className="delete-playlist-btn" onClick={() => deletePlaylistConfirmation(playlist)}>Delete</button>
                            </div>
                        </div>
                        <div className="add-song-section">
                            <div className="search-container">
                                <input 
                                    type="text"
                                    className="song-search-input"
                                    placeholder="Search"
                                    value={selectedPlaylist?.id === playlist.id ? searchQuery : ""}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setSelectedPlaylist(playlist);
                                        setShowDropdown(e.target.value.length > 0);
                                    }}
                                    onFocus={(e) => {
                                        setSelectedPlaylist(playlist);
                                        setShowDropdown(e.target.value.length > 0);
                                    }}
                                />
                                {selectedPlaylist?.id === playlist.id && showDropdown && (
                                    <div className="song-dropdown">
                                        {filteredSongs.length === 0 ? (
                                            <div className="dropdown-item no-results">No songs found</div>
                                        ) : (
                                            filteredSongs.slice(0, 5).map((song, key) => (
                                                <div key={key} className="dropdown-item" onClick={() => handleAddSong(song)}>
                                                    <span className="song-title">{song.title}</span>
                                                    <span className="song-artist">{song.artist}</span>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="playlist-songs">
                            {playlist.songs.legth === 0 ? (<p className="empty-playlist">No songs in this playlist</p>) : playlist.songs.map((song, key) => (
                                <div key={key} className={`playlist-song ${currentSongIndex === allSongs.findIndex((s) => s.id === song.id) ? "active" : ""}`} onClick={() => handlePlayingFromPlaylist(song)}>
                                    <div className="song-info">
                                        <span className="song-title">{song.title}</span>
                                        <span className="song-artist">{song.artist}</span>
                                    </div>
                                    <span className="song-duration">{song.duration}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )))}
            </div>
        </div>
    );
};
