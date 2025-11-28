import { useNavigate } from "react-router-dom";
import { useDebounce } from "../hooks/useDebounce";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { suggestProducts, type ProductSuggestion } from "../Services/searchService";
import { buildImageUrl } from "../helpers/url";

const Searchbar = () => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const debounced = useDebounce(query, 250);
  const nav = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  const enabled = debounced.trim().length >= 2;

  const { data = [], isFetching, isError} = useQuery({
    queryKey: ["suggestion", debounced],
    queryFn: () => suggestProducts(debounced),
    enabled, 
    staleTime: 30_000
  });
  

  const items: ProductSuggestion[] = useMemo(() => data, [data]);

    useEffect(() => {
    const onDown = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  function goto(it: ProductSuggestion) {
    const slugOrId = it.slug && it.slug.length > 0 ? it.slug : String(it.id);
    setOpen(false);
    setQuery("");
    nav(`/product/${slugOrId}`);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if ((e.key === "ArrowDown" || e.key === "ArrowUp") && !open) setOpen(true);
    if (e.key === "ArrowDown") setActive(a => Math.min(a + 1, Math.max(items.length - 1, 0)));
    if (e.key === "ArrowUp")   setActive(a => Math.max(a - 1, 0));
    if (e.key === "Enter" && open && items[active]) goto(items[active]);
    if (e.key === "Escape") setOpen(false);
  }

  return (
    <div ref={ref} className="search-group" role="combobox" aria-expanded={open}
         aria-owns="search-listbox" aria-haspopup="listbox">
      <input
        value={query}
        onChange={e => { setQuery(e.target.value); setOpen(true); setActive(0); }}
        onFocus={() => { if (enabled) setOpen(true); }}
        onKeyDown={onKeyDown}
        placeholder="Sök efter den perfekta pallen..."
        className="searchbar"
        aria-autocomplete="list"
        aria-controls="search-listbox"
        aria-activedescendant={open && items[active] ? `opt-${items[active].id}` : undefined}
      />

      {open && (
        <div className="search-res">
          {isFetching && <div className="search-list">Söker…</div>}
          {isError && (
            <div className="px-3 py-2 text-sm text-red-600">
              Fel vid sökning.
            </div>
          )}

          {!isFetching && !isError && (
            items.length > 0 ? (
              <ul id="search-listbox" role="listbox" className="search-list">
                {items.map((item, i) => (
                  <li key={item.id} id={`opt-${item.id}`} role="option" aria-selected={i === active}
                      onMouseEnter={() => setActive(i)} onMouseDown={e => e.preventDefault()}
                      onClick={() => goto(item)}
                      className={` ${i === active ? "search-item" : ""}`}>
                    <img src={buildImageUrl(item.imgUrl)} alt="" className="" />
                    <div className="search-info">
                      <p className="">Produkt:{item.name}</p>
                      <p className="">Produkt nummer{item.sku ?? item.slug ?? `#${item.id}`}</p>
                      <p className="">Pris:{Math.round(item.price)} kr</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="">
                {enabled ? <>Inga träffar på “{debounced}”.</> : <>Minst 2 tecken för att söka.</>}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default Searchbar;




