
// js/produk.js
(function(){
  const key='produk';
  const tbody=document.querySelector('#table tbody');
  const modal=document.getElementById('modal');
  const openAdd=document.getElementById('openAdd');
  const cancel=document.getElementById('cancel');
  const save=document.getElementById('save');
  const search=document.getElementById('search');
  let editingId=null;

  function getOptions(key){ return storage.all(key).map(x=>({id:x.id,label:x.nama||x.namaPerusahaan||x.namaKategori||''})); }

  function populateSelects(){
    const supSel=document.getElementById('p_supplier'), catSel=document.getElementById('p_kategori'), itemSel=document.getElementById('p_item');
    supSel.innerHTML='<option value="">-- pilih supplier --</option>'; storage.all('supplier').forEach(s=> supSel.innerHTML+=`<option value="${s.id}">${s.nama}</option>`);
    catSel.innerHTML='<option value="">-- pilih kategori --</option>'; storage.all('kategori').forEach(k=> catSel.innerHTML+=`<option value="${k.id}">${k.nama}</option>`);
    itemSel.innerHTML='<option value="">-- pilih item --</option>'; storage.all('item').forEach(i=> itemSel.innerHTML+=`<option value="${i.id}">${i.nama}</option>`);
  }

  function render(list){
    tbody.innerHTML='';
    if(!list.length){ tbody.innerHTML='<tr><td colspan="7" class="small">Belum ada data</td></tr>'; return; }
    list.forEach(p=>{
      const sup = storage.find('supplier', p.supplier)||{};
      const kat = storage.find('kategori', p.kategori)||{};
      const itm = storage.find('item', p.item)||{};
      const tr=document.createElement('tr');
      tr.innerHTML = `<td>${p.nama||''}</td><td>${sup.nama||''}</td><td>${kat.nama||''}</td><td>${itm.nama||''}</td><td>${p.stok||0}</td><td>${Number(p.harga||0).toLocaleString()}</td>
        <td><button class="btn secondary" data-id="${p.id}" data-action="edit">Edit</button> <button class="btn" data-id="${p.id}" data-action="delete">Hapus</button></td>`;
      tbody.appendChild(tr);
    });
  }

  function load(){ render(storage.all(key)); }

  openAdd.addEventListener('click', ()=>{ editingId=null; document.getElementById('p_nama').value=''; document.getElementById('p_stok').value=0; document.getElementById('p_harga').value=0; populateSelects(); modal.style.display='flex';});
  cancel.addEventListener('click', ()=> modal.style.display='none');

  save.addEventListener('click', ()=>{
    const nama=document.getElementById('p_nama').value.trim();
    const supplier=document.getElementById('p_supplier').value;
    const kategori=document.getElementById('p_kategori').value;
    const item=document.getElementById('p_item').value;
    const stok=Number(document.getElementById('p_stok').value||0);
    const harga=Number(document.getElementById('p_harga').value||0);
    if(!nama){ alert('Nama produk wajib'); return; }
    const payload={ nama, supplier, kategori, item, stok, harga };
    if(editingId) storage.update(key, editingId, payload);
    else storage.add(key, payload);
    modal.style.display='none'; load();
  });

  tbody.addEventListener('click', (e)=>{
    const btn=e.target.closest('button'); if(!btn) return;
    const id=btn.dataset.id; const action=btn.dataset.action;
    if(action==='edit'){ const r=storage.find(key, id); editingId=id; populateSelects(); document.getElementById('p_nama').value=r.nama||''; document.getElementById('p_supplier').value=r.supplier||''; document.getElementById('p_kategori').value=r.kategori||''; document.getElementById('p_item').value=r.item||''; document.getElementById('p_stok').value=r.stok||0; document.getElementById('p_harga').value=r.harga||0; modal.style.display='flex'; }
    else if(action==='delete'){ if(confirm('Hapus produk?')){ storage.remove(key,id); load(); } }
  });

  search.addEventListener('input', ()=> {
    const q=search.value.trim().toLowerCase();
    render(storage.all(key).filter(p=> (p.nama||'').toLowerCase().includes(q)));
  });

  // init
  load();
})();
