import { useEffect, useRef, useState } from "react";

export function usePagedState(resetKey: unknown) {
  const [page, setPage] = useState(1);
  const prevKey = useRef(resetKey);

  useEffect(() => {
    if (prevKey.current !== resetKey) {
      prevKey.current = resetKey;
      setPage(1);
    }
  }, [resetKey]);

  return [page, setPage] as const;
}