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
      <button aria-busy title="Laddar profil">
        <i className="fa-regular fa-user" />
      </button>
    );
  }

  if(!me){
    return(
            <div className="">
        <Menu>
            <MenuButton className="">
            <i className="fa-regular fa-user"></i>
            </MenuButton>

            <MenuItems
                transition
                anchor="bottom end"
                className="menu p-8 w-52 origin-top-right rounded-xl border border-white/5 bg-white/5 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
                >
                <MenuItem>
                    <Link  to="/auth/login" className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10">
                        Logga in
                        <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-focus:inline">⌘H</kbd>
                    </Link>
                </MenuItem>

            </MenuItems>
        </Menu>
    </div>
    );
  }

  return (
    <Menu>
        <MenuButton className="">
        <i className="fa-regular fa-user"></i>
        </MenuButton>

        <MenuItems
            transition
            anchor="bottom end"
            className="menu p-8 w-52 origin-top-right rounded-xl border border-white/5 bg-white/5 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
            >
            <MenuItem>
                <Link to="/profile" className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10">
                    Profile
                <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-focus:inline">⌘E</kbd>
                </Link>
            </MenuItem>
            <MenuItem>
                <Link to="/profile" className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10">
                    asdasd
                <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-focus:inline">⌘D</kbd>
                </Link>
            </MenuItem>
            <MenuItem>
                <Link to="/profile" className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10">
                GDPR
                    <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-focus:inline">⌘F</kbd>
                </Link>
            </MenuItem>
            <MenuItem>
                <Link to="/profile" className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10">
                Hjälp
                <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-focus:inline">⌘G</kbd>
                </Link>
            </MenuItem>
            <MenuItem>
                <Link to="/profile" className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10">
                     <button onClick={handleLogout}> Logga ut</button>
                <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-focus:inline">⌘H</kbd>
                </Link>
            </MenuItem>

        </MenuItems>
    </Menu>
  );
};






