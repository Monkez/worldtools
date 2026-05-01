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
import { renderCalculator } from './tools/calculator.js'
import { AIClient } from './utils/aiClient.js'

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
    }
];

let currentToolId = 'dashboard';

document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const closeBtn = document.getElementById('close-sidebar');
    const openBtn = document.getElementById('open-sidebar');
    const toolList = document.getElementById('tool-list');
    const searchInput = document.getElementById('tool-search');

    // Toggle sidebar
    closeBtn.addEventListener('click', () => {
        sidebar.classList.add('collapsed');
        openBtn.style.display = 'block';
    });
    
    openBtn.addEventListener('click', () => {
        sidebar.classList.remove('collapsed');
        openBtn.style.display = 'none';
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
        const categoryOrder = ['AI Smart Tools', 'Design & Media', 'Developer Tools', 'Text & Content', 'Utilities', 'Other'];
        
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
    searchInput.addEventListener('input', (e) => {
        renderSidebarList(e.target.value);
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
    const customBaseUrl = document.getElementById('custom-base-url');
    const customModelId = document.getElementById('custom-model-id');
    const customApiKey = document.getElementById('custom-api-key');

    aiProvider.addEventListener('change', () => {
        if (aiProvider.value === 'gemini') {
            settingsGemini.style.display = 'block';
            settingsCustom.style.display = 'none';
        } else {
            settingsGemini.style.display = 'none';
            settingsCustom.style.display = 'block';
        }
    });

    btnSettings.addEventListener('click', () => {
        const settings = AIClient.getSettings();
        aiProvider.value = settings.provider;
        geminiKeyInput.value = settings.geminiKey;
        customBaseUrl.value = settings.customBaseUrl;
        customModelId.value = settings.customModelId;
        customApiKey.value = settings.customApiKey;
        
        aiProvider.dispatchEvent(new Event('change'));
        settingsModal.style.display = 'flex';
        testConnectionRes.style.display = 'none';
    });

    closeSettings.addEventListener('click', () => {
        settingsModal.style.display = 'none';
    });

    testConnectionBtn.addEventListener('click', async () => {
        testConnectionRes.style.display = 'none';
        testConnectionBtn.innerHTML = "<i class='bx bx-loader-alt bx-spin'></i> Testing...";
        testConnectionBtn.disabled = true;

        const currentSettings = {
            provider: aiProvider.value,
            geminiKey: geminiKeyInput.value,
            customBaseUrl: customBaseUrl.value,
            customModelId: customModelId.value,
            customApiKey: customApiKey.value
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

    saveSettings.addEventListener('click', () => {
        AIClient.setSettings({
            provider: aiProvider.value,
            geminiKey: geminiKeyInput.value,
            customBaseUrl: customBaseUrl.value,
            customModelId: customModelId.value,
            customApiKey: customApiKey.value
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
