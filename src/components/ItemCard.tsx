import type { ProductDto } from "../Services/productService";
import placeholder from "../Images/Placeholder.jpg";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { toCartItem } from "../helpers/toCartItem";
import { buildImageUrl } from "../helpers/url";

interface Props{
  product: ProductDto
}


const ItemCard = ({product}: Props) => {
const {addItem} = useCart();

const img = buildImageUrl(product.imgUrl);
const imgSrc = img || placeholder;

  return (
    <div className="item-card">
        <Link to={`/product/${product.id}`} >
          <div>
            <img src={imgSrc} alt={product.name}
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
          
          <button onClick={() => addItem(toCartItem(product))}>
            <i className="fa-solid fa-cart-plus"></i>
          </button>
        </div>

      </div>
  );
};

export default ItemCard;

