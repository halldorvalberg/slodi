---
title: "Innleiðing Auth0 innskráningar og uppfærsla á farsíma­valmynd"
date: 2025-09-26
author: "Halldór"
tags: ["devlog"]
summary: "Sett upp Auth0 innskráningu, lagað leiðslur fyrir framleiðslu og betrumbætt farsíma­valmyndina."
---

## Markmið

- Innleiða Auth0 auðkenningu og tryggja að inn- og útskráning virki á bæði dev og prod.
- Uppfæra farsíma­valmyndina til að styðja innskráðan notanda og bæta notendaupplifun.
- Tryggja að vefurinn sé tilbúinn fyrir útgáfu í framleiðslu (prod).

## Aðgerðir

- Sett upp Auth0 middleware og lagað leiðir í `api/auth/[auth0]/route.ts` fyrir v4.10.
- Uppfært `APP_BASE_URL` og leyfileg callback og logout slóð í Auth0 stillingum.
- Bætt við `lh3.googleusercontent.com` í `next.config.js` til að styðja prófílmyndir frá Google.
- Hannað og smíðað nýja farsíma­valmynd:
  - Efst birtist notandanafn, mynd og netfang ef notandi er skráður inn.
  - Ef ekki er skráður inn er efsti hlutinn falinn.
  - Stórir textamiðaðir valkostir fyrir „Heim“, „Um Slóða“, „Stjórnborð“.
  - GitHub hlekkur með undirstrikuðum texta og ytri tengil­merki.
  - „Skrá inn“ eða „Skrá út“ hnappur staðsettur neðst í valmyndinni með miðjuðum texta og á íslensku.
- Prófað inn- og útskráningarflæði á dev og lagað leiðarvillur sem vísuðu á `localhost:3000`.
- Undirbúið Vercel prod útgáfu og leyst redirect-vandamál með réttum umhverfisbreytum og stillingum.

## Niðurstöður

- Inn- og útskráning virkar nú í dev og prod umhverfi.
- Ný farsíma­valmynd er tilbúin með hreinni UX hönnun og íslenskum hnöppum „Skrá inn“ / „Skrá út“.
- Prófað innskráningarflæði með Auth0 og prófílmyndir birtast rétt í valmyndinni.

### Næstu skref

- Fínstilla stíla fyrir valmynd á mismunandi skjástærðum.
- Hugsanlega hýsa táknmyndir (icons) staðbundið í `/public` fyrir öryggi og afköst.
- Setja upp betri villuskráningu og eftirlit í prod.
- Klára útgáfuferli og útbúa prófanir fyrir fleiri þjónustur.

## Athugasemdir

- Helsti hnökrinn var misræmi á `APP_BASE_URL` í prod sem olli því að Auth0 redirectaði á `localhost:3000`.
- Lærðum að hafa skýra aðgreiningu milli dev og prod slóða og tryggja samræmi í Auth0 og Vercel stillingum.

