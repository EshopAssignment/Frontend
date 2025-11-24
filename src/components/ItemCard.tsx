import type { ProductDto } from "../Services/productService";
import placeholder from "../Images/Placeholder.jpg";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

interface Props{
  product: ProductDto
}

const ItemCard = ({product}: Props) => {
  const {addItem} = useCart();
  return (
    <div className="item-card">
        <Link to={`/product/${product.id}`} >
          <div>
            <img src={product.imgUrl} alt={product.name}
            onError={(e) => (e.currentTarget.src = placeholder)} />
          </div>
        
        <div className="divider"></div>

        <div>
          <span>{product.name}</span>
          <p>{product.description}</p>  
        </div>
      </Link>

        <div className="item-price">
          <p>{product.price} kr/st</p>
          
          <button onClick={() => addItem(product)}>
            <i className="fa-solid fa-cart-plus"></i>
          </button>
        </div>

      </div>
  );
};

export default ItemCard;

