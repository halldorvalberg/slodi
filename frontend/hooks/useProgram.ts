import { useEffect, useState } from "react";
import { Program } from "./usePrograms";
import { fetchProgramById } from "@/services/programs.service";

export function useProgram(id: string) {
  const [program, setProgram] = useState<Program | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchProgram() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchProgramById(id);
        setProgram(data);
      } catch (err) {
        console.error("Failed to fetch program:", err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setProgram(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProgram();
  }, [id]);

  return { program, isLoading, error };
}