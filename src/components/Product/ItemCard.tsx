import { Link } from "react-router-dom";

import type { ProductDto } from "../../Services/productService";
import { buildImageUrl } from "../../helpers/url";
import { priceIncVat } from "@/helpers/money";
import { fmtSEK } from "@/helpers/orderFormat";
import { getStockBadgeClass, getStockBadgeText } from "@/helpers/stockBadge";

import placeholder from "@/images/Placeholder.jpg";
import { useAddToCart } from "@/hooks/useAddCart";

interface Props {
  product: ProductDto;
}

const ItemCard = ({ product }: Props) => {

  const imgSrc = buildImageUrl(product.imgUrl) || placeholder;

  const available = Number((product as any).available) || 0;


  const priceInc = priceIncVat(product.priceExVat, product.vatRatePercent);

  const badgeClass = getStockBadgeClass(available);
  const badgeText = getStockBadgeText(available, "few");

  const { add, disabled, disabledByStock, adding, error } = useAddToCart(product, available);


  return (
    <div className="item-card">
      <Link to={`/product/${product.id}`}>
        <div>
          <img
            src={imgSrc}
            alt={product.name}
            onError={(e) => (e.currentTarget.src = placeholder)}
          />
        </div>

        <div className="divider" />

        <div className="product-text">
          <div>
            <span>{product.name}</span>
            <p>
              {product.condition} | {product.palletType}
            </p>
          </div>

          <div>
            <p className="card-description">{product.description}</p>
          </div>
        </div>
      </Link>

      <div className="item-price">
        <p>{fmtSEK(priceInc)} kr/st</p>

        <div className={badgeClass} aria-label={`Lagersaldo: ${available}`}>
          <p>{badgeText}</p>
        </div>

        <button
          disabled={disabled}
          aria-disabled={disabled}
          className={disabled ? "is-disabled" : ""}
          title={
            disabledByStock
              ? "Produkten är slut i lager"
              : adding
              ? "Lägger i varukorg..."
              : "Lägg i kundvagn"
          }
          onClick={() => void add()}
        >
          <i className="fa-solid fa-cart-plus" />
        </button>

        {error && <p className="item-card-error sr-only">{error}</p>}
      </div>
    </div>
  );
};

export default ItemCard;
