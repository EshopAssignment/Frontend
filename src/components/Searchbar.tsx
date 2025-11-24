import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const Searchbar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initial = searchParams.get("q") ?? "";
  const [value, setValue] = useState(initial);
  const [open, setOpen] = useState(Boolean(initial));

  useEffect(() => {
    const t = setTimeout(() => {
      const q = value.trim();
      const next = new URLSearchParams(searchParams);
      if (q) {
        next.set("q", q);
        setOpen(true);
      } else {
        next.delete("q");
        setOpen(false);
      }
      next.delete("page");
      setSearchParams(next, { replace: true });
    }, 300);

    return () => clearTimeout(t);
  }, [value]);

  const onSubmit = (e: React.FormEvent) => e.preventDefault();
  const clear = () => setValue("");

  return (
    <div className="search-group">
      <form className="searchbar" role="search" onSubmit={onSubmit}>
        <label htmlFor="q" className="sr-only">Sök</label>
        <input
          id="q"
          type="search"
          placeholder="Hitta rätt storlek för dig!"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => value.trim() && setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setOpen(false);
              (e.target as HTMLInputElement).blur();
            }
          }}
        />
        {value && (
          <button hidden type="button" className="btn-clear" aria-label="Rensa sök" onClick={clear}>
            ×
          </button>
        )}
        <Link to="/product">
          <button type="button" aria-label="Sök">
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </Link>

      </form>

      {open && (
        <div className="search-res">
          <p>Söker efter: <strong>{value.trim()}</strong></p>
          <p className="muted">Träffarna laddas i listan nedan. Tryck ESC för att stänga.</p>
        </div>
      )}
    </div>
  );
};

export default Searchbar;
