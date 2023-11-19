import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { PersistQueryClientProvider as RQPersistQueryClientProvider } from "@tanstack/react-query-persist-client";

import { queryClient } from "./queryClient";

const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

export function PersistQueryClientProvider({
  children,
}: React.PropsWithChildren<object>) {
  return (
    <RQPersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      {children}
    </RQPersistQueryClientProvider>
  );
}
