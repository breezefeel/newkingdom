// 전투지·적·보스·스킬 트리. index.html 보다 먼저 로드.
const ZONE_DIFF_MULTS={
  1:{mult:1.00,label:'I',enemyCountMult:1.0,powerMult:1.00},
  2:{mult:1.30,label:'II',enemyCountMult:1.2,powerMult:1.30},
  3:{mult:1.70,label:'III',enemyCountMult:1.5,powerMult:1.70},
  4:{mult:2.20,label:'IV',enemyCountMult:1.9,powerMult:2.20},
  5:{mult:2.80,label:'V',enemyCountMult:2.4,powerMult:2.80},
};
function getZoneDisplayName(zone){
  if(!zone) return '';
  const tier=zone.diffTier||1;
  const label=(ZONE_DIFF_MULTS[tier]||ZONE_DIFF_MULTS[1]).label;
  const base=String(zone.name||'').replace(/\s[IVX]+$/,'').trim();
  return `${base} ${label}`;
}

// ── 동물 적 데이터 (TASK 5: 집합소 hunt/river/wilds 구성) ──
const ANIMAL_ENEMIES={
  rabbit:{id:'rabbit',name:'🐇 토끼',role:null,baseHp:80,baseAtk:8,baseSpd:2.8,baseDef:0.02,behavior:'flee', animalType:'herbivore', color:'#4ade80',fleeRange:200},
  deer:{id:'deer',name:'🦌 사슴',role:null,baseHp:150,baseAtk:12,baseSpd:2.4,baseDef:0.03,behavior:'flee', animalType:'herbivore', color:'#4ade80',fleeRange:180},
  boar:{id:'boar',name:'🐗 멧돼지',role:'Melee',baseHp:280,baseAtk:35,baseSpd:1.8,baseDef:0.10,behavior:'null', animalType:'omnivore', color:'#fbbf24',flees: false,fleeRange:220},
  wolf:{id:'wolf',name:'🐺 늑대',role:'Melee',baseHp:220,baseAtk:45,baseSpd:2.2,baseDef:0.08,behavior:'pack_hunt', animalType:'predator', color:'#f87171'},
  wolf_alpha:{id:'wolf_alpha',name:'🐺 알파 늑대',role:'Warrior',baseHp:380,baseAtk:72,baseSpd:2.0,baseDef:0.12,behavior:'pack_hunt', animalType:'predator', color:'#f87171',isAlpha:true},
  bear:{id:'bear',name:'🐻 곰',role:'Tank',baseHp:600,baseAtk:80,baseSpd:1.3,baseDef:0.25,behavior:'territory', animalType:'predator', color:'#f87171',territoryRadius:180},
  tiger:{id:'tiger',name:'🐯 호랑이',role:'Warrior',baseHp:450,baseAtk:100,baseSpd:2.0,baseDef:0.15,behavior:'ambush', animalType:'predator', color:'#f87171',ambushRange:250},
  otter:{id:'otter',name:'🦦 서식지 수달',role:'Melee',baseHp:175,baseAtk:34,baseSpd:2.0,baseDef:0.08,behavior:'pack_hunt', animalType:'predator', color:'#f87171',aquatic:true},
  heron:{id:'heron',name:'🦢 길든 왜가리',role:'Ranged',baseHp:195,baseAtk:46,baseSpd:1.55,baseDef:0.08,behavior:'territory', animalType:'predator', color:'#f87171',territoryRadius:130},
  crocodile:{id:'crocodile',name:'🐊 악어',role:'Tank',baseHp:550,baseAtk:95,baseSpd:0.9,baseDef:0.28,behavior:'ambush', animalType:'predator', color:'#f87171',ambushRange:220,aquatic:true},
  hippo:{id:'hippo',name:'🦛 하마',role:'Tank',baseHp:900,baseAtk:120,baseSpd:0.8,baseDef:0.32,behavior:'territory', animalType:'predator', color:'#f87171',territoryRadius:200,aquatic:true},
  boar_pack:{id:'boar_pack',name:'🐗 멧돼지 무리',role:'Melee',baseHp:300,baseAtk:55,baseSpd:1.7,baseDef:0.12,behavior:'pack_hunt', animalType:'predator', color:'#f87171'},

  // ── 얕은 강가 추가 5종 ──
  snapping_turtle:{id:'snapping_turtle',name:'🐢 자라',role:'Tank',baseHp:480,baseAtk:60,baseSpd:0.7,baseDef:0.30,behavior:'territory', animalType:'predator', color:'#f87171',territoryRadius:140,aquatic:true},
  river_snake:{id:'river_snake',name:'🐍 강뱀',role:'Melee',baseHp:250,baseAtk:70,baseSpd:2.1,baseDef:0.07,behavior:'ambush', animalType:'predator', color:'#f87171',ambushRange:180,aquatic:true},
  pelican:{id:'pelican',name:'🦩 공격적 사다새',role:'Ranged',baseHp:210,baseAtk:52,baseSpd:1.45,baseDef:0.08,behavior:'territory', animalType:'predator', color:'#f87171',territoryRadius:125},
  giant_catfish:{id:'giant_catfish',name:'🐟 대형 메기',role:'Warrior',baseHp:420,baseAtk:85,baseSpd:1.2,baseDef:0.14,behavior:'pack_hunt', animalType:'predator', color:'#f87171',aquatic:true},
  river_boar:{id:'river_boar',name:'🐗 강가 멧돼지',role:'Melee',baseHp:350,baseAtk:65,baseSpd:1.6,baseDef:0.11,behavior:'pack_hunt', animalType:'predator', color:'#f87171'},

  // ── 얕은 숲 추가 5종 ──
  lynx:{id:'lynx',name:'🐆 스라소니',role:'Warrior',baseHp:340,baseAtk:88,baseSpd:2.3,baseDef:0.10,behavior:'ambush', animalType:'predator', color:'#f87171',ambushRange:210},
  wild_ox:{id:'wild_ox',name:'🐂 들소',role:'Tank',baseHp:700,baseAtk:75,baseSpd:1.1,baseDef:0.22,behavior:'territory', animalType:'predator', color:'#f87171',territoryRadius:160},
  wolf_pack:{id:'wolf_pack',name:'🐺 늑대 무리',role:'Melee',baseHp:260,baseAtk:52,baseSpd:2.4,baseDef:0.08,behavior:'pack_hunt', animalType:'predator', color:'#f87171'},
  forest_viper:{id:'forest_viper',name:'🐍 숲 독사',role:'Ranged',baseHp:190,baseAtk:78,baseSpd:1.8,baseDef:0.06,behavior:'ambush', animalType:'predator', color:'#f87171',ambushRange:160},
  giant_boar:{id:'giant_boar',name:'🐗 거대 멧돼지',role:'Tank',baseHp:780,baseAtk:95,baseSpd:1.0,baseDef:0.26,behavior:'territory', animalType:'predator', color:'#f87171',territoryRadius:150},
};
const HUNT_COMPOSITION={
  1:{herbivore:0.70,predator:0.30},
  2:{herbivore:0.50,predator:0.50},
  3:{herbivore:0.30,predator:0.70},
  4:{herbivore:0.10,predator:0.90},
  5:{herbivore:0.00,predator:1.00},
};
const HUNT_HERBIVORE_POOL=['rabbit','deer','boar'];
const HUNT_PREDATOR_POOL=['wolf','wolf_alpha','bear','tiger'];
const RIVER_ENEMY_POOL=['otter','heron','crocodile','hippo','snapping_turtle','river_snake','pelican','giant_catfish','river_boar'];
const WILDS_ENEMY_POOL=['boar_pack','bear','wolf','tiger','lynx','wild_ox','wolf_pack','forest_viper','giant_boar'];

