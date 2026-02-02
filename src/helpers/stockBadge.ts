export function getStockBadgeClass(qty: number) {
    if (qty === 0) return "badge badge-oos"
    if (qty <= 20) return "badge badge-low";
    return "badge badge-high";
}

export function getStockBadgeText(qty: number, variant: "few" | "low" = "few" ) { 
    if ( qty === 0) return "Slut i lager";
    if(qty <= 20 )  return variant === "low" ? `Lågt saldo (${qty})` : `Få kvar (${qty})`;
    return `(${qty} st)`;
}