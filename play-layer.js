// 집합소 귀환 한 가지, 마을 자리잡기, 저장 파일.
// index.html 본문 스크립트 다음에 로드된다.

let _hubDismissedKinds=new Set();

function earlyPositionBattle(){
  return !(typeof civPhase==='number'&&civPhase>=2);
}
function roleBaseOf(a, roleBase){
  if(roleBase) return roleBase;
  if(!a) return 'Refugee';
  if(a.class10Key&&typeof CLASS10!=='undefined'&&CLASS10[a.class10Key]&&CLASS10[a.class10Key].base) return CLASS10[a.class10Key].base;
  return a.classKey||a.baseRole||'Refugee';
}
function isRangedLikeRole(a, rb){
  return rb==='Ranged'||rb==='Mage'||(rb==='Refugee'&&a.activeSkills&&a.activeSkills.indexOf('Arrow')>=0);
}
function isTankLikeRole(a, rb){
  if(rb==='Tank') return true;
  const sk=a&&a.activeSkills;
  return !!(sk&&(sk.indexOf('Fortress')>=0||sk.indexOf('Taunt')>=0||sk.indexOf('Guard')>=0));
}

/** 집합소·마을에서만. 도시·왕국은 null 을 돌려 기존 추격을 쓴다. */
function villagePositioningStop(a,e,roleBase){
  if(!earlyPositionBattle()||!a||!e) return null;
  const rb=roleBaseOf(a, roleBase);
  const d=Math.hypot(a.x-e.x,a.y-e.y);
  if(isRangedLikeRole(a, rb)){
    const sr=typeof getAllyAutoCombatStandoffRange==='function'?getAllyAutoCombatStandoffRange(a):200;
    if(d>sr*0.82) return false;
    if(typeof hasLOS==='function'&&!hasLOS(a.x,a.y,e.x,e.y)) return false;
    return true;
  }
  if(isTankLikeRole(a, rb)||rb==='Warrior'||rb==='Melee'){
    const sr=typeof getAllyMeleeFightRange==='function'?getAllyMeleeFightRange(a):40;
    return d<=Math.max(26, sr*0.9);
  }
  return null;
}
function villageRangedShouldKite(a,e,roleBase){
  if(!earlyPositionBattle()||!a||!e||a.onHold) return false;
  const rb=roleBaseOf(a, roleBase);
  if(!isRangedLikeRole(a, rb)) return false;
  const sr=typeof getAllyAutoCombatStandoffRange==='function'?getAllyAutoCombatStandoffRange(a):200;
  return Math.hypot(a.x-e.x,a.y-e.y)<sr*0.48;
}
function villageKitePoint(a,e){
  const dx=a.x-e.x, dy=a.y-e.y;
  const n=Math.hypot(dx,dy)||1;
  const sr=typeof getAllyAutoCombatStandoffRange==='function'?getAllyAutoCombatStandoffRange(a):200;
  return {x:e.x+(dx/n)*sr*0.86, y:e.y+(dy/n)*sr*0.86};
}

