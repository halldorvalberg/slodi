// hooks/useProgram.ts
import { useState, useEffect } from "react";
import { fetchProgramById, type Program } from "@/services/programs.service";

/**
 * Simple UUID validation
 */
function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

export function useProgram(id: string) {
  const [program, setProgram] = useState<Program | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchProgram() {
          // Validate UUID format before making API call
          if (!isValidUUID(id)) {
            console.error("Invalid UUID format:", id);
            setError(new Error("Invalid program ID format"));
            setProgram(null);
            setIsLoading(false);
            return;
          }

          try {
            setIsLoading(true);
            setError(null);
              console.log("Fetching program with ID:", id);
              const data = await fetchProgramById(id);
              console.log("Program fetched successfully:", data);
              setProgram(data);
            } catch (err) {
              console.error("Failed to fetch program:", err);
              console.error("Program ID that failed:", id);
            setError(err instanceof Error ? err : new Error('Unknown error'));
            setProgram(null);
          } finally {
            setIsLoading(false);
          }
        }

      fetchProgram();
    }, [id]);

  return { program, isLoading, error, setProgram };
}