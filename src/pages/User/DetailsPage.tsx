import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import placeholder from "../../images/placeholder.jpg";
import Breadcrumbs from "../../components/Breadcrumbs";
import { useProduct } from "../../hooks/Products/useProducts";
import { resolveImageUrl } from "../../helpers/ImageHelper";
import { priceIncVat } from "@/helpers/money";
import { fmtSEK } from "@/helpers/orderFormat";
import { getStockBadgeClass, getStockBadgeText } from "@/helpers/stockBadge";
import { useAddToCart } from "@/hooks/useAddCart";


type ProductImageVm = {
  url: string;
  altText: string | null;
  isPrimary: boolean;
  sortOrder: number;
};

const DetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const pid = Number(id);
  const isValidPid = Number.isFinite(pid) && pid > 0;
  const safePid = isValidPid ? pid : 0;

  const { data: product, isLoading, isError } = useProduct(safePid);
  const available = Number(product?.available ?? 0);

  const { add, disabled, disabledByStock, adding, error } = useAddToCart(product, available);

  const [activeIndex, setActiveIndex] = useState(0);
  const [swiper, setSwiper] = useState<SwiperType | null>(null);

  const images = useMemo<ProductImageVm[]>(() => {
    if (!product) return [];

    const mapped =
      Array.isArray(product.images) && product.images.length > 0
        ? product.images
            .filter((img) => String(img?.url ?? "").trim())
            .map((img) => ({
              url: String(img.url),
              altText: img.altText ?? null,
              isPrimary: Boolean(img.isPrimary),
              sortOrder: Number(img.sortOrder ?? 0),
            }))
            .sort(
              (a, b) =>
                Number(b.isPrimary) - Number(a.isPrimary) ||
                a.sortOrder - b.sortOrder
            )
        : [];

    if (mapped.length > 0) return mapped;

    if (product.primaryImgUrl) {
      return [
        {
          url: product.primaryImgUrl,
          altText: product.name,
          isPrimary: true,
          sortOrder: 0,
        },
      ];
    }

    return [];
  }, [product]);

  const imageUrls = useMemo(() => {
    const urls = images
      .map((img) => ({
        ...img,
        resolvedUrl: resolveImageUrl(img.url) || placeholder,
      }))
      .filter((img) => img.resolvedUrl);

    if (urls.length > 0) return urls;

    return [
      {
        url: "",
        altText: product?.name ?? "Produktbild",
        isPrimary: true,
        sortOrder: 0,
        resolvedUrl: placeholder,
      },
    ];
  }, [images, product]);

  useEffect(() => {
    if (!isValidPid) {
      navigate("/", { replace: true });
    }
  }, [isValidPid, navigate]);

  useEffect(() => {
    setActiveIndex(0);
    swiper?.slideTo(0);
  }, [product, swiper]);

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
        <button type="button" onClick={() => navigate(-1)}>
          Tillbaka
        </button>
      </section>
    );
  }

  const badgeClass = getStockBadgeClass(available);
  const badgeText = getStockBadgeText(available, "low");
  const priceInc = priceIncVat(product.priceExVat, product.vatRatePercent);
  const hasManyImages = imageUrls.length > 1;

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
            type="button"
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
          <Swiper
            modules={[Navigation, Pagination, A11y]}
            slidesPerView={1}
            spaceBetween={12}
            navigation={hasManyImages}
            pagination={hasManyImages ? { clickable: true } : false}
            onSwiper={setSwiper}
            onSlideChange={(instance) => setActiveIndex(instance.activeIndex)}
            className="details-swiper"
          >
            {imageUrls.map((img, idx) => (
              <SwiperSlide key={`${img.url}-${idx}`}>
                <img
                  className="details-swiper-image"
                  src={img.resolvedUrl}
                  alt={img.altText ?? `${product.name} bild ${idx + 1}`}
                  onError={(e) => {
                    e.currentTarget.src = placeholder;
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {hasManyImages && (
            <div className="details-thumbs">
              {imageUrls.map((img, idx) => (
                <button
                  key={`${img.url}-thumb-${idx}`}
                  type="button"
                  className={`details-thumb${idx === activeIndex ? " is-active" : ""}`}
                  onClick={() => swiper?.slideTo(idx)}
                  aria-label={`Visa bild ${idx + 1} för ${product.name}`}
                >
                  <img
                    src={img.resolvedUrl}
                    alt={img.altText ?? `${product.name} miniatyr ${idx + 1}`}
                    onError={(e) => {
                      e.currentTarget.src = placeholder;
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;