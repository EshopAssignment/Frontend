import { Link, useNavigate } from "react-router-dom";

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { useLogout, useMe } from "@/queries/auth";

export default function ProfileBtn() {
    const { data: me, isLoading } = useMe();
    const logout = useLogout();
    const nav = useNavigate();

    const handleLogout = async () => {
    try {
      await logout.mutateAsync();
      nav("/", { replace: true });
    } catch {
    }
  };

  if (isLoading) {
    return (
      <button
        type="button"
        className="profile-btn is-loading"
        aria-busy
        title="Laddar profil"
      >
        <i className="fa-regular fa-user" />
      </button>
    );
  }

  if (!me) {
    return (
      <Menu>
        <MenuButton
          type="button"
          className="profile-btn is-guest"
          aria-label="Öppna konto"
        >
          <i className="fa-regular fa-user" />
        </MenuButton>

        <MenuItems
          transition
          anchor="bottom end"
          className="menu w-52 origin-top-right rounded-xl border border-white/5 bg-white/5 p-1 text-sm/6 text-white transition duration-100 ease-out data-closed:scale-95 data-closed:opacity-0"
        >
          <MenuItem>
            <Link to="/auth/login" className="menu-item">
              Logga in
            </Link>
          </MenuItem>
        </MenuItems>
      </Menu>
    );
  }

  return (
    <Menu>
      <MenuButton
        type="button"
        className="profile-btn is-auth"
        aria-label="Öppna profilmeny"
      >
        <i className="fa-regular fa-user" />
      </MenuButton>

      <MenuItems
        transition
        anchor="bottom end"
        className="menu w-56 origin-top-right rounded-xl border border-white/5 bg-white/5 p-1 text-sm/6 text-white transition duration-100 ease-out data-closed:scale-95 data-closed:opacity-0"
      >
        <MenuItem>
          <Link to="/profile" className="menu-item">
            Profil
          </Link>
        </MenuItem>

        <MenuItem>
          <Link to="/profile" className="menu-item">
            Inställningar
          </Link>
        </MenuItem>

        <MenuItem>
          <Link to="/profile" className="menu-item">
            GDPR
          </Link>
        </MenuItem>

        <MenuItem>
          <Link to="/profile" className="menu-item">
            Hjälp
          </Link>
        </MenuItem>

        <div className="menu-divider" />

        <MenuItem>
          <button
            type="button"
            onClick={handleLogout}
            className="menu-item is-danger"
          >
            Logga ut
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}