import api from "@/lib/api"
import Reyting from "@/Components/Reyting";
import Homeimgs from "@/Components/homeimg";
import { getLanguage } from "@/lib/lang"
import styles from "./about.module.css";

export default async function page() {
    const lang = await getLanguage();
    const resabout = await api.get(`about/?lang=${lang}`)
    const resTeam = await api.get(`team/?lang=${lang}`)
    const aboutdata = resabout.data;
    const teamdata = resTeam.data;
    console.log(teamdata);

    return (
        <div className={styles.container}>
            <Homeimgs title="About us" />
            <section className={styles.aboutSection}>
                {aboutdata.map((items) => (
                    <div key={items.id} className={styles.aboutContent}>
                        <div className={styles.aboutText}>
                            <h2>{items.title1}</h2>
                            <p>{items.description1}</p>
                            <h2>{items.title2}</h2>
                            <p>{items.description2}</p>

                        </div>
                        <div className={styles.aboutImages}>
                            <img src={items.images1} alt="company" />
                            <img src={items.images2} alt="company" />
                            <img src={items.images3} alt="company" />
                        </div>

                    </div>
                ))}
            </section>
            <Reyting />
            <section className={styles.teamSection}>
                <h2 className={styles.teamHeading}>{teamdata.label || "OUR TEAME"}</h2>
                <div className={styles.teamGrid}>
                    {teamdata.map((items) =>
                        <div key={items.id} className={styles.teamCard}>
                            <div>
                                <img src={items.images} alt="team" />
                            </div>
                            <div className={styles.teamInfo}>
                                <div className={styles.teamRole}>Director</div>
                                <h2 className={styles.teamName}>{items.name}</h2>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}