// ── 전투 장소 ──
// tier: hunt=초식동물, pred=맹수, bandit=산적/강도, raider=약탈자, army=군대
const ZONES={
  hunt:   {id:'hunt',   name:'🌿 근처 들판', diffTier:1, conceptPhase:0, diffMult:1.0, tier:'hunt',   terrain:'hunt',  color:'#2d7a3a',
           rFood:5, rWood:2, rStone:1, rGold:1, rIron:0, rHerb:0, rDiamond:0,
           desc:'초원의 초식동물. 집합소 전투지 — 식량·나무·돌·금.', finalStage:15, minLv:0, unlockPhase:0},
  river:  {id:'river',  name:'🌊 얕은 강가', diffTier:1, conceptPhase:0, diffMult:1.0, tier:'hunt',   terrain:'hunt',  color:'#2d5a7a',
           rFood:4, rWood:3, rStone:1, rGold:1, rIron:0, rHerb:0, rDiamond:0,
           desc:'강가의 초식동물. 식량·나무·돌·금화.', finalStage:15, minLv:15, unlockPhase:0},
  wilds:  {id:'wilds',  name:'🌲 얕은 숲', diffTier:1, conceptPhase:0, diffMult:1.0, tier:'pred',   terrain:'pred',  color:'#a05a00',
           rFood:3, rWood:4, rStone:2, rGold:1, rIron:0, rHerb:0, rDiamond:0,
           desc:'맹수들의 영역. 나무·돌·식량·금화.', finalStage:15, minLv:21, unlockPhase:0},
  bandit: {id:'bandit', name:'⚔️ 깊은 들판', diffTier:1, conceptPhase:1, diffMult:1.0, tier:'bandit', terrain:'bandit',color:'#7b1d1d',
           rFood:0, rWood:0, rStone:0, rGold:2, rIron:0, rCopper:2, rHerb:1, rDiamond:0, rWarSupply:0, rManaCrystal:0,
           desc:'산적의 소굴. 마을 전투지 — 약초·구리·금화.', finalStage:15, minLv:36, unlockPhase:1},
  ruins:  {id:'ruins',  name:'🌫 안개 강변', diffTier:1, conceptPhase:1, diffMult:1.0, tier:'raider', terrain:'raider',color:'#7c6020',
           rFood:0, rWood:0, rStone:0, rGold:3, rIron:0, rCopper:3, rHerb:2, rDiamond:0, rWarSupply:0, rManaCrystal:0,
           desc:'폐허의 약탈자. 마을 전투지 — 약초·구리·금화.', finalStage:15, minLv:48, unlockPhase:1},
  mine:   {id:'mine',   name:'🌲 울창한 숲', diffTier:1, conceptPhase:1, diffMult:1.0, tier:'bandit', terrain:'bandit',color:'#546e7a',
           rFood:0, rWood:0, rStone:0, rGold:2, rIron:0, rCopper:6, rHerb:1, rDiamond:0, rWarSupply:0, rManaCrystal:0,
           desc:'광산 괴물. 마을 전투지 — 약초·구리·금화.', finalStage:15, minLv:63, unlockPhase:1},
  raider: {id:'raider', name:'🏚 폐허 들판', diffTier:1, conceptPhase:2, diffMult:1.0, tier:'army',   terrain:'army',  color:'#c0392b',
           rFood:0, rWood:0, rStone:0, rGold:4, rIron:2, rHerb:0, rCopper:0, rDiamond:0, rWarSupply:1, rManaCrystal:0,
           desc:'약탈자 군단. 도시 전투지 — 강철·전쟁보급품·금화.', finalStage:15, minLv:84, unlockPhase:2},
  castle: {id:'castle', name:'⛰ 산적 협곡', diffTier:1, conceptPhase:2, diffMult:1.0, tier:'army',   terrain:'raider',color:'#6c2899',
           rFood:0, rWood:0, rStone:0, rGold:6, rIron:3, rHerb:0, rCopper:0, rDiamond:0, rWarSupply:2, rManaCrystal:0,
           desc:'적 세력의 요새. 도시 전투지 — 강철·전쟁보급품·금화.', finalStage:15, minLv:99, unlockPhase:2},
  crystal:{id:'crystal',name:'🏰 고원 요새', diffTier:1, conceptPhase:2, diffMult:1.0, tier:'army',   terrain:'pred',  color:'#00acc1',
           rFood:0, rWood:0, rStone:0, rGold:2, rIron:3, rHerb:0, rCopper:0, rDiamond:0, rWarSupply:4, rManaCrystal:0,
           desc:'마력 요새. 도시 전투지 — 강철·전쟁보급품·금화.', finalStage:15, minLv:117, unlockPhase:2},
  warzone:{id:'warzone',name:'☠️ 황폐한 평야', diffTier:1, conceptPhase:3, diffMult:1.0, tier:'army',  terrain:'army',  color:'#8b1a1a',
           rFood:0, rWood:0, rStone:0, rGold:6, rIron:0, rHerb:0, rCopper:0, rDiamond:8, rWarSupply:0, rManaCrystal:2,
           desc:'왕국 주변 전투지. 다이아몬드·마력결정·금화.', finalStage:15, minLv:138, unlockPhase:3},
  citadel:{id:'citadel',name:'🩸 저주받은 강곡', diffTier:1, conceptPhase:3, diffMult:1.0, tier:'army',terrain:'raider',color:'#b7950b',
           rFood:0, rWood:0, rStone:0, rGold:6, rIron:0, rHerb:0, rCopper:0, rDiamond:10, rWarSupply:0, rManaCrystal:3,
           desc:'왕국 주변 전투지. 다이아몬드·마력결정·금화.', finalStage:15, minLv:156, unlockPhase:3},
  void:   {id:'void',   name:'🌌 영원의 숲', diffTier:1, conceptPhase:3, diffMult:1.0, tier:'army',   terrain:'army',  color:'#a855f7',
           rFood:0, rWood:0, rStone:0, rGold:7, rIron:0, rHerb:0, rCopper:0, rDiamond:12, rWarSupply:0, rManaCrystal:4,
           desc:'왕국 주변 전투지. 다이아몬드·마력결정·금화.', finalStage:15, minLv:174, unlockPhase:3},
};
Object.keys(ZONES).forEach(k=>{
  const z=ZONES[k];
  z.name=getZoneDisplayName(z);
});
const MODULE6_ZONE_CATALOG={
  hunt:{name:'🌿 근처 들판',desc:'집합소 전투지. 식량·나무·돌·금.'},
  river:{name:'🌊 얕은 강가',desc:'집합소 전투지. 식량·나무·돌·금.'},
  wilds:{name:'🌲 얕은 숲',desc:'집합소 전투지. 식량·나무·돌·금.'},
  bandit:{name:'⚔️ 깊은 들판',desc:'마을 전투지. 약초·구리·금화.'},
  ruins:{name:'🌫 안개 강변',desc:'마을 전투지. 약초·구리·금화.'},
  mine:{name:'🌲 울창한 숲',desc:'마을 전투지. 약초·구리·금화.'},
  raider:{name:'🏚 폐허 들판',desc:'도시 전투지. 강철·전쟁보급품·금화.'},
  castle:{name:'⛰ 산적 협곡',desc:'도시 전투지. 강철·전쟁보급품·금화.'},
  crystal:{name:'🏰 고원 요새',desc:'도시 전투지. 강철·전쟁보급품·금화.'},
  warzone:{name:'☠️ 황폐한 평야',desc:'왕국 전투지. 다이아몬드·마력결정·금화.'},
  citadel:{name:'🩸 저주받은 강곡',desc:'왕국 전투지. 다이아몬드·마력결정·금화.'},
  void:{name:'🌌 영원의 숲',desc:'왕국 전투지. 다이아몬드·마력결정·금화.'},
};
function syncZoneCatalog(){
  Object.entries(MODULE6_ZONE_CATALOG).forEach(([id,v])=>{
    if(!ZONES[id])return;
    if(v.desc)ZONES[id].desc=v.desc;
    if(v.name){
      ZONES[id].name=v.name.replace(/\s[IVX]+$/,'').trim();
      ZONES[id].name=getZoneDisplayName(ZONES[id]);
    }
  });
}

