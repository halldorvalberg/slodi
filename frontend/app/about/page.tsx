// app/about/page.tsx
import styles from "./about.module.css";

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Um Slóða</h1>

      <p className={styles.paragraph}>
        Slóði er Gilwell-verkefni sem Halldór Valberg Aðalbjargarson og Signý Kristín Sigurjónsdóttir sjá um. Það er opinn hugbúnaður sem er hannaður til að auðvelda dagskrárgerð fyrir skátaforingja. Kerfið styður foringja og hópa við að búa til, deila og stjórna viðfangsefnum og tryggir um leið að skátar fái fjölbreytta og vel samsetta dagskrá.
      </p>

      <h2 className={styles.sectionTitle}>Framtíðarsýn</h2>
      <p className={styles.paragraph}>
        Markmið verkefnisins er að styðja við skátaforingja með því að bjóða upp á verkfæri sem gera dagskrárgerð einfaldari, snjallari og samvinnuþýðari. Með því að geyma viðfangsefni, gera kleift að búa til skipulagða dagskrá og veita innsýn í fjölbreytni dagskrárinnar tryggir Slóði að allir skátar njóti góðs af ríkulegri og fjölbreyttri reynslu.
      </p>

      <h2 className={styles.sectionTitle}>Helstu eiginleikar</h2>
      <div className={styles.featureGroup}>
        <p className={styles.paragraph}>
          <strong>Dagksrárbankinn (fyrirhugað):</strong> Miðlægt safn verkefna og leikja með skýrum leiðbeiningum, aldursviðmiðum, nauðsynlegum búnaði, tímaáætlun og ábendingum frá öðrum foringjum.
        </p>
        <p className={styles.paragraph}>
          <strong>Dagskrárgerð (fyrirhugað):</strong> „Drag-and-drop“ verkfæri til að setja saman heildardagskrár (fundi, útilegur eða mót) úr viðfangsefnum. Hægt er að skipuleggja dagskrár eftir tíma, þema eða flokkum.
        </p>
        <p className={styles.paragraph}>
          <strong>Sniðmát og dæmi (fyrirhugað):</strong> Tilbúin sniðmát fyrir algenga skátaviðburði eins og vikulega fundi, færnimerkjadagskrár og útilegur. Foringjar geta notað þau beint eða sérsniðið þau að sínum þörfum.
        </p>
        <p className={styles.paragraph}>
          <strong>Samvinnuverkfæri (fyrirhugað):</strong> Möguleiki á að deila dagskrám og viðfangsefnum með öðrum foringjum, flokkum eða sveitum. Inniheldur stuðning við athugasemdir, tillögur og endurnotkun á sameiginlegum áætlunum.
        </p>
        <p className={styles.paragraph}>
          <strong>Leit og merking (fyrirhugað):</strong> Ítarleg leitarverkfæri með töggum og síum sem gerir foringjum kleift að finna viðfangsefni eftir aldurshópi, erfiðleikastigi, staðsetningu, búnað eða þema.
        </p>
        <p className={styles.paragraph}>
          <strong>Greiningartæki fyrir dagskrá (fyrirhugað):</strong> Verkfæri til að fara yfir liðna viðburði og greina fjölbreytni dagskrár. Hjálpar foringjum að tryggja að skátar fái jafna blöndu af viðfangsefnum, svo sem eftir ÆSKA og þroskasviðum.
        </p>
      </div>

      <h2 className={styles.sectionTitle}>Tímalína</h2>
      <div className={styles.timeline}>
        <p className={styles.timelineEntry}>
          <strong>Kynning á verkefni:</strong> janúar 2026 á viðburðinum Neista
        </p>
        <p className={styles.timelineNote}>
          Smiðja um dagskrárgerð og safna endurgjöf frá foringjum
        </p>
        <p className={styles.timelineEntry}>
          <strong>Kynning og útgáfa á lágmarksafurð:</strong> mars 2026 á Skátaþingi
        </p>
        <p className={styles.timelineNote}>
          Markmiðið er að kynna lágmarksafurðina fyrir sjálfboðaliðum skátahreyfingarinnar.
        </p>
        <p className={styles.timelineNote}>
          Vinnuópar endurnýjaðir
        </p>
        <p className={styles.timelineEntry}>
          <strong>Kynning á verkefni:</strong> ágúst 2026 á Kveikju
        </p>
        <p className={styles.timelineNote}>
          Kynna verkfærið fyrir stjórnum og foringjum félagas
        </p>
        <p className={styles.timelineNote}>
          Vinnuópar endurnýjaðir
        </p>

        <p className={styles.timelineEntry}>
          <strong>Opinber útgáfa:</strong> apríl 2027
        </p>
        <p className={styles.timelineNote}>
          Vinnuhópar ljúka störfum
        </p>
      </div>
    </div>
  );
}
