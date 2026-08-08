import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authcontext.jsx";

function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSignOut() {
    await signOut();
    navigate("/");
  }

  const displayName = profile?.username || user?.email;
  const initial = displayName ? displayName[0].toUpperCase() : "?";

  return (
    <div className="profile-menu" ref={menuRef}>
      <button
        className="profile-avatar"
        onClick={() => setIsOpen((v) => !v)}
        aria-label="profil menüsü"
      >
        {initial}
      </button>

      {isOpen && (
        <div className="profile-dropdown">
          {profile?.username && (
            <p className="profile-username">{profile.username}</p>
          )}
          {user?.email && <p className="profile-email">{user.email}</p>}
          <button className="profile-item" onClick={handleSignOut}>
            çıkış yap
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfileMenu;