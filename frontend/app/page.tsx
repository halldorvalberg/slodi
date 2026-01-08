"use client";

import { useEffect } from "react";
import { BookOpen, Hammer, BarChart3 } from "lucide-react";
import styles from "./page.module.css";
import Link from "next/link";
import HeroSection from "./(landing)/components/HeroSection";
import EmailSignupForm from "./(landing)/components/EmailSignupForm";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

export default function Home() {
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
      <EmailSignupForm />


    </div>
  );
}