// ══ v10 통합 DB: 스킬 트리·시야·자원·건설 시각·적 가족(메타)·보스(메타) ══
const SKILL_TREES={
  Refugee:{name:'피난민',icon:'🛡️',description:'아직 아무것도 없는 시작점',skills:{
    survivalInstinct:{name:'생존 본능',maxLv:5,effect:'받는 피해 -{0}%',values:[8,15,23,32,45],description:'고난 속에서 단련된 생존 감각'},
    quickStep:{name:'재빠른 걸음',maxLv:4,effect:'이동속도 +{0}%',values:[12,22,33,48],description:'위험을 피해 빠르게 이동'},
    basicStrike:{name:'강타',maxLv:5,effect:'기본 공격력 +{0}%',values:[10,18,27,37,50],description:'있는 힘껏 내리치기'},
  }},
  Warrior:{name:'전사',icon:'⚔️',description:'근접 전투의 정점',skills:{
    powerSlash:{name:'파워 슬래시',maxLv:5,effect:'범위 공격 피해 +{0}%',values:[15,28,42,58,80],description:'큰 검을 휘둘러 주변을 베기'},
    ironSkin:{name:'강철 피부',maxLv:5,effect:'방어력 +{0}%',values:[12,22,34,48,65],description:'몸을 단단하게 보호'},
    taunt:{name:'도발',maxLv:3,effect:'적 시선 끌기 + 아군 보호',values:[1,2,3],description:'적의 공격을 대신 받음'},
    berserk:{name:'광전사',maxLv:4,effect:'공격력 +{0}% (방어력 -15%)',values:[25,40,60,90],description:'분노를 폭발시켜 강해짐'},
  }},
  Archer:{name:'궁수',icon:'🏹',description:'원거리 전문가',skills:{
    focusedShot:{name:'집중 사격',maxLv:5,effect:'단일 대상 피해 +{0}%',values:[18,32,48,65,88],description:'한 점을 꿰뚫는 화살'},
    rapidFire:{name:'연사',maxLv:4,effect:'공격 속도 +{0}%',values:[15,25,38,55],description:'빠르게 여러 발 쏘기'},
    piercingArrow:{name:'관통 화살',maxLv:4,effect:'관통 피해 +{0}%',values:[20,35,52,75],description:'적을 뚫고 나가는 화살'},
    eagleEye:{name:'독수리의 눈',maxLv:3,effect:'시야 +{0}% + 치명타 확률 증가',values:[15,25,40],description:'먼 거리도 정확히 조준'},
  }},
  Mage:{name:'마법사',icon:'🔥',description:'강력한 원거리 마법 딜러',skills:{
    fireBolt:{name:'화염구',maxLv:5,effect:'범위 마법 피해 +{0}%',values:[20,35,52,72,95],description:'불의 구를 날림'},
    manaShield:{name:'마나 보호막',maxLv:4,effect:'받는 피해 -{0}%',values:[18,30,45,65],description:'마나로 몸을 보호'},
    chainLightning:{name:'연쇄 번개',maxLv:3,effect:'연쇄 공격 (최대 {0}명)',values:[3,4,5],description:'적을 연속으로 타격'},
    arcaneBurst:{name:'비전 폭발',maxLv:4,effect:'강력한 단일 폭발 피해 +{0}%',values:[30,50,75,110],description:'집중된 마력 폭발'},
  }},
  Healer:{name:'치유사',icon:'💚',description:'아군을 지키는 지원형',skills:{
    healingLight:{name:'치유의 빛',maxLv:5,effect:'아군 HP 회복 +{0}%',values:[25,40,60,85,120],description:'빛으로 상처를 치료'},
    groupHeal:{name:'집단 치유',maxLv:3,effect:'주변 아군 전체 회복',values:[1,2,3],description:'범위 치유'},
    protectionAura:{name:'보호의 오라',maxLv:4,effect:'주변 아군 방어력 +{0}%',values:[10,18,28,42],description:'아군을 보호하는 빛'},
    revive:{name:'부활',maxLv:2,effect:'죽은 아군 1명 부활 (쿨타임 길음)',values:[1,1],description:'전투 중 한 번의 기적'},
  }},
  Rogue:{name:'도적',icon:'🗡️',description:'은밀하고 빠른 암살자',skills:{
    backstab:{name:'기습',maxLv:5,effect:'등 뒤 공격 시 피해 +{0}%',values:[25,45,70,100,140],description:'등 뒤를 노림'},
    stealth:{name:'은폐',maxLv:3,effect:'시야에서 사라짐 (지속 {0}초)',values:[6,9,13],description:'적의 시야를 벗어남'},
    poisonDagger:{name:'독 단검',maxLv:4,effect:'지속 독 피해 +{0}%',values:[15,28,45,70],description:'독을 바른 단검'},
    shadowStep:{name:'그림자 걸음',maxLv:4,effect:'이동속도 +{0}% + 회피율 증가',values:[18,30,45,65],description:'그림자처럼 빠르게'},
  }},
  Knight:{name:'기사',icon:'🛡️',description:'방어와 돌격의 균형',skills:{
    shieldBash:{name:'방패 강타',maxLv:5,effect:'방패로 적 기절 + 피해',values:[1,2,3,4,5],description:'적을 기절시킴'},
    holyArmor:{name:'성스러운 갑옷',maxLv:5,effect:'방어력 +{0}% + 피해 반사',values:[15,25,38,55,80],description:'신성한 보호'},
    charge:{name:'돌진',maxLv:4,effect:'직선 범위 돌진 공격',values:[30,50,75,110],description:'적진을 돌파'},
    leadership:{name:'지휘',maxLv:3,effect:'주변 아군 공격력 +{0}%',values:[8,15,25],description:'아군을 이끌음'},
  }},
  Berserker:{name:'광전사',icon:'🔥',description:'공격력 극한 추구',skills:{
    rageStrike:{name:'분노의 일격',maxLv:5,effect:'공격력 +{0}% (HP 낮을수록 증가)',values:[20,35,55,80,120],description:'피가 적을수록 강해짐'},
    bloodlust:{name:'피의 갈망',maxLv:4,effect:'공격 시 HP 흡혈 +{0}%',values:[8,15,25,40],description:'적의 피를 빨아먹음'},
    whirlwind:{name:'회오리 베기',maxLv:4,effect:'주변 전체 강력 공격',values:[25,45,70,100],description:'회전하며 베기'},
    lastStand:{name:'최후의 저항',maxLv:3,effect:'HP 1 이하에서 5초간 무적',values:[1,1,1],description:'죽지 않는 투지'},
  }},
  Elementalist:{name:'정령술사',icon:'🌿',description:'자연과 정령의 힘',skills:{
    summonElemental:{name:'정령 소환',maxLv:4,effect:'정령 1마리 소환 (지속)',values:[1,2,3,4],description:'정령을 불러냄'},
    natureBless:{name:'자연의 축복',maxLv:5,effect:'주변 아군 HP 회복 + 공격력 증가',values:[12,20,30,42,60],description:'자연의 힘을 나눔'},
    elementalStorm:{name:'정령의 폭풍',maxLv:4,effect:'범위 속성 피해',values:[30,50,75,110],description:'불·물·바람 폭풍'},
    harmony:{name:'조화',maxLv:3,effect:'모든 정령 효과 강화',values:[20,35,55],description:'정령들과 하나가 됨'},
  }},
  Commander:{name:'지휘관',icon:'🏳️',description:'아군 전체를 이끄는 리더',skills:{
    battleCry:{name:'전투 함성',maxLv:4,effect:'아군 전체 공격력 +{0}%',values:[12,22,35,50],description:'아군 사기를 높임'},
    formation:{name:'진형 지휘',maxLv:5,effect:'아군 방어력 +{0}%',values:[10,18,28,40,58],description:'완벽한 진형 유지'},
    rally:{name:'집결',maxLv:3,effect:'죽은 아군 1명 즉시 부활 (1회)',values:[1,1,1],description:'전장을 재정비'},
    supremeCommand:{name:'최고 지휘',maxLv:3,effect:'전체 아군 능력치 +{0}%',values:[8,15,25],description:'왕국을 이끄는 지휘'},
  }},
};

