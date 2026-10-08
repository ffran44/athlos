import { Reveal } from "./ui/Reveal";
import styles from "./Method.module.css";

const columnas = ["Inicio", "S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"];

type Carril = {
  titulo: string;
  detalle: string;
  tipo: "bloque" | "puntos" | "linea";
  // índices de columnas (0 = Inicio, 1..8 = semanas)
  desde?: number;
  hasta?: number;
  puntos?: number[];
};

const carriles: Carril[] = [
  {
    titulo: "Evaluación",
    detalle: "Charlamos tu objetivo, tu historia y tu disponibilidad. Tomamos medidas y fotos de partida.",
    tipo: "bloque",
    desde: 0,
    hasta: 0,
  },
  {
    titulo: "Entrenamiento",
    detalle: "Un bloque de 8 semanas, de 3 a 6 días, con series y rango de repeticiones para cada ejercicio.",
    tipo: "bloque",
    desde: 1,
    hasta: 8,
  },
  {
    titulo: "Registro",
    detalle: "Cada semana anotás kilos y repeticiones. El sistema calcula tu RM estimado y tu volumen.",
    tipo: "puntos",
    puntos: [1, 2, 3, 4, 5, 6, 7, 8],
  },
  {
    titulo: "Ajuste de cargas",
    detalle: "Cuando llegás al tope del rango, la planilla marca que toca subir el peso.",
    tipo: "puntos",
    puntos: [3, 5, 7],
  },
  {
    titulo: "Medidas",
    detalle: "Circunferencias, pliegues y fotos cada 4 semanas, con peso diario en el medio.",
    tipo: "puntos",
    puntos: [0, 4, 8],
  },
  {
    titulo: "Hábitos",
    detalle: "Sueño, pasos, agua y lo que elijamos, con una puntuación diaria y rachas.",
    tipo: "linea",
    desde: 1,
    hasta: 8,
  },
];

export function Method() {
  return (
    <section id="metodo" className="section">
      <div className="wrap">
        <Reveal>
          <h2 className="sectionTitle">Así trabajamos un bloque.</h2>
          <p className="lede">
            Ocho semanas con un plan claro. Vos entrenás y registrás; yo leo los números y ajusto. En la semana 8 revisamos
            todo y armamos el bloque siguiente.
          </p>
        </Reveal>

        <Reveal delay={0.1} className={styles.board}>
          <div className={styles.headRow} aria-hidden="true">
            <span />
            <div className={styles.weeks}>
              {columnas.map((c) => (
                <span key={c} className={c === "Inicio" ? styles.start : undefined}>
                  {c}
                </span>
              ))}
            </div>
          </div>

          <ol className={styles.lanes}>
            {carriles.map((c, idx) => (
              <li key={c.titulo} className={styles.lane}>
                <div className={styles.label}>
                  <h3>{c.titulo}</h3>
                  <p>{c.detalle}</p>
                </div>
                <div className={styles.track} aria-hidden="true">
                  {columnas.map((col, i) => (
                    <span key={col} className={styles.cell} style={{ gridColumn: i + 1 }} />
                  ))}
                  {c.tipo === "bloque" && (
                    <span
                      className={styles.bar}
                      style={{ gridColumn: `${(c.desde ?? 0) + 1} / ${(c.hasta ?? 0) + 2}`, "--d": idx } as React.CSSProperties}
                    />
                  )}
                  {c.tipo === "linea" && (
                    <span
                      className={styles.thread}
                      style={{ gridColumn: `${(c.desde ?? 0) + 1} / ${(c.hasta ?? 0) + 2}`, "--d": idx } as React.CSSProperties}
                    />
                  )}
                  {c.tipo === "puntos" &&
                    c.puntos?.map((p) => (
                      <span
                        key={p}
                        className={styles.dot}
                        style={{ gridColumn: p + 1, "--d": idx, "--p": p } as React.CSSProperties}
                      />
                    ))}
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
