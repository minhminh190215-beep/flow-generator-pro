/**
 * Flow Generator Pro - Vercel API
 * Giống Belike Studio
 */

import express from 'express';
import fetch from 'node-fetch';

const app = express();

// Constants
const API_KEY = "AIzaSyBtrm0o5ab1c-Ec8ZuLcGt3oJAA5VWt3pY";
const SANDBOX_URL = "https://aisandbox-pa.googleapis.com/v1";
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36';

// CORS Middleware
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    } else {
        res.setHeader("Access-Control-Allow-Origin", "*");
    }
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json({ limit: '50mb' }));

// Logging
app.use((req, res, next) => {
    if (req.method !== 'OPTIONS') {
        console.log(`📨 ${req.method} ${req.url}`);
    }
    next();
});

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

// ========== API ENDPOINTS ==========

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', version: '1.0.0', timestamp: new Date().toISOString() });
});

// Verify Session - Lấy token từ cookie
app.post('/api/proxy/verify-session', async (req, res) => {
    const { cookie } = req.body;

    if (!cookie) {
        return res.status(400).json({ error: 'Cookie is required', success: false });
    }

    try {
        const response = await fetch('https://labs.google/fx/api/auth/session', {
            method: 'GET',
            headers: getGoogleHeaders(cookie),
            redirect: 'follow'
        });

        const text = await response.text();

        if (text.startsWith('<!') || text.startsWith('<html') || text.includes('<!DOCTYPE')) {
            return res.status(401).json({ 
                error: 'Cookie expired or invalid. Please get a new cookie from labs.google/fx', 
                success: false 
            });
        }

        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            return res.status(400).json({ error: 'Invalid response from Google', success: false });
        }

        if (!data.access_token) {
            return res.status(401).json({ 
                error: 'No access_token in session. Please login at labs.google/fx', 
                success: false 
            });
        }

        res.json({
            success: true,
            sessionData: {
                user: {
                    name: data.user?.name || '',
                    email: data.user?.email || '',
                    image: data.user?.image || ''
                },
                expires: data.expires,
                access_token: data.access_token
            },
            accessToken: data.access_token
        });

    } catch (e) {
        console.error('Verify session error:', e.message);
        res.status(500).json({ error: 'Verify session failed: ' + e.message, success: false });
    }
});

// Check Credits
app.post('/api/proxy/check-credits', async (req, res) => {
    const { bearerToken } = req.body;

    if (!bearerToken) {
        return res.status(400).json({ error: 'bearerToken is required' });
    }

    try {
        const response = await fetch(`${SANDBOX_URL}:getFlowUserInfo?key=${API_KEY}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${bearerToken}`,
                'User-Agent': USER_AGENT,
                'Referer': 'https://labs.google/',
            }
        });

        if (!response.ok) {
            const errText = await response.text();
            return res.status(response.status).json({ error: errText.substring(0, 200) });
        }

        const data = await response.json();
        res.json({
            credits: data.credits || data.remainingCredits || 0,
            userPaygateTier: data.userPaygateTier || 'PAYGATE_TIER_ONE',
            ...data
        });

    } catch (e) {
        console.error('Check credits error:', e.message);
        res.status(500).json({ error: e.message });
    }
});

// Create Project
app.post('/api/proxy/create-project', async (req, res) => {
    const { cookie, projectName } = req.body;

    if (!cookie) {
        return res.status(400).json({ error: 'Cookie is required', success: false });
    }

    const name = projectName || `Flow Project ${Date.now()}`;

    try {
        // Method 1: tRPC endpoint
        const payload = {
            "0": {
                "json": {
                    "projectName": name,
                    "tool": "FLOW"
                }
            }
        };

        const response = await fetch('https://labs.google/fx/api/trpc/projects.create?batch=1', {
            method: 'POST',
            headers: {
                ...getGoogleHeaders(cookie),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        const text = await response.text();

        if (!response.ok) {
            console.error('Create project failed:', text.substring(0, 200));
            return res.status(response.status).json({ 
                error: 'Create project failed: ' + text.substring(0, 200), 
                success: false 
            });
        }

        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            return res.status(400).json({ error: 'Invalid response', success: false });
        }

        // Extract project ID
        const projectId = data[0]?.result?.data?.json?.id ||
                          data[0]?.result?.data?.id ||
                          data.id ||
                          data.projectId;

        if (!projectId) {
            return res.status(400).json({ error: 'Could not extract project ID', success: false });
        }

        res.json({
            success: true,
            projectId: projectId,
            projectName: name
        });

    } catch (e) {
        console.error('Create project error:', e.message);
        res.status(500).json({ error: e.message, success: false });
    }
});

// Upload Reference Image
app.post('/api/proxy/uploadUserImage', async (req, res) => {
    const { bearerToken, payload } = req.body;

    if (!bearerToken || !payload) {
        return res.status(400).json({ error: 'bearerToken and payload are required' });
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
            return res.status(response.status).json({ error: errText.substring(0, 200) });
        }

        const data = await response.json();
        res.json(data);

    } catch (e) {
        console.error('Upload error:', e.message);
        res.status(500).json({ error: e.message });
    }
});

// Batch Generate Images
app.post('/api/proxy/batchGenerateImages', async (req, res) => {
    const { bearerToken, projectId, payload } = req.body;

    if (!bearerToken || !projectId || !payload) {
        return res.status(400).json({ error: 'bearerToken, projectId and payload are required' });
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
            return res.status(response.status).json({ error: errText.substring(0, 200) });
        }

        const data = await response.json();
        res.json(data);

    } catch (e) {
        console.error('Generate error:', e.message);
        res.status(500).json({ error: e.message });
    }
});

// Check Operation Status
app.get('/api/proxy/operations/:opId', async (req, res) => {
    const { opId } = req.params;
    const bearerToken = req.query.bearerToken;

    if (!bearerToken) {
        return res.status(400).json({ error: 'bearerToken is required' });
    }

    try {
        const response = await fetch(`${SANDBOX_URL}/operations/${opId}?key=${API_KEY}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${bearerToken}`,
                'User-Agent': USER_AGENT,
                'Referer': 'https://labs.google/',
            }
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: 'Status check failed' });
        }

        const data = await response.json();
        res.json(data);

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Catch all
app.all('*', (req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

export default app;