const CONSTRUCTION_VISUALS={
  plain_01:{1:'땅 고르기 + 나무 말뚝 + 작은 천막',4:'통나무 울타리 + 간단한 밭',8:'작은 창고 + 농경지 초안',12:'목조 막사 + 깃발',15:'완성된 농경 거점 (밭 + 창고 + 울타리)'},
  river_01:{1:'강변에 나무 말뚝 + 천막',4:'돌을 쌓아 만든 낮은 둑',8:'수차 + 작은 돌 창고',12:'석조 보강 + 작은 망루',15:'완성된 강가 거점 (수차 + 돌 창고 + 방책)'},
  forest_01:{1:'숲을 약간 개간 + 천막',4:'통나무 울타리 + 나무를 베어낸 공터',8:'목재소 + 나무 저장 공간',12:'큰 통나무 건물 + 깃발',15:'완성된 숲 거점 (목재소 + 저장고 + 울타리)'},
  herb_01:{1:'언덕에 천막 + 약초 표시',4:'나무 울타리 + 약초밭 조성',8:'물약 작업대 + 작은 정원',12:'약초 창고 + 간단한 연구소',15:'완성된 약초 거점 (약초 정원 + 물약 작업대)'},
  copper_01:{1:'갱도 입구 표시 + 천막',4:'나무 지지대 + 울타리',8:'작은 제련소 + 광석 더미',12:'석조 보강 + 광산 입구 확장',15:'완성된 광산 거점 (제련소 + 갱도)'},
  ruin_01:{1:'폐허 청소 + 천막',4:'목책 + 잔해 정리',8:'작은 오두막 + 광장 초안',12:'석조 기반 + 깃발',15:'재건된 마을 광장 (오두막 + 광장)'},
  iron_01:{1:'산악 입구 + 천막',4:'나무 지지대 + 울타리',8:'용광로 기초 + 광석 창고',12:'석조 보강 + 대형 제련소',15:'완성된 철광산 거점 (용광로 + 대장간)'},
  fort_01:{1:'폐허 청소 + 천막',4:'목책 + 초소',8:'막사 + 보급 창고',12:'성벽 복원 + 탑',15:'복원된 전초기지 (성벽 + 막사)'},
  ancient_01:{1:'고대 석판 청소 + 천막',4:'울타리 + 기초 정리',8:'고대 건물 복원 시작',12:'마법진 + 석조 구조물',15:'왕국 기초석 + 깃발'},
  magic_01:{1:'숲 개간 + 마법진 표시',4:'마법 울타리 + 수정석',8:'마법탑 기초',12:'마력 결정 + 탑 보강',15:'완성된 마법탑 거점'},
  ruin_ancient:{1:'유적 청소 + 천막',4:'봉인석 + 울타리',8:'내부 통로 개방',12:'고대 석판 + 보물고 기초',15:'봉인 해제된 유적 + 보물고'},
  border_01:{1:'요새 잔해 청소',4:'성벽 복구 시작',8:'탑 + 병영',12:'대형 성벽 + 깃발',15:'완성된 왕국 국경 성벽'},
};

