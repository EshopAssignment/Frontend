import { Link } from "react-router-dom";


export type Crumb = { label: string; to?: string};

interface Props {
    trail :Crumb[]
    className?: string;
}

const Breadcrumbs = ({trail, className}: Props) => {
    return (
    <nav className={className ?? "breadcrumbs"} aria-label="Breadcrumb">
      <ol>
        {trail.map((c, i) => {
          const isLast = i === trail.length - 1;
          return (

            <li key={i} aria-current={isLast ? "page" : undefined}>

              {c.to && !isLast ? <Link to={c.to}>{c.label}</Link> : <span>{c.label}</span>}

              {!isLast && <span className="sep">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
    )
}

/**
 * HOW TO USE:
 * -----------------------------
 * Breadcrumbs bygger en trail manuellt genom att du skickar in en lista
 * av objekt: { label: string, to?: string }.
 *
 * Exempel:
 *
 * <Breadcrumbs
 *   trail={[
 *     { label: "Hem", to: "/" },
 *     { label: "Produkter", to: "/product" },
 *     { label: product.name }   // sista noden saknar 'to' → markeras som aktiv
 *   ]}
 * />
 *
 * 'to' är valfritt – om det saknas blir noden "current page".
 * Komponentens utformning är medvetet enkel för att inte låsa dig mot
 * React Routers egna metadata-system (useMatches/handle), om denna skulle vara overkill
 * för mindre projekt eller dynamiska data (t.ex. product.name).
 */
export default Breadcrumbs;