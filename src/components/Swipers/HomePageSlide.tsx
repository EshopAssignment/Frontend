import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay, Navigation, Pagination } from "swiper/modules";

import { DustSlide, HalfSlide, EuSlide } from "@/data/homePromos";
import type { HomeSlide } from "@/types/HomeSlide";

function PromoSwiper({
  heading,
  slide,
}: {
  heading: string;
  slide: HomeSlide;
}) {
  const hasMany = slide.image.length > 1;

  return (
    <>
    
      <div className="home-promo-section">
        <div className="home-promo-section-top">
          <h2 className="slider-heading">{heading}</h2>
        </div>

        <div className="promo-card">
          <div className="promo-card-media">
            <Swiper
              modules={[Autoplay, A11y, Pagination, Navigation]}
              spaceBetween={12}
              slidesPerView={2}
              autoplay={hasMany ? { delay: 3000, disableOnInteraction: false } : false}
              loop={hasMany}
            >
              {slide.image.map((src, i) => (
                <SwiperSlide className="promo-card-slide" key={`${slide.title}-${i}`}>
                  <img className="promo-card-image" src={src} alt={slide.alt} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="promo-card-overlay">
              <div className="promo-card-group">
                  <div className="slider-text">
                      <h3 className="promo-card-title">{slide.title}</h3>
                      {slide.subtitle && <p className="promo-card-subtitle">{slide.subtitle}</p>}
                  </div>
                  <Link to={slide.to} className="btn btn-slide">{slide.btnText}</Link>
              </div>
          </div>
        </div>

      </div>
      <div className="divider"></div>
    </>
  );
}

export default function HomePageSlide() {
  return (
    <div className="home-promos">
      <PromoSwiper heading="EU-pall" slide={EuSlide[0]} />
      <PromoSwiper heading="Halv-pall" slide={HalfSlide[0]} />
      <PromoSwiper heading="Övrigt" slide={DustSlide[0]} />
      
    </div>
  );
}
