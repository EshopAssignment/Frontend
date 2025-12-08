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

const available = Number(product.available) || 0;

const getBadgeClass = (qty:number) => {
  if (qty == 0 ) return "badge badge-oos"
  if (qty <= 20) return "badge badge-low" 
  return "badge badge-high"
}

const getBadgeText = (qty: number) => {
    if (qty == 0 ) return "Slut i lager"
  if (qty <= 20) return `Lågt saldo (${qty})`;
  return `(${qty} st)`
}
  const disabled = available === 0;

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
          <p>{product.priceExVat} kr/st</p>
          
          <div className={getBadgeClass(available)} aria-label={`Lagersaldo: ${available}`}>
            {getBadgeText(available)}
          </div>

            <button
              disabled={disabled}
              aria-disabled={disabled}
              className={disabled ? "is-disabled" : ""}
              title={disabled ? "Produkten är slut i lager" : "Lägg i kundvagn"}
              onClick={() => {
                if (!disabled) addItem(toCartItem(product));
              }}
            >
            <i className="fa-solid fa-cart-plus"></i>
          </button>
        </div>

      </div>
  );
};

export default ItemCard;

