import { useParams, useNavigate } from "react-router-dom";
import placeholder from "../../images/placeholder.jpg";
import { useCart } from "../../context/CartContext";
import Breadcrumbs from "../../components/Breadcrumbs";
import { toCartItem } from "../../helpers/toCartItem";
import { useProduct } from "../../queries/useProducts";
import { buildImageUrl } from "../../helpers/url";


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
  const available = Number(product.available) || 0;

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

  const disabled = available === 0;

  return (

    <div className="container">
        <Breadcrumbs
            trail={[
            { label: "Hem", to: "/" },
            { label: "Produkter", to: "/products" }, 
            { label: product.name }          
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

                    <p>Pris/st: {product.priceExVat}</p>
                    <div className={getBadgeClass(available)} aria-label={`Lagersaldo: ${available}`}> Tillgängliga:
                        {getBadgeText(available)}
                    </div>

                </div>

                <button
                  className={`btn-add-wide${disabled ? " is-disabled" : ""}`}
                  disabled={disabled}
                  aria-disabled={disabled}
                  title={disabled ? "Produkten är slut i lager" : "Lägg i kundvagn"}
                  onClick={() => {
                    if (!disabled) addItem(toCartItem(product));
                  }}
                >
                    <i className="fa-solid fa-cart-plus"></i>
                </button>
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
  )
  
}
export default DetailsPage;