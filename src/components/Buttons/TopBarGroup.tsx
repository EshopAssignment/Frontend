import { useEffect, useState } from "react";
import Cart from "../Cart/Cart";
import { useCart } from "../../context/CartContext";

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
            <button>
              <i className="fa-regular fa-user"></i>
            </button>
          </div>

          <div>
            <button>
              <i className="fa-solid fa-phone"></i>
            </button>     
          </div>

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





