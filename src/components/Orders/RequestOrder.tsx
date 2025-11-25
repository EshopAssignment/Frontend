
const RequestOrder = () => {


  return (
      <div className="container">
        <div className="request-info">
            <h2>Hittar du inte vad du söker?</h2>
            <p>Vi tillverkar alltid speciallanpassade pallar efter förfrågan! fyll i formuläret</p>
            <p>Har du en ritning eller en skiss? ladda upp den så vi lättare kan hjälpa just er!</p>
        </div>
        <div>
            <form className="form">
                <div className="from-head">
                    <h2>Special order</h2>
                </div>

                <div className="form-group">                

                    <div className="input-group">
                        <label htmlFor="name"  className="lable">Namn</label>
                        <input id="name"  className="input"></input>
                    </div>
                    
                    <div className="input-group">
                        <label htmlFor="email" className="lable">E-post</label>
                        <input id="email" className="input"></input>
                    </div>

                    <div className="input-group">
                        <label htmlFor="phone" className="lable">Telefon nummer</label>
                        <input id="phone" className="input"></input>
                    </div>

                    <div className="input-group">
                        <label htmlFor="adress" className="lable">Adress</label>
                        <input id="adress" className="input"></input>
                    </div>

                    <div className="rte">
                        en RTE här tacksåmycket

                    </div>

                    <div className="btn btn-submit">
                        <button>Skicka</button>
                    </div>

                </div>
            </form>
        </div>
      </div>
  );
};

export default RequestOrder;
