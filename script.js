// script.js - Visualización del intervalo de confianza para la diferencia de medias
// Datos del ejercicio
const grupo1 = [1.52, 1.85, 1.39, 1.15, 1.30, 1.57]; // Con dióxido
const grupo2 = [1.49, 1.55, 1.21, 0.65, 0.76, 0.69]; // Sin dióxido
const n1 = grupo1.length;
const n2 = grupo2.length;
const media1 = 1.4633;
const media2 = 1.0583;
const s1_2 = 0.0588;  // varianza muestral grupo1
const s2_2 = 0.1685;  // varianza muestral grupo2

// Parámetros del intervalo de confianza (calculados en el ejercicio)
const sp2 = 0.11365;            // varianza ponderada
const sp = Math.sqrt(sp2);      // desviación ponderada
const t_critico = 1.812;        // t_{0.05,10}
const diff = media1 - media2;   // 0.405
const error = t_critico * sp * Math.sqrt(1/n1 + 1/n2); // 0.3527
const li = diff - error;        // 0.0523
const ls = diff + error;        // 0.7577

// 1. Gráfico de datos individuales con medias e intervalos de confianza para cada grupo
// Para los intervalos individuales usamos el mismo error estándar basado en varianza agrupada
// (así son consistentes con el modelo). 
// El intervalo para la media de cada grupo: media ± t_critico * sp * sqrt(1/n_i)
const error1 = t_critico * sp * Math.sqrt(1/n1);
const error2 = t_critico * sp * Math.sqrt(1/n2);
const ic1 = [media1 - error1, media1 + error1];
const ic2 = [media2 - error2, media2 + error2];

// Crear trazas de puntos (jitter horizontal para evitar superposición)
const puntos1 = {
    x: grupo1,
    y: Array(n1).fill('Con SO₂'),
    type: 'scatter',
    mode: 'markers',
    name: 'Con dióxido',
    marker: { color: '#d62728', size: 10 },
    text: grupo1.map(v => `${v} kg`),
    hoverinfo: 'text+x'
};
const puntos2 = {
    x: grupo2,
    y: Array(n2).fill('Sin SO₂'),
    type: 'scatter',
    mode: 'markers',
    name: 'Sin dióxido',
    marker: { color: '#1f77b4', size: 10 },
    text: grupo2.map(v => `${v} kg`),
    hoverinfo: 'text+x'
};

// Trazas de medias como puntos
const media1_trace = {
    x: [media1],
    y: ['Con SO₂'],
    type: 'scatter',
    mode: 'markers',
    name: 'Media (con)',
    marker: { color: 'black', size: 12, symbol: 'line-ns' },
    hoverinfo: 'x',
    showlegend: true
};
const media2_trace = {
    x: [media2],
    y: ['Sin SO₂'],
    type: 'scatter',
    mode: 'markers',
    name: 'Media (sin)',
    marker: { color: 'black', size: 12, symbol: 'line-ns' },
    hoverinfo: 'x',
    showlegend: true
};

// Intervalos de confianza para cada media (barras horizontales)
const ic1_shape = {
    type: 'rect',
    xref: 'x', yref: 'y',
    x0: ic1[0], x1: ic1[1],
    y0: 'Con SO₂', y1: 'Con SO₂',
    fillcolor: 'rgba(214,39,40,0.2)',
    line: { width: 0 },
    layer: 'below'
};
const ic2_shape = {
    type: 'rect',
    xref: 'x', yref: 'y',
    x0: ic2[0], x1: ic2[1],
    y0: 'Sin SO₂', y1: 'Sin SO₂',
    fillcolor: 'rgba(31,119,180,0.2)',
    line: { width: 0 },
    layer: 'below'
};

// Layout del gráfico de datos
const layout_datos = {
    title: 'Datos individuales, medias e intervalos de confianza al 90% (varianza agrupada)',
    xaxis: { title: 'Cosecha (kg)', range: [0.5, 2.0] },
    yaxis: { title: '', autorange: false, range: [-0.5, 1.5] },
    shapes: [ic1_shape, ic2_shape],
    legend: { orientation: 'h', y: 1.1 }
};

// 2. Gráfico del intervalo de confianza para la diferencia de medias
const diff_trace = {
    x: [diff],
    y: ['Diferencia (con - sin)'],
    type: 'scatter',
    mode: 'markers',
    marker: { color: 'green', size: 12, symbol: 'circle' },
    error_x: {
        type: 'data',
        symmetric: true,
        array: [error],
        color: 'green',
        thickness: 2,
        width: 15
    },
    name: 'Diferencia observada',
    hoverinfo: 'x'
};

const layout_diff = {
    title: 'Intervalo de confianza al 90% para μ₁ - μ₂',
    xaxis: { title: 'Diferencia de medias (kg)', range: [0, 0.9], zeroline: true, zerolinecolor: 'gray' },
    yaxis: { title: '', showticklabels: false, range: [-0.5, 1.5] },
    annotations: [
        {
            x: li, y: 0, xref: 'x', yref: 'paper',
            text: 'LI = 0.0523', showarrow: false, font: { size: 10 }
        },
        {
            x: ls, y: 0, xref: 'x', yref: 'paper',
            text: 'LS = 0.7577', showarrow: false, font: { size: 10 }
        },
        {
            x: diff, y: 0.5, xref: 'x', yref: 'paper',
            text: 'Diferencia observada = 0.405', showarrow: true, arrowhead: 1,
            ax: 0, ay: -40, font: { size: 10 }
        }
    ]
};

// Renderizar ambos gráficos
Plotly.newPlot('grafico_datos', [puntos1, puntos2, media1_trace, media2_trace], layout_datos, { responsive: true });
Plotly.newPlot('grafico_diferencia', [diff_trace], layout_diff, { responsive: true });