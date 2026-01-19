import type { ThemeId } from "@/types/DrawerTypes";

export const THEMES: { id: ThemeId; name: string; hint: string }[] = [
    {
        id: "light", name: "Light", hint: "Ljust"
    },
    {
        id: "dark", name: "Dark", hint: "Mörkt, som kaffe ska serveras"

    },
    {
        id: "snow", name: "Snow", hint: "Mysigt"
    },
    {
        id: "beige", name:"beige", hint: "Varför vill du använda denna?"
    },
    {
        id:"forest", name:"Skog", hint: "Där virket kommer ifrån. "
    },
    {
        id:"midnight", name:"Midnight", hint: "Edgy"
    }
 ];