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
        textarea { resize: vertical; min-height: 120px; font-size: 12px; }
        
        .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 20px; border: none; border-radius: 10px; font-family: inherit; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; width: 100%; }
        .btn-primary { background: linear-gradient(135deg, var(--accent-green), #16a34a); color: #fff; }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3); }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        
        .login-error { background: rgba(239, 68, 68, 0.1); border: 1px solid var(--accent-red); color: var(--accent-red); padding: 12px; border-radius: 8px; margin-bottom: 20px; font-size: 13px; display: none; }
        .login-error.show { display: block; }
        
        .login-success { background: rgba(34, 197, 94, 0.1); border: 1px solid var(--accent-green); color: var(--accent-green); padding: 12px; border-radius: 8px; margin-bottom: 20px; font-size: 13px; display: none; }
        .login-success.show { display: block; }
        
        .user-info-card { display: flex; align-items: center; gap: 16px; padding: 16px; background: var(--bg-tertiary); border: 1px solid var(--accent-green); border-radius: 12px; margin-bottom: 20px; }
        .user-avatar { width: 48px; height: 48px; background: var(--accent-purple); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; overflow: hidden; }
        .user-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .user-details { flex: 1; }
        .user-name-display { font-weight: 600; font-size: 14px; color: var(--text-primary); }
        .user-email-display { font-size: 12px; color: var(--text-muted); }
        .user-credits-display { text-align: center; padding: 8px 12px; background: var(--bg-primary); border-radius: 8px; }
        .credits-label { font-size: 10px; color: var(--text-muted); text-transform: uppercase; }
        .credits-num { font-size: 18px; font-weight: 700; color: var(--accent-cyan); }
        
        .divider { display: flex; align-items: center; margin: 20px 0; }
        .divider::before, .divider::after { content: ''; flex: 1; border-bottom: 1px solid var(--border-color); }
        .divider span { padding: 0 16px; color: var(--text-muted); font-size: 12px; }
        
        .app { display: none; }
        .app.show { display: grid; grid-template-columns: 400px 1fr; min-height: 100vh; }
        
        .sidebar { background: var(--bg-secondary); border-right: 1px solid var(--border-color); padding: 20px; overflow-y: auto; }
        .main { padding: 24px; overflow-y: auto; }
        
        .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid var(--border-color); }
        .header-left { display: flex; align-items: center; gap: 12px; }
        .logo { width: 40px; height: 40px; background: linear-gradient(135deg, var(--accent-orange), var(--accent-purple)); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
        .title { font-size: 20px; font-weight: 700; }
        .title span { color: var(--accent-orange); }
        
        .section { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 14px; padding: 20px; margin-bottom: 20px; }
        .section-title { font-size: 13px; font-weight: 600; color: var(--text-secondary); margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px; }
        
        .account-card { background: var(--bg-tertiary); border: 1px solid var(--accent-green); border-radius: 12px; padding: 16px; margin-bottom: 12px; }
        .account-info { font-size: 13px; }
        .account-name { font-weight: 600; color: var(--text-primary); }
        .account-email { color: var(--text-muted); font-size: 12px; }
        .account-credits { margin-top: 8px; padding: 8px; background: var(--bg-primary); border-radius: 8px; display: flex; justify-content: space-between; }
        .credits-value { font-size: 16px; font-weight: 700; color: var(--accent-cyan); }
        .tier-badge { font-size: 10px; padding: 4px 8px; background: var(--accent-purple); color: #fff; border-radius: 4px; }
        
        .option-row { display: flex; gap: 12px; margin-bottom: 16px; }
        .option-group { flex: 1; }
        .option-label { font-size: 11px; color: var(--text-muted); margin-bottom: 6px; }
        .option-btns { display: flex; gap: 6px; }
        .option-btn { flex: 1; padding: 10px 8px; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-secondary); font-size: 12px; cursor: pointer; text-align: center; transition: all 0.2s; }
        .option-btn:hover { border-color: var(--text-muted); }
        .option-btn.active { background: var(--accent-cyan); border-color: var(--accent-cyan); color: #000; font-weight: 600; }
        .option-btn.model.active { background: var(--accent-purple); border-color: var(--accent-purple); color: #fff; }
        
        .btn-secondary { background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color); }
        .btn-stop { background: var(--accent-red); color: #fff; }
        .control-row { display: flex; gap: 10px; }
        .control-row .btn { flex: 1; }
        
        .ref-upload-area { background: var(--bg-primary); border: 2px dashed var(--border-color); border-radius: 12px; padding: 16px; text-align: center; transition: all 0.2s; }
        .ref-upload-area:hover, .ref-upload-area.dragover { border-color: var(--accent-cyan); background: rgba(6, 182, 212, 0.05); }
        .ref-slots { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 8px; }
        .ref-slot { aspect-ratio: 1; background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; position: relative; overflow: hidden; transition: all 0.2s; }
        .ref-slot:hover { border-color: var(--accent-cyan); }
        .ref-slot span { font-size: 24px; color: var(--text-muted); }
        .ref-slot img { width: 100%; height: 100%; object-fit: cover; }
        .ref-slot .ref-remove { position: absolute; top: 2px; right: 2px; width: 20px; height: 20px; background: var(--accent-red); color: #fff; border: none; border-radius: 50%; font-size: 12px; cursor: pointer; display: none; align-items: center; justify-content: center; }
        .ref-slot:hover .ref-remove { display: flex; }
        .ref-slot.uploading::after { content: ''; position: absolute; inset: 0; background: rgba(0,0,0,0.5); }
        .ref-slot.uploading::before { content: ''; position: absolute; width: 20px; height: 20px; border: 2px solid var(--accent-cyan); border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite; z-index: 1; }
        .ref-hint { font-size: 11px; color: var(--text-muted); }
        
        .stats-bar { display: flex; gap: 20px; margin-bottom: 20px; padding: 16px 20px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; }
        .stat { display: flex; align-items: center; gap: 8px; }
        .stat-value { font-size: 18px; font-weight: 700; }
        .stat-label { font-size: 12px; color: var(--text-muted); }
        .stat.pending .stat-value { color: var(--accent-yellow); }
        .stat.processing .stat-value { color: var(--accent-cyan); }
        .stat.done .stat-value { color: var(--accent-green); }
        .stat.error .stat-value { color: var(--accent-red); }
        
        .task-list { display: flex; flex-direction: column; gap: 12px; }
        .task-row { display: flex; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; overflow: hidden; }
        .task-row.processing { border-color: var(--accent-cyan); }
        .task-row.done { border-color: var(--accent-green); }
        .task-row.error { border-color: var(--accent-red); }
        
        .task-status-bar { width: 4px; }
        .task-status-bar.pending { background: var(--accent-yellow); }
        .task-status-bar.processing { background: var(--accent-cyan); }
        .task-status-bar.done { background: var(--accent-green); }
        .task-status-bar.error { background: var(--accent-red); }
        
        .task-content { flex: 1; padding: 16px; }
        .task-header { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
        .task-badge { padding: 4px 10px; border-radius: 6px; font-size: 10px; font-weight: 700; text-transform: uppercase; }
        .task-badge.pending { background: var(--accent-yellow); color: #000; }
        .task-badge.processing { background: var(--accent-cyan); color: #000; }
        .task-badge.done { background: var(--accent-green); color: #000; }
        .task-badge.error { background: var(--accent-red); color: #fff; }
        .task-prompt { font-size: 13px; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .task-meta { font-size: 11px; color: var(--text-muted); }
        
        .task-images { display: flex; gap: 6px; padding: 12px; background: var(--bg-tertiary); flex-wrap: wrap; }
        .task-thumb { width: 80px; height: 80px; border-radius: 8px; overflow: hidden; cursor: pointer; transition: transform 0.2s; }
        .task-thumb:hover { transform: scale(1.05); }
        .task-thumb img { width: 100%; height: 100%; object-fit: cover; }
        
        .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 20px; color: var(--text-muted); }
        .empty-state-icon { font-size: 64px; margin-bottom: 16px; }
        
        .lightbox { position: fixed; inset: 0; z-index: 1000; background: rgba(0,0,0,0.95); display: none; flex-direction: column; }
        .lightbox.show { display: flex; }
        .lightbox-header { padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); }
        .lightbox-body { flex: 1; display: flex; align-items: center; justify-content: center; padding: 24px; }
        .lightbox-img { max-width: 100%; max-height: 100%; object-fit: contain; }
        .lightbox-close { background: transparent; border: none; color: var(--text-primary); font-size: 24px; cursor: pointer; }
        
        .notification { position: fixed; top: 24px; left: 50%; transform: translateX(-50%); padding: 16px 32px; background: var(--accent-green); color: #fff; border-radius: 12px; font-weight: 600; z-index: 2000; display: none; }
        .notification.show { display: block; animation: slideIn 0.3s ease; }
        .notification.error { background: var(--accent-red); }
        @keyframes slideIn { from { transform: translateX(-50%) translateY(-20px); opacity: 0; } }
        
        .loading-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: none; align-items: center; justify-content: center; z-index: 3000; flex-direction: column; gap: 16px; }
        .loading-overlay.show { display: flex; }
        .loading-spinner { width: 48px; height: 48px; border: 3px solid var(--border-color); border-top-color: var(--accent-cyan); border-radius: 50%; animation: spin 1s linear infinite; }
        .loading-text { color: var(--text-secondary); font-size: 14px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        
        .modal { position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: none; align-items: center; justify-content: center; z-index: 2000; padding: 20px; }
        .modal.show { display: flex; }
        .modal-content { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 16px; padding: 24px; width: 100%; max-width: 600px; max-height: 80vh; overflow-y: auto; }
        .modal-title { font-size: 18px; font-weight: 600; margin-bottom: 16px; }
        .modal-close { float: right; background: none; border: none; color: var(--text-muted); font-size: 20px; cursor: pointer; }
        .help-step { margin-bottom: 16px; padding: 12px; background: var(--bg-primary); border-radius: 8px; }
        .help-step-num { display: inline-block; width: 24px; height: 24px; background: var(--accent-cyan); color: #000; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; font-weight: 700; margin-right: 8px; }
        .help-step p { margin-top: 8px; font-size: 13px; color: var(--text-secondary); }
        .help-step code { background: var(--bg-tertiary); padding: 2px 6px; border-radius: 4px; font-size: 12px; }
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
            
            <!-- Step 1: Cookie Input -->
            <div id="step-cookie">
                <div class="input-group">
                    <label class="input-label">🍪 Google Cookie</label>
                    <textarea id="input-cookie" rows="5" placeholder="Paste cookie từ labs.google/fx vào đây..."></textarea>
                    <div class="input-hint"><a onclick="showCookieHelp()">📖 Hướng dẫn lấy Cookie</a></div>
                </div>
                <button class="btn btn-primary" id="btn-verify" onclick="handleVerifyCookie()">🔍 Xác thực Cookie</button>
            </div>
            
            <!-- Step 2: User Info + Create Project (hidden by default) -->
            <div id="step-project" style="display: none;">
                <div class="user-info-card">
                    <div class="user-avatar" id="user-avatar">👤</div>
                    <div class="user-details">
                        <div class="user-name-display" id="user-name-display">Loading...</div>
                        <div class="user-email-display" id="user-email-display"></div>
                    </div>
                    <div class="user-credits-display">
                        <div class="credits-label">Credits</div>
                        <div class="credits-num" id="user-credits-display">--</div>
                    </div>
                </div>
                
                <!-- Option A: Tạo Project mới -->
                <div id="create-project-section">
                    <div class="input-group">
                        <label class="input-label">📁 Tên Project mới</label>
                        <input type="text" id="input-project-name" placeholder="My Flow Project">
                    </div>
                    <button class="btn btn-primary" id="btn-create-project" onclick="handleCreateProject()">📁 Tạo Project mới</button>
                </div>
                
                <div class="divider">
                    <span>hoặc</span>
                </div>
                
                <!-- Option B: Dùng Project có sẵn -->
                <div id="existing-project-section">
                    <div class="input-group">
                        <label class="input-label">🔗 Dùng Project có sẵn</label>
                        <input type="text" id="input-project-id" placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx">
                        <div class="input-hint"><a onclick="showProjectIdHelp()">📖 Cách lấy Project ID</a></div>
                    </div>
                    <button class="btn btn-secondary" onclick="handleUseExistingProject()">✅ Dùng Project này</button>
                </div>
                
                <div style="text-align: center; margin-top: 16px;">
                    <a onclick="resetLogin()" style="color: var(--text-muted); cursor: pointer; font-size: 12px;">← Đổi Cookie khác</a>
                </div>
            </div>
        </div>
    </div>
    
    <div class="app" id="app">
        <div class="sidebar">
            <div class="header">
                <div class="header-left">
                    <div class="logo">🚀</div>
                    <div class="title">Flow <span>Gen</span></div>
                </div>
            </div>
            <div class="section">
                <div class="section-title">👤 Tài khoản</div>
                <div class="account-card">
                    <div class="account-info">
                        <div class="account-name" id="user-name">Loading...</div>
                        <div class="account-email" id="user-email"></div>
                    </div>
                    <div class="account-credits">
                        <div>
                            <div style="font-size: 11px; color: var(--text-muted);">Credits</div>
                            <div class="credits-value" id="user-credits">--</div>
                        </div>
                        <div class="tier-badge" id="user-tier">TIER 1</div>
                    </div>
                </div>
                <button class="btn btn-secondary" onclick="logout()" style="padding: 10px;">🚪 Đăng xuất</button>
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
                <div class="ref-upload-area" id="ref-upload-area">
                    <div class="ref-slots" id="ref-slots">
                        <div class="ref-slot" data-index="0"><span>+</span></div>
                        <div class="ref-slot" data-index="1"><span>+</span></div>
                        <div class="ref-slot" data-index="2"><span>+</span></div>
                        <div class="ref-slot" data-index="3"><span>+</span></div>
                    </div>
                    <input type="file" id="ref-file-input" accept="image/*" multiple style="display:none;">
                    <div class="ref-hint">Kéo thả hoặc click để upload (tối đa 4 ảnh)</div>
                </div>
            </div>
            <div class="section">
                <div class="section-title">📝 Prompts</div>
                <textarea id="prompts" rows="5" placeholder="Nhập prompt, mỗi dòng 1 prompt..."></textarea>
                <div class="control-row" style="margin-top: 12px;">
                    <button class="btn btn-primary" id="btn-generate" onclick="startGeneration()">▶️ Tạo ảnh</button>
                    <button class="btn btn-stop" onclick="stopGeneration()">⏹️ Dừng</button>
                </div>
            </div>
        </div>
        <div class="main">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="font-size: 20px;">📷 Ảnh đã tạo</h2>
                <div style="display: flex; gap: 10px;">
                    <button class="btn btn-secondary" onclick="clearAllTasks()" style="width: auto; padding: 10px 16px;">🗑️ Xóa</button>
                    <button class="btn btn-primary" onclick="downloadAll()" style="width: auto; padding: 10px 16px;">⬇️ Tải ZIP</button>
                </div>
            </div>
            <div class="stats-bar">
                <div class="stat pending"><div class="stat-value" id="stat-pending">0</div><div class="stat-label">Chờ</div></div>
                <div class="stat processing"><div class="stat-value" id="stat-processing">0</div><div class="stat-label">Đang tạo</div></div>
                <div class="stat done"><div class="stat-value" id="stat-done">0</div><div class="stat-label">Xong</div></div>
                <div class="stat error"><div class="stat-value" id="stat-error">0</div><div class="stat-label">Lỗi</div></div>
            </div>
            <div class="task-list" id="task-list">
                <div class="empty-state"><div class="empty-state-icon">🎨</div><div>Nhập prompt và bấm Tạo ảnh!</div></div>
            </div>
        </div>
    </div>
    
    <div class="modal" id="help-modal"><div class="modal-content"><button class="modal-close" onclick="closeHelp()">✕</button><div class="modal-title" id="help-title"></div><div id="help-content"></div></div></div>
    <div class="lightbox" id="lightbox"><div class="lightbox-header"><div id="lightbox-info"></div><button class="lightbox-close" onclick="closeLightbox()">✕</button></div><div class="lightbox-body"><img id="lightbox-img" class="lightbox-img"></div></div>
    <div class="notification" id="notification"></div>
    <div class="loading-overlay" id="loading"><div class="loading-spinner"></div><div class="loading-text" id="loading-text">Đang xử lý...</div></div>

    <script>
        // ========== CONFIG ==========
        // API_BASE rỗng = dùng relative path (cùng domain với frontend)
        const API_BASE = '';
        const SANDBOX_URL = 'https://aisandbox-pa.googleapis.com/v1';
        const API_KEY = 'AIzaSyBtrm0o5ab1c-Ec8ZuLcGt3oJAA5VWt3pY';
        
        // ========== STATE ==========
        let cookie = '', token = '', projectId = '';
        let userInfo = {};
        let tasks = [], isGenerating = false, isStopped = false;
        let selectedModel = 'GEM_PIX_2', selectedAspect = 'IMAGE_ASPECT_RATIO_LANDSCAPE', selectedCount = 4;
        let refImages = [null, null, null, null];
        
        // ========== INIT ==========
        function init() {
            const saved = localStorage.getItem('flow_pro_belike');
            if (saved) {
                try {
                    const d = JSON.parse(saved);
                    if (d.cookie) document.getElementById('input-cookie').value = d.cookie;
                } catch(e) {}
            }
            setupOptions();
            setupRefUpload();
        }
        
        function setupOptions() {
            ['model-btns', 'aspect-btns', 'count-btns'].forEach(id => {
                document.getElementById(id).addEventListener('click', e => {
                    if (e.target.classList.contains('option-btn')) {
                        e.target.parentElement.querySelectorAll('.option-btn').forEach(b => b.classList.remove('active'));
                        e.target.classList.add('active');
                        const v = e.target.dataset.value;
                        if (id === 'model-btns') selectedModel = v;
                        else if (id === 'aspect-btns') selectedAspect = v;
                        else selectedCount = parseInt(v);
                    }
                });
            });
        }
        
        // ========== LOGIN - STEP BY STEP ==========
        
        // Step 1: Verify Cookie
        async function handleVerifyCookie() {
            cookie = document.getElementById('input-cookie').value.trim();
            
            if (!cookie) { 
                showLoginError('Vui lòng nhập Cookie'); 
                return; 
            }
            
            const btn = document.getElementById('btn-verify');
            btn.disabled = true;
            btn.innerHTML = '⏳ Đang xác thực...';
            hideLoginError();
            
            try {
                // Call verify session
                const verifyRes = await fetch(API_BASE + '/api/proxy/verify-session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ cookie })
                });
                
                const verifyData = await verifyRes.json();
                
                if (!verifyRes.ok || !verifyData.success) {
                    throw new Error(verifyData.error || 'Cookie không hợp lệ hoặc đã hết hạn');
                }
                
                token = verifyData.accessToken;
                userInfo = verifyData.sessionData?.user || {};
                
                // Check credits
                try {
                    const creditsRes = await fetch(API_BASE + '/api/proxy/check-credits', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ bearerToken: token })
                    });
                    const creditsData = await creditsRes.json();
                    userInfo.credits = creditsData.credits || 0;
                    userInfo.tier = creditsData.userPaygateTier || 'PAYGATE_TIER_ONE';
                } catch(e) {
                    userInfo.credits = '?';
                    userInfo.tier = 'PAYGATE_TIER_ONE';
                }
                
                // Show success and move to step 2
                showLoginSuccess('✅ Xác thực thành công!');
                showStep2();
                
            } catch (e) {
                showLoginError(e.message);
            } finally {
                btn.disabled = false;
                btn.innerHTML = '🔍 Xác thực Cookie';
            }
        }
        
        // Show Step 2: User Info + Create Project
        function showStep2() {
            document.getElementById('step-cookie').style.display = 'none';
            document.getElementById('step-project').style.display = 'block';
            
            // Display user info
            document.getElementById('user-name-display').textContent = userInfo.name || 'User';
            document.getElementById('user-email-display').textContent = userInfo.email || '';
            document.getElementById('user-credits-display').textContent = userInfo.credits || '?';
            
            // Set avatar
            if (userInfo.image) {
                document.getElementById('user-avatar').innerHTML = `<img src="${userInfo.image}" alt="avatar">`;
            }
            
            // Default project name
            document.getElementById('input-project-name').value = 'Flow Project ' + new Date().toLocaleDateString('vi-VN');
            
            // Try to extract project ID from cookie callback-url
            const callbackMatch = cookie.match(/callback-url=([^;]+)/);
            if (callbackMatch) {
                const callbackUrl = decodeURIComponent(callbackMatch[1]);
                const projectMatch = callbackUrl.match(/project\/([a-f0-9-]{36})/);
                if (projectMatch) {
                    document.getElementById('input-project-id').value = projectMatch[1];
                    showLoginSuccess('✅ Đã tìm thấy Project ID trong cookie!');
                }
            }
        }
        
        // Step 2: Create Project
        async function handleCreateProject() {
            const projectName = document.getElementById('input-project-name').value.trim() || 'Flow Project';
            
            const btn = document.getElementById('btn-create-project');
            btn.disabled = true;
            btn.innerHTML = '⏳ Đang tạo project...';
            hideLoginError();
            
            try {
                // Try to create project via Worker
                const projectRes = await fetch(API_BASE + '/api/proxy/create-project', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ cookie, projectName })
                });
                
                const projectData = await projectRes.json();
                
                if (projectData.success && projectData.projectId) {
                    projectId = projectData.projectId;
                    localStorage.setItem('flow_pro_belike', JSON.stringify({ cookie, projectId }));
                    showApp();
                } else {
                    throw new Error(projectData.error || 'Tạo project thất bại');
                }
                
            } catch (e) {
                // Show error but don't block - user can use existing project
                showLoginError('Tạo project tự động thất bại. Vui lòng dùng Project có sẵn hoặc tạo trên labs.google/fx rồi nhập Project ID.');
            } finally {
                btn.disabled = false;
                btn.innerHTML = '📁 Tạo Project mới';
            }
        }
        
        // Use existing project
        function handleUseExistingProject() {
            const inputProjectId = document.getElementById('input-project-id').value.trim();
            
            if (!inputProjectId) {
                showLoginError('Vui lòng nhập Project ID');
                return;
            }
            
            // Validate UUID format
            if (!/^[a-f0-9-]{36}$/.test(inputProjectId)) {
                showLoginError('Project ID không hợp lệ. Phải là UUID 36 ký tự (vd: abc12345-1234-1234-1234-123456789abc)');
                return;
            }
            
            projectId = inputProjectId;
            localStorage.setItem('flow_pro_belike', JSON.stringify({ cookie, projectId }));
            showApp();
        }
        
        function showProjectIdHelp() {
            document.getElementById('help-title').textContent = '🔗 Cách lấy Project ID';
            document.getElementById('help-content').innerHTML = `
                <div class="help-step"><span class="help-step-num">1</span> Mở <b>labs.google/fx/tools/flow</b></div>
                <div class="help-step"><span class="help-step-num">2</span> Tạo hoặc mở một Project bất kỳ</div>
                <div class="help-step"><span class="help-step-num">3</span> Nhìn URL trên thanh địa chỉ:
                    <p style="margin-top: 8px; word-break: break-all;"><code>labs.google/fx/tools/flow/project/<b style="color: var(--accent-cyan);">abc12345-1234-1234-1234-123456789abc</b></code></p>
                </div>
                <div class="help-step"><span class="help-step-num">4</span> Copy phần <b>UUID 36 ký tự</b> (có dấu gạch ngang)</div>
            `;
            document.getElementById('help-modal').classList.add('show');
        }
        
        // Reset to step 1
        function resetLogin() {
            document.getElementById('step-cookie').style.display = 'block';
            document.getElementById('step-project').style.display = 'none';
            hideLoginError();
            hideLoginSuccess();
            token = '';
            userInfo = {};
        }
        
        function hideLoginError() {
            document.getElementById('login-error').classList.remove('show');
        }
        
        function hideLoginSuccess() {
            document.getElementById('login-success').classList.remove('show');
        }
        
        function showLoginSuccess(msg) {
            const el = document.getElementById('login-success');
            el.textContent = msg;
            el.classList.add('show');
            hideLoginError();
        }
        
        function showLoginError(msg) {
            const el = document.getElementById('login-error');
            el.textContent = msg;
            el.classList.add('show');
            document.getElementById('login-success').classList.remove('show');
        }
        
        function logout() {
            localStorage.removeItem('flow_pro_belike');
            location.reload();
        }
        
        function showApp() {
            document.getElementById('login-screen').style.display = 'none';
            document.getElementById('app').classList.add('show');
            document.getElementById('user-name').textContent = userInfo.name || 'User';
            document.getElementById('user-email').textContent = userInfo.email || '';
            document.getElementById('user-credits').textContent = userInfo.credits || '?';
            document.getElementById('user-tier').textContent = userInfo.tier?.includes('TWO') ? 'TIER 2' : 'TIER 1';
        }
        
        // ========== REFERENCE IMAGES ==========
        function setupRefUpload() {
            const area = document.getElementById('ref-upload-area');
            const input = document.getElementById('ref-file-input');
            const slots = document.getElementById('ref-slots');
            
            slots.addEventListener('click', (e) => {
                const slot = e.target.closest('.ref-slot');
                if (!slot) return;
                
                if (e.target.classList.contains('ref-remove')) {
                    const idx = parseInt(slot.dataset.index);
                    refImages[idx] = null;
                    renderRefSlots();
                    return;
                }
                
                const idx = parseInt(slot.dataset.index);
                if (!refImages[idx]) {
                    input.dataset.targetIndex = idx;
                    input.click();
                }
            });
            
            input.addEventListener('change', async (e) => {
                const files = Array.from(e.target.files);
                let startIdx = parseInt(input.dataset.targetIndex) || 0;
                
                for (const file of files) {
                    while (startIdx < 4 && refImages[startIdx]) startIdx++;
                    if (startIdx >= 4) break;
                    await uploadRefImage(file, startIdx);
                    startIdx++;
                }
                input.value = '';
            });
            
            area.addEventListener('dragover', (e) => { e.preventDefault(); area.classList.add('dragover'); });
            area.addEventListener('dragleave', () => { area.classList.remove('dragover'); });
            area.addEventListener('drop', async (e) => {
                e.preventDefault();
                area.classList.remove('dragover');
                const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
                let idx = 0;
                for (const file of files) {
                    while (idx < 4 && refImages[idx]) idx++;
                    if (idx >= 4) break;
                    await uploadRefImage(file, idx);
                    idx++;
                }
            });
        }
        
        async function uploadRefImage(file, index) {
            const base64 = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result.split(',')[1]);
                reader.readAsDataURL(file);
            });
            
            const mimeType = file.type || 'image/png';
            refImages[index] = { base64, id: null, uploading: true };
            renderRefSlots();
            
            try {
                const payload = {
                    imageInput: {
                        rawImageBytes: base64,
                        mimeType: mimeType,
                        isUserUploaded: true,
                        aspectRatio: selectedAspect
                    },
                    clientContext: {
                        sessionId: `;${Date.now()}`,
                        tool: "ASSET_MANAGER"
                    }
                };
                
                // Gọi qua Vercel API thay vì trực tiếp đến Google
                const response = await fetch(`${API_BASE}/api/proxy/uploadUserImage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        bearerToken: token,
                        payload: payload
                    })
                });
                
                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.error || `Upload failed: ${response.status}`);
                }
                
                const data = await response.json();
                const refId = data?.mediaGenerationId?.mediaGenerationId || data?.mediaGenerationId || data?.name;
                
                if (refId) {
                    refImages[index] = { base64, id: refId, uploading: false };
                    showNotification('✅ Upload thành công!');
                } else {
                    throw new Error('No reference ID');
                }
            } catch (e) {
                refImages[index] = null;
                showNotification('❌ Upload thất bại: ' + e.message, true);
            }
            
            renderRefSlots();
        }
        
        function renderRefSlots() {
            document.querySelectorAll('.ref-slot').forEach((slot, idx) => {
                const ref = refImages[idx];
                if (ref) {
                    slot.innerHTML = `<img src="data:image/png;base64,${ref.base64}" alt="ref"><button class="ref-remove">✕</button>`;
                    slot.classList.toggle('uploading', ref.uploading);
                } else {
                    slot.innerHTML = '<span>+</span>';
                    slot.classList.remove('uploading');
                }
            });
        }
        
        // ========== GENERATE ==========
        async function startGeneration() {
            const promptsText = document.getElementById('prompts').value.trim();
            if (!promptsText) { showNotification('Nhập prompt!', true); return; }
            
            const prompts = promptsText.split('\n').filter(p => p.trim());
            if (!prompts.length) return;
            
            const validRefs = refImages.filter(r => r && r.id && !r.uploading);
            
            isGenerating = true; isStopped = false;
            document.getElementById('btn-generate').disabled = true;
            
            for (const p of prompts) {
                tasks.unshift({
                    id: Date.now() + Math.random(),
                    prompt: p.trim(),
                    status: 'pending',
                    images: [],
                    error: null
                });
            }
            renderTasks();
            
            for (const task of tasks.filter(t => t.status === 'pending')) {
                if (isStopped) break;
                
                task.status = 'processing';
                renderTasks();
                
                try {
                    const requests = [];
                    for (let i = 0; i < selectedCount; i++) {
                        const req = {
                            clientContext: { sessionId: `;${Date.now()}`, tool: "PINHOLE" },
                            seed: Math.floor(Math.random() * 900000) + 100000,
                            imageModelName: selectedModel,
                            imageAspectRatio: selectedAspect,
                            prompt: task.prompt
                        };
                        
                        if (validRefs.length > 0) {
                            req.imageInputs = validRefs.map(ref => ({
                                name: ref.id,
                                imageInputType: 'IMAGE_INPUT_TYPE_REFERENCE'
                            }));
                        }
                        
                        requests.push(req);
                    }
                    
                    const res = await fetch(`${API_BASE}/api/proxy/batchGenerateImages`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            bearerToken: token,
                            projectId: projectId,
                            payload: { requests }
                        })
                    });
                    
                    if (!res.ok) {
                        const errData = await res.json().catch(() => ({}));
                        throw new Error(errData.error || `HTTP ${res.status}`);
                    }
                    
                    const data = await res.json();
                    console.log('Generate response:', JSON.stringify(data).substring(0, 500));
                    
                    // Extract images from data.media[].image.generatedImage.encodedImage
                    let imgs = [];
                    
                    if (data.media && Array.isArray(data.media)) {
                        imgs = data.media.map(m => {
                            // Path: image.generatedImage.encodedImage
                            if (m?.image?.generatedImage?.encodedImage) {
                                return `data:image/png;base64,${m.image.generatedImage.encodedImage}`;
                            }
                            // Fallback: image.encodedImage
                            if (m?.image?.encodedImage) {
                                return `data:image/png;base64,${m.image.encodedImage}`;
                            }
                            // Fallback: generatedImage.encodedImage
                            if (m?.generatedImage?.encodedImage) {
                                return `data:image/png;base64,${m.generatedImage.encodedImage}`;
                            }
                            return null;
                        }).filter(Boolean);
                    }
                    
                    console.log('Extracted images:', imgs.length);
                    
                    if (imgs.length) {
                        task.images = imgs;
                        task.status = 'done';
                    } else {
                        console.error('Could not extract images from response');
                        throw new Error('No images returned');
                    }
                    
                } catch (e) {
                    task.status = 'error';
                    task.error = e.message;
                    if (e.message.includes('401') || e.message.includes('403')) {
                        showNotification('Token hết hạn! Đăng xuất và đăng nhập lại.', true);
                    }
                }
                
                renderTasks();
                await sleep(1500);
            }
            
            isGenerating = false;
            document.getElementById('btn-generate').disabled = false;
            
            const done = tasks.filter(t => t.status === 'done').length;
            if (done) {
                showNotification(`✅ Hoàn thành ${done} prompts!`);
                playSound();
            }
        }
        
        function stopGeneration() {
            isStopped = true;
            isGenerating = false;
            document.getElementById('btn-generate').disabled = false;
            showNotification('Đã dừng');
        }
        
        function renderTasks() {
            const list = document.getElementById('task-list');
            if (!tasks.length) {
                list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🎨</div><div>Nhập prompt và bấm Tạo ảnh!</div></div>';
                updateStats();
                return;
            }
            list.innerHTML = tasks.map(t => `
                <div class="task-row ${t.status}">
                    <div class="task-status-bar ${t.status}"></div>
                    <div class="task-content">
                        <div class="task-header">
                            <span class="task-badge ${t.status}">${t.status}</span>
                            <span class="task-prompt">${esc(t.prompt)}</span>
                        </div>
                        <div class="task-meta">
                            ${t.error ? `<span style="color:var(--accent-red)">⚠️ ${esc(t.error.substring(0, 80))}</span>` : ''}
                            ${t.images.length ? `<span style="color:var(--accent-green)">${t.images.length} ảnh</span>` : ''}
                        </div>
                    </div>
                    ${t.images.length ? `<div class="task-images">${t.images.map(img => `<div class="task-thumb" onclick="openLightbox('${img}','${esc(t.prompt)}')"><img src="${img}" loading="lazy"></div>`).join('')}</div>` : ''}
                </div>
            `).join('');
            updateStats();
        }
        
        function updateStats() {
            const c = { pending: 0, processing: 0, done: 0, error: 0 };
            tasks.forEach(t => c[t.status]++);
            ['pending', 'processing', 'done', 'error'].forEach(s => document.getElementById('stat-' + s).textContent = c[s]);
        }
        
        function clearAllTasks() { if (confirm('Xóa tất cả?')) { tasks = []; renderTasks(); } }
        
        async function downloadAll() {
            const done = tasks.filter(t => t.status === 'done' && t.images.length);
            if (!done.length) { showNotification('Chưa có ảnh', true); return; }
            showLoading('Tạo ZIP...');
            const zip = new JSZip();
            let n = 0;
            for (let ti = 0; ti < done.length; ti++) {
                for (let ii = 0; ii < done[ti].images.length; ii++) {
                    try {
                        const img = done[ti].images[ii];
                        let blob;
                        if (img.startsWith('data:')) {
                            const b64 = img.split(',')[1], bin = atob(b64), arr = new Uint8Array(bin.length);
                            for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
                            blob = new Blob([arr], { type: 'image/png' });
                        } else {
                            blob = await (await fetch(img)).blob();
                        }
                        zip.file(`p${ti + 1}_img${ii + 1}.png`, blob);
                        n++;
                    } catch (e) {}
                }
            }
            saveAs(await zip.generateAsync({ type: 'blob' }), `flow_${n}imgs_${Date.now()}.zip`);
            hideLoading();
            showNotification(`Tải ${n} ảnh`);
        }
        
        // ========== UI ==========
        function openLightbox(url, prompt) {
            document.getElementById('lightbox-img').src = url;
            document.getElementById('lightbox-info').textContent = prompt;
            document.getElementById('lightbox').classList.add('show');
        }
        function closeLightbox() { document.getElementById('lightbox').classList.remove('show'); }
        
        function showCookieHelp() {
            document.getElementById('help-title').textContent = '🍪 Hướng dẫn lấy Cookie';
            document.getElementById('help-content').innerHTML = `
                <div class="help-step"><span class="help-step-num">1</span> Mở <b>labs.google/fx/tools/flow</b></div>
                <div class="help-step"><span class="help-step-num">2</span> Đăng nhập Google (nếu chưa)</div>
                <div class="help-step"><span class="help-step-num">3</span> <b>Tạo 1 project</b> bất kỳ (quan trọng!)</div>
                <div class="help-step"><span class="help-step-num">4</span> Nhấn <b>F12</b> → Tab <b>Console</b></div>
                <div class="help-step"><span class="help-step-num">5</span> Gõ <code>document.cookie</code> và Enter</div>
                <div class="help-step"><span class="help-step-num">6</span> Copy toàn bộ kết quả (chuỗi dài)</div>
                <div class="help-step"><span class="help-step-num">⚠️</span> Cookie có thể hết hạn sau vài giờ. Nếu lỗi, lấy cookie mới.</div>
            `;
            document.getElementById('help-modal').classList.add('show');
        }
        function closeHelp() { document.getElementById('help-modal').classList.remove('show'); }
        
        function showLoading(text) {
            document.getElementById('loading-text').textContent = text || 'Đang xử lý...';
            document.getElementById('loading').classList.add('show');
        }
        function hideLoading() { document.getElementById('loading').classList.remove('show'); }
        
        function showNotification(msg, err = false) {
            const el = document.getElementById('notification');
            el.textContent = msg;
            el.classList.toggle('error', err);
            el.classList.add('show');
            setTimeout(() => el.classList.remove('show'), 3000);
        }
        
        function playSound() {
            try {
                const ctx = new AudioContext();
                [523, 659, 784, 1047].forEach((f, i) => {
                    const o = ctx.createOscillator(), g = ctx.createGain();
                    o.connect(g); g.connect(ctx.destination);
                    o.frequency.value = f;
                    g.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.15);
                    g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.15 + 0.3);
                    o.start(ctx.currentTime + i * 0.15);
                    o.stop(ctx.currentTime + i * 0.15 + 0.3);
                });
            } catch(e) {}
        }
        
        function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
        function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
        
        document.getElementById('help-modal').onclick = e => { if (e.target.id === 'help-modal') closeHelp(); };
        document.getElementById('lightbox').onclick = e => { if (e.target.id === 'lightbox' || e.target.classList.contains('lightbox-body')) closeLightbox(); };
        
        init();
    </script>
</body>
</html>
