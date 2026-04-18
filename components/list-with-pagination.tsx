"use client";

import {
  Fragment,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { cn } from "@/lib/utils";

type Page<T> = { items: T[]; nextCursor: string | null };

type Props<T> = {
  initialItems: T[];
  initialCursor: string | null;
  queryKey: string;
  fetchPage: (cursor: string | null) => Promise<Page<T>>;
  getKey: (item: T) => string | number;
  renderItem: (item: T) => ReactNode;
  empty?: ReactNode;
  loadingIndicator?: ReactNode;
  className?: string;
};

export function ListWithPagination<T>({
  initialItems,
  initialCursor,
  queryKey,
  fetchPage,
  getKey,
  renderItem,
  empty,
  loadingIndicator,
  className,
}: Props<T>) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [isPending, startTransition] = useTransition();

  const fetchPageRef = useRef(fetchPage);
  useEffect(() => {
    fetchPageRef.current = fetchPage;
  }, [fetchPage]);

  const skipInitial = useRef(true);
  // biome-ignore lint/correctness/useExhaustiveDependencies: queryKey is the reset trigger; fetchPageRef is deliberately read via ref
  useEffect(() => {
    if (skipInitial.current) {
      skipInitial.current = false;
      return;
    }
    startTransition(async () => {
      const res = await fetchPageRef.current(null);
      setItems(res.items);
      setCursor(res.nextCursor);
    });
  }, [queryKey]);

  const loadMore = useCallback(() => {
    if (!cursor || isPending) return;
    startTransition(async () => {
      const res = await fetchPageRef.current(cursor);
      setItems((prev) => [...prev, ...res.items]);
      setCursor(res.nextCursor);
    });
  }, [cursor, isPending]);

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) loadMore();
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div
      className={cn(
        "flex-1 flex-col space-y-2 overflow-y-auto mt-2",
        className,
      )}
    >
      {items.map((item) => (
        <Fragment key={getKey(item)}>{renderItem(item)}</Fragment>
      ))}
      {items.length === 0 && !isPending ? empty : null}
      {cursor ? <div ref={sentinelRef} className="h-8" /> : null}
      {isPending ? loadingIndicator : null}
    </div>
  );
}
