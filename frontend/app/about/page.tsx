import { BookOpen, Hammer, ClipboardList, Users, Search, BarChart3, Calendar } from "lucide-react";
import styles from "./about.module.css";

export default function AboutPage() {
  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <h1 className={styles.title}>Um Slóða</h1>
        <p className={styles.lead}>
          Opinn hugbúnaður hannaður til að auðvelda dagskrárgerð fyrir skátaforingja
        </p>
      </div>

      {/* Introduction */}
      <div className={styles.intro}>
        <p className={styles.paragraph}>
          Slóði er Gilwell-verkefni sem <strong>Halldór Valberg Aðalbjargarson</strong> og <strong>Signý Kristín Sigurjónsdóttir</strong> sjá um. Kerfið styður foringja og hópa við að búa til, deila og stjórna viðfangsefnum og tryggir um leið að skátar fái fjölbreytta og vel samsetta dagskrá.
        </p>
      </div>

      {/* Vision Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          Framtíðarsýn
        </h2>
        <p className={styles.paragraph}>
          Markmið verkefnisins er að styðja við skátaforingja með því að bjóða upp á verkfæri sem gera dagskrárgerð einfaldari, snjallari og samvinnuþýðari. Með því að geyma viðfangsefni, gera kleift að búa til skipulagða dagskrá og veita innsýn í fjölbreytni dagskrárinnar tryggir Slóði að allir skátar njóti góðs af ríkulegri og fjölbreyttri reynslu.
        </p>
      </section>

      {/* Features Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          Helstu eiginleikar
        </h2>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <BookOpen className={styles.featureIcon} />
            <h3 className={styles.featureTitle}>Dagskrárbankinn</h3>
            <p className={styles.featureText}>
              Miðlægt safn verkefna og leikja með skýrum leiðbeiningum, aldursviðmiðum, nauðsynlegum búnaði, tímaáætlun og ábendingum frá öðrum foringjum.
            </p>
            <span className={styles.statusBadge}>Fyrirhugað</span>
          </div>

          <div className={styles.featureCard}>
            <Hammer className={styles.featureIcon} />
            <h3 className={styles.featureTitle}>Dagskrárgerð</h3>
            <p className={styles.featureText}>
              &ldquo;Drag-and-drop&rdquo; verkfæri til að setja saman heildardagskrár (fundi, útilegur eða mót) úr viðfangsefnum. Hægt er að skipuleggja dagskrár eftir tíma, þema eða flokkum.
            </p>
            <span className={styles.statusBadge}>Fyrirhugað</span>
          </div>

          <div className={styles.featureCard}>
            <ClipboardList className={styles.featureIcon} />
            <h3 className={styles.featureTitle}>Sniðmát og dæmi</h3>
            <p className={styles.featureText}>
              Tilbúin sniðmát fyrir algenga skátaviðburði eins og vikulega fundi, færnimerkjadagskrár og útilegur. Foringjar geta notað þau beint eða sérsniðið þau að sínum þörfum.
            </p>
            <span className={styles.statusBadge}>Fyrirhugað</span>
          </div>

          <div className={styles.featureCard}>
            <Users className={styles.featureIcon} />
            <h3 className={styles.featureTitle}>Samvinnuverkfæri</h3>
            <p className={styles.featureText}>
              Möguleiki á að deila dagskrám og viðfangsefnum með öðrum foringjum, flokkum eða sveitum. Inniheldur stuðning við athugasemdir, tillögur og endurnotkun á sameiginlegum áætlunum.
            </p>
            <span className={styles.statusBadge}>Fyrirhugað</span>
          </div>

          <div className={styles.featureCard}>
            <Search className={styles.featureIcon} />
            <h3 className={styles.featureTitle}>Leit og merking</h3>
            <p className={styles.featureText}>
              Ítarleg leitarverkfæri með töggum og síum sem gerir foringjum kleift að finna viðfangsefni eftir aldurshópi, erfiðleikastigi, staðsetningu, búnað eða þema.
            </p>
            <span className={styles.statusBadge}>Fyrirhugað</span>
          </div>

          <div className={styles.featureCard}>
            <BarChart3 className={styles.featureIcon} />
            <h3 className={styles.featureTitle}>Greiningartæki fyrir dagskrá</h3>
            <p className={styles.featureText}>
              Verkfæri til að fara yfir liðna viðburði og greina fjölbreytni dagskrár. Hjálpar foringjum að tryggja að skátar fái jafna blöndu af viðfangsefnum, svo sem eftir ÆSKA og þroskasviðum.
            </p>
            <span className={styles.statusBadge}>Fyrirhugað</span>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <Calendar className={styles.sectionIcon} />
          Tímalína
        </h2>
        <div className={styles.timeline}>
          <div className={styles.timelineItem}>
            <div className={styles.timelineDot}></div>
            <div className={styles.timelineContent}>
              <h3 className={styles.timelineTitle}>Kynning á verkefni</h3>
              <time className={styles.timelineDate}>Janúar 2026</time>
              <p className={styles.timelineLocation}>Neisti</p>
              <p className={styles.timelineNote}>
                Smiðja um dagskrárgerð og safna endurgjöf frá foringjum
              </p>
            </div>
          </div>

          <div className={styles.timelineItem}>
            <div className={styles.timelineDot}></div>
            <div className={styles.timelineContent}>
              <h3 className={styles.timelineTitle}>Útgáfa á lágmarksafurð</h3>
              <time className={styles.timelineDate}>Mars 2026</time>
              <p className={styles.timelineLocation}>Skátaþing</p>
              <p className={styles.timelineNote}>
                Markmiðið er að kynna lágmarksafurðina fyrir sjálfboðaliðum skátahreyfingarinnar.
              </p>
              <p className={styles.timelineNote}>
                Vinnuópar endurnýjaðir
              </p>
            </div>
          </div>

          <div className={styles.timelineItem}>
            <div className={styles.timelineDot}></div>
            <div className={styles.timelineContent}>
              <h3 className={styles.timelineTitle}>Kynning á verkefni</h3>
              <time className={styles.timelineDate}>Ágúst 2026</time>
              <p className={styles.timelineLocation}>Kveikja</p>
              <p className={styles.timelineNote}>
                Kynna verkfærið fyrir stjórnum og foringjum félagas
              </p>
              <p className={styles.timelineNote}>
                Vinnuópar endurnýjaðir
              </p>
            </div>
          </div>

          <div className={styles.timelineItem}>
            <div className={styles.timelineDot}></div>
            <div className={styles.timelineContent}>
              <h3 className={styles.timelineTitle}>Opinber útgáfa</h3>
              <time className={styles.timelineDate}>Apríl 2027</time>
              <p className={styles.timelineNote}>
                Vinnuhópar ljúka störfum
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <div className={styles.cta}>
        <h2 className={styles.ctaTitle}>Viltu vera hluti af verkefninu?</h2>
        <p className={styles.ctaParagraph}>
          Slóði er opinn hugbúnaður og við tökum á móti öllum sem vilja leggja sitt af mörkum. Hvort sem þú ert forritari, hönnuður, skátaformaður eða hefur bara áhuga á verkefninu, þá ertu velkomin/n í hópinn!
        </p>
        <div className={styles.ctaButtons}>
          <a href="https://github.com/slodi-project" className={styles.ctaButtonPrimary} target="_blank" rel="noopener noreferrer">
            Skoða á GitHub
          </a>
          <a href="mailto:slodi@skatarnir.is" className={styles.ctaButtonSecondary}>
            Hafa samband
          </a>
        </div>
      </div>
    </div>
  );
}