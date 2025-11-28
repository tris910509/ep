// js/transaksi.js
(function(){
  const cartKey='cart_demo';
  const transKey='transaksi';
  const cartTable=document.querySelector('#cartTable tbody');
  const selectProduk=document.getElementById('selectProduk');
  const buyerMode=document.getElementById('buyerMode');
  const selectMember=document.getElementById('selectMember');
  const qtyInput=document.getElementById('qty');
  const addCartBtn=document.getElementById('addCart');
  const clearCartBtn=document.getElementById('clearCart');
  const totalEl=document.getElementById('total');
  const checkoutBtn=document.getElementById('checkout');
  const invoiceModal=document.getElementById('invoiceModal');
  const invoiceContent=document.getElementById('invoiceContent');
  const closeInvoice=document.getElementById('closeInvoice');

  function loadProdukOptions(){
    selectProduk.innerHTML = '<option value="">-- pilih produk --</option>';
    storage.all('produk').forEach(p => selectProduk.innerHTML += `<option value="${p.id}">${p.nama} (Rp ${Number(p.harga||0).toLocaleString()})</option>`);
  }

  function loadMembers(){
    selectMember.innerHTML = '<option value="">-- pilih member --</option>';
    storage.all('users').forEach(u => selectMember.innerHTML += `<option value="${u.id}">${u.nama}</option>`);
  }

  function getCart(){ try{ return JSON.parse(localStorage.getItem(cartKey))||[] }catch(e){ return []; } }
  function saveCart(arr){ localStorage.setItem(cartKey, JSON.stringify(arr)); }
  function renderCart(){
    const cart = getCart();
    cartTable.innerHTML='';
    if(!cart.length){ cartTable.innerHTML='<tr><td colspan="5" class="small">Keranjang kosong</td></tr>'; totalEl.innerText='0'; return; }
    let total=0;
    cart.forEach((c,idx)=>{
      const p = storage.find('produk', c.id) || {};
      const harga = Number(p.harga||0);
      const subtotal = harga * c.qty;
      total += subtotal;
      const tr=document.createElement('tr');
      tr.innerHTML = `<td>${p.nama||''}</td><td>${c.qty}</td><td>${harga.toLocaleString()}</td><td>${subtotal.toLocaleString()}</td>
        <td><button class="btn secondary" data-idx="${idx}" data-action="remove">Hapus</button></td>`;
      cartTable.appendChild(tr);
    });
    totalEl.innerText = total.toLocaleString();
  }

  addCartBtn.addEventListener('click', ()=>{
    const pid = selectProduk.value; const qty = Math.max(1, Number(qtyInput.value||1));
    if(!pid) return alert('Pilih produk');
    const cart = getCart();
    const found = cart.find(x=>x.id===pid);
    if(found) found.qty += qty; else cart.push({ id: pid, qty });
    saveCart(cart); renderCart();
  });

  clearCartBtn.addEventListener('click', ()=>{ if(confirm('Kosongkan keranjang?')){ saveCart([]); renderCart(); } });

  cartTable.addEventListener('click', (e)=>{
    const btn=e.target.closest('button'); if(!btn) return;
    const idx=btn.dataset.idx;
    if(btn.dataset.action==='remove'){
      const cart=getCart(); cart.splice(idx,1); saveCart(cart); renderCart();
    }
  });

  checkoutBtn.addEventListener('click', ()=>{
    const cart = getCart(); if(!cart.length) return alert('Keranjang kosong');
    const buyer = buyerMode.value === 'member' ? (selectMember.value || null) : null;
    const total = cart.reduce((s,c)=>{ const p=storage.find('produk', c.id)||{}; return s + (Number(p.harga||0) * c.qty); }, 0);
    const inv = { id: Date.now().toString(), date: new Date().toISOString(), buyer, items: cart, total };
    storage.add(transKey, inv);
    // reduce stok
    cart.forEach(c=>{
      const p = storage.find('produk', c.id);
      if(p){ storage.update('produk', p.id, { stok: Math.max(0, Number(p.stok||0) - c.qty) }); }
    });
    saveCart([]); renderCart(); loadProdukOptions();
    // show invoice
    invoiceContent.innerHTML = `<p>Nomor: <strong>${inv.id}</strong></p><p>Tanggal: ${inv.date}</p><p>Total: Rp ${inv.total.toLocaleString()}</p>`;
    invoiceModal.style.display='flex';
    // update dashboard counts (if on index)
    try{ if(window.opener) window.opener.location.reload(); }catch{}
  });

  closeInvoice.addEventListener('click', ()=> invoiceModal.style.display='none');

  // show/hide member select
  buyerMode.addEventListener('change', ()=>{
    if(buyerMode.value==='member'){ selectMember.style.display='inline-block'; loadMembers(); } else selectMember.style.display='none';
  });

  // init
  loadProdukOptions(); renderCart();
})();
