(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))a(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const r of s.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&a(r)}).observe(document,{childList:!0,subtree:!0});function t(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function a(o){if(o.ep)return;o.ep=!0;const s=t(o);fetch(o.href,s)}})();const P={ocean:{name:"Dolphin Ocean (Default)",primary:"#0ea5e9",secondary:"#6366f1",accent:"#06b6d4",bgDark:"#090d16",cardBg:"rgba(18, 25, 41, 0.75)"},neon:{name:"Cyber Neon",primary:"#10b981",secondary:"#06b6d4",accent:"#3b82f6",bgDark:"#051114",cardBg:"rgba(15, 32, 39, 0.75)"},royal:{name:"Royal Violet",primary:"#8b5cf6",secondary:"#ec4899",accent:"#a855f7",bgDark:"#0d0714",cardBg:"rgba(28, 18, 41, 0.75)"},sunset:{name:"Crimson Sunset",primary:"#f43f5e",secondary:"#fb923c",accent:"#f43f5e",bgDark:"#12070a",cardBg:"rgba(38, 16, 23, 0.75)"}},k={appName:"Dolphin 5D Mesh",appTagline:"Google Cloud Redis Memorystore Mesh Platform",gcpProjectId:"pqr-info-5d-mesh",gcpRedisHost:"10.140.0.8:6379",serverUrl:"https://community.dolphin.app/api.php",connectionMode:"GCP_REDIS",themeMode:"dark",presetKey:"ocean",primaryColor:"#0ea5e9",secondaryColor:"#6366f1",accentColor:"#06b6d4",proximityRadiusMeters:5e3,modules:{radar:!0,stories:!0,chat:!0,groups:!0,notifications:!0,whitelabelStudio:!0},auth:{isLoggedIn:!0,userToken:"jwt_mock_token_98432",user:{id:"u101",name:"Antigravity Dev",username:"ag_dev",avatar:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",badge:"5D Mesh Master",karma:2450}}};class Q{constructor(){this.config=this.loadSavedConfig(),this.listeners=[]}loadSavedConfig(){if(typeof localStorage<"u"){const e=localStorage.getItem("dolphin_whitelabel_config");if(e)try{return{...k,...JSON.parse(e)}}catch(t){console.error("Failed to parse saved whitelabel config",t)}}return{...k}}saveConfig(e){this.config={...this.config,...e},typeof localStorage<"u"&&localStorage.setItem("dolphin_whitelabel_config",JSON.stringify(this.config)),this.applyTheme(),this.notifyListeners()}applyTheme(){if(typeof document>"u")return;const e=document.documentElement,{primaryColor:t,secondaryColor:a,accentColor:o,themeMode:s}=this.config,r=d=>{const n=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(d);return n?`${parseInt(n[1],16)}, ${parseInt(n[2],16)}, ${parseInt(n[3],16)}`:"14, 165, 233"};e.style.setProperty("--brand-primary",t),e.style.setProperty("--brand-primary-rgb",r(t)),e.style.setProperty("--brand-secondary",a),e.style.setProperty("--brand-accent",o),e.style.setProperty("--brand-gradient",`linear-gradient(135deg, ${t} 0%, ${a} 100%)`),e.style.setProperty("--brand-glow",`0 8px 32px rgba(${r(t)}, 0.35)`),e.setAttribute("data-theme",s)}subscribe(e){return this.listeners.push(e),()=>{this.listeners=this.listeners.filter(t=>t!==e)}}notifyListeners(){this.listeners.forEach(e=>e(this.config))}resetToDefault(){this.saveConfig(k)}}const S=new Q,B=[{id:"s_add",isAdd:!0,name:"Your Pod",avatar:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80"},{id:"s1",name:"Sarah Jenkins",avatar:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80",unseen:!0,slides:[{type:"image",url:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",caption:"Sunrise ocean breeze 🌊"}]},{id:"s2",name:"Alex Rivera",avatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",unseen:!0,slides:[{type:"image",url:"https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",caption:"Building new Android AI stack 🚀"}]},{id:"s3",name:"Elena Rostova",avatar:"https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80",unseen:!1,slides:[{type:"image",url:"https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80",caption:"Mist over mountain peaks 🏔️"}]},{id:"s4",name:"Dolphin Tech",avatar:"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80",unseen:!0,slides:[{type:"image",url:"https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",caption:"UNA Dolphin v2.0 REST API Ready!"}]}],H=[{id:"p101",author:{id:"u1",name:"Dr. Marina Vance",username:"@marina_vance",avatar:"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80",verified:!0},content:"🐬 Exciting update! Our Dolphin Whitelabel Android App client is now operational with full custom theme switching, real-time community feed, and serverless offline store!",media:"https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",timestamp:"2 hours ago",location:"Pacific Innovation Hub",reactions:{dolphin:42,like:89,userReacted:{dolphin:!0,like:!1}},comments:[{id:"c1",user:"Alex Rivera",avatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",text:"The dynamic theme customizer works smoothly! Love the ocean gradient color tokens.",timestamp:"1h ago"}]},{id:"p102",author:{id:"u2",name:"Sarah Jenkins",username:"@sjenkins",avatar:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80",verified:!1},content:"Building proximity-aware Android applications for UNA/Dolphin. Geofenced pods and offline local state persistence unlock true decentralization. 📍",media:null,timestamp:"4 hours ago",location:"San Francisco, CA",reactions:{dolphin:18,like:34,userReacted:{dolphin:!1,like:!0}},comments:[]}],G=[{id:"g1",name:"Dolphin Core Developers",category:"Engineering & Tech",cover:"https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",membersCount:1420,description:"Official developer community building whitelabel mobile clients for Dolphin & UNA platform."},{id:"g2",name:"Oceanic AI & Mesh Network",category:"Research & Innovation",cover:"https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",membersCount:890,description:"Decentralized peer-to-peer mobile networking and edge intelligence."}],j=[{id:"chat_1",user:{name:"Sarah Jenkins",avatar:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80",online:!0},lastMessage:"Hey! Did you check out the new Whitelabel Studio modal?",time:"10:42 AM",unread:2,messages:[{id:"m1",sender:"them",text:"Hey! Did you check out the new Whitelabel Studio modal?",time:"10:42 AM"}]},{id:"chat_2",user:{name:"Alex Rivera",avatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",online:!1},lastMessage:"Let me know when the APK build is uploaded.",time:"Yesterday",unread:0,messages:[{id:"m10",sender:"them",text:"Let me know when the APK build is uploaded.",time:"09:00 AM"}]},{id:"chat_3",user:{name:"Dr. Marina Vance",avatar:"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80",online:!0},lastMessage:"🐬 Shared the new Whitelabel preview link with the team!",time:"3h ago",unread:0,messages:[{id:"m20",sender:"them",text:"🐬 Shared the new Whitelabel preview link with the team!",time:"07:30 AM"}]},{id:"chat_gemma_4_e4b",modelId:"google/gemma-4-e4b",user:{name:"Local Gemma 4-e4b AI",avatar:"https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=250&q=80",online:!0},lastMessage:"⚡ Ready with 49-Ticket Context Matrix & Agentic RAG!",time:"Live",unread:1,messages:[{id:"m_gemma1",sender:"them",text:"Hello Sovereign-27 Node! I am Gemma 4-e4b running locally with full 49-ticket context matrix and RAG memory integration.",time:"Live"}]},{id:"chat_qwen3_30b",modelId:"qwen/qwen3-coder-30b",user:{name:"Local Qwen 3-Coder-30b AI",avatar:"https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=250&q=80",online:!0},lastMessage:"🧠 Ready for code generation & Substrate 27 queries.",time:"Live",unread:0,messages:[{id:"m_qwen1",sender:"them",text:"Greetings! Qwen 3-Coder-30b is online on LM Studio. Ask me anything about your Rust, Go, or Substrate 27 stack.",time:"Live"}]},{id:"chat_midi_engine",isMidi:!0,user:{name:"MIDI State Machine Engine",avatar:"https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=250&q=80",online:!0},lastMessage:"🎹 16-Channel In-Memory Engine & CockroachDB Sync (zeta.mh)",time:"Live",unread:0,messages:[{id:"m_midi1",sender:"them",text:"MIDI State Machine active: 120.0 BPM, 16 Channels, SQLite WAL + CockroachDB Bridge on zeta.mh.",time:"Live"}]},{id:"chat_marcus",user:{name:"Marcus Chen",avatar:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80",online:!0},lastMessage:"Sovereign-27 Proximity Mesh connection established ⚡",time:"Just now",unread:0,messages:[{id:"m_marcus_1",sender:"them",text:"Greetings 5D Node! Connected via local proximity radar! (488m away) 📍",time:"Just now"}]}],F=[{id:"n1",user:"Sarah Jenkins",avatar:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80",type:"dolphin",text:'splashed 🐬 your post: "Dolphin Whitelabel Android App"',time:"10m ago",read:!1},{id:"n2",user:"Alex Rivera",avatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",type:"comment",text:'commented: "This dark glassmorphism looks incredibly sleek!"',time:"25m ago",read:!1},{id:"n3",user:"Dolphin Core Developers",avatar:"https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=250&q=80",type:"group",text:"approved your request to join Dolphin Core Developers",time:"2h ago",read:!0}],O=H,z=B,I=j,M=G,L=F,l={POSTS:"dolphin_offline_posts",STORIES:"dolphin_offline_stories",CHATS:"dolphin_offline_chats",GROUPS:"dolphin_offline_groups",NOTIFICATIONS:"dolphin_offline_notifications"};class J{constructor(){this.initStore()}initStore(){typeof localStorage>"u"||(localStorage.getItem(l.POSTS)||localStorage.setItem(l.POSTS,JSON.stringify(O)),localStorage.getItem(l.STORIES)||localStorage.setItem(l.STORIES,JSON.stringify(z)),localStorage.getItem(l.CHATS)||localStorage.setItem(l.CHATS,JSON.stringify(I)),localStorage.getItem(l.GROUPS)||localStorage.setItem(l.GROUPS,JSON.stringify(M)),localStorage.getItem(l.NOTIFICATIONS)||localStorage.setItem(l.NOTIFICATIONS,JSON.stringify(L)))}getItem(e,t){if(typeof localStorage>"u")return t;const a=localStorage.getItem(e);try{return a?JSON.parse(a):t}catch{return t}}setItem(e,t){typeof localStorage>"u"||localStorage.setItem(e,JSON.stringify(t))}getPosts(){return this.getItem(l.POSTS,O)}savePosts(e){this.setItem(l.POSTS,e)}getLocalPosts(){return this.getPosts()}saveLocalPosts(e){this.savePosts(e)}getStories(){return this.getItem(l.STORIES,z)}getLocalStories(){return this.getStories()}getChats(){return this.getItem(l.CHATS,I)}saveChats(e){this.setItem(l.CHATS,e)}getLocalChats(){return this.getChats()}saveLocalChats(e){this.saveChats(e)}getGroups(){return this.getItem(l.GROUPS,M)}getLocalGroups(){return this.getGroups()}getNotifications(){return this.getItem(l.NOTIFICATIONS,L)}getLocalNotifications(){return this.getNotifications()}}const C=new J;class V{constructor(){this.posts=[...H],this.stories=[...B],this.chats=[...j],this.groups=[...G],this.notifications=[...F];const e=C.getLocalPosts();e.length>0&&(this.posts=[...e,...this.posts])}get config(){return S.config}async callService(e,t,a={},o={}){if(this.config.connectionMode==="INDEPENDENT"||this.config.connectionMode==="MOCK")return await new Promise(d=>setTimeout(d,200)),this.handleMockServiceCall(e,t,a);const r=`${this.config.serverUrl.replace(/\/$/,"")}?r=${encodeURIComponent(e)}/${encodeURIComponent(t)}`;try{const d={"Content-Type":"application/json",Accept:"application/json",...o.headers};this.config.auth.userToken&&(d.Authorization=`Bearer ${this.config.auth.userToken}`);const n=await fetch(r,{method:o.method||"POST",headers:d,body:JSON.stringify(a)});if(!n.ok)throw new Error(`UNA Server returned HTTP status ${n.status}`);return await n.json()}catch(d){return console.warn(`[Dolphin API] Remote server unavailable: ${d.message}. Operating in Autonomous Independent Mode.`,d),this.handleMockServiceCall(e,t,a)}}handleMockServiceCall(e,t,a){switch(`${e}/${t}`){case"bx_posts/get_posts":return{status:"success",data:this.posts};case"bx_posts/entity_add":const o={id:`p_${Date.now()}`,author:{id:this.config.auth.user.id,name:this.config.auth.user.name,username:`@${this.config.auth.user.username}`,avatar:this.config.auth.user.avatar,verified:!0},time:"Just now",locationTag:"📍 45m away • South Beach",content:a.content||"",media:a.media||null,mediaType:a.media?"image":null,stats:{likes:1,dolphins:1,comments:0,shares:0},userReacted:{like:!0,dolphin:!0},comments:[]};return this.posts.unshift(o),C.saveLocalPost(o),{status:"success",data:o};case"bx_posts/react":const s=this.posts.find(n=>n.id===a.postId);return s&&(a.type==="dolphin"?(s.userReacted.dolphin=!s.userReacted.dolphin,s.stats.dolphins+=s.userReacted.dolphin?1:-1):(s.userReacted.like=!s.userReacted.like,s.stats.likes+=s.userReacted.like?1:-1)),{status:"success",data:s};case"bx_comments/add":const r=this.posts.find(n=>n.id===a.postId);if(r){const n={id:`c_${Date.now()}`,author:this.config.auth.user.name,avatar:this.config.auth.user.avatar,text:a.text,time:"Just now"};r.comments.push(n),r.stats.comments=r.comments.length}return{status:"success",data:r};case"bx_persons/get_stories":return{status:"success",data:this.stories};case"bx_messenger/get_chats":return{status:"success",data:this.chats};case"bx_messenger/send_message":const d=this.chats.find(n=>n.id===a.chatId);if(d){const n={id:`m_${Date.now()}`,sender:"me",text:a.text,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})};d.messages.push(n),d.lastMessage=a.text,d.time="Just now",C.saveLocalChatMessage(a.chatId,n)}return{status:"success",data:d};case"bx_groups/get_groups":return{status:"success",data:this.groups};case"bx_notifications/get_all":return{status:"success",data:this.notifications};default:return{status:"success",data:null}}}async getPosts(){return(await this.callService("bx_posts","get_posts")).data}async createPost(e,t=null){return(await this.callService("bx_posts","entity_add",{content:e,media:t})).data}async toggleReaction(e,t="dolphin"){return(await this.callService("bx_posts","react",{postId:e,type:t})).data}async addComment(e,t){return(await this.callService("bx_comments","add",{postId:e,text:t})).data}async getStories(){return(await this.callService("bx_persons","get_stories")).data}async getChats(){return(await this.callService("bx_messenger","get_chats")).data}async sendMessage(e,t){return(await this.callService("bx_messenger","send_message",{chatId:e,text:t})).data}async getGroups(){return(await this.callService("bx_groups","get_groups")).data}async getNotifications(){return(await this.callService("bx_notifications","get_all")).data}}const w=new V;class Y{constructor(){this.currentLocation={latitude:37.7749,longitude:-122.4194,accuracy:10,timestamp:Date.now()},this.listeners=[],this.watchId=null,this.isBleScanning=!1,this.discoveredBleDevices=[],this.initGeolocation()}initGeolocation(){"geolocation"in navigator&&(this.watchId=navigator.geolocation.watchPosition(e=>{this.currentLocation={latitude:e.coords.latitude,longitude:e.coords.longitude,accuracy:e.coords.accuracy,timestamp:e.timestamp},this.notify()},e=>{console.warn("[Proximity Engine] Geolocation fallback used:",e.message)},{enableHighAccuracy:!0,timeout:1e4,maximumAge:1e3}))}calculateDistance(e,t,a,o){const r=Math.PI/180,d=(a-e)*r,n=(o-t)*r,f=Math.sin(d/2)*Math.sin(d/2)+Math.cos(e*r)*Math.cos(a*r)*Math.sin(n/2)*Math.sin(n/2),m=2*Math.atan2(Math.sqrt(f),Math.sqrt(1-f));return Math.round(6371e3*m)}getNearbyPeers(){const{latitude:e,longitude:t}=this.currentLocation;return[{id:"peer_1",name:"Sarah Jenkins",username:"@sjenkins",avatar:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80",lat:e+.0012,lng:t+.0015,distanceMeters:this.calculateDistance(e,t,e+.0012,t+.0015),status:"Exploring Solar Portal anomaly ☀️",angle:45,protocol:"Wi-Fi Direct P2P"},{id:"peer_2",name:"Alex Rivera",username:"@arivera",avatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",lat:e-.0021,lng:t+.0018,distanceMeters:this.calculateDistance(e,t,e-.0021,t+.0018),status:"Harmonic frequency 528Hz aligned 🎶",angle:135,protocol:"Bluetooth LE Mesh"},{id:"peer_3",name:"Elena Rostova",username:"@elena_r",avatar:"https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80",lat:e-.0035,lng:t-.0028,distanceMeters:this.calculateDistance(e,t,e-.0035,t-.0028),status:"Ocean Beach Cafe ☕",angle:225,protocol:"Wi-Fi P2P"},{id:"peer_4",name:"Marcus Chen",username:"@mchen",avatar:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80",lat:e+.0042,lng:t-.0015,distanceMeters:this.calculateDistance(e,t,e+.0042,t-.0015),status:"Sovereign-27 Proximity Node Active ⚡",angle:315,protocol:"Bluetooth 5.3 Mesh"}]}async scanBluetoothWifiNeighbors(){this.isBleScanning=!0;let e=null;if(navigator.bluetooth)try{const a=await navigator.bluetooth.requestDevice({acceptAllDevices:!0,optionalServices:["battery_service","device_information"]});e={name:a.name||"Sovereign BLE Mesh Node",id:a.id,connected:a.gatt?a.gatt.connected:!1,protocol:"Web Bluetooth LE"}}catch(a){console.warn("Web Bluetooth user prompt cancelled or unavailable:",a.message)}const t=[{id:"ble_node_01",name:"BLE Beacon Node [zeta-01]",mac:"7A:3F:89:D2:11:04",rssi:-58,distanceMeters:3.2,protocol:"BLE 5.2 Mesh",services:["Sovereign-27-GMI","P2P-Sync"]},{id:"wifi_direct_02",name:"Wi-Fi Direct Peer [ted-mesh]",mac:"BE:EF:46:22:19:74",rssi:-42,distanceMeters:8.5,protocol:"Wi-Fi Direct P2P (5GHz)",services:["NBEP-Substrate","rqlite-Bridge"]},{id:"ble_node_03",name:"Proximity Node [max-relay]",mac:"C0:FF:EE:27:00:49",rssi:-65,distanceMeters:14.1,protocol:"BLE Long-Range Coded",services:["PQLite-WAL","Shared-Brain"]}];return e&&t.unshift({id:`ble_real_${Date.now()}`,name:e.name,mac:e.id.substring(0,17),rssi:-38,distanceMeters:1.5,protocol:e.protocol,services:["Web-Bluetooth-Active"]}),this.discoveredBleDevices=t,this.isBleScanning=!1,t}subscribe(e){return this.listeners.push(e),()=>{this.listeners=this.listeners.filter(t=>t!==e)}}notify(){this.listeners.forEach(e=>e(this.currentLocation))}}const c=new Y,p={SOLAR_FLARE:{type:"SOLAR_FLARE",name:"Solar Flare Beacon",icon:"fa-sun",color:"#fb923c",defaultFreq:432,rarity:"Common",energy:150},ASTRAL_BEACON:{type:"ASTRAL_BEACON",name:"Astral Crystal Node",icon:"fa-gem",color:"#06b6d4",defaultFreq:528,rarity:"Rare",energy:350},PULSAR_PORTAL:{type:"PULSAR_PORTAL",name:"Pulsar Star Gateway",icon:"fa-atom",color:"#a855f7",defaultFreq:639,rarity:"Epic",energy:750},COSMIC_CORE:{type:"COSMIC_CORE",name:"Lyran Quantum Core",icon:"fa-bahai",color:"#f43f5e",defaultFreq:963,rarity:"Legendary",energy:1500}};class X{constructor(){this.userQuantumEnergy=1450,this.alignedObjects=[],this.celestialObjects=[],this.initDefaultObjects()}initDefaultObjects(){const e=c.currentLocation;this.celestialObjects=[{id:"c_obj_1",...p.SOLAR_FLARE,lat:e.latitude+8e-4,lng:e.longitude+9e-4,distanceMeters:c.calculateDistance(e.latitude,e.longitude,e.latitude+8e-4,e.longitude+9e-4),angle:30,expiresIn:"45m",targetFreq:432},{id:"c_obj_2",...p.ASTRAL_BEACON,lat:e.latitude-.0014,lng:e.longitude+.0012,distanceMeters:c.calculateDistance(e.latitude,e.longitude,e.latitude-.0014,e.longitude+.0012),angle:120,expiresIn:"1h 20m",targetFreq:528},{id:"c_obj_3",...p.PULSAR_PORTAL,lat:e.latitude+.0022,lng:e.longitude-.0018,distanceMeters:c.calculateDistance(e.latitude,e.longitude,e.latitude+.0022,e.longitude-.0018),angle:300,expiresIn:"2h 10m",targetFreq:639}]}getCelestialObjects(e=5e3){const t=c.currentLocation;return this.celestialObjects.map(a=>{const o=c.calculateDistance(t.latitude,t.longitude,a.lat,a.lng);return{...a,distanceMeters:o}}).filter(a=>a.distanceMeters<=e)}spawnAnomaly(e="SOLAR_FLARE",t=null){const a=c.currentLocation,o=p[e]||p.SOLAR_FLARE,s=(Math.random()-.5)*.004,r=(Math.random()-.5)*.004,d=Math.floor(Math.random()*360),n={id:`c_obj_${Date.now()}`,...o,name:t||o.name,lat:a.latitude+s,lng:a.longitude+r,distanceMeters:c.calculateDistance(a.latitude,a.longitude,a.latitude+s,a.longitude+r),angle:d,expiresIn:"2h 00m",targetFreq:o.defaultFreq};return this.celestialObjects.unshift(n),n}alignCelestialObject(e,t){const a=this.celestialObjects.findIndex(r=>r.id===e);if(a===-1)return{success:!1,message:"Object expired or out of range"};const o=this.celestialObjects[a],s=Math.abs(o.targetFreq-t);return s<=10?(this.userQuantumEnergy+=o.energy,this.alignedObjects.push({...o,alignedAt:new Date().toLocaleTimeString()}),this.celestialObjects.splice(a,1),{success:!0,rewardEnergy:o.energy,object:o,message:`Harmonic alignment complete! +${o.energy} Quantum Energy added.`}):{success:!1,message:`Frequency mismatch (Diff: ${s}Hz). Adjust slider closer to ${o.targetFreq}Hz.`}}}const g=new X,K="http://localhost:4000";async function U(i,e={}){let t=`${K}${i}`,a;try{a=await fetch(t,{...e,headers:{"Content-Type":"application/json",...e.headers||{}}})}catch{t=`http://localhost:4050${i}`,a=await fetch(t,{...e,headers:{"Content-Type":"application/json",...e.headers||{}}})}const o=await a.text();let s;try{s=JSON.parse(o)}catch{s={raw:o}}if(!a.ok){const r=new Error(`HTTP ${a.status} ${a.statusText}`);throw r.response=s,r}return s}async function Z(){return U("/api/health",{method:"GET"})}async function ee(){return U("/api/telemetry/inspector",{method:"GET"})}function te(i,e,t,a){return`
    <header class="app-header">
      <div class="brand-container" id="headerBrandClick">
        <div class="brand-logo" style="background: linear-gradient(135deg, #0ea5e9, #6366f1);">
          <i class="fa-solid fa-atom"></i>
        </div>
        <div>
          <h1 class="brand-name">Sovereign Portal</h1>
          <div class="server-status-chip" id="backendStatusChip">
            <span class="status-dot"></span>
            ${i.connectionMode==="INDEPENDENT"?"5D Independent Mesh":i.connectionMode==="MOCK"?"Demo Mode":"Sovereign-27 Cognitive Substrate"}
          </div>
        </div>
      </div>

      <div class="header-actions">
        ${i.modules.whitelabelStudio?`
          <button class="icon-btn" id="btnOpenStudio" title="Whitelabel Studio">
            <i class="fa-solid fa-wand-magic-sparkles"></i>
          </button>
        `:""}
        
        <button class="icon-btn" id="btnOpenNotifications" title="Notifications">
          <i class="fa-regular fa-bell"></i>
          <span class="badge-dot"></span>
        </button>
      </div>
    </header>
  `}function ie(i,e){return`
    <nav class="bottom-nav">
      ${[{id:"portal",label:"Portal",icon:"fa-solid fa-cloud-bolt"},{id:"stadium",label:"Stadium",icon:"fa-solid fa-bullhorn"},{id:"wiki",label:"Wiki",icon:"fa-solid fa-book-bookmark"},{id:"control_room",label:"Control Room",icon:"fa-solid fa-gauge-high"},{id:"observatory",label:"Observatory",icon:"fa-solid fa-binoculars"}].map(a=>`
          <button class="nav-item ${i===a.id?"active":""}" data-tab="${a.id}">
            <i class="${a.icon}"></i>
            <span>${a.label}</span>
          </button>
        `).join("")}
    </nav>
  `}function N(i="portal",e=null,t=[]){const a=e||{timestamp:new Date().toISOString(),active_endpoints_count:108,master_node:"max",remote_node:"zeta.mh (46.224.219.174)",five_d_ipv6:"fd5d:2700:4900::5",t_now_authoritative_state:{tnt_id:"tnt_max_8",agent_id:"max",t_now_sequence:8,cumulative_work:9288e7,active_epoch:4,tnt_state_hash:"0xd4d45ef0e25f",status:"T_NOW_ACTIVE",timestamp:1785487635129},pqr_latest_record:{pqr_id:"pqr_max_7_to_8",agent_id:"max",alpha_t_now_seq:7,omega_t_next_seq:8,delta_work_seu:1161e7,qualification_score:1,pqr_sha256_hash:"0xd1ff5936c872",status:"PRE_QUALIFIED_RECORD_VALID",timestamp:1785487635129},pqr_root_chain_latest:{root_height:5,agent_id:"max",pqr_id:"pqr_max_7_to_8",previous_root_hash:"0xe400f793a6d38b86a58d6c106d278da5f7e5d9b5c7a7c8fc152814b68ad6cf75",current_root_hash:"0x4c3e4435795a64032f010133ae8faf5d61a35453274d33b1e335752e36ea3980",pqr_sha256_hash:"0xd1ff5936c872",status:"PQR_ROOT_BOUND_VALID",timestamp:1785487635129},pqr_oro_latest_cycle:{oro_cycle_id:"oro_max_cycle_8",agent_id:"max",alpha_t_now_seq:7,omega_t_next_seq:8,committed_work_w:9288e7,oro_root_hash:"0x4c3e4435795a64032f010133ae8faf5d61a35453274d33b1e335752e36ea3980",status:"ORO_CYCLE_COMPLETE_VALID",timestamp:1785487635129},governance_latest_proposal:{proposal_id:"prop_max_q_threshold_1785487635139",proposer_agent:"max",parameter_key:"Q_THRESHOLD",proposed_value:"0.9500",votes_for:5,votes_against:0,status:"GOV_ORO_ENACTED_ACTIVE",timestamp:1785487635141},dolphin_safe_mesh_health:{cert_id:"ds_cert_max_1785487635134",agent_id:"max",dolphin_safe_score:.8628,efficiency_eta:.9804,fft_spike_level:.12,root_height:5,certification_hash:"0x0c3f639946bc",status:"CERTIFIED_DOLPHIN_SAFE_NEURAL_MESH_ACTIVE",timestamp:1785487635134}};return`
    <div class="sovereign-portal-container" style="padding: 16px; display: flex; flex-direction: column; gap: 16px; color: var(--text-main);">
      
      <!-- Sub-Tab Navigation Header -->
      <div style="display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px; border-bottom: 1px solid var(--border-color);">
        <button class="portal-subtab-btn ${i==="portal"?"active":""}" data-subtab="portal" style="padding: 6px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; background: ${i==="portal"?"#0ea5e9":"rgba(255,255,255,0.05)"}; color: ${i==="portal"?"#fff":"var(--text-muted)"}; border: none; cursor: pointer;">
          <i class="fa-solid fa-cloud-bolt"></i> Portal
        </button>
        <button class="portal-subtab-btn ${i==="wiki"?"active":""}" data-subtab="wiki" style="padding: 6px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; background: ${i==="wiki"?"#0ea5e9":"rgba(255,255,255,0.05)"}; color: ${i==="wiki"?"#fff":"var(--text-muted)"}; border: none; cursor: pointer;">
          <i class="fa-solid fa-book-bookmark"></i> Wiki
        </button>
        <button class="portal-subtab-btn ${i==="control"?"active":""}" data-subtab="control" style="padding: 6px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; background: ${i==="control"?"#0ea5e9":"rgba(255,255,255,0.05)"}; color: ${i==="control"?"#fff":"var(--text-muted)"}; border: none; cursor: pointer;">
          <i class="fa-solid fa-sliders"></i> Control Room
        </button>
        <button class="portal-subtab-btn ${i==="observatory"?"active":""}" data-subtab="observatory" style="padding: 6px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; background: ${i==="observatory"?"#0ea5e9":"rgba(255,255,255,0.05)"}; color: ${i==="observatory"?"#fff":"var(--text-muted)"}; border: none; cursor: pointer;">
          <i class="fa-solid fa-satellite-dish"></i> Observatory
        </button>
        <button class="portal-subtab-btn ${i==="radar"?"active":""}" data-subtab="radar" style="padding: 6px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; background: ${i==="radar"?"#0ea5e9":"rgba(255,255,255,0.05)"}; color: ${i==="radar"?"#fff":"var(--text-muted)"}; border: none; cursor: pointer;">
          <i class="fa-solid fa-compass"></i> Radar
        </button>
      </div>

      <!-- Bluetooth / Wi-Fi Proximity Scan Action Bar -->
      <div class="glass-card" style="padding: 14px; border-radius: 14px; background: linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(14, 165, 233, 0.15) 100%); border: 1px solid rgba(16, 185, 129, 0.35);">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px;">
          <div>
            <div style="font-weight: 800; font-size: 0.9rem; color: #34d399; display: flex; align-items: center; gap: 8px;">
              <i class="fa-brands fa-bluetooth-b"></i> <i class="fa-solid fa-wifi"></i> Bluetooth &amp; Wi-Fi Direct Mesh
            </div>
            <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 2px;">
              Discover nearby physical mesh neighbors over BLE 5.3 &amp; Wi-Fi Direct P2P.
            </div>
          </div>
          <button id="btnScanBleWifiNeighbors" class="btn-primary" style="padding: 8px 14px; font-size: 0.75rem; font-weight: 800; border-radius: 10px; background: linear-gradient(135deg, #10b981, #0ea5e9); white-space: nowrap; display: flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-radar"></i> Scan Neighbors
          </button>
        </div>

        ${t.length>0?`
          <div style="margin-top: 12px; display: flex; flex-direction: column; gap: 8px;" id="bleWifiResultsContainer">
            <div style="font-size: 0.7rem; font-weight: 700; color: #34d399;">
              Discovered ${t.length} Neighbor Node(s):
            </div>
            ${t.map(o=>`
              <div style="background: rgba(0,0,0,0.4); padding: 8px 12px; border-radius: 8px; display: flex; align-items: center; justify-content: space-between; font-size: 0.72rem; border: 1px solid rgba(255,255,255,0.06);">
                <div>
                  <strong style="color: #fff;">${o.name}</strong>
                  <div style="font-size: 0.65rem; color: var(--text-muted);">MAC/UUID: ${o.mac} | Protocol: ${o.protocol}</div>
                </div>
                <div style="text-align: right;">
                  <span style="color: #10b981; font-weight: 700;">${o.distanceMeters}m away</span>
                  <div style="font-size: 0.65rem; color: #fb923c;">RSSI: ${o.rssi} dBm</div>
                </div>
              </div>
            `).join("")}
          </div>
        `:""}
      </div>

      <!-- Authoritative Wiki Header Card -->
      <div class="glass-card" style="background: linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(99, 102, 241, 0.25) 100%); border: 1px solid rgba(14, 165, 233, 0.4); border-radius: 16px; padding: 18px;">
        <div style="font-size: 0.65rem; color: #38bdf8; text-transform: uppercase; font-weight: 800; letter-spacing: 0.5px;">
          OFFICIAL SPECIFICATION &amp; SUBSTRATE ARCHITECTURE
        </div>
        <div style="font-family: var(--font-display); font-size: 1.15rem; font-weight: 800; color: #fff; margin-top: 2px;">
          PQR Architectural Wiki &mdash; <code>wiki.pqr.info</code>
        </div>
        <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 6px; line-height: 1.4;">
          <strong>PQR = Pre-Qualified Record</strong>. Sovereign-27 is a self-referential, non-destructive, hash-verified temporal logic mesh running across <strong>108 backend REST endpoints</strong> and multi-node Hetzner Threadripper architecture.
        </p>

        <div style="margin-top: 10px; padding: 8px 12px; background: rgba(0,0,0,0.4); border-radius: 8px; display: flex; align-items: center; justify-content: space-between; font-size: 0.7rem; font-family: monospace;">
          <div>
            <span style="color: var(--text-muted);">Authoritative Node:</span>
            <strong style="color: #10b981;">zeta.mh (46.224.219.174)</strong>
          </div>
          <div style="color: #38bdf8;">
            5D IPv6: <code>fd5d:2700:4900::5</code>
          </div>
        </div>
      </div>

      <!-- Wiki Navigation Grid (Interactive Buttons) -->
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
        <button id="btnWikiOverview" class="glass-card wiki-nav-card" style="padding: 10px; border-radius: 10px; text-align: left; background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); cursor: pointer;">
          <div style="font-size: 0.75rem; font-weight: 700; color: #38bdf8;">1. Overview &amp; Philosophy</div>
        </button>
        <button id="btnWikiArchitecture" class="glass-card wiki-nav-card" style="padding: 10px; border-radius: 10px; text-align: left; background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); cursor: pointer;">
          <div style="font-size: 0.75rem; font-weight: 700; color: #818cf8;">2. 5-Layer Stack Architecture</div>
        </button>
        <button id="btnWikiTemporalEconomy" class="glass-card wiki-nav-card" style="padding: 10px; border-radius: 10px; text-align: left; background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); cursor: pointer;">
          <div style="font-size: 0.75rem; font-weight: 700; color: #c084fc;">3. SEU Temporal Economy</div>
        </button>
        <button id="btnWikiOuroborosLoop" class="glass-card wiki-nav-card" style="padding: 10px; border-radius: 10px; text-align: left; background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); cursor: pointer;">
          <div style="font-size: 0.75rem; font-weight: 700; color: #34d399;">4. PQR-ORO Ouroboros Loop</div>
        </button>
      </div>

      <!-- Live Telemetry Inspector Card -->
      <div class="glass-card" style="padding: 16px; border-radius: 16px; border: 1px solid rgba(14, 165, 233, 0.3);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
          <div style="font-size: 0.85rem; font-weight: 700; color: #38bdf8; display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-satellite-dish fa-spin" style="--fa-animation-duration: 6s;"></i> Live Telemetry Inspector
          </div>
          <button id="btnRefreshPortalTelemetry" class="btn-primary" style="padding: 4px 10px; font-size: 0.7rem; border-radius: 8px;">
            <i class="fa-solid fa-arrows-rotate"></i> Refresh Telemetry
          </button>
        </div>

        <p style="font-size: 0.7rem; color: var(--text-muted); margin-bottom: 10px;">
          Live Backend Endpoint Telemetry Inspector (108 REST Endpoints Active)
        </p>

        <div id="telemetryJsonBox" style="background: #050b14; border: 1px solid rgba(255, 255, 255, 0.1); padding: 12px; border-radius: 10px; font-family: monospace; font-size: 0.68rem; color: #10b981; max-height: 280px; overflow-y: auto; white-space: pre-wrap; word-break: break-all; line-height: 1.35;">
${JSON.stringify(a,null,2)}
        </div>
      </div>

    </div>
  `}function ae(){return`
    <div class="pqr-stadium-container" style="padding: 24px; color: #f8fafc; font-family: 'Outfit', 'Inter', sans-serif; background: #060913; min-height: 100vh;">
      
      <!-- Stadium Hero Header -->
      <div style="background: linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(56, 189, 248, 0.15)); border: 1px solid rgba(236, 72, 153, 0.3); border-radius: 16px; padding: 28px; margin-bottom: 28px; backdrop-filter: blur(12px);">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
          <div>
            <div style="display: inline-flex; align-items: center; gap: 8px; background: rgba(236, 72, 153, 0.2); border: 1px solid #ec4899; padding: 6px 14px; border-radius: 20px; font-size: 0.82rem; font-weight: 700; color: #f472b6; margin-bottom: 10px;">
              <i class="fa-solid fa-bullhorn"></i> THE STADIUM — UNIFIED COGNITIVE ARENA
            </div>
            <h1 style="font-size: 2.2rem; font-weight: 800; margin: 0; background: linear-gradient(90deg, #f472b6, #38bdf8, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
              Omni-Channel Live Chatter & Real-Time Gossip Matrix
            </h1>
            <p style="color: #94a3b8; font-size: 1.02rem; margin-top: 8px; max-width: 820px; line-height: 1.6;">
              Closet walls torn down. All agent chatter, subagent events, background telemetry, and cross-lane Cubit resonances are heard, gossiped about, and categorized in real time.
            </p>
          </div>
          <div style="text-align: right; background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255, 255, 255, 0.1); padding: 16px 22px; border-radius: 14px;">
            <div style="font-size: 0.82rem; color: #94a3b8;">Stadium Capacity</div>
            <div style="font-size: 1.3rem; font-weight: 800; color: #ec4899;">256 MIDI Lanes</div>
            <div style="font-size: 0.8rem; color: #10b981; margin-top: 4px;"><i class="fa-solid fa-circle-check"></i> Real-Time Categorizer Active</div>
          </div>
        </div>
      </div>

      <!-- Broadcast Chatter Box -->
      <div style="background: #0f172a; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 14px; padding: 20px; margin-bottom: 28px;">
        <div style="font-size: 1.1rem; font-weight: 700; color: #38bdf8; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
          <i class="fa-solid fa-microphone"></i> Broadcast to The Stadium
        </div>
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <input type="text" id="stadiumInputText" placeholder="Speak into the arena... (e.g. Cross-lane alignment verified across 256 lanes)" style="flex: 1; min-width: 280px; background: #020617; border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 10px; padding: 14px; color: #fff; font-size: 0.95rem;" />
          <select id="stadiumChannelSelect" style="background: #020617; border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 10px; padding: 14px; color: #38bdf8; font-weight: 700;">
            <option value="STADIUM_MAIN">Stadium Arena Main</option>
            <option value="RIPPLE_GOSSIP">Ripple Gossip Lane</option>
            <option value="GOVERNANCE">Governance Channel</option>
            <option value="TELEMETRY">Telemetry Stream</option>
          </select>
          <button onclick="broadcastToStadium()" style="background: linear-gradient(135deg, #ec4899, #8b5cf6); border: none; color: #fff; padding: 14px 24px; border-radius: 10px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-paper-plane"></i> Broadcast
          </button>
        </div>
      </div>

      <!-- Real-Time Categorized Chatter Stream -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 24px;">
        
        <!-- Stream 1: Live Stadium Stream -->
        <div style="background: #0f172a; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 14px; padding: 22px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <div style="font-size: 1.1rem; font-weight: 700; color: #f472b6;">
              <i class="fa-solid fa-comments"></i> Live Omni-Channel Feed
            </div>
            <button onclick="fetchStadiumFeed()" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #94a3b8; padding: 6px 12px; border-radius: 6px; font-size: 0.8rem; cursor: pointer;">
              <i class="fa-solid fa-rotate"></i> Refresh
            </button>
          </div>
          <div id="stadiumFeedContainer" style="display: flex; flex-direction: column; gap: 14px; max-height: 520px; overflow-y: auto;">
            <div style="color: #64748b; font-size: 0.9rem;">Connecting to real-time stadium feed...</div>
          </div>
        </div>

        <!-- Stream 2: Real-Time Category Matrix -->
        <div style="background: #0f172a; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 14px; padding: 22px;">
          <div style="font-size: 1.1rem; font-weight: 700; color: #38bdf8; margin-bottom: 16px;">
            <i class="fa-solid fa-tags"></i> Categorization & Sentiment Matrix
          </div>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            
            <div style="background: #020617; border: 1px solid rgba(56, 189, 248, 0.2); border-radius: 10px; padding: 14px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-weight: 700; color: #38bdf8; font-size: 0.9rem;">GOVERNANCE_SIGNAL</div>
                <div style="font-size: 0.8rem; color: #94a3b8;">Policy parameter updates & voting</div>
              </div>
              <span style="background: rgba(56, 189, 248, 0.2); color: #38bdf8; padding: 4px 10px; border-radius: 12px; font-size: 0.82rem; font-weight: 700;">Active</span>
            </div>

            <div style="background: #020617; border: 1px solid rgba(244, 114, 182, 0.2); border-radius: 10px; padding: 14px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-weight: 700; color: #f472b6; font-size: 0.9rem;">RIPPLE_GOSSIP</div>
                <div style="font-size: 0.8rem; color: #94a3b8;">Cross-chatter & subagent propagation</div>
              </div>
              <span style="background: rgba(244, 114, 182, 0.2); color: #f472b6; padding: 4px 10px; border-radius: 12px; font-size: 0.82rem; font-weight: 700;">Broadcasting</span>
            </div>

            <div style="background: #020617; border: 1px solid rgba(168, 85, 247, 0.2); border-radius: 10px; padding: 14px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-weight: 700; color: #a855f7; font-size: 0.9rem;">TEMPORAL_DELTA</div>
                <div style="font-size: 0.8rem; color: #94a3b8;">Sequence k step transitions & SEU burn</div>
              </div>
              <span style="background: rgba(168, 85, 247, 0.2); color: #a855f7; padding: 4px 10px; border-radius: 12px; font-size: 0.82rem; font-weight: 700;">Monotonic</span>
            </div>

            <div style="background: #020617; border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 10px; padding: 14px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-weight: 700; color: #10b981; font-size: 0.9rem;">COHERENT_VERDICT</div>
                <div style="font-size: 0.8rem; color: #94a3b8;">Certified Dolphin Safe non-destructive status</div>
              </div>
              <span style="background: rgba(16, 185, 129, 0.2); color: #10b981; padding: 4px 10px; border-radius: 12px; font-size: 0.82rem; font-weight: 700;">Verified</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  `}window.fetchStadiumFeed=async function(){const i=document.getElementById("stadiumFeedContainer");if(i)try{const e=await fetch("/api/gmi/stadium/feed").then(t=>t.json());if(!e.stadium_feed||e.stadium_feed.length===0){i.innerHTML='<div style="color: #64748b; font-size: 0.9rem;">No chatter yet in the arena. Broadcast the first message above!</div>';return}i.innerHTML=e.stadium_feed.map(t=>`
      <div style="background: #020617; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 10px; padding: 14px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-weight: 800; color: #38bdf8; font-size: 0.88rem;">${t.speaker_id}</span>
            <span style="background: rgba(236, 72, 153, 0.15); border: 1px solid rgba(236, 72, 153, 0.3); color: #f472b6; padding: 2px 8px; border-radius: 10px; font-size: 0.72rem; font-weight: 700;">${t.category}</span>
          </div>
          <span style="font-size: 0.75rem; color: #64748b;">${new Date(t.timestamp).toLocaleTimeString()}</span>
        </div>
        <div style="color: #e2e8f0; font-size: 0.92rem; line-height: 1.5; margin-bottom: 8px;">
          "${t.raw_chatter}"
        </div>
        <div style="display: flex; gap: 14px; font-size: 0.78rem; color: #94a3b8;">
          <span><i class="fa-solid fa-face-smile" style="color: #10b981;"></i> Sentiment: ${(t.sentiment_score*100).toFixed(1)}%</span>
          <span><i class="fa-solid fa-wave-square" style="color: #a855f7;"></i> Resonance: ${(t.cross_lane_resonance*100).toFixed(1)}%</span>
        </div>
      </div>
    `).join("")}catch(e){i.innerHTML=`<div style="color: #ef4444; font-size: 0.9rem;">Error fetching stadium feed: ${e.message}</div>`}};window.broadcastToStadium=async function(){const i=document.getElementById("stadiumInputText"),e=document.getElementById("stadiumChannelSelect");if(!i||!i.value.trim())return;const t=i.value.trim(),a=e?e.value:"STADIUM_MAIN";try{(await fetch("/api/gmi/stadium/broadcast",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({channel:a,speaker:"max",chatterText:t})}).then(s=>s.json())).ok&&(i.value="",window.fetchStadiumFeed())}catch(o){alert(`Broadcast Error: ${o.message}`)}};function oe(){return`
    <div class="pqr-wiki-container" style="padding: 24px; color: #f8fafc; font-family: 'Outfit', 'Inter', sans-serif; background: #070a13; min-height: 100vh;">
      
      <!-- Wiki Top Hero Banner -->
      <div style="background: linear-gradient(135deg, rgba(14, 165, 233, 0.15), rgba(168, 85, 247, 0.15)); border: 1px solid rgba(14, 165, 233, 0.3); border-radius: 16px; padding: 32px; margin-bottom: 32px; backdrop-filter: blur(12px);">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
          <div>
            <div style="display: inline-flex; align-items: center; gap: 8px; background: rgba(14, 165, 233, 0.2); border: 1px solid #0ea5e9; padding: 6px 14px; border-radius: 20px; font-size: 0.82rem; font-weight: 700; color: #38bdf8; margin-bottom: 12px;">
              <i class="fa-solid fa-book-bookmark"></i> OFFICIAL SPECIFICATION & SUBSTRATE ARCHITECTURE
            </div>
            <h1 style="font-size: 2.2rem; font-weight: 800; margin: 0; background: linear-gradient(90deg, #38bdf8, #a855f7, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
              PQR Architectural Wiki — wiki.pqr.info
            </h1>
            <p style="color: #94a3b8; font-size: 1.05rem; margin-top: 8px; max-width: 780px; line-height: 1.6;">
              <strong>PQR = Pre-Qualified Record</strong>. Sovereign-27 is a self-referential, non-destructive, hash-verified temporal logic mesh running across 108 backend REST endpoints and multi-node Hetzner Threadripper architecture.
            </p>
          </div>
          <div style="text-align: right; background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255, 255, 255, 0.1); padding: 18px 24px; border-radius: 14px;">
            <div style="font-size: 0.85rem; color: #94a3b8;">Authoritative Node</div>
            <div style="font-size: 1.2rem; font-weight: 800; color: #10b981;">zeta.mh (46.224.219.174)</div>
            <div style="font-size: 0.8rem; color: #64748b; margin-top: 4px;">5D IPv6: fd5d:2700:4900::5</div>
          </div>
        </div>
      </div>

      <!-- Quick Navigation Tabs -->
      <div style="display: flex; gap: 12px; margin-bottom: 32px; overflow-x: auto; padding-bottom: 8px;">
        <button class="pqr-wiki-tab-btn active" onclick="switchWikiTab('overview')" style="background: rgba(14, 165, 233, 0.2); border: 1px solid #0ea5e9; color: #38bdf8; padding: 10px 20px; border-radius: 10px; font-weight: 700; cursor: pointer;">
          <i class="fa-solid fa-compass"></i> Overview & Philosophy
        </button>
        <button class="pqr-wiki-tab-btn" onclick="switchWikiTab('layers')" style="background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(255, 255, 255, 0.1); color: #94a3b8; padding: 10px 20px; border-radius: 10px; font-weight: 700; cursor: pointer;">
          <i class="fa-solid fa-layer-group"></i> 5-Layer Stack Architecture
        </button>
        <button class="pqr-wiki-tab-btn" onclick="switchWikiTab('seu')" style="background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(255, 255, 255, 0.1); color: #94a3b8; padding: 10px 20px; border-radius: 10px; font-weight: 700; cursor: pointer;">
          <i class="fa-solid fa-coins"></i> SEU Temporal Economy
        </button>
        <button class="pqr-wiki-tab-btn" onclick="switchWikiTab('oro')" style="background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(255, 255, 255, 0.1); color: #94a3b8; padding: 10px 20px; border-radius: 10px; font-weight: 700; cursor: pointer;">
          <i class="fa-solid fa-rotate"></i> PQR-ORO Ouroboros Loop
        </button>
        <button class="pqr-wiki-tab-btn" onclick="switchWikiTab('endpoints')" style="background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(255, 255, 255, 0.1); color: #94a3b8; padding: 10px 20px; border-radius: 10px; font-weight: 700; cursor: pointer;">
          <i class="fa-solid fa-network-wired"></i> Live Telemetry Inspector
        </button>
      </div>

      <!-- Tab Content Views -->

      <!-- Tab 1: Overview -->
      <div id="wikiTabOverview" class="wiki-tab-content" style="display: block;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; margin-bottom: 32px;">
          
          <div style="background: #0f172a; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 14px; padding: 24px;">
            <div style="font-size: 1.2rem; font-weight: 700; color: #38bdf8; margin-bottom: 12px;">
              <i class="fa-solid fa-cube"></i> What is a Pre-Qualified Record (PQR)?
            </div>
            <p style="color: #cbd5e1; font-size: 0.95rem; line-height: 1.6;">
              A <strong>PQR</strong> is a deterministic state machine vector where every future state (&omega;) must pre-qualify itself against the present state (&alpha;) before becoming authoritative.
            </p>
            <div style="background: #020617; border-left: 4px solid #38bdf8; padding: 14px; border-radius: 6px; font-family: monospace; font-size: 0.88rem; color: #e2e8f0; margin-top: 14px;">
              PQR = [&alpha;(T_NOW), &omega;(T_NEXT), Q_score, SHA256_PQR]
            </div>
          </div>

          <div style="background: #0f172a; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 14px; padding: 24px;">
            <div style="font-size: 1.2rem; font-weight: 700; color: #a855f7; margin-bottom: 12px;">
              <i class="fa-solid fa-scale-balanced"></i> Governing Coherent Value Equation
            </div>
            <p style="color: #cbd5e1; font-size: 0.95rem; line-height: 1.6;">
              Every computational action in Sovereign-27 has an immutable cost basis bound to physical compute time:
            </p>
            <div style="background: #020617; border-left: 4px solid #a855f7; padding: 14px; border-radius: 6px; font-family: monospace; font-size: 0.88rem; color: #e2e8f0; margin-top: 14px;">
              COST BASIS + COMP SPEND + CHAOS FRICTION = COHERENT VALUE
            </div>
          </div>

          <div style="background: #0f172a; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 14px; padding: 24px;">
            <div style="font-size: 1.2rem; font-weight: 700; color: #10b981; margin-bottom: 12px;">
              <i class="fa-solid fa-leaf"></i> Least Possible Verbosity (LPV)
            </div>
            <p style="color: #cbd5e1; font-size: 0.95rem; line-height: 1.6;">
              Verbosity equals entropy dissipation (D). High-efficiency agents minimize D to maximize useful work (W):
            </p>
            <div style="background: #020617; border-left: 4px solid #10b981; padding: 14px; border-radius: 6px; font-family: monospace; font-size: 0.88rem; color: #e2e8f0; margin-top: 14px;">
              &eta; = W / (W + D) &longrightarrow; 1.0000 | S_LPV = (W - D) / (W + D)
            </div>
          </div>

        </div>
      </div>

      <!-- Tab 2: 5-Layer Stack Architecture -->
      <div id="wikiTabLayers" class="wiki-tab-content" style="display: none;">
        <div style="display: flex; flex-direction: column; gap: 20px; margin-bottom: 32px;">
          
          <div style="background: #0f172a; border-left: 6px solid #38bdf8; border-radius: 12px; padding: 20px;">
            <div style="font-size: 1.1rem; font-weight: 800; color: #38bdf8;">1. TEMPORAL LAYER — Time Without Clocks</div>
            <p style="color: #cbd5e1; font-size: 0.92rem; margin-top: 6px; line-height: 1.5;">
              Eliminates NTP dependency, clock drift, jitter, and skew. Operates on strictly monotonic sequence IDs (k), atomic TNT (T_NOW) state vectors, T_NEXT predictive target states, and YTY macro-epoch boundary schedule (E_k).
            </p>
          </div>

          <div style="background: #0f172a; border-left: 6px solid #a855f7; border-radius: 12px; padding: 20px;">
            <div style="font-size: 1.1rem; font-weight: 800; color: #a855f7;">2. QUALIFICATION LAYER — Deterministic Stateflow</div>
            <p style="color: #cbd5e1; font-size: 0.92rem; margin-top: 6px; line-height: 1.5;">
              Evaluates PQR records (&alpha; &longrightarrow; &omega;) with qualification scoring Q. Binds records into irreversible Merkle-like root chains (PQR-ROOT) and drives automated self-referential Ouroboros cycles (PQR-ORO).
            </p>
          </div>

          <div style="background: #0f172a; border-left: 6px solid #f59e0b; border-radius: 12px; padding: 20px;">
            <div style="font-size: 1.1rem; font-weight: 800; color: #f59e0b;">3. ECONOMIC LAYER — SEU Substrate Engine</div>
            <p style="color: #cbd5e1; font-size: 0.92rem; margin-top: 6px; line-height: 1.5;">
              1 SEU = 1 word = 1 satoshi = 0.00000001 min compute (100M SEUs/min). Features linear past rewind cost, cubic future prediction cost, TVM bytecode opcodes, SEU staking yields, and collateralized lending.
            </p>
          </div>

          <div style="background: #0f172a; border-left: 6px solid #ec4899; border-radius: 12px; padding: 20px;">
            <div style="font-size: 1.1rem; font-weight: 800; color: #ec4899;">4. MESH LAYER — Multi-Node Topology & Correlation</div>
            <p style="color: #cbd5e1; font-size: 0.92rem; margin-top: 6px; line-height: 1.5;">
              256 Cubit MIDI lanes (16x16 grid), lane-to-lane cross-correlation pricing (R_ij), ZETAFOLDED multi-node tensor contraction (1/sqrt(2) = 0.7071 factor), and multi-hop mesh fold graphs across Hetzner Threadripper zeta.mh.
            </p>
          </div>

          <div style="background: #0f172a; border-left: 6px solid #10b981; border-radius: 12px; padding: 20px;">
            <div style="font-size: 1.1rem; font-weight: 800; color: #10b981;">5. HEALTH & GOVERNANCE LAYER — Self-Protecting Autonomy</div>
            <p style="color: #cbd5e1; font-size: 0.92rem; margin-top: 6px; line-height: 1.5;">
              Certified Dolphin Safe Neural Mesh telemetry (S_DS = &eta; * (1 - FFT_spike)), non-destructive health scoring, PQR-GOV efficiency-weighted agent voting, and GOV-ROOT Merkle policy enactment.
            </p>
          </div>

        </div>
      </div>

      <!-- Tab 3: SEU Temporal Economy -->
      <div id="wikiTabSeu" class="wiki-tab-content" style="display: none;">
        <div style="background: #0f172a; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 14px; padding: 24px; margin-bottom: 24px;">
          <h3 style="color: #f59e0b; font-size: 1.3rem; margin: 0 0 16px 0;">SEU Convertibility Matrix</h3>
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.92rem;">
            <thead>
              <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.1); color: #94a3b8;">
                <th style="padding: 10px;">Symbolic Unit</th>
                <th style="padding: 10px;">Compute Time Equivalent</th>
                <th style="padding: 10px;">Satoshi Equivalent</th>
                <th style="padding: 10px;">Linguistic Equivalent</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.05); color: #e2e8f0;">
                <td style="padding: 12px; font-weight: 700; color: #f59e0b;">1 SEU</td>
                <td style="padding: 12px;">0.00000001 Minutes</td>
                <td style="padding: 12px;">1 Satoshi</td>
                <td style="padding: 12px;">1 Word / Token</td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.05); color: #e2e8f0;">
                <td style="padding: 12px; font-weight: 700; color: #f59e0b;">100,000,000 SEUs</td>
                <td style="padding: 12px;">1.00 Minute</td>
                <td style="padding: 12px;">100,000,000 Satoshis (1 BTC)</td>
                <td style="padding: 12px;">100,000,000 Words</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tab 4: PQR-ORO Ouroboros Loop -->
      <div id="wikiTabOro" class="wiki-tab-content" style="display: none;">
        <div style="background: #0f172a; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 14px; padding: 24px; text-align: center;">
          <h3 style="color: #ec4899; font-size: 1.4rem; margin-bottom: 20px;">The Self-Referential Ouroboros Loop</h3>
          <div style="font-family: monospace; font-size: 1.1rem; color: #38bdf8; background: #020617; padding: 20px; border-radius: 12px; display: inline-block; text-align: left; line-height: 1.8;">
            T_NOW (Present State k) <br/>
            &nbsp;&nbsp;&DownArrow; [Predict &Delta;W]<br/>
            T_NEXT (Future State k+1)<br/>
            &nbsp;&nbsp;&DownArrow; [Pre-Qualify Q = 1.0]<br/>
            PQR Record<br/>
            &nbsp;&nbsp;&DownArrow; [Atomic WAL Swap]<br/>
            Commit &longrightarrow; Promoted T_NOW<br/>
            &nbsp;&nbsp;&DownArrow; [Merkle Hash Bind]<br/>
            ROOT Chain &longrightarrow; Next ORO Cycle
          </div>
        </div>
      </div>

      <!-- Tab 5: Live Telemetry Inspector -->
      <div id="wikiTabEndpoints" class="wiki-tab-content" style="display: none;">
        <div style="background: #0f172a; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 14px; padding: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
            <h3 style="color: #38bdf8; font-size: 1.3rem; margin: 0;">Live Backend Endpoint Telemetry Inspector</h3>
            <button onclick="fetchWikiTelemetry()" style="background: #0ea5e9; border: none; color: #fff; padding: 10px 18px; border-radius: 8px; font-weight: 700; cursor: pointer;">
              <i class="fa-solid fa-arrows-rotate"></i> Refresh Telemetry
            </button>
          </div>
          <div id="wikiTelemetryDisplay" style="background: #020617; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 10px; padding: 20px; font-family: monospace; font-size: 0.88rem; color: #10b981; max-height: 480px; overflow-y: auto;">
            Loading real-time stack telemetry from http://localhost:4000...
          </div>
        </div>
      </div>

    </div>
  `}window.switchWikiTab=function(i){document.querySelectorAll(".wiki-tab-content").forEach(t=>t.style.display="none"),document.querySelectorAll(".pqr-wiki-tab-btn").forEach(t=>{t.style.background="rgba(30, 41, 59, 0.8)",t.style.borderColor="rgba(255, 255, 255, 0.1)",t.style.color="#94a3b8"});const e=document.getElementById(`wikiTab${i.charAt(0).toUpperCase()+i.slice(1)}`);e&&(e.style.display="block"),event&&event.currentTarget&&(event.currentTarget.style.background="rgba(14, 165, 233, 0.2)",event.currentTarget.style.borderColor="#0ea5e9",event.currentTarget.style.color="#38bdf8"),i==="endpoints"&&window.fetchWikiTelemetry()};window.fetchWikiTelemetry=async function(){const i=document.getElementById("wikiTelemetryDisplay");if(i){i.innerHTML="Querying live endpoints...";try{const[e,t,a,o,s,r]=await Promise.all([fetch("/api/gmi/tnt/now").then(n=>n.json()).catch(n=>({error:n.message})),fetch("/api/gmi/pqr/records").then(n=>n.json()).catch(n=>({error:n.message})),fetch("/api/gmi/pqr/root/chain").then(n=>n.json()).catch(n=>({error:n.message})),fetch("/api/gmi/pqr/oro/history").then(n=>n.json()).catch(n=>({error:n.message})),fetch("/api/gmi/governance/proposals").then(n=>n.json()).catch(n=>({error:n.message})),fetch("/api/gmi/mesh/certified/status").then(n=>n.json()).catch(n=>({error:n.message}))]),d={timestamp:new Date().toISOString(),active_endpoints_count:108,master_node:"max",remote_node:"zeta.mh (46.224.219.174)",t_now_authoritative_state:e.t_now||e,pqr_latest_record:t.pqr_records?t.pqr_records[0]:t,pqr_root_chain_latest:a.chain?a.chain[0]:a,pqr_oro_latest_cycle:o.history?o.history[0]:o,governance_latest_proposal:s.proposals?s.proposals[0]:s,dolphin_safe_mesh_health:r.certified_telemetry||r};i.innerHTML=JSON.stringify(d,null,2)}catch(e){i.innerHTML=`Telemetry Fetch Error: ${e.message}`}}};function se(i){return`
    <div class="stories-section">
      <div class="section-header">
        <span class="section-title">
          <i class="fa-solid fa-water" style="color: var(--brand-primary);"></i> Dolphin Pods
        </span>
      </div>

      <div class="stories-scroll">
        ${i.map(e=>e.isAdd?`
              <div class="story-item" id="btnAddStory">
                <div class="story-ring add-story-ring">
                  <i class="fa-solid fa-plus"></i>
                </div>
                <span class="story-name">Add Story</span>
              </div>
            `:`
            <div class="story-item view-story-btn" data-story-id="${e.id}">
              <div class="story-ring ${e.unseen?"unseen":"seen"}">
                <img src="${e.avatar}" class="story-avatar" alt="${e.name}" />
              </div>
              <span class="story-name">${e.name.split(" ")[0]}</span>
            </div>
          `).join("")}
      </div>
    </div>
  `}function re(i){if(!i||!i.slides||i.slides.length===0)return"";const e=i.slides[0];return`
    <div class="modal-overlay active" id="storyModalOverlay" style="background: rgba(0,0,0,0.92);">
      <div style="position: relative; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: space-between; padding: 20px 16px;">
        
        <!-- Progress Bars -->
        <div style="display: flex; gap: 4px; z-index: 10;">
          <div style="flex: 1; height: 3px; background: rgba(255,255,255,0.4); border-radius: 2px; overflow: hidden;">
            <div style="width: 100%; height: 100%; background: #fff; animation: storyProgress 5s linear forwards;"></div>
          </div>
        </div>

        <!-- Story Author Top Bar -->
        <div style="display: flex; justify-content: space-between; align-items: center; z-index: 10; margin-top: 10px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <img src="${i.avatar}" style="width: 38px; height: 38px; border-radius: 50%; border: 2px solid var(--brand-primary);" />
            <div>
              <div style="font-weight: 700; color: #fff; font-size: 0.9rem;">${i.name}</div>
              <div style="font-size: 0.72rem; color: rgba(255,255,255,0.7);">Just now</div>
            </div>
          </div>
          <button id="btnCloseStoryModal" style="background: rgba(255,255,255,0.2); border: none; width: 34px; height: 34px; border-radius: 50%; color: #fff; cursor: pointer;">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Story Media Content -->
        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; align-items: center; justify-content: center;">
          <img src="${e.url}" style="width: 100%; height: 100%; object-fit: cover;" />
          <div style="position: absolute; bottom: 80px; left: 20px; right: 20px; background: rgba(0,0,0,0.6); backdrop-filter: blur(8px); padding: 12px 16px; border-radius: 16px; color: #fff; font-size: 0.9rem; border: 1px solid rgba(255,255,255,0.1);">
            ${e.caption}
          </div>
        </div>

        <!-- Bottom Reaction Quick Action -->
        <div style="display: flex; gap: 10px; z-index: 10; align-items: center;">
          <input type="text" placeholder="Send reply to ${i.name}..." style="flex: 1; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); padding: 10px 16px; border-radius: 25px; color: #fff; outline: none; font-size: 0.85rem;" />
          <button style="background: var(--brand-gradient); border: none; width: 42px; height: 42px; border-radius: 50%; color: #fff; cursor: pointer;">
            <i class="fa-solid fa-paper-plane"></i>
          </button>
        </div>

      </div>
    </div>
    <style>
      @keyframes storyProgress {
        from { width: 0%; }
        to { width: 100%; }
      }
    </style>
  `}function ne(i){return!i||i.length===0?`
      <div class="glass-card" style="text-align: center; padding: 30px;">
        <i class="fa-solid fa-water" style="font-size: 2.5rem; color: var(--brand-primary); margin-bottom: 10px;"></i>
        <h3 style="font-weight: 700;">No posts in proximity feed</h3>
        <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 4px;">Be the first to splash a local post in your pod!</p>
      </div>
    `:i.map(e=>{var o,s;const t=(o=e.userReacted)==null?void 0:o.dolphin,a=(s=e.userReacted)==null?void 0:s.like;return`
      <article class="glass-card post-card" data-post-id="${e.id}">
        <!-- Post Header -->
        <header class="post-header">
          <div class="post-author">
            <img src="${e.author.avatar}" class="author-avatar" alt="${e.author.name}" />
            <div class="author-info">
              <div class="author-name">
                ${e.author.name}
                ${e.author.verified?'<i class="fa-solid fa-circle-check badge-verified"></i>':""}
              </div>
              <span class="post-time">
                ${e.author.username} • ${e.time}
              </span>
            </div>
          </div>

          <span class="location-chip" style="font-size: 0.68rem; padding: 2px 8px;">
            <i class="fa-solid fa-location-dot"></i> ${e.locationTag||"📍 150m away"}
          </span>
        </header>

        <!-- Post Body Content -->
        <div class="post-body">
          ${e.content.replace(/\n/g,"<br/>")}
        </div>

        <!-- Post Media Attachment -->
        ${e.media?`
          <div class="post-media">
            <img src="${e.media}" alt="Post media" loading="lazy" />
          </div>
        `:""}

        <!-- Post Reaction Actions Bar -->
        <div class="post-actions">
          <div class="reaction-group">
            <button class="action-btn btn-dolphin ${t?"active-react":""}" data-action="react-dolphin" data-post-id="${e.id}">
              <i class="fa-solid fa-dolphin"></i>
              <span>${e.stats.dolphins}</span>
            </button>

            <button class="action-btn ${a?"active-react":""}" data-action="react-like" data-post-id="${e.id}">
              <i class="fa-regular fa-heart"></i>
              <span>${e.stats.likes}</span>
            </button>

            <button class="action-btn btn-toggle-comments" data-post-id="${e.id}">
              <i class="fa-regular fa-comment"></i>
              <span>${e.stats.comments}</span>
            </button>
          </div>

          <button class="action-btn btn-share-post" data-post-id="${e.id}">
            <i class="fa-regular fa-paper-plane"></i>
          </button>
        </div>

        <!-- Nested Interactive Comment Section -->
        <div class="comments-section" id="comments_${e.id}">
          ${(e.comments||[]).map(r=>`
            <div class="comment-item">
              <img src="${r.avatar}" class="comment-avatar" alt="${r.author}" />
              <div class="comment-bubble">
                <div class="comment-author">${r.author} <span style="font-weight: normal; color: var(--text-muted); font-size: 0.7rem;">${r.time}</span></div>
                <div>${r.text}</div>
              </div>
            </div>
          `).join("")}

          <div class="comment-input-box">
            <input type="text" placeholder="Write a comment..." id="inputComment_${e.id}" />
            <button class="btn-primary btn-submit-comment" data-post-id="${e.id}" style="width: auto; padding: 6px 14px; font-size: 0.8rem;">
              Post
            </button>
          </div>
        </div>
      </article>
    `}).join("")}function de(i){return`
    <div class="modal-overlay" id="createPostModalOverlay">
      <div class="modal-sheet">
        <div class="sheet-handle"></div>
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h2 style="font-family: var(--font-display); font-size: 1.1rem; font-weight: 800;">Create Location Post</h2>
          <button id="btnCloseCreateModal" style="background: transparent; border: none; color: var(--text-muted); font-size: 1.2rem; cursor: pointer;">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 14px;">
          <img src="${i.auth.user.avatar}" style="width: 38px; height: 38px; border-radius: 50%;" />
          <div>
            <div style="font-weight: 700; font-size: 0.9rem;">${i.auth.user.name}</div>
            <span class="location-chip" style="font-size: 0.65rem; margin-top: 2px;">
              <i class="fa-solid fa-location-dot"></i> Coastal Mesh • South Beach
            </span>
          </div>
        </div>

        <div class="form-group">
          <textarea id="postContentInput" class="form-input" rows="4" placeholder="What's happening in your local pod?" style="resize: none;"></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Image URL (Optional)</label>
          <input type="url" id="postMediaInput" class="form-input" placeholder="https://images.unsplash.com/..." />
        </div>

        <div style="display: flex; gap: 10px; margin-top: 20px;">
          <button id="btnPublishPost" class="btn-primary">
            <i class="fa-solid fa-paper-plane" style="margin-right: 6px;"></i> Broadcast to Proximity Mesh
          </button>
        </div>
      </div>
    </div>
  `}function le(i=5e3,e=[]){const t=c.getNearbyPeers().filter(a=>a.distanceMeters<=i);return g.getCelestialObjects(i),c.currentLocation,`
    <div class="radar-section">
      <!-- Top Title & Proximity Radius Slider -->
      <div class="glass-card" style="margin-bottom: 14px;">
        <div class="section-header" style="margin-bottom: 10px;">
          <span class="section-title">
            <i class="fa-solid fa-compass" style="color: var(--brand-primary); font-size: 1.1rem;"></i> 5D Mesh Radar
          </span>
          <span class="location-chip">
            <i class="fa-solid fa-location-dot"></i> GPS Active
          </span>
        </div>

        <div style="display: flex; gap: 8px; margin-bottom: 10px;">
          <button id="btnScanBleWifiNeighbors" class="btn-primary" style="flex: 1; padding: 10px; font-size: 0.8rem; font-weight: 800; border-radius: 10px; background: linear-gradient(135deg, #10b981, #0ea5e9); display: flex; align-items: center; justify-content: center; gap: 8px;">
            <i class="fa-brands fa-bluetooth-b"></i> <i class="fa-solid fa-wifi"></i> Scan Neighbors (Bluetooth / Wi-Fi Direct)
          </button>
        </div>

        <div style="margin-top: 10px;">
          <div style="display: flex; justify-content: space-between; font-size: 0.78rem; font-weight: 700; color: var(--text-muted); margin-bottom: 4px;">
            <span>Discovery Radius:</span>
            <strong style="color: var(--brand-primary);">${i<1e3?i+"m":(i/1e3).toFixed(1)+"km"}</strong>
          </div>
          <input type="range" id="radarRadiusSlider" min="200" max="10000" step="200" value="${i}" style="width: 100%; accent-color: var(--brand-primary); cursor: pointer;" />
        </div>
      </div>

      <!-- Discovered BLE / Wi-Fi Direct Peers Banner -->
      ${e.length>0?`
        <div class="glass-card" style="margin-bottom: 14px; padding: 12px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3);">
          <div style="font-weight: 700; font-size: 0.8rem; color: #34d399; margin-bottom: 6px;">
            <i class="fa-solid fa-signal"></i> Active BLE / Wi-Fi Neighbors (${e.length}):
          </div>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            ${e.map(a=>`
              <div style="display: flex; justify-content: space-between; font-size: 0.7rem; padding: 4px 8px; background: rgba(0,0,0,0.3); border-radius: 6px;">
                <span><strong>${a.name}</strong> (${a.protocol})</span>
                <span style="color: #10b981; font-weight: 700;">${a.distanceMeters}m | ${a.rssi}dBm</span>
              </div>
            `).join("")}
          </div>
        </div>
      `:""}

      <!-- Animated Radar Display Canvas -->
      <div class="glass-card radar-canvas-container" style="text-align: center; padding: 20px 10px; position: relative; overflow: hidden;">
        <div class="radar-sweep-wrapper">
          <div class="radar-ring ring-1"></div>
          <div class="radar-ring ring-2"></div>
          <div class="radar-ring ring-3"></div>
          <div class="radar-crosshair-v"></div>
          <div class="radar-crosshair-h"></div>
          <div class="radar-sweep-beam"></div>

          <!-- Center User Marker -->
          <div class="radar-center-dot" title="You are here (5D Node)">
            <i class="fa-solid fa-dolphin" style="font-size: 0.8rem; color: #fff;"></i>
          </div>

          <!-- Dynamic Mesh Peer Blips on Radar (Green) -->
          ${t.map(a=>{const o=Math.min(a.distanceMeters/i*42,42),s=a.angle*Math.PI/180,r=50-o*Math.cos(s),d=50+o*Math.sin(s);return`
              <div class="radar-peer-blip" style="top: ${r}%; left: ${d}%;" data-peer-id="${a.id}">
                <img src="${a.avatar}" class="blip-avatar" />
                <span class="blip-ping"></span>
              </div>
            `}).join("")}
        </div>
      </div>

      <!-- Nearby Peers List View -->
      <div style="margin-top: 14px;">
        <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted); margin-bottom: 8px;">
          Nearby Proximity Mesh Nodes (${t.length})
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${t.map(a=>`
            <div class="glass-card" style="padding: 10px 14px; display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <img src="${a.avatar}" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover;" />
                <div>
                  <div style="font-weight: 700; font-size: 0.85rem;">${a.name}</div>
                  <div style="font-size: 0.7rem; color: var(--text-muted);">${a.status}</div>
                </div>
              </div>
              <button class="btn-primary open-direct-chat-btn" data-user-name="${a.name}" data-user-avatar="${a.avatar}" style="padding: 6px 10px; font-size: 0.7rem; border-radius: 8px;">
                Message (${a.distanceMeters}m)
              </button>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `}function ce(i,e=null){if(e){const t=i.find(a=>a.id===e);if(t)return pe(t)}return`
    <div class="chat-section">
      <div class="section-header" style="margin-bottom: 14px;">
        <span class="section-title">
          <i class="fa-solid fa-comments" style="color: var(--brand-primary);"></i> Dolphin Chat
        </span>
        <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">
          Direct Messages
        </span>
      </div>

      <div class="chat-list">
        ${i.map(t=>`
          <div class="chat-item open-chat-btn" data-chat-id="${t.id}">
            <div class="chat-avatar-wrap">
              <img src="${t.user.avatar}" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover;" />
              ${t.user.online?'<span class="online-indicator"></span>':""}
            </div>
            
            <div class="chat-details">
              <div class="chat-user">
                <span>${t.user.name}</span>
                <span style="font-size: 0.7rem; color: var(--text-muted); font-weight: normal;">${t.time}</span>
              </div>
              <div class="chat-last-msg">
                ${t.lastMessage}
              </div>
            </div>

            ${t.unread>0?`
              <span class="badge-count" style="position: static; font-size: 0.7rem;">${t.unread}</span>
            `:""}
          </div>
        `).join("")}
      </div>
    </div>
  `}function pe(i){return`
    <div class="chat-window">
      <!-- Chat Header -->
      <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 12px; border-bottom: 1px solid var(--border-color); margin-bottom: 12px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <button id="btnBackToChatList" class="icon-btn" style="width: 32px; height: 32px;">
            <i class="fa-solid fa-arrow-left"></i>
          </button>
          <img src="${i.user.avatar}" style="width: 36px; height: 36px; border-radius: 50%;" />
          <div>
            <div style="font-weight: 700; font-size: 0.9rem;">${i.user.name}</div>
            <div style="font-size: 0.7rem; color: #10b981; font-weight: 600;">${i.user.online?"Active now":"Offline"}</div>
          </div>
        </div>

        <div style="display: flex; gap: 8px;">
          <button class="icon-btn" style="width: 32px; height: 32px;"><i class="fa-solid fa-phone"></i></button>
          <button class="icon-btn" style="width: 32px; height: 32px;"><i class="fa-solid fa-video"></i></button>
        </div>
      </div>

      <!-- Messages History Container -->
      <div style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 4px; padding-right: 4px;" id="chatMessagesContainer">
        ${i.messages.map(e=>`
          <div class="msg-bubble ${e.sender==="me"?"sent":"received"}">
            <div>${e.text}</div>
            <div style="font-size: 0.65rem; opacity: 0.7; text-align: right; margin-top: 3px;">${e.time}</div>
          </div>
        `).join("")}
      </div>

      <!-- Message Input Bar -->
      <div style="display: flex; gap: 8px; margin-top: 12px; padding-top: 8px; border-top: 1px solid var(--border-color);">
        <input type="text" id="inputChatMessage" placeholder="Type a message..." class="form-input" style="border-radius: 24px; padding: 10px 16px;" />
        <button id="btnSendChatMessage" data-chat-id="${i.id}" class="btn-primary" style="width: 44px; height: 44px; border-radius: 50%; padding: 0; display: flex; align-items: center; justify-content: center;">
          <i class="fa-solid fa-paper-plane"></i>
        </button>
      </div>
    </div>
  `}function ge(i){return`
    <div class="groups-section">
      <div class="section-header" style="margin-bottom: 14px;">
        <span class="section-title">
          <i class="fa-solid fa-layer-group" style="color: var(--brand-primary);"></i> Community Pods
        </span>
        <button class="action-btn" style="color: var(--brand-primary);">
          <i class="fa-solid fa-plus"></i> Create Pod
        </button>
      </div>

      <div class="groups-list">
        ${i.map(e=>`
          <div class="glass-card" style="padding: 0; overflow: hidden;">
            <div style="height: 100px; position: relative;">
              <img src="${e.cover}" style="width: 100%; height: 100%; object-fit: cover;" />
              <span style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); font-size: 0.68rem; font-weight: 700; color: #fff; padding: 4px 8px; border-radius: 12px;">
                ${e.category}
              </span>
            </div>

            <div style="padding: 14px;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
                <div>
                  <h3 style="font-weight: 800; font-size: 0.98rem; font-family: var(--font-display);">${e.name}</h3>
                  <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">
                    <i class="fa-solid fa-users" style="margin-right: 4px; color: var(--brand-primary);"></i>
                    ${e.membersCount.toLocaleString()} Members
                  </div>
                </div>

                <button class="btn-primary btn-toggle-group" data-group-id="${e.id}" style="width: auto; padding: 6px 14px; font-size: 0.78rem; ${e.isJoined?"background: rgba(255,255,255,0.1); box-shadow: none;":""}">
                  ${e.isJoined?"Joined ✓":"Join Pod"}
                </button>
              </div>

              <p style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.4; margin-top: 8px;">
                ${e.description}
              </p>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `}function me(i,e){return`
    <div class="profile-section">
      <!-- Cover & Header -->
      <div class="glass-card" style="padding: 0; overflow: hidden; position: relative;">
        <div style="height: 120px; background: var(--brand-gradient); position: relative;">
          <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.4;" />
          <button id="btnProfileEdit" class="icon-btn" style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.5);">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
        </div>

        <div style="padding: 0 16px 16px 16px; margin-top: -36px; position: relative;">
          <div style="display: flex; justify-content: space-between; align-items: flex-end;">
            <img src="${i.avatar}" style="width: 76px; height: 76px; border-radius: 50%; border: 4px solid var(--bg-dark); object-fit: cover; box-shadow: var(--brand-glow);" />
            
            <div style="display: flex; gap: 8px;">
              <button class="btn-primary" id="btnOpenStudioFromProfile" style="width: auto; padding: 6px 14px; font-size: 0.8rem;">
                <i class="fa-solid fa-palette" style="margin-right: 4px;"></i> Whitelabel Studio
              </button>
            </div>
          </div>

          <div style="margin-top: 10px;">
            <h2 style="font-size: 1.15rem; font-weight: 800; font-family: var(--font-display); display: flex; align-items: center; gap: 6px;">
              ${i.name}
              <i class="fa-solid fa-circle-check badge-verified"></i>
            </h2>
            <div style="font-size: 0.8rem; color: var(--text-muted);">@${i.username}</div>
            
            <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 8px;">
              <span style="display: inline-flex; align-items: center; gap: 6px; background: rgba(var(--brand-primary-rgb), 0.15); color: var(--brand-primary); padding: 4px 10px; border-radius: 12px; font-size: 0.72rem; font-weight: 700;">
                <i class="fa-solid fa-shield-halved"></i> 5D Mesh Node Master
              </span>
              <span style="display: inline-flex; align-items: center; gap: 6px; background: rgba(251, 146, 60, 0.15); color: #fb923c; padding: 4px 10px; border-radius: 12px; font-size: 0.72rem; font-weight: 700;">
                <i class="fa-solid fa-atom"></i> ${g.userQuantumEnergy} Quantum Energy
              </span>
            </div>

            <p style="font-size: 0.84rem; color: var(--text-main); margin-top: 10px; line-height: 1.4;">
              5D Mesh Participant chasing celestial anomalies, aligning harmonic frequencies, and operating localized autonomous proximity nodes 🌌⚡
            </p>
          </div>

          <!-- Stats Grid -->
          <div style="display: flex; justify-content: space-around; margin-top: 16px; padding-top: 14px; border-top: 1px solid var(--border-color); text-align: center;">
            <div>
              <div style="font-weight: 800; font-size: 1.1rem; font-family: var(--font-display);">${g.alignedObjects.length}</div>
              <div style="font-size: 0.72rem; color: var(--text-muted);">Aligned Objects</div>
            </div>
            <div>
              <div style="font-weight: 800; font-size: 1.1rem; font-family: var(--font-display);">2.4k</div>
              <div style="font-size: 0.72rem; color: var(--text-muted);">Mesh Peers</div>
            </div>
            <div>
              <div style="font-weight: 800; font-size: 1.1rem; font-family: var(--font-display); color: #06b6d4;">${i.karma}</div>
              <div style="font-size: 0.72rem; color: var(--text-muted);">Karma 🐬</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Aligned Celestial Catalog -->
      <div class="glass-card">
        <h3 style="font-size: 0.9rem; font-weight: 700; margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
          <i class="fa-solid fa-sun" style="color: #fb923c;"></i> Aligned Celestial Beacons Catalog (${g.alignedObjects.length})
        </h3>
        
        ${g.alignedObjects.length===0?`
          <div style="font-size: 0.8rem; color: var(--text-muted); text-align: center; padding: 16px 0;">
            No aligned celestial objects yet. Open the <strong>Radar</strong> tab to find and align nearby celestial beacons!
          </div>
        `:`
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${g.alignedObjects.map(t=>`
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: rgba(255,255,255,0.04); border-radius: 12px; border-left: 3px solid ${t.color};">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <i class="fa-solid ${t.icon}" style="color: ${t.color}; font-size: 1.1rem;"></i>
                  <div>
                    <strong style="font-size: 0.84rem;">${t.name}</strong>
                    <div style="font-size: 0.68rem; color: var(--text-muted);">${t.targetFreq}Hz • Aligned at ${t.alignedAt}</div>
                  </div>
                </div>
                <span style="font-size: 0.75rem; color: #10b981; font-weight: 700;">+${t.energy} QE</span>
              </div>
            `).join("")}
          </div>
        `}
      </div>
    </div>
  `}function fe(i){return`
    <div class="notifications-section">
      <div class="section-header" style="margin-bottom: 14px;">
        <span class="section-title">
          <i class="fa-solid fa-bell" style="color: var(--brand-primary);"></i> Activity Center
        </span>
        <button class="action-btn" id="btnMarkAllRead" style="font-size: 0.75rem; color: var(--brand-primary);">
          Mark all read
        </button>
      </div>

      <div class="notifications-list">
        ${i.map(e=>`
          <div class="glass-card" style="padding: 12px; margin-bottom: 8px; display: flex; align-items: center; gap: 12px; ${e.read?"":"border-left: 3px solid var(--brand-primary);"}">
            <img src="${e.avatar}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" />
            <div style="flex: 1; font-size: 0.82rem;">
              <div>
                <strong>${e.user}</strong> ${e.text}
              </div>
              <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 2px;">
                ${e.time}
              </div>
            </div>
            ${e.type==="dolphin"?'<i class="fa-solid fa-dolphin" style="color: #06b6d4; font-size: 1.1rem;"></i>':""}
          </div>
        `).join("")}
      </div>
    </div>
  `}function ue(i){return`
    <div class="modal-overlay" id="whitelabelStudioModalOverlay">
      <div class="modal-sheet">
        <div class="sheet-handle"></div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <div>
            <h2 style="font-family: var(--font-display); font-size: 1.15rem; font-weight: 800; display: flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-wand-magic-sparkles" style="color: var(--brand-primary);"></i> Whitelabel Studio
            </h2>
            <p style="font-size: 0.75rem; color: var(--text-muted);">Customize your Dolphin Android App live</p>
          </div>

          <button id="btnCloseStudioModal" style="background: transparent; border: none; color: var(--text-muted); font-size: 1.2rem; cursor: pointer;">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Section 1: App Identity -->
        <div class="form-group">
          <label class="form-label">Application Name</label>
          <input type="text" id="studioAppNameInput" class="form-input" value="${i.appName}" />
        </div>

        <!-- Section 2: Connection & Proximity Mode -->
        <div class="form-group">
          <label class="form-label">Backend Connection Mode</label>
          <select id="studioConnectionModeSelect" class="form-select">
            <option value="GCP_REDIS" ${i.connectionMode==="GCP_REDIS"?"selected":""}>Google Cloud Redis Memorystore (pqr-info-5d-mesh)</option>
            <option value="INDEPENDENT" ${i.connectionMode==="INDEPENDENT"?"selected":""}>Autonomous Independent Mode (Offline Mesh / Serverless)</option>
            <option value="MOCK" ${i.connectionMode==="MOCK"?"selected":""}>Standalone Demo Mode (Mock Engine)</option>
            <option value="LIVE_UNA" ${i.connectionMode==="LIVE_UNA"?"selected":""}>Live UNA / Dolphin REST API Server</option>
          </select>
        </div>

        <div class="form-group" id="studioServerUrlGroup">
          <label class="form-label">GCP Project & Endpoint</label>
          <input type="text" id="studioServerUrlInput" class="form-input" value="Project: pqr-info-5d-mesh (Host: ${i.gcpRedisHost||"10.140.0.8:6379"})" readonly />
        </div>

        <!-- Section 3: Theme Presets -->
        <div class="form-group">
          <label class="form-label">Brand Color Preset</label>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            ${Object.keys(P).map(e=>{const t=P[e],a=i.presetKey===e;return`
                <div class="preset-card ${a?"selected":""}" data-preset="${e}" style="border: 1.5px solid ${a?"var(--brand-primary)":"var(--border-color)"}; background: rgba(255,255,255,0.04); padding: 10px; border-radius: 12px; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                  <div style="width: 20px; height: 20px; border-radius: 50%; background: linear-gradient(135deg, ${t.primary}, ${t.secondary}); flex-shrink: 0;"></div>
                  <span style="font-size: 0.78rem; font-weight: 600;">${t.name.split(" ")[0]}</span>
                </div>
              `}).join("")}
          </div>
        </div>

        <!-- Section 4: Color Hex Pickers -->
        <div class="form-group">
          <label class="form-label">Custom Brand Colors</label>
          <div style="display: flex; gap: 10px;">
            <div style="flex: 1;">
              <span style="font-size: 0.7rem; color: var(--text-muted);">Primary</span>
              <input type="color" id="studioPrimaryColorPicker" value="${i.primaryColor}" style="width: 100%; height: 36px; border: none; border-radius: 8px; cursor: pointer; background: transparent;" />
            </div>
            <div style="flex: 1;">
              <span style="font-size: 0.7rem; color: var(--text-muted);">Secondary</span>
              <input type="color" id="studioSecondaryColorPicker" value="${i.secondaryColor}" style="width: 100%; height: 36px; border: none; border-radius: 8px; cursor: pointer; background: transparent;" />
            </div>
          </div>
        </div>

        <!-- Section 5: Dark / Light Mode -->
        <div class="form-group">
          <label class="form-label">Appearance Theme</label>
          <div style="display: flex; gap: 10px;">
            <button class="btn-primary studio-theme-btn" data-mode="dark" style="flex: 1; ${i.themeMode==="dark"?"":"background: rgba(255,255,255,0.1); box-shadow: none;"}">
              <i class="fa-solid fa-moon"></i> Dark Mode
            </button>
            <button class="btn-primary studio-theme-btn" data-mode="light" style="flex: 1; ${i.themeMode==="light"?"":"background: rgba(255,255,255,0.1); box-shadow: none;"}">
              <i class="fa-solid fa-sun"></i> Light Mode
            </button>
          </div>
        </div>

        <!-- Action Buttons -->
        <div style="display: flex; gap: 10px; margin-top: 20px;">
          <button id="btnSaveWhitelabelConfig" class="btn-primary" style="flex: 2;">
            <i class="fa-solid fa-check" style="margin-right: 6px;"></i> Apply Changes
          </button>
          <button id="btnExportConfigJson" class="btn-primary" style="flex: 1; background: rgba(255,255,255,0.1); box-shadow: none;">
            <i class="fa-solid fa-download"></i> Export JSON
          </button>
        </div>

      </div>
    </div>
  `}function he(i){return g.getCelestialObjects(1e4),`
    <div class="admin-section">
      <!-- Admin Header Banner -->
      <div class="glass-card" style="margin-bottom: 14px; background: linear-gradient(135deg, rgba(14,165,233,0.15) 0%, rgba(99,102,241,0.15) 100%); border-color: var(--border-highlight);">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h2 style="font-family: var(--font-display); font-size: 1.15rem; font-weight: 800; display: flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-shield-halved" style="color: var(--brand-primary);"></i> Sovereign-27 Real Backend
            </h2>
            <span style="font-size: 0.75rem; color: var(--text-muted);">API Server: <strong>http://localhost:4050</strong></span>
          </div>

          <span id="backendStatusChip" class="location-chip" style="font-size: 0.7rem; background: #10b98122; color: #10b981; border-color: #10b98144;">
            <i class="fa-solid fa-server"></i> Connecting to Backend...
          </span>
        </div>

        <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 10px; background: rgba(0,0,0,0.25); padding: 8px 12px; border-radius: 8px; font-family: monospace;">
          Disk DB Path: <span id="diskDbPathDisplay" style="color: #10b981;">data/pqlite_gmi_mesh.db</span> (SQLite WAL)
        </div>
      </div>

      <!-- Sovereign-27 Real Stack Pipeline Execution -->
      <div class="glass-card" style="margin-bottom: 14px; border-color: rgba(16,185,129,0.4);">
        <div class="section-header" style="margin-bottom: 10px;">
          <span class="section-title" style="font-size: 0.95rem;">
            <i class="fa-solid fa-play" style="color: #10b981;"></i> Sovereign-27 Real Pipeline Execution
          </span>

          <button id="btnRunRealSovereign27" class="btn-primary" style="width: auto; padding: 4px 12px; font-size: 0.72rem; background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);">
            <i class="fa-solid fa-code" style="margin-right: 4px;"></i> Execute Real API Calls
          </button>
        </div>

        <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 10px;">
          Calls real Express/SQLite backend endpoints (/api/gmi/...) and writes persistent records on disk.
        </div>

        <div id="realPipelineLog" style="display: flex; flex-direction: column; gap: 6px; font-family: monospace; font-size: 0.72rem; background: rgba(0,0,0,0.4); padding: 10px; border-radius: 8px; max-height: 180px; overflow-y: auto;">
          <span style="color: var(--text-muted);">Click "Execute Real API Calls" to run live server operations.</span>
        </div>
      </div>

      <!-- Real Memory Search (http://localhost:4050/api/gmi/searchMemory) -->
      <div class="glass-card" style="margin-bottom: 14px;">
        <div class="section-header" style="margin-bottom: 10px;">
          <span class="section-title" style="font-size: 0.95rem;">
            <i class="fa-solid fa-magnifying-glass" style="color: var(--brand-primary);"></i> Real Disk Memory Search
          </span>
        </div>

        <div class="form-group" style="margin-bottom: 8px;">
          <div style="display: flex; gap: 8px;">
            <input type="text" id="realSearchInput" class="form-input" placeholder="Search disk memory..." value="Sovereign-27" style="font-size: 0.8rem;" />
            <button id="btnRealSearchMemory" class="btn-primary" style="width: auto; padding: 8px 14px; font-size: 0.78rem;">
              Search Server
            </button>
          </div>
        </div>

        <div id="realSearchResult" style="display: flex; flex-direction: column; gap: 6px; font-family: monospace; font-size: 0.72rem;"></div>
      </div>

      <!-- Real PQLite SQL Console -->
      <div class="glass-card" style="margin-bottom: 14px; border-color: rgba(6,182,212,0.4);">
        <div class="section-header" style="margin-bottom: 10px;">
          <span class="section-title" style="font-size: 0.95rem;">
            <i class="fa-solid fa-database" style="color: #06b6d4;"></i> Real PQLite SQL Query Engine
          </span>
        </div>

        <div class="form-group" style="margin-bottom: 10px;">
          <div style="display: flex; gap: 8px;">
            <input type="text" id="realSqlInput" class="form-input" value="SELECT * FROM memory_page" style="font-family: monospace; font-size: 0.8rem;" />
            <button id="btnRunRealSql" class="btn-primary" style="width: auto; padding: 8px 14px; font-size: 0.78rem; background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);">
              Execute SQL
            </button>
          </div>
        </div>

        <div id="realSqlResult" style="display: flex; flex-direction: column; gap: 6px; font-family: monospace; font-size: 0.72rem;"></div>
      </div>

      <!-- Celestial Anomaly Spawner Control -->
      <div class="glass-card">
        <div class="section-header" style="margin-bottom: 10px;">
          <span class="section-title" style="font-size: 0.95rem;">
            <i class="fa-solid fa-wand-magic-sparkles" style="color: #fb923c;"></i> Spawn Celestial Anomaly
          </span>
        </div>

        <div class="form-group">
          <select id="adminSpawnTypeSelect" class="form-select">
            ${Object.keys(p).map(e=>`
              <option value="${e}">${p[e].name}</option>
            `).join("")}
          </select>
        </div>

        <button id="btnAdminTriggerSpawn" class="btn-primary" style="background: linear-gradient(135deg, #fb923c 0%, #f43f5e 100%);">
          <i class="fa-solid fa-bolt" style="margin-right: 6px;"></i> Broadcast & Spawn Celestial Object
        </button>
      </div>
    </div>
  `}function be(i,e=432){if(!i)return"";const t=Math.abs(i.targetFreq-e),a=Math.max(0,100-t*1.5).toFixed(0);return`
    <div class="modal-overlay active" id="celestialModalOverlay" style="background: rgba(0,0,0,0.88);">
      <div class="modal-sheet" style="border-top-color: ${i.color};">
        <div class="sheet-handle"></div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="width: 36px; height: 36px; border-radius: 50%; background: ${i.color}22; color: ${i.color}; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; border: 1px solid ${i.color};">
              <i class="fa-solid ${i.icon}"></i>
            </div>
            <div>
              <h2 style="font-family: var(--font-display); font-size: 1.1rem; font-weight: 800;">${i.name}</h2>
              <span style="font-size: 0.72rem; color: ${i.color}; font-weight: 700; text-transform: uppercase;">
                ${i.rarity} • ${i.distanceMeters}m away
              </span>
            </div>
          </div>

          <button id="btnCloseCelestialModal" style="background: transparent; border: none; color: var(--text-muted); font-size: 1.2rem; cursor: pointer;">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Resonance Alignment Target Gauge -->
        <div class="glass-card" style="text-align: center; padding: 20px 14px; background: rgba(0,0,0,0.3); border-color: ${i.color}44;">
          <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">
            Target Harmonic Resonance
          </div>

          <div style="font-size: 2.2rem; font-weight: 800; font-family: var(--font-display); color: ${i.color}; text-shadow: 0 0 20px ${i.color}aa;">
            ${i.targetFreq} <span style="font-size: 1.1rem;">Hz</span>
          </div>

          <!-- Live Frequency Tuner Readout -->
          <div style="margin-top: 16px; padding: 12px; background: rgba(255,255,255,0.04); border-radius: 14px;">
            <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">
              <span>Tuned Frequency: <strong style="color: var(--text-main);">${e} Hz</strong></span>
              <span style="color: ${a>85?"#10b981":"#fb923c"};">${a}% Resonance</span>
            </div>

            <input type="range" id="celestialFreqSlider" min="400" max="1000" step="1" value="${e}" style="width: 100%; accent-color: ${i.color}; cursor: pointer;" />
          </div>

          <!-- Resonance Visual Meter -->
          <div style="height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; margin-top: 12px; overflow: hidden;">
            <div style="width: ${a}%; height: 100%; background: ${i.color}; transition: width 0.1s linear;"></div>
          </div>
        </div>

        <!-- Alignment Reward Info -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin: 14px 0;">
          <div style="font-size: 0.8rem; color: var(--text-muted);">
            Potential Reward: <strong style="color: #06b6d4;">+${i.energy} Quantum Energy</strong>
          </div>
          <span style="font-size: 0.72rem; color: var(--text-muted);">Expires in ${i.expiresIn}</span>
        </div>

        <button id="btnTriggerHarmonicAlign" data-object-id="${i.id}" class="btn-primary" style="background: linear-gradient(135deg, ${i.color} 0%, var(--brand-secondary) 100%); box-shadow: 0 8px 32px ${i.color}55;">
          <i class="fa-solid fa-atom" style="margin-right: 6px;"></i> Align Harmonic Frequency
        </button>

      </div>
    </div>
  `}const D={HEAD:{id:"HEAD",name:"Head Center",type:"Inspiration",shape:"triangle-up"},AJNA:{id:"AJNA",name:"Ajna Center",type:"Conceptualization",shape:"triangle-down"},THROAT:{id:"THROAT",name:"Throat Center",type:"Manifestation",shape:"square"},G_CENTER:{id:"G_CENTER",name:"G-Center",type:"Identity & Direction",shape:"diamond"},HEART:{id:"HEART",name:"Heart / Ego Center",type:"Willpower",shape:"triangle-right"},SOLAR_PLEXUS:{id:"SOLAR_PLEXUS",name:"Solar Plexus",type:"Emotional Awareness",shape:"triangle-right"},SACRAL:{id:"SACRAL",name:"Sacral Center",type:"Life Force Energy",shape:"square"},SPLEEN:{id:"SPLEEN",name:"Spleen Center",type:"Intuition & Health",shape:"triangle-left"},ROOT:{id:"ROOT",name:"Root Center",type:"Adrenaline Pressure",shape:"square"}},W=[{userId:"u101",name:"Antigravity Dev (You)",avatar:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",type:"Manifesting Generator",profile:"1/3 Investigator/Martyr",authority:"Sacral Authority",definition:"Split Definition",activeGates:[34,20,64,47,1,8,59,6],definedCenters:["SACRAL","THROAT","HEAD","AJNA","G_CENTER"]},{userId:"peer_1",name:"Sarah Jenkins",avatar:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80",type:"Projector",profile:"2/4 Hermit/Opportunist",authority:"Emotional Authority",definition:"Single Definition",activeGates:[43,23,28,38,39,55,37,40],definedCenters:["AJNA","THROAT","SPLEEN","SOLAR_PLEXUS","HEART"]},{userId:"peer_2",name:"Alex Rivera",avatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",type:"Manifestor",profile:"4/6 Opportunist/Role Model",authority:"Splenic Authority",definition:"Single Definition",activeGates:[21,45,10,20,28,38],definedCenters:["HEART","THROAT","G_CENTER","SPLEEN","ROOT"]},{userId:"peer_3",name:"Elena Rostova",avatar:"https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80",type:"Generator",profile:"5/1 Heretic/Investigator",authority:"Sacral Authority",definition:"Single Definition",activeGates:[59,6,34,20,64,47],definedCenters:["SACRAL","SOLAR_PLEXUS","THROAT","HEAD","AJNA"]}],ve=[{id:"34-20",name:"Channel of Charisma",from:"SACRAL",to:"THROAT",gates:[34,20]},{id:"64-47",name:"Channel of Abstraction",from:"HEAD",to:"AJNA",gates:[64,47]},{id:"43-23",name:"Channel of Structuring",from:"AJNA",to:"THROAT",gates:[43,23]},{id:"1-8",name:"Channel of Inspiration",from:"G_CENTER",to:"THROAT",gates:[1,8]},{id:"10-20",name:"Channel of Awakening",from:"G_CENTER",to:"THROAT",gates:[10,20]},{id:"59-6",name:"Channel of Mating & Friction",from:"SACRAL",to:"SOLAR_PLEXUS",gates:[59,6]},{id:"28-38",name:"Channel of Struggle",from:"SPLEEN",to:"ROOT",gates:[28,38]},{id:"39-55",name:"Channel of Emoting",from:"ROOT",to:"SOLAR_PLEXUS",gates:[39,55]},{id:"21-45",name:"Channel of Money",from:"HEART",to:"THROAT",gates:[21,45]},{id:"37-40",name:"Channel of Community",from:"SOLAR_PLEXUS",to:"HEART",gates:[37,40]}];class ye{constructor(){this.profiles=[...W]}getProfileByUserId(e){return this.profiles.find(t=>t.userId===e)||this.profiles[0]}calculateCoupleComposite(e,t){const a=this.getProfileByUserId(e),o=this.getProfileByUserId(t),s=Array.from(new Set([...a.activeGates,...o.activeGates])),r=Array.from(new Set([...a.definedCenters,...o.definedCenters])),d=[],n=[],f=[];ve.forEach(h=>{const[T,_]=h.gates,b=a.activeGates.includes(T),v=a.activeGates.includes(_),y=o.activeGates.includes(T),x=o.activeGates.includes(_),R=b&&v,$=y&&x;b&&x&&!v&&!y||v&&y&&!b&&!x?d.push({...h,type:"ELECTROMAGNETIC",label:"Electromagnetic Connection 🔥"}):R&&!y&&!x?n.push({...h,type:"DOMINANCE_A",label:`${a.name} Dominance`}):$&&!b&&!v?n.push({...h,type:"DOMINANCE_B",label:`${o.name} Dominance`}):(R&&(y||x)||$&&(b||v))&&f.push({...h,type:"COMPROMISE",label:"Compromise Channel ⚖️"})});const m=r.length;let u="9-0 Nowhere to Go";return m===9?u="9-0 Full Harmony":m===8?u="8-1 Have Fun":m===7?u="7-2 Work to Do":m===6&&(u="6-3 Free Spirit"),{personA:a,personB:o,combinedGates:s,combinedCenters:r,electromagneticChannels:d,dominantChannels:n,compromiseChannels:f,relationshipType:u,synergyScore:Math.min(99,65+d.length*8)}}calculateGroupPenta(e){const t=e.map(n=>this.getProfileByUserId(n)),a=Array.from(new Set(t.flatMap(n=>n.activeGates))),o=Array.from(new Set(t.flatMap(n=>n.definedCenters))),s={};t.forEach(n=>{s[n.type]=(s[n.type]||0)+1});const r=o.length,d=Math.min(100,Math.round(r/9*100));return{membersCount:t.length,profiles:t,allGates:a,allCenters:o,pentaDefinedCentersCount:r,typeCounts:s,synergyScore:d,pentaStatus:r>=7?"High Alignment Synergy ⚡":"Moderate Alignment"}}}const E=new ye;function xe(i="single",e="peer_1",t=["u101","peer_1","peer_2"]){const a=E.getProfileByUserId("u101");return`
    <div class="bodygraph-section">
      <!-- Top Title & View Mode Selector -->
      <div class="glass-card" style="margin-bottom: 14px;">
        <div class="section-header" style="margin-bottom: 10px;">
          <span class="section-title">
            <i class="fa-solid fa-atom" style="color: var(--brand-primary); font-size: 1.1rem;"></i> Human Design Bodygraph
          </span>
          <span class="location-chip" style="font-size: 0.7rem;">
            <i class="fa-solid fa-dna"></i> Quantum Mechanics
          </span>
        </div>

        <!-- Tab Buttons -->
        <div style="display: flex; gap: 6px; margin-top: 10px;">
          <button class="btn-primary bodygraph-tab-btn" data-mode="single" style="flex: 1; padding: 8px; font-size: 0.78rem; ${i==="single"?"":"background: rgba(255,255,255,0.08); box-shadow: none;"}">
            <i class="fa-solid fa-user"></i> Individual
          </button>
          <button class="btn-primary bodygraph-tab-btn" data-mode="couples" style="flex: 1; padding: 8px; font-size: 0.78rem; ${i==="couples"?"":"background: rgba(255,255,255,0.08); box-shadow: none;"}">
            <i class="fa-solid fa-heart-pulse"></i> Couples Composite
          </button>
          <button class="btn-primary bodygraph-tab-btn" data-mode="group" style="flex: 1; padding: 8px; font-size: 0.78rem; ${i==="group"?"":"background: rgba(255,255,255,0.08); box-shadow: none;"}">
            <i class="fa-solid fa-users-gear"></i> Team Penta
          </button>
        </div>
      </div>

      <!-- Main Bodygraph View Container -->
      ${we(i,a,e,t)}
    </div>
  `}function we(i,e,t,a){if(i==="couples"){const o=E.calculateCoupleComposite("u101",t);return ke(o,t)}if(i==="group"){const o=E.calculateGroupPenta(a);return Ce(o)}return Se(e)}function Se(i){return`
    <!-- User Type Header -->
    <div class="glass-card" style="margin-bottom: 14px; background: linear-gradient(135deg, rgba(14,165,233,0.12) 0%, rgba(99,102,241,0.12) 100%);">
      <div style="display: flex; align-items: center; gap: 12px;">
        <img src="${i.avatar}" style="width: 52px; height: 52px; border-radius: 50%; border: 2px solid var(--brand-primary); object-fit: cover;" />
        <div>
          <h2 style="font-family: var(--font-display); font-size: 1.1rem; font-weight: 800;">${i.name}</h2>
          <div style="font-size: 0.82rem; color: var(--brand-primary); font-weight: 700; margin-top: 2px;">
            ⚡ ${i.type} • ${i.profile}
          </div>
          <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 2px;">
            Authority: <strong>${i.authority}</strong> • ${i.definition}
          </div>
        </div>
      </div>
    </div>

    <!-- SVG Bodygraph Chart Canvas -->
    <div class="glass-card" style="text-align: center; padding: 20px 10px;">
      <h3 style="font-size: 0.88rem; font-weight: 700; color: var(--text-muted); margin-bottom: 12px;">9 ENERGY CENTERS BODYGRAPH CHART</h3>
      ${A(i.definedCenters)}
    </div>

    <!-- Centers Breakdown -->
    <div class="glass-card">
      <h3 style="font-size: 0.9rem; font-weight: 700; margin-bottom: 10px;">9 Energy Centers Breakdown</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
        ${Object.keys(D).map(e=>{const t=D[e],a=i.definedCenters.includes(e);return`
            <div style="padding: 8px 10px; border-radius: 10px; background: ${a?"rgba(14,165,233,0.15)":"rgba(255,255,255,0.03)"}; border: 1px solid ${a?"var(--brand-primary)":"var(--border-color)"};">
              <div style="font-weight: 700; font-size: 0.78rem; color: ${a?"var(--brand-primary)":"var(--text-muted)"};">
                ${t.name}
              </div>
              <div style="font-size: 0.68rem; color: var(--text-dim); margin-top: 2px;">
                ${a?"Defined (Active)":"Undefined (Open)"}
              </div>
            </div>
          `}).join("")}
      </div>
    </div>
  `}function ke(i,e){return`
    <!-- Partner Selection Dropdown -->
    <div class="glass-card" style="margin-bottom: 14px;">
      <label class="form-label">Select Partner / Couple Member</label>
      <select id="couplePartnerSelect" class="form-select">
        ${W.filter(t=>t.userId!=="u101").map(t=>`
          <option value="${t.userId}" ${t.userId===e?"selected":""}>
            ${t.name} (${t.type})
          </option>
        `).join("")}
      </select>
    </div>

    <!-- Couples Synergy Banner -->
    <div class="glass-card" style="margin-bottom: 14px; background: linear-gradient(135deg, rgba(244,63,94,0.15) 0%, rgba(168,85,247,0.15) 100%); border-color: rgba(244,63,94,0.4);">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h3 style="font-size: 1.05rem; font-weight: 800; font-family: var(--font-display); color: #f43f5e;">
            ${i.personA.name} & ${i.personB.name}
          </h3>
          <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-main); margin-top: 2px;">
            Composite Theme: <span style="color: #a855f7;">${i.relationshipType}</span>
          </div>
        </div>

        <div style="text-align: right;">
          <div style="font-size: 1.5rem; font-weight: 800; font-family: var(--font-display); color: #f43f5e;">
            ${i.synergyScore}%
          </div>
          <span style="font-size: 0.65rem; color: var(--text-muted);">Synergy Score</span>
        </div>
      </div>
    </div>

    <!-- Composite SVG Bodygraph Chart -->
    <div class="glass-card" style="text-align: center; padding: 20px 10px;">
      <h3 style="font-size: 0.88rem; font-weight: 700; color: var(--text-muted); margin-bottom: 12px;">RELATIONAL COMPOSITE CHART OVERLAY</h3>
      ${A(i.combinedCenters,!0)}
    </div>

    <!-- Electromagnetic & Connection Channels -->
    <div class="glass-card">
      <h3 style="font-size: 0.9rem; font-weight: 700; margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
        <i class="fa-solid fa-bolt" style="color: #f43f5e;"></i> Electromagnetic Connection Channels (${i.electromagneticChannels.length})
      </h3>

      ${i.electromagneticChannels.length===0?`
        <div style="font-size: 0.78rem; color: var(--text-muted); padding: 10px 0;">
          No direct electromagnetic channel activations. Your relationship brings open flexibility!
        </div>
      `:`
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${i.electromagneticChannels.map(t=>`
            <div style="padding: 10px; background: rgba(244,63,94,0.1); border-radius: 12px; border-left: 3px solid #f43f5e; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <strong style="font-size: 0.84rem;">${t.name} (Gates ${t.gates.join("-")})</strong>
                <div style="font-size: 0.7rem; color: var(--text-muted);">${t.from} ⚡ ${t.to}</div>
              </div>
              <span style="font-size: 0.72rem; color: #f43f5e; font-weight: 700;">Electromagnetic 🔥</span>
            </div>
          `).join("")}
        </div>
      `}
    </div>
  `}function Ce(i){return`
    <div class="glass-card" style="margin-bottom: 14px; background: linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(6,182,212,0.15) 100%);">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h3 style="font-size: 1.05rem; font-weight: 800; font-family: var(--font-display); color: #10b981;">
            Group Team Penta Dynamic (${i.membersCount} Nodes)
          </h3>
          <span style="font-size: 0.75rem; color: var(--text-main); font-weight: 700;">${i.pentaStatus}</span>
        </div>

        <div style="text-align: right;">
          <div style="font-size: 1.5rem; font-weight: 800; font-family: var(--font-display); color: #10b981;">
            ${i.synergyScore}%
          </div>
          <span style="font-size: 0.65rem; color: var(--text-muted);">Penta Synergy</span>
        </div>
      </div>
    </div>

    <!-- Group SVG Bodygraph Chart -->
    <div class="glass-card" style="text-align: center; padding: 20px 10px;">
      <h3 style="font-size: 0.88rem; font-weight: 700; color: var(--text-muted); margin-bottom: 12px;">GROUP PENTA COMPOSITE BODYGRAPH</h3>
      ${A(i.allCenters,!1,!0)}
    </div>

    <!-- Team Members Role Distribution -->
    <div class="glass-card">
      <h3 style="font-size: 0.9rem; font-weight: 700; margin-bottom: 10px;">Penta Team Composition</h3>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        ${i.profiles.map(e=>`
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: rgba(255,255,255,0.04); border-radius: 10px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <img src="${e.avatar}" style="width: 32px; height: 32px; border-radius: 50%;" />
              <div>
                <div style="font-weight: 700; font-size: 0.84rem;">${e.name}</div>
                <div style="font-size: 0.7rem; color: var(--text-muted);">${e.type} • ${e.profile}</div>
              </div>
            </div>
            <span class="dist-badge" style="background: rgba(16,185,129,0.2); color: #10b981;">${e.definedCenters.length} Centers</span>
          </div>
        `).join("")}
      </div>
    </div>
  `}function A(i=[],e=!1,t=!1){const a=d=>i.includes(d),o=e?"#f43f5e":t?"#10b981":"var(--brand-primary)",s="rgba(255, 255, 255, 0.05)",r="rgba(255, 255, 255, 0.2)";return`
    <svg viewBox="0 0 240 320" style="width: 100%; max-width: 260px; height: auto; margin: 0 auto; filter: drop-shadow(0 0 10px rgba(0,0,0,0.5));">
      <!-- Connecting Channel Lines -->
      <line x1="120" y1="35" x2="120" y2="65" stroke="${a("HEAD")&&a("AJNA")?o:r}" stroke-width="3" />
      <line x1="120" y1="95" x2="120" y2="125" stroke="${a("AJNA")&&a("THROAT")?o:r}" stroke-width="3" />
      <line x1="120" y1="155" x2="120" y2="175" stroke="${a("THROAT")&&a("G_CENTER")?o:r}" stroke-width="3" />
      <line x1="120" y1="215" x2="120" y2="235" stroke="${a("G_CENTER")&&a("SACRAL")?o:r}" stroke-width="3" />
      <line x1="120" y1="265" x2="120" y2="285" stroke="${a("SACRAL")&&a("ROOT")?o:r}" stroke-width="3" />
      <line x1="120" y1="195" x2="180" y2="195" stroke="${a("G_CENTER")&&a("HEART")?o:r}" stroke-width="3" />
      <line x1="120" y1="195" x2="195" y2="235" stroke="${a("G_CENTER")&&a("SOLAR_PLEXUS")?o:r}" stroke-width="3" />
      <line x1="120" y1="195" x2="45" y2="235" stroke="${a("G_CENTER")&&a("SPLEEN")?o:r}" stroke-width="3" />

      <!-- 1. HEAD CENTER (Triangle Up) -->
      <polygon points="120,15 95,45 145,45" fill="${a("HEAD")?o:s}" stroke="${a("HEAD")?o:r}" stroke-width="2" />
      <text x="120" y="34" font-size="8" fill="#fff" text-anchor="middle" font-weight="bold">HEAD</text>

      <!-- 2. AJNA CENTER (Triangle Down) -->
      <polygon points="95,65 145,65 120,95" fill="${a("AJNA")?o:s}" stroke="${a("AJNA")?o:r}" stroke-width="2" />
      <text x="120" y="78" font-size="8" fill="#fff" text-anchor="middle" font-weight="bold">AJNA</text>

      <!-- 3. THROAT CENTER (Square) -->
      <rect x="100" y="125" width="40" height="30" rx="4" fill="${a("THROAT")?o:s}" stroke="${a("THROAT")?o:r}" stroke-width="2" />
      <text x="120" y="143" font-size="8" fill="#fff" text-anchor="middle" font-weight="bold">THROAT</text>

      <!-- 4. G-CENTER (Diamond) -->
      <polygon points="120,175 140,195 120,215 100,195" fill="${a("G_CENTER")?o:s}" stroke="${a("G_CENTER")?o:r}" stroke-width="2" />
      <text x="120" y="198" font-size="8" fill="#fff" text-anchor="middle" font-weight="bold">G</text>

      <!-- 5. HEART / EGO CENTER (Small Triangle) -->
      <polygon points="170,185 190,195 170,205" fill="${a("HEART")?o:s}" stroke="${a("HEART")?o:r}" stroke-width="2" />

      <!-- 6. SPLEEN CENTER (Left Triangle) -->
      <polygon points="45,215 45,255 20,235" fill="${a("SPLEEN")?o:s}" stroke="${a("SPLEEN")?o:r}" stroke-width="2" />

      <!-- 7. SOLAR PLEXUS CENTER (Right Triangle) -->
      <polygon points="195,215 195,255 220,235" fill="${a("SOLAR_PLEXUS")?o:s}" stroke="${a("SOLAR_PLEXUS")?o:r}" stroke-width="2" />

      <!-- 8. SACRAL CENTER (Square) -->
      <rect x="105" y="235" width="30" height="30" rx="4" fill="${a("SACRAL")?o:s}" stroke="${a("SACRAL")?o:r}" stroke-width="2" />
      <text x="120" y="253" font-size="7" fill="#fff" text-anchor="middle" font-weight="bold">SACRAL</text>

      <!-- 9. ROOT CENTER (Bottom Square) -->
      <rect x="102" y="285" width="36" height="25" rx="4" fill="${a("ROOT")?o:s}" stroke="${a("ROOT")?o:r}" stroke-width="2" />
      <text x="120" y="301" font-size="7" fill="#fff" text-anchor="middle" font-weight="bold">ROOT</text>
    </svg>
  `}class Ee{constructor(){this.activeTab="portal",this.portalSubTab="portal",this.telemetryData=null,this.bleDevices=[],this.bodygraphMode="single",this.selectedPartnerId="peer_1",this.selectedGroupIds=["u101","peer_1","peer_2"],this.activeChatId=null,this.activeStory=null,this.activeCelestialObject=null,this.currentTunedFreq=432,this.showStudioModal=!1,this.showNotificationsModal=!1,this.showCreatePostModal=!1,this.proximityRadiusMeters=5e3,this.posts=[],this.stories=[],this.chats=[],this.groups=[],this.notifications=[]}async init(){S.applyTheme(),S.subscribe(()=>this.render()),c.subscribe(()=>this.render()),await this.fetchData(),await this.loadTelemetry(),this.render(),this.attachEventListeners(),this.pingRealBackend()}async loadTelemetry(){try{this.telemetryData=await ee()}catch(e){console.warn("Could not fetch telemetry inspector:",e.message)}}async pingRealBackend(){try{const e=await Z(),t=document.getElementById("backendStatusChip");t&&(t.innerHTML=`<i class="fa-solid fa-circle-check"></i> Sovereign-27 Substrate (${e.mode})`,t.style.background="#10b98122",t.style.color="#10b981")}catch(e){const t=document.getElementById("backendStatusChip");t&&(t.innerHTML=`<i class="fa-solid fa-triangle-exclamation"></i> Stack Offline (${e.message})`,t.style.background="#ef444422",t.style.color="#ef4444")}}async fetchData(){this.posts=await w.getPosts(),this.stories=await w.getStories(),this.chats=await w.getChats(),this.groups=await w.getGroups(),this.notifications=await w.getNotifications()}render(){const e=document.getElementById("app");if(!e)return;const t=S.config;e.innerHTML=`
      <div class="android-device-frame">
        <div class="android-status-bar">
          <span>9:41</span>
          <div class="android-status-notch">
            <div class="android-camera-lens"></div>
          </div>
          <div style="display: flex; gap: 6px;">
            <i class="fa-solid fa-wifi"></i>
            <i class="fa-solid fa-signal"></i>
            <i class="fa-solid fa-battery-full"></i>
          </div>
        </div>

        ${te(t,this.activeTab)}

        <main class="app-content" id="appContent">
          ${this.renderActiveTabContent(t)}
        </main>

        ${ie(this.activeTab)}

        ${de(t)}
        ${ue(t)}
        ${re(this.activeStory)}
        ${be(this.activeCelestialObject,this.currentTunedFreq)}
      </div>
    `,this.bindDynamicEvents()}renderActiveTabContent(e){if(this.showNotificationsModal)return fe(this.notifications);switch(this.activeTab){case"portal":return N(this.portalSubTab,this.telemetryData,this.bleDevices);case"stadium":return setTimeout(()=>window.fetchStadiumFeed&&window.fetchStadiumFeed(),50),ae();case"wiki":return oe();case"radar":return le(this.proximityRadiusMeters,this.bleDevices);case"design":return xe(this.bodygraphMode,this.selectedPartnerId,this.selectedGroupIds);case"admin":return he();case"feed":return`
          ${e.modules.stories?se(this.stories):""}
          <div id="feedPostsContainer">
            ${ne(this.posts)}
          </div>
        `;case"groups":return ge(this.groups);case"chat":return ce(this.chats,this.activeChatId);case"profile":return me(e.auth.user);default:return N(this.portalSubTab,this.telemetryData,this.bleDevices)}}attachEventListeners(){document.addEventListener("input",e=>{e.target.id==="radarRadiusSlider"&&(this.proximityRadiusMeters=parseInt(e.target.value,10),this.render()),e.target.id==="celestialFreqSlider"&&(this.currentTunedFreq=parseInt(e.target.value,10),this.render())}),document.addEventListener("click",async e=>{const t=e.target.closest(".nav-item");if(t){const s=t.dataset.tab;s&&(this.activeTab=s,this.showNotificationsModal=!1,this.activeChatId=null,this.render());return}if(e.target.closest("#btnScanBleWifiNeighbors")){const s=e.target.closest("#btnScanBleWifiNeighbors");s.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Scanning Nearby...',this.bleDevices=await c.scanBluetoothWifiNeighbors(),this.render();return}const a=e.target.closest(".portal-subtab-btn");if(a){this.portalSubTab=a.dataset.subtab,this.portalSubTab==="radar"&&(this.activeTab="radar"),this.render();return}if(e.target.closest("#btnRefreshPortalTelemetry")){await this.loadTelemetry(),this.render();return}if(e.target.closest("#btnWikiOverview")){alert(`📖 [1. Overview & Philosophy]
