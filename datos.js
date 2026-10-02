// Números "aleatorios" repetibles (siempre salen los mismos)
let semilla = 42;
function aleatorio() {
  semilla = (semilla * 16807) % 2147483647;
  return semilla / 2147483647;
}
function elegir(lista) {
  return lista[Math.floor(aleatorio() * lista.length)];
}

const motivosPorTipo = {
  "EEG": ["Convulsiones", "Cefalea", "Mareos", "Pérdida de conciencia"],
  "EMG": ["Dolor lumbar", "Hormigueo en manos", "Debilidad muscular", "Dolor de cuello"],
  "Potenciales Evocados": ["Visión borrosa", "Pérdida de audición", "Hormigueo"]
};
const duraciones = { "EEG": 40, "EMG": 60, "Potenciales Evocados": 50 };
const tipos = Object.keys(motivosPorTipo);

const estudios = [];
for (let i = 0; i < 60; i++) {
  const tipo = elegir(tipos);
  const mes = 1 + Math.floor(aleatorio() * 9);
  const dia = 1 + Math.floor(aleatorio() * 28);
  estudios.push({
    fecha: `2026-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`,
    tipo: tipo,
    edad: 5 + Math.floor(aleatorio() * 80),
    motivo: elegir(motivosPorTipo[tipo]),
    lugar: aleatorio() < 0.7 ? "Clínica" : "Domicilio",
    resultado: aleatorio() < 0.6 ? "Normal" : "Alterado",
    duracion: duraciones[tipo] + Math.floor(aleatorio() * 11)
  });
}
