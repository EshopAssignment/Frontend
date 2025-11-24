import { Fragment, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Dialog, DialogPanel, DialogTitle, Disclosure, DisclosureButton, DisclosurePanel, Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition, TransitionChild } from "@headlessui/react";

/*Deiscaimer. 
100% clanker made copy-paste from chatGPT 5.1*/

const SORT_OPTIONS = [
  { value: "", label: "Relevans" },
  { value: "price_asc", label: "Pris: lägst först" },
  { value: "price_desc", label: "Pris: högst först" },
  { value: "name_asc", label: "Namn: A–Ö" },
  { value: "name_desc", label: "Namn: Ö–A" },
];

const PALLET_TYPES = ["EUR", "FIN", "One-Way", "Special"];
const CONDITIONS = ["New", "Used", "Refurbished"];

export default function FilterBar() {
  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get("q") ?? "";
  const sort = searchParams.get("sort") ?? "";
  const type = searchParams.getAll("type");
  const condition = searchParams.getAll("condition");
  const inStock = searchParams.get("inStock") === "true";
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";

  const [open, setOpen] = useState(false);
  const [localSort, setLocalSort] = useState(sort);
  const [localType, setLocalType] = useState<string[]>(type);
  const [localCondition, setLocalCondition] = useState<string[]>(condition);
  const [localInStock, setLocalInStock] = useState(inStock);
  const [localMinPrice, setLocalMinPrice] = useState(minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice);

  useEffect(() => {
    setLocalSort(sort);
    setLocalType(type);
    setLocalCondition(condition);
    setLocalInStock(inStock);
    setLocalMinPrice(minPrice);
    setLocalMaxPrice(maxPrice);
  }, [sort, type.join(","), condition.join(","), inStock, minPrice, maxPrice]);

  function apply() {
    const next = new URLSearchParams(searchParams);
    if (localSort) next.set("sort", localSort); else next.delete("sort");
    next.delete("type");
    localType.forEach(t => next.append("type", t));
    next.delete("condition");
    localCondition.forEach(c => next.append("condition", c));
    if (localMinPrice) next.set("minPrice", localMinPrice); else next.delete("minPrice");
    if (localMaxPrice) next.set("maxPrice", localMaxPrice); else next.delete("maxPrice");
    next.delete("page");
    setSearchParams(next);
    setOpen(false);
  }

  function clearAll() {
    const next = new URLSearchParams(searchParams);
    ["sort","type","condition","inStock","minPrice","maxPrice"].forEach(k => next.delete(k));
    next.delete("page");
    setSearchParams(next);
    setOpen(false);
  }

  const toggle = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];

  return (
    <>
      <div className="filters-toolbar">
        <div className="filters-left">
          <button type="button" className="btn" onClick={() => setOpen(true)}>Filtrera</button>

          
          <Listbox
            value={localSort}
            onChange={(val) => {
                setLocalSort(val);
                const next = new URLSearchParams(searchParams);
                if (val) next.set("sort", val);
                else next.delete("sort");
                next.delete("page");
                setSearchParams(next);
            }}
            >
            <div className="listbox">
              <ListboxButton className="listbox-btn">
                {SORT_OPTIONS.find(o => o.value === localSort)?.label ?? "Relevans"}
              </ListboxButton>
              <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                <ListboxOptions className="listbox-options">
                  {SORT_OPTIONS.map(o => (
                    <ListboxOption key={o.value} value={o.value} className="listbox-option">
                      {o.label}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </Transition>
            </div>
          </Listbox>
        </div>

        <div className="filters-right">
          {q && <span className="badge">Sök: “{q}”</span>}
          {(type.length > 0 || condition.length > 0 || inStock || minPrice || maxPrice) && (
            <button type="button" className="link" onClick={clearAll}>Rensa filter</button>
          )}
        </div>
      </div>

      
      <Transition show={open} as={Fragment}>
        <Dialog onClose={setOpen} className="filter-dialog">
          <div className="filter-backdrop" aria-hidden="true" />
          <div className="filter-positioner">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-150"
              enterFrom="opacity-0 translate-y-2 scale-95"
              enterTo="opacity-100 translate-y-0 scale-100"
              leave="ease-in duration-100"
              leaveFrom="opacity-100 translate-y-0 scale-100"
              leaveTo="opacity-0 translate-y-2 scale-95"
            >
              <DialogPanel className="filter-panel">
                <DialogTitle>Filter</DialogTitle>

                <Disclosure defaultOpen>
                  <DisclosureButton className="disclosure-btn">Palltyp</DisclosureButton>
                  <DisclosurePanel className="disclosure-panel">
                    <div className="check-grid">
                      {PALLET_TYPES.map(t => (
                        <label key={t} className="check">
                          <input
                            type="checkbox"
                            checked={localType.includes(t)}
                            onChange={() => setLocalType(curr => toggle(curr, t))}
                          />
                          <span>{t}</span>
                        </label>
                      ))}
                    </div>
                  </DisclosurePanel>
                </Disclosure>

                <Disclosure>
                  <DisclosureButton className="disclosure-btn">Skick</DisclosureButton>
                  <DisclosurePanel className="disclosure-panel">
                    <div className="check-grid">
                      {CONDITIONS.map(c => (
                        <label key={c} className="check">
                          <input
                            type="checkbox"
                            checked={localCondition.includes(c)}
                            onChange={() => setLocalCondition(curr => toggle(curr, c))}
                          />
                          <span>{c}</span>
                        </label>
                      ))}
                    </div>
                  </DisclosurePanel>
                </Disclosure>

                <Disclosure>
                  <DisclosureButton className="disclosure-btn">Lager & pris</DisclosureButton>
                  <DisclosurePanel className="disclosure-panel">
                    <label className="check">
                      <input
                        type="checkbox"
                        checked={localInStock}
                        onChange={() => setLocalInStock(v => !v)}
                      />
                      <span>Endast i lager</span>
                    </label>

                    <div className="price-row">
                      <input
                        type="number" min={0}
                        placeholder="Min"
                        value={localMinPrice}
                        onChange={e => setLocalMinPrice(e.target.value)}
                      />
                      <span>–</span>
                      <input
                        type="number" min={0}
                        placeholder="Max"
                        value={localMaxPrice}
                        onChange={e => setLocalMaxPrice(e.target.value)}
                      />
                    </div>
                  </DisclosurePanel>
                </Disclosure>

                <div className="filter-actions">
                  <button type="button" className="btn" onClick={clearAll}>Rensa</button>
                  <button type="button" className="btn" onClick={apply}>Verkställ</button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
