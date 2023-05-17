import styles from "./index.module.css";
import "./index.css";
import Image from "next/image";
import landscape from "@/public/landscape.png";
import plateau from "@/public/plateau.png";
import astronaut1 from "@/public/astronaut1.png";
import astronaut2 from "@/public/astronaut2.png";
import plants1 from "@/public/plants1.png";
import plants2 from "@/public/plants2.png";
import classnames from "classnames";

export default function Dashboard() {
  return (
    <div className={styles.content}>
      <div
        className={classnames([styles.parallax, styles["parallax-depth-8"]])}
      >
        <Image
          src={landscape}
          alt="landscape"
          className={styles["parallax-img"]}
        />
      </div>
      <div
        className={classnames([styles.parallax, styles["parallax-depth-5"]])}
      >
        <Image src={plateau} alt="plateau" className={styles["parallax-img"]} />
      </div>
      <div
        className={classnames([styles.parallax, styles["parallax-depth-4"]])}
      >
        <Image
          src={astronaut1}
          alt="astronaut1"
          className={styles["parallax-img"]}
        />
      </div>
      <div
        className={classnames([styles.parallax, styles["parallax-depth-3"]])}
      >
        <Image
          src={astronaut2}
          alt="astronaut2"
          className={styles["parallax-img"]}
        />
      </div>
      <div
        className={classnames([styles.parallax, styles["parallax-depth-2"]])}
      >
        <Image src={plants1} alt="plants1" className={styles["parallax-img"]} />
      </div>
      <div
        className={classnames([styles.parallax, styles["parallax-depth-1"]])}
      >
        <Image src={plants2} alt="plants2" className={styles["parallax-img"]} />
      </div>

      <div
        style={{ width: "100vw", height: "800vh", background: "#000" }}
      ></div>
    </div>
  );
}
