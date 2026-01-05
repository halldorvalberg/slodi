// Hook for fetching and managing tags

export function useTags() {
  // TODO: Implement SWR or TanStack Query
  
  return {
    tags: [],
    isLoading: false,
    isError: false,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createTag: async (_name: string) => {},
  };
}
