import type { ProductDto } from "../../Services/productService";
import placeholder from "../../Images/placeholder.jpg";
import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";
import { toCartItem } from "../../helpers/toCartItem";
import { buildImageUrl } from "../../helpers/url";
import { priceIncVat } from "@/helpers/money";
import { fmtSEK } from "@/helpers/orderFormat";
import { useState } from "react";

interface Props{
  product: ProductDto
}


const ProductListView = ({ product }: Props) => {
  const { addItem } = useCart();

  const img = buildImageUrl(product.imgUrl);
  const imgSrc = img || placeholder;

  const available = Number((product as any).available) || 0;

  const getBadgeClass = (qty: number) => {
    if (qty === 0) return "badge badge-oos";
    if (qty <= 20) return "badge badge-low";
    return "badge badge-high";
  };

  const getBadgeText = (qty: number) => {
    if (qty === 0) return "Slut i lager";
    if (qty <= 20) return `Få kvar (${qty})`;
    return `(${qty} st)`;
  };

  const disabledByStock = available === 0;

  const priceInc = priceIncVat(product.priceExVat, product.vatRatePercent);

  const [adding, setAdding] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onAdd = async () => {
    if (disabledByStock || adding) return;

    setErr(null);
    setAdding(true);
    try {
      await addItem(toCartItem(product), 1);
    } catch (e) {
      setErr((e as Error)?.message ?? "Kunde inte lägga i varukorgen.");
    } finally {
      setAdding(false);
    }
  };

  const disabled = disabledByStock || adding;

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
        <p className="product-price">{fmtSEK(priceInc)} kr/st</p>

        <div className={getBadgeClass(available)} aria-label={`Lagersaldo: ${available}`}>
          <p>{getBadgeText(available)}</p>
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
          onClick={() => void onAdd()}
        >
          <i className="fa-solid fa-cart-plus"></i>
        </button>

        {err && <p className="list-error">{err}</p>}
      </div>
    </div>
  );
};

export default ProductListView;
