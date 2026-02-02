import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import placeholder from "../../images/placeholder.jpg";
import Breadcrumbs from "../../components/Breadcrumbs";
import { useProduct } from "../../queries/useProducts";
import { buildImageUrl } from "../../helpers/url";
import { priceIncVat } from "@/helpers/money";
import { fmtSEK } from "@/helpers/orderFormat";

import { getStockBadgeClass, getStockBadgeText } from "@/helpers/stockBadge";
import { useAddToCart } from "@/hooks/useAddCart";

const DetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const pid = Number(id);
  const isValidPid = Number.isFinite(pid) && pid > 0;
  const safePid = isValidPid ? pid : 0;

  const { data: product, isLoading, isError } = useProduct(safePid);

  useEffect(() => {
    if (!isValidPid) navigate("/", { replace: true });
  }, [isValidPid, navigate]);

  const available = product ? Number((product as any).available) || 0 : 0;

  const { add, disabled, disabledByStock, adding, error } = useAddToCart(product ?? null, available);

  if (!isValidPid) return null;

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

  const badgeClass = getStockBadgeClass(available);
  const badgeText = getStockBadgeText(available, "low");

  const priceInc = priceIncVat(product.priceExVat, product.vatRatePercent);

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

            <div className={badgeClass} aria-label={`Lagersaldo: ${available}`}>
              Tillgängliga: {badgeText}
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
            onClick={() => void add(1)}
          >
            <i className="fa-solid fa-cart-plus" />
          </button>

          {error && <p className="details-error">{error}</p>}
        </div>

        <div className="divider" />

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
