import { Fragment, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Dialog, DialogPanel, DialogTitle, Disclosure, DisclosureButton, DisclosurePanel, Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition, TransitionChild } from "@headlessui/react";
import {
  clearAllFilters,
  readDraftFromSearchParams,
  writeDraftToSearchParams,
  type ProductFilterDraft,
} from "@/helpers/productFilterParams";



/*100% copy-paste from chatGPT 5.2*/

const SORT_OPTIONS = [
  { value: "", label: "Relevans" },
  { value: "price_asc", label: "Pris: lägst först" },
  { value: "price_desc", label: "Pris: högst först" },
  { value: "name_asc", label: "Namn: A–Ö" },
  { value: "name_desc", label: "Namn: Ö–A" },
];

const PALLET_TYPES = ["EuroPallet", "HalfPallet", "IndustrialPallet", "CustomPallet", "SpecialPallet", "Other"];
const CONDITIONS = ["New", "Used", "Refurbished"];

const toggle = (arr: string[], val: string) =>
  arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];

export default function FilterBar() {
  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get("q") ?? "";

  const live = useMemo(() => readDraftFromSearchParams(searchParams), [searchParams]);

  const [draft, setDraft] = useState<ProductFilterDraft>(live);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setDraft(live);
  }, [
    live.sort,
    live.inStock,
    live.minPrice,
    live.maxPrice,
    live.type.join(","),
    live.condition.join(","),
  ]);

  const hasAnyFilters =
    !!live.sort ||
    live.type.length > 0 ||
    live.condition.length > 0 ||
    live.inStock ||
    !!live.minPrice ||
    !!live.maxPrice;

  function apply() {
    setSearchParams(writeDraftToSearchParams(searchParams, draft));
    setOpen(false);
  }

  function clearAll() {
    setSearchParams(clearAllFilters(searchParams));
    setOpen(false);
  }

  function setSortInstant(val: string) {
    const nextDraft = { ...draft, sort: val };
    setDraft(nextDraft);
    setSearchParams(writeDraftToSearchParams(searchParams, nextDraft));
  }

  return (
    <>
      <div className="filters-toolbar">
        <div className="filters-left">
          <button type="button" className="btn" onClick={() => setOpen(true)}>
            Filtrera
          </button>

          <Listbox value={draft.sort} onChange={setSortInstant}>
            <div className="listbox">
              <ListboxButton className="listbox-btn">
                {SORT_OPTIONS.find((o) => o.value === draft.sort)?.label ?? "Relevans"}
              </ListboxButton>

              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <ListboxOptions className="listbox-options">
                  {SORT_OPTIONS.map((o) => (
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
          {hasAnyFilters && (
            <button type="button" className="link" onClick={clearAll}>
              Rensa filter
            </button>
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
                      {PALLET_TYPES.map((t) => (
                        <label key={t} className="check">
                          <input
                            type="checkbox"
                            checked={draft.type.includes(t)}
                            onChange={() => setDraft((d) => ({ ...d, type: toggle(d.type, t) }))}
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
                      {CONDITIONS.map((c) => (
                        <label key={c} className="check">
                          <input
                            type="checkbox"
                            checked={draft.condition.includes(c)}
                            onChange={() =>
                              setDraft((d) => ({ ...d, condition: toggle(d.condition, c) }))
                            }
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
                        checked={draft.inStock}
                        onChange={() => setDraft((d) => ({ ...d, inStock: !d.inStock }))}
                      />
                      <span>Endast i lager</span>
                    </label>

                    <div className="price-row">
                      <input
                        type="number"
                        min={0}
                        placeholder="Min"
                        value={draft.minPrice}
                        onChange={(e) => setDraft((d) => ({ ...d, minPrice: e.target.value }))}
                      />
                      <span>–</span>
                      <input
                        type="number"
                        min={0}
                        placeholder="Max"
                        value={draft.maxPrice}
                        onChange={(e) => setDraft((d) => ({ ...d, maxPrice: e.target.value }))}
                      />
                    </div>
                  </DisclosurePanel>
                </Disclosure>

                <div className="filter-actions">
                  <button type="button" className="btn" onClick={clearAll}>
                    Rensa
                  </button>
                  <button type="button" className="btn" onClick={apply}>
                    Verkställ
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}


