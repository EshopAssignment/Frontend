import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";


const Help = () => {
  return (
    <div className="help">
      <div className="acordion">
        <Disclosure>
          <DisclosureButton>Min beställning saknas!</DisclosureButton>
          <DisclosurePanel><span>
            Synd. Du har redan betalat så det är inte vårat problem 
          </span>
          </DisclosurePanel>
        </Disclosure>
      </div>
      <div className="acordion">
        <Disclosure>
          <DisclosureButton>Kan man betala med faktura?</DisclosureButton>
          <DisclosurePanel>
            <span>
            Ja! Du kan finansiera dina pallar med "SMSA Låna"
            </span>
          </DisclosurePanel>
        </Disclosure>
      </div>
      <div className="acordion">
        <Disclosure>
          <DisclosureButton>Jag tycker ni har dålig service!!!!</DisclosureButton>
          <DisclosurePanel>
            <span>Womp Womp :/ Vi har ringt en Wambulance åt dig</span>            
          </DisclosurePanel>
        </Disclosure>
      </div>
      <div className="acordion">
        <Disclosure>
          <DisclosureButton>Mina pallar var skadade när det kom fram!</DisclosureButton>
          <DisclosurePanel><span>
            Och du var skadad när du föddes, nu är ni lika!
          </span>
          </DisclosurePanel>
        </Disclosure>
      </div>

    </div>
  );
};

export default Help;