const formulario = document.querySelector("#formulario");
const monto = document.querySelector("#monto");
const moneda = document.querySelector("#moneda");
const resultado = document.querySelector("#resultado");
const ctx = document.querySelector("#myChart");

formulario.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("https://mindicador.cl/api/");
    if (!res.ok) throw "fallo la solicitud";
    const data = await res.json();
    resultado.innerHTML = `<p> El resultado es: ${
      monto.value / data[moneda.value].valor
    } </p>`;
    renderChart(moneda.value);
  } catch (error) {
    error1.innerHTML = `<p>Fallo la copilación de datos</p>`;
    console.log(error);
  }
});

let grafico;

const renderChart = async (moneda) => {
  const respuesta = await fetch(`https://mindicador.cl/api/${moneda}`);
  const data = await respuesta.json();
  const arrayResultados = data.serie.slice(0, 10).reverse();

  const labels = arrayResultados.map((item) =>
    item.fecha.split("T")[0].split("-").reverse().join("-")
  );
  const dataMoneda = arrayResultados.map((item) => item.valor);

  if(grafico){
    grafico.destroy();
  }

  grafico = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Historial ultimos 10 dias",
          data: dataMoneda,
          borderWidth: 1,
        },
      ],
    },
  });
};
