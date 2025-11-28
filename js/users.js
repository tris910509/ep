(function(){
  const key='users';
  const tbody=document.querySelector('#tableUsers tbody');
  const modal=document.getElementById('modal');
  const mTitle=document.getElementById('mTitle');
  const openAdd=document.getElementById('openAdd');
  const cancel=document.getElementById('cancel');
  const saveUser=document.getElementById('saveUser');
  const search=document.getElementById('search');

  let editingId = null;

  function render(list){
    tbody.innerHTML = '';
    if(!list.length){ tbody.innerHTML = '<tr><td colspan="5" class="small">Belum ada data</td></tr>'; return; }
    list.forEach(u=>{
      const tr=document.createElement('tr');
      tr.innerHTML = `<td>${u.nik||''}</td>
                      <td>${u.nama||''}</td>
                      <td>${u.hp||''}</td>
                      <td>${u.alamat||''}</td>
                      <td>
                        <button class="btn secondary" data-id="${u.id}" data-action="edit">Edit</button>
                        <button class="btn" data-id="${u.id}" data-action="delete">Hapus</button>
                      </td>`;
      tbody.appendChild(tr);
    });
  }

  function loadAndRender(){
    const arr = storage.all(key);
    render(arr);
  }

  openAdd.addEventListener('click', ()=>{
    editingId=null;
    mTitle.innerText='Tambah User';
    modal.style.display='flex';
    document.getElementById('u_nik').value='';
    document.getElementById('u_nama').value='';
    document.getElementById('u_hp').value='';
    document.getElementById('u_alamat').value='';
  });

  cancel.addEventListener('click', ()=> modal.style.display='none');

  saveUser.addEventListener('click', ()=>{
    const nik=document.getElementById('u_nik').value.trim();
    const nama=document.getElementById('u_nama').value.trim();
    const hp=document.getElementById('u_hp').value.trim();
    const alamat=document.getElementById('u_alamat').value.trim();
    if(!nama){ alert('Nama required'); return; }
    if(editingId){
      storage.update(key, editingId, { nik, nama, hp, alamat });
    } else {
      storage.add(key, { nik, nama, hp, alamat });
    }
    modal.style.display='none';
    loadAndRender();
  });

  tbody.addEventListener('click', (e)=>{
    const btn = e.target.closest('button');
    if(!btn) return;
    const id = btn.dataset.id;
    const action = btn.dataset.action;
    if(action==='edit'){
      const row = storage.find(key, id);
      if(!row) return alert('Data tidak ditemukan');
      editingId = id;
      mTitle.innerText = 'Edit User';
      document.getElementById('u_nik').value = row.nik || '';
      document.getElementById('u_nama').value = row.nama || '';
      document.getElementById('u_hp').value = row.hp || '';
      document.getElementById('u_alamat').value = row.alamat || '';
      modal.style.display='flex';
    } else if(action==='delete'){
      if(confirm('Hapus user ini?')) {
        storage.remove(key, id);
        loadAndRender();
      }
    }
  });

  search.addEventListener('input', ()=>{
    const q = search.value.trim().toLowerCase();
    const list = storage.all(key).filter(u => (u.nama||'').toLowerCase().includes(q) || (u.nik||'').toLowerCase().includes(q));
    render(list);
  });

  // initial load
  loadAndRender();
})();
