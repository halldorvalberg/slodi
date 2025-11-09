"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

function isValidEmail(value: string): boolean {
  if (typeof value !== "string") return false;
  if (value.length < 3 || value.length > 320) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

export default function Home() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function checkApiConnection() {
      try {
        const response = await fetch(`${API_BASE_URL}/healthz`);
        if (response.status === 200) {
          console.log(
            "%c[Omnissiah Status]: API is reachable. Praise the Machine Spirit!",
            "color: green; font-weight: bold;"
          );
        } else {
          console.log(
            "%c[Omnissiah Status]: API is not reachable. Invoke the Rites of Debugging.",
            "color: red; font-weight: bold;"
          );
        }
      } catch (error) {
        console.log(
          "%c[Omnissiah Status]: API is not reachable. Invoke the Rites of Debugging." + String(error),
          "color: red; font-weight: bold;"
        );
      }
    }

    checkApiConnection();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      return setMessage("Vinsamlegast sláðu inn gilt netfang.");
    }
    try {
      const response = await fetch("/api/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage("Takk fyrir að skrá þig á póstlistann!");
        setEmail("");
      } else {
        setMessage(
          "Nei heyrðu! Þú ert það snemma á ferðinni að við erum ekki einu sinni komin með gagnagrunn til að hýsa netfangið þitt :0  Vandró."
        );
      }
    } catch (err) {
      setMessage(
        "Nei heyrðu! Þú ert það snemma á ferðinni að við erum ekki einu sinni komin með gagnagrunn til að hýsa netfangið þitt :0  Vandró."
      );
    }
  };

  return (
    <div className="font-sans flex flex-col overflow-hidden relative min-h-[85dvh] max-h-[85dvh]">
      <div className="flex-grow flex items-center justify-center min-h-[30dvh] mt-8 z-10 max-h-[35dvh]">
        <div className="text-center w-4/5 sm:w-3/5 flex items-center justify-center h-full">
          <div>
            <h1 className="text-6xl font-bold uppercase">Slóði</h1>
            
            <p className="text-sm text-justify mt-4">
              Markmið Slóða er að styðja við foringja í skátastarfi með því að gera
              dagskrárgerð einfaldari, markvissari og skipulagðari. Með því að safna
              saman dagskrárhugmyndum, bjóða upp á verkfæri til að setja saman
              skipulagða dagskrá og greina fjölbreytni í dagskránni tryggir Slóði að
              skátar fái innihaldsríka og fjölbreytta skátadagskrá.
            </p>
          </div>
        </div>
      </div>

      <div className="flex-grow flex items-center justify-center bg-background text-text max-h-[30dvh]">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center w-4/5 sm:w-1/2"
          aria-label="Email subscription form"
        >
          <p
            className="text-lg mb-4 text-center"
            aria-live="polite"
          >
            Skráðu þig á póstlista til að fá nýjustu upplýsingar um verkefnið
          </p>

          <div className="relative w-full">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Netfang"
              className={styles.input}
              required
              aria-label="Email address"
            />

            <button
              type="submit"
              className={styles.submit}
              title="Submit"
              aria-label="Submit email"
            >
              Skrá mig
            </button>
          </div>

          {message && (
            <p className={styles.message} aria-live="assertive">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
