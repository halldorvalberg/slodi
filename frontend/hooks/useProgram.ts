// Hook for fetching a single program by ID

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useProgram(_programId: string | null) {
  // TODO: Implement SWR or TanStack Query
  
  return {
    program: null,
    isLoading: false,
    isError: false,
    refresh: () => {},
  };
}
