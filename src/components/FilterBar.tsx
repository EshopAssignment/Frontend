import { Fragment, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
  TransitionChild,
} from "@headlessui/react";

import {
  clearAllFilters,
  readDraftFromSearchParams,
  writeDraftToSearchParams,
  type ProductFilterDraft,
} from "@/helpers/productFilterParams";

const SORT_OPTIONS = [
  { value: "", label: "Relevans" },
  { value: "price_asc", label: "Pris: lägst först" },
  { value: "price_desc", label: "Pris: högst först" },
  { value: "name_asc", label: "Namn: A–Ö" },
  { value: "name_desc", label: "Namn: Ö–A" },
] as const;

const PALLET_TYPES = [
  "EuroPallet",
  "HalfPallet",
  "IndustrialPallet",
  "CustomPallet",
  "SpecialPallet",
  "Other",
] as const;

const CONDITIONS = ["New", "Used", "Refurbished"] as const;

function toggleValue(values: string[], value: string) {
  return values.includes(value)
    ? values.filter((x) => x !== value)
    : [...values, value];
}

function isSameDraft(a: ProductFilterDraft, b: ProductFilterDraft) {
  return (
    a.sort === b.sort &&
    a.inStock === b.inStock &&
    a.minPrice === b.minPrice &&
    a.maxPrice === b.maxPrice &&
    a.type.join(",") === b.type.join(",") &&
    a.condition.join(",") === b.condition.join(",")
  );
}

export default function FilterBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [open, setOpen] = useState(false);

  const query = searchParams.get("q") ?? "";
  const liveDraft = useMemo(() => readDraftFromSearchParams(searchParams), [searchParams]);
  const [draft, setDraft] = useState<ProductFilterDraft>(liveDraft);

  const effectiveDraft = open ? draft : liveDraft;

  const hasAnyFilters =
    !!liveDraft.sort ||
    liveDraft.type.length > 0 ||
    liveDraft.condition.length > 0 ||
    liveDraft.inStock ||
    !!liveDraft.minPrice ||
    !!liveDraft.maxPrice;

  function openDialog() {
    setDraft(liveDraft);
    setOpen(true);
  }

  function closeDialog() {
    setDraft(liveDraft);
    setOpen(false);
  }

  function apply() {
    setSearchParams(writeDraftToSearchParams(searchParams, draft));
    setOpen(false);
  }

  function clear() {
    setSearchParams(clearAllFilters(searchParams));
    setDraft(readDraftFromSearchParams(clearAllFilters(searchParams)));
    setOpen(false);
  }

  function setSortInstant(value: string) {
    const nextDraft = { ...liveDraft, sort: value };
    setDraft(nextDraft);
    setSearchParams(writeDraftToSearchParams(searchParams, nextDraft));
  }

  const isDirty = !isSameDraft(draft, liveDraft);

  return (
    <>
      <div className="filters-toolbar">
        <div className="filters-left">
          <button type="button" className="btn" onClick={openDialog}>
            Filtrera
          </button>

          <Listbox value={liveDraft.sort} onChange={setSortInstant}>
            <div className="listbox">
              <ListboxButton className="listbox-btn">
                {SORT_OPTIONS.find((option) => option.value === liveDraft.sort)?.label ?? "Relevans"}
              </ListboxButton>

              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <ListboxOptions className="listbox-options">
                  {SORT_OPTIONS.map((option) => (
                    <ListboxOption
                      key={option.value}
                      value={option.value}
                      className="listbox-option"
                    >
                      {option.label}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </Transition>
            </div>
          </Listbox>
        </div>

        <div className="filters-right">
          {query && <span className="badge">Sök: “{query}”</span>}

          {hasAnyFilters && (
            <button type="button" className="link" onClick={clear}>
              Rensa filter
            </button>
          )}
        </div>
      </div>

      <Transition show={open} as={Fragment}>
        <Dialog onClose={closeDialog} className="filter-dialog">
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
                      {PALLET_TYPES.map((type) => (
                        <label key={type} className="check">
                          <input
                            type="checkbox"
                            checked={effectiveDraft.type.includes(type)}
                            onChange={() =>
                              setDraft((current) => ({
                                ...current,
                                type: toggleValue(current.type, type),
                              }))
                            }
                          />
                          <span>{type}</span>
                        </label>
                      ))}
                    </div>
                  </DisclosurePanel>
                </Disclosure>

                <Disclosure>
                  <DisclosureButton className="disclosure-btn">Skick</DisclosureButton>
                  <DisclosurePanel className="disclosure-panel">
                    <div className="check-grid">
                      {CONDITIONS.map((condition) => (
                        <label key={condition} className="check">
                          <input
                            type="checkbox"
                            checked={effectiveDraft.condition.includes(condition)}
                            onChange={() =>
                              setDraft((current) => ({
                                ...current,
                                condition: toggleValue(current.condition, condition),
                              }))
                            }
                          />
                          <span>{condition}</span>
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
                        checked={effectiveDraft.inStock}
                        onChange={() =>
                          setDraft((current) => ({
                            ...current,
                            inStock: !current.inStock,
                          }))
                        }
                      />
                      <span>Endast i lager</span>
                    </label>

                    <div className="price-row">
                      <input
                        type="number"
                        min={0}
                        placeholder="Min"
                        value={effectiveDraft.minPrice}
                        onChange={(e) =>
                          setDraft((current) => ({
                            ...current,
                            minPrice: e.target.value,
                          }))
                        }
                      />
                      <span>–</span>
                      <input
                        type="number"
                        min={0}
                        placeholder="Max"
                        value={effectiveDraft.maxPrice}
                        onChange={(e) =>
                          setDraft((current) => ({
                            ...current,
                            maxPrice: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </DisclosurePanel>
                </Disclosure>

                <div className="filter-actions">
                  <button type="button" className="btn" onClick={clear}>
                    Rensa
                  </button>

                  <button type="button" className="btn" onClick={apply} disabled={!isDirty}>
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