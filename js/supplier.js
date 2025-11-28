(function(){
  const key='supplier';
  const tbody=document.querySelector('#tableSupplier tbody');
  const modal=document.getElementById('modal');
  const openAdd=document.getElementById('openAdd');
  const cancel=document.getElementById('cancel');
  const save=document.getElementById('save');
  const search=document.getElementById('search');
  let editingId=null;

  function render(list){
    tbody.innerHTML='';
    if(!list.length){ tbody.innerHTML = '<tr><td colspan="4" class="small">Belum ada data</td></tr>'; return; }
    list.forEach(s=>{
      const tr=document.createElement('tr');
      tr.innerHTML = `<td>${s.nama||''}</td><td>${s.hp||''}</td><td>${s.ket||''}</td>
        <td>
          <button class="btn secondary" data-id="${s.id}" data-action="edit">Edit</button>
          <button class="btn" data-id="${s.id}" data-action="delete">Hapus</button>
        </td>`;
      tbody.appendChild(tr);
    });
  }

  function load(){ render(storage.all(key)); }

  openAdd.addEventListener('click', ()=>{
    editingId=null; document.getElementById('s_nama').value=''; document.getElementById('s_hp').value=''; document.getElementById('s_ket').value=''; modal.style.display='flex';
  });
  cancel.addEventListener('click', ()=> modal.style.display='none');

  save.addEventListener('click', ()=>{
    const nama=document.getElementById('s_nama').value.trim();
    const hp=document.getElementById('s_hp').value.trim();
    const ket=document.getElementById('s_ket').value.trim();
    if(!nama){ alert('Nama perusahaan wajib'); return; }
    if(editingId) storage.update(key, editingId, { nama,hp,ket });
    else storage.add(key, { nama,hp,ket });
    modal.style.display='none'; load();
  });

  tbody.addEventListener('click', (e)=>{
    const btn=e.target.closest('button'); if(!btn) return;
    const id=btn.dataset.id; const action=btn.dataset.action;
    if(action==='edit'){
      const row=storage.find(key, id); editingId=id;
      document.getElementById('s_nama').value=row.nama||''; document.getElementById('s_hp').value=row.hp||''; document.getElementById('s_ket').value=row.ket||'';
      modal.style.display='flex';
    } else if(action==='delete'){
      if(confirm('Hapus supplier?')){ storage.remove(key,id); load(); }
    }
  });

  search.addEventListener('input', ()=> {
    const q=search.value.trim().toLowerCase();
    const list=storage.all(key).filter(s=> (s.nama||'').toLowerCase().includes(q));
    render(list);
  });

  load();
})();
