(() => {
  'use strict';
  const data = window.SITE_CONTENT;
  const isPublished = p => ['published', 'accepted'].includes(p.status);
  const publishedPapers = data.papers.filter(isPublished);
  const submittedPapers = data.papers.filter(p => !isPublished(p));
  const publishedCitations = publishedPapers.reduce((sum, p) => sum + data.citationSnapshot.byPaper[p.id], 0);
  const sections = ['about', 'research', 'publications', 'projects', 'patents'];
  let lang = new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'zh';
  let filter = 'all';
  const $ = selector => document.querySelector(selector);
  const escape = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const tr = value => Array.isArray(value) ? value[lang === 'zh' ? 0 : 1] : value;
  const icon = (name, cls = '') => {
    const paths = {
      mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
      calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18M8 15h2m4 0h2m-8 3h2"/>',
      pin: '<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z"/><circle cx="12" cy="10" r="2"/>',
      school: '<path d="m2 9 10-5 10 5-10 5-10-5Zm4 2v6c3 3 9 3 12 0v-6M22 9v7"/>',
      download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v4h16v-4"/>',
      arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
      external: '<path d="M14 4h6v6M20 4l-9 9M10 4H4v16h16v-6"/>',
      file: '<path d="M14 3H5v18h14V8l-5-5Zm0 0v5h5M8 13h8m-8 4h6"/>',
      code: '<path d="m8 6-6 6 6 6m8-12 6 6-6 6M14 3l-4 18"/>'
    };
    return `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.file}</svg>`;
  };
  const external = (url, label, kind = 'external') => `<a href="${escape(url)}" target="_blank" rel="noopener noreferrer">${icon(kind)}<span>${escape(label)}</span></a>`;
  const heading = (title, subtitle, eyebrow) => `<div class="section-heading"><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p>${subtitle}</p></div>`;
  const route = () => {
    const parts = location.hash.slice(1).split('/');
    return { section: sections.includes(parts[0]) ? parts[0] : 'about', paper: parts[1] || '' };
  };
  function profile(t) {
    return `<div class="profile-top"><img class="portrait" src="assets/portrait.jpg" alt="${lang==='zh'?'许博约照片':'Portrait of Boyue Xu'}" width="480" height="640"><div class="identity"><p class="profile-name">${t.name}</p><p class="other-name">${t.otherName}</p><p class="profile-role">${t.role}</p></div></div>
      <div class="profile-meta"><p>${icon('school')}<span>${t.university}</span></p><p>${icon('pin')}<span>${t.location}</span></p><p>${icon('calendar')}<span>${t.birth}</span></p><a href="mailto:xuby@smail.nju.edu.cn">${icon('mail')}<span>xuby@smail.nju.edu.cn</span></a></div>
      <p class="graduation"><span class="status-dot"></span>${t.graduation}</p>
      <div class="profile-links">${external(data.scholar,'Google Scholar','school')}${external(data.github,'GitHub','code')}</div>
      <div class="profile-bottom"><span class="small-label">RESEARCH INTERESTS</span><div class="interest-tags">${t.topics.map(s=>`<span>${s}</span>`).join('')}</div></div>`;
  }
  function about(t) {
    return `<section class="panel intro"><p class="eyebrow">ABOUT ME</p><h1>${t.aboutTitle}</h1><h2 class="intro-lead">${t.aboutLead}</h2>${t.bio.map(s=>`<p>${s}</p>`).join('')}<a class="text-link" href="#research">${t.explore}${icon('arrow')}</a></section>
      <div class="stats-strip">${[publishedPapers.length,3,7].map((n,i)=>`<a href="#${i===0?'publications':'patents'}"><strong>${n.toString().padStart(2,'0')}</strong><span>${t.stats[i]}</span>${i===0?`<small class="stat-citations">${t.citations} ${publishedCitations} ${t.citationUnit}</small>`:''}${icon('arrow')}</a>`).join('')}</div>
      <section class="panel"><div class="card-title"><h2>${t.education}</h2><span>EDUCATION</span></div><ol class="education-list">${data.education.map(e=>`<li><div class="timeline-dot"></div><div><p class="date">${tr(e.date)}</p><h3>${tr(e.school)}</h3><p class="degree">${tr(e.degree)}</p>${tr(e.advisor)?`<p class="muted advisor">${tr(e.advisor)}</p>`:''}</div></li>`).join('')}</ol></section>
      <section class="panel"><div class="card-title"><h2>${t.service}</h2><span>SERVICE</span></div><p class="service-lead">${t.reviewer}</p><div class="service-row"><span>${t.journals}</span><p>IEEE TMM · IEEE TCSVT · Pattern Recognition</p></div><div class="service-row"><span>${t.conferences}</span><p>CVPR · ICCV · AAAI</p></div></section>`;
  }
  function research(t) {
    return `${heading(t.researchTitle,t.researchLead,'RESEARCH')}
      <p class="section-intro">${t.researchIntro}</p>${data.research.map(r=>`<article class="panel research-card"><div class="research-top"><span class="research-number">${r.number}</span><div><p class="eyebrow">${r.subtitle}</p><h2>${tr(r.title)}</h2></div></div><div class="research-body"><p>${tr(r.text)}</p><figure class="research-figure${r.figure.wide?' wide':''}"><a class="figure-image" href="${r.figure.src}" target="_blank" rel="noopener" aria-label="${t.figureZoom}: ${escape(tr(r.figure.caption))}"><img src="${r.figure.src}" width="${r.figure.width}" height="${r.figure.height}" alt="${escape(tr(r.figure.alt))}" loading="lazy"></a><figcaption><span>${tr(r.figure.caption)}</span>${r.figure.source?`<a href="${r.figure.source}" target="_blank" rel="noopener noreferrer">${t.figureSource} ↗</a>`:''}<a href="${r.figure.src}" target="_blank" rel="noopener">${t.figureZoom} ↗</a></figcaption></figure></div><div class="research-support"><span class="small-label">${t.support}</span><div class="support-links">${r.support.map(([label,id])=>`<a href="#publications/${id}">${escape(label.replace(lang==='zh'?/ \/ (Under review|Major revision|Minor revision|Accepted)/g:/(在投|大修|小修|已录用) \/ /g,''))}<span aria-hidden="true">↗</span></a>`).join('')}</div><p>${tr(r.extra)}</p></div></article>`).join('')}
      <section class="future-panel"><p class="eyebrow">${t.future}</p><h2>${t.futureTitle}</h2><div>${t.futureItems.map(([title,text])=>`<article><h3>${title}</h3><p>${text}</p></article>`).join('')}</div></section>`;
  }
  function paperCard(p,t) {
    const authors=escape(p.authors).replace('Boyue Xu','<strong>Boyue Xu</strong>');
    return `<article class="paper" id="paper-${p.id}" tabindex="-1"><div class="paper-index"><span>${p.year || (lang==='zh'?'在投':'REVIEW')}</span><small>${escape(p.short)}</small></div><div class="paper-content"><div class="paper-tags">${p.rating?`<span class="tag rating">${tr(p.rating)}</span>`:`<span class="tag ${['revision','minorRevision'].includes(p.status)?'revision':'review'}">${t[p.status]}</span>`}${p.status==='accepted'&&p.rating?`<span class="tag accepted">${t.accepted}</span>`:''}<span class="author-role">${t[p.role]}</span></div><h3>${escape(p.title)}</h3><p class="authors">${authors}</p><p class="venue">${escape(p.venue)}${p.year?` · ${p.year}${p.status==='accepted'?` · ${t.accepted}`:''}`:` · ${t[p.status]}`}</p><p class="paper-summary">${tr(p.summary)}</p><div class="paper-links">${p.doi?external('https://doi.org/'+p.doi,t.paper,'file'):''}${p.code?external(p.code,t.code,'code'):''}${p.repository?external(p.repository,t.repository,'code'):''}${p.preprint?external(p.preprint,t.preprint,'file'):''}</div></div></article>`;
  }
  function papers(t) {
    const published=publishedPapers;
    const submitted=submittedPapers;
    return `${heading(t.pubsTitle,t.pubsIntro,'PUBLICATIONS')}<div class="filter-row" role="group" aria-label="${t.filters}">${[['all',t.all,data.papers.length],['published',t.published,published.length],['submitted',t.submitted,submitted.length]].map(([id,label,count])=>`<button type="button" data-filter="${id}" aria-pressed="${filter===id}">${label}<span>${count}</span></button>`).join('')}</div>
      ${filter!=='submitted'?`<section class="panel publication-panel"><div class="publication-title"><h2>${t.published}</h2><p>${t.pubNote}</p><div class="citation-summary"><a href="${data.scholar}" target="_blank" rel="noopener noreferrer">${t.citations} <strong>${publishedCitations}</strong> ${t.citationUnit} ↗</a><span>Google Scholar · ${t.citationDate} <time datetime="${data.citationSnapshot.asOf}">${data.citationSnapshot.asOf.replaceAll('-','.')}</time></span></div></div>${published.map(p=>paperCard(p,t)).join('')}</section>`:''}
      ${filter!=='published'?`<section class="panel publication-panel submitted-panel"><div class="publication-title"><h2>${t.submitted}</h2><p>${t.underNote}</p></div>${submitted.map(p=>paperCard(p,t)).join('')}</section>`:''}`;
  }
  function projects(t) {
    return `${heading(t.projectsTitle,t.projectsIntro,'PROJECTS & HONORS')}<section class="panel"><div class="card-title"><h2>${t.projects}</h2><span>PROJECTS</span></div><div class="project-list">${data.projects.map(p=>`<article class="project"><div class="project-meta"><span class="date">${p.date}</span><span class="tag">${tr(p.role)}</span></div><h3>${tr(p.title)}</h3><p class="source">${tr(p.source)}</p><p>${tr(p.text)}</p></article>`).join('')}</div></section><section class="panel"><div class="card-title"><h2>${t.awards}</h2><span>HONORS</span></div><div class="award-list">${data.awards.map(a=>`<article class="award"><span class="award-year">${a.year}</span><div><h3>${tr(a.title)}</h3>${tr(a.text)?`<p>${tr(a.text)}</p>`:''}</div></article>`).join('')}</div></section>`;
  }
  function patents(t) {
    return `${heading(t.ipTitle,t.ipIntro,'INTELLECTUAL PROPERTY')}<div class="ip-stats"><div><strong>03</strong><span>${t.granted}</span></div><div><strong>02</strong><span>${t.filed}</span></div><div><strong>07</strong><span>${t.copyright}</span></div></div><section class="panel patent-list">${data.patents.map((p,i)=>`<article class="patent"><span class="patent-index">0${i+1}</span><div><span class="tag ${p.status}">${t[p.status]}</span><h2>${tr(p.title)}</h2><p>${p.status==='granted'?t.patentNumber:t.applicationNumber}：<span class="patent-number">${p.number}</span></p></div></article>`).join('')}</section><section class="panel copyright-panel">${icon('code')}<div><h2>${t.copyright}</h2><p>${t.copyrightText}</p></div></section>`;
  }
  const templates={about,research,publications:papers,projects,patents};
  function render({ focus=false }={}) {
    const t=data.ui[lang];
    const current=route();
    document.documentElement.lang=lang==='zh'?'zh-CN':'en';
    document.title=lang==='zh'?'许博约 · Boyue Xu | 南京大学':'Boyue Xu | Nanjing University';
    $('#navigation').setAttribute('aria-label',t.navigation);
    $('#navigation').innerHTML=sections.map((id,i)=>`<a href="#${id}" ${current.section===id?'aria-current="page"':''}>${t.nav[i]}</a>`).join('');
    $('#profile').setAttribute('aria-label',t.profile);
    $('#profile').innerHTML=profile(t);
    $('#language').innerHTML=lang==='zh'?'EN <span aria-hidden="true">↗</span>':'中文 <span aria-hidden="true">↗</span>';
    $('#language').setAttribute('aria-label',lang==='zh'?'Switch to English':'切换为中文');
    $('#main').innerHTML=templates[current.section](t);
    $('#footer').innerHTML=`<span>© 2026 ${t.name} <span class="footer-divider">/</span> ${t.footer}</span><span>${t.updated} ${data.updated}</span>`;
    if(focus) {
      $('#main').focus({preventScroll:true});
      if(window.matchMedia('(max-width:820px)').matches) $('#main').scrollIntoView({block:'start',behavior:'instant'});
      else window.scrollTo({top:0,behavior:'instant'});
    }
    if(current.section==='publications' && current.paper) {
      const selected=document.getElementById('paper-'+current.paper);
      if(selected) { selected.classList.add('highlighted'); selected.scrollIntoView({block:'center',behavior:'instant'}); if(focus) selected.focus({preventScroll:true}); }
    }
  }
  $('.skip-link').addEventListener('click',event=>{
    event.preventDefault();
    $('#main').focus({preventScroll:true});
    $('#main').scrollIntoView({block:'start',behavior:'instant'});
  });
  $('#language').addEventListener('click',()=>{
    lang=lang==='zh'?'en':'zh';
    const url=new URL(location.href);
    if(lang==='en') url.searchParams.set('lang','en'); else url.searchParams.delete('lang');
    history.replaceState(null,'',url);
    render();
  });
  $('#main').addEventListener('click',event=>{
    const button=event.target.closest('[data-filter]');
    if(!button)return;
    filter=button.dataset.filter;
    if(route().paper) history.replaceState(null,'',location.pathname+location.search+'#publications');
    render();
    $(`[data-filter="${filter}"]`).focus({preventScroll:true});
  });
  window.addEventListener('hashchange',()=>{filter='all';render({focus:true});});
  window.addEventListener('popstate',()=>{lang=new URLSearchParams(location.search).get('lang')==='en'?'en':'zh';filter='all';render();});
  render();
})();