let _constructionVizCacheKey='';
function getConstructionMilestoneDay(day){
  const d=Math.min(15,Math.max(1,Number(day)||1));
  const m=[1,4,8,12,15];
  let pick=1;
  for(let i=0;i<m.length;i++) if(d>=m[i]) pick=m[i];
  return pick;
}
function getConstructionVisualText(zid,day){
  const z10=typeof getZoneV10Id==='function'?getZoneV10Id(zid):'plain_01';
  const cv=typeof CONSTRUCTION_VISUALS!=='undefined'&&CONSTRUCTION_VISUALS&&CONSTRUCTION_VISUALS[z10];
  if(!cv) return '';
  const pk=getConstructionMilestoneDay(day);
  const base=String(cv[pk]||'');
  const d=Math.min(15,Math.max(1,Number(day)||1));
  if(d!==5&&d!==10&&d!==15) return base;
  const boss=(typeof getMilestoneBossLabelForZone==='function')?getMilestoneBossLabelForZone(zid,d):'';
  if(d===5) return '우두머리의 자리. '+(boss||base);
  if(d===10) return '거점이 성채처럼 굳는다. '+(boss||base);
  return '거점이 모습을 갖췄다. 마지막 우두머리. '+(boss||base);
}
function updateConstructionVizRow(){
  // 상단 보라 건설 안내줄 제거: 거점 연출은 맵(이모지) + drawConstructionStatusMiniHud 로만 안내
}

