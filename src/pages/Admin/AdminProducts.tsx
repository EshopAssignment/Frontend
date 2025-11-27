// src/pages/Admin/AdminProducts.tsx
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  adminCreateProduct,
  AdminListProducts,
  adminToggleActive,
  adminUpdateProduct,
  adminUploadImage,
  type AdminCreateReq,
  type AdminUpdateReq
} from "../../Services/adminProductService";
import ProductTable from "../../components/Admin/ProductTable";
import ProductForm from "../../components/Admin/ProductFrom";

const PAGE_SIZE = 20;

const AdminProducts = () => {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);

  const list = useQuery({
    queryKey: ["admin-products", page],
    queryFn: () => AdminListProducts(page, PAGE_SIZE),
    placeholderData: keepPreviousData,
  });

  const createMut = useMutation({
    mutationFn: (body: AdminCreateReq) => adminCreateProduct(body),
    onSuccess: () => {
      setCreating(false);
      qc.invalidateQueries({ queryKey: ["admin-products"] }); 
    }
  });

  const updateMut = useMutation({
    mutationFn: ({ id, body }: { id: number; body: AdminUpdateReq }) => adminUpdateProduct(id, body),
    onSuccess: () => {
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["admin-products"] }); 
    }
  });

  const toggleMut = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) => adminToggleActive(id, isActive),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-products"] })
  });

  const uploadMut = useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) => adminUploadImage(id, file),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-products"] })
  });

  return (
    <section>
      <div className="container">
        <h1>Produkter</h1>
        <div className="admin-actions">
          <button className="btn" onClick={() => setCreating(true)}>Ny produkt</button>
        </div>

      </div>

      {list.isLoading && <p>Laddar…</p>}
      {list.isError && <p>Kunde inte hämta produkter.</p>}

      {list.data && (
        <>
          <ProductTable
            data={list.data.items}
            page={page}
            totalPages={list.data.totalPages}
            onPrev={() => setPage(p => Math.max(1, p - 1))}
            onNext={() => setPage(p => Math.min(list.data!.totalPages, p + 1))}
            onEdit={(id) => setEditing(id)}
            onToggle={(id, current) => toggleMut.mutate({ id, isActive: !current })}
            onUpload={(id, file) => uploadMut.mutate({ id, file })}
          />

          {creating && (
            <ProductForm
              title="Skapa produkt"
              onCancel={() => setCreating(false)}
              onSubmit={(body) => createMut.mutate(body)}  
              loading={createMut.isPending}
            />
          )}

          {editing !== null && (
            <ProductForm
              title="Uppdatera produkt"
              productId={editing}
              onCancel={() => setEditing(null)}
              onSubmit={(body, file) => {
                
                updateMut.mutate({ id: editing!, body });
                
                if (file) {
                  uploadMut.mutate({ id: editing!, file });
                }
              }}
              loading={updateMut.isPending || uploadMut.isPending}
            />
          )}
        </>
      )}
    </section>
  );
};

export default AdminProducts;
