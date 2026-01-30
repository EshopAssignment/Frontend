import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
  adminCreateProduct,
  adminListProducts,
  adminToggleActive,
  adminUploadImageFetch,
  adminUpdateProduct,
  adminUploadImage,
  type AdminCreateReq,
  type AdminUpdateReq,
  type AdminProduct,
} from "../../Services/adminProductService";

import ProductTable from "../../components/Admin/ProductTable";
import ProductForm from "../../components/Admin/ProductFrom";

import { hasMissingRequiredForActive } from "@/lib/productValidation";

const PAGE_SIZE = 20;

function getErrMessage(err: unknown, fallback: string) {
  const anyErr = err as any;
  return (
    anyErr?.response?.data?.message ||
    anyErr?.response?.data ||
    anyErr?.message ||
    fallback
  );
}

export default function AdminProducts() {
  const qc = useQueryClient();

  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);

  const list = useQuery({
    queryKey: ["admin-products", page],
    queryFn: () => adminListProducts(page, PAGE_SIZE),
    placeholderData: keepPreviousData,
    staleTime: 10_000,
  });

  const productById = useMemo(() => {
    const map = new Map<number, AdminProduct>();
    for (const p of list.data?.items ?? []) map.set(p.id, p as any);
    return map;
  }, [list.data?.items]);

  const createMut = useMutation({
    mutationFn: (body: AdminCreateReq) => adminCreateProduct(body),
    onSuccess: () => {
      toast.success("Produkt skapad.");
      setCreating(false);
      qc.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: (err) => toast.error(getErrMessage(err, "Kunde inte skapa produkt.")),
  });

  const updateMut = useMutation({
    mutationFn: async ({ id, body, file }: { id: number; body: AdminUpdateReq; file?: File }) => {
      const updated = await adminUpdateProduct(id, body);
      if (file) await adminUploadImageFetch(id, file);
      return updated;
    },
    onSuccess: (_updated, vars) => {
      toast.success("Produkt uppdaterad.");
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["admin-product", vars.id] });
    },
    onError: (err) => toast.error(getErrMessage(err, "Kunde inte uppdatera produkt.")),
  });

  const toggleMut = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) => adminToggleActive(id, isActive),
    onSuccess: (_data, vars) => {
      toast.success(vars.isActive ? "Produkt aktiverad." : "Produkt inaktiverad.");
      qc.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: (err) => toast.error(getErrMessage(err, "Kunde inte ändra aktiv status.")),
  });

  const uploadMut = useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) => adminUploadImage(id, file),
    onSuccess: () => {
      toast.success("Bild uppladdad.");
      qc.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: (err) => toast.error(getErrMessage(err, "Kunde inte ladda upp bild.")),
  });

  function handleToggle(id: number, current: boolean) {
    const next = !current;

    if (next) {
      const p = productById.get(id);
      if (!p) {
        toast.error("Kunde inte hitta produkten i listan. Uppdatera sidan.");
        return;
      }

      const missing = hasMissingRequiredForActive({
        name: p.name,
        description: p.description,
        palletType: p.palletType,
        condition: p.condition,
        priceExVat: p.priceExVat,
        vatRatePercent: (p as any).vatRatePercent,
        onHand: p.onHand,
      });


      if (missing){
        toast.error("Kan inte aktivera, information saknas till prdukten");
        return;
      }
    }

    toggleMut.mutate({ id, isActive: next });
  }

  return (
    <section>
      <div className="container">
        <div className="center-content">
          <h1 className="header-text">Produkter</h1>
          <div className="admin-actions">
            <button className="btn" onClick={() => setCreating(true)}>
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
            totalPages={list.data.totalPages ?? 1}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(list.data.totalPages ?? 1, p + 1))}
            onEdit={(id) => setEditing(Number(id))}
            onToggle={handleToggle}
            onUpload={(id, file) => uploadMut.mutate({ id, file })}
          />

          {creating && (
            <ProductForm
              title="Skapa produkt"
              onCancel={() => setCreating(false)}
              onSubmit={(body) => {
                const safe = { ...(body as any), isActive: false };
                createMut.mutate(safe);
              }}
              loading={createMut.isPending}
            />
          )}

          {editing !== null && (
            <ProductForm
              title="Uppdatera produkt"
              productId={editing}
              onCancel={() => setEditing(null)}
              onSubmit={(body, file) => {
                updateMut.mutate({ id: editing, body: body as AdminUpdateReq, file });
              }}
              loading={updateMut.isPending}
            />
          )}
        </>
      )}
    </section>
  );
}
