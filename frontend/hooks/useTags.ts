// Hook for fetching and managing tags

export function useTags() {
  // TODO: Implement SWR or TanStack Query
  
  return {
    tags: [],
    isLoading: false,
    isError: false,
    createTag: async (name: string) => {},
  };
}
