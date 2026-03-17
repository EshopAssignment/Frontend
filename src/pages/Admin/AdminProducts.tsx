import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import {
  adminListProducts,
  type AdminCreateReq,
  type AdminUpdateReq,
  type AdminProduct,
} from "../../Services/adminProductService";

import ProductTable from "../../components/Admin/ProductTable";
import ProductForm from "../../components/Admin/ProductFrom";

import { hasMissingRequiredForActive } from "@/lib/productValidation";
import { adminProductQk } from "@/constants/queryKeys";
import { asNum } from "@/helpers/money";
import { useAdminProductMutations } from "@/hooks/Products/useAdminProductMutations";
import toast from "react-hot-toast";

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
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);

  const list = useQuery({
    queryKey: adminProductQk.list(page, PAGE_SIZE),
    queryFn: () => adminListProducts(page, PAGE_SIZE),
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
        <div className="center-content">
          <h1 className="header-text">Produkter</h1>

          <div className="admin-actions">
            <button type="button" className="btn" onClick={() => setCreating(true)} disabled={busy}>
              Ny produkt
            </button>
          </div>
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
            onPrev={() => setPage((prev) => Math.max(1, prev - 1))}
            onNext={() => setPage((prev) => Math.min(totalPages, prev + 1))}
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