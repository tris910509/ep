// js/kategori.js
(function(){
  const key='kategori';
  const tbody=document.querySelector('#table tbody');
  const modal=document.getElementById('modal');
  const openAdd=document.getElementById('openAdd');
  const cancel=document.getElementById('cancel');
  const save=document.getElementById('save');
  const search=document.getElementById('search');
  let editingId=null;

  function render(list){
    tbody.innerHTML='';
    if(!list.length){ tbody.innerHTML='<tr><td colspan="2" class="small">Belum ada data</td></tr>'; return; }
    list.forEach(k=>{
      const tr=document.createElement('tr');
      tr.innerHTML = `<td>${k.nama||''}</td><td><button class="btn secondary" data-id="${k.id}" data-action="edit">Edit</button> <button class="btn" data-id="${k.id}" data-action="delete">Hapus</button></td>`;
      tbody.appendChild(tr);
    });
  }

  function load(){ render(storage.all(key)); }

  openAdd.addEventListener('click', ()=>{ editingId=null; document.getElementById('k_nama').value=''; modal.style.display='flex';});
  cancel.addEventListener('click', ()=> modal.style.display='none');
  save.addEventListener('click', ()=>{
    const nama=document.getElementById('k_nama').value.trim();
    if(!nama){ alert('Nama kategori wajib'); return; }
    if(editingId) storage.update(key, editingId, { nama });
    else storage.add(key, { nama });
    modal.style.display='none'; load();
  });

  tbody.addEventListener('click', (e)=>{
    const btn=e.target.closest('button'); if(!btn) return;
    const id=btn.dataset.id; const action=btn.dataset.action;
    if(action==='edit'){ const row=storage.find(key,id); editingId=id; document.getElementById('k_nama').value=row.nama||''; modal.style.display='flex'; }
    else if(action==='delete'){ if(confirm('Hapus kategori?')){ storage.remove(key,id); load(); } }
  });

  search.addEventListener('input', ()=>{ const q=search.value.trim().toLowerCase(); render(storage.all(key).filter(k=> (k.nama||'').toLowerCase().includes(q))); });
  load();
})();
