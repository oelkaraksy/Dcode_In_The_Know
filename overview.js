async function loadCSV(path = 'data.csv') {
  const r = await fetch(path);
  const txt = await r.text();
  const lines = txt.trim().split('\n');
  const header = lines.shift().split(',').map(h => h.trim());
  return lines.map(l => {
    const cols = l.split(',').map(c => c.trim());
    const row = {};
    header.forEach((h, i) => row[h] = cols[i] || '');
    return row;
  });
}

function arrowUpSVG(){return `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 3l7 8h-4v7h-6v-7H5z"/></svg>`;}
function arrowDownSVG(){return `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 21l-7-8h4V6h6v7h4z"/></svg>`;}
function dashSVG(){return `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M5 11h14v2H5z"/></svg>`;}

function trendInfo(t){
  t = t.toLowerCase();
  if(t==="up") return {cls:"up", svg:arrowUpSVG(), label:"Up"};
  if(t==="down") return {cls:"down", svg:arrowDownSVG(), label:"Down"};
  return {cls:"flat", svg:dashSVG(), label:"Flat"};
}

function createCard(d){
  const card = document.createElement('div');
  card.className = 'card';

  const top = document.createElement('div');
  top.className = 'metric-row';

  const name = document.createElement('div');
  name.className = 'metric-name';
  name.textContent = d.label;
  top.appendChild(name);

  const t = trendInfo(d.trend);
  const trend = document.createElement('div');
  trend.className = `trend ${t.cls}`;
  trend.innerHTML = t.svg;
  top.appendChild(trend);
  card.appendChild(top);

  const val = document.createElement('div');
  val.className = 'value';
  val.innerHTML = `<div class="num">${d.value}</div><div class="period">${d.period}</div>`;
  card.appendChild(val);

  const meta = document.createElement('div');
  meta.className = 'meta';
  meta.textContent = d.note || "";
  card.appendChild(meta);

  return card;
}

(async function init(){
  const grid = document.getElementById('overviewGrid');
  const rows = await loadCSV();
  rows.forEach(d => grid.appendChild(createCard(d)));
})();
