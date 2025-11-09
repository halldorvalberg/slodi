"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setMessage("Vinsamlegast sláðu inn gilt netfang.");
      return;
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
    } catch {
      setMessage(
        "Nei heyrðu! Þú ert það snemma á ferðinni að við erum ekki einu sinni komin með gagnagrunn til að hýsa netfangið þitt :0  Vandró."
      );
    }
  };

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div>
            <h1 className={styles.title}>Slóði</h1>
            <p className={styles.subtitle}>
              Markmið Slóða er að styðja við foringja í skátastarfi með því að gera
              dagskrárgerð einfaldari, markvissari og skipulagðari. Með því að safna
              saman dagskrárhugmyndum, bjóða upp á verkfæri til að setja saman
              skipulagða dagskrá og greina fjölbreytni í dagskránni tryggir Slóði að
              skátar fái innihaldsríka og fjölbreytta skátadagskrá.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.signup}>
        <form
          onSubmit={handleSubmit}
          className={styles.form}
          aria-label="Email subscription form"
        >
          <p className={styles.formLead} aria-live="polite">
            Skráðu þig á póstlista til að fá nýjustu upplýsingar um verkefnið
          </p>

          <div className={styles.inputWrap}>
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
      </section>
    </div>
  );
}
