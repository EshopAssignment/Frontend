import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import placeholder from "../../images/placeholder.jpg";
import Breadcrumbs from "../../components/Breadcrumbs";
import { useProduct } from "../../hooks/Products/useProducts";
import { resolveImageUrl } from "../../helpers/ImageHelper";
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
  const available = Number(product?.available ?? 0);

  const { add, disabled, disabledByStock, adding, error } = useAddToCart(product, available);

  const images = useMemo(() => {
    if (!product) return [];

    const list = Array.isArray(product.images)
      ? product.images
          .filter((img) => String(img?.url ?? "").trim())
          .slice()
          .sort(
            (a, b) =>
              (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0) ||
              Number(a.sortOrder ?? 0) - Number(b.sortOrder ?? 0)
          )
      : [];

    if (list.length === 0 && product.primaryImgUrl) {
      return [
        {
          url: product.primaryImgUrl,
          isPrimary: true,
          sortOrder: 0,
          altText: product.name,
        },
      ];
    }

    return list;
  }, [product]);

  const [selectedUrl, setSelectedUrl] = useState("");

  useEffect(() => {
    if (!isValidPid) navigate("/", { replace: true });
  }, [isValidPid, navigate]);

  useEffect(() => {
    if (!product) return;

    const primary =
      images.find((img) => img.isPrimary)?.url ||
      images[0]?.url ||
      product.primaryImgUrl ||
      "";

    setSelectedUrl(primary);
  }, [product, images]);

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
        <p>Produkten kunde inte hämtas.</p>
        <button onClick={() => navigate(-1)}>Tillbaka</button>
      </section>
    );
  }


  const heroUrl =
    resolveImageUrl(selectedUrl) ||
    resolveImageUrl(product.primaryImgUrl) ||
    placeholder;

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
            <p>Pris/st: {fmtSEK(priceInc)} kr</p>

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
            src={heroUrl}
            alt={product.name}
            onError={(e) => {
              e.currentTarget.src = placeholder;
            }}
          />

          {!!images.length && (
            <div className="details-thumbs">
              {images.map((img, idx) => {
                const thumbSrc = resolveImageUrl(img.url) || placeholder;
                const isSelected = img.url === selectedUrl;

                return (
                  <button
                    key={`${img.url}-${idx}`}
                    type="button"
                    className={`details-thumb${isSelected ? " is-active" : ""}`}
                    onClick={() => setSelectedUrl(img.url)}
                    aria-label={`Visa bild ${idx + 1} för ${product.name}`}
                  >
                    <img
                      src={thumbSrc}
                      alt={img.altText ?? `${product.name} bild ${idx + 1}`}
                      onError={(e) => {
                        e.currentTarget.src = placeholder;
                      }}
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;