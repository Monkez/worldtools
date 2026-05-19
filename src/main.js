import './style.css'
import { renderDashboard } from './tools/dashboard.js'
import { renderColorPicker } from './tools/colorPicker.js'
import { renderRandomHub } from './tools/randomHub.js'
import { renderStopwatch } from './tools/stopwatch.js'
import { renderJsonFormatter } from './tools/jsonFormatter.js'
import { renderBase64 } from './tools/base64.js'
import { renderHashGenerator } from './tools/hashGenerator.js'
import { renderQrGenerator } from './tools/qrGenerator.js'
import { renderYoutubeDownloader } from './tools/youtubeDownloader.js'
import { renderUrlEncoder } from './tools/urlEncoder.js'
import { renderTextCounter } from './tools/textCounter.js'
import { renderLoremIpsum } from './tools/loremIpsum.js'
import { renderRemoveBackground } from './tools/removeBackground.js'
import { renderImageConverter } from './tools/imageConverter.js'
import { renderConvertThings } from './tools/convertThings.js'
import { renderMediaEditor } from './tools/mediaEditor.js'
import { renderImageStudio } from './tools/imageStudio.js'
import { renderAiDetector } from './tools/aiDetector.js'
import { renderPromptHelper } from './tools/promptHelper.js'
import { renderDesignPromptTemplates } from './tools/designPromptTemplates.js'
import { renderCalculator } from './tools/calculator.js'
import { renderScreenTest } from './tools/screenTest.js'
import { renderAudioTest } from './tools/audioTest.js'
import { renderKeyboardTest } from './tools/keyboardTest.js'
import { renderMouseTest } from './tools/mouseTest.js'
import { renderDeviceInfo } from './tools/deviceInfo.js'
import { renderSerialTerminal } from './tools/serialTerminal.js'
import { renderAdminDashboard } from './tools/adminDashboard.js'
import { AIClient } from './utils/aiClient.js'
import Analytics from './utils/analytics.js'

