"use client";

import { useState, useEffect } from "react";
import { BookOpen, Hammer, BarChart3, Handshake } from "lucide-react";
import styles from "./page.module.css";
import Link from "next/link";
import HeroSection from "./(landing)/components/HeroSection";

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
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

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
      setStatus("error");
      return setMessage("Vinsamlegast sláðu inn gilt netfang.");
    }

    setStatus("idle");

    try {
      const response = await fetch("/api/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus("success");
        setMessage("Takk fyrir að skrá þig á póstlistann!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(
          "Nei heyrðu! Þú ert það snemma á ferðinni að við erum ekki einu sinni komin með gagnagrunn til að hýsa netfangið þitt :0  Vandró."
        );
      }
    } catch {
      setStatus("error");
      setMessage(
        "Nei heyrðu! Þú ert það snemma á ferðinni að við erum ekki einu sinni komin með gagnagrunn til að hýsa netfangið þitt :0  Vandró."
      );
    }
  };

  const scrollToEmailSignup = () => {
    const emailSection = document.querySelector('#email-signup');
    if (emailSection) {
      emailSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <HeroSection onEmailSignupClick={scrollToEmailSignup} />

      {/* Old Hero Section - keeping for now */}
      <div className={styles.hero} style={{ display: 'none' }}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.title}>
              <span className={styles.titleMain}>Slóði</span>
              <span className={styles.titleSub}>Dagskrárgerð fyrir skátaforingja</span>
            </h1>

            <p className={styles.subtitle}>
              Markmið Slóða er að styðja við foringja í skátastarfi með því að gera
              dagskrárgerð <strong>einfaldari</strong>, <strong>markvissari</strong> og <strong>skipulagðari</strong>.
            </p>

            <p className={styles.description}>
              Safnaðu saman dagskrárhugmyndum, settu saman skipulagða dagskrá og
              greindu fjölbreytni til að tryggja að skátar fái innihaldsríka og
              fjölbreytta skátadagskrá.
            </p>

            {/* Feature Pills */}
            <div className={styles.features}>
              <div className={styles.featurePill}>
                <BookOpen className={styles.featureIcon} />
                <span>Dagskrárbankinn</span>
              </div>
              <div className={styles.featurePill}>
                <Hammer className={styles.featureIcon} />
                <span>Vinnubekkurinn</span>
              </div>
              <div className={styles.featurePill}>
                <BarChart3 className={styles.featureIcon} />
                <span>Greiningartæki</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className={styles.ctaButtons}>
              <Link href="/about" className={styles.ctaButtonPrimary}>
                Læra meira
              </Link>
              <Link href="/dashboard" className={styles.ctaButtonSecondary}>
                Skoða mælaborð
              </Link>
            </div>
          </div>

          {/* Hero Image/Illustration Placeholder */}
          <div className={styles.heroIllustration}>
            <div className={styles.illustrationCard}>
              <div className={styles.illustrationIcon}>🏕️</div>
              <p className={styles.illustrationText}>
                Gert af skátum fyrir skáta
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Email Signup Section */}
      <div id="email-signup" className={styles.signup}>
        <div className={styles.signupCard}>
          <h2 className={styles.signupTitle}>Fylgstu með framvindu</h2>
          <p className={styles.signupDescription}>
            Skráðu þig á póstlista til að fá nýjustu upplýsingar um verkefnið
          </p>

          <form
            onSubmit={handleSubmit}
            className={styles.form}
            aria-label="Email subscription form"
          >
            <div className={styles.inputWrap}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="netfang@example.is"
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
              <div
                className={`${styles.message} ${status === "success" ? styles.messageSuccess : ""
                  } ${status === "error" ? styles.messageError : ""}`}
                aria-live="assertive"
              >
                {message}
              </div>
            )}
          </form>

          <p className={styles.signupNote}>
            Við munum aldrei deila netfanginu þínu með öðrum. Loforð! <Handshake className={styles.inlineIcon} />
          </p>
        </div>
      </div>

      {/* Features Overview */}
      <div className={styles.featuresSection}>
        <h2 className={styles.featuresTitle}>Hvað býður Slóði upp á?</h2>

        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <BookOpen className={styles.featureCardIcon} />
            <h3 className={styles.featureCardTitle}>Dagskrárbankinn</h3>
            <p className={styles.featureCardText}>
              Miðlægt safn verkefna og leikja með skýrum leiðbeiningum,
              aldursviðmiðum og ábendingum frá öðrum foringjum.
            </p>
          </div>

          <div className={styles.featureCard}>
            <Hammer className={styles.featureCardIcon} />
            <h3 className={styles.featureCardTitle}>Vinnubekkurinn</h3>
            <p className={styles.featureCardText}>
              Settu saman heildardagskrár úr viðfangsefnum með drag-and-drop
              verkfæri. Skipulagðu eftir tíma, þema eða flokkum.
            </p>
          </div>

          <div className={styles.featureCard}>
            <BarChart3 className={styles.featureCardIcon} />
            <h3 className={styles.featureCardTitle}>Greiningartæki</h3>
            <p className={styles.featureCardText}>
              Greindu fjölbreytni dagskrárinnar og tryggðu að skátar fái
              jafna blöndu eftir ÆSKA og þroskasviðum.
            </p>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className={styles.finalCta}>
        <h2 className={styles.finalCtaTitle}>Tilbúinn að byrja?</h2>
        <p className={styles.finalCtaText}>
          Slóði er opinn hugbúnaður í þróun. Komdu og vertu hluti af verkefninu!
        </p>
        <div className={styles.finalCtaButtons}>
          <Link href="/about" className={styles.ctaButtonPrimary}>
            Lesa meira um verkefnið
          </Link>
          <a
            href="https://github.com/slodi-project"
            className={styles.ctaButtonSecondary}
            target="_blank"
            rel="noopener noreferrer"
          >
            Skoða á GitHub
          </a>
        </div>
      </div>
    </div>
  );
}