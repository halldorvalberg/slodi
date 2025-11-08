"use client";

import { useState } from "react";
import z from "zod/v4";

const EmailSchema = z.email();

export default function Home() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error: emailError } = await EmailSchema.safeParseAsync(email);
    if (emailError) {
      return setMessage("Vinsamlegast sláðu inn gilt netfang.");
    }

    let response;
    try {
      response = await fetch("/api/save-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch (e) {
      return setMessage("Eitthvað fór úrskeiðis. Vinsamlegast reyndu aftur síðar.");
    }

    if (!response.ok) {
      return setMessage("Eitthvað fór úrskeiðis. Vinsamlegast reyndu aftur síðar.");
    }

    setMessage("Takk fyrir að skrá þig á póstlistann!");
    setEmail("");
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
      </section>
    </div>
  );
}
