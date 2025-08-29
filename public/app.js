function calculate() {
  const deposit = +document.getElementById("deposit").value;
  const decoration = +document.getElementById("decoration").value;
  const equipment = +document.getElementById("equipment").value;
  const materials = +document.getElementById("materials").value;
  const rent = +document.getElementById("rent").value;
  const staff = +document.getElementById("staff").value;
  const marketing = +document.getElementById("marketing").value;
  const reserve = +document.getElementById("reserve").value;

  const total = deposit + decoration + equipment + materials + rent + staff + marketing + reserve;
  document.getElementById("total").textContent = "总投资: " + total + " 元";

  // 简化示例：盈亏平衡点假设 = (房租+人工)/毛利率
  const grossMargin = 0.6;
  const breakeven = (rent/3 + staff) / grossMargin;
  document.getElementById("breakeven").textContent = "盈亏平衡点: 每月需 " + breakeven.toFixed(0) + " 元营业额";

  // 回本周期 = 总投资 / (预计月利润)
  const monthlyProfit = 20000;
  const payback = total / monthlyProfit;
  document.getElementById("payback").textContent = "回本周期: " + payback.toFixed(1) + " 个月";
}

document.querySelectorAll("input").forEach(el => {
  el.addEventListener("input", calculate);
});

calculate();
