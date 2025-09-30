"use client";

import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Vinsamlegast sláðu inn gilt netfang.");
      return;
    }

    try {
      const response = await fetch("/api/save-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage("Takk fyrir að skrá þig á póstlistann!");
        setEmail("");
      } else {
        setMessage("Eitthvað fór úrskeiðis. Vinsamlegast reyndu aftur síðar.");
      }
    } catch {
      setMessage("Eitthvað fór úrskeiðis. Vinsamlegast reyndu aftur síðar.");
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
              className="border border-text rounded p-2 w-full pr-12 bg-background text-text"
              required
              aria-label="Email address"
            />

            <button
              type="submit"
              className="absolute inset-y-0 right-0 flex items-center px-4 border border-primary text-primary bg-transparent rounded-r hover:cursor-pointer"
              title="Submit"
              aria-label="Submit email"
            >
              Skrá mig
            </button>
          </div>

          {message && (
            <p
              className="mt-4 text-sm text-secondary"
              aria-live="assertive"
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
