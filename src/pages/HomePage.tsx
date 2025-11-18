import ItemPall from "../components/ItemPall";

const HomePage = () => {
  return (
    <section>
      <div className="container">
          <div className="items">
          
          <div className="item-card-container">

              <ItemPall />
              <ItemPall />
              <ItemPall />
              <ItemPall />
              <ItemPall />


          </div>

          </div>
          <div className="divider"></div>
          <div className="cart">
            <p>Här ligger mina pallar jag köper</p>
          </div>


      </div>
    </section>
  );
  
}
export default HomePage;