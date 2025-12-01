import { useEffect, useState } from "react";
import Cart from "../Cart/Cart";
import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";
import { Popover, PopoverButton, PopoverPanel} from '@headlessui/react'

const TopBarGroup = () => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { state } = useCart();

    useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const badgeLabel = totalItems > 99 ? "99+" : totalItems.toString();


  return (
    <>
      <div className="btn-group">

          <div className="cart-btn-wrapper">
            <button
              onClick={() => setIsCartOpen((prev) => !prev)}>
              <i className="fa-solid fa-cart-shopping"></i>
            </button>
              {totalItems > 0 && (
                <span className="cart-badge">
                  {badgeLabel}
                </span>
              )}
          </div>

          <div>
            <Link to="/profile">
            
              <button>
                <i className="fa-regular fa-user"></i>
              </button>
            
            </Link>
          </div>

        <Popover>
          <PopoverButton>                
            <i className="fa-solid fa-phone"></i>
          </PopoverButton>
          <PopoverPanel anchor="bottom" className="help-menu">
            <span>Behöver du hjälp?</span>
            <a href="/#">070123132</a>
            <a href="/#">help@pall.se</a>
            <a href="/#">Online-Hjälp</a>
          </PopoverPanel>
        </Popover>
      </div>
    
      {(
        <div className={`cart-overlay ${isCartOpen ? "open" : ""}`}>
          <div
            className="cart-overlay-backdrop"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="cart-overlay-panel">
            {isCartOpen && <Cart />}
          </div>
        </div>
      )}
    
    </>
  );
};

export default TopBarGroup;





