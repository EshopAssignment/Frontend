import type { ProductDto } from "../../Services/productService";
import placeholder from "../../Images/placeholder.jpg";
import { Link } from "react-router-dom";
import { buildImageUrl } from "../../helpers/url";
import { priceIncVat } from "@/helpers/money";
import { fmtSEK } from "@/helpers/orderFormat";

import { getStockBadgeClass, getStockBadgeText } from "@/helpers/stockBadge";
import { useAddToCart } from "@/hooks/useAddCart";

interface Props {
  product: ProductDto;
}

const ProductListView = ({ product }: Props) => {
  const imgSrc = buildImageUrl(product.imgUrl) || placeholder;

  const available = Number((product as any).available) || 0;
  const priceInc = priceIncVat(product.priceExVat, product.vatRatePercent);

  const badgeClass = getStockBadgeClass(available);
  const badgeText = getStockBadgeText(available, "few");

  const { add, disabled, disabledByStock, adding, error } = useAddToCart(product, available);

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
            <p className="product-type">{product.palletType}</p>
          </div>
          <p className="list-description">{product.description}</p>
        </div>
      </Link>

      <div className="product-shopping">
        <p className="product-price">{fmtSEK(priceInc)}/st</p>

        <div className={badgeClass} aria-label={`Lagersaldo: ${available}`}>
          <p>{badgeText}</p>
        </div>

        <button
          disabled={disabled}
          aria-disabled={disabled}
          className={disabled ? "btn-add-cart is-disabled" : "btn-add-cart"}
          title={
            disabledByStock
              ? "Produkten är slut i lager"
              : adding
              ? "Lägger i varukorg..."
              : "Lägg i kundvagn"
          }
          onClick={() => void add(1)}
        >
          <i className="fa-solid fa-cart-plus" />
        </button>

        {error && <p className="list-error sr-only">{error}</p>}
      </div>
    </div>
  );
};

export default ProductListView;
