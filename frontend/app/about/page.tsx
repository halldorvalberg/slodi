// app/about/page.tsx
export default function AboutPage() {
  return (
    <div className="font-sans p-6 max-w-4xl mx-auto text-justify">
      <h1 className="text-4xl font-bold mb-4">Um Slóða</h1>
      <p className="mb-4">
        Slóði er Gilwell-verkefni sem Halldór Valberg Aðalbjargarson og Signý Kristín Sigurjónsdóttir sjá um. Það er opinn hugbúnaður sem er hannaður til að auðvelda dagskrárgerð fyrir skátaforingja. Kerfið styður foringja og hópa við að búa til, deila og stjórna viðfangsefnum og tryggir um leið að skátar fái fjölbreytta og vel samsetta dagskrá.
      </p>

      <h2 className="text-2xl font-semibold mb-2">Framtíðarsýn</h2>
      <p className="mb-4">
        Markmið verkefnisins er að styðja við skátaforingja með því að bjóða upp á verkfæri sem gera dagskrárgerð einfaldari, snjallari og samvinnuþýðari. Með því að geyma viðfangsefni, gera kleift að búa til skipulagða dagskrá og veita innsýn í fjölbreytni dagskrárinnar tryggir Slóði að allir skátar njóti góðs af ríkulegri og fjölbreyttri reynslu.
      </p>

      <h2 className="text-2xl font-semibold mb-2">Helstu eiginleikar</h2>
      <div className="mb-4 space-y-4">
        <p><strong>Dagksrárbankinn (fyrirhugað):</strong> Miðlægt safn verkefna og leikja með skýrum leiðbeiningum, aldursviðmiðum, nauðsynlegum búnaði, tímaáætlun og ábendingum frá öðrum foringjum.</p>
        <p><strong>Dagskrárgerð (fyrirhugað):</strong> „Drag-and-drop“ verkfæri til að setja saman heildardagskrár (fundi, útilegur eða mót) úr viðfangsefnum. Hægt er að skipuleggja dagskrár eftir tíma, þema eða flokkum.</p>
        <p><strong>Sniðmát og dæmi (fyrirhugað):</strong> Tilbúin sniðmát fyrir algenga skátaviðburði eins og vikulega fundi, færnimerkjadagskrár og útilegur. Foringjar geta notað þau beint eða sérsniðið þau að sínum þörfum.</p>
        <p><strong>Samvinnuverkfæri (fyrirhugað):</strong> Möguleiki á að deila dagskrám og viðfangsefnum með öðrum foringjum, flokkum eða sveitum. Inniheldur stuðning við athugasemdir, tillögur og endurnotkun á sameiginlegum áætlunum.</p>
        <p><strong>Leit og merking (fyrirhugað):</strong> Ítarleg leitarverkfæri með töggum og síum sem gerir foringjum kleift að finna viðfangsefni eftir aldurshópi, erfiðleikastigi, staðsetningu, búnað eða þema.</p>
        <p><strong>Greiningartæki fyrir dagskrá:</strong> Verkfæri til að fara yfir liðna viðburði og greina fjölbreytni dagskrár. Hjálpar foringjum að tryggja að skátar fái jafna blöndu af viðfangsefnum, svo sem eftir ÆSKA og þroskasviðum.</p>
      </div>

      <h2 className="text-2xl font-semibold mb-2">Tímalína</h2>
      <div className="space-y-2">
        <p><strong>Útgáfa lágmarksafurðar:</strong> mars 2026</p>
        <p className="pl-4">
          <em>
            Markmiðið er að geta kynnt lágmarksafurðina fyrir sjálfboðaliðum skátahreyfingarinnar á skátaþingi 2026 í lok mars
          </em>
        </p>
        <p><strong>Opinber útgáfa:</strong> apríl 2027</p>
      </div>
    </div>
  );
}
