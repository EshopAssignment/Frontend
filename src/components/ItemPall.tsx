const ItemPall = () => {
  return (
            <div className="item-card">

              <div>
                <img src="./src/images/Placeholder.jpg" alt="bild på pall" />
              </div>

              <div className="divider"></div>

              <div>
                <span>Pall 1</span>
                <p>pall som man kan ställa pall på</p>  
              </div>

              <div className="item-price">
                <p>100-pall-Sek</p>
                <button>
                  <i className="fa-solid fa-cart-plus"></i>
                </button>
              </div>

            </div>
  );
};

export default ItemPall;

