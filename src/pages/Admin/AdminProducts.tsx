import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  adminListProducts,
  type AdminCreateReq,
  type AdminUpdateReq,
  type AdminProduct,
  type AdminProductListParams,
} from "../../Services/adminProductService";

import ProductTable from "../../components/Admin/ProductTable";
import ProductForm from "../../components/Admin/ProductFrom";
import AdminProductFilterBar from "@/components/AdminProductFilter";

import { hasMissingRequiredForActive } from "@/lib/productValidation";
import { adminProductQk } from "@/constants/queryKeys";
import { asNum } from "@/helpers/money";
import { useAdminProductMutations } from "@/hooks/Products/useAdminProductMutations";
import { readAdminDraftFromSearchParams } from "@/helpers/adminProductFilterParams";

const PAGE_SIZE = 20;

function canActivateProduct(product: AdminProduct) {
  return !hasMissingRequiredForActive({
    name: product.name,
    description: product.description,
    palletType: product.palletType,
    condition: product.condition,
    images: product.images,
    priceExVat: product.priceExVat,
    vatRatePercent: product.vatRatePercent,
    onHand: product.onHand,
    isActive: product.isActive,
  });
}

export default function AdminProducts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [editing, setEditing] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);

  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
  const query = searchParams.get("q") ?? "";
  const filters = readAdminDraftFromSearchParams(searchParams);

  const params: AdminProductListParams = {
    page,
    pageSize: PAGE_SIZE,
    query: query || undefined,
    sort: filters.sort || undefined,
    type: filters.type.length ? filters.type : undefined,
    condition: filters.condition.length ? filters.condition : undefined,
    minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
    isActive:
      filters.isActive === ""
        ? undefined
        : filters.isActive === "true",
  };

  const list = useQuery({
    queryKey: adminProductQk.list(params),
    queryFn: () => adminListProducts(params),
    placeholderData: keepPreviousData,
    staleTime: 10_000,
  });

  const { createMut, updateMut, toggleMut, busy } = useAdminProductMutations({
    onCreated: () => setCreating(false),
    onUpdated: () => setEditing(null),
  });

  const productById = useMemo(() => {
    const map = new Map<number, AdminProduct>();
    for (const product of list.data?.items ?? []) {
      map.set(product.id, product);
    }
    return map;
  }, [list.data?.items]);

  function setPage(nextPage: number) {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(nextPage));
    setSearchParams(next);
  }

  function handleToggle(id: number, current: boolean) {
    const next = !current;

    if (next) {
      const product = productById.get(id);

      if (!product) {
        toast.error("Kunde inte hitta produkten i listan. Uppdatera sidan.");
        return;
      }

      if (!canActivateProduct(product)) {
        toast.error("Kan inte aktivera. Information saknas för produkten.");
        return;
      }
    }

    toggleMut.mutate({ id, isActive: next });
  }

  function handleCreateSubmit(body: AdminCreateReq | AdminUpdateReq) {
    const payload: AdminCreateReq = {
      ...(body as AdminCreateReq),
      isActive: false,
    };

    createMut.mutate(payload);
  }

  function handleUpdateSubmit(body: AdminCreateReq | AdminUpdateReq) {
    if (editing === null) return;
    updateMut.mutate({ id: editing, body: body as AdminUpdateReq });
  }

  const totalPages = Math.max(1, asNum(list.data?.totalPages ?? 1));

  return (
    <section>
      <div className="container">
        <div className="product-toolbox">
          
          <h1 className="header-text">Produkter</h1>

          <div className="admin-actions">
            <button type="button" className="btn" onClick={() => setCreating(true)} disabled={busy}>
              Ny produkt
            </button>
          </div>

          <AdminProductFilterBar />

        </div>
      </div>

      {list.isLoading && <p>Laddar…</p>}
      {list.isError && <p>Kunde inte hämta produkter.</p>}

      {list.data && (
        <>
          <ProductTable
            data={list.data.items ?? []}
            page={page}
            totalPages={totalPages}
            onPrev={() => setPage(Math.max(1, page - 1))}
            onNext={() => setPage(Math.min(totalPages, page + 1))}
            onEdit={setEditing}
            onToggle={handleToggle}
          />

          {creating && (
            <ProductForm
              title="Skapa produkt"
              onCancel={() => setCreating(false)}
              onSubmit={handleCreateSubmit}
              loading={createMut.isPending}
            />
          )}

          {editing !== null && (
            <ProductForm
              title="Uppdatera produkt"
              productId={editing}
              onCancel={() => setEditing(null)}
              onSubmit={handleUpdateSubmit}
              loading={updateMut.isPending}
            />
          )}
        </>
      )}
    </section>
  );
}