const ENEMY_TYPES_META={
  plain_01:['Herbivore','SmallPredator','Scavenger','MediumPredator','ApexPredator'],
  river_01:['SmallAquatic','RiverBandit','SwampCreature','LargeAquatic','RiverApex'],
  forest_01:['SmallForest','ForestBandit','ForestBeast','AmbushPredator','ForestApex'],
  herb_01:['PoisonPlant','HerbalBandit','ToxicBeast','Mercenary','PoisonLord'],
  copper_01:['CaveScavenger','MineBandit','SmallGolem','HeavyMiner','MineLord'],
  ruin_01:['UndeadMinion','RuinBandit','Ghost','UndeadKnight','RuinOverlord'],
  iron_01:['IronScavenger','IronMercenary','MiningGolem','HeavyIronWarrior','IronMonarch'],
  fort_01:['OccupationSoldier','SiegeEngineer','FortressGuard','SiegeGolem','FortressTyrant'],
  ancient_01:['RoyalRemnant','MagicGuardian','AncientKnight','RoyalMage','AncientKing'],
  magic_01:['CorruptedHerb','TwistedSpirit','MagicBeast','CorruptedSwarm','ForestApex'],
  ruin_ancient:['RuinScavenger','AncientTrap','UndeadRemnant','GuardianGolem','AncientOverlord'],
  border_01:['BorderScout','InvasionInfantry','SiegeUnit','EliteKnight','Warlord'],
};

