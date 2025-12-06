/**
 * Flow Generator Pro - Vercel Serverless API
 * Native Vercel format (no Express)
 */

const API_KEY = "AIzaSyBtrm0o5ab1c-Ec8ZuLcGt3oJAA5VWt3pY";
const SANDBOX_URL = "https://aisandbox-pa.googleapis.com/v1";
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36';

// Helper: Get headers for Google requests
function getGoogleHeaders(cookie, bearerToken = null) {
    const headers = {
        'User-Agent': USER_AGENT,
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9,vi;q=0.8',
        'Referer': 'https://labs.google/fx/',
        'Origin': 'https://labs.google',
        'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
    };
    if (cookie) headers['Cookie'] = cookie;
    if (bearerToken) headers['Authorization'] = `Bearer ${bearerToken}`;
    return headers;
}

// JSON response helper
function jsonResponse(res, data, status = 200) {
    res.status(status).json(data);
}

// ========== HANDLERS ==========

async function handleVerifySession(req, res) {
    const { cookie } = req.body;
    
    if (!cookie) {
        return jsonResponse(res, { error: 'Cookie is required', success: false }, 400);
    }

    try {
        const response = await fetch('https://labs.google/fx/api/auth/session', {
            method: 'GET',
            headers: getGoogleHeaders(cookie),
            redirect: 'follow'
        });

        const text = await response.text();
        console.log('Session response length:', text.length);

        if (text.startsWith('<!') || text.startsWith('<html') || text.includes('<!DOCTYPE')) {
            return jsonResponse(res, { 
                error: 'Cookie expired or invalid', 
                success: false 
            }, 401);
        }

        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            return jsonResponse(res, { error: 'Invalid response from Google', success: false }, 400);
        }

        if (!data.access_token) {
            return jsonResponse(res, { 
                error: 'No access_token in session', 
                success: false 
            }, 401);
        }

        return jsonResponse(res, {
            success: true,
            sessionData: {
                user: {
                    name: data.user?.name || '',
                    email: data.user?.email || '',
                    image: data.user?.image || ''
                },
                expires: data.expires
            },
            accessToken: data.access_token
        });

    } catch (e) {
        console.error('Verify session error:', e.message);
        return jsonResponse(res, { error: e.message, success: false }, 500);
    }
}

