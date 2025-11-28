// js/pengaturan.js
(function(){
  const key='settings';
  const bungaEl=document.getElementById('bunga');
  const adminEl=document.getElementById('adminFee');
  const saveBtn=document.getElementById('save');
  const resetBtn=document.getElementById('reset');

  function load(){
    const s = storage.find(key, 'config') || storage.all(key)[0] || JSON.parse(localStorage.getItem(key) || 'null');
    // We'll store as a simple object under localStorage key 'settings' directly
    const obj = JSON.parse(localStorage.getItem(key) || '{"bunga":3.5,"adminFee":1}'); 
    bungaEl.value = obj.bunga;
    adminEl.value = obj.adminFee;
  }

  saveBtn.addEventListener('click', ()=>{
    const obj = { bunga: Number(bungaEl.value||0), adminFee: Number(adminEl.value||0) };
    localStorage.setItem(key, JSON.stringify(obj));
    alert('Disimpan');
  });
  resetBtn.addEventListener('click', ()=>{ localStorage.removeItem(key); load(); alert('Direset ke default'); });

  load();
})();