const BOSSES={
  plain_01:{5:'거대 늑대 무리 대장',10:'광폭한 멧돼지',15:'들판의 지배자 (Ancient Boar)'},
  river_01:{5:'강의 수호자 (거대 악어)',10:'늪지 괴물',15:'강의 왕 (River Tyrant)'},
  forest_01:{5:'숲의 맹수 (거대 곰)',10:'독안개 늑대 무리',15:'숲의 수호령 (Forest Guardian)'},
  herb_01:{5:'독초 골렘',10:'약탈 용병 대장',15:'언덕의 독왕 (Poison Sovereign)'},
  copper_01:{5:'광산 도적 두목',10:'거대 채굴 골렘',15:'광산의 주인 (Mine Lord)'},
  ruin_01:{5:'언데드 기사',10:'폐허 수비대 대장',15:'폐허의 군주 (Ruin Overlord)'},
  iron_01:{5:'철갑 용병단장',10:'거대 채굴 골렘 왕',15:'철의 군주 (Iron Monarch)'},
  fort_01:{5:'점령군 사령관',10:'공성 골렘',15:'폐허의 폭군 (Fortress Tyrant)'},
  ancient_01:{5:'잔당 기사단장',10:'마법 수호 골렘',15:'고대 왕의 망령 (Ancient King)'},
  magic_01:{5:'타락 정령 군주',10:'거대 마법 수호수',15:'숲의 타락신 (Corrupted Forest God)'},
  ruin_ancient:{5:'고대 수호자',10:'봉인 해제된 골렘',15:'유적의 수호신 (Ancient Guardian)'},
  border_01:{5:'침략군 선봉대장',10:'거대 전쟁 골렘',15:'국경의 폭군 (Border Warlord)'},
};

