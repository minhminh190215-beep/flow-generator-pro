<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flow Generator Pro</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        :root {
            --bg-primary: #0a0a0b; --bg-secondary: #111113; --bg-tertiary: #18181b; --bg-card: #141416;
            --border-color: #27272a; --text-primary: #fafafa; --text-secondary: #a1a1aa; --text-muted: #71717a;
            --accent-green: #22c55e; --accent-cyan: #06b6d4; --accent-purple: #a855f7;
            --accent-yellow: #eab308; --accent-red: #ef4444; --accent-orange: #f97316;
        }
        body { font-family: 'Inter', sans-serif; background: var(--bg-primary); color: var(--text-primary); min-height: 100vh; }
        
        .login-screen { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .login-box { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 16px; padding: 40px; width: 100%; max-width: 520px; }
        .login-logo { display: flex; align-items: center; gap: 12px; margin-bottom: 32px; justify-content: center; }
        .login-logo-icon { width: 48px; height: 48px; background: linear-gradient(135deg, var(--accent-orange), var(--accent-purple)); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
        .login-logo-text { font-size: 24px; font-weight: 700; }
        .login-logo-text span { color: var(--accent-orange); }
        
        .input-group { margin-bottom: 20px; }
        .input-label { font-size: 12px; font-weight: 500; color: var(--text-secondary); margin-bottom: 8px; display: block; }
        .input-hint { font-size: 11px; color: var(--text-muted); margin-top: 6px; }
        .input-hint a { color: var(--accent-cyan); text-decoration: none; cursor: pointer; }
        input, textarea { width: 100%; padding: 12px 16px; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 10px; color: var(--text-primary); font-family: inherit; font-size: 14px; }
        input:focus, textarea:focus { outline: none; border-color: var(--accent-cyan); }
        textarea { resize: vertical; min-height: 100px; font-size: 12px; }
        
        .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 20px; border: none; border-radius: 10px; font-family: inherit; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; width: 100%; }
        .btn-primary { background: linear-gradient(135deg, var(--accent-green), #16a34a); color: #fff; }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3); }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .btn-secondary { background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color); }
        
        .login-error { background: rgba(239, 68, 68, 0.1); border: 1px solid var(--accent-red); color: var(--accent-red); padding: 12px; border-radius: 8px; margin-bottom: 20px; font-size: 13px; display: none; }
        .login-error.show { display: block; }
        .login-success { background: rgba(34, 197, 94, 0.1); border: 1px solid var(--accent-green); color: var(--accent-green); padding: 12px; border-radius: 8px; margin-bottom: 20px; font-size: 13px; display: none; }
        .login-success.show { display: block; }
        
        .user-info-card { display: flex; align-items: center; gap: 16px; padding: 16px; background: var(--bg-tertiary); border: 1px solid var(--accent-green); border-radius: 12px; margin-bottom: 20px; }
        .user-avatar { width: 48px; height: 48px; background: var(--accent-purple); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 600; }
        .user-details { flex: 1; }
        .user-name-display { font-weight: 600; font-size: 14px; }
        .user-email-display { font-size: 12px; color: var(--text-muted); }
        .user-credits-display { text-align: center; padding: 8px 12px; background: var(--bg-primary); border-radius: 8px; }
        .credits-label { font-size: 10px; color: var(--text-muted); text-transform: uppercase; }
        .credits-num { font-size: 18px; font-weight: 700; color: var(--accent-cyan); }
        
        .app { display: none; }
        .app.show { display: grid; grid-template-columns: 380px 1fr; min-height: 100vh; }
        
        .sidebar { background: var(--bg-secondary); border-right: 1px solid var(--border-color); padding: 20px; overflow-y: auto; }
        .main { padding: 24px; overflow-y: auto; }
        
        .header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid var(--border-color); }
        .logo { width: 36px; height: 36px; background: linear-gradient(135deg, var(--accent-orange), var(--accent-purple)); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
        .title { font-size: 18px; font-weight: 700; }
        .title span { color: var(--accent-orange); }
        
        .section { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 14px; padding: 16px; margin-bottom: 16px; }
        .section-title { font-size: 12px; font-weight: 600; color: var(--text-secondary); margin-bottom: 12px; text-transform: uppercase; }
        
        .account-card { background: var(--bg-tertiary); border-radius: 10px; padding: 12px; margin-bottom: 10px; }
        .account-info { display: flex; align-items: center; gap: 12px; }
        .account-avatar { width: 36px; height: 36px; background: var(--accent-purple); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; }
        .account-details { flex: 1; }
        .account-name { font-weight: 600; font-size: 13px; }
        .account-email { font-size: 11px; color: var(--text-muted); }
        .account-meta { display: flex; gap: 12px; margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--border-color); }
        .account-stat { flex: 1; text-align: center; }
        .account-stat-value { font-size: 16px; font-weight: 700; color: var(--accent-cyan); }
        .account-stat-label { font-size: 10px; color: var(--text-muted); }
        .tier-badge { font-size: 10px; padding: 4px 8px; background: var(--accent-purple); color: #fff; border-radius: 4px; }
        
        .option-row { display: flex; gap: 10px; margin-bottom: 12px; }
        .option-group { flex: 1; }
        .option-label { font-size: 10px; color: var(--text-muted); margin-bottom: 6px; }
        .option-btns { display: flex; gap: 4px; }
        .option-btn { flex: 1; padding: 8px 6px; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-secondary); font-size: 11px; cursor: pointer; text-align: center; }
        .option-btn.active { background: var(--accent-cyan); border-color: var(--accent-cyan); color: #000; font-weight: 600; }
        .option-btn.model.active { background: var(--accent-purple); border-color: var(--accent-purple); color: #fff; }
        
        .btn-stop { background: var(--accent-red); color: #fff; }
        .control-row { display: flex; gap: 8px; }
        .control-row .btn { flex: 1; padding: 10px; }
        
        .ref-upload-area { background: var(--bg-primary); border: 2px dashed var(--border-color); border-radius: 10px; padding: 12px; text-align: center; }
        .ref-slots { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-bottom: 6px; }
        .ref-slot { aspect-ratio: 1; background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: 6px; display: flex; align-items: center; justify-content: center; cursor: pointer; position: relative; overflow: hidden; }
        .ref-slot span { font-size: 20px; color: var(--text-muted); }
        .ref-slot img { width: 100%; height: 100%; object-fit: cover; }
        .ref-slot .ref-remove { position: absolute; top: 2px; right: 2px; width: 18px; height: 18px; background: var(--accent-red); color: #fff; border: none; border-radius: 50%; font-size: 10px; cursor: pointer; display: none; }
        .ref-slot:hover .ref-remove { display: flex; align-items: center; justify-content: center; }
        .ref-slot.uploading::after { content: ''; position: absolute; inset: 0; background: rgba(0,0,0,0.5); }
        .ref-slot.uploading::before { content: ''; position: absolute; width: 16px; height: 16px; border: 2px solid var(--accent-cyan); border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite; z-index: 1; }
        .ref-hint { font-size: 10px; color: var(--text-muted); }
        
        .stats-bar { display: flex; gap: 16px; margin-bottom: 16px; padding: 12px 16px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 10px; }
        .stat { display: flex; align-items: center; gap: 6px; }
        .stat-value { font-size: 16px; font-weight: 700; }
        .stat-label { font-size: 11px; color: var(--text-muted); }
        .stat.pending .stat-value { color: var(--accent-yellow); }
        .stat.processing .stat-value { color: var(--accent-cyan); }
        .stat.done .stat-value { color: var(--accent-green); }
        .stat.error .stat-value { color: var(--accent-red); }
        
        .task-list { display: flex; flex-direction: column; gap: 10px; }
        .task-row { display: flex; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 10px; overflow: hidden; }
        .task-row.done { border-color: var(--accent-green); }
        .task-row.error { border-color: var(--accent-red); }
        .task-status-bar { width: 4px; }
        .task-status-bar.pending { background: var(--accent-yellow); }
        .task-status-bar.processing { background: var(--accent-cyan); }
        .task-status-bar.done { background: var(--accent-green); }
        .task-status-bar.error { background: var(--accent-red); }
        .task-content { flex: 1; padding: 12px; }
        .task-header { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
        .task-badge { padding: 3px 8px; border-radius: 4px; font-size: 9px; font-weight: 700; text-transform: uppercase; }
        .task-badge.pending { background: var(--accent-yellow); color: #000; }
        .task-badge.processing { background: var(--accent-cyan); color: #000; }
        .task-badge.done { background: var(--accent-green); color: #000; }
        .task-badge.error { background: var(--accent-red); color: #fff; }
        .task-prompt { font-size: 12px; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .task-meta { font-size: 10px; color: var(--text-muted); }
        .task-images { display: flex; gap: 6px; padding: 10px; background: var(--bg-tertiary); flex-wrap: wrap; }
        .task-thumb { width: 70px; height: 70px; border-radius: 6px; overflow: hidden; cursor: pointer; }
        .task-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .empty-state { display: flex; flex-direction: column; align-items: center; padding: 60px 20px; color: var(--text-muted); }
        .empty-state-icon { font-size: 48px; margin-bottom: 12px; }
        
        .lightbox { position: fixed; inset: 0; z-index: 1000; background: rgba(0,0,0,0.95); display: none; flex-direction: column; }
        .lightbox.show { display: flex; }
        .lightbox-header { padding: 12px 20px; display: flex; justify-content: space-between; align-items: center; }
        .lightbox-body { flex: 1; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .lightbox-img { max-width: 100%; max-height: 100%; }
        .lightbox-close { background: transparent; border: none; color: #fff; font-size: 24px; cursor: pointer; }
        
        .notification { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); padding: 12px 24px; background: var(--accent-green); color: #fff; border-radius: 10px; font-weight: 600; z-index: 2000; display: none; }
        .notification.show { display: block; }
        .notification.error { background: var(--accent-red); }
        
        .modal { position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: none; align-items: center; justify-content: center; z-index: 2000; }
        .modal.show { display: flex; }
        .modal-content { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 16px; padding: 24px; width: 90%; max-width: 500px; }
        .modal-title { font-size: 16px; font-weight: 600; margin-bottom: 16px; }
        .modal-close { float: right; background: none; border: none; color: var(--text-muted); font-size: 18px; cursor: pointer; }
        .help-step { margin-bottom: 12px; padding: 10px; background: var(--bg-primary); border-radius: 6px; font-size: 13px; }
        .help-step-num { display: inline-block; width: 20px; height: 20px; background: var(--accent-cyan); color: #000; border-radius: 50%; text-align: center; line-height: 20px; font-size: 11px; font-weight: 700; margin-right: 8px; }
        
        @keyframes spin { to { transform: rotate(360deg); } }
    </style>
</head>
<body>
    <div class="login-screen" id="login-screen">
        <div class="login-box">
            <div class="login-logo">
                <div class="login-logo-icon">🚀</div>
                <div class="login-logo-text">Flow <span>Gen</span> Pro</div>
            </div>
            <div class="login-error" id="login-error"></div>
            <div class="login-success" id="login-success"></div>
            <div id="step-cookie">
                <div class="input-group">
                    <label class="input-label">🍪 Google Cookie</label>
                    <textarea id="input-cookie" rows="5" placeholder="Paste cookie từ labs.google/fx..."></textarea>
                    <div class="input-hint"><a onclick="showCookieHelp()">📖 Hướng dẫn lấy Cookie</a></div>
                </div>
                <button class="btn btn-primary" id="btn-verify" onclick="handleVerify()">🔍 Xác thực Cookie</button>
            </div>
            <div id="step-project" style="display:none;">
                <div class="user-info-card">
                    <div class="user-avatar" id="user-avatar">👤</div>
                    <div class="user-details">
                        <div class="user-name-display" id="user-name-display">User</div>
                        <div class="user-email-display" id="user-email-display"></div>
                    </div>
                    <div class="user-credits-display">
                        <div class="credits-label">Credits</div>
                        <div class="credits-num" id="user-credits-display">?</div>
                    </div>
                </div>
                <div class="input-group">
                    <label class="input-label">🔗 Project ID</label>
                    <input type="text" id="input-project-id" placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx">
                    <div class="input-hint"><a onclick="showProjectHelp()">📖 Cách lấy Project ID</a></div>
                </div>
                <button class="btn btn-primary" onclick="handleStart()">✅ Bắt đầu</button>
                <div style="text-align:center;margin-top:16px;"><a onclick="resetLogin()" style="color:var(--text-muted);cursor:pointer;font-size:12px;">← Đổi Cookie</a></div>
            </div>
        </div>
    </div>
    
    <div class="app" id="app">
        <div class="sidebar">
            <div class="header">
                <div class="logo">🚀</div>
                <div class="title">Flow <span>Gen</span></div>
            </div>
            <div class="section">
                <div class="section-title">👤 Tài khoản</div>
                <div class="account-card">
                    <div class="account-info">
                        <div class="account-avatar" id="app-avatar">V</div>
                        <div class="account-details">
                            <div class="account-name" id="app-name">User</div>
                            <div class="account-email" id="app-email"></div>
                        </div>
                    </div>
                    <div class="account-meta">
                        <div class="account-stat"><div class="account-stat-value" id="app-credits">?</div><div class="account-stat-label">Credits</div></div>
                        <div class="account-stat"><div class="tier-badge">TIER 1</div></div>
                    </div>
                </div>
                <button class="btn btn-secondary" onclick="location.reload()" style="padding:8px;font-size:12px;">🚪 Đăng xuất</button>
            </div>
            <div class="section">
                <div class="section-title">⚙️ Cấu hình</div>
                <div class="option-row">
                    <div class="option-group">
                        <div class="option-label">Model</div>
                        <div class="option-btns" id="model-btns">
                            <button class="option-btn model" data-value="IMAGEN_3_5">Imagen 3.5</button>
                            <button class="option-btn model active" data-value="GEM_PIX_2">Nano Pro</button>
                        </div>
                    </div>
                </div>
                <div class="option-row">
                    <div class="option-group">
                        <div class="option-label">Tỉ lệ</div>
                        <div class="option-btns" id="aspect-btns">
                            <button class="option-btn active" data-value="IMAGE_ASPECT_RATIO_LANDSCAPE">16:9</button>
                            <button class="option-btn" data-value="IMAGE_ASPECT_RATIO_PORTRAIT">9:16</button>
                            <button class="option-btn" data-value="IMAGE_ASPECT_RATIO_SQUARE">1:1</button>
                        </div>
                    </div>
                    <div class="option-group">
                        <div class="option-label">Số ảnh</div>
                        <div class="option-btns" id="count-btns">
                            <button class="option-btn" data-value="1">1</button>
                            <button class="option-btn" data-value="2">2</button>
                            <button class="option-btn active" data-value="4">4</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="section">
                <div class="section-title">🖼️ Ảnh tham chiếu</div>
                <div class="ref-upload-area">
                    <div class="ref-slots" id="ref-slots">
                        <div class="ref-slot" data-index="0"><span>+</span></div>
                        <div class="ref-slot" data-index="1"><span>+</span></div>
                        <div class="ref-slot" data-index="2"><span>+</span></div>
                        <div class="ref-slot" data-index="3"><span>+</span></div>
                    </div>
                    <input type="file" id="ref-input" accept="image/*" multiple style="display:none;">
                    <div class="ref-hint">Click để upload (tối đa 4)</div>
                </div>
            </div>
            <div class="section">
                <div class="section-title">📝 Prompts</div>
                <textarea id="prompts" rows="4" placeholder="Nhập prompt, mỗi dòng 1 prompt..."></textarea>
                <div class="control-row" style="margin-top:10px;">
                    <button class="btn btn-primary" id="btn-gen" onclick="startGen()">▶️ Tạo ảnh</button>
                    <button class="btn btn-stop" onclick="stopGen()">⏹️ Dừng</button>
                </div>
            </div>
        </div>
        <div class="main">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
                <h2 style="font-size:18px;">📷 Ảnh đã tạo</h2>
                <div style="display:flex;gap:8px;">
                    <button class="btn btn-secondary" onclick="clearTasks()" style="width:auto;padding:8px 14px;font-size:12px;">🗑️ Xóa</button>
                    <button class="btn btn-primary" onclick="downloadZip()" style="width:auto;padding:8px 14px;font-size:12px;">⬇️ Tải ZIP</button>
                </div>
            </div>
            <div class="stats-bar">
                <div class="stat pending"><div class="stat-value" id="stat-pending">0</div><div class="stat-label">Chờ</div></div>
                <div class="stat processing"><div class="stat-value" id="stat-processing">0</div><div class="stat-label">Đang tạo</div></div>
                <div class="stat done"><div class="stat-value" id="stat-done">0</div><div class="stat-label">Xong</div></div>
                <div class="stat error"><div class="stat-value" id="stat-error">0</div><div class="stat-label">Lỗi</div></div>
            </div>
            <div class="task-list" id="task-list"><div class="empty-state"><div class="empty-state-icon">🎨</div><div>Nhập prompt và bấm Tạo ảnh!</div></div></div>
        </div>
    </div>
    
    <div class="modal" id="modal"><div class="modal-content"><button class="modal-close" onclick="closeModal()">✕</button><div class="modal-title" id="modal-title"></div><div id="modal-content"></div></div></div>
    <div class="lightbox" id="lightbox"><div class="lightbox-header"><div id="lb-info"></div><button class="lightbox-close" onclick="closeLb()">✕</button></div><div class="lightbox-body"><img id="lb-img" class="lightbox-img"></div></div>
    <div class="notification" id="notif"></div>

    <script>
        const API = '';
        let cookie='', token='', projectId='', userInfo={};
        let tasks=[], running=false, stopped=false;
        let model='GEM_PIX_2', aspect='IMAGE_ASPECT_RATIO_LANDSCAPE', count=4;
        let refs=[null,null,null,null];
        
        function init(){
            ['model-btns','aspect-btns','count-btns'].forEach(id=>{
                document.getElementById(id).onclick=e=>{
                    if(e.target.classList.contains('option-btn')){
                        e.target.parentElement.querySelectorAll('.option-btn').forEach(b=>b.classList.remove('active'));
                        e.target.classList.add('active');
                        const v=e.target.dataset.value;
                        if(id==='model-btns')model=v;
                        else if(id==='aspect-btns')aspect=v;
                        else count=parseInt(v);
                    }
                };
            });
            setupRefs();
        }
        
        async function handleVerify(){
            cookie=document.getElementById('input-cookie').value.trim();
            if(!cookie){showErr('Nhập Cookie');return;}
            const btn=document.getElementById('btn-verify');
            btn.disabled=true;btn.textContent='⏳ Đang xác thực...';
            hideMsg();
            try{
                const r=await fetch(API+'/api/proxy/verify-session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({cookie})});
                const d=await r.json();
                if(!r.ok||!d.success)throw new Error(d.error||'Cookie không hợp lệ');
                token=d.accessToken;
                userInfo=d.sessionData?.user||{};
                try{
                    const cr=await fetch(API+'/api/proxy/check-credits',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({bearerToken:token})});
                    const cd=await cr.json();
                    userInfo.credits=cd.credits||'?';
                }catch(e){userInfo.credits='?';}
                showOk('✅ Xác thực thành công!');
                showStep2();
            }catch(e){showErr(e.message);}
            finally{btn.disabled=false;btn.textContent='🔍 Xác thực Cookie';}
        }
        
        function showStep2(){
            document.getElementById('step-cookie').style.display='none';
            document.getElementById('step-project').style.display='block';
            document.getElementById('user-name-display').textContent=userInfo.name||'User';
            document.getElementById('user-email-display').textContent=userInfo.email||'';
            document.getElementById('user-credits-display').textContent=userInfo.credits||'?';
            if(userInfo.name)document.getElementById('user-avatar').textContent=userInfo.name.charAt(0).toUpperCase();
        }
        
        function handleStart(){
            projectId=document.getElementById('input-project-id').value.trim();
            if(!projectId){showErr('Nhập Project ID');return;}
            if(!/^[a-f0-9-]{36}$/.test(projectId)){showErr('Project ID không hợp lệ');return;}
            showApp();
        }
        
        function resetLogin(){
            document.getElementById('step-cookie').style.display='block';
            document.getElementById('step-project').style.display='none';
            hideMsg();
        }
        
        function showApp(){
            document.getElementById('login-screen').style.display='none';
            document.getElementById('app').classList.add('show');
            document.getElementById('app-name').textContent=userInfo.name||'User';
            document.getElementById('app-email').textContent=userInfo.email||'';
            document.getElementById('app-credits').textContent=userInfo.credits||'?';
            if(userInfo.name)document.getElementById('app-avatar').textContent=userInfo.name.charAt(0).toUpperCase();
        }
        
        function showErr(m){document.getElementById('login-error').textContent=m;document.getElementById('login-error').classList.add('show');document.getElementById('login-success').classList.remove('show');}
        function showOk(m){document.getElementById('login-success').textContent=m;document.getElementById('login-success').classList.add('show');document.getElementById('login-error').classList.remove('show');}
        function hideMsg(){document.getElementById('login-error').classList.remove('show');document.getElementById('login-success').classList.remove('show');}
        
        function setupRefs(){
            const slots=document.getElementById('ref-slots');
            const input=document.getElementById('ref-input');
            slots.onclick=e=>{
                const slot=e.target.closest('.ref-slot');
                if(!slot)return;
                if(e.target.classList.contains('ref-remove')){refs[parseInt(slot.dataset.index)]=null;renderRefs();return;}
                if(!refs[parseInt(slot.dataset.index)]){input.dataset.idx=slot.dataset.index;input.click();}
            };
            input.onchange=async e=>{
                const files=Array.from(e.target.files);
                let idx=parseInt(input.dataset.idx)||0;
                for(const f of files){
                    while(idx<4&&refs[idx])idx++;
                    if(idx>=4)break;
                    await uploadRef(f,idx);idx++;
                }
                input.value='';
            };
        }
        
        async function uploadRef(file,idx){
            const b64=await new Promise(r=>{const rd=new FileReader();rd.onload=()=>r(rd.result.split(',')[1]);rd.readAsDataURL(file);});
            refs[idx]={base64:b64,id:null,uploading:true};
            renderRefs();
            try{
                const payload={imageInput:{rawImageBytes:b64,mimeType:file.type||'image/png',isUserUploaded:true,aspectRatio:aspect},clientContext:{sessionId:`;${Date.now()}`,tool:"ASSET_MANAGER"}};
                const r=await fetch(API+'/api/proxy/uploadUserImage',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({bearerToken:token,payload})});
                const d=await r.json();
                if(!r.ok)throw new Error(d.error||'Upload failed');
                const id=d?.mediaGenerationId?.mediaGenerationId||d?.mediaGenerationId||d?.name;
                if(id){refs[idx]={base64:b64,id,uploading:false};notify('✅ Upload OK!');}
                else throw new Error('No ID');
            }catch(e){refs[idx]=null;notify('❌ '+e.message,true);}
            renderRefs();
        }
        
        function renderRefs(){
            document.querySelectorAll('.ref-slot').forEach((s,i)=>{
                const r=refs[i];
                if(r){s.innerHTML=`<img src="data:image/png;base64,${r.base64}"><button class="ref-remove">✕</button>`;s.classList.toggle('uploading',r.uploading);}
                else{s.innerHTML='<span>+</span>';s.classList.remove('uploading');}
            });
        }
        
        async function startGen(){
            const txt=document.getElementById('prompts').value.trim();
            if(!txt){notify('Nhập prompt!',true);return;}
            const prompts=txt.split('\n').filter(p=>p.trim());
            if(!prompts.length)return;
            const validRefs=refs.filter(r=>r&&r.id&&!r.uploading);
            running=true;stopped=false;
            document.getElementById('btn-gen').disabled=true;
            prompts.forEach(p=>tasks.unshift({id:Date.now()+Math.random(),prompt:p.trim(),status:'pending',images:[],error:null}));
            renderTasks();
            for(const t of tasks.filter(t=>t.status==='pending')){
                if(stopped)break;
                t.status='processing';renderTasks();
                try{
                    const reqs=[];
                    for(let i=0;i<count;i++){
                        const req={clientContext:{sessionId:`;${Date.now()}`,tool:"PINHOLE"},seed:Math.floor(Math.random()*900000)+100000,imageModelName:model,imageAspectRatio:aspect,prompt:t.prompt};
                        if(validRefs.length)req.imageInputs=validRefs.map(r=>({name:r.id,imageInputType:'IMAGE_INPUT_TYPE_REFERENCE'}));
                        reqs.push(req);
                    }
                    const r=await fetch(API+'/api/proxy/batchGenerateImages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({bearerToken:token,projectId,payload:{requests:reqs}})});
                    if(!r.ok){const e=await r.json().catch(()=>({}));throw new Error(e.error||'HTTP '+r.status);}
                    const d=await r.json();
                    let imgs=[];
                    if(d.media&&Array.isArray(d.media)){
                        imgs=d.media.map(m=>{
                            if(m?.image?.generatedImage?.encodedImage)return 'data:image/png;base64,'+m.image.generatedImage.encodedImage;
                            if(m?.image?.encodedImage)return 'data:image/png;base64,'+m.image.encodedImage;
                            return null;
                        }).filter(Boolean);
                    }
                    if(imgs.length){t.images=imgs;t.status='done';}
                    else throw new Error('No images');
                }catch(e){t.status='error';t.error=e.message;}
                renderTasks();
                await new Promise(r=>setTimeout(r,1500));
            }
            running=false;
            document.getElementById('btn-gen').disabled=false;
            const done=tasks.filter(t=>t.status==='done').length;
            if(done)notify('✅ Xong '+done+' prompts!');
        }
        
        function stopGen(){stopped=true;running=false;document.getElementById('btn-gen').disabled=false;}
        
        function renderTasks(){
            const list=document.getElementById('task-list');
            if(!tasks.length){list.innerHTML='<div class="empty-state"><div class="empty-state-icon">🎨</div><div>Nhập prompt và bấm Tạo ảnh!</div></div>';updateStats();return;}
            list.innerHTML=tasks.map(t=>`
                <div class="task-row ${t.status}">
                    <div class="task-status-bar ${t.status}"></div>
                    <div class="task-content">
                        <div class="task-header"><span class="task-badge ${t.status}">${t.status}</span><span class="task-prompt">${esc(t.prompt)}</span></div>
                        <div class="task-meta">${t.error?'<span style="color:var(--accent-red)">⚠️ '+esc(t.error.substring(0,50))+'</span>':''}${t.images.length?'<span style="color:var(--accent-green)">'+t.images.length+' ảnh</span>':''}</div>
                    </div>
                    ${t.images.length?'<div class="task-images">'+t.images.map(img=>'<div class="task-thumb" onclick="openLb(\''+img+'\',\''+esc(t.prompt)+'\')"><img src="'+img+'"></div>').join('')+'</div>':''}
                </div>
            `).join('');
            updateStats();
        }
        
        function updateStats(){
            const c={pending:0,processing:0,done:0,error:0};
            tasks.forEach(t=>c[t.status]++);
            Object.keys(c).forEach(s=>document.getElementById('stat-'+s).textContent=c[s]);
        }
        
        function clearTasks(){if(confirm('Xóa?')){tasks=[];renderTasks();}}
        
        async function downloadZip(){
            const done=tasks.filter(t=>t.status==='done'&&t.images.length);
            if(!done.length){notify('Chưa có ảnh',true);return;}
            const zip=new JSZip();let n=0;
            for(let i=0;i<done.length;i++){
                for(let j=0;j<done[i].images.length;j++){
                    try{
                        const b64=done[i].images[j].split(',')[1];
                        const bin=atob(b64);
                        const arr=new Uint8Array(bin.length);
                        for(let k=0;k<bin.length;k++)arr[k]=bin.charCodeAt(k);
                        zip.file(`p${i+1}_img${j+1}.png`,arr);n++;
                    }catch(e){}
                }
            }
            saveAs(await zip.generateAsync({type:'blob'}),`flow_${n}imgs.zip`);
            notify('Tải '+n+' ảnh');
        }
        
        function openLb(url,info){document.getElementById('lb-img').src=url;document.getElementById('lb-info').textContent=info;document.getElementById('lightbox').classList.add('show');}
        function closeLb(){document.getElementById('lightbox').classList.remove('show');}
        
        function showCookieHelp(){
            document.getElementById('modal-title').textContent='🍪 Lấy Cookie';
            document.getElementById('modal-content').innerHTML=`
                <div class="help-step"><span class="help-step-num">1</span> Mở <b>labs.google/fx/tools/flow</b></div>
                <div class="help-step"><span class="help-step-num">2</span> F12 → Tab <b>Application</b></div>
                <div class="help-step"><span class="help-step-num">3</span> Cookies → labs.google</div>
                <div class="help-step"><span class="help-step-num">4</span> Tìm <b>__Secure-next-auth.session-token</b></div>
                <div class="help-step"><span class="help-step-num">5</span> Copy Value, paste với format:<br><code>__Secure-next-auth.session-token=VALUE</code></div>
            `;
            document.getElementById('modal').classList.add('show');
        }
        
        function showProjectHelp(){
            document.getElementById('modal-title').textContent='🔗 Lấy Project ID';
            document.getElementById('modal-content').innerHTML=`
                <div class="help-step"><span class="help-step-num">1</span> Mở <b>labs.google/fx/tools/flow</b></div>
                <div class="help-step"><span class="help-step-num">2</span> Tạo/mở project</div>
                <div class="help-step"><span class="help-step-num">3</span> URL có dạng: .../project/<b>xxx-xxx-xxx</b></div>
                <div class="help-step"><span class="help-step-num">4</span> Copy phần UUID 36 ký tự</div>
            `;
            document.getElementById('modal').classList.add('show');
        }
        
        function closeModal(){document.getElementById('modal').classList.remove('show');}
        
        function notify(m,err=false){
            const el=document.getElementById('notif');
            el.textContent=m;
            el.classList.toggle('error',err);
            el.classList.add('show');
            setTimeout(()=>el.classList.remove('show'),3000);
        }
        
        function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
        
        document.getElementById('modal').onclick=e=>{if(e.target.id==='modal')closeModal();};
        document.getElementById('lightbox').onclick=e=>{if(e.target.id==='lightbox')closeLb();};
        
        init();
    </script>
</body>
</html>
