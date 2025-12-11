async function fetchCSV(path = 'data.csv'){
  const res = await fetch(path);
  const txt = await res.text();
  const lines = txt.trim().split('\n');
  const header = lines.shift().split(',').map(h => h.trim());
  const out = {};

  lines.forEach(line =>{
    if(!line.trim()) return;
    const cols = line.split(',').map(c => c.trim());
    const key = cols[0];
    out[key] = {};
    for(let i=1;i<header.length;i++){
      const val = cols[i] === '' ? null : parseFloat(cols[i]);
      out[key][header[i]] = val;
    }
  });
  return out;
}

function barConfig(labels, current, previous){
  return {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        { label: 'Current', data: current, backgroundColor: '#002855', borderRadius: 4 },
        { label: 'Previous', data: previous, backgroundColor: '#b0b0b0', borderRadius: 4 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } }
    }
  };
}

function mountChart(canvasId, cfg){
  const ctx = document.getElementById(canvasId).getContext('2d');
  document.getElementById(canvasId).parentElement.style.height = '220px';
  return new Chart(ctx, cfg);
}

(async function init(){
  const data = await fetchCSV();

  mountChart('chartInflation', barConfig(['Headline','Core'], [data.headline_inflation.latest, data.core_inflation.latest], [data.headline_inflation.previous, data.core_inflation.previous]));
  mountChart('chartInterest', barConfig(['Mid-Corr'], [data.interest_rate.latest], [data.interest_rate.previous]));
  mountChart('chartFX', barConfig(['EGP/USD'], [data.exchange_rate.latest], [data.exchange_rate.previous]));
  mountChart('chartBOP', barConfig(['Trade Deficit','Total Exports','Total Imports'], [data.trade_deficit.latest, data.exports.latest, data.imports.latest], [data.trade_deficit.previous, data.exports.previous, data.imports.previous]));
  mountChart('chartBudget', barConfig(['Interest Payments','Subsidies & Grants','Investments'], [data.budget_interest.latest, data.budget_subsidies.latest, data.budget_investments.latest], [data.budget_interest.previous, data.budget_subsidies.previous, data.budget_investments.previous]));
  mountChart('chartSectors', barConfig(['ICT','Tourism'], [data.ict_growth.latest, data.tourism_growth.latest], [data.ict_growth.previous, data.tourism_growth.previous]));
})();