const MODULE6_ENEMY_PROFILES={
  // 1등급
  hunt:{grade:1,power:0.78,countBase:3,countCap:6,ratio:{prey:0.6,warrior:0.2,ranged:0.2},etype:'prey'},
  river:{grade:1,power:0.84,countBase:3,countCap:6,ratio:{prey:0.45,warrior:0.25,ranged:0.2,mage:0.1},etype:'prey'},
  wilds:{grade:1,power:0.92,countBase:4,countCap:7,ratio:{tank:0.2,warrior:0.35,ranged:0.2,mage:0.1,heal:0.15},etype:'predator'},
  // 2등급
  bandit:{grade:2,power:1.15,countBase:5,countCap:8,ratio:{tank:0.2,warrior:0.3,ranged:0.25,mage:0.1,heal:0.15},etype:'bandit'},
  ruins:{grade:2,power:1.22,countBase:5,countCap:8,ratio:{tank:0.25,warrior:0.25,ranged:0.2,mage:0.15,heal:0.15},etype:'bandit'},
  mine:{grade:2,power:1.28,countBase:5,countCap:8,ratio:{tank:0.22,warrior:0.28,ranged:0.2,mage:0.2,heal:0.1},etype:'bandit'},
  // 3등급
  raider:{grade:3,power:1.58,countBase:6,countCap:9,ratio:{tank:0.28,warrior:0.25,ranged:0.2,mage:0.17,heal:0.1},etype:'king'},
  castle:{grade:3,power:1.72,countBase:6,countCap:9,ratio:{tank:0.32,warrior:0.22,ranged:0.18,mage:0.18,heal:0.1},etype:'king'},
  crystal:{grade:3,power:1.66,countBase:6,countCap:9,ratio:{tank:0.2,warrior:0.2,ranged:0.2,mage:0.28,heal:0.12},etype:'king'},
  // 통합
  warzone:{grade:4,power:2.0,countBase:7,countCap:10,ratio:{tank:0.3,warrior:0.24,ranged:0.16,mage:0.2,heal:0.1},etype:'king'},
  citadel:{grade:4,power:2.15,countBase:7,countCap:10,ratio:{tank:0.35,warrior:0.2,ranged:0.15,mage:0.2,heal:0.1},etype:'king'},
  void:{grade:4,power:2.25,countBase:7,countCap:10,ratio:{tank:0.24,warrior:0.2,ranged:0.16,mage:0.28,heal:0.12},etype:'king'},
};

const RAID_BOSSES={
  warzone:{
    id:'warlord', name:'💀 전쟁의 군주', hpScale:2.35, atkScale:1.12, baseSpd:0.58,
    phases:[
      {threshold:1.0, pattern:'cavalry_charge', desc:'기병대 돌격: 주기적으로 부대원 소환', spawnEvery:960},
      {threshold:0.7, pattern:'artillery', desc:'포격: 도넛·장판 패턴 강화', patternBias:{breath:0.22,donut:0.55,chain:0.23}, cdScale:0.84},
      {threshold:0.4, pattern:'enrage', desc:'분노: 공격·이동 급증 + 충격파', atkMult:1.9, spdMult:1.5, shockEvery:360},
    ],
  },
  citadel:{
    id:'blood_lord', name:'🩸 흡혈 군주', hpScale:2.5, atkScale:1.08, baseSpd:0.6,
    phases:[
      {threshold:1.0, pattern:'shadow_clone', desc:'분신: 그림자 복제 2체 소환', cloneCount:2, cloneHpRatio:0.32},
      {threshold:0.7, pattern:'darkness_spread', desc:'어둠 확산: 시야 감소', visionDebuff:0.38, duration:2100},
      {threshold:0.4, pattern:'life_drain', desc:'생명 흡수: 근접 아군 지속 피해', drainRadius:155, drainDps:18, atkMult:1.55, spdMult:1.35},
    ],
  },
  void:{
    id:'ancient_god', name:'🌌 숲의 고대신', hpScale:2.65, atkScale:1.15, baseSpd:0.52,
    phases:[
      {threshold:1.0, pattern:'terrain_shift', desc:'지형 교란: 장판·브레스 비중 상승', patternBias:{breath:0.48,donut:0.32,chain:0.20}, cdScale:0.88},
      {threshold:0.7, pattern:'summon_roots', desc:'뿌리 속박: 연쇄 번개 강화', patternBias:{breath:0.18,donut:0.28,chain:0.54}, chainBoost:1.12},
      {threshold:0.4, pattern:'regen', desc:'재생: 초당 체력 회복', regenPerSec:0.0045, atkMult:1.75, spdMult:1.4, shockEvery:300},
    ],
  },
};
