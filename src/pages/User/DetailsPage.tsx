import { useParams, useNavigate } from "react-router-dom";
import placeholder from "../../images/placeholder.jpg";
import { useCart } from "../../context/CartContext";
import Breadcrumbs from "../../components/Breadcrumbs";
import { toCartItem } from "../../helpers/toCartItem";
import { useProduct } from "../../queries/useProducts";
import { buildImageUrl } from "../../helpers/url";
import { priceIncVat } from "@/helpers/money";
import { fmtSEK } from "@/helpers/orderFormat";
import { useState } from "react";

const DetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const pid = Number(id);
  if (!pid || Number.isNaN(pid)) {
    navigate("/", { replace: true });
    return null;
  }

  const { data: product, isLoading, isError } = useProduct(pid);

  const [adding, setAdding] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (isLoading) {
    return (
      <section className="container product-details">
        <div className="product-skeleton" />
      </section>
    );
  }

  if (isError || !product) {
    return (
      <section className="container product-details">
        <p>Error Error WEEEEEEEEEEEEEEEEEEEEEEE</p>
        <button onClick={() => navigate(-1)}>Return</button>
      </section>
    );
  }

  const imgSrc = buildImageUrl(product.imgUrl) || placeholder;
  const available = Number((product as any).available) || 0;

  const getBadgeClass = (qty: number) => {
    if (qty === 0) return "badge badge-oos";
    if (qty <= 20) return "badge badge-low";
    return "badge badge-high";
  };

  const getBadgeText = (qty: number) => {
    if (qty === 0) return "Slut i lager";
    if (qty <= 20) return `Lågt saldo (${qty})`;
    return `(${qty} st)`;
  };

  const disabledByStock = available === 0;
  const disabled = disabledByStock || adding;

  const priceInc = priceIncVat(product.priceExVat, product.vatRatePercent);

  const onAdd = async () => {
    if (disabled) return;
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

  return (
    <div className="container">
      <Breadcrumbs
        trail={[
          { label: "Hem", to: "/" },
          { label: "Produkter", to: "/products" },
          { label: product.name },
        ]}
      />

      <div className="details-content">
        <div className="details-hero">
          <div className="details-name">
            <h2>{product.name}</h2>
            <p>Type: {product.palletType}</p>
            <p>Condition: {product.condition}</p>
          </div>

          <div className="details-desc">
            <span>{product.description}</span>
          </div>

          <div className="details-price">
            <p>Pris/st: {fmtSEK(priceInc)} Kr</p>

            <div className={getBadgeClass(available)} aria-label={`Lagersaldo: ${available}`}>
              Tillgängliga: {getBadgeText(available)}
            </div>
          </div>

          <button
            className={`btn-add-wide${disabled ? " is-disabled" : ""}`}
            disabled={disabled}
            aria-disabled={disabled}
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

          {err && <p className="details-error">{err}</p>}
        </div>

        <div className="divider"></div>

        <div className="details-img">
          <img
            src={imgSrc}
            alt={product.name}
            onError={(e) => {
              e.currentTarget.src = placeholder;
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;
