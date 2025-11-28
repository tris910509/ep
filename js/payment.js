(function(){
  const keyPay = "pembayaran";
  const keyTx = "transaksi";

  const tbody = document.querySelector("#tablePay tbody");
  const modal = document.getElementById("modalPay");
  const search = document.getElementById("search");

  let currentTx = null;

  // Load table
  function render(list){
    tbody.innerHTML = "";
    if(!list.length){
      tbody.innerHTML = `<tr><td colspan="6" class="small">Belum ada transaksi</td></tr>`;
      return;
    }
    list.forEach(t => {
      const pay = storage.all(keyPay).find(p => p.transaksi_id === t.id);
      const status = pay ? pay.status : "Belum Bayar";

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${t.id}</td>
        <td>${t.nama}</td>
        <td>Rp ${t.total}</td>
        <td>${t.metode}</td>
        <td>${status}</td>
        <td><button class="btn" data-id="${t.id}" data-action="bayar">Bayar</button></td>
      `;
      tbody.appendChild(tr);
    });
  }

  function load(){
    render(storage.all(keyTx));
  }

  // Open modal pembayaran
  tbody.addEventListener("click", e => {
    const btn = e.target.closest("button");
    if(!btn) return;

    if(btn.dataset.action === "bayar"){
      const id = btn.dataset.id;
      const tx = storage.find(keyTx, id);
      if(!tx) return alert("Transaksi tidak ditemukan");

      currentTx = tx;

      document.getElementById("p_txid").innerText = tx.id;
      document.getElementById("p_total").innerText = tx.total;

      modal.style.display = "flex";
    }
  });

  // Change metode
  document.getElementById("p_metode").addEventListener("change", showMetodeBox);

  function showMetodeBox(){
    const m = document.getElementById("p_metode").value;
    document.getElementById("cashBox").style.display = m==="cash" ? "block" : "none";
    document.getElementById("transferBox").style.display = m==="transfer" ? "block" : "none";
    document.getElementById("kreditBox").style.display = m==="kredit" ? "block" : "none";
  }

  // Hitung kredit
  document.getElementById("kr_tenor").addEventListener("change", hitungKredit);
  document.getElementById("kr_dp").addEventListener("input", hitungKredit);

  function hitungKredit(){
    const total = Number(currentTx.total);
    const dp = Number(document.getElementById("kr_dp").value);
    const tenor = Number(document.getElementById("kr_tenor").value);
    const bunga = 3.5;

    if(dp >= total){
      document.getElementById("kr_info").innerText = "DP tidak boleh lebih besar dari total.";
      return;
    }

    const sisa = total - dp;
    const cicilan = Math.round((sisa + (sisa * bunga/100 * tenor)) / tenor);

    document.getElementById("kr_info").innerText =
      `Sisa bayar: Rp ${sisa} | Cicilan per bulan: Rp ${cicilan}`;
  }

  // Save pembayaran
  document.getElementById("p_save").addEventListener("click", ()=>{
    const metode = document.getElementById("p_metode").value;
    const total = Number(currentTx.total);

    let data = { transaksi_id: currentTx.id, metode };

    if(metode === "cash"){
      const jml = Number(document.getElementById("cash_jml").value);
      if(jml < total) return alert("Pembayaran kurang, dialihkan ke kredit!");
      data.status = "Lunas";

    } else if(metode === "transfer"){
      const ref = document.getElementById("tf_ref").value.trim();
      if(!ref) return alert("Nomor referensi wajib.");
      data.status = "Menunggu Konfirmasi";
      data.ref = ref;

    } else if(metode === "kredit"){
      const dp = Number(document.getElementById("kr_dp").value);
      const tenor = Number(document.getElementById("kr_tenor").value);
      data.status = "Kredit Berjalan";
      data.dp = dp;
      data.tenor = tenor;
      data.bunga = 3.5;
    }

    // simpan
    storage.add(keyPay, data);
    alert("Pembayaran berhasil disimpan.");

    modal.style.display="none";
    load();
  });

  document.getElementById("p_cancel").addEventListener("click", ()=>{
    modal.style.display = "none";
  });

  // Search
  search.addEventListener("input", ()=>{
    const q = search.value.toLowerCase();
    const list = storage.all(keyTx).filter(t =>
      t.id.includes(q) || t.nama.toLowerCase().includes(q)
    );
    render(list);
  });

  load();
})();
