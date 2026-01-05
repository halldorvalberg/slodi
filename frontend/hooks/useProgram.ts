// Hook for fetching a single program by ID

export function useProgram(programId: string | null) {
  // TODO: Implement SWR or TanStack Query
  
  return {
    program: null,
    isLoading: false,
    isError: false,
    refresh: () => {},
  };
}
