import type { ProductDto } from "../../Services/productService";
import placeholder from "../../Images/placeholder.jpg";
import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";
import { toCartItem } from "../../helpers/toCartItem";
import { buildImageUrl } from "../../helpers/url";

interface Props{
  product: ProductDto
}


const ProductListView = ({product}: Props) => {
    const {addItem} = useCart();

    const img = buildImageUrl(product.imgUrl);
    const imgSrc = img || placeholder;

    const available = Number(product.available) || 0;

    const getBadgeClass = (qty: number) => {
        if (qty == 0) return "badge badge-oos";
        if (qty <= 20) return "badge badge-low";
        return "badge badge-high";
    };

    const getBadgeText = (qty: number) => {
        if (qty == 0) return "Slut i lager";
        if (qty <= 20) return `Få kvar (${qty})`;
        return `(${qty} st)`;
    };

    const disabled = available === 0;

    return (
        <div className="product-list-item">
            <div className="product-image phone-only">
                    <img
                        src={imgSrc}
                        alt={product.name}
                        onError={(e) => (e.currentTarget.src = placeholder)}
                    />
            </div>
            <Link className="product-link" to={`/product/${product.id}`}>
                <div className="product-image desctop-only">
                    <img
                        src={imgSrc}
                        alt={product.name}
                        onError={(e) => (e.currentTarget.src = placeholder)}
                    />
                </div>

                <div className="product-details">
                    <span className="product-name">{product.name}</span>
                    <div className="product-specs">
                        <p className="product-conditions">{product.condition}</p>
                        <p className="product-type"> {product.palletType}</p>
                    </div>
                    <p className="list-description">{product.description}</p>
                </div>

            </Link>
            <div className="product-shopping">
                <p className="product-price">{product.priceExVat} kr/st</p>
                <div className={getBadgeClass(available)} aria-label={`Lagersaldo: ${available}`}>
                    <p>{getBadgeText(available)}</p>
                </div>
                <button
                    disabled={disabled}
                    aria-disabled={disabled}
                    className={disabled ? "btn-add-cart is-disabled" : "btn-add-cart"}
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

export default ProductListView
