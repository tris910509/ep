// js/item.js
(function(){
  const key='item';
  const tbody=document.querySelector('#table tbody');
  const modal=document.getElementById('modal');
  const openAdd=document.getElementById('openAdd');
  const cancel=document.getElementById('cancel');
  const save=document.getElementById('save');
  const search=document.getElementById('search');
  let editingId=null;

  function render(list){ tbody.innerHTML=''; if(!list.length){ tbody.innerHTML='<tr><td colspan="2" class="small">Belum ada data</td></tr>'; return; } list.forEach(i=>{ const tr=document.createElement('tr'); tr.innerHTML=`<td>${i.nama||''}</td><td><button class="btn secondary" data-id="${i.id}" data-action="edit">Edit</button> <button class="btn" data-id="${i.id}" data-action="delete">Hapus</button></td>`; tbody.appendChild(tr); }); }

  function load(){ render(storage.all(key)); }
  openAdd.addEventListener('click', ()=>{ editingId=null; document.getElementById('i_nama').value=''; modal.style.display='flex'; });
  cancel.addEventListener('click', ()=> modal.style.display='none');
  save.addEventListener('click', ()=>{ const nama=document.getElementById('i_nama').value.trim(); if(!nama){ alert('Nama item wajib'); return; } if(editingId) storage.update(key, editingId, { nama }); else storage.add(key, { nama }); modal.style.display='none'; load(); });
  tbody.addEventListener('click', (e)=>{ const btn=e.target.closest('button'); if(!btn) return; const id=btn.dataset.id; const action=btn.dataset.action; if(action==='edit'){ const r=storage.find(key,id); editingId=id; document.getElementById('i_nama').value=r.nama||''; modal.style.display='flex'; } else if(action==='delete'){ if(confirm('Hapus item?')){ storage.remove(key,id); load(); } } });
  search.addEventListener('input', ()=>{ const q=search.value.trim().toLowerCase(); render(storage.all(key).filter(i=>(i.nama||'').toLowerCase().includes(q))); });
  load();
})();