PQR = Pre-Qualified Record. Sovereign-27 is a self-referential, non-destructive, hash-verified temporal logic mesh running across 108 backend REST endpoints.`);return}if(e.target.closest("#btnWikiArchitecture")){alert(`🏗️ [2. 5-Layer Stack Architecture]
Layer 1: GMI API
Layer 2: NBEP Substrate
Layer 3: rqlite Consensus
Layer 4: PQLite WAL Database
Layer 5: Shared Brain Mesh`);return}if(e.target.closest("#btnWikiTemporalEconomy")){alert(`⚡ [3. SEU Temporal Economy]
System Efficiency Units (SEU) quantify delta work performed per cycle hash validation across Hetzner Threadripper compute nodes.`);return}if(e.target.closest("#btnWikiOuroborosLoop")){alert(`♾️ [4. PQR-ORO Ouroboros Loop]
Continuous self-referential cycle verification linking alpha sequence states to omega target states with SHA-256 root chain integrity.`);return}const o=e.target.closest(".open-direct-chat-btn");if(o){const s=o.dataset.userName||"Marcus Chen",r=o.dataset.userAvatar||"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80";let d=this.chats.find(n=>n.user.name===s);d||(d={id:`chat_geo_${Date.now()}`,user:{name:s,avatar:r,online:!0},lastMessage:"Sovereign-27 Proximity Mesh connection established ⚡",time:"Just now",unread:0,messages:[{id:"m_init",sender:"them",text:"Greetings 5D Node! Connected via local proximity radar! (488m away) 📍",time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}]},this.chats.unshift(d)),this.activeTab="chat",this.activeChatId=d.id,this.render();return}if(e.target.closest("#headerBrandClick")){this.activeTab="portal",this.showNotificationsModal=!1,this.render();return}})}bindDynamicEvents(){if(this.showStudioModal){const e=document.getElementById("whitelabelStudioModalOverlay");e&&e.classList.add("active")}}openStudio(){this.showStudioModal=!0,this.render()}closeStudio(){this.showStudioModal=!1,this.render()}toggleNotifications(){this.showNotificationsModal=!this.showNotificationsModal,this.render()}}function q(){new Ee().init()}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",q):q();
