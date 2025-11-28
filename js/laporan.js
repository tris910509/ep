// js/laporan.js
(function(){
  const key='transaksi';
  const tbody=document.querySelector('#table tbody');
  const refresh=document.getElementById('refresh');
  const exportCsv=document.getElementById('exportCsv');

  function render(){
    const list = storage.all(key);
    tbody.innerHTML='';
    if(!list.length){ tbody.innerHTML='<tr><td colspan="4" class="small">Belum ada transaksi</td></tr>'; return; }
    list.forEach(t=>{
      const buyer = t.buyer ? (storage.find('users', t.buyer)?.nama || 'Member') : 'Umum';
      const tr=document.createElement('tr');
      tr.innerHTML=`<td>${t.id}</td><td>${new Date(t.date).toLocaleString()}</td><td>${buyer}</td><td>Rp ${Number(t.total||0).toLocaleString()}</td>`;
      tbody.appendChild(tr);
    });
  }

  function toCSV(arr){
    const headers=['id','date','buyer','total','items'];
    const rows = arr.map(r=> [r.id, r.date, r.buyer || 'umum', r.total, JSON.stringify(r.items)].map(v=>`"${String(v).replace(/"/g,'""')}"`).join(','));
    return [headers.join(','), ...rows].join('\r\n');
  }

  exportCsv.addEventListener('click', ()=>{
    const arr=storage.all(key);
    if(!arr.length) return alert('Tidak ada transaksi untuk diexport');
    const csv=toCSV(arr);
    const blob=new Blob([csv], {type:'text/csv'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a'); a.href=url; a.download='transaksi.csv'; a.click(); URL.revokeObjectURL(url);
  });

  refresh.addEventListener('click', render);
  render();
})();
