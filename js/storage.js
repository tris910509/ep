const storage = (function(){
  function _get(key){ try{ return JSON.parse(localStorage.getItem(key)) || []; }catch(e){ return []; } }
  function _set(key, arr){ localStorage.setItem(key, JSON.stringify(arr)); }
  function all(key){ return _get(key); }
  function saveAll(key, arr){ _set(key, arr); return arr; }
  function add(key, obj){ const arr=_get(key); obj.id = Date.now().toString(); arr.unshift(obj); _set(key,arr); return obj; }
  function update(key, id, patch){ const arr=_get(key); const idx=arr.findIndex(x=>x.id==id); if(idx===-1) throw 'not found'; arr[idx]=Object.assign({},arr[idx],patch); _set(key,arr); return arr[idx]; }
  function remove(key, id){ let arr=_get(key); arr=arr.filter(x=>x.id!=id); _set(key,arr); return arr; }
  function find(key, id){ return _get(key).find(x=>x.id==id) || null; }
  function count(key){ return _get(key).length; }
  return { all, saveAll, add, update, remove, find, count };
})();
