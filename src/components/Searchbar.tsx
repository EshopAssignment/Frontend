import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useSearchParams } from "react-router-dom";


const DEBOUNCE_MS = 300;

const Searchbar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const initial = searchParams.get("q") ?? "";
  const [value, setValue] = useState(initial);
  const [open, setOpen] = useState(Boolean(initial));

  useEffect(() => {
    const current = searchParams.get("q") ?? "";
    setValue(current);
    setOpen(Boolean(current));
  }, [searchParams]);

  const debounced = useRef<number | null>(null);
  const trimmed = useMemo(() => value.trim(), [value]);

  useEffect(() => {
    if (debounced.current) window.clearTimeout(debounced.current);
    debounced.current = window.setTimeout(() => {
      startTransition(() => {
        const next = new URLSearchParams(searchParams);
        const prevQ = next.get("q") ?? "";

        if (trimmed && trimmed !== prevQ) {
          next.set("q", trimmed);
          setOpen(true);
        } else if (!trimmed && prevQ) {
          next.delete("q");
          setOpen(false);
        }

        if (next.has("page")) next.delete("page");

        if (next.toString() !== searchParams.toString()) {
          setSearchParams(next, { replace: true });
        }
      });
    }, DEBOUNCE_MS);

    return () => {
      if (debounced.current) window.clearTimeout(debounced.current);
    };
  }, [trimmed, searchParams, setSearchParams, startTransition]);

  const onSubmit = (e: React.FormEvent) => e.preventDefault();

  const clear = () => {
    setValue("");
    setOpen(false);
  };

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
          <button type="button" aria-label="Sök" disabled={isPending}>
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>

      </form>

      {open && (
        <div className="search-res">
          <p>Söker efter: <strong>{value.trim()}</strong></p>
          <p className="muted">laddar...</p>
        </div>
      )}
    </div>
  );
};

export default Searchbar;
