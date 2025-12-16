import type { HomeSlide } from "@/types/HomeSlide";
import eu1 from "../../src/images/home4.jpg";
import eu2 from "../../src/images/home5.jpg";
import eu3 from "../../src/images/home6.jpg";

import dust1 from "../../src/images/RashBcopy.jpg";
import dust2 from "../../src/images/RashB2.jpg";
import dust3 from "../../src/images/RashB3.jpg";
import dust4 from "../../src/images/RashB4.jpg";

import midget1 from "../../src/images/home2.jpg";
import midget2 from "../../src/images/home3.jpg";
   
   export const EuSlide: HomeSlide[] = [
        {
        title: "EU-Pall",
        subtitle: "Stabil. Fyrkantig. Godkänd av hela EU och säkert någon myndighet du aldrig hört talas om.",
        image: [
            eu1,
            eu2,
            eu3,
        ],
        alt: "EU-Pall",
        to: "/products?type=EuroPallet",
        btnText: "Shoppa EU-pallar",
    }
    ];
    export const DustSlide: HomeSlide[] = [
    {
        title: "Övrigt",
        subtitle: "Återbruk när det är som dammigast",
        image: [
            dust1,
            dust2,
            dust3,
            dust4,
        ],
        alt: "ovrigt",
        to: "/products?type=Other",
        btnText: "Shoppa EU-pallar",
    }
    ];
    export const HalfSlide: HomeSlide[] = [
    {
        title: "Halv-Pall",
        subtitle: "Nailgun and the 7 halfpallets",
        image: [
            midget1,
            midget2,
        ],
        alt: "halfpallet",
        to: "/products?type=HalfPallet",
        btnText: "Shoppa EU-pallar",
    }
    ];