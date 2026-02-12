import Cart from "../Cart/Cart";
import { useCart } from "../../context/CartContext";
import ProfileBtn from "./ProfileBtn";
import HelpBtn from "./HelpBtn";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useLocation } from "react-router-dom";
import AdminBtn from "./AdminBtn";
import { useMe } from "@/queries/auth";

const TopBarGroup = () => {
    const { state } = useCart();
    const { pathname } = useLocation();
    const {data:me} = useMe();

    const hideCart = pathname.startsWith("/checkout") || pathname.startsWith("/order/thank-you");
    const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
    const badgeLabel = totalItems > 99 ? "99+" : totalItems.toString();

  const isAdmin = !!me?.roles?.includes("Admin");
  return (
    <>
      <div className="btn-group">
      {!hideCart && (
                <Menu>
                    <div className="cart-btn-wrapper">
                      <MenuButton>
                        <i className="fa-solid fa-cart-shopping"></i>
                      </MenuButton>
                        {totalItems > 0 && (
                          <span className="cart-badge">
                            {badgeLabel}
                          </span>
                        )}
                    </div>
                    <MenuItems
                        transition
                        anchor="bottom end"
                        className="cart-menu p-8 w-52 origin-top-right rounded-xl border border-white/5 bg-white/5 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
                        >
                      <MenuItem>
                          <Cart/>
                      </MenuItem>
        
                    </MenuItems>
                  </Menu>
      )}

          <ProfileBtn />

          {isAdmin ? <AdminBtn /> : <HelpBtn />}
      </div>

    </>
  );
};

export default TopBarGroup;