function escapeHubText(s){
  return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
function removeHubChoiceCard(){
  const el=document.getElementById('hub-return-choice');
  if(el) el.remove();
}
function listHubReturnChoices(){
  const out=[];
  if(typeof canOfferRoadWatcherInSettlementHub==='function'&&canOfferRoadWatcherInSettlementHub()&&!_roadWatcherHubFlowActive){
    out.push({
      kind:'story',
      title:'길 위의 목격자',
      body:'정복한 들판 가에 누군가 앉아 있습니다. 이번 귀환에 들을 이야기는 이것입니다.',
      button:'이야기 듣기',
      run:function(){
        removeHubChoiceCard();
        if(typeof startRoadWatcherHubNarrative==='function') startRoadWatcherHubNarrative();
      }
    });
  }
  let promo=null;
  if(Array.isArray(_classPromoQueue)&&_classPromoQueue.length) promo=_classPromoQueue[0];
  if(!promo&&typeof allies!=='undefined'&&typeof canUnitPromote==='function'){
    promo=(allies||[]).find(function(a){ return a&&!a.dead&&!a.permanentlyDead&&canUnitPromote(a); })||null;
  }
  if(promo){
    out.push({
      kind:'promote',
      title:'보직을 정할 사람',
      body:promo.name+'의 자리를 정하면 다음 전투의 대형이 달라집니다.',
      button:'보직 정하기',
      run:function(){
        if(Array.isArray(_classPromoQueue)){
          const i=_classPromoQueue.indexOf(promo);
          if(i>=0) _classPromoQueue.splice(i,1);
        }
        removeHubChoiceCard();
        if(typeof showClassModal==='function') showClassModal(promo);
      }
    });
  }
  const sp=(typeof allies!=='undefined'&&allies)?allies.find(function(a){
    return a&&!a.permanentlyDead&&(Number(a.skillPoints)||0)>0;
  }):null;
  if(sp&&typeof hasSeenSkillPointIntro==='function'&&!hasSeenSkillPointIntro()){
    out.push({
      kind:'skill',
      title:'스킬 포인트',
      body:sp.name+'이 한 단계 강해질 수 있습니다.',
      button:'스킬 보기',
      run:function(){
        removeHubChoiceCard();
        window._hubAllowSkillIntro=true;
        if(typeof showSkillPointIntroModal==='function') showSkillPointIntroModal(sp);
        window._hubAllowSkillIntro=false;
      }
    });
  }
  return out;
}
function pickHubReturnChoice(){
  const list=listHubReturnChoices();
  for(let i=0;i<list.length;i++){
    if(!_hubDismissedKinds.has(list[i].kind)) return list[i];
  }
  return {kind:'depart'};
}
function showHubChoiceCard(choice){
  let el=document.getElementById('hub-return-choice');
  if(!el){
    el=document.createElement('div');
    el.id='hub-return-choice';
    el.setAttribute('role','dialog');
    el.style.cssText='position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:14000;width:min(420px,calc(100% - 20px));background:#0f172a;border:1px solid #334155;border-radius:10px;padding:12px 14px;color:#e2e8f0;font-family:inherit;';
    document.body.appendChild(el);
  }
  el.innerHTML=
    '<div style="font-weight:700;color:#fde68a;margin-bottom:4px">'+escapeHubText(choice.title)+'</div>'+
    '<div style="font-size:12px;line-height:1.45;color:#cbd5e1;margin-bottom:10px">'+escapeHubText(choice.body)+'</div>'+
    '<div style="display:flex;gap:8px">'+
      '<button type="button" data-go style="flex:2;padding:8px;background:#1a5c32;color:#fff;border:0;border-radius:6px;font-weight:700;cursor:pointer">'+escapeHubText(choice.button)+'</button>'+
      '<button type="button" data-skip style="flex:1;padding:8px;background:#1e293b;color:#e2e8f0;border:1px solid #374151;border-radius:6px;cursor:pointer">지금은 출발</button>'+
    '</div>';
  const go=el.querySelector('[data-go]');
  const skip=el.querySelector('[data-skip]');
  if(go) go.addEventListener('click', function(e){ e.stopPropagation(); choice.run(); });
  if(skip) skip.addEventListener('click', function(e){
    e.stopPropagation();
    if(choice.kind==='story') _skipRoadWatcherHubInterceptionOnce=true;
    _hubDismissedKinds.add(choice.kind);
    applyHubReturnFocus();
  });
}
function collapseHubDock(){
  const dock=document.getElementById('settlement-hub-battle-dock');
  if(!dock||dock.style.display==='none') return;
  const rec=typeof getHubRecommendedBattleZoneId==='function'?getHubRecommendedBattleZoneId():null;
  for(let i=0;i<3;i++){
    const slot=document.getElementById('settlement-hub-slot-'+i);
    if(!slot) continue;
    const btn=slot.querySelector('[data-zid]');
    const zid=btn?btn.getAttribute('data-zid'):'';
    const show=window._hubDockExpanded||!rec||String(zid)===String(rec);
    slot.style.display=show?'':'none';
  }
  let exp=document.getElementById('hub-dock-expand');
  if(window._hubDockExpanded){
    if(exp) exp.remove();
  }else if(rec&&!exp){
    exp=document.createElement('button');
    exp.id='hub-dock-expand';
    exp.type='button';
    exp.textContent='다른 전투지';
    exp.style.cssText='position:absolute;right:8px;bottom:8px;z-index:5;padding:4px 8px;font-size:11px;background:#0f172a;color:#e2e8f0;border:1px solid #334155;border-radius:6px;cursor:pointer;';
    exp.addEventListener('click', function(e){
      e.stopPropagation();
      window._hubDockExpanded=true;
      exp.remove();
      for(let i=0;i<3;i++){
        const slot=document.getElementById('settlement-hub-slot-'+i);
        if(slot) slot.style.display='';
      }
      if(typeof layoutSettlementHubBattleDock==='function') layoutSettlementHubBattleDock();
      if(typeof syncSettlementHubMapBottomHint==='function') syncSettlementHubMapBottomHint();
    });
    dock.appendChild(exp);
  }
  if(typeof layoutSettlementHubBattleDock==='function') layoutSettlementHubBattleDock();
}
function applyHubReturnFocus(){
  if(typeof _settlementHubCeremonyActive==='undefined'||!_settlementHubCeremonyActive||_settlementHubPhase!=='hub') return;
  const choice=pickHubReturnChoice();
  const dock=document.getElementById('settlement-hub-battle-dock');
  if(!choice||choice.kind==='depart'){
    window._hubReturnLocked=false;
    removeHubChoiceCard();
    if(dock){
      dock.style.display='block';
      dock.setAttribute('aria-hidden','false');
    }
    collapseHubDock();
    if(typeof syncSettlementHubMapBottomHint==='function') syncSettlementHubMapBottomHint();
    return;
  }
  window._hubReturnLocked=true;
  if(typeof pauseSettlementHubIdleCountdown==='function') pauseSettlementHubIdleCountdown();
  if(dock){
    dock.style.display='none';
    dock.setAttribute('aria-hidden','true');
  }
  showHubChoiceCard(choice);
  if(typeof syncSettlementHubMapBottomHint==='function') syncSettlementHubMapBottomHint();
}

function exportKingdomSave(){
  if(typeof buildSavePayload!=='function') return;
  const payload=buildSavePayload();
  const blob=new Blob([JSON.stringify(payload)],{type:'application/json'});
  const a=document.createElement('a');
  const url=URL.createObjectURL(blob);
  const d=new Date();
  const p=function(n){ return String(n).padStart(2,'0'); };
  a.href=url;
  a.download='kingdom-save-'+d.getFullYear()+p(d.getMonth()+1)+p(d.getDate())+'-'+p(d.getHours())+p(d.getMinutes())+'.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(function(){ URL.revokeObjectURL(url); }, 1500);
  if(typeof alog==='function') alog('저장 파일을 내려받았습니다.');
}
function importKingdomSaveFile(file){
  if(!file) return;
  const reader=new FileReader();
  reader.onload=function(){
    try{
      const data=JSON.parse(String(reader.result||''));
      if(!data||typeof data!=='object'||!Array.isArray(data.allies)) throw new Error('format');
      if(typeof hydrateGameState!=='function'||!hydrateGameState(data)) throw new Error('hydrate');
      if(typeof applyPhaseSettings==='function') applyPhaseSettings(false);
      if(typeof syncZoneCatalog==='function') syncZoneCatalog();
      if(typeof buildMap==='function') buildMap();
      if(typeof spawnEnemies==='function') spawnEnemies();
      if(typeof setChronicleAreaLabel==='function') setChronicleAreaLabel(currentZone);
      if(typeof enterPlacement==='function') enterPlacement();
      if(typeof renderGarrisonBar==='function') renderGarrisonBar();
      if(typeof renderAllyPanel==='function') renderAllyPanel();
      if(typeof markDirty==='function') markDirty();
      if(typeof alog==='function') alog('저장 파일을 불러왔습니다.');
    }catch(e){
      if(typeof alog==='function') alog('저장 파일을 읽지 못했습니다.');
    }
  };
  reader.readAsText(file);
}

(function wireHubReturn(){
  if(typeof openSettlementHubCeremony==='function'){
    const orig=openSettlementHubCeremony;
    openSettlementHubCeremony=function(zid, opts){
      _hubDismissedKinds=new Set();
      window._hubDockExpanded=false;
      window._hubReturnLocked=false;
      orig(zid, opts);
      applyHubReturnFocus();
    };
  }
  if(typeof mountSettlementHubBattleSidePanels==='function'){
    const origMount=mountSettlementHubBattleSidePanels;
    mountSettlementHubBattleSidePanels=function(zid){
      origMount(zid);
      if(typeof _settlementHubCeremonyActive!=='undefined'&&_settlementHubCeremonyActive) applyHubReturnFocus();
    };
  }
  if(typeof _restoreAfterSettlementHub==='function'){
    const origRestore=_restoreAfterSettlementHub;
    _restoreAfterSettlementHub=function(){
      window._hubReturnLocked=false;
      window._hubDockExpanded=false;
      removeHubChoiceCard();
      const exp=document.getElementById('hub-dock-expand');
      if(exp) exp.remove();
      origRestore();
    };
  }
  if(typeof closeSkillPointIntroModal==='function'){
    const origClose=closeSkillPointIntroModal;
    closeSkillPointIntroModal=function(){
      origClose();
      if(typeof _settlementHubCeremonyActive!=='undefined'&&_settlementHubCeremonyActive&&_settlementHubPhase==='hub') applyHubReturnFocus();
    };
  }
})();
