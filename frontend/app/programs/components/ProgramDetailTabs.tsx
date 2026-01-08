"use client";

import React, { useState } from "react";
import styles from "./ProgramDetailTabs.module.css";

type Program = {
    id: string;
    name: string;
    description: string | null;
    comment_count?: number;
};

type TabId = "overview" | "instructions" | "materials" | "comments" | "related";

interface Tab {
    id: TabId;
    label: string;
    count?: number;
}

interface ProgramDetailTabsProps {
    program: Program;
}

export default function ProgramDetailTabs({ program }: ProgramDetailTabsProps) {
    const [activeTab, setActiveTab] = useState<TabId>("overview");

    const tabs: Tab[] = [
        { id: "overview", label: "Yfirlit" },
        { id: "instructions", label: "Leiðbeiningar" },
        { id: "materials", label: "Búnaður" },
        { id: "comments", label: "Athugasemdir", count: program.comment_count },
        { id: "related", label: "Tengdar dagskrár" },
    ];

    return (
        <div className={styles.container}>
            {/* Tab Navigation */}
            <nav className={styles.tabNav} role="tablist">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        role="tab"
                        aria-selected={activeTab === tab.id}
                        aria-controls={`panel-${tab.id}`}
                        id={`tab-${tab.id}`}
                        onClick={() => setActiveTab(tab.id)}
                        className={`${styles.tab} ${activeTab === tab.id ? styles.active : ""}`}
                    >
                        {tab.label}
                        {tab.count !== undefined && (
                            <span className={styles.count}>{tab.count}</span>
                        )}
                    </button>
                ))}
            </nav>

            {/* Tab Content */}
            <div className={styles.tabContent}>
                {activeTab === "overview" && (
                    <div
                        role="tabpanel"
                        id="panel-overview"
                        aria-labelledby="tab-overview"
                        className={styles.panel}
                    >
                        <h2 className={styles.panelTitle}>Um dagskrána</h2>
                        <div className={styles.description}>
                            {program.description ? (
                                <p>{program.description}</p>
                            ) : (
                                <p className={styles.emptyState}>Engin lýsing í boði.</p>
                            )}
                        </div>

                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>Námsmarkmið</h3>
                            <ul className={styles.list}>
                                <li>Þróa samvinnu- og hópvinnu</li>
                                <li>Efla útivistarfærni og öryggi</li>
                                <li>Læra nýja tækni og færni</li>
                                <li>Styrkja sjálfsöryggi og frumkvæði</li>
                            </ul>
                        </div>

                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>Best fyrir</h3>
                            <p>
                                Þessi dagskrá hentar best fyrir hópa á aldrinum 9-15 ára sem hafa
                                áhuga á útivist og ævintýrum.
                            </p>
                        </div>
                    </div>
                )}

                {activeTab === "instructions" && (
                    <div
                        role="tabpanel"
                        id="panel-instructions"
                        aria-labelledby="tab-instructions"
                        className={styles.panel}
                    >
                        <h2 className={styles.panelTitle}>Leiðbeiningar</h2>
                        
                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>Skref fyrir skref</h3>
                            <ol className={styles.stepList}>
                                <li className={styles.step}>
                                    <span className={styles.stepNumber}>1</span>
                                    <div className={styles.stepContent}>
                                        <h4>Undirbúningur (5 mín)</h4>
                                        <p>Kynntu þátttakendum dagskrána og settu grundvallarreglur.</p>
                                    </div>
                                </li>
                                <li className={styles.step}>
                                    <span className={styles.stepNumber}>2</span>
                                    <div className={styles.stepContent}>
                                        <h4>Kynning (10 mín)</h4>
                                        <p>Farðu yfir öryggisatriði og sýndu búnaðinn.</p>
                                    </div>
                                </li>
                                <li className={styles.step}>
                                    <span className={styles.stepNumber}>3</span>
                                    <div className={styles.stepContent}>
                                        <h4>Aðalverkefni (30 mín)</h4>
                                        <p>Láttu þátttakendur vinna saman að verkefninu.</p>
                                    </div>
                                </li>
                                <li className={styles.step}>
                                    <span className={styles.stepNumber}>4</span>
                                    <div className={styles.stepContent}>
                                        <h4>Umræða (15 mín)</h4>
                                        <p>Farið yfir hvað gekk vel og hvað má bæta.</p>
                                    </div>
                                </li>
                            </ol>
                        </div>

                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>💡 Ábendingar fyrir leiðsögumenn</h3>
                            <ul className={styles.list}>
                                <li>Passaðu að allir fái tækifæri til að taka þátt</li>
                                <li>Vertu tilbúinn að aðlaga tímaáætlun eftir þörfum</li>
                                <li>Hafðu varaplan ef veður breytist</li>
                            </ul>
                        </div>
                    </div>
                )}

                {activeTab === "materials" && (
                    <div
                        role="tabpanel"
                        id="panel-materials"
                        aria-labelledby="tab-materials"
                        className={styles.panel}
                    >
                        <h2 className={styles.panelTitle}>Búnaður og efni</h2>

                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>✅ Nauðsynlegur búnaður</h3>
                            <ul className={styles.materialList}>
                                <li>
                                    <span className={styles.materialItem}>Eldavél</span>
                                    <span className={styles.materialQty}>1 fyrir hvert 5 manna lið</span>
                                </li>
                                <li>
                                    <span className={styles.materialItem}>Tau/snæri</span>
                                    <span className={styles.materialQty}>50 metrar fyrir hvert lið</span>
                                </li>
                                <li>
                                    <span className={styles.materialItem}>Áttaviti</span>
                                    <span className={styles.materialQty}>1 fyrir hvern þátttakanda</span>
                                </li>
                                <li>
                                    <span className={styles.materialItem}>Landakort</span>
                                    <span className={styles.materialQty}>1 fyrir hvert lið</span>
                                </li>
                            </ul>
                        </div>

                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>⭐ Valfrjáls efni</h3>
                            <ul className={styles.list}>
                                <li>GPS tæki fyrir framþróaða þátttakendur</li>
                                <li>Ljósmyndir fyrir auðkenningu plantna</li>
                                <li>Skrábækur fyrir eftirvinnslu</li>
                            </ul>
                        </div>

                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>📍 Staðsetning</h3>
                            <p>
                                <strong>Tegund:</strong> Útisvæði með göngu- og útivistaraðstöðu
                                <br />
                                <strong>Svæðisþörf:</strong> Að minnsta kosti 50x50 metrar
                                <br />
                                <strong>Aðgengi:</strong> Gott aðgengi fyrir alla
                            </p>
                        </div>
                    </div>
                )}

                {activeTab === "comments" && (
                    <div
                        role="tabpanel"
                        id="panel-comments"
                        aria-labelledby="tab-comments"
                        className={styles.panel}
                    >
                        <h2 className={styles.panelTitle}>Athugasemdir</h2>
                        <div className={styles.emptyState}>
                            <p>Athugasemdakerfi kemur síðar. Hér munu notendur geta deilt upplifunum sínum.</p>
                        </div>
                    </div>
                )}

                {activeTab === "related" && (
                    <div
                        role="tabpanel"
                        id="panel-related"
                        aria-labelledby="tab-related"
                        className={styles.panel}
                    >
                        <h2 className={styles.panelTitle}>Tengdar dagskrár</h2>
                        <div className={styles.emptyState}>
                            <p>Tengdar dagskrár koma síðar. Hér birtast dagskrár með svipuð merki og efni.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