// List of all tools
export const tools = [
    {
        id: 'dashboard',
        name: 'Dashboard',
        icon: 'bx-grid-alt',
        render: renderDashboard,
        hidden: true // hidden from direct search usually, but kept in list
    },
    {
        id: 'color-picker',
        name: 'Color Picker & Palette',
        icon: 'bx-palette',
        description: 'Pick colors, generate palettes and CSS gradients.',
        category: 'Design & Media',
        render: renderColorPicker
    },
    {
        id: 'random-hub',
        name: 'Randomness Hub',
        icon: 'bx-shuffle',
        description: 'Wheel of names, numbers, lists, passwords and UUIDs.',
        category: 'Utilities',
        render: renderRandomHub
    },
    {
        id: 'stopwatch',
        name: 'Stopwatch & Timer',
        icon: 'bx-timer',
        description: 'Simple and elegant stopwatch.',
        category: 'Utilities',
        render: renderStopwatch
    },
    {
        id: 'calculator',
        name: 'Smart Calculator',
        icon: 'bx-calculator',
        description: 'Professional calculator with history and smart expressions.',
        category: 'Utilities',
        render: renderCalculator
    },
    {
        id: 'screen-test',
        name: 'Screen Test',
        icon: 'bx-desktop',
        description: 'Check for dead pixels and screen bleeding.',
        category: 'Test Devices',
        render: renderScreenTest
    },
    {
        id: 'audio-test',
        name: 'Audio & Stereo Test',
        icon: 'bx-headphone',
        description: 'Test left/right channels and speaker frequency.',
        category: 'Test Devices',
        render: renderAudioTest
    },
    {
        id: 'keyboard-test',
        name: 'Keyboard Tester',
        icon: 'bxs-keyboard',
        description: 'Test keys, modifiers, and view KeyCode properties.',
        category: 'Test Devices',
        render: renderKeyboardTest
    },
    {
        id: 'mouse-test',
        name: 'Mouse & Scroll Tester',
        icon: 'bx-mouse',
        description: 'Test mouse buttons, double-click, and scroll speed.',
        category: 'Test Devices',
        render: renderMouseTest
    },
    {
        id: 'device-info',
        name: 'Device Info',
        icon: 'bx-info-circle',
        description: 'View browser, OS, hardware, and network details.',
        category: 'Test Devices',
        render: renderDeviceInfo
    },
    {
        id: 'json-formatter',
        name: 'JSON Formatter & Validator',
        icon: 'bx-code-curly',
        description: 'Format, minify, and validate JSON data.',
        category: 'Developer Tools',
        render: renderJsonFormatter
    },
    {
        id: 'ai-detector',
        name: 'AI Content Detector',
        icon: 'bx-radar',
        description: 'Check if text was written by AI like ChatGPT.',
        category: 'AI Smart Tools',
        render: renderAiDetector
    },
    {
        id: 'prompt-helper',
        name: 'Prompt Helper',
        icon: 'bx-bulb',
        description: 'Generate professional, optimized prompts from simple ideas.',
        category: 'AI Smart Tools',
        render: renderPromptHelper
    },
    {
        id: 'design-prompt-templates',
        name: 'Design Prompt Templates',
        icon: 'bx-images',
        description: 'Save design screenshots with reusable style prompt templates.',
        category: 'Design & Media',
        render: renderDesignPromptTemplates
    },
    {
        id: 'base64',
        name: 'Base64 Encoder/Decoder',
        icon: 'bx-hash',
        description: 'Encode and decode Base64 strings.',
        category: 'Developer Tools',
        render: renderBase64
    },
    {
        id: 'hash-gen',
        name: 'Hash & Crypto Generator',
        icon: 'bx-lock-alt',
        description: 'MD5, SHA, Bcrypt, HMAC and File Checksums.',
        category: 'Developer Tools',
        render: renderHashGenerator
    },
    {
        id: 'qr-generator',
        name: 'QR Code Generator',
        icon: 'bx-qr-scan',
        description: 'Create QR codes from text or URLs.',
        category: 'Utilities',
        render: renderQrGenerator
    },
    {
        id: 'youtube-dl',
        name: 'YouTube Downloader',
        icon: 'bxl-youtube',
        description: 'Download YouTube videos and audio in high quality.',
        category: 'Design & Media',
        render: renderYoutubeDownloader
    },

    {
        id: 'url-encoder',
        name: 'URL Encoder/Decoder',
        icon: 'bx-link',
        description: 'Encode and decode URLs.',
        category: 'Developer Tools',
        render: renderUrlEncoder
    },
    {
        id: 'text-counter',
        name: 'Text & Word Counter',
        icon: 'bx-text',
        description: 'Count characters, words, lines, and spaces.',
        category: 'Text & Content',
        render: renderTextCounter
    },

    {
        id: 'lorem-ipsum',
        name: 'Lorem Ipsum Generator',
        icon: 'bx-paragraph',
        description: 'Generate placeholder text.',
        category: 'Text & Content',
        render: renderLoremIpsum
    },
    {
        id: 'remove-bg',
        name: 'AI Background Remover',
        icon: 'bx-image-alt',
        description: 'Remove image backgrounds offline using AI.',
        category: 'Design & Media',
        render: renderRemoveBackground
    },
    {
        id: 'convert-things',
        name: 'Convert Things',
        icon: 'bx-devices',
        description: 'Universal converter for Images, Audio, and Video.',
        category: 'Design & Media',
        render: renderConvertThings
    },
    {
        id: 'image-studio',
        name: 'Image Studio Pro',
        icon: 'bx-paint',
        description: 'Professional Canvas Editor with AI features.',
        category: 'Design & Media',
        render: renderImageStudio
    },
    {
        id: 'media-editor',
        name: 'Media Trimmer & Joiner',
        icon: 'bx-cut',
        description: 'Cut and merge Audio and Video files professionally.',
        category: 'Design & Media',
        render: renderMediaEditor
    },
    {
        id: 'serial-terminal',
        name: 'Serial Terminal',
        icon: 'bx-terminal',
        description: 'Professional serial port monitor like Hercules.',
        category: 'Developer Tools',
        render: renderSerialTerminal
    },
    {
        id: 'admin',
        name: 'Admin Dashboard',
        icon: 'bx-bar-chart-square',
        description: 'Analytics and traffic monitoring.',
        category: 'Admin',
        render: renderAdminDashboard,
        hidden: true
    }
];

