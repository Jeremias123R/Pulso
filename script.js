const graficos = {};

function dibujar(id, config) {
  if (graficos[id]) graficos[id].destroy();
  graficos[id] = new Chart(document.getElementById(id), config);
}

function contar(lista, campo) {
  const conteo = {};
  lista.forEach(e => {
    conteo[e[campo]] = (conteo[e[campo]] || 0) + 1;
  });
  return conteo;
}

function actualizar() {
  // Filtrar los datos
  const tipoElegido = document.getElementById("filtro-tipo").value;
  const lugarElegido = document.getElementById("filtro-lugar").value;

  const datos = estudios.filter(e =>
    (tipoElegido === "Todos" || e.tipo === tipoElegido) &&
    (lugarElegido === "Todos" || e.lugar === lugarElegido)
  );

  // Tarjetas
  const total = datos.length;
  const alterados = datos.filter(e => e.resultado === "Alterado").length;
  const normales = total - alterados;
  const porcentaje = total ? Math.round((alterados / total) * 100) : 0;
  const sumaEdades = datos.reduce((suma, e) => suma + e.edad, 0);
  const edadPromedio = total ? Math.round(sumaEdades / total) : 0;

  document.getElementById("kpi-total").textContent = total;
  document.getElementById("kpi-alterados").textContent = porcentaje + "%";
  document.getElementById("kpi-edad").textContent = edadPromedio;

  // Gráfico: estudios por tipo
  const porTipo = contar(datos, "tipo");
  dibujar("grafico-tipo", {
    type: "bar",
    data: {
      labels: Object.keys(porTipo),
      datasets: [{
        label: "Cantidad de estudios",
        data: Object.values(porTipo),
        backgroundColor: "#1f6f8b"
      }]
    }
  });

  // Gráfico: estudios por mes
  const porMes = contar(datos.map(e => ({ mes: e.fecha.slice(0, 7) })), "mes");
  const meses = Object.keys(porMes).sort();
  dibujar("grafico-mes", {
    type: "line",
    data: {
      labels: meses,
      datasets: [{
        label: "Estudios por mes",
        data: meses.map(m => porMes[m]),
        borderColor: "#1f6f8b",
        tension: 0.3
      }]
    }
  });

  // Gráfico: normal vs alterado
  dibujar("grafico-resultado", {
    type: "doughnut",
    data: {
      labels: ["Normal", "Alterado"],
      datasets: [{
        data: [normales, alterados],
        backgroundColor: ["#1f6f8b", "#e07a5f"]
      }]
    }
  });

  // Gráfico: motivos más frecuentes
  const topMotivos = Object.entries(contar(datos, "motivo"))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  dibujar("grafico-motivos", {
    type: "bar",
    data: {
      labels: topMotivos.map(m => m[0]),
      datasets: [{
        label: "Cantidad de estudios",
        data: topMotivos.map(m => m[1]),
        backgroundColor: "#1f6f8b"
      }]
    },
    options: { indexAxis: "y" }
  });

  // Gráfico: rangos de edad
  const rangos = { "0-17": 0, "18-39": 0, "40-59": 0, "60+": 0 };
  datos.forEach(e => {
    if (e.edad < 18) rangos["0-17"]++;
    else if (e.edad < 40) rangos["18-39"]++;
    else if (e.edad < 60) rangos["40-59"]++;
    else rangos["60+"]++;
  });
  dibujar("grafico-edad", {
    type: "bar",
    data: {
      labels: Object.keys(rangos),
      datasets: [{
        label: "Cantidad de estudios",
        data: Object.values(rangos),
        backgroundColor: "#e07a5f"
      }]
    }
  });
}

// Cuando cambia un filtro, se vuelve a calcular todo
document.getElementById("filtro-tipo").addEventListener("change", actualizar);
document.getElementById("filtro-lugar").addEventListener("change", actualizar);

// Primera carga
actualizar();