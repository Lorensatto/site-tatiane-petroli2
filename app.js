const money=n=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0}).format(n);
const normalize=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const form=document.querySelector('#search');
if(form){
 const params=new URLSearchParams(location.search);
 for(const [key,value] of params)if(form.elements[key] && key!=='bairro')form.elements[key].value=value;
 const dataUrl=location.pathname.includes('/imoveis/')?'../../imoveis.json':'imoveis.json';
 fetch(dataUrl).then(r=>{if(!r.ok)throw Error();return r.json()}).then(data=>{
  const city=form.elements.cidade,hood=form.elements.bairro;
  function setHoods(){const previous=params.get('bairro')||hood.value;const names=[...new Set(data.filter(p=>p.status==='disponivel'&&p.bairro&&(!city.value||p.cidade===city.value)).map(p=>p.bairro))].sort((a,b)=>a.localeCompare(b,'pt-BR'));hood.innerHTML='<option value="">Todos os bairros</option>'+names.map(n=>`<option value="${n}">${n}</option>`).join('');if(names.includes(previous))hood.value=previous;}
  city.addEventListener('change',()=>{hood.value='';params.delete('bairro');setHoods();});setHoods();
  const results=document.querySelector('#results');if(!results)return;
  const sort=document.querySelector('#sort');
  function render(){let items=data.filter(p=>p.status==='disponivel'&&(!form.elements.finalidade.value||p.finalidade===form.elements.finalidade.value)&&(!form.elements.tipo.value||p.tipo===form.elements.tipo.value)&&(!city.value||p.cidade===city.value)&&(!hood.value||p.bairro===hood.value)&&(!form.elements.preco.value||p.preco<=Number(form.elements.preco.value))&&(!form.elements.ref.value||normalize(p.ref).includes(normalize(form.elements.ref.value))));
   if(sort.value==='asc')items.sort((a,b)=>a.preco-b.preco);if(sort.value==='desc')items.sort((a,b)=>b.preco-a.preco);
   results.innerHTML=items.map(p=>`<a class="card" href="imovel-${p.slug}.html"><div class="card-image"><img loading="lazy" src="${p.imagem}" alt="${p.ilustrativo?'Imagem de exemplo':'Foto do imóvel'} ${p.titulo}"><span class="pill">Gestão exclusiva</span>${p.ilustrativo?'<span class="demo-pill">Exemplo fictício</span>':''}</div><div class="card-content"><p class="eyebrow">${[p.bairro||p.endereco,p.cidade].filter(Boolean).join(' · ')}</p><h3>${p.titulo}</h3><div class="card-specs">${p.area?`<span>${p.area} m²</span>`:''}${p.quartos?`<span>${p.quartos} dormitórios</span>`:''}${p.vagas?`<span>${p.vagas} vagas</span>`:''}</div><div class="card-bottom"><div><small>${p.finalidade==='Aluguel'?'Aluguel mensal':'Valor de venda'}</small><strong>${money(p.preco)}</strong></div><span class="round-arrow" aria-hidden="true"><span class="icon-arrow" aria-hidden="true"></span></span></div></div></a>`).join('');
   document.querySelector('#count').textContent=`(${items.length})`;document.querySelector('#empty').hidden=items.length>0;
  }
  sort.addEventListener('change',render);render();
  document.querySelector('#clear').addEventListener('click',()=>location.href='imoveis.html');
 }).catch(()=>{const results=document.querySelector('#results');if(results)results.innerHTML='<p>Não foi possível carregar os imóveis. Tente atualizar a página.</p>'});
}
const photo=document.querySelector('#main-photo');if(photo)document.querySelectorAll('[data-photo]').forEach(btn=>btn.addEventListener('click',()=>{photo.src=btn.dataset.photo;document.querySelectorAll('.thumb').forEach(x=>x.classList.toggle('selected',x===btn));}));
