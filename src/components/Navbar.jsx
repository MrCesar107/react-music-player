import { Link, useLocation } from 'react-router';

export const Navbar = () => {
    const location = useLocation();
    
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link className="brand-link" to="/">Music Player</Link>
            </div>
            <div className="navbar-links">
                <Link className={`nav-link ${location.pathname === '/' ? 'active' : 'inactive'}`} to="/">All Songs</Link>
                <Link className={`nav-link ${location.pathname === '/playlists' ? 'active' : 'inactive'}`} to="/playlists">Playlists</Link>
            </div>
        </nav>
    );
};
