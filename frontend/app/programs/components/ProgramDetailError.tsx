// components/ProgramDetailError.tsx
import { ROUTES } from "@/constants/routes";
import styles from "../[id]/program-detail.module.css";

interface ProgramDetailErrorProps {
    error: Error;
}

export function ProgramDetailError({ error }: ProgramDetailErrorProps) {
    return (
        <div className={styles.container}>
            <div className={styles.errorState}>
                <h2>Eitthvað fór úrskeiðis</h2>
                <p>{error.message}</p>
                <button onClick={() => window.location.href = ROUTES.PROGRAMS}>
                    Til baka í dagskrárlista
                </button>
            </div>
        </div>
    );
}