import { getApiBase } from '../utils/apiBase.js';

export function renderColorPicker(container) {
    container.innerHTML = `
        <div class="panel" style="max-width: 1000px; margin: 0 auto; display: flex; gap: 40px; align-items: flex-start;">
            
            <div style="flex: 1; text-align: center;">
                <div style="margin-bottom: 32px;">
                    <div id="cp-display" style="width: 150px; height: 150px; border-radius: 50%; cursor: pointer; background-color: #6366f1; box-shadow: 0 10px 25px rgba(0,0,0,0.2); margin: 0 auto; border: 2px solid rgba(255,255,255,0.1); transition: background-color 0.1s;"></div>
                    <input type="color" id="cp-input" value="#6366f1" style="visibility: hidden; position: absolute;">
                    <p style="margin-top: 16px; color: var(--text-secondary); font-size: 14px;">Click the circle to pick a color manually</p>
                    <button id="cp-eyedropper" class="btn-primary" style="margin: 16px auto 0;">
                        <i class='bx bx-screenshot'></i> Pick from Screen (Alt + C)
                    </button>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr; gap: 16px;">
                    <div class="form-group" style="text-align: left; margin: 0;">
                        <label>HEX</label>
                        <div style="display: flex; gap: 8px;">
                            <input type="text" id="cp-hex" class="input-field" readonly>
                            <button class="btn-secondary cp-copy" data-target="cp-hex"><i class='bx bx-copy'></i></button>
                        </div>
                    </div>
                    
                    <div class="form-group" style="text-align: left; margin: 0;">
                        <label>RGB</label>
                        <div style="display: flex; gap: 8px;">
                            <input type="text" id="cp-rgb" class="input-field" readonly>
                            <button class="btn-secondary cp-copy" data-target="cp-rgb"><i class='bx bx-copy'></i></button>
                        </div>
                    </div>
                    
                    <div class="form-group" style="text-align: left; margin: 0;">
                        <label>HSL</label>
                        <div style="display: flex; gap: 8px;">
                            <input type="text" id="cp-hsl" class="input-field" readonly>
                            <button class="btn-secondary cp-copy" data-target="cp-hsl"><i class='bx bx-copy'></i></button>
                        </div>
                    </div>
                </div>
            </div>

            <div style="flex: 1.5; border-left: 1px solid rgba(255,255,255,0.1); padding-left: 40px; max-height: 500px; overflow-y: auto; padding-right: 12px;" class="custom-scroll">
                <h3 style="margin-bottom: 24px; color: #fff;">Popular Palettes</h3>
                <div id="cp-palettes-container"></div>
            </div>
        </div>
    `;

    const cpDisplay = container.querySelector('#cp-display');
    const colorInput = container.querySelector('#cp-input');
    const hexOutput = container.querySelector('#cp-hex');
    const rgbOutput = container.querySelector('#cp-rgb');
    const hslOutput = container.querySelector('#cp-hsl');

    const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };

    const rgbToHsl = (r, g, b) => {
        r /= 255, g /= 255, b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if(max == min){
            h = s = 0; 
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch(max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    };

    const updateColors = (hex) => {
        hexOutput.value = hex.toUpperCase();
        cpDisplay.style.backgroundColor = hex;
        
        const rgb = hexToRgb(hex);
        if (rgb) {
            rgbOutput.value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
            
            const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
            hslOutput.value = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
        }
    };

    cpDisplay.addEventListener('click', () => {
        colorInput.click();
    });

    colorInput.addEventListener('input', (e) => {
        updateColors(e.target.value);
    });

    const triggerEyeDropper = async () => {
        try {
            // Attempt to use the powerful Electron native color picker if backend is available
            const res = await fetch(`${getApiBase()}/api/tools/color-picker`);
            if (res.ok) {
                const data = await res.json();
                if (data.color) {
                    colorInput.value = data.color;
                    updateColors(data.color);
                    return; // Success using native desktop picker!
                }
            }
        } catch (e) {
            // Backend not available or endpoint failed (e.g. deployed web version), fallback to Web EyeDropper
        }

        if (!window.EyeDropper) {
            alert('Your browser does not support the EyeDropper API. Try using Chrome or Edge.');
            return;
        }
        try {
            const eyeDropper = new EyeDropper();
            const result = await eyeDropper.open();
            colorInput.value = result.sRGBHex;
            updateColors(result.sRGBHex);
        } catch (e) {
            // User canceled selection
        }
    };

    const eyeDropperBtn = container.querySelector('#cp-eyedropper');
    eyeDropperBtn.addEventListener('click', triggerEyeDropper);

    // Clean up previous event listener if it exists to prevent duplicates
    if (window.cpKeydownListener) {
        document.removeEventListener('keydown', window.cpKeydownListener);
    }
    window.cpKeydownListener = (e) => {
        // Only trigger if we are actively viewing the color picker
        if (document.getElementById('cp-eyedropper') && e.altKey && e.code === 'KeyC') {
            e.preventDefault();
            triggerEyeDropper();
        }
    };
    document.addEventListener('keydown', window.cpKeydownListener);

    // Copy buttons
    container.querySelectorAll('.cp-copy').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const input = container.querySelector('#' + targetId);
            navigator.clipboard.writeText(input.value);
            
            const originalIcon = btn.innerHTML;
            btn.innerHTML = "<i class='bx bx-check'></i>";
            btn.classList.add('btn-primary');
            btn.classList.remove('btn-secondary');
            
            setTimeout(() => {
                btn.innerHTML = originalIcon;
                btn.classList.remove('btn-primary');
                btn.classList.add('btn-secondary');
            }, 1500);
        });
    });

    // Initial update
    updateColors(colorInput.value);

    // Popular Palettes Logic
    const palettes = [
        {
            name: "Flat UI Colors v1",
            colors: ['#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#34495e', '#16a085', '#27ae60', '#2980b9', '#8e44ad', '#2c3e50', '#f1c40f', '#e67e22', '#e74c3c', '#ecf0f1', '#95a5a6', '#f39c12', '#d35400', '#c0392b', '#bdc3c7', '#7f8c8d']
        },
        {
            name: "Material Colors",
            colors: ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#795548', '#9e9e9e', '#607d8b']
        },
        {
            name: "Tailwind Cool",
            colors: ['#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1', '#94a3b8', '#64748b', '#475569', '#334155', '#1e293b', '#0f172a', '#38bdf8', '#0284c7', '#0369a1', '#818cf8', '#4f46e5', '#3730a3', '#34d399', '#059669', '#047857']
        },
        {
            name: "Neon Cyberpunk",
            colors: ['#ff00ff', '#00ffff', '#ff0055', '#00ff66', '#ffff00', '#ffaa00', '#aa00ff', '#0055ff', '#ff00aa', '#55ff00', '#ff5500', '#00aaff']
        },
        {
            name: "Pastel Dream",
            colors: ['#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff', '#e0baff', '#ffbaff', '#ffd1dc', '#d1ffd1', '#d1ffff', '#ffd1ff', '#ffe6cc']
        },
        {
            name: "Nord Theme (Arctic)",
            colors: ['#2e3440', '#3b4252', '#434c5e', '#4c566a', '#d8dee9', '#e5e9f0', '#eceff4', '#8fbcbb', '#88c0d0', '#81a1c1', '#5e81ac', '#bf616a', '#d08770', '#ebcb8b', '#a3be8c', '#b48ead']
        }
    ];

    const palettesContainer = container.querySelector('#cp-palettes-container');
    let palettesHtml = '';
    palettes.forEach(p => {
        palettesHtml += `
            <div style="margin-bottom: 24px;">
                <h4 style="margin-bottom: 12px; color: var(--text-secondary); font-size: 14px; font-weight: 500;">${p.name}</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(40px, 1fr)); gap: 8px;">
                    ${p.colors.map(c => `
                        <div class="palette-color" data-color="${c}" style="background-color: ${c}; height: 40px; border-radius: 6px; cursor: pointer; transition: all 0.2s ease; position: relative; border: 1px solid rgba(255,255,255,0.1);" title="${c.toUpperCase()}">
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });
    palettesContainer.innerHTML = palettesHtml;

    container.querySelectorAll('.palette-color').forEach(el => {
        el.addEventListener('click', (e) => {
            const color = e.target.getAttribute('data-color');
            colorInput.value = color;
            updateColors(color);
            navigator.clipboard.writeText(color.toUpperCase());
            
            e.target.style.transform = 'scale(0.8)';
            setTimeout(() => e.target.style.transform = 'scale(1.1)', 100);
            setTimeout(() => e.target.style.transform = 'scale(1)', 250);
        });
        
        el.addEventListener('mouseover', (e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
            e.target.style.zIndex = '10';
        });
        el.addEventListener('mouseout', (e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = 'none';
            e.target.style.zIndex = '1';
        });
    });
}
