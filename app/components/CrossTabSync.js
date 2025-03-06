// components/CrossTabSync.js
"use client";
import { useEffect } from "react";
import { useStore } from "react-redux";
import isEqual from "lodash.isequal"; // Install with: npm install lodash.isequal
import debounce from "lodash.debounce";

const PERSIST_ROOT_KEY = "persist:root";

export default function CrossTabSync() {
  const store = useStore();

  useEffect(() => {
    function handleStorage(event) {
      const debouncedDispatch = debounce((newCartState) => {
        store.dispatch({
          type: "cart/updateCart",
          payload: newCartState.cartItems,
        });
      }, 300);
      if (event.key === PERSIST_ROOT_KEY && event.newValue) {
        try {
          // Parse the entire persisted state from localStorage.
          const persistedRootObject = JSON.parse(event.newValue);
          // Redux Persist stores each slice as a JSON string.
          const newCartState = persistedRootObject.cart
            ? JSON.parse(persistedRootObject.cart)
            : null;

          if (newCartState) {
            // Get the current cart state from the Redux store.
            const currentCartState = store.getState().cart;
            // Only dispatch if the new state is different.
            if (!isEqual(newCartState, currentCartState)) {
              debouncedDispatch(newCartState);
            }
          }
        } catch (error) {
          console.error("Error syncing across tabs:", error);
        }
      }
    }

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [store]);

  return null; // No UI needed.
}
