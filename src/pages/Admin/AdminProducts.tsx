import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
  adminCreateProduct,
  adminListProducts,
  adminToggleActive,
  adminUpdateProduct,
  type AdminCreateReq,
  type AdminUpdateReq,
  type AdminProduct,
} from "../../Services/adminProductService";

import ProductTable from "../../components/Admin/ProductTable";
import ProductForm from "../../components/Admin/ProductFrom";

import { hasMissingRequiredForActive } from "@/lib/productValidation";
import { adminProductQk } from "@/constants/queryKeys";
import { asNum } from "@/helpers/money";

const PAGE_SIZE = 20;

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message;

  if (typeof error === "object" && error !== null) {
    const err = error as {
      response?: {
        data?: unknown;
      };
      message?: string;
    };

    if (typeof err.response?.data === "string") return err.response.data;

    if (
      typeof err.response?.data === "object" &&
      err.response?.data !== null &&
      "message" in err.response.data &&
      typeof (err.response.data as { message?: unknown }).message === "string"
    ) {
      return (err.response.data as { message: string }).message;
    }

    if (typeof err.message === "string") return err.message;
  }

  return fallback;
}

export default function AdminProducts() {
  const qc = useQueryClient();

  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);

  const list = useQuery({
    queryKey: adminProductQk.list(page, PAGE_SIZE),
    queryFn: () => adminListProducts(page, PAGE_SIZE),
    placeholderData: keepPreviousData,
    staleTime: 10_000,
  });

  const productById = useMemo(() => {
    const map = new Map<number, AdminProduct>();

    for (const product of list.data?.items ?? []) {
      map.set(product.id, product);
    }

    return map;
  }, [list.data?.items]);

  const createMut = useMutation({
    mutationFn: (body: AdminCreateReq) => adminCreateProduct(body),
    onSuccess: async () => {
      toast.success("Produkt skapad.");
      setCreating(false);
      await qc.invalidateQueries({ queryKey: adminProductQk.all });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Kunde inte skapa produkt."));
    },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, body }: { id: number; body: AdminUpdateReq }) =>
      adminUpdateProduct(id, body),

    onSuccess: async (_updated, variables) => {
      toast.success("Produkt uppdaterad.");
      setEditing(null);

      await Promise.all([
        qc.invalidateQueries({ queryKey: adminProductQk.all }),
        qc.invalidateQueries({ queryKey: adminProductQk.detail(variables.id) }),
      ]);
    },

    onError: (error) => {
      toast.error(getErrorMessage(error, "Kunde inte uppdatera produkt."));
    },
  });

  const toggleMut = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      adminToggleActive(id, isActive),

    onSuccess: async (_data, variables) => {
      toast.success(variables.isActive ? "Produkt aktiverad." : "Produkt inaktiverad.");
      await qc.invalidateQueries({ queryKey: adminProductQk.all });
    },

    onError: (error) => {
      toast.error(getErrorMessage(error, "Kunde inte ändra aktiv status."));
    },
  });

  function handleCreate() {
    setCreating(true);
  }

  function handleEdit(id: number) {
    setEditing(id);
  }

  function handleCloseCreate() {
    setCreating(false);
  }

  function handleCloseEdit() {
    setEditing(null);
  }

  function handleToggle(id: number, current: boolean) {
    const next = !current;

    if (next) {
      const product = productById.get(id);

      if (!product) {
        toast.error("Kunde inte hitta produkten i listan. Uppdatera sidan.");
        return;
      }

      const missing = hasMissingRequiredForActive({
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

      if (missing) {
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

    const payload: AdminUpdateReq = body as AdminUpdateReq;
    updateMut.mutate({ id: editing, body: payload });
  }

  const busy = createMut.isPending || updateMut.isPending || toggleMut.isPending;
  const totalPages = Math.max(1, asNum(list.data?.totalPages ?? 1));

  return (
    <section>
      <div className="container">
        <div className="center-content">
          <h1 className="header-text">Produkter</h1>

          <div className="admin-actions">
            <button type="button" className="btn" onClick={handleCreate} disabled={busy}>
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
            onEdit={handleEdit}
            onToggle={handleToggle}
          />

          {creating && (
            <ProductForm
              title="Skapa produkt"
              onCancel={handleCloseCreate}
              onSubmit={handleCreateSubmit}
              loading={createMut.isPending}
            />
          )}

          {editing !== null && (
            <ProductForm
              title="Uppdatera produkt"
              productId={editing}
              onCancel={handleCloseEdit}
              onSubmit={handleUpdateSubmit}
              loading={updateMut.isPending}
            />
          )}
        </>
      )}
    </section>
  );
}