let currentToolId = 'dashboard';

// Global fetch interceptor to automatically track all API calls
const originalFetch = window.fetch;
window.fetch = async (...args) => {
    try {
        const urlObj = typeof args[0] === 'string' ? new URL(args[0], window.location.origin) : null;
        if (urlObj && urlObj.pathname.startsWith('/api/') && !urlObj.pathname.startsWith('/api/analytics/')) {
            Analytics.trackApiCall(urlObj.pathname);
        }
    } catch { /* ignore parse errors */ }
    return originalFetch(...args);
};

document.addEventListener('DOMContentLoaded', () => {
    // Track page visit
    Analytics.trackVisit();

    const sidebar = document.getElementById('sidebar');
    const closeBtn = document.getElementById('close-sidebar');
    const openBtn = document.getElementById('open-sidebar');
    const floatingActions = document.getElementById('floating-actions');
    const quickDashboardBtn = document.getElementById('quick-dashboard');
    const toolList = document.getElementById('tool-list');
    const searchInput = document.getElementById('tool-search');

    // Toggle sidebar
    closeBtn.addEventListener('click', () => {
        sidebar.classList.add('collapsed');
    });
    
    openBtn.addEventListener('click', () => {
        sidebar.classList.remove('collapsed');
    });

    quickDashboardBtn.addEventListener('click', () => {
        loadTool('dashboard');
    });

    // Render tool list in sidebar
    const renderSidebarList = (filter = '') => {
        toolList.innerHTML = '';
        
        // Always add Dashboard first
        const dashboardBtn = document.createElement('div');
        dashboardBtn.className = `tool-item ${currentToolId === 'dashboard' ? 'active' : ''}`;
        dashboardBtn.innerHTML = `<i class='bx bx-grid-alt'></i> Dashboard`;
        dashboardBtn.addEventListener('click', () => loadTool('dashboard'));
        toolList.appendChild(dashboardBtn);

        const filteredTools = tools.filter(t => !t.hidden && t.name.toLowerCase().includes(filter.toLowerCase()));
        
        // Define desired order of categories
        const categoryOrder = ['AI Smart Tools', 'Design & Media', 'Developer Tools', 'Text & Content', 'Utilities', 'Test Devices', 'Other'];
        
        const categories = {};
        filteredTools.forEach(t => {
            const cat = t.category || 'Other';
            if (!categories[cat]) categories[cat] = [];
            categories[cat].push(t);
        });

        categoryOrder.forEach(cat => {
            if (categories[cat] && categories[cat].length > 0) {
                const header = document.createElement('div');
                header.className = 'category-header';
                header.innerText = cat;
                toolList.appendChild(header);

                categories[cat].forEach(tool => {
                    const el = document.createElement('div');
                    el.className = `tool-item ${currentToolId === tool.id ? 'active' : ''}`;
                    el.innerHTML = `<i class='bx ${tool.icon}'></i> ${tool.name}`;
                    el.addEventListener('click', () => loadTool(tool.id));
                    toolList.appendChild(el);
                });
            }
        });
    };

    renderSidebarList();

    // Search filter
    const clearSearchBtn = document.getElementById('clear-search');
    searchInput.addEventListener('input', (e) => {
        const val = e.target.value;
        clearSearchBtn.style.display = val ? 'block' : 'none';
        renderSidebarList(val);
    });

    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearSearchBtn.style.display = 'none';
        renderSidebarList('');
        searchInput.focus();
    });

    // Load initial tool
    loadTool('dashboard');

    // ==========================================
    // SETTINGS MODAL LOGIC
    // ==========================================
    const btnSettings = document.getElementById('btn-settings');
    const settingsModal = document.getElementById('settings-modal');
    const closeSettings = document.getElementById('close-settings');
    const saveSettings = document.getElementById('save-settings');
    const testConnectionBtn = document.getElementById('test-connection-btn');
    const testConnectionRes = document.getElementById('test-connection-res');
    
    // Inputs
    const aiProvider = document.getElementById('ai-provider');
    const settingsGemini = document.getElementById('settings-gemini');
    const settingsCustom = document.getElementById('settings-custom');
    
    const geminiKeyInput = document.getElementById('gemini-key-input');
    const geminiModelId = document.getElementById('gemini-model-id');
    const customBaseUrl = document.getElementById('custom-base-url');
    const customModelId = document.getElementById('custom-model-id');
    const customApiKey = document.getElementById('custom-api-key');
    const imageKeyInput = document.getElementById('image-api-key-input');
    const pollinationsApiKey = document.getElementById('pollinations-api-key');
    
    const fetchModelsBtn = document.getElementById('fetch-models-btn');
    const testImageConnectionBtn = document.getElementById('test-image-connection-btn');
    const testImageConnectionRes = document.getElementById('test-image-connection-res');

    aiProvider.addEventListener('change', () => {
        settingsGemini.style.display = 'none';
        settingsCustom.style.display = 'none';
        if (aiProvider.value === 'gemini') {
            settingsGemini.style.display = 'flex';
        } else if (aiProvider.value === 'custom') {
            settingsCustom.style.display = 'flex';
        }
    });

    const loadSettings = () => {
        const settings = AIClient.getSettings();
        aiProvider.value = settings.provider;
        geminiKeyInput.value = settings.geminiKey || '';
        if (geminiModelId) {
            if (settings.geminiModelId && !Array.from(geminiModelId.options).some(o => o.value === settings.geminiModelId)) {
                geminiModelId.add(new Option(settings.geminiModelId, settings.geminiModelId));
            }
            geminiModelId.value = settings.geminiModelId || 'gemini-1.5-flash';
        }
        customBaseUrl.value = settings.customBaseUrl || '';
        if (customModelId) {
            if (settings.customModelId && !Array.from(customModelId.options).some(o => o.value === settings.customModelId)) {
                customModelId.add(new Option(settings.customModelId, settings.customModelId));
            }
            customModelId.value = settings.customModelId || '';
        }
        customApiKey.value = settings.customApiKey || '';
        imageKeyInput.value = settings.imageKey || '';
        if (pollinationsApiKey) pollinationsApiKey.value = settings.pollinationsApiKey || '';
        aiProvider.dispatchEvent(new Event('change'));
    };

    btnSettings.addEventListener('click', () => {
        loadSettings();
        settingsModal.style.display = 'flex';
    });

    const btnAdmin = document.getElementById('btn-admin');
    if (btnAdmin) {
        btnAdmin.addEventListener('click', () => {
            loadTool('admin');
            if (window.innerWidth <= 768) {
                sidebar.classList.add('collapsed');
            }
        });
    }

    closeSettings.addEventListener('click', () => {
        settingsModal.style.display = 'none';
    });
    
    if (fetchModelsBtn) {
        fetchModelsBtn.addEventListener('click', async () => {
            const provider = aiProvider.value;
            fetchModelsBtn.disabled = true;
            fetchModelsBtn.innerHTML = "<i class='bx bx-loader-alt bx-spin'></i> Fetching...";

            try {
                if (provider === 'gemini') {
                    const key = geminiKeyInput.value.trim();
                    if (!key) throw new Error("Please enter your Gemini API Key first.");
                    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
                    const data = await response.json();
                    if (!response.ok) throw new Error(data.error?.message || "Invalid API Key or network error.");
                    
                    const textModels = data.models.filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent"));
                    const modelSelect = document.getElementById('gemini-model-id');
                    modelSelect.innerHTML = textModels.map(m => `<option value="${m.name.replace('models/', '')}">${m.displayName}</option>`).join('');
                    
                    alert(`Loaded ${textModels.length} text models. Click the dropdown arrow in the model input to see them!`);
                } else if (provider === 'custom') {
                    const baseUrl = customBaseUrl.value.trim();
                    const key = customApiKey.value.trim();
                    if (!baseUrl) throw new Error("Please enter the Custom Base URL first.");
                    
                    const response = await fetch(`${baseUrl}/models`, {
                        method: 'GET',
                        headers: key ? { 'Authorization': `Bearer ${key}` } : {}
                    });
                    const data = await response.json();
                    if (!response.ok) throw new Error(data.error?.message || "Failed to fetch models.");
                    
                    const models = Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
                    if (models.length === 0) throw new Error("No models returned from API.");
                    
                    const modelSelect = document.getElementById('custom-model-id');
                    modelSelect.innerHTML = models.map(m => `<option value="${m.id}">${m.id}</option>`).join('');
                    
                    alert(`Loaded ${models.length} models. Click the dropdown arrow in the model input to see them!`);
                } else {
                    alert("Fetch models not supported for " + provider);
                }
            } catch (err) {
                alert(`Error fetching models:\n${err.message}`);
            } finally {
                fetchModelsBtn.disabled = false;
                fetchModelsBtn.innerHTML = "<i class='bx bx-cloud-download'></i> Fetch Models";
            }
        });
    }

    testConnectionBtn.addEventListener('click', async () => {
        testConnectionRes.style.display = 'none';
        testConnectionBtn.innerHTML = "<i class='bx bx-loader-alt bx-spin'></i> Testing...";
        testConnectionBtn.disabled = true;

        const currentSettings = {
            provider: aiProvider.value,
            geminiKey: geminiKeyInput.value,
            geminiModelId: geminiModelId ? geminiModelId.value : '',
            customBaseUrl: customBaseUrl.value,
            customModelId: customModelId.value,
            customApiKey: customApiKey.value,
            pollinationsApiKey: pollinationsApiKey ? pollinationsApiKey.value : ''
        };

        try {
            await AIClient.testConnection(currentSettings);
            testConnectionRes.innerHTML = "<i class='bx bx-check'></i> OK";
            testConnectionRes.style.color = '#10b981';
        } catch (err) {
            testConnectionRes.innerHTML = `<i class='bx bx-error'></i> Failed`;
            testConnectionRes.style.color = '#ef4444';
            testConnectionRes.title = err.message; // tooltip for full error
        }
        
        testConnectionRes.style.display = 'inline-flex';
        testConnectionRes.style.alignItems = 'center';
        testConnectionRes.style.gap = '4px';
        testConnectionBtn.innerHTML = "<i class='bx bx-wifi'></i> Test Connection";
        testConnectionBtn.disabled = false;
    });

    testImageConnectionBtn.addEventListener('click', async () => {
        testImageConnectionRes.style.display = 'none';
        testImageConnectionBtn.innerHTML = "<i class='bx bx-loader-alt bx-spin'></i> Testing...";
        testImageConnectionBtn.disabled = true;

        const currentSettings = {
            imageKey: imageKeyInput.value,
            geminiKey: geminiKeyInput.value // Fallback
        };

        try {
            await AIClient.testImageConnection(currentSettings);
            testImageConnectionRes.innerHTML = "<i class='bx bx-check'></i> OK";
            testImageConnectionRes.style.color = '#10b981';
        } catch (err) {
            testImageConnectionRes.innerHTML = `<i class='bx bx-error'></i> Failed`;
            testImageConnectionRes.style.color = '#ef4444';
            testImageConnectionRes.title = err.message;
            alert(`Magnific API Test Failed:\n${err.message}`);
        }
        
        testImageConnectionRes.style.display = 'inline-flex';
        testImageConnectionRes.style.alignItems = 'center';
        testImageConnectionRes.style.gap = '4px';
        testImageConnectionBtn.innerHTML = "<i class='bx bx-image-alt'></i> Test Connection";
        testImageConnectionBtn.disabled = false;
    });

    const testPollinationsConnectionBtn = document.getElementById('test-pollinations-connection-btn');
    const testPollinationsConnectionRes = document.getElementById('test-pollinations-connection-res');

    if (testPollinationsConnectionBtn) {
        testPollinationsConnectionBtn.addEventListener('click', async () => {
            testPollinationsConnectionRes.style.display = 'none';
            testPollinationsConnectionBtn.innerHTML = "<i class='bx bx-loader-alt bx-spin'></i> Testing...";
            testPollinationsConnectionBtn.disabled = true;

            const currentSettings = {
                pollinationsApiKey: document.getElementById('pollinations-api-key').value
            };

            try {
                await AIClient.testPollinationsConnection(currentSettings);
                testPollinationsConnectionRes.innerHTML = "<i class='bx bx-check'></i> OK";
                testPollinationsConnectionRes.style.color = '#10b981';
            } catch (err) {
                testPollinationsConnectionRes.innerHTML = `<i class='bx bx-error'></i> Failed`;
                testPollinationsConnectionRes.style.color = '#ef4444';
                testPollinationsConnectionRes.title = err.message;
                alert(`Pollinations API Test Failed:\n${err.message}`);
            }
            
            testPollinationsConnectionRes.style.display = 'inline-flex';
            testPollinationsConnectionRes.style.alignItems = 'center';
            testPollinationsConnectionRes.style.gap = '4px';
            testPollinationsConnectionBtn.innerHTML = "<i class='bx bx-check-shield'></i> Test Connection";
            testPollinationsConnectionBtn.disabled = false;
        });
    }


    saveSettings.addEventListener('click', () => {
        AIClient.setSettings({
            provider: aiProvider.value,
            geminiKey: geminiKeyInput.value,
            geminiModelId: document.getElementById('gemini-model-id') ? document.getElementById('gemini-model-id').value : '',
            customBaseUrl: customBaseUrl.value,
            customModelId: customModelId.value,
            customApiKey: customApiKey.value,
            imageKey: imageKeyInput.value,
            pollinationsApiKey: pollinationsApiKey ? pollinationsApiKey.value : ''
        });
        
        // Visual feedback
        const originalText = saveSettings.innerHTML;
        saveSettings.innerHTML = "<i class='bx bx-check'></i> Saved!";
        saveSettings.style.background = "#10b981";
        setTimeout(() => {
            saveSettings.innerHTML = originalText;
            saveSettings.style.background = "var(--accent-color)";
            settingsModal.style.display = 'none';
        }, 1000);
    });

    // Close modal on click outside
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.style.display = 'none';
        }
    });

});

export function loadTool(id) {
    const tool = tools.find(t => t.id === id);
    if (!tool) return;

    currentToolId = id;
    
    // Track tool usage
    Analytics.trackToolOpen(id, tool.name);

    // Update sidebar active states
    document.querySelectorAll('.tool-item').forEach(el => {
        el.classList.remove('active');
        if (el.innerText.trim() === tool.name) {
            el.classList.add('active');
        }
    });

    // Render content
    const container = document.getElementById('tool-container');
    container.innerHTML = ''; // clear current
    
    // Add fade-in animation
    const wrapper = document.createElement('div');
    wrapper.className = 'animate-fade-in';
    tool.render(wrapper);
    container.appendChild(wrapper);
}