async function handleCheckCredits(req, res) {
    const { bearerToken } = req.body;
    
    if (!bearerToken) {
        return jsonResponse(res, { error: 'bearerToken is required' }, 400);
    }

    try {
        const url = `${SANDBOX_URL}:getFlowUserInfo?key=${API_KEY}`;
        console.log('Fetching credits from:', url);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${bearerToken}`,
                'User-Agent': USER_AGENT,
                'Referer': 'https://labs.google/',
                'Origin': 'https://labs.google',
            }
        });

        const text = await response.text();
        console.log('Credits response:', response.status, text.substring(0, 200));

        if (!response.ok) {
            return jsonResponse(res, { credits: '?', userPaygateTier: 'UNKNOWN' });
        }

        const data = JSON.parse(text);
        return jsonResponse(res, {
            credits: data.credits || data.remainingCredits || 0,
            userPaygateTier: data.userPaygateTier || 'PAYGATE_TIER_ONE',
            ...data
        });

    } catch (e) {
        console.error('Credits error:', e.message);
        return jsonResponse(res, { credits: '?', userPaygateTier: 'UNKNOWN' });
    }
}

async function handleCreateProject(req, res) {
    const { cookie, projectName } = req.body;
    
    if (!cookie) {
        return jsonResponse(res, { error: 'Cookie is required', success: false }, 400);
    }

    const name = projectName || `Flow Project ${Date.now()}`;

    try {
        // Try without batch
        const payload = { json: { projectName: name, tool: "FLOW" } };
        
        console.log('Creating project:', name);
        
        const response = await fetch('https://labs.google/fx/api/trpc/projects.create', {
            method: 'POST',
            headers: {
                ...getGoogleHeaders(cookie),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        const text = await response.text();
        console.log('Create project response:', response.status, text.substring(0, 300));

        if (!response.ok) {
            return jsonResponse(res, { 
                error: text.substring(0, 200), 
                success: false 
            }, response.status);
        }

        const data = JSON.parse(text);
        
        // Try to extract project ID from various paths
        const projectId = data?.result?.data?.json?.id ||
                          data?.result?.data?.id ||
                          data?.data?.json?.id ||
                          data?.json?.id ||
                          data?.id;

        if (!projectId) {
            console.error('No project ID in response:', JSON.stringify(data).substring(0, 300));
            return jsonResponse(res, { error: 'Could not extract project ID', success: false }, 400);
        }

        return jsonResponse(res, {
            success: true,
            projectId: projectId,
            projectName: name
        });

    } catch (e) {
        console.error('Create project error:', e.message);
        return jsonResponse(res, { error: e.message, success: false }, 500);
    }
}

async function handleUploadImage(req, res) {
    const { bearerToken, payload } = req.body;
    
    if (!bearerToken || !payload) {
        return jsonResponse(res, { error: 'bearerToken and payload are required' }, 400);
    }

    try {
        const response = await fetch(`${SANDBOX_URL}:uploadUserImage?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${bearerToken}`,
                'Content-Type': 'text/plain;charset=UTF-8',
                'Referer': 'https://labs.google/',
                'User-Agent': USER_AGENT,
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error('Upload failed:', errText.substring(0, 200));
            return jsonResponse(res, { error: errText.substring(0, 200) }, response.status);
        }

        const data = await response.json();
        return jsonResponse(res, data);

    } catch (e) {
        console.error('Upload error:', e.message);
        return jsonResponse(res, { error: e.message }, 500);
    }
}

async function handleBatchGenerate(req, res) {
    const { bearerToken, projectId, payload } = req.body;
    
    if (!bearerToken || !projectId || !payload) {
        return jsonResponse(res, { error: 'bearerToken, projectId and payload are required' }, 400);
    }

    try {
        const response = await fetch(`${SANDBOX_URL}/projects/${projectId}/flowMedia:batchGenerateImages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${bearerToken}`,
                'Content-Type': 'text/plain;charset=UTF-8',
                'Referer': 'https://labs.google/',
                'User-Agent': USER_AGENT,
                'x-browser-channel': 'stable',
                'x-browser-copyright': 'Copyright 2025 Google LLC. All Rights reserved.',
                'x-browser-validation': 'Aj9fzfu+SaGLBY9Oqr3S7RokOtM=',
                'x-browser-year': '2025',
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error('Generate failed:', errText.substring(0, 200));
            return jsonResponse(res, { error: errText.substring(0, 200) }, response.status);
        }

        const data = await response.json();
        return jsonResponse(res, data);

    } catch (e) {
        console.error('Generate error:', e.message);
        return jsonResponse(res, { error: e.message }, 500);
    }
}

// ========== MAIN HANDLER ==========

module.exports = async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle OPTIONS
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const path = req.url.split('?')[0];
    console.log(`📨 ${req.method} ${path}`);

    try {
        // Route requests
        if (path === '/api/health') {
            return jsonResponse(res, { status: 'ok', timestamp: new Date().toISOString() });
        }
        
        if (path === '/api/proxy/verify-session' && req.method === 'POST') {
            return await handleVerifySession(req, res);
        }
        
        if (path === '/api/proxy/check-credits' && req.method === 'POST') {
            return await handleCheckCredits(req, res);
        }
        
        if (path === '/api/proxy/create-project' && req.method === 'POST') {
            return await handleCreateProject(req, res);
        }
        
        if (path === '/api/proxy/uploadUserImage' && req.method === 'POST') {
            return await handleUploadImage(req, res);
        }
        
        if (path === '/api/proxy/batchGenerateImages' && req.method === 'POST') {
            return await handleBatchGenerate(req, res);
        }

        // 404
        return jsonResponse(res, { error: 'Endpoint not found: ' + path }, 404);

    } catch (e) {
        console.error('Handler error:', e.message);
        return jsonResponse(res, { error: e.message }, 500);
    }
};
