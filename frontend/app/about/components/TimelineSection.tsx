import { Calendar } from "lucide-react";
import styles from "./TimelineSection.module.css";

export default function TimelineSection() {
  return (
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
  );
}
