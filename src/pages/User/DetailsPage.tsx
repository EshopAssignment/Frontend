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
    navigate("/", {replace: true});
    return null;
  }

const {data: product, isLoading, isError} = useProduct(pid);



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
                    <p>Lager: {product.available}</p>
                    <p>Pris/st: {product.priceExVat}</p>
                </div>

                <button className="btn-add-wide" onClick={() => addItem(toCartItem(product))}>
                    <i className="fa-solid fa-cart-plus"></i>
                </button>
            </div>

            <div className="divider"></div>

            <div className="details-img">
            <img
              src={buildImageUrl(product.imgUrl) || placeholder}
              alt={product.name}
              onError={(e) => { e.currentTarget.src = placeholder; }}
            />
            </div>
        </div>          
    </div>
  )
  
}
export default DetailsPage;