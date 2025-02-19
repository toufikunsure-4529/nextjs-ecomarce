"use client";

import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import useSWRSubscription from "swr/subscription";

export function useOrder({ id }) {
  const { data, error } = useSWRSubscription(
    ["orders", id],
    ([path, id], { next }) => {
      if (!id) return; // Prevent unnecessary calls

      const ref = doc(db, `orders/${id}`);
      const unsub = onSnapshot(
        ref,
        (snapshot) => next(null, snapshot.exists() ? snapshot.data() : null),
        (err) => next(err, null)
      );
      return () => unsub();
    }
  );

  return {
    data,
    error,
    isLoading: data === undefined && !error, // Ensure proper loading state
  };
}
export function useOrders({ uid }) {
  const { data, error } = useSWRSubscription(
    ["orders", uid],
    ([path, uid], { next }) => {
      const ref = query(
        collection(db, path),
        where("uid", "==", uid),
        orderBy("timestampCreate", "desc")
      );
      const unsub = onSnapshot(
        ref,
        (snapshot) => next(null, snapshot.docs.map((snap) => snap.data()) || []),
        (err) => next(err, [])
      );

      return () => unsub();
    }
  );

  if (error) {
    console.log(error?.message);
  }

  return { data, error: error?.message, isLoading: data === undefined };
}

export function useAllOrders({ pageLimit, lastSnapDoc }) {
  const { data, error } = useSWRSubscription(
    ["orders", pageLimit, lastSnapDoc],
    ([path, pageLimit, lastSnapDoc], { next }) => {
      const ref = collection(db, path);
      let q = query(
        ref,
        limit(pageLimit ?? 10),
        orderBy("timestampCreate", "desc")
      );

      if (lastSnapDoc) {
        q = query(q, startAfter(lastSnapDoc));
      }

      const unsub = onSnapshot(
        q,
        (snapshot) =>
          next(null, {
            list:
              snapshot.docs.length === 0
                ? null
                : snapshot.docs.map((snap) => snap.data()),
            lastSnapDoc:
              snapshot.docs.length === 0
                ? null
                : snapshot.docs[snapshot.docs.length - 1],
          }),
        (err) => next(err, null)
      );
      return () => unsub();
    }
  );

  return {
    data: data?.list,
    lastSnapDoc: data?.lastSnapDoc,
    error: error?.message,
    isLoading: data === undefined,
  };
}