/* 店铺投资计算器核心逻辑 */
const $ = (id) => document.getElementById(id);
const nf = (n) => isFinite(n) ? (Math.round(n * 100) / 100).toLocaleString() : '0';
const pct = (n) => isFinite(n) ? (Math.round(n * 10000) / 100).toFixed(2) + '%' : '0%';

function val(id){
  const v = parseFloat($(id).value);
  return isNaN(v) ? 0 : v;
}

function calcTotals(){
  const transferFee = val('transferFee');
  const rentDeposit = val('rentDeposit');
  const trainingCost = val('trainingCost');
  const decoration   = val('decoration');
  const advertising  = val('advertising');
  const equipment    = val('equipment');
  const initialMaterials = val('initialMaterials');
  const rent3m       = val('rent3m');
  const preWages     = val('preWages');
  const marketing    = val('marketing');
  const reserve      = val('reserve');

  const totalCap = transferFee + rentDeposit + trainingCost + decoration + advertising + equipment + initialMaterials + rent3m + preWages + marketing + reserve;
  const preOpenCost = trainingCost + decoration + advertising + equipment + initialMaterials + rent3m + preWages + marketing + reserve; // 不含押金/转让费

  $('totalCap').textContent = nf(totalCap);
  $('preOpenCost').textContent = nf(preOpenCost);
  return { totalCap, preOpenCost };
}

function calcGross(){
  const unitPrice = val('unitPrice');
  const foodCost  = val('foodCost');
  const packageCost = val('packageCost');
  const gross = Math.max(unitPrice - foodCost - packageCost, 0);
  const margin = unitPrice > 0 ? gross / unitPrice : 0;
  $('grossPerUnit').textContent = nf(gross);
  $('grossMargin').textContent = pct(margin);
  return { gross, margin };
}

function calcBreakeven(margin){
  const rentDaily  = val('rentDaily');
  const wageDaily  = val('wageDaily');
  const energyDaily= val('energyDaily');
  const otherDaily = val('otherDaily');
  const days       = Math.max(1, Math.floor(val('daysPerMonth') || 30));

  const opexMonthly = (rentDaily + wageDaily + energyDaily + otherDaily) * days;
  const breakevenRevenue = margin > 0 ? opexMonthly / margin : Infinity;
  const breakevenDailyRevenue = margin > 0 ? breakevenRevenue / days : Infinity;

  $('opexMonthly').textContent = nf(opexMonthly);
  $('breakevenRevenue').textContent = isFinite(breakevenRevenue) ? nf(breakevenRevenue) : '∞';
  $('breakevenDailyRevenue').textContent = isFinite(breakevenDailyRevenue) ? nf(breakevenDailyRevenue) : '∞';
  return { opexMonthly, breakevenRevenue, breakevenDailyRevenue, days };
}

function calcPayback(preOpenCost, margin){
  const revenueMonthly = val('revenueMonthly');
  let cogsPctInput = val('cogsPct');
  const otherOpexMonthly = val('otherOpexMonthly');
  const taxPct = val('taxPct')/100;

  // 如果用户未填 cogsPct，则用毛利率自动反推（cogs = 1 - margin）
  const cogsPct = cogsPctInput > 0 ? cogsPctInput/100 : Math.max(0, 1 - margin);

  const grossMonthly = revenueMonthly * (1 - cogsPct);
  const netMonthly = (grossMonthly - otherOpexMonthly) * (1 - taxPct);
  const paybackMonths = netMonthly > 0 ? preOpenCost / netMonthly : Infinity;

  $('grossMonthly').textContent = nf(grossMonthly);
  $('netMonthly').textContent = isFinite(netMonthly) ? nf(netMonthly) : '∞';
  $('paybackMonths').textContent = isFinite(paybackMonths) ? nf(paybackMonths) : '∞';
  return { netMonthly, paybackMonths };
}

function recalc(){
  const { preOpenCost } = calcTotals();
  const { margin } = calcGross();
  calcBreakeven(margin);
  calcPayback(preOpenCost, margin);
}

function bind(){
  document.querySelectorAll('input').forEach(el => el.addEventListener('input', recalc));
  $('saveBtn').addEventListener('click', () => {
    const data = {};
    document.querySelectorAll('input').forEach(el => data[el.id] = el.value);
    localStorage.setItem('shopInvestCalc', JSON.stringify(data));
    alert('已保存到本地');
  });
  $('loadBtn').addEventListener('click', () => {
    const raw = localStorage.getItem('shopInvestCalc');
    if(!raw) return alert('未找到本地保存的数据');
    const data = JSON.parse(raw);
    Object.keys(data).forEach(k => { const el = $(k); if(el) el.value = data[k]; });
    recalc();
  });
  $('resetBtn').addEventListener('click', () => {
    document.querySelectorAll('input').forEach(el => el.value = '');
    recalc();
  });
  $('exportBtn').addEventListener('click', () => {
    const data = {};
    document.querySelectorAll('input').forEach(el => data[el.id] = el.value);
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'shop-invest-params.json'; a.click();
    URL.revokeObjectURL(url);
  });
  $('importFile').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try{
        const data = JSON.parse(reader.result);
        Object.keys(data).forEach(k => { const el = $(k); if(el) el.value = data[k]; });
        recalc();
      }catch(err){ alert('JSON 解析失败'); }
    };
    reader.readAsText(file);
  });

  // 默认试算
  recalc();
}

document.addEventListener('DOMContentLoaded', bind);
