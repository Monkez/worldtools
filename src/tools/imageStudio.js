import { removeBackground } from '@imgly/background-removal';

export function renderImageStudio(container) {
    window._isGetCVal = function(id) {
        const el = container.querySelector(id);
        return (el && el.dataset.transparent === 'true') ? 'transparent' : (el ? el.value : '#000000');
    };
    container.innerHTML = `
        <div style="display: flex; flex-direction: column; height: calc(100vh - 48px); border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); overflow: hidden; background: #1e1e1e; margin-top: -10px;">
            <datalist id="is-color-swatches">
                <option value="#000000"></option>
                <option value="#333333"></option>
                <option value="#666666"></option>
                <option value="#999999"></option>
                <option value="#cccccc"></option>
                <option value="#ffffff"></option>
                <option value="#ff0000"></option>
                <option value="#ff5722"></option>
                <option value="#ff9800"></option>
                <option value="#ffeb3b"></option>
                <option value="#cddc39"></option>
                <option value="#8bc34a"></option>
                <option value="#4caf50"></option>
                <option value="#009688"></option>
                <option value="#00bcd4"></option>
                <option value="#03a9f4"></option>
                <option value="#2196f3"></option>
                <option value="#3f51b5"></option>
                <option value="#673ab7"></option>
                <option value="#9c27b0"></option>
                <option value="#e91e63"></option>
                <option value="#f44336"></option>
                <option value="#795548"></option>
                <option value="#607d8b"></option>
            </datalist>
            <!-- ULTRA COMPACT TOP BAR -->
            <div style="display: flex; justify-content: space-between; align-items: center; background: #252526; padding: 6px 12px; border-bottom: 1px solid rgba(255,255,255,0.05);">
                <div style="display: flex; gap: 4px; align-items: center;">
                    <button class="is-btn-icon" id="is-upload-btn" title="Open (Ctrl+O)"><i class='bx bx-folder-open'></i></button>
                    <input type="file" id="is-upload" accept="image/*" style="display: none;">
                    <button class="is-btn-icon" id="is-download-btn" title="Save (Ctrl+S)"><i class='bx bx-save'></i></button>
                    <div class="is-divider"></div>
                    <button class="is-btn-icon" id="is-undo" title="Undo (Ctrl+Z)"><i class='bx bx-undo'></i></button>
                    <button class="is-btn-icon" id="is-redo" title="Redo (Ctrl+Y)"><i class='bx bx-redo'></i></button>
                    <div class="is-divider"></div>
                    <button class="is-btn-icon" id="is-copy-btn" title="Copy Canvas (Ctrl+C)"><i class='bx bx-copy'></i></button>
                    <div class="is-divider"></div>
                    <button class="is-btn-text" id="is-resize-btn" title="Resize Image"><i class='bx bx-expand'></i> Resize</button>
                    <div class="is-divider"></div>
                    <button class="is-btn-icon" id="is-clear" title="Clear Canvas" style="color: #fca5a5;"><i class='bx bx-trash'></i></button>
                    <div class="is-divider"></div>
                    <button class="is-btn-text" id="is-ai-history-btn" title="View AI Analysis History"><i class='bx bx-history' style="color:#60a5fa;"></i> AI History</button>
                    <div class="is-divider"></div>
                    
                    <!-- Adjustments Dropdown -->
                    <div style="position: relative;" id="is-adj-container">
                        <button class="is-btn-text" id="is-adj-btn"><i class='bx bx-slider-alt'></i> Adjustments</button>
                        <div id="is-adj-menu" style="display: none; position: absolute; top: 100%; left: 0; background: #252526; border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 12px; width: 220px; z-index: 100; box-shadow: 0 4px 12px rgba(0,0,0,0.5); margin-top: 4px;">
                            <div class="is-slider-group">
                                <label>Brightness <span id="val-brightness">0</span></label>
                                <input type="range" class="is-filter" data-filter="brightness" min="-100" max="100" value="0">
                            </div>
                            <div class="is-slider-group">
                                <label>Contrast <span id="val-contrast">0</span></label>
                                <input type="range" class="is-filter" data-filter="contrast" min="-100" max="100" value="0">
                            </div>
                            <div class="is-slider-group">
                                <label>Saturation <span id="val-saturation">0</span></label>
                                <input type="range" class="is-filter" data-filter="saturation" min="-100" max="100" value="0">
                            </div>
                            <div class="is-slider-group">
                                <label>Blur <span id="val-blur">0</span></label>
                                <input type="range" class="is-filter" data-filter="blur" min="0" max="20" value="0">
                            </div>
                            <div style="height: 1px; background: rgba(255,255,255,0.1); margin: 6px 0; width: 100%;"></div>
                            <button class="is-btn-text" id="is-ai-enhance" style="width: 100%; justify-content: flex-start; padding: 6px 4px; color: #a855f7;"><i class='bx bxs-magic-wand'></i> Auto Enhance</button>
                            <button id="is-apply-filters" class="btn-primary" style="width: 100%; padding: 6px; font-size: 12px; margin-top: 4px;">Apply</button>
                        </div>
                    </div>

                    <!-- Layout Tools -->
                    <button class="is-btn-text" id="is-flatten-all" style="color: #ef4444;"><i class='bx bx-layer-minus'></i> Merge All</button>
                </div>
                
                <div style="display: flex; align-items: center; gap: 8px;">
                    <button class="is-btn-icon" onclick="document.getElementById('is-zoom').value = Math.max(10, parseInt(document.getElementById('is-zoom').value) - 10); document.getElementById('is-zoom').dispatchEvent(new Event('input'));"><i class='bx bx-minus'></i></button>
                    <input type="range" id="is-zoom" min="10" max="400" value="100" style="width: 80px; height: 2px;">
                    <button class="is-btn-icon" onclick="document.getElementById('is-zoom').value = Math.min(400, parseInt(document.getElementById('is-zoom').value) + 10); document.getElementById('is-zoom').dispatchEvent(new Event('input'));"><i class='bx bx-plus'></i></button>
                    <span style="font-size: 11px; color: #aaa; width: 32px; text-align: right;" id="is-zoom-val">100%</span>
                </div>
            </div>

            <div style="display: flex; flex: 1; overflow: hidden; position: relative;">
                <!-- ULTRA COMPACT LEFT TOOLBAR -->
                <div style="width: 40px; background: #252526; border-right: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; align-items: center; padding: 8px 0; gap: 4px; z-index: 10;">
                    <button class="is-btn-icon is-tool active" data-tool="select" title="Select Object (V)"><i class='bx bx-pointer'></i></button>
                    <button class="is-btn-icon is-tool" data-tool="region" title="Select Region"><i class='bx bx-crop'></i></button>
                    <div style="width: 24px; height: 1px; background: rgba(255,255,255,0.1); margin: 4px 0;"></div>
                    <button class="is-btn-icon is-tool" data-tool="brush" title="Brush"><i class='bx bx-paint'></i></button>
                    <button class="is-btn-icon is-tool" data-tool="fill" title="Paint Bucket"><i class='bx bx-color-fill'></i></button>
                    <button class="is-btn-icon is-tool" data-tool="eraser" title="Eraser"><i class='bx bx-eraser'></i></button>
                    <div style="width: 24px; height: 1px; background: rgba(255,255,255,0.1); margin: 4px 0;"></div>
                    <button class="is-btn-icon is-tool" data-tool="polyarrow" title="Line/Arrow — Click to add points, Space to finish, Esc to cancel"><i class='bx bx-trending-up'></i></button>
                    <button class="is-btn-icon is-tool" data-tool="rect" title="Rectangle"><i class='bx bx-square'></i></button>
                    <button class="is-btn-icon is-tool" data-tool="circle" title="Circle"><i class='bx bx-circle'></i></button>
                    <button class="is-btn-icon is-tool" data-tool="ellipse" title="Ellipse"><i class='bx bx-shape-circle'></i></button>
                    <button class="is-btn-icon is-tool" data-tool="triangle" title="Triangle"><i class='bx bx-shape-triangle'></i></button>
                    <button class="is-btn-icon is-tool" data-tool="diamond" title="Diamond"><i class='bx bx-diamond'></i></button>
                    <button class="is-btn-icon is-tool" data-tool="parallelogram" title="Parallelogram"><i class='bx bx-tag'></i></button>
                    <button class="is-btn-icon is-tool" data-tool="pentagon" title="Pentagon"><i class='bx bx-shape-polygon'></i></button>
                    <button class="is-btn-icon is-tool" data-tool="hexagon" title="Hexagon"><i class='bx bx-polygon'></i></button>
                    <button class="is-btn-icon is-tool" data-tool="star" title="Star"><i class='bx bx-star'></i></button>
                    <button class="is-btn-icon is-tool" data-tool="text" title="Text"><i class='bx bx-text'></i></button>
                </div>

                <!-- CONTEXT BAR (shown for all tools) -->
                <div id="is-context-bar" style="display: none; position: absolute; top: 0; left: 40px; right: 0; background: #252526; border-bottom: 1px solid rgba(255,255,255,0.08); padding: 4px 12px; z-index: 20; align-items: center; gap: 8px; flex-wrap: wrap;">
                    <span id="is-obj-type-info" style="display: none; font-size: 11px; color: #8b8b8b; align-items: center; gap: 4px; padding: 0 4px; background: rgba(0,0,0,0.2); border-radius: 4px; border: 1px solid rgba(255,255,255,0.05); height: 22px;"></span>
                    <!-- Text-specific controls -->
                    <span id="is-ctx-text" style="display: none; contents;">
                        <span style="font-size: 11px; color: #888;">Color</span>
                        <input type="color" id="is-text-color" list="is-color-swatches" value="#6366f1" style="width: 24px; height: 24px; border: none; border-radius: 4px; cursor: pointer; padding: 0; background: none;">
                        <div class="is-divider"></div>
                        <select id="is-font-family" style="background: #1e1e1e; color: #ccc; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 3px 6px; font-size: 12px; width: 160px; cursor: pointer;">
                            <optgroup label="Vietnamese Fonts">
                            <option value="Be Vietnam Pro" selected>Be Vietnam Pro</option>
                            <option value="Montserrat">Montserrat</option>
                            <option value="Open Sans">Open Sans</option>
                            <option value="Roboto">Roboto</option>
                            <option value="Nunito">Nunito</option>
                            <option value="Quicksand">Quicksand</option>
                            <option value="Josefin Sans">Josefin Sans</option>
                            <option value="Lora">Lora</option>
                            </optgroup>
                            <optgroup label="Display / Decorative">
                            <option value="Outfit">Outfit</option>
                            <option value="Playfair Display">Playfair Display</option>
                            <option value="Dancing Script">Dancing Script</option>
                            <option value="Pacifico">Pacifico</option>
                            <option value="Lobster">Lobster</option>
                            </optgroup>
                            <optgroup label="Monospace">
                            <option value="Source Code Pro">Source Code Pro</option>
                            <option value="Courier New">Courier New</option>
                            </optgroup>
                            <optgroup label="System Fonts">
                            <option value="Arial">Arial</option>
                            <option value="Helvetica">Helvetica</option>
                            <option value="Verdana">Verdana</option>
                            <option value="Georgia">Georgia</option>
                            <option value="Times New Roman">Times New Roman</option>
                            <option value="Trebuchet MS">Trebuchet MS</option>
                            <option value="Impact">Impact</option>
                            <option value="Comic Sans MS">Comic Sans MS</option>
                            </optgroup>
                        </select>
                        <input type="number" id="is-font-size" value="48" min="8" max="200" style="background: #1e1e1e; color: #ccc; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 3px 6px; font-size: 12px; width: 52px; text-align: center;">
                        <div class="is-divider"></div>
                        <button class="is-btn-icon is-text-style" id="is-font-bold" title="Bold" style="font-weight: bold; font-size: 14px;">B</button>
                        <button class="is-btn-icon is-text-style" id="is-font-italic" title="Italic" style="font-style: italic; font-size: 14px;">I</button>
                        <button class="is-btn-icon is-text-style" id="is-font-underline" title="Underline" style="text-decoration: underline; font-size: 14px;">U</button>
                        <div class="is-divider"></div>
                        <span style="font-size: 11px; color: #888;">Style</span>
                        <select id="is-text-render-style" style="background: #1e1e1e; color: #ccc; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 3px 6px; font-size: 12px; width: 80px; cursor: pointer;">
                            <option value="normal">Normal</option>
                            <option value="solid-bg">Solid Bg</option>
                            <option value="outline">Outline</option>
                            <option value="glow">Glow</option>
                            <option value="shadow">Shadow</option>
                        </select>
                        <input type="color" id="is-text-bg-color" list="is-color-swatches" value="#000000" title="Background/Effect Color" style="width: 24px; height: 24px; border: none; border-radius: 4px; cursor: pointer; padding: 0; background: none; margin-left: 4px;">
                    </span>
                    <!-- Shape-specific controls -->
                    <span id="is-ctx-shape" style="display: none; contents;">
                        <span style="font-size: 11px; color: #888;">Color</span>
                        <input type="color" id="is-shape-color" list="is-color-swatches" value="#6366f1" style="width: 24px; height: 24px; border: none; border-radius: 4px; cursor: pointer; padding: 0; background: none;" title="Stroke Color">
                        
                        <div class="is-divider"></div>
                        <span style="font-size: 11px; color: #888;">Fill</span>
                        <input type="color" id="is-shape-fill-color" list="is-color-swatches" value="#8b5cf6" style="width: 24px; height: 24px; border: none; border-radius: 4px; cursor: pointer; padding: 0; background: none;" title="Fill Color">

                        <div class="is-divider"></div>
                        <span style="font-size: 11px; color: #888;">Stroke</span>
                        <input type="number" id="is-shape-stroke" value="5" min="1" max="50" style="background: #1e1e1e; color: #ccc; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 3px 6px; font-size: 12px; width: 48px; text-align: center;">
                    </span>
                    <!-- Brush controls -->
                    <span id="is-ctx-brush" style="display: none; contents;">
                        <span style="font-size: 11px; color: #888;">Color</span>
                        <input type="color" id="is-brush-color" list="is-color-swatches" value="#6366f1" style="width: 24px; height: 24px; border: none; border-radius: 4px; cursor: pointer; padding: 0; background: none;">
                        <div class="is-divider"></div>
                        <span style="font-size: 11px; color: #888;">Size</span>
                        <input type="range" id="is-brush-size" min="1" max="50" value="5" style="width: 100px; accent-color: #3b82f6;">
                        <span id="is-brush-size-val" style="font-size: 11px; color: #aaa; min-width: 28px;">5px</span>
                        
                    </span>
                    <!-- Global Opacity -->
                    <div class="is-divider" id="is-global-opacity-divider" style="display: none;"></div>
                    <span id="is-global-opacity-label" style="display: none; font-size: 11px; color: #888;">Opacity</span>
                    <input type="range" id="is-global-opacity" min="1" max="100" value="100" style="display: none; width: 80px; accent-color: #3b82f6;">
                    <span id="is-global-opacity-val" style="display: none; font-size: 11px; color: #aaa; min-width: 32px;">100%</span>
                    
                    <!-- Smooth controls (shared by brush paths and polyarrow) -->
                    <div class="is-divider" id="is-brush-smooth-divider" style="display: none;"></div>
                    <span id="is-smooth-level-label" style="display: none; font-size: 11px; color: #888;">Smooth</span>
                    <input type="range" id="is-smooth-level" min="1" max="20" value="10" style="display: none; width: 80px; accent-color: #3b82f6;">
                    <span id="is-smooth-level-val" style="display: none; font-size: 11px; color: #aaa; min-width: 16px;">10</span>
                    <button class="is-btn-icon" id="is-brush-smooth" title="Apply Smoothing" style="display: none; gap: 4px; width: auto; padding: 0 8px; font-size: 11px;"><i class='bx bx-pulse'></i> Smooth</button>
                    <!-- Eraser controls -->
                    <span id="is-ctx-eraser" style="display: none; contents;">
                        <span style="font-size: 11px; color: #888;">Size</span>
                        <input type="range" id="is-eraser-size" min="1" max="80" value="20" style="width: 120px; accent-color: #3b82f6;">
                        <span id="is-eraser-size-val" style="font-size: 11px; color: #aaa; min-width: 32px;">20px</span>
                    </span>
                    <!-- Fill controls -->
                    <span id="is-ctx-fill" style="display: none; contents;">
                        <span style="font-size: 11px; color: #888;">Color</span>
                        <input type="color" id="is-fill-color" list="is-color-swatches" value="#6366f1" style="width: 24px; height: 24px; border: none; border-radius: 4px; cursor: pointer; padding: 0; background: none;">
                        <div class="is-divider"></div>
                        <span style="font-size: 11px; color: #888;">Tolerance</span>
                        <input type="range" id="is-fill-tolerance" min="0" max="128" value="32" style="width: 100px; accent-color: #3b82f6;">
                        <span id="is-fill-tolerance-val" style="font-size: 11px; color: #aaa; min-width: 24px;">32</span>
                    </span>
                    <!-- Crop/Region hint -->
                    <span id="is-ctx-crop" style="display: none; contents;">
                        <span style="font-size: 11px; color: #aaa;"><i class='bx bx-info-circle' style="vertical-align: middle;"></i> Draw a selection region on canvas</span>
                    </span>
                    <!-- Region actions (after selection) -->
                    <span id="is-ctx-region-actions" style="display: none; contents;">
                        <button class="is-btn-icon" id="is-region-copy" title="Copy Region" style="gap: 4px; width: auto; padding: 0 8px; font-size: 11px;"><i class='bx bx-copy'></i> Copy</button>
                        <button class="is-btn-icon" id="is-region-crop" title="Crop to Region" style="gap: 4px; width: auto; padding: 0 8px; font-size: 11px;"><i class='bx bx-crop'></i> Crop</button>
                        <div class="is-divider"></div>
                        <span id="is-region-info" style="font-size: 11px; color: #aaa;"></span>
                    </span>
                    <!-- Canvas background context (shown when clicking empty area in select mode) -->
                    <span id="is-ctx-select" style="display: none; contents;">
                        <span style="font-size: 11px; color: #888;">Background</span>
                        <input type="color" id="is-canvas-bg-color" list="is-color-swatches" value="#ffffff" style="width: 24px; height: 24px; border: none; border-radius: 4px; cursor: pointer; padding: 0; background: none;">
                        <div class="is-divider"></div>
                        <span style="font-size: 11px; color: #888;">Grid</span>
                        <select id="is-canvas-grid" style="background: #1e1e1e; color: #ccc; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 3px 6px; font-size: 11px; cursor: pointer;">
                            <option value="none">None</option>
                            <option value="lines">Lines</option>
                            <option value="dots">Dots</option>
                            <option value="cross">Crosshatch</option>
                        </select>
                        <div class="is-divider"></div>
                        <span style="font-size: 11px; color: #888;">Grid Size</span>
                        <input type="number" id="is-canvas-grid-size" value="20" min="5" max="100" style="background: #1e1e1e; color: #ccc; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 3px 6px; font-size: 11px; width: 48px; text-align: center;">
                        <div class="is-divider"></div>
                        <button class="is-btn-icon" id="is-canvas-smart-remove" title="AI Tool" style="gap: 4px; width: auto; padding: 0 8px; font-size: 11px; color: #10b981;"><i class='bx bxs-magic-wand'></i> AI Tool</button>
                        <button class="is-btn-icon" id="is-canvas-remove-bg" title="Remove Background" style="gap: 4px; width: auto; padding: 0 8px; font-size: 11px; color: #ec4899;"><i class='bx bx-cut'></i> Remove BG</button>
                    </span>
                    <div class="is-divider" id="is-ctx-del-divider" style="display: none;"></div>
                    <button class="is-btn-icon" id="is-obj-copy" title="Copy Object" style="display: none; gap: 4px; width: auto; padding: 0 8px; font-size: 11px;"><i class='bx bx-copy'></i></button>
                    <button class="is-btn-icon" id="is-obj-flatten" title="Merge Down" style="display: none; gap: 4px; width: auto; padding: 0 8px; font-size: 11px; color: #ef4444;"><i class='bx bx-layer-minus'></i></button>
                    <button class="is-btn-icon" id="is-obj-smart-remove" title="AI Tool" style="display: none; gap: 4px; width: auto; padding: 0 8px; font-size: 11px; color: #10b981;"><i class='bx bxs-magic-wand'></i> AI Tool</button>
                    <button class="is-btn-icon" id="is-obj-remove-bg" title="Remove Background" style="display: none; gap: 4px; width: auto; padding: 0 8px; font-size: 11px; color: #ec4899;"><i class='bx bx-cut'></i> Remove BG</button>
                    <span id="is-polyarrow-opts" style="display:none; align-items:center; gap:6px;">
                        <div class="is-divider"></div>
                        <span style="font-size:11px;color:#888">Mode</span>
                        <button class="is-btn-icon is-arrow-mode active" data-mode="none" title="Normal Line" style="font-size:13px;width:26px;height:22px;padding:0"><i class='bx bx-minus'></i></button>
                        <button class="is-btn-icon is-arrow-mode" data-mode="single" title="One Direction" style="font-size:13px;width:26px;height:22px;padding:0"><i class='bx bx-right-arrow-alt'></i></button>
                        <button class="is-btn-icon is-arrow-mode" data-mode="double" title="Bidirectional" style="font-size:13px;width:26px;height:22px;padding:0"><i class='bx bx-transfer'></i></button>
                        <div class="is-divider"></div>
                        <span style="font-size:11px;color:#888">Style</span>
                        <select id="is-line-style" style="background:#333;color:#ccc;border:1px solid #555;border-radius:4px;font-size:11px;padding:2px 4px;cursor:pointer">
                            <option value="solid">━━ Solid</option>
                            <option value="dashed">╌╌ Dashed</option>
                            <option value="dotted">··· Dotted</option>
                            <option value="dashdot">╌·╌ Dash-dot</option>
                        </select>
                        <div class="is-divider" id="is-arrowhead-divider"></div>
                        <span id="is-arrowhead-label" style="font-size:11px;color:#888">Head</span>
                        <select id="is-arrowhead-style" style="background:#333;color:#ccc;border:1px solid #555;border-radius:4px;font-size:11px;padding:2px 4px;cursor:pointer">
                            <option value="open">▷ Open</option>
                            <option value="filled">▶ Filled</option>
                            <option value="diamond">◇ Diamond</option>
                            <option value="circle">○ Circle</option>
                            <option value="square">□ Square</option>
                        </select>
                    </span>
                    <button class="is-btn-icon" id="is-ctx-front" title="Bring to Front" style="display: none; font-size: 14px;"><i class='bx bx-arrow-to-top'></i></button>
                    <button class="is-btn-icon" id="is-ctx-back" title="Send to Back" style="display: none; font-size: 14px;"><i class='bx bx-arrow-to-bottom'></i></button>
                    <button class="is-btn-icon" id="is-ctx-del" title="Delete (Del)" style="color: #fca5a5; display: none;"><i class='bx bx-trash'></i></button>
                </div>

                <!-- MAIN CANVAS AREA -->
                <div id="is-canvas-container" style="flex: 1; background: #111; overflow: hidden; display: flex; align-items: center; justify-content: center; position: relative;">
                    <div id="is-canvas-wrapper" style="position: relative; box-shadow: 0 0 20px rgba(0,0,0,0.8); background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/ENF5gNqGoB4TjxrAwDAJg4MGAgB/xwgfV7oJlwAAAABJRU5ErkJggg==') repeat; transition: transform 0.1s;">
                        <canvas id="is-canvas" width="1600" height="1200" style="display: block;"></canvas>
                        <canvas id="is-overlay" width="1600" height="1200" style="display: block; position: absolute; top: 0; left: 0; pointer-events: none;"></canvas>
                    </div>
                </div>
            </div>
        </div>
        <style>
            .is-btn-icon { background: transparent; border: none; color: #ccc; width: 28px; height: 28px; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 16px; cursor: pointer; transition: 0.1s; }
            .is-btn-icon:hover { background: rgba(255,255,255,0.1); color: #fff; }
            .is-btn-text { background: transparent; border: none; color: #ccc; height: 28px; padding: 0 8px; border-radius: 4px; display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 500; white-space: nowrap; cursor: pointer; transition: 0.1s; }
            .is-btn-text:hover { background: rgba(255,255,255,0.1); color: #fff; }
            .is-divider { width: 1px; height: 16px; background: rgba(255,255,255,0.1); margin: 0 4px; }
            .is-tool.active { background: #3b82f6 !important; color: #fff; }
            .is-text-style.active { background: rgba(59, 130, 246, 0.3) !important; color: #fff; }
            .is-slider-group { margin-bottom: 12px; font-size: 12px; color: #ccc; }
            .is-slider-group label { display: flex; justify-content: space-between; margin-bottom: 4px; }
            #is-zoom, #is-linewidth, .is-filter { accent-color: #3b82f6; }
            input[type="range"] {
                -webkit-appearance: none;
                width: 100%;
                background: transparent;
                height: 14px;
            }
            input[type="range"]::-webkit-slider-runnable-track {
                width: 100%;
                height: 3px;
                cursor: pointer;
                background: linear-gradient(to right, #3b82f6 var(--val, 50%), #444 var(--val, 50%));
                border-radius: 2px;
                margin-top: 5.5px;
            }
            input[type="range"]::-webkit-slider-thumb {
                height: 14px;
                width: 14px;
                border-radius: 50%;
                background: #3b82f6;
                cursor: pointer;
                -webkit-appearance: none;
                margin-top: -5.5px;
            }
            input[type="range"]:focus { outline: none; }
        </style>
    `;

    const canvas = container.querySelector('#is-canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const overlay = container.querySelector('#is-overlay');
    const octx = overlay.getContext('2d');
    
    // Fill white background initially
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Setup custom range slider fill styling
    function setupRangeInput(input) {
        const update = () => {
            const min = parseFloat(input.min) || 0;
            const max = parseFloat(input.max) || 100;
            const val = parseFloat(input.value) || 0;
            let percent = ((val - min) / (max - min)) * 100;
            if (isNaN(percent) || !isFinite(percent)) percent = 50;
            input.style.setProperty('--val', `${percent}%`);
        };
        input.addEventListener('input', update);
        
        // Intercept programmatic value changes
        const descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
        Object.defineProperty(input, 'value', {
            get: function() { return descriptor.get.call(this); },
            set: function(val) {
                descriptor.set.call(this, val);
                update();
            }
        });
        update();
    }
    container.querySelectorAll('input[type="range"]').forEach(setupRangeInput);


    // State
    let currentTool = 'select';
    let isDrawing = false;
    let startX = 0;
    let startY = 0;
    
    let selection = null; // {x, y, w, h, isFloating, imgData}
    let isDraggingSelection = false;
    let clipboardData = null;
    
    // Vector Shapes
    let vectorShapes = [];
    let activeVectorShape = null;
    let resizingHandle = null;
    let currentPathPoints = []; // for brush path recording
    let currentPolyPoints = []; // for polyline arrow tools
    let draggingControlPointIdx = -1; // index of control point being dragged
    let shapeIdCounter = 0;
    
    function nextShapeId() { return 'shape_' + (++shapeIdCounter); }
    
    // Deep clone a vector shape (for duplicate / Shift+drag)
    function cloneShape(s) {
        const clone = { ...s, id: nextShapeId() };
        if (s.points) clone.points = s.points.map(p => ({ ...p }));
        if (s.originalPoints) clone.originalPoints = s.originalPoints.map(p => ({ ...p }));
        if (s.connections) clone.connections = JSON.parse(JSON.stringify(s.connections));
        if (s.type === 'image' && s.img) clone.img = s.img;
        return clone;
    }
    
    // Get snap/connection points for a shape (like PowerPoint anchor points)
    function getSnapPoints(s) {
        if (!s || s.type === 'polyarrow' || s.type === 'path') return [];
        const cx = s.x + (s.x2 - s.x) / 2;
        const cy = s.y + (s.y2 - s.y) / 2;
        const hw = Math.abs(s.x2 - s.x) / 2;
        const hh = Math.abs(s.y2 - s.y) / 2;
        return [
            { x: cx, y: cy - hh, name: 'top' },      // 0: top center
            { x: cx + hw, y: cy, name: 'right' },     // 1: right center
            { x: cx, y: cy + hh, name: 'bottom' },    // 2: bottom center
            { x: cx - hw, y: cy, name: 'left' },      // 3: left center
            { x: cx - hw, y: cy - hh, name: 'tl' },   // 4: top-left
            { x: cx + hw, y: cy - hh, name: 'tr' },   // 5: top-right
            { x: cx + hw, y: cy + hh, name: 'br' },   // 6: bottom-right
            { x: cx - hw, y: cy + hh, name: 'bl' },   // 7: bottom-left
        ];
    }
    
    // Find nearest snap point across all shapes within threshold
    function findNearestSnapPoint(pos, excludeShapeIds, threshold) {
        threshold = threshold || 20;
        let best = null;
        let bestDist = threshold;
        for (const s of vectorShapes) {
            if (!s.id || (excludeShapeIds && excludeShapeIds.includes(s.id))) continue;
            const pts = getSnapPoints(s);
            for (let i = 0; i < pts.length; i++) {
                const d = Math.hypot(pos.x - pts[i].x, pos.y - pts[i].y);
                if (d < bestDist) {
                    bestDist = d;
                    best = { shapeId: s.id, snapIdx: i, x: pts[i].x, y: pts[i].y };
                }
            }
        }
        return best;
    }
    
    // Update polyarrow endpoints connected to shapes
    function updateConnections() {
        for (const arrow of vectorShapes) {
            if (arrow.type !== 'polyarrow' || !arrow.connections) continue;
            const conn = arrow.connections;
            // Skip if connections object is empty (was cleared during move)
            if (!conn.start && !conn.end) continue;
            if (conn.start) {
                const target = vectorShapes.find(s => s.id === conn.start.shapeId);
                if (target) {
                    const pts = getSnapPoints(target);
                    if (pts[conn.start.snapIdx]) {
                        const sp = pts[conn.start.snapIdx];
                        // Update first point
                        if (arrow.originalPoints && arrow.originalPoints.length > 0) {
                            arrow.originalPoints[0].x = sp.x;
                            arrow.originalPoints[0].y = sp.y;
                        }
                        if (arrow.points && arrow.points.length > 0) {
                            arrow.points[0].x = sp.x;
                            arrow.points[0].y = sp.y;
                        }
                    }
                }
            }
            if (conn.end) {
                const target = vectorShapes.find(s => s.id === conn.end.shapeId);
                if (target) {
                    const pts = getSnapPoints(target);
                    if (pts[conn.end.snapIdx]) {
                        const sp = pts[conn.end.snapIdx];
                        const lastIdx = (arrow.originalPoints || arrow.points).length - 1;
                        if (arrow.originalPoints && lastIdx >= 0) {
                            arrow.originalPoints[lastIdx].x = sp.x;
                            arrow.originalPoints[lastIdx].y = sp.y;
                        }
                        if (arrow.points && lastIdx >= 0) {
                            arrow.points[arrow.points.length - 1].x = sp.x;
                            arrow.points[arrow.points.length - 1].y = sp.y;
                        }
                    }
                }
            }
            // Re-apply smooth if connected and smoothed
            if ((conn.start || conn.end) && arrow.originalPoints && arrow.smoothLevel) {
                applySmoothToShape(arrow, arrow.smoothLevel);
            }
            // Recalculate bounding box
            if (arrow.points && arrow.points.length > 1) {
                let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
                arrow.points.forEach(p => {
                    if (p.x < minX) minX = p.x;
                    if (p.y < minY) minY = p.y;
                    if (p.x > maxX) maxX = p.x;
                    if (p.y > maxY) maxY = p.y;
                });
                const sw = arrow.strokeWidth || 5;
                arrow.x = minX - sw; arrow.y = minY - sw;
                arrow.x2 = maxX + sw; arrow.y2 = maxY + sw;
            }
        }
    }
    
    let history = [];
    let historyStep = -1;

    // Elements
    const tools = container.querySelectorAll('.is-tool');
    // Virtual state (sidebar controls removed, context bars handle UI)
    const colorPicker = { value: '#6366f1' };
    const lineWidthSlider = { value: '5' };
    const lineWidthVal = { innerText: '5px' };
    
    const zoomSlider = container.querySelector('#is-zoom');
    const zoomVal = container.querySelector('#is-zoom-val');
    const canvasWrapper = container.querySelector('#is-canvas-wrapper');

    // Save state for Undo/Redo
    const MAX_HISTORY = 50;
    function saveState() {
        if (historyStep < history.length - 1) {
            history = history.slice(0, historyStep + 1);
        }
        // Deep clone vectorShapes (handle Image objects and nested objects)
        const shapesClone = vectorShapes.map(s => {
            const clone = { ...s };
            if (s.points) clone.points = s.points.map(p => ({ ...p }));
            if (s.originalPoints) clone.originalPoints = s.originalPoints.map(p => ({ ...p }));
            if (s.connections) clone.connections = JSON.parse(JSON.stringify(s.connections));
            if (s.type === 'image' && s.img) {
                clone.img = s.img; // keep same Image reference
            }
            return clone;
        });
        history.push({
            dataURL: canvas.toDataURL(),
            shapes: shapesClone
        });
        historyStep++;
        // Enforce history limit to prevent memory leaks
        if (history.length > MAX_HISTORY) {
            const excess = history.length - MAX_HISTORY;
            history = history.slice(excess);
            historyStep -= excess;
            if (historyStep < 0) historyStep = 0;
        }
    }
    
    // Initial save
    saveState();
    
    // Flood fill (paint bucket) algorithm
    function floodFill(startX, startY, hexColor, tolerance) {
        const w = canvas.width;
        const h = canvas.height;
        if (startX < 0 || startX >= w || startY < 0 || startY >= h) return;
        
        // 1. Create a flattened canvas state to respect all objects
        const tempC = document.createElement('canvas');
        tempC.width = w; tempC.height = h;
        const tCtx = tempC.getContext('2d');
        tCtx.drawImage(canvas, 0, 0);
        if (typeof vectorShapes !== 'undefined' && typeof drawShape === 'function') {
            vectorShapes.forEach(s => drawShape(tCtx, s));
        }
        
        const flatImageData = tCtx.getImageData(0, 0, w, h);
        const data = flatImageData.data;
        
        // 2. Parse hex color to RGB
        const fr = parseInt(hexColor.slice(1,3), 16);
        const fg = parseInt(hexColor.slice(3,5), 16);
        const fb = parseInt(hexColor.slice(5,7), 16);
        
        // Get target color at click position from the flattened image
        const idx = (startY * w + startX) * 4;
        const tr = data[idx], tg = data[idx+1], tb = data[idx+2], ta = data[idx+3];
        
        // Don't fill if clicking on same color
        if (Math.abs(fr - tr) <= 2 && Math.abs(fg - tg) <= 2 && Math.abs(fb - tb) <= 2) return;
        
        function colorMatch(i) {
            return Math.abs(data[i] - tr) <= tolerance &&
                   Math.abs(data[i+1] - tg) <= tolerance &&
                   Math.abs(data[i+2] - tb) <= tolerance &&
                   Math.abs(data[i+3] - ta) <= tolerance;
        }
        
        const visited = new Uint8Array(w * h);
        const stack = [[startX, startY]];
        
        // Create an overlay to draw ONLY the new fill color onto the original ctx
        const fillImgData = ctx.createImageData(w, h);
        const fillData = fillImgData.data;
        let hasFilled = false;
        
        while (stack.length > 0) {
            let [x, y] = stack.pop();
            if (x < 0 || x >= w || y < 0 || y >= h) continue;
            if (visited[y * w + x]) continue;
            
            let pi = (y * w + x) * 4;
            if (!colorMatch(pi)) continue;
            
            // Find left edge
            let left = x;
            while (left > 0) {
                let li = (y * w + (left - 1)) * 4;
                if (!colorMatch(li) || visited[y * w + (left - 1)]) break;
                left--;
            }
            
            // Find right edge
            let right = x;
            while (right < w - 1) {
                let ri = (y * w + (right + 1)) * 4;
                if (!colorMatch(ri) || visited[y * w + (right + 1)]) break;
                right++;
            }
            
            // Fill the scanline and check neighbors
            for (let fx = left; fx <= right; fx++) {
                let fi = (y * w + fx) * 4;
                
                // Mark as visited so we don't process again
                visited[y * w + fx] = 1;
                
                // Set pixel on the overlay image
                fillData[fi] = fr;
                fillData[fi+1] = fg;
                fillData[fi+2] = fb;
                fillData[fi+3] = 255;
                hasFilled = true;
                
                // Add neighbors to stack
                if (y > 0 && !visited[(y-1) * w + fx]) stack.push([fx, y - 1]);
                if (y < h - 1 && !visited[(y+1) * w + fx]) stack.push([fx, y + 1]);
            }
        }
        
        if (hasFilled) {
            // Draw the isolated fill onto the base canvas
            const tempFillCanvas = document.createElement('canvas');
            tempFillCanvas.width = w; tempFillCanvas.height = h;
            tempFillCanvas.getContext('2d').putImageData(fillImgData, 0, 0);
            ctx.drawImage(tempFillCanvas, 0, 0);
        }
    }
    
    // Chaikin's corner-cutting smoothing
    function smoothPath(points, iterations) {
        if (points.length < 3) return points;
        let result = points;
        for (let iter = 0; iter < iterations; iter++) {
            let smooth = [result[0]];
            for (let i = 0; i < result.length - 1; i++) {
                const p0 = result[i];
                const p1 = result[i + 1];
                smooth.push({ x: 0.75 * p0.x + 0.25 * p1.x, y: 0.75 * p0.y + 0.25 * p1.y });
                smooth.push({ x: 0.25 * p0.x + 0.75 * p1.x, y: 0.25 * p0.y + 0.75 * p1.y });
            }
            smooth.push(result[result.length - 1]);
            result = smooth;
        }
        return result;
    }

    // Draw Selection Overlay
    const selToolbar = { style: { display: 'none', left: '0', top: '0' } }; // dummy - floating toolbar removed
    const contextBar = container.querySelector('#is-context-bar');
    const ctxTextSpan = container.querySelector('#is-ctx-text');
    const ctxShapeSpan = container.querySelector('#is-ctx-shape');
    
    function drawShape(targetCtx, s) {
        targetCtx.save();
        targetCtx.globalAlpha = s.opacity ?? 1;
        
        let cx = s.x + (s.x2 - s.x) / 2;
        let cy = s.y + (s.y2 - s.y) / 2;
        let w = s.x2 - s.x;
        let h = s.y2 - s.y;
        
        targetCtx.translate(cx, cy);
        if (s.rotation) targetCtx.rotate(s.rotation * Math.PI / 180);
        if (s.flipH || s.flipV) targetCtx.scale(s.flipH ? -1 : 1, s.flipV ? -1 : 1);
        targetCtx.translate(-cx, -cy);

        targetCtx.beginPath();
        targetCtx.lineCap = 'round';
        targetCtx.lineJoin = 'round';
        targetCtx.lineWidth = s.strokeWidth;
        targetCtx.strokeStyle = s.stroke;

        if (s.type === 'line') {
            targetCtx.moveTo(s.x, s.y);
            targetCtx.lineTo(s.x2, s.y2);
        } else if (s.type === 'arrow') {
            targetCtx.moveTo(s.x, s.y);
            targetCtx.lineTo(s.x2, s.y2);
            const angle = Math.atan2(s.y2 - s.y, s.x2 - s.x);
            const headlen = 15 + s.strokeWidth;
            targetCtx.lineTo(s.x2 - headlen * Math.cos(angle - Math.PI / 6), s.y2 - headlen * Math.sin(angle - Math.PI / 6));
            targetCtx.moveTo(s.x2, s.y2);
            targetCtx.lineTo(s.x2 - headlen * Math.cos(angle + Math.PI / 6), s.y2 - headlen * Math.sin(angle + Math.PI / 6));
        } else if (s.type === 'rect') {
            targetCtx.rect(s.x, s.y, w, h);
        } else if (s.type === 'circle') {
            const rx = Math.abs(w) / 2;
            const ry = Math.abs(h) / 2;
            targetCtx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        } else if (s.type === 'triangle') {
            targetCtx.moveTo(cx, s.y);
            targetCtx.lineTo(s.x2, s.y2);
            targetCtx.lineTo(s.x, s.y2);
            targetCtx.closePath();
        } else if (s.type === 'star') {
            const outerRadius = Math.abs(w) / 2;
            const innerRadius = outerRadius / 2.5;
            let rot = Math.PI / 2 * 3;
            let sx = cx, sy = cy;
            const step = Math.PI / 5;
            targetCtx.moveTo(cx, cy - outerRadius);
            for (let i = 0; i < 5; i++) {
                sx = cx + Math.cos(rot) * outerRadius;
                sy = cy + Math.sin(rot) * outerRadius;
                targetCtx.lineTo(sx, sy);
                rot += step;
                sx = cx + Math.cos(rot) * innerRadius;
                sy = cy + Math.sin(rot) * innerRadius;
                targetCtx.lineTo(sx, sy);
                rot += step;
            }
            targetCtx.lineTo(cx, cy - outerRadius);
            targetCtx.closePath();
        } else if (s.type === 'dblarrow') {
            targetCtx.moveTo(s.x, s.y);
            targetCtx.lineTo(s.x2, s.y2);
            const angle = Math.atan2(s.y2 - s.y, s.x2 - s.x);
            const headlen = 15 + s.strokeWidth;
            // Arrow head at end
            targetCtx.moveTo(s.x2, s.y2);
            targetCtx.lineTo(s.x2 - headlen * Math.cos(angle - Math.PI / 6), s.y2 - headlen * Math.sin(angle - Math.PI / 6));
            targetCtx.moveTo(s.x2, s.y2);
            targetCtx.lineTo(s.x2 - headlen * Math.cos(angle + Math.PI / 6), s.y2 - headlen * Math.sin(angle + Math.PI / 6));
            // Arrow head at start
            const angle2 = angle + Math.PI;
            targetCtx.moveTo(s.x, s.y);
            targetCtx.lineTo(s.x - headlen * Math.cos(angle2 - Math.PI / 6), s.y - headlen * Math.sin(angle2 - Math.PI / 6));
            targetCtx.moveTo(s.x, s.y);
            targetCtx.lineTo(s.x - headlen * Math.cos(angle2 + Math.PI / 6), s.y - headlen * Math.sin(angle2 + Math.PI / 6));
        } else if (s.type === 'ellipse') {
            const rx = Math.abs(w) / 2;
            const ry = Math.abs(h) / 2;
            targetCtx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        } else if (s.type === 'diamond') {
            targetCtx.moveTo(cx, s.y);
            targetCtx.lineTo(s.x2, cy);
            targetCtx.lineTo(cx, s.y2);
            targetCtx.lineTo(s.x, cy);
            targetCtx.closePath();
        } else if (s.type === 'parallelogram') {
            const offset = Math.abs(w) * 0.2;
            targetCtx.moveTo(s.x + offset, s.y);
            targetCtx.lineTo(s.x2, s.y);
            targetCtx.lineTo(s.x2 - offset, s.y2);
            targetCtx.lineTo(s.x, s.y2);
            targetCtx.closePath();
        } else if (s.type === 'pentagon') {
            const r = Math.min(Math.abs(w), Math.abs(h)) / 2;
            for (let i = 0; i < 5; i++) {
                const a = (i * 2 * Math.PI / 5) - Math.PI / 2;
                const px = cx + r * Math.cos(a);
                const py = cy + r * Math.sin(a);
                if (i === 0) targetCtx.moveTo(px, py);
                else targetCtx.lineTo(px, py);
            }
            targetCtx.closePath();
        } else if (s.type === 'hexagon') {
            const r = Math.min(Math.abs(w), Math.abs(h)) / 2;
            for (let i = 0; i < 6; i++) {
                const a = (i * 2 * Math.PI / 6) - Math.PI / 6;
                const px = cx + r * Math.cos(a);
                const py = cy + r * Math.sin(a);
                if (i === 0) targetCtx.moveTo(px, py);
                else targetCtx.lineTo(px, py);
            }
            targetCtx.closePath();
        } else if (s.type === 'image') {
            targetCtx.drawImage(s.img, s.x, s.y, w, h);
        } else if (s.type === 'text') {
            let fontStyle = '';
            if (s.fontItalic) fontStyle += 'italic ';
            if (s.fontBold) fontStyle += 'bold ';
            targetCtx.font = `${fontStyle}${s.fontSize}px "${s.fontFamily || 'Arial'}", sans-serif`;
            targetCtx.textBaseline = 'top';
            
            const metrics = targetCtx.measureText(s.text);
            const textWidth = metrics.width;
            const textHeight = s.fontSize;
            
            // Effect background / glow
            if (s.textStyle === 'solid-bg' || s.textStyle === 'shadow') {
                targetCtx.save();
                const padX = s.fontSize * 0.4;
                const padY = s.fontSize * 0.2;
                
                if (s.textStyle === 'shadow') {
                    targetCtx.shadowColor = 'rgba(0,0,0,0.5)';
                    targetCtx.shadowBlur = s.fontSize * 0.2;
                    targetCtx.shadowOffsetX = s.fontSize * 0.1;
                    targetCtx.shadowOffsetY = s.fontSize * 0.1;
                }
                
                targetCtx.fillStyle = s.textBgColor || '#000000';
                const rx = s.x - padX, ry = s.y - padY, rw = textWidth + padX * 2, rh = textHeight + padY * 2, r = s.fontSize * 0.2;
                targetCtx.beginPath();
                targetCtx.moveTo(rx + r, ry);
                targetCtx.lineTo(rx + rw - r, ry);
                targetCtx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + r);
                targetCtx.lineTo(rx + rw, ry + rh - r);
                targetCtx.quadraticCurveTo(rx + rw, ry + rh, rx + rw - r, ry + rh);
                targetCtx.lineTo(rx + r, ry + rh);
                targetCtx.quadraticCurveTo(rx, ry + rh, rx, ry + rh - r);
                targetCtx.lineTo(rx, ry + r);
                targetCtx.quadraticCurveTo(rx, ry, rx + r, ry);
                targetCtx.closePath();
                targetCtx.fill();
                targetCtx.restore();
            } else if (s.textStyle === 'glow') {
                targetCtx.save();
                targetCtx.shadowColor = s.textBgColor || '#000000';
                targetCtx.shadowBlur = s.fontSize * 0.4;
                targetCtx.fillStyle = s.stroke;
                targetCtx.fillText(s.text, s.x, s.y);
                targetCtx.restore();
            }
            
            targetCtx.fillStyle = s.stroke;
            
            // Effect outline
            if (s.textStyle === 'outline') {
                targetCtx.strokeStyle = s.textBgColor || '#000000';
                targetCtx.lineWidth = s.fontSize * 0.12;
                targetCtx.lineJoin = 'round';
                targetCtx.strokeText(s.text, s.x, s.y);
            }
            
            targetCtx.fillText(s.text, s.x, s.y);
            
            if (s.fontUnderline) {
                targetCtx.beginPath();
                targetCtx.strokeStyle = s.stroke;
                targetCtx.lineWidth = Math.max(1, s.fontSize / 15);
                targetCtx.moveTo(s.x, s.y + s.fontSize + 2);
                targetCtx.lineTo(s.x + textWidth, s.y + s.fontSize + 2);
                targetCtx.stroke();
            }
        } else if (s.type === 'path' && s.points && s.points.length > 1) {
            targetCtx.lineCap = 'round';
            targetCtx.lineJoin = 'round';
            
            targetCtx.beginPath();
            targetCtx.moveTo(s.points[0].x, s.points[0].y);
            for (let i = 1; i < s.points.length; i++) {
                targetCtx.lineTo(s.points[i].x, s.points[i].y);
            }
            targetCtx.stroke();
            targetCtx.globalAlpha = 1;
        } else if (s.type === 'polyarrow' && s.points && s.points.length > 1) {
            // Apply line style
            const ls = s.lineStyle || 'solid';
            const sw = s.strokeWidth || 5;
            if (ls === 'dashed') targetCtx.setLineDash([sw * 3, sw * 2]);
            else if (ls === 'dotted') targetCtx.setLineDash([sw, sw * 1.5]);
            else if (ls === 'dashdot') targetCtx.setLineDash([sw * 3, sw * 1.5, sw, sw * 1.5]);
            else targetCtx.setLineDash([]);
            
            targetCtx.lineCap = 'round';
            targetCtx.lineJoin = 'round';
            targetCtx.beginPath();
            targetCtx.moveTo(s.points[0].x, s.points[0].y);
            for (let i = 1; i < s.points.length; i++) {
                targetCtx.lineTo(s.points[i].x, s.points[i].y);
            }
            targetCtx.stroke();
            targetCtx.setLineDash([]);
            
            const mode = s.arrowMode || 'none';
            const headStyle = s.arrowHead || 'open';
            const headlen = 12 + sw * 1.5;
            
            function drawArrowHead(tipPt, refPt) {
                const angle = Math.atan2(tipPt.y - refPt.y, tipPt.x - refPt.x);
                targetCtx.save();
                targetCtx.translate(tipPt.x, tipPt.y);
                targetCtx.rotate(angle);
                
                if (headStyle === 'open') {
                    targetCtx.beginPath();
                    targetCtx.moveTo(-headlen * Math.cos(Math.PI / 6), -headlen * Math.sin(Math.PI / 6));
                    targetCtx.lineTo(0, 0);
                    targetCtx.lineTo(-headlen * Math.cos(Math.PI / 6), headlen * Math.sin(Math.PI / 6));
                    targetCtx.stroke();
                } else if (headStyle === 'filled') {
                    targetCtx.beginPath();
                    targetCtx.moveTo(0, 0);
                    targetCtx.lineTo(-headlen, -headlen * 0.4);
                    targetCtx.lineTo(-headlen, headlen * 0.4);
                    targetCtx.closePath();
                    targetCtx.fillStyle = s.stroke;
                    targetCtx.fill();
                    targetCtx.stroke();
                } else if (headStyle === 'diamond') {
                    const hl = headlen * 0.7;
                    targetCtx.beginPath();
                    targetCtx.moveTo(0, 0);
                    targetCtx.lineTo(-hl, -hl * 0.5);
                    targetCtx.lineTo(-hl * 2, 0);
                    targetCtx.lineTo(-hl, hl * 0.5);
                    targetCtx.closePath();
                    targetCtx.fillStyle = s.stroke;
                    targetCtx.fill();
                    targetCtx.stroke();
                } else if (headStyle === 'circle') {
                    const r = headlen * 0.35;
                    targetCtx.beginPath();
                    targetCtx.arc(-r, 0, r, 0, Math.PI * 2);
                    targetCtx.fillStyle = s.stroke;
                    targetCtx.fill();
                    targetCtx.stroke();
                } else if (headStyle === 'square') {
                    const sz = headlen * 0.5;
                    targetCtx.beginPath();
                    targetCtx.rect(-sz * 2, -sz, sz * 2, sz * 2);
                    targetCtx.fillStyle = s.stroke;
                    targetCtx.fill();
                    targetCtx.stroke();
                }
                targetCtx.restore();
            }
            
            if (mode === 'single' || mode === 'double') {
                const lastPt = s.points[s.points.length - 1];
                const prevPt = s.points[s.points.length - 2];
                drawArrowHead(lastPt, prevPt);
            }
            if (mode === 'double') {
                const firstPt = s.points[0];
                const nextPt = s.points[1];
                drawArrowHead(firstPt, nextPt);
            }
        }
        
        if (s.type !== 'image' && s.type !== 'text' && s.type !== 'path' && s.type !== 'polyarrow') {
            if (s.fill && s.fill !== 'transparent') {
                targetCtx.fillStyle = s.fill;
                targetCtx.fill();
            }
            targetCtx.stroke();
        }
        
        targetCtx.restore();
    }
    
    function drawSelectionOverlay() {
        octx.clearRect(0, 0, overlay.width, overlay.height);
        
        // Draw grid pattern on overlay (non-destructive)
        drawGrid(octx);
        
        vectorShapes.forEach(s => drawShape(octx, s));
        
        if (window.currentMaskPoints && window.currentMaskPoints.length > 0) {
            octx.beginPath();
            octx.moveTo(window.currentMaskPoints[0].x, window.currentMaskPoints[0].y);
            for(let i=1; i<window.currentMaskPoints.length; i++) {
                octx.lineTo(window.currentMaskPoints[i].x, window.currentMaskPoints[i].y);
            }
            if (window.isMaskFinished) octx.closePath();
            octx.strokeStyle = '#10b981';
            octx.lineWidth = 2;
            octx.setLineDash([4,4]);
            octx.stroke();
            octx.setLineDash([]);
            if (window.isMaskFinished) {
                octx.fillStyle = 'rgba(16, 185, 129, 0.2)';
                octx.fill();
            }
        }
        
        // Canvas selection border + resize handle
        if (canvasSelected && !activeVectorShape) {
            octx.save();
            octx.strokeStyle = '#3b82f6';
            octx.lineWidth = 2;
            octx.setLineDash([6, 4]);
            octx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);
            octx.setLineDash([]);
            // Bottom-right resize handle
            const hx = canvas.width - 1, hy = canvas.height - 1;
            octx.fillStyle = '#3b82f6';
            octx.fillRect(hx - 8, hy - 8, 10, 10);
            octx.strokeStyle = '#fff';
            octx.lineWidth = 1;
            octx.strokeRect(hx - 8, hy - 8, 10, 10);
            // Small diagonal lines inside handle
            octx.strokeStyle = '#fff';
            octx.lineWidth = 1;
            octx.beginPath();
            octx.moveTo(hx - 2, hy - 6); octx.lineTo(hx - 6, hy - 2);
            octx.moveTo(hx - 2, hy - 3); octx.lineTo(hx - 3, hy - 2);
            octx.stroke();
            octx.restore();
        }
        
        if (activeVectorShape) {
            const s = activeVectorShape;
            let cx = s.x + (s.x2 - s.x) / 2;
            let cy = s.y + (s.y2 - s.y) / 2;
            let w = Math.abs(s.x2 - s.x);
            let h = Math.abs(s.y2 - s.y);
            let rot = (s.rotation || 0) * Math.PI / 180;
            
            // Draw rotated selection box
            octx.save();
            octx.translate(cx, cy);
            octx.rotate(rot);
            
            // Dashed border
            octx.strokeStyle = '#000';
            octx.lineWidth = 1;
            octx.setLineDash([5, 5]);
            octx.strokeRect(-w/2, -h/2, w, h);
            octx.setLineDash([]);
            
            // 8 handles (in local rotated space) — skip for path/polyarrow (they use control points)
            const _hideResizeHandles = (s.type === 'path' || s.type === 'polyarrow');
            const localHandles = [
                {x: -w/2, y: -h/2}, {x: 0, y: -h/2}, {x: w/2, y: -h/2},
                {x: -w/2, y: 0},                      {x: w/2, y: 0},
                {x: -w/2, y: h/2},  {x: 0, y: h/2},  {x: w/2, y: h/2}
            ];
            
            octx.fillStyle = '#fff';
            octx.strokeStyle = '#000';
            octx.lineWidth = 1;
            if (!_hideResizeHandles) {
                    localHandles.forEach(hnd => {
                    octx.fillRect(hnd.x - 4, hnd.y - 4, 8, 8);
                octx.strokeRect(hnd.x - 4, hnd.y - 4, 8, 8);
                    });
                }
            
            // Rotation handle (line + circle above top-center)
            octx.beginPath();
            octx.moveTo(0, -h/2);
            octx.lineTo(0, -h/2 - 20);
            octx.stroke();
            octx.beginPath();
            octx.arc(0, -h/2 - 28, 8, 0, Math.PI * 2);
            octx.fillStyle = '#fff';
            octx.fill();
            octx.stroke();
            
            // Arrow icon inside rotation circle
            octx.fillStyle = '#000';
            octx.font = '12px "boxicons"';
            octx.textAlign = 'center';
            octx.textBaseline = 'middle';
            octx.fillText('\uea4b', 0, -h/2 - 28);
            
            octx.restore();
            
            // Draw control points for smoothed polyarrow shapes only
            if (s.type === 'polyarrow' && s.originalPoints && s.originalPoints.length > 1) {
                octx.save();
                // Draw original path faintly
                octx.beginPath();
                octx.moveTo(s.originalPoints[0].x, s.originalPoints[0].y);
                for (let i = 1; i < s.originalPoints.length; i++) {
                    octx.lineTo(s.originalPoints[i].x, s.originalPoints[i].y);
                }
                octx.strokeStyle = s.stroke || '#6366f1';
                octx.globalAlpha = 0.25;
                octx.lineWidth = s.strokeWidth || 2;
                octx.setLineDash([4, 4]);
                octx.stroke();
                octx.setLineDash([]);
                octx.globalAlpha = 1;
                
                // Draw draggable diamond handles at each control point
                s.originalPoints.forEach((p, idx) => {
                    octx.save();
                    octx.translate(p.x, p.y);
                    octx.rotate(Math.PI / 4);
                    octx.fillStyle = idx === 0 || idx === s.originalPoints.length - 1 ? '#60a5fa' : '#f59e0b';
                    octx.strokeStyle = '#000';
                    octx.lineWidth = 1.5;
                    octx.fillRect(-5, -5, 10, 10);
                    octx.strokeRect(-5, -5, 10, 10);
                    octx.restore();
                });
                octx.restore();
            }
            
            // Position toolbar (transform top-left corner to screen space)
            const cosR = Math.cos(rot);
            const sinR = Math.sin(rot);
            const toolbarLocalY = -h/2 - 70;
            const toolbarWorldX = cx + (-w/2) * cosR - toolbarLocalY * sinR;
            const toolbarWorldY = cy + (-w/2) * sinR + toolbarLocalY * cosR;
            
            // Show context bar based on shape type
            contextBar.style.display = 'flex';
            // Hide all tool-specific spans first
            ['is-ctx-text','is-ctx-shape','is-ctx-brush','is-ctx-eraser','is-ctx-fill','is-ctx-crop','is-ctx-select','is-ctx-region-actions'].forEach(id => container.querySelector('#'+id).style.display = 'none');
            container.querySelector('#is-ctx-del').style.display = 'flex';
            container.querySelector('#is-ctx-del-divider').style.display = '';
            container.querySelector('#is-ctx-front').style.display = 'flex';
            container.querySelector('#is-obj-copy').style.display = 'flex';
            container.querySelector('#is-obj-flatten').style.display = 'flex';
            // Show object type and size info
            const _typeNames = { rect: '▭ Rectangle', circle: '○ Circle', ellipse: '⬭ Ellipse', triangle: '△ Triangle', diamond: '◇ Diamond', parallelogram: '▱ Parallelogram', pentagon: '⬠ Pentagon', hexagon: '⬡ Hexagon', star: '★ Star', text: 'T Text', path: '✏ Brush Path', polyarrow: '↗ Line/Arrow', image: '🖼 Image' };
            const _typeName = _typeNames[s.type] || s.type;
            const _ow = Math.round(Math.abs(s.x2 - s.x));
            const _oh = Math.round(Math.abs(s.y2 - s.y));
            container.querySelector('#is-obj-type-info').innerHTML = '<span style="color:#aaa; font-weight:500;">' + _typeName + '</span> <span style="color:#555">|</span> <span style="color:#888;">' + _ow + ' × ' + _oh + ' px</span>';
            container.querySelector('#is-obj-type-info').style.display = 'flex';
            container.querySelector('#is-ctx-back').style.display = 'flex';
            container.querySelector('#is-obj-remove-bg').style.display = 'none';
            container.querySelector('#is-obj-smart-remove').style.display = 'none';
            container.querySelector('#is-polyarrow-opts').style.display = 'none';
            // Hide smooth controls (shown selectively for path/polyarrow)
            container.querySelector('#is-brush-smooth').style.display = 'none';
            container.querySelector('#is-brush-smooth-divider').style.display = 'none';
            container.querySelector('#is-smooth-level').style.display = 'none';
            container.querySelector('#is-smooth-level-label').style.display = 'none';
            container.querySelector('#is-smooth-level-val').style.display = 'none';
            if (s.type === 'text') {
                ctxTextSpan.style.display = 'contents';
                ctxShapeSpan.style.display = 'none';
                container.querySelector('#is-text-color').value = s.stroke || '#6366f1';
                container.querySelector('#is-font-family').value = s.fontFamily || 'Arial';
                container.querySelector('#is-font-size').value = s.fontSize || 48;
                container.querySelector('#is-font-bold').classList.toggle('active', !!s.fontBold);
                container.querySelector('#is-font-italic').classList.toggle('active', !!s.fontItalic);
                container.querySelector('#is-font-underline').classList.toggle('active', !!s.fontUnderline);
                container.querySelector('#is-text-render-style').value = s.textStyle || 'normal';
                container.querySelector('#is-text-bg-color').value = s.textBgColor || '#000000';
            } else if (s.type === 'path') {
                ctxTextSpan.style.display = 'none';
                ctxShapeSpan.style.display = 'none';
                container.querySelector('#is-ctx-brush').style.display = 'contents';
                container.querySelector('#is-global-opacity-divider').style.display = '';
                container.querySelector('#is-global-opacity-label').style.display = '';
                container.querySelector('#is-global-opacity').style.display = '';
                container.querySelector('#is-global-opacity-val').style.display = '';

                container.querySelector('#is-brush-color').value = s.stroke || '#6366f1';
                container.querySelector('#is-brush-size').value = s.strokeWidth || 5;
                container.querySelector('#is-brush-size-val').textContent = (s.strokeWidth || 5) + 'px';
                
                
                container.querySelector('#is-brush-smooth').style.display = 'flex';
                container.querySelector('#is-brush-smooth-divider').style.display = '';
                container.querySelector('#is-smooth-level').style.display = '';
                container.querySelector('#is-smooth-level-label').style.display = '';
                container.querySelector('#is-smooth-level-val').style.display = '';
            } else if (s.type === 'polyarrow') {
                ctxTextSpan.style.display = 'none';
                ctxShapeSpan.style.display = 'contents';
                container.querySelector('#is-shape-color').value = s.stroke || '#6366f1';
                container.querySelector('#is-shape-stroke').value = s.strokeWidth || 5;
                container.querySelector('#is-brush-smooth').style.display = 'flex';
                container.querySelector('#is-brush-smooth-divider').style.display = '';
                container.querySelector('#is-smooth-level').style.display = '';
                container.querySelector('#is-smooth-level-label').style.display = '';
                container.querySelector('#is-smooth-level-val').style.display = '';
                // Show polyarrow options
                container.querySelector('#is-polyarrow-opts').style.display = 'flex';
                // Sync mode buttons
                const mode = s.arrowMode || 'none';
                container.querySelectorAll('.is-arrow-mode').forEach(b => b.classList.toggle('active', b.getAttribute('data-mode') === mode));
                // Sync line style
                container.querySelector('#is-line-style').value = s.lineStyle || 'solid';
                // Sync arrowhead style & visibility
                const hasArrow = mode !== 'none';
                container.querySelector('#is-arrowhead-divider').style.display = hasArrow ? '' : 'none';
                container.querySelector('#is-arrowhead-label').style.display = hasArrow ? '' : 'none';
                container.querySelector('#is-arrowhead-style').style.display = hasArrow ? '' : 'none';
                container.querySelector('#is-arrowhead-style').value = s.arrowHead || 'open';
            } else if (s.type === 'image') {
                ctxTextSpan.style.display = 'none';
                ctxShapeSpan.style.display = 'none';
                container.querySelector('#is-obj-remove-bg').style.display = 'flex';
                container.querySelector('#is-obj-smart-remove').style.display = 'flex';
                const _iw = activeVectorShape.img.naturalWidth || activeVectorShape.img.width;
                const _ih = activeVectorShape.img.naturalHeight || activeVectorShape.img.height;
            } else {
                ctxTextSpan.style.display = 'none';
                ctxShapeSpan.style.display = 'contents';
                container.querySelector('#is-shape-color').value = s.stroke || '#6366f1';
                container.querySelector('#is-shape-stroke').value = s.strokeWidth || 5;
                if (!s.fill || s.fill === 'transparent') {
                    container.querySelector('#is-shape-fill-color').setAttribute('data-transparent', 'true');
                } else {
                    container.querySelector('#is-shape-fill-color').setAttribute('data-transparent', 'false');
                    container.querySelector('#is-shape-fill-color').value = s.fill;
                }
            }

            // Show global opacity for all object types
            container.querySelector('#is-global-opacity-divider').style.display = '';
            container.querySelector('#is-global-opacity-label').style.display = '';
            container.querySelector('#is-global-opacity').style.display = '';
            container.querySelector('#is-global-opacity-val').style.display = '';
            container.querySelector('#is-global-opacity').value = Math.round((s.opacity ?? 1) * 100);
            container.querySelector('#is-global-opacity-val').textContent = Math.round((s.opacity ?? 1) * 100) + '%';
            return;
        }
        
        if (!selection) {
            selToolbar.style.display = 'none';
            return;
        }
        
        if (selection.isFloating && selection.imgData) {
            octx.putImageData(selection.imgData, selection.x, selection.y);
        }
        
        octx.strokeStyle = '#3b82f6';
        octx.setLineDash([5, 5]);
        octx.strokeRect(selection.x, selection.y, selection.w, selection.h);
        octx.setLineDash([]);
        
        selToolbar.style.display = 'flex';
        selToolbar.style.left = selection.x + 'px';
        selToolbar.style.top = selection.y + 'px';
    }

    // Tool Selection
    tools.forEach(btn => {
        btn.addEventListener('click', () => {
            activeVectorShape = null;
            if (selection) {
                if (selection.isFloating) {
                    ctx.putImageData(selection.imgData, selection.x, selection.y);
                }
                selection = null;
                drawSelectionOverlay();
                saveState();
            }
            tools.forEach(t => t.classList.remove('active'));
            btn.classList.add('active');
            currentTool = btn.getAttribute('data-tool');
            currentPolyPoints = []; // Reset poly points on tool switch
            hideCanvasTooltip();
            if (currentTool === 'text') canvas.style.cursor = 'text';
            else if (currentTool === 'select' || currentTool === 'region') canvas.style.cursor = 'default';
            else if (currentTool === 'fill') canvas.style.cursor = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23fff' stroke='%23000' stroke-width='1.5' d='M16.56 8.94L7.62 0 6.21 1.41l2.38 2.38-5.15 5.15a1.49 1.49 0 000 2.12l5.5 5.5c.29.29.68.44 1.06.44s.77-.15 1.06-.44l5.5-5.5c.59-.58.59-1.53 0-2.12zM5.21 10L10 5.21 14.79 10H5.21zM19 11.5s-2 2.17-2 3.5c0 1.1.9 2 2 2s2-.9 2-2c0-1.33-2-3.5-2-3.5z'/%3E%3C/svg%3E") 2 22, crosshair`;
            else canvas.style.cursor = 'none'; // custom cursor for all drawing tools
            
            // Show/hide context bar based on tool
            const allCtxSpans = ['is-ctx-text','is-ctx-shape','is-ctx-brush','is-ctx-eraser','is-ctx-fill','is-ctx-crop','is-ctx-select','is-ctx-region-actions'];
            allCtxSpans.forEach(id => container.querySelector('#'+id).style.display = 'none');
            container.querySelector('#is-global-opacity-divider').style.display = 'none';
            container.querySelector('#is-global-opacity-label').style.display = 'none';
            container.querySelector('#is-global-opacity').style.display = 'none';
            container.querySelector('#is-global-opacity-val').style.display = 'none';

            contextBar.style.display = 'flex';
            
            const isShapeTool = ['polyarrow', 'rect', 'circle', 'ellipse', 'triangle', 'diamond', 'parallelogram', 'pentagon', 'hexagon', 'star'].includes(currentTool);
            if (currentTool === 'text') {
                ctxTextSpan.style.display = 'contents';
            } else if (isShapeTool) {
                ctxShapeSpan.style.display = 'contents';
            if (currentTool === 'polyarrow') {
                container.querySelector('#is-polyarrow-opts').style.display = 'flex';
                container.querySelector('#is-brush-smooth-divider').style.display = '';
                container.querySelector('#is-smooth-level-label').style.display = '';
                container.querySelector('#is-smooth-level').style.display = '';
                container.querySelector('#is-smooth-level-val').style.display = '';
                container.querySelector('#is-brush-smooth').style.display = 'flex';
            } else {
                container.querySelector('#is-polyarrow-opts').style.display = 'none';
                container.querySelector('#is-brush-smooth-divider').style.display = 'none';
                container.querySelector('#is-smooth-level-label').style.display = 'none';
                container.querySelector('#is-smooth-level').style.display = 'none';
                container.querySelector('#is-smooth-level-val').style.display = 'none';
                container.querySelector('#is-brush-smooth').style.display = 'none';
            }

            } else if (currentTool === 'brush') {
                container.querySelector('#is-ctx-brush').style.display = 'contents';
                container.querySelector('#is-global-opacity-divider').style.display = '';
                container.querySelector('#is-global-opacity-label').style.display = '';
                container.querySelector('#is-global-opacity').style.display = '';
                container.querySelector('#is-global-opacity-val').style.display = '';

                container.querySelector('#is-brush-smooth').style.display = 'none';
                container.querySelector('#is-brush-smooth-divider').style.display = 'none';
                container.querySelector('#is-smooth-level').style.display = 'none';
                container.querySelector('#is-smooth-level-label').style.display = 'none';
                container.querySelector('#is-smooth-level-val').style.display = 'none';
            } else if (currentTool === 'eraser') {
                container.querySelector('#is-ctx-eraser').style.display = 'contents';
            } else if (currentTool === 'fill') {
                container.querySelector('#is-ctx-fill').style.display = 'contents';
            } else if (currentTool === 'crop' || currentTool === 'region') {
                container.querySelector('#is-ctx-crop').style.display = 'contents';
            } else if (currentTool === 'select') {
                container.querySelector('#is-ctx-select').style.display = 'contents';
            }
            // Hide delete button when no object is selected
            container.querySelector('#is-ctx-del').style.display = 'none';
            container.querySelector('#is-ctx-del-divider').style.display = 'none';
            container.querySelector('#is-ctx-front').style.display = 'none';
            container.querySelector('#is-obj-copy').style.display = 'none';
            container.querySelector('#is-obj-flatten').style.display = 'none';
            container.querySelector('#is-ctx-back').style.display = 'none';
            container.querySelector('#is-obj-remove-bg').style.display = 'none';
            container.querySelector('#is-obj-smart-remove').style.display = 'none';
            container.querySelector('#is-obj-type-info').style.display = 'none';
            container.querySelector('#is-polyarrow-opts').style.display = 'none';
            
            // Show tool guideline tooltip
            
            hideCanvasTooltip();
            
            const _toolGuides = {
            
                select: "Click to select · Drag to move · <b style='color:#60a5fa;'>Shift</b>+handle to lock ratio · <b style='color:#60a5fa;'>Alt</b>+click to select behind",
            
                brush: "Click and drag to draw · Released stroke becomes vector object",
            
                eraser: "Click and drag to erase",
            
                rect: "Drag to draw · <b style='color:#60a5fa;'>Shift</b> for square",
            
                circle: "Drag to draw circle · <b style='color:#60a5fa;'>Shift</b> for perfect circle",
            
                ellipse: "Drag to draw ellipse · <b style='color:#60a5fa;'>Shift</b> for circle",
            
                triangle: "Drag to draw · <b style='color:#60a5fa;'>Shift</b> for equilateral",
            
                diamond: "Drag to draw · <b style='color:#60a5fa;'>Shift</b> for square diamond",
            
                parallelogram: "Drag to draw · <b style='color:#60a5fa;'>Shift</b> for equal sides",
            
                pentagon: "Drag to draw · <b style='color:#60a5fa;'>Shift</b> for regular",
            
                hexagon: "Drag to draw · <b style='color:#60a5fa;'>Shift</b> for regular",
            
                star: "Drag to draw · <b style='color:#60a5fa;'>Shift</b> for regular star",
            
                text: "Click to place text · Type and press <b style='color:#60a5fa;'>Enter</b> to confirm",
            
                fill: "Click to flood fill area with color",
            
                region: "Drag to select a region · Then use toolbar to cut/copy/crop",
            
                crop: "Drag to select crop area",
            
                polyarrow: "Click to add points · <b style='color:#60a5fa;'>Space</b> to finish · <b style='color:#f87171;'>Esc</b> to cancel"
            
            };
            
            if (_toolGuides[currentTool]) setCanvasTooltip(_toolGuides[currentTool]);
            
            drawSelectionOverlay();
        });
    });
    
    // Text style toggle buttons (B, I, U)
    container.querySelectorAll('.is-text-style').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            btn.classList.toggle('active');
            // If a text shape is selected, update it live
            if (activeVectorShape && activeVectorShape.type === 'text') {
                const id = btn.id;
                if (id === 'is-font-bold') activeVectorShape.fontBold = btn.classList.contains('active');
                if (id === 'is-font-italic') activeVectorShape.fontItalic = btn.classList.contains('active');
                if (id === 'is-font-underline') activeVectorShape.fontUnderline = btn.classList.contains('active');
                recalcTextBounds(activeVectorShape);
                drawSelectionOverlay();
            }
        });
    });
    
    // Text color change
    container.querySelector('#is-text-color').addEventListener('input', () => {
        if (activeVectorShape && activeVectorShape.type === 'text') {
            activeVectorShape.stroke = window._isGetCVal('#is-text-color');
            drawSelectionOverlay();
        }
    });
    
    // Font family / size changes update active text shape
    container.querySelector('#is-font-family').addEventListener('change', () => {
        if (activeVectorShape && activeVectorShape.type === 'text') {
            const newFont = container.querySelector('#is-font-family').value;
            activeVectorShape.fontFamily = newFont;
            // Ensure the font is loaded before measuring/rendering
            const fontSize = activeVectorShape.fontSize || 48;
            document.fonts.load(`${fontSize}px "${newFont}"`).then(() => {
                recalcTextBounds(activeVectorShape);
                drawSelectionOverlay();
            });
        }
    });
    container.querySelector('#is-font-size').addEventListener('input', () => {
        if (activeVectorShape && activeVectorShape.type === 'text') {
            activeVectorShape.fontSize = parseInt(container.querySelector('#is-font-size').value) || 48;
            recalcTextBounds(activeVectorShape);
            drawSelectionOverlay();
        }
    });
    container.querySelector('#is-text-render-style').addEventListener('change', () => {
        if (activeVectorShape && activeVectorShape.type === 'text') {
            activeVectorShape.textStyle = container.querySelector('#is-text-render-style').value;
            drawSelectionOverlay();
        }
    });
    container.querySelector('#is-text-bg-color').addEventListener('input', () => {
        if (activeVectorShape && activeVectorShape.type === 'text') {
            activeVectorShape.textBgColor = window._isGetCVal('#is-text-bg-color');
            drawSelectionOverlay();
        }
    });
    
    // Recalculate text bounding box
    function recalcTextBounds(s) {
        let fontStr = '';
        if (s.fontItalic) fontStr += 'italic ';
        if (s.fontBold) fontStr += 'bold ';
        ctx.font = `${fontStr}${s.fontSize}px "${s.fontFamily || 'Arial'}", sans-serif`;
        const metrics = ctx.measureText(s.text);
        s.x2 = s.x + metrics.width;
        s.y2 = s.y + s.fontSize;
    }

    // Brush context bar controls
    container.querySelector('#is-brush-color').addEventListener('input', (e) => {
        colorPicker.value = e.target.value;
        if (activeVectorShape && activeVectorShape.type === 'path') {
            activeVectorShape.stroke = e.target.value;
            drawSelectionOverlay();
        }
    });
    container.querySelector('#is-brush-size').addEventListener('input', (e) => {
        lineWidthSlider.value = e.target.value;
        lineWidthVal.innerText = e.target.value + 'px';
        container.querySelector('#is-brush-size-val').textContent = e.target.value + 'px';
        if (activeVectorShape && activeVectorShape.type === 'path') {
            activeVectorShape.strokeWidth = parseInt(e.target.value);
            drawSelectionOverlay();
        }
    });

    // Global opacity slider for all objects
    container.querySelector('#is-global-opacity').addEventListener('input', (e) => {
        container.querySelector('#is-global-opacity-val').textContent = e.target.value + '%';
        if (activeVectorShape) {
            activeVectorShape.opacity = parseInt(e.target.value) / 100;
            drawSelectionOverlay();
        }
    });

    // Eraser context bar controls
    container.querySelector('#is-eraser-size').addEventListener('input', (e) => {
        lineWidthSlider.value = e.target.value;
        lineWidthVal.innerText = e.target.value + 'px';
        container.querySelector('#is-eraser-size-val').textContent = e.target.value + 'px';
    });
    
    // Fill tool context bar controls
    container.querySelector('#is-fill-color').addEventListener('input', (e) => {
        colorPicker.value = e.target.value;
    });
    container.querySelector('#is-fill-tolerance').addEventListener('input', (e) => {
        container.querySelector('#is-fill-tolerance-val').textContent = e.target.value;
    });
    
    // Canvas background color
    let canvasBgColor = '#ffffff';
    let canvasGrid = 'none';
    let canvasGridSize = 20;
    
    container.querySelector('#is-canvas-bg-color').addEventListener('input', (e) => {
        canvasBgColor = e.target.value;
        // Fill entire canvas with background color
        ctx.fillStyle = canvasBgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        saveState();
        drawSelectionOverlay();
    });
    
    container.querySelector('#is-canvas-grid').addEventListener('change', (e) => {
        canvasGrid = e.target.value;
        drawSelectionOverlay();
    });
    
    container.querySelector('#is-canvas-grid-size').addEventListener('input', (e) => {
        canvasGridSize = parseInt(e.target.value) || 20;
        drawSelectionOverlay();
    });
    
    function drawGrid(targetCtx) {
        if (canvasGrid === 'none') return;
        const w = canvas.width;
        const h = canvas.height;
        const g = canvasGridSize;
        
        targetCtx.save();
        targetCtx.strokeStyle = 'rgba(150,150,150,0.25)';
        targetCtx.lineWidth = 0.5;
        
        if (canvasGrid === 'lines') {
            targetCtx.beginPath();
            for (let x = g; x < w; x += g) {
                targetCtx.moveTo(x, 0);
                targetCtx.lineTo(x, h);
            }
            for (let y = g; y < h; y += g) {
                targetCtx.moveTo(0, y);
                targetCtx.lineTo(w, y);
            }
            targetCtx.stroke();
        } else if (canvasGrid === 'dots') {
            targetCtx.fillStyle = 'rgba(150,150,150,0.4)';
            for (let x = g; x < w; x += g) {
                for (let y = g; y < h; y += g) {
                    targetCtx.beginPath();
                    targetCtx.arc(x, y, 1, 0, Math.PI * 2);
                    targetCtx.fill();
                }
            }
        } else if (canvasGrid === 'cross') {
            targetCtx.beginPath();
            const cs = 3; // cross size
            for (let x = g; x < w; x += g) {
                for (let y = g; y < h; y += g) {
                    targetCtx.moveTo(x - cs, y);
                    targetCtx.lineTo(x + cs, y);
                    targetCtx.moveTo(x, y - cs);
                    targetCtx.lineTo(x, y + cs);
                }
            }
            targetCtx.stroke();
        }
        
        targetCtx.restore();
    }

    // Universal canvas tooltip (bottom center)
    function setCanvasTooltip(html) {
        let tip = container.querySelector('#is-canvas-tooltip');
        if (!tip) {
            tip = document.createElement('div');
            tip.id = 'is-canvas-tooltip';
            tip.style.cssText = 'position:absolute; bottom:12px; left:50%; transform:translateX(-50%); background:rgba(0,0,0,0.85); color:#fff; padding:6px 14px; border-radius:6px; font-size:12px; pointer-events:none; z-index:100; white-space:nowrap; backdrop-filter:blur(4px); border:1px solid rgba(255,255,255,0.1);';
            container.querySelector('#is-canvas-container').appendChild(tip);
        }
        tip.innerHTML = html;
        tip.style.display = '';
    }
    function hideCanvasTooltip() {
        const tip = container.querySelector('#is-canvas-tooltip');
        if (tip) tip.remove();
    }


    // Zoom
    zoomSlider.addEventListener('input', (e) => {
        const val = e.target.value;
        zoomVal.innerText = val + '%';
        canvasWrapper.style.transform = `scale(${val / 100})`;
        canvasWrapper.style.transformOrigin = 'center center';
    });

    // Panning & Zoom with Mouse
    const canvasContainer = container.querySelector('#is-canvas-container');
    let isPanning = false;
    let isSpaceDown = false;
    let isShiftDown = false;
    let canvasSelected = false;
    let isResizingCanvas = false;
    let canvasResizeStartX = 0, canvasResizeStartY = 0;
    let canvasResizeOrigW = 0, canvasResizeOrigH = 0;

    document.addEventListener('keydown', (e) => {
        if (!document.getElementById('is-canvas')) return;
        // Ignore space if typing in input/prompt
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
        if (e.code === 'Space') {
            isSpaceDown = true;
            canvasContainer.style.cursor = 'grab';
            canvas.style.cursor = 'grab';
            e.preventDefault();
        }
        if (e.key === 'Shift') isShiftDown = true;
        // Alt+Click to cycle select (see mousedown handler)
    });

    document.addEventListener('keyup', (e) => {
        if (!document.getElementById('is-canvas')) return;
        if (e.code === 'Space') {
            isSpaceDown = false;
            isPanning = false;
            canvasContainer.style.cursor = 'auto';
            if (currentTool === 'text') canvas.style.cursor = 'text';
            else if (currentTool === 'select') canvas.style.cursor = 'default';
            else canvas.style.cursor = 'none';
        }
        if (e.key === 'Shift') isShiftDown = false;
    });

    canvasContainer.addEventListener('mousedown', (e) => {
        if (e.button === 1 || isSpaceDown) {
            isPanning = true;
            canvasContainer.style.cursor = 'grabbing';
            canvas.style.cursor = 'grabbing';
            e.preventDefault();
        }
    });

    window.addEventListener('mousemove', (e) => {
        if (isPanning) {
            canvasContainer.scrollLeft -= e.movementX;
            canvasContainer.scrollTop -= e.movementY;
        }
    });

    window.addEventListener('mouseup', (e) => {
        if (isPanning) {
            isPanning = false;
            canvasContainer.style.cursor = isSpaceDown ? 'grab' : 'auto';
            if (!isSpaceDown) {
                if (currentTool === 'text') canvas.style.cursor = 'text';
                else if (currentTool === 'select') canvas.style.cursor = 'default';
                else canvas.style.cursor = 'none';
            } else {
                canvas.style.cursor = 'grab';
            }
        }
    });

    canvasContainer.addEventListener('wheel', (e) => {
        if (e.ctrlKey) {
            e.preventDefault();
            // Temporarily remove transition for instant scroll feedback
            canvasWrapper.style.transition = 'none';
            
            let zoom = parseFloat(zoomSlider.value);
            // Increase multiplier to make it zoom faster
            zoom -= e.deltaY * 0.25;
            zoom = Math.max(10, Math.min(400, Math.round(zoom)));
            
            if (zoomSlider.value != zoom) {
                zoomSlider.value = zoom;
                zoomSlider.dispatchEvent(new Event('input'));
            }
            
            // Restore transition shortly after scrolling stops
            clearTimeout(canvasWrapper._zoomTimer);
            canvasWrapper._zoomTimer = setTimeout(() => {
                canvasWrapper.style.transition = 'transform 0.1s';
            }, 50);
        }
    }, { passive: false });

    // Mouse Events
    function getMousePos(evt) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return {
            x: (evt.clientX - rect.left) * scaleX,
            y: (evt.clientY - rect.top) * scaleY
        };
    }

    function getContrastBackground(hexColor) {
        if(!hexColor || hexColor.length < 7) return 'rgba(255,255,255,0.2)';
        const r = parseInt(hexColor.slice(1,3), 16);
        const g = parseInt(hexColor.slice(3,5), 16);
        const b = parseInt(hexColor.slice(5,7), 16);
        const luma = 0.299 * r + 0.587 * g + 0.114 * b;
        return luma > 150 ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)';
    }

    canvas.addEventListener('mousedown', (e) => {
        if (e.button === 1 || isSpaceDown) return;
        if (currentTool === 'smartremove') return; // Ignore if panning
        const pos = getMousePos(e);
        
        if (currentTool === 'select') {
            // Check vector handles first
            if (activeVectorShape) {
                const s = activeVectorShape;
                let cx = s.x + (s.x2 - s.x) / 2;
                let cy = s.y + (s.y2 - s.y) / 2;
                let w = Math.abs(s.x2 - s.x);
                let h = Math.abs(s.y2 - s.y);
                let rot = (s.rotation || 0) * Math.PI / 180;
                
                // Transform mouse to local (unrotated) space
                let dx = pos.x - cx;
                let dy = pos.y - cy;
                let cosR = Math.cos(-rot);
                let sinR = Math.sin(-rot);
                let localX = dx * cosR - dy * sinR;
                let localY = dx * sinR + dy * cosR;

                // Check control points (for smoothed polyarrow/path shapes)
                if (s.originalPoints && s.originalPoints.length > 1) {
                    for (let i = 0; i < s.originalPoints.length; i++) {
                        const cp = s.originalPoints[i];
                        if (Math.abs(pos.x - cp.x) < 8 && Math.abs(pos.y - cp.y) < 8) {
                            draggingControlPointIdx = i;
                            isDrawing = true;
                            return;
                        }
                    }
                }

                // Check rotation handle (circle above top-center, in local space)
                let rotHandleLocalX = 0;
                let rotHandleLocalY = -h/2 - 28;
                if (Math.abs(localX - rotHandleLocalX) < 12 && Math.abs(localY - rotHandleLocalY) < 12) {
                    resizingHandle = 'rotate';
                    startX = pos.x; startY = pos.y;
                    return;
                }

                // 8 handles in local space — skip for path/polyarrow
                if (s.type !== 'path' && s.type !== 'polyarrow') {
                const handleDefs = [
                    {name: 'tl', hx: -w/2, hy: -h/2},
                    {name: 'tc', hx: 0,    hy: -h/2},
                    {name: 'tr', hx: w/2,  hy: -h/2},
                    {name: 'ml', hx: -w/2, hy: 0},
                    {name: 'mr', hx: w/2,  hy: 0},
                    {name: 'bl', hx: -w/2, hy: h/2},
                    {name: 'bc', hx: 0,    hy: h/2},
                    {name: 'br', hx: w/2,  hy: h/2}
                ];

                for (const hd of handleDefs) {
                    if (Math.abs(localX - hd.hx) < 8 && Math.abs(localY - hd.hy) < 8) {
                        resizingHandle = hd.name;
                        startX = pos.x; startY = pos.y;
                        return;
                    }
                }
                } // end skip for path/polyarrow
            }
            
            // Check canvas resize handle first
            if (canvasSelected && !activeVectorShape) {
                const hx = canvas.width - 1, hy = canvas.height - 1;
                if (Math.abs(pos.x - hx) < 12 && Math.abs(pos.y - hy) < 12) {
                    isResizingCanvas = true;
                    canvasResizeStartX = pos.x;
                    canvasResizeStartY = pos.y;
                    canvasResizeOrigW = canvas.width;
                    canvasResizeOrigH = canvas.height;
                    canvas.style.cursor = 'nwse-resize';
                    return;
                }
            }
            
            // Check vector shapes (hit test in local rotated space)
            let hitShape = null;
            for(let i = vectorShapes.length - 1; i >= 0; i--) {
                let s = vectorShapes[i];
                let cx = s.x + (s.x2 - s.x) / 2;
                let cy = s.y + (s.y2 - s.y) / 2;
                let w = Math.abs(s.x2 - s.x);
                let h = Math.abs(s.y2 - s.y);
                let srot = (s.rotation || 0) * Math.PI / 180;
                
                // Transform mouse to local space of this shape
                let sdx = pos.x - cx;
                let sdy = pos.y - cy;
                let scosR = Math.cos(-srot);
                let ssinR = Math.sin(-srot);
                let slocalX = sdx * scosR - sdy * ssinR;
                let slocalY = sdx * ssinR + sdy * scosR;
                
                let p = (s.strokeWidth || 0) / 2 + 5;
                let hw = w / 2 + p;
                let hh = h / 2 + p;
                if (s.type === 'circle' || s.type === 'ellipse') {
                    let r = Math.max(w, h) / 2 + p;
                    hw = r; hh = r;
                }
                if (Math.abs(slocalX) <= hw && Math.abs(slocalY) <= hh) {
                    hitShape = s;
                    break;
                }
            }
            
            if (hitShape && e.altKey && activeVectorShape) {
                // Alt+Click: select the next object underneath at this position
                canvasSelected = false;
                const allHits = [];
                for (let i = vectorShapes.length - 1; i >= 0; i--) {
                    const sh = vectorShapes[i];
                    const shcx = sh.x + (sh.x2 - sh.x) / 2;
                    const shcy = sh.y + (sh.y2 - sh.y) / 2;
                    const shw = Math.abs(sh.x2 - sh.x);
                    const shh = Math.abs(sh.y2 - sh.y);
                    const shrot = (sh.rotation || 0) * Math.PI / 180;
                    const shdx = pos.x - shcx, shdy = pos.y - shcy;
                    const shcos = Math.cos(-shrot), shsin = Math.sin(-shrot);
                    const shlx = shdx * shcos - shdy * shsin;
                    const shly = shdx * shsin + shdy * shcos;
                    const shp = (sh.strokeWidth || 0) / 2 + 5;
                    if (Math.abs(shlx) <= shw / 2 + shp && Math.abs(shly) <= shh / 2 + shp) allHits.push(sh);
                }
                if (allHits.length > 1) {
                    const curIdx = allHits.indexOf(activeVectorShape);
                    const nextIdx = (curIdx + 1) % allHits.length;
                    activeVectorShape = allHits[nextIdx];
                } else {
                    activeVectorShape = hitShape;
                }
                selection = null;
                drawSelectionOverlay();
                return;
                }
                if (hitShape) {
                canvasSelected = false;
                // If we're in control point editing mode on the active shape,
                // clicking the shape body should not start a move - only handles work
                if (hitShape === activeVectorShape && activeVectorShape.originalPoints && activeVectorShape.originalPoints.length > 1) {
                    // Allow move if not near a control point (control points checked above)
                    // Shift+drag = duplicate the object and drag the clone
                    if (isShiftDown) {
                        const dupe = cloneShape(hitShape);
                        vectorShapes.push(dupe);
                        activeVectorShape = dupe;
                    } else {
                        activeVectorShape = hitShape;
                    }
                    resizingHandle = 'move';
                    startX = pos.x; startY = pos.y;
                    drawSelectionOverlay();
                    return;
                }
                // Shift+drag = duplicate the object and drag the clone
                if (isShiftDown) {
                    const dupe = cloneShape(hitShape);
                    vectorShapes.push(dupe);
                    activeVectorShape = dupe;
                } else {
                    activeVectorShape = hitShape;
                }
                resizingHandle = 'move';
                startX = pos.x; startY = pos.y;
                selection = null; // drop raster selection
                drawSelectionOverlay();
                return;
            }
            
            
            activeVectorShape = null;
            canvasSelected = true;
            // Hide object buttons, show canvas context
            container.querySelector('#is-ctx-del').style.display = 'none';
            container.querySelector('#is-ctx-del-divider').style.display = 'none';
            container.querySelector('#is-ctx-front').style.display = 'none';
            container.querySelector('#is-obj-copy').style.display = 'none';
            container.querySelector('#is-obj-flatten').style.display = 'none';
            container.querySelector('#is-ctx-back').style.display = 'none';
            container.querySelector('#is-obj-remove-bg').style.display = 'none';
            container.querySelector('#is-obj-smart-remove').style.display = 'none';
            container.querySelector('#is-polyarrow-opts').style.display = 'none';
            const allSpans = ['is-ctx-text','is-ctx-shape','is-ctx-brush','is-ctx-eraser','is-ctx-fill','is-ctx-crop','is-ctx-select','is-ctx-region-actions'];
            allSpans.forEach(id => container.querySelector('#'+id).style.display = 'none');
            container.querySelector('#is-ctx-select').style.display = 'contents';
            container.querySelector('#is-obj-type-info').innerHTML = '<span style="color:#aaa; font-weight:500;">Background Canvas</span> <span style="color:#555">|</span> <span style="color:#888;">' + canvas.width + ' × ' + canvas.height + ' px</span>';
            container.querySelector('#is-obj-type-info').style.display = 'flex';
            contextBar.style.display = 'flex';
            drawSelectionOverlay();
            return;
        }
        
        canvasSelected = false;
        // REGION SELECT tool
        if (currentTool === 'region') {
            // Commit any existing floating selection
            if (selection && selection.isFloating) {
                ctx.putImageData(selection.imgData, selection.x, selection.y);
                selection = null;
                saveState();
            }
            selection = null;
            activeVectorShape = null;
            isDrawing = true;
            startX = pos.x;
            startY = pos.y;
            return;
        }

        // Polyline arrow tools: click to add points
        if (currentTool === 'polyarrow') {
            // Check for snap to shape connection point
            const snap = findNearestSnapPoint(pos, [], 20);
            const pt = snap ? { x: snap.x, y: snap.y } : { x: pos.x, y: pos.y };
            
            // Store snap info for connections
            if (currentPolyPoints.length === 0 && snap) {
                // First point snaps — remember start connection
                currentPolyPoints._startSnap = snap;
            }
            
            currentPolyPoints.push(pt);
            isDrawing = false;
            
            // If snapping to a point and we already have at least 2 points, auto-finish
            if (snap && currentPolyPoints.length >= 2) {
                currentPolyPoints._endSnap = snap;
                finalizePolyArrow();
                return;
            }
            
            // Live preview
            drawSelectionOverlay();
            if (currentPolyPoints.length > 1) {
                const shapeColor = window._isGetCVal('#is-shape-color');
                const shapeStroke = parseInt(container.querySelector('#is-shape-stroke').value) || 5;
                drawShape(octx, {
                    type: currentTool,
                    points: currentPolyPoints.slice(),
                    x: 0, y: 0, x2: 0, y2: 0,
                    stroke: shapeColor,
                    strokeWidth: shapeStroke
                });
            }
            // Show floating tooltip hint
            setCanvasTooltip("Click to add points &nbsp;·&nbsp; <b style='color:#60a5fa;'>Space</b> to finish &nbsp;·&nbsp; <b style='color:#f87171;'>Esc</b> to cancel");
            return;
        }

        isDrawing = true;
        startX = pos.x;
        startY = pos.y;

        if (currentTool === 'text') {
            isDrawing = false;
            
            // Don't create new input if one already exists
            if (canvasWrapper.querySelector('.is-text-input')) return;
            
            // Read text format toolbar values
            const fontFamily = container.querySelector('#is-font-family').value;
            const fontSize = parseInt(container.querySelector('#is-font-size').value) || 48;
            const isBold = container.querySelector('#is-font-bold').classList.contains('active');
            const isItalic = container.querySelector('#is-font-italic').classList.contains('active');
            const isUnderline = container.querySelector('#is-font-underline').classList.contains('active');
            
            const input = document.createElement('div');
            input.className = 'is-text-input';
            input.contentEditable = true;
            input.style.position = 'absolute';
            input.style.left = startX + 'px';
            input.style.top = startY + 'px';
            input.style.color = window._isGetCVal('#is-text-color');
            input.style.fontSize = fontSize + 'px';
            input.style.fontFamily = fontFamily;
            input.style.fontWeight = isBold ? 'bold' : 'normal';
            input.style.fontStyle = isItalic ? 'italic' : 'normal';
            input.style.textDecoration = isUnderline ? 'underline' : 'none';
            input.style.lineHeight = '1';
            input.style.background = getContrastBackground(input.style.color);
            input.style.outline = '2px dashed rgba(0,0,0,0.5)';
            input.style.outlineOffset = '2px';
            input.style.minWidth = '20px';
            input.style.minHeight = '1em';
            input.style.padding = '2px 4px';
            input.style.margin = '-2px -4px'; // offset padding
            input.style.whiteSpace = 'pre';
            input.style.zIndex = '1000';
            input.style.cursor = 'text';
            input.style.background = 'transparent';
            
            canvasWrapper.appendChild(input);
            // Use setTimeout to avoid immediate blur from the same mousedown
            setTimeout(() => input.focus(), 0);
            
            const commitText = () => {
                const txt = input.innerText.trim();
                input.remove();
                if (txt) {
                    let fontStr = '';
                    if (isItalic) fontStr += 'italic ';
                    if (isBold) fontStr += 'bold ';
                    ctx.font = `${fontStr}${fontSize}px "${fontFamily}", sans-serif`;
                    const metrics = ctx.measureText(txt);
                    const w = metrics.width;
                    const h = fontSize;
                    
                    vectorShapes.push({
                        type: 'text',
                        text: txt,
                        x: startX,
                        y: startY,
                        x2: startX + w,
                        y2: startY + h,
                        strokeWidth: 0,
                        stroke: window._isGetCVal('#is-text-color'),
                        fontSize: fontSize,
                        fontFamily: fontFamily,
                        fontBold: isBold,
                        fontItalic: isItalic,
                        fontUnderline: isUnderline,
                        textStyle: container.querySelector('#is-text-render-style').value,
                        textBgColor: window._isGetCVal('#is-text-bg-color'),
                        rotation: 0, flipH: false, flipV: false
                    });
                    activeVectorShape = vectorShapes[vectorShapes.length - 1];
                    currentTool = 'select';
                    tools.forEach(t => t.classList.toggle('active', t.getAttribute('data-tool') === 'select'));
                    canvas.style.cursor = 'default';
                    drawSelectionOverlay();
                    saveState();
                }
            };
            
            input.addEventListener('blur', commitText);
            
            input.addEventListener('keydown', (ke) => {
                ke.stopPropagation(); // prevent space/other keys from triggering canvas shortcuts
                if (ke.key === 'Escape') {
                    ke.preventDefault();
                    input.innerText = ''; // discard
                    input.blur();
                } else if (ke.key === 'Enter' && !ke.shiftKey) {
                    ke.preventDefault();
                    input.blur(); // confirm
                }
            });
            return;
        }
        
        // Fill tool (paint bucket)
        if (currentTool === 'fill') {
            isDrawing = false;
            const fillColor = window._isGetCVal('#is-fill-color');
            const tolerance = parseInt(container.querySelector('#is-fill-tolerance').value) || 32;
            floodFill(Math.round(pos.x), Math.round(pos.y), fillColor, tolerance);
            saveState();
            return;
        }
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = lineWidthSlider.value;
        ctx.strokeStyle = currentTool === 'eraser' ? '#ffffff' : colorPicker.value;
        if (currentTool === 'brush') {
            ctx.globalAlpha = (parseInt(container.querySelector('#is-global-opacity').value) || 100) / 100;
            currentPathPoints = [{x: startX, y: startY}];
        } else {
            ctx.globalAlpha = 1;
            currentPathPoints = [];
        }

        octx.lineCap = 'round';
        octx.lineJoin = 'round';
        octx.lineWidth = lineWidthSlider.value;
        octx.strokeStyle = colorPicker.value;
    });

    window.addEventListener('mousemove', (e) => {
        if (e.button === 1 || isSpaceDown || isPanning) return;
        if (currentTool === 'smartremove') return;
        const pos = getMousePos(e);

        if (currentTool === 'select') {
            // Canvas resize dragging
            if (isResizingCanvas) {
                const newW = Math.max(50, Math.round(canvasResizeOrigW + (pos.x - canvasResizeStartX)));
                const newH = Math.max(50, Math.round(canvasResizeOrigH + (pos.y - canvasResizeStartY)));
                // Real-time canvas resize preview
                if (newW !== canvas.width || newH !== canvas.height) {
                    const tempCanvas = document.createElement('canvas');
                    tempCanvas.width = canvas.width;
                    tempCanvas.height = canvas.height;
                    tempCanvas.getContext('2d').drawImage(canvas, 0, 0);
                    canvas.width = newW;
                    canvas.height = newH;
                    overlay.width = newW;
                    overlay.height = newH;
                    ctx.fillStyle = canvasBgColor;
                    ctx.fillRect(0, 0, newW, newH);
                    ctx.drawImage(tempCanvas, 0, 0);
                    sizeInfo.innerText = newW + ' x ' + newH;
                }
                drawSelectionOverlay();
                // Show size label on overlay
                octx.fillStyle = 'rgba(0,0,0,0.75)';
                const labelW = 90, labelH = 22;
                octx.fillRect(newW - labelW - 8, newH - labelH - 8, labelW, labelH);
                octx.fillStyle = '#fff';
                octx.font = '12px system-ui, sans-serif';
                octx.textBaseline = 'middle';
                octx.fillText(newW + ' × ' + newH, newW - labelW - 3, newH - labelH + 3);
                return;
            }
            // Handle control point dragging
            if (activeVectorShape && draggingControlPointIdx >= 0 && activeVectorShape.originalPoints) {
                let currentPos = { x: pos.x, y: pos.y };
                
                // Only snap first and last points
                if (draggingControlPointIdx === 0 || draggingControlPointIdx === activeVectorShape.originalPoints.length - 1) {
                    const snap = findNearestSnapPoint(pos, [activeVectorShape.id], 20);
                    if (snap) {
                        currentPos.x = snap.x;
                        currentPos.y = snap.y;
                    }
                    
                    if (!activeVectorShape.connections) activeVectorShape.connections = {};
                    if (draggingControlPointIdx === 0) {
                        activeVectorShape.connections.start = snap || null;
                    } else {
                        activeVectorShape.connections.end = snap || null;
                    }
                }

                const cp = activeVectorShape.originalPoints[draggingControlPointIdx];
                cp.x = currentPos.x;
                cp.y = currentPos.y;
                // Recalculate bounding box
                let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
                activeVectorShape.originalPoints.forEach(p => {
                    if (p.x < minX) minX = p.x;
                    if (p.y < minY) minY = p.y;
                    if (p.x > maxX) maxX = p.x;
                    if (p.y > maxY) maxY = p.y;
                });
                const sw = activeVectorShape.strokeWidth || 5;
                activeVectorShape.x = minX - sw;
                activeVectorShape.y = minY - sw;
                activeVectorShape.x2 = maxX + sw;
                activeVectorShape.y2 = maxY + sw;
                // Re-apply smooth
                if (activeVectorShape.smoothLevel) {
                    applySmoothToShape(activeVectorShape, activeVectorShape.smoothLevel);
                }
                drawSelectionOverlay();

                // Draw visual snap indicators if snapping start/end points
                if (draggingControlPointIdx === 0 || draggingControlPointIdx === activeVectorShape.originalPoints.length - 1) {
                    for (const s of vectorShapes) {
                        if (s.type === 'polyarrow' || s.type === 'path' || !s.id || s.id === activeVectorShape.id) continue;
                        const pts = getSnapPoints(s);
                        let anyNear = false;
                        for (const p of pts) {
                            if (Math.hypot(pos.x - p.x, pos.y - p.y) < 40) { anyNear = true; break; }
                        }
                        if (!anyNear) continue;
                        for (const p of pts) {
                            const d = Math.hypot(pos.x - p.x, pos.y - p.y);
                            octx.beginPath();
                            octx.arc(p.x, p.y, d < 20 ? 6 : 4, 0, Math.PI * 2);
                            octx.fillStyle = d < 20 ? '#22c55e' : 'rgba(100,200,255,0.6)';
                            octx.fill();
                            octx.strokeStyle = '#fff';
                            octx.lineWidth = 1.5;
                            octx.stroke();
                        }
                    }
                }
                return;
            }
            if (activeVectorShape && resizingHandle) {
                const dx = pos.x - startX;
                const dy = pos.y - startY;
                if (resizingHandle === 'rotate') {
                    // Calculate rotation angle from center of shape to mouse
                    const s = activeVectorShape;
                    let scx = s.x + (s.x2 - s.x) / 2;
                    let scy = s.y + (s.y2 - s.y) / 2;
                    const angle = Math.atan2(pos.x - scx, -(pos.y - scy));
                    activeVectorShape.rotation = Math.round(angle * 180 / Math.PI);
                    startX = pos.x; startY = pos.y;
                    drawSelectionOverlay();
                    return;
                } else if (resizingHandle === 'move') {
                    activeVectorShape.x += dx;
                    activeVectorShape.x2 += dx;
                    activeVectorShape.y += dy;
                    activeVectorShape.y2 += dy;
                    // For polyarrow/path with smooth: shift originalPoints then regenerate smooth
                    // For polyarrow/path without smooth: shift both points arrays
                    if (activeVectorShape.originalPoints) {
                        activeVectorShape.originalPoints.forEach(p => { p.x += dx; p.y += dy; });
                    }
                    if (activeVectorShape.smoothLevel && activeVectorShape.originalPoints) {
                        // Regenerate smooth points from shifted originalPoints
                        // This guarantees curve always matches control points
                        applySmoothToShape(activeVectorShape, activeVectorShape.smoothLevel);
                    } else if (activeVectorShape.points) {
                        activeVectorShape.points.forEach(p => { p.x += dx; p.y += dy; });
                    }
                    // Clear connections when moving the arrow itself (endpoints move with it)
                    if (activeVectorShape.connections) {
                        activeVectorShape.connections = null;
                    }
                } else if (resizingHandle === 'tl') {
                    if (isShiftDown) {
                        const ar = Math.abs(activeVectorShape.x2 - activeVectorShape.x) / (Math.abs(activeVectorShape.y2 - activeVectorShape.y) || 1);
                        activeVectorShape.x += dx;
                        activeVectorShape.y += dx / ar * Math.sign(dy || 1);
                    } else {
                        activeVectorShape.x += dx;
                    activeVectorShape.y += dy;
                    }
                } else if (resizingHandle === 'tc') {
                    activeVectorShape.y += dy;
                } else if (resizingHandle === 'tr') {
                    if (isShiftDown) {
                        const ar = Math.abs(activeVectorShape.x2 - activeVectorShape.x) / (Math.abs(activeVectorShape.y2 - activeVectorShape.y) || 1);
                        activeVectorShape.x2 += dx;
                        activeVectorShape.y += -dx / ar * Math.sign(dy || -1);
                    } else {
                        activeVectorShape.x2 += dx;
                    activeVectorShape.y += dy;
                    }
                } else if (resizingHandle === 'ml') {
                    activeVectorShape.x += dx;
                } else if (resizingHandle === 'mr') {
                    activeVectorShape.x2 += dx;
                } else if (resizingHandle === 'bl') {
                    if (isShiftDown) {
                        const ar = Math.abs(activeVectorShape.x2 - activeVectorShape.x) / (Math.abs(activeVectorShape.y2 - activeVectorShape.y) || 1);
                        activeVectorShape.x += dx;
                        activeVectorShape.y2 += -dx / ar * Math.sign(dy || 1);
                    } else {
                        activeVectorShape.x += dx;
                    activeVectorShape.y2 += dy;
                    }
                } else if (resizingHandle === 'bc') {
                    activeVectorShape.y2 += dy;
                } else if (resizingHandle === 'br') {
                    if (isShiftDown) {
                        const ar = Math.abs(activeVectorShape.x2 - activeVectorShape.x) / (Math.abs(activeVectorShape.y2 - activeVectorShape.y) || 1);
                        activeVectorShape.x2 += dx;
                        activeVectorShape.y2 += dx / ar * Math.sign(dy || 1);
                    } else {
                        activeVectorShape.x2 += dx;
                    activeVectorShape.y2 += dy;
                    }
                }
                startX = pos.x; startY = pos.y;
                updateConnections();
                drawSelectionOverlay();
                return;
            }

            if (isDrawing) {
                octx.clearRect(0, 0, overlay.width, overlay.height);
                vectorShapes.forEach(s => drawShape(octx, s));
                octx.strokeStyle = '#3b82f6';
                octx.setLineDash([5, 5]);
                octx.strokeRect(startX, startY, pos.x - startX, pos.y - startY);
                octx.setLineDash([]);
            } else if (canvasSelected && !activeVectorShape && !isDrawing) {
                // Canvas resize handle hover
                const chx = canvas.width - 1, chy = canvas.height - 1;
                if (Math.abs(pos.x - chx) < 12 && Math.abs(pos.y - chy) < 12) {
                    canvas.style.cursor = 'nwse-resize';
                } else {
                    canvas.style.cursor = 'default';
                }
            } else if (activeVectorShape && !resizingHandle) {
                // Change cursor when hovering over handles (in local rotated space)
                const s = activeVectorShape;
                let scx = s.x + (s.x2 - s.x) / 2;
                let scy = s.y + (s.y2 - s.y) / 2;
                let sw = Math.abs(s.x2 - s.x);
                let sh = Math.abs(s.y2 - s.y);
                let srot = (s.rotation || 0) * Math.PI / 180;
                
                // Transform to local space
                let sdx = pos.x - scx;
                let sdy = pos.y - scy;
                let scosR = Math.cos(-srot);
                let ssinR = Math.sin(-srot);
                let localX = sdx * scosR - sdy * ssinR;
                let localY = sdx * ssinR + sdy * scosR;
                
                const cursorMap = {
                    tl: 'nwse-resize', tc: 'ns-resize', tr: 'nesw-resize',
                    ml: 'ew-resize', mr: 'ew-resize',
                    bl: 'nesw-resize', bc: 'ns-resize', br: 'nwse-resize'
                };
                const hoverHandles = [
                    {name: 'tl', hx: -sw/2, hy: -sh/2}, {name: 'tc', hx: 0, hy: -sh/2}, {name: 'tr', hx: sw/2, hy: -sh/2},
                    {name: 'ml', hx: -sw/2, hy: 0}, {name: 'mr', hx: sw/2, hy: 0},
                    {name: 'bl', hx: -sw/2, hy: sh/2}, {name: 'bc', hx: 0, hy: sh/2}, {name: 'br', hx: sw/2, hy: sh/2}
                ];
                let foundCursor = false;
                
                // Check rotation handle hover (local space)
                if (Math.abs(localX) < 12 && Math.abs(localY - (-sh/2 - 28)) < 12) {
                    canvas.style.cursor = 'grab';
                    foundCursor = true;
                }
                if (!foundCursor && s.type !== 'path' && s.type !== 'polyarrow') {
                    for (const hd of hoverHandles) {
                        if (Math.abs(localX - hd.hx) < 8 && Math.abs(localY - hd.hy) < 8) {
                            canvas.style.cursor = cursorMap[hd.name];
                            foundCursor = true;
                            break;
                        }
                    }
                }
                // Check if hovering body of shape for move cursor
                if (!foundCursor) {
                    let p = (s.strokeWidth || 0) / 2 + 5;
                    if (Math.abs(localX) <= sw/2 + p && Math.abs(localY) <= sh/2 + p) {
                        canvas.style.cursor = 'move';
                    } else {
                        canvas.style.cursor = 'default';
                    }
                }
            }
            return;
        }

        if (!isDrawing) {
            if (currentTool === 'brush' || currentTool === 'eraser') {
                drawSelectionOverlay();
                const lw = parseInt(lineWidthSlider.value);
                octx.beginPath();
                octx.arc(pos.x, pos.y, lw / 2, 0, Math.PI * 2);
                octx.strokeStyle = '#000';
                octx.lineWidth = 1;
                octx.stroke();
                octx.beginPath();
                octx.arc(pos.x, pos.y, lw / 2 - 1, 0, Math.PI * 2);
                octx.strokeStyle = '#fff';
                octx.lineWidth = 1;
                octx.stroke();
            } else if (['polyarrow', 'rect', 'circle', 'ellipse', 'triangle', 'diamond', 'parallelogram', 'pentagon', 'hexagon', 'star', 'crop', 'text'].includes(currentTool)) {
                // Draw a custom crosshair cursor on overlay
                drawSelectionOverlay();
                octx.strokeStyle = '#000';
                octx.lineWidth = 1;
                octx.beginPath();
                octx.moveTo(pos.x - 10, pos.y);
                octx.lineTo(pos.x + 10, pos.y);
                octx.moveTo(pos.x, pos.y - 10);
                octx.lineTo(pos.x, pos.y + 10);
                octx.stroke();
                octx.strokeStyle = '#fff';
                octx.lineWidth = 1;
                octx.beginPath();
                octx.moveTo(pos.x - 9, pos.y - 1);
                octx.lineTo(pos.x + 9, pos.y - 1);
                octx.moveTo(pos.x - 1, pos.y - 9);
                octx.lineTo(pos.x - 1, pos.y + 9);
                octx.stroke();
                // Live preview for polyarrow: show existing path + rubber-band to cursor
                if (currentTool === 'polyarrow' && currentPolyPoints.length > 0) {
                    const shapeColor = window._isGetCVal('#is-shape-color');
                    const shapeStroke = parseInt(container.querySelector('#is-shape-stroke').value) || 5;
                    // Draw existing segments
                    if (currentPolyPoints.length > 1) {
                        drawShape(octx, {
                            type: currentTool,
                            points: currentPolyPoints.slice(),
                            x: 0, y: 0, x2: 0, y2: 0,
                            stroke: shapeColor,
                            strokeWidth: shapeStroke
                        });
                    }
                    // Rubber-band line from last point to cursor
                    octx.setLineDash([6, 4]);
                    octx.strokeStyle = shapeColor;
                    octx.lineWidth = shapeStroke;
                    octx.globalAlpha = 0.5;
                    octx.beginPath();
                    const last = currentPolyPoints[currentPolyPoints.length - 1];
                    octx.moveTo(last.x, last.y);
                    let lineEndX = pos.x, lineEndY = pos.y;
                    if (isShiftDown) {
                        const adx = Math.abs(pos.x - last.x), ady = Math.abs(pos.y - last.y);
                        if (adx > ady * 2) { lineEndY = last.y; }
                        else if (ady > adx * 2) { lineEndX = last.x; }
                        else { const d = Math.max(adx, ady); lineEndX = last.x + d * Math.sign(pos.x - last.x || 1); lineEndY = last.y + d * Math.sign(pos.y - last.y || 1); }
                    }
                    octx.lineTo(lineEndX, lineEndY);
                    octx.stroke();
                    octx.setLineDash([]);
                    octx.globalAlpha = 1;
                    
                    // Show snap points on nearby shapes
                    for (const s of vectorShapes) {
                        if (s.type === 'polyarrow' || s.type === 'path' || !s.id) continue;
                        const pts = getSnapPoints(s);
                        let anyNear = false;
                        for (const p of pts) {
                            if (Math.hypot(pos.x - p.x, pos.y - p.y) < 40) { anyNear = true; break; }
                        }
                        if (!anyNear) continue;
                        for (const p of pts) {
                            const d = Math.hypot(pos.x - p.x, pos.y - p.y);
                            octx.beginPath();
                            octx.arc(p.x, p.y, d < 20 ? 6 : 4, 0, Math.PI * 2);
                            octx.fillStyle = d < 20 ? '#22c55e' : 'rgba(100,200,255,0.6)';
                            octx.fill();
                            octx.strokeStyle = '#fff';
                            octx.lineWidth = 1.5;
                            octx.stroke();
                        }
                    }
                }
            }
            return;
        }

        if (currentTool === 'region') {
            octx.clearRect(0, 0, overlay.width, overlay.height);
            vectorShapes.forEach(s => drawShape(octx, s));
            octx.fillStyle = 'rgba(0,0,0,0.4)';
            octx.fillRect(0, 0, overlay.width, overlay.height);
            const rx = Math.min(startX, pos.x);
            const ry = Math.min(startY, pos.y);
            const rw = Math.abs(pos.x - startX);
            const rh = Math.abs(pos.y - startY);
            octx.clearRect(rx, ry, rw, rh);
            octx.strokeStyle = '#fff';
            octx.setLineDash([5, 5]);
            octx.strokeRect(rx, ry, rw, rh);
            octx.setLineDash([]);
            // Show size info
            octx.fillStyle = 'rgba(0,0,0,0.7)';
            octx.fillRect(rx, ry + rh + 4, 80, 18);
            octx.fillStyle = '#fff';
            octx.font = '11px Arial';
            octx.textBaseline = 'top';
            octx.fillText(`${Math.round(rw)} × ${Math.round(rh)}`, rx + 4, ry + rh + 7);
            return;
        }

        if (currentTool === 'brush' || currentTool === 'eraser') {
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
            if (currentTool === 'brush') currentPathPoints.push({x: pos.x, y: pos.y});
            // Redraw cursor on overlay while drawing
            drawSelectionOverlay();
            const lw = parseInt(lineWidthSlider.value);
            octx.beginPath();
            octx.arc(pos.x, pos.y, lw / 2, 0, Math.PI * 2);
            octx.strokeStyle = '#000';
            octx.lineWidth = 1;
            octx.stroke();
            octx.beginPath();
            octx.arc(pos.x, pos.y, lw / 2 - 1, 0, Math.PI * 2);
            octx.strokeStyle = '#fff';
            octx.lineWidth = 1;
            octx.stroke();
        } else if (['rect', 'circle', 'ellipse', 'triangle', 'diamond', 'parallelogram', 'pentagon', 'hexagon', 'star'].includes(currentTool)) {
            const shapeColor = window._isGetCVal('#is-shape-color');
            const shapeStroke = parseInt(container.querySelector('#is-shape-stroke').value) || 5;
            const fillColor = window._isGetCVal('#is-shape-fill-color');
            let drawX2 = pos.x, drawY2 = pos.y;
            if (isShiftDown) {
                const side = Math.max(Math.abs(pos.x - startX), Math.abs(pos.y - startY));
                drawX2 = startX + side * Math.sign(pos.x - startX || 1);
                drawY2 = startY + side * Math.sign(pos.y - startY || 1);
            }
            drawSelectionOverlay();
            drawShape(octx, {
                type: currentTool,
                x: startX, y: startY, x2: drawX2, y2: drawY2,
                stroke: shapeColor,
                strokeWidth: shapeStroke,
                fill: (fillColor && fillColor !== 'transparent') ? fillColor : null
            });
        }
    });

    // Finalize polyarrow shape (shared logic)
    function finalizePolyArrow() {
        if (currentTool !== 'polyarrow' || currentPolyPoints.length < 2) return;
        const shapeColor = window._isGetCVal('#is-shape-color');
        const shapeStroke = parseInt(container.querySelector('#is-shape-stroke').value) || 5;
        const fillColor = window._isGetCVal('#is-shape-fill-color');
        
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        currentPolyPoints.forEach(p => {
            if (p.x < minX) minX = p.x;
            if (p.y < minY) minY = p.y;
            if (p.x > maxX) maxX = p.x;
            if (p.y > maxY) maxY = p.y;
        });

        // Force default mode to none (normal line) on creation
        const arrowMode = 'none';
        container.querySelectorAll('.is-arrow-mode').forEach(b => b.classList.toggle('active', b.getAttribute('data-mode') === 'none'));
        
        const lineStyle = container.querySelector('#is-line-style').value;
        const arrowHead = container.querySelector('#is-arrowhead-style').value;
        
        vectorShapes.push({
            id: nextShapeId(),
            type: currentTool,
            points: currentPolyPoints.map(p => ({ x: p.x, y: p.y })),
            originalPoints: currentPolyPoints.map(p => ({ x: p.x, y: p.y })),
            x: minX - shapeStroke, y: minY - shapeStroke,
            x2: maxX + shapeStroke, y2: maxY + shapeStroke,
            stroke: shapeColor,
            strokeWidth: shapeStroke,
            rotation: 0, flipH: false, flipV: false,
            arrowMode: arrowMode,
            lineStyle: lineStyle,
            arrowHead: arrowHead,
            connections: {
                start: currentPolyPoints._startSnap || null,
                end: currentPolyPoints._endSnap || null
            }
        });
        activeVectorShape = vectorShapes[vectorShapes.length - 1];
        currentPolyPoints = [];
        // Remove tooltip
        hideCanvasTooltip();
        currentTool = 'select';
        tools.forEach(t => t.classList.toggle('active', t.getAttribute('data-tool') === 'select'));
        canvas.style.cursor = 'default';
        drawSelectionOverlay();
        saveState();
    }
    
    // Space to finish polyarrow, Escape to cancel
    document.addEventListener('keydown', (e) => {
        if (!container.querySelector('#is-canvas')) return;
        if (currentTool === 'polyarrow') {
            if (e.key === ' ' || e.code === 'Space') {
                e.preventDefault();
                finalizePolyArrow();
            } else if (e.key === 'Escape' && currentPolyPoints.length > 0) {
                currentPolyPoints = [];
                hideCanvasTooltip();
                drawSelectionOverlay();
            }
        }
    });

    // Double-click to edit text shapes
    canvas.addEventListener('dblclick', (e) => {
        if (currentTool !== 'select') return;
        const pos = getMousePos(e);
        
        // Find text shape under cursor
        for (let i = vectorShapes.length - 1; i >= 0; i--) {
            let s = vectorShapes[i];
            if (s.type !== 'text') continue;
            let cx = s.x + (s.x2 - s.x) / 2;
            let cy = s.y + (s.y2 - s.y) / 2;
            let w = Math.abs(s.x2 - s.x);
            let h = Math.abs(s.y2 - s.y);
            let srot = (s.rotation || 0) * Math.PI / 180;
            let sdx = pos.x - cx;
            let sdy = pos.y - cy;
            let scosR = Math.cos(-srot);
            let ssinR = Math.sin(-srot);
            let slocalX = sdx * scosR - sdy * ssinR;
            let slocalY = sdx * ssinR + sdy * scosR;
            
            if (Math.abs(slocalX) <= w/2 + 10 && Math.abs(slocalY) <= h/2 + 10) {
                // Open inline editor for this text shape
                if (canvasWrapper.querySelector('.is-text-input')) return;
                
                activeVectorShape = s;
                const input = document.createElement('div');
                input.className = 'is-text-input';
                input.contentEditable = true;
                input.innerText = s.text;
                input.style.position = 'absolute';
                input.style.left = s.x + 'px';
                input.style.top = s.y + 'px';
                input.style.color = s.stroke;
                input.style.fontSize = s.fontSize + 'px';
                input.style.fontFamily = s.fontFamily || 'Arial';
                input.style.fontWeight = s.fontBold ? 'bold' : 'normal';
                input.style.fontStyle = s.fontItalic ? 'italic' : 'normal';
                input.style.textDecoration = s.fontUnderline ? 'underline' : 'none';
                input.style.lineHeight = '1';
                input.style.background = getContrastBackground(input.style.color);
                input.style.outline = '2px dashed rgba(0,0,0,0.5)';
                input.style.outlineOffset = '2px';
                input.style.minWidth = '20px';
                input.style.minHeight = '1em';
                input.style.padding = '2px 4px';
                input.style.margin = '-2px -4px';
                input.style.whiteSpace = 'pre';
                input.style.zIndex = '1000';
                input.style.cursor = 'text';
                input.style.background = 'rgba(255,255,255,0.9)';
                
                // Hide the shape while editing
                const shapeIdx = vectorShapes.indexOf(s);
                const origShape = { ...s };
                
                canvasWrapper.appendChild(input);
                setTimeout(() => {
                    input.focus();
                    // Select all text
                    const range = document.createRange();
                    range.selectNodeContents(input);
                    const sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                }, 0);
                
                const commitEdit = () => {
                    const txt = input.innerText.trim();
                    input.remove();
                    if (txt) {
                        s.text = txt;
                        recalcTextBounds(s);
                    }
                    drawSelectionOverlay();
                    saveState();
                };
                
                input.addEventListener('blur', commitEdit);
                input.addEventListener('keydown', (ke) => {
                    ke.stopPropagation();
                    if (ke.key === 'Escape') {
                        ke.preventDefault();
                        // Restore original text
                        s.text = origShape.text;
                        s.x2 = origShape.x2;
                        s.y2 = origShape.y2;
                        input.remove();
                        input.removeEventListener('blur', commitEdit);
                        drawSelectionOverlay();
                    } else if (ke.key === 'Enter' && !ke.shiftKey) {
                        ke.preventDefault();
                        input.blur();
                    }
                });
                return;
            }
        }
    });

    window.addEventListener('mouseup', (e) => {
        if (currentTool === 'smartremove') return;
        if (e.button === 1 || isSpaceDown) return;
        const pos = getMousePos(e);

        if (currentTool === 'select') {
            if (isResizingCanvas) {
                isResizingCanvas = false;
                canvas.style.cursor = 'default';
                const newW = Math.max(50, Math.round(canvasResizeOrigW + (pos.x - canvasResizeStartX)));
                const newH = Math.max(50, Math.round(canvasResizeOrigH + (pos.y - canvasResizeStartY)));
                if (newW !== canvas.width || newH !== canvas.height) {
                    // Save current content
                    const tempCanvas = document.createElement('canvas');
                    tempCanvas.width = canvas.width;
                    tempCanvas.height = canvas.height;
                    tempCanvas.getContext('2d').drawImage(canvas, 0, 0);
                    // Resize canvas
                    canvas.width = newW;
                    canvas.height = newH;
                    overlay.width = newW;
                    overlay.height = newH;
                    // Fill with bg color then paste old content
                    ctx.fillStyle = canvasBgColor;
                    ctx.fillRect(0, 0, newW, newH);
                    ctx.drawImage(tempCanvas, 0, 0);
                    sizeInfo.innerText = newW + ' x ' + newH;
                    container.querySelector('#is-obj-type-info').innerHTML = '<span style="color:#aaa; font-weight:500;">Background Canvas</span> <span style="color:#555">|</span> <span style="color:#888;">' + newW + ' × ' + newH + ' px</span>';
                    saveState();
                }
                drawSelectionOverlay();
                return;
            }
            if (draggingControlPointIdx >= 0) {
                draggingControlPointIdx = -1;
                isDrawing = false;
                saveState();
                return;
            }
            if (resizingHandle) {
                resizingHandle = null;
                isDrawing = false;
                saveState();
                return;
            }
            isDrawing = false;
            return;
        }
        
        // Region select
        if (currentTool === 'region') {
            if (!isDrawing) return;
            isDrawing = false;
            const x = Math.min(startX, pos.x);
            const y = Math.min(startY, pos.y);
            const w = Math.abs(pos.x - startX);
            const h = Math.abs(pos.y - startY);
            if (w > 5 && h > 5) {
                selection = {
                    x: x, y: y, w: w, h: h,
                    isFloating: false,
                    imgData: null
                };
                // Show region actions in context bar
                const allSpans = ['is-ctx-text','is-ctx-shape','is-ctx-brush','is-ctx-eraser','is-ctx-fill','is-ctx-crop','is-ctx-select','is-ctx-region-actions'];
                allSpans.forEach(id => container.querySelector('#'+id).style.display = 'none');
                container.querySelector('#is-ctx-region-actions').style.display = 'contents';
                container.querySelector('#is-region-info').textContent = `${Math.round(w)} × ${Math.round(h)} px`;
                drawSelectionOverlay();
            } else {
                drawSelectionOverlay();
            }
            return;
        }

        if (!isDrawing) return;
        isDrawing = false;
        
        if (currentTool === 'crop') {
            // Crop tool now just shows region hint, actual crop is via region tool
            drawSelectionOverlay();
            return;
        }
        
        if (['rect', 'circle', 'ellipse', 'triangle', 'diamond', 'parallelogram', 'pentagon', 'hexagon', 'star'].includes(currentTool)) {
            const shapeColor = window._isGetCVal('#is-shape-color');
            const shapeStroke = parseInt(container.querySelector('#is-shape-stroke').value) || 5;
            const fillColor = window._isGetCVal('#is-shape-fill-color');
            let finalX2 = pos.x, finalY2 = pos.y;
            if (isShiftDown) {
                const side = Math.max(Math.abs(pos.x - startX), Math.abs(pos.y - startY));
                finalX2 = startX + side * Math.sign(pos.x - startX || 1);
                finalY2 = startY + side * Math.sign(pos.y - startY || 1);
            }
            vectorShapes.push({
                id: nextShapeId(),
                type: currentTool,
                x: startX, y: startY, x2: finalX2, y2: finalY2,
                stroke: shapeColor,
                strokeWidth: shapeStroke,
                fill: (fillColor && fillColor !== 'transparent') ? fillColor : null,
                rotation: 0, flipH: false, flipV: false
            });
            activeVectorShape = vectorShapes[vectorShapes.length - 1];
            currentTool = 'select';
            tools.forEach(t => t.classList.toggle('active', t.getAttribute('data-tool') === 'select'));
            canvas.style.cursor = 'default';
            drawSelectionOverlay();
            saveState();
            return;
        }
        
        if (currentTool === 'brush' && currentPathPoints.length > 1) {
            ctx.globalAlpha = 1;
            // Undo the raster drawing - restore from last saved state SYNCHRONOUSLY
            // so that saveState() below captures the correct canvas
            if (historyStep >= 0 && history[historyStep]) {
                const restoreImg = new Image();
                restoreImg.src = history[historyStep].dataURL;
                // dataURL images from the same canvas load synchronously in most browsers,
                // but we must still handle the async case safely.
                if (restoreImg.complete) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(restoreImg, 0, 0);
                } else {
                    // Fallback: schedule the save after the image loads
                    restoreImg.onload = () => {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        ctx.drawImage(restoreImg, 0, 0);
                        saveState();
                    };
                }
            }
            
            // Calculate bounding box from points
            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
            currentPathPoints.forEach(p => {
                if (p.x < minX) minX = p.x;
                if (p.y < minY) minY = p.y;
                if (p.x > maxX) maxX = p.x;
                if (p.y > maxY) maxY = p.y;
            });
            const lw = parseInt(lineWidthSlider.value);
            const opacity = (parseInt(container.querySelector('#is-global-opacity').value) || 100) / 100;
            
            vectorShapes.push({
                type: 'path',
                points: currentPathPoints.slice(),
                x: minX - lw, y: minY - lw,
                x2: maxX + lw, y2: maxY + lw,
                stroke: colorPicker.value,
                strokeWidth: lw,
                opacity: opacity,
                rotation: 0, flipH: false, flipV: false
            });
            activeVectorShape = vectorShapes[vectorShapes.length - 1];
            currentPathPoints = [];
            
            // Show brush context bar with smooth button
            const allSpans = ['is-ctx-text','is-ctx-shape','is-ctx-brush','is-ctx-eraser','is-ctx-fill','is-ctx-crop','is-ctx-select','is-ctx-region-actions'];
            allSpans.forEach(id => container.querySelector('#'+id).style.display = 'none');
            container.querySelector('#is-ctx-brush').style.display = 'contents';
                container.querySelector('#is-global-opacity-divider').style.display = '';
                container.querySelector('#is-global-opacity-label').style.display = '';
                container.querySelector('#is-global-opacity').style.display = '';
                container.querySelector('#is-global-opacity-val').style.display = '';

            container.querySelector('#is-brush-smooth').style.display = 'flex';
            container.querySelector('#is-brush-smooth-divider').style.display = '';
            container.querySelector('#is-smooth-level').style.display = '';
            container.querySelector('#is-smooth-level-label').style.display = '';
            container.querySelector('#is-smooth-level-val').style.display = '';
            container.querySelector('#is-ctx-del').style.display = 'flex';
            container.querySelector('#is-ctx-del-divider').style.display = '';
            container.querySelector('#is-ctx-front').style.display = 'flex';
            container.querySelector('#is-ctx-back').style.display = 'flex';
            contextBar.style.display = 'flex';
            
            drawSelectionOverlay();
            saveState();
            return;
        }
        
        if (currentTool !== 'text') {
            ctx.globalAlpha = 1;
            saveState();
        }
    });
    
    canvas.addEventListener('mouseout', () => {
        if (isDrawing && (currentTool === 'brush' || currentTool === 'eraser')) {
            isDrawing = false;
            saveState();
        }
        drawSelectionOverlay(); // clear the custom cursor
    });

    // Upload
    const uploadBtn = container.querySelector('#is-upload-btn');
    const uploadInput = container.querySelector('#is-upload');
    uploadBtn.addEventListener('click', () => uploadInput.click());
    
    uploadInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                // Resize canvas to fit image exactly
                canvas.width = img.width;
                canvas.height = img.height;
                overlay.width = img.width;
                overlay.height = img.height;
                sizeInfo.innerText = `${img.width} x ${img.height}`;
                
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
                saveState();
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });

    // Paste Image
    document.addEventListener('paste', (e) => {
        if (!document.getElementById('is-canvas')) return;
        const items = (e.clipboardData || e.originalEvent.clipboardData).items;
        let hasImage = false;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                hasImage = true;
                const blob = items[i].getAsFile();
                const reader = new FileReader();
                reader.onload = (event) => {
                    const img = new Image();
                    img.onload = () => {
                        // Scale down to fit canvas if needed (keep aspect ratio)
                        let w = img.width, h = img.height;
                        if (w > canvas.width || h > canvas.height) {
                            const scale = Math.min(canvas.width / w, canvas.height / h);
                            w = Math.round(w * scale);
                            h = Math.round(h * scale);
                        }
                        const obj = {
                            id: nextShapeId(),
                            type: 'image',
                            img: img,
                            x: Math.round(canvas.width/2 - w/2),
                            y: Math.round(canvas.height/2 - h/2),
                            x2: Math.round(canvas.width/2 + w/2),
                            y2: Math.round(canvas.height/2 + h/2),
                            strokeWidth: 0
                        };
                        vectorShapes.push(obj);
                        activeVectorShape = obj;
                        currentTool = 'select';
                        tools.forEach(t => t.classList.toggle('active', t.getAttribute('data-tool') === 'select'));
                        canvas.style.cursor = 'default';
                        drawSelectionOverlay();
                        saveState();
                    };
                    img.src = event.target.result;
                };
                reader.readAsDataURL(blob);
                break;
            }
        }
        
        if (!hasImage && clipboardData) {
            e.preventDefault();
            performPaste();
        }
    });

    // Download
    container.querySelector('#is-download-btn').addEventListener('click', () => {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tctx = tempCanvas.getContext('2d');
        tctx.drawImage(canvas, 0, 0);
        vectorShapes.forEach(s => drawShape(tctx, s));
        
        const link = document.createElement('a');
        link.download = 'worldtools-image.png';
        link.href = tempCanvas.toDataURL('image/png');
        link.click();
    });

    // Clear
    container.querySelector('#is-clear').addEventListener('click', () => {
        if(confirm('Are you sure you want to clear the canvas?')) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            vectorShapes = [];
            activeVectorShape = null;
            selection = null;
            drawSelectionOverlay();
            saveState();
        }
    });
    
    
    // Resize Modal
    container.querySelector('#is-resize-btn').addEventListener('click', () => {
        const origW = canvas.width, origH = canvas.height;
        const aspect = origW / origH;
        let lockAspect = true;
        
        const modal = document.createElement('div');
        modal.style.cssText = 'position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.6);backdrop-filter:blur(4px);';
        modal.innerHTML = `
            <div style="background:#1e1e1e;border:1px solid rgba(255,255,255,0.12);border-radius:12px;padding:28px 32px;width:380px;box-shadow:0 16px 48px rgba(0,0,0,0.6);font-family:system-ui,sans-serif;">
                <h3 style="margin:0 0 20px;color:#fff;font-size:18px;display:flex;align-items:center;gap:8px;">
                    <i class='bx bx-expand' style="color:#3b82f6;"></i> Resize Canvas
                </h3>
                <div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;">
                    <div style="flex:1;">
                        <label style="font-size:11px;color:#888;display:block;margin-bottom:4px;">Width (px)</label>
                        <input id="is-rz-w" type="number" value="${origW}" min="1" max="10000" style="width:100%;background:#111;color:#fff;border:1px solid rgba(255,255,255,0.15);border-radius:6px;padding:8px 10px;font-size:14px;outline:none;box-sizing:border-box;">
                    </div>
                    <button id="is-rz-lock" title="Lock Aspect Ratio" style="margin-top:16px;background:none;border:none;color:#3b82f6;font-size:20px;cursor:pointer;padding:4px;"><i class='bx bx-link'></i></button>
                    <div style="flex:1;">
                        <label style="font-size:11px;color:#888;display:block;margin-bottom:4px;">Height (px)</label>
                        <input id="is-rz-h" type="number" value="${origH}" min="1" max="10000" style="width:100%;background:#111;color:#fff;border:1px solid rgba(255,255,255,0.15);border-radius:6px;padding:8px 10px;font-size:14px;outline:none;box-sizing:border-box;">
                    </div>
                </div>
                <div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;">
                    <div style="flex:1;">
                        <label style="font-size:11px;color:#888;display:block;margin-bottom:4px;">Scale %</label>
                        <input id="is-rz-pct" type="number" value="100" min="1" max="1000" style="width:100%;background:#111;color:#fff;border:1px solid rgba(255,255,255,0.15);border-radius:6px;padding:8px 10px;font-size:14px;outline:none;box-sizing:border-box;">
                    </div>
                    <div style="flex:1;text-align:right;margin-top:16px;">
                        <span style="font-size:11px;color:#666;">Current: ${origW} × ${origH}</span><br>
                        <span id="is-rz-preview" style="font-size:13px;color:#3b82f6;font-weight:500;">${origW} × ${origH}</span>
                    </div>
                </div>
                <div style="display:flex;gap:8px;justify-content:flex-end;">
                    <button id="is-rz-cancel" style="background:#333;color:#ccc;border:none;border-radius:6px;padding:8px 20px;font-size:13px;cursor:pointer;">Cancel</button>
                    <button id="is-rz-apply" style="background:#3b82f6;color:#fff;border:none;border-radius:6px;padding:8px 20px;font-size:13px;cursor:pointer;font-weight:500;">Apply</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        const wInput = modal.querySelector('#is-rz-w');
        const hInput = modal.querySelector('#is-rz-h');
        const pctInput = modal.querySelector('#is-rz-pct');
        const lockBtn = modal.querySelector('#is-rz-lock');
        const preview = modal.querySelector('#is-rz-preview');
        
        const updatePreview = () => { preview.textContent = `${wInput.value} × ${hInput.value}`; };
        
        wInput.addEventListener('input', () => {
            if (lockAspect) hInput.value = Math.round(parseInt(wInput.value) / aspect);
            pctInput.value = Math.round(parseInt(wInput.value) / origW * 100);
            updatePreview();
        });
        hInput.addEventListener('input', () => {
            if (lockAspect) wInput.value = Math.round(parseInt(hInput.value) * aspect);
            pctInput.value = Math.round(parseInt(hInput.value) / origH * 100);
            updatePreview();
        });
        pctInput.addEventListener('input', () => {
            const s = parseInt(pctInput.value) / 100;
            wInput.value = Math.round(origW * s);
            hInput.value = Math.round(origH * s);
            updatePreview();
        });
        lockBtn.addEventListener('click', () => {
            lockAspect = !lockAspect;
            lockBtn.innerHTML = lockAspect ? "<i class='bx bx-link'></i>" : "<i class='bx bx-unlink'></i>";
            lockBtn.style.color = lockAspect ? '#3b82f6' : '#666';
        });
        modal.querySelector('#is-rz-cancel').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
        
        modal.querySelector('#is-rz-apply').addEventListener('click', () => {
            const newW = parseInt(wInput.value), newH = parseInt(hInput.value);
            if (newW > 0 && newH > 0 && (newW !== origW || newH !== origH)) {
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = newW; tempCanvas.height = newH;
                const tctx = tempCanvas.getContext('2d');
                tctx.drawImage(canvas, 0, 0, origW, origH, 0, 0, newW, newH);
                canvas.width = newW; canvas.height = newH;
                overlay.width = newW; overlay.height = newH;
                ctx.clearRect(0, 0, newW, newH);
                ctx.drawImage(tempCanvas, 0, 0);
                sizeInfo.innerText = `${newW} x ${newH}`;
                saveState();
                drawSelectionOverlay();
            }
            modal.remove();
        });
        
        wInput.focus();
        wInput.select();
    });

    // Selection Toolbar Logic
    function performCopy() {
        // Copy entire canvas (with all vector shapes baked) to clipboard
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(canvas, 0, 0);
        vectorShapes.forEach(s => drawShape(tempCtx, s));
        
        tempCanvas.toBlob(blob => {
            if (blob) {
                navigator.clipboard.write([
                    new ClipboardItem({ 'image/png': blob })
                ]).then(() => {
                    // Flash feedback
                    const copyBtn = container.querySelector('#is-copy-btn');
                    copyBtn.style.color = '#4ade80';
                    setTimeout(() => copyBtn.style.color = '', 800);
                }).catch(err => console.warn('Copy failed:', err));
            }
        }, 'image/png');
    }

    // Smooth level slider
    container.querySelector('#is-smooth-level').addEventListener('input', (e) => {
        container.querySelector('#is-smooth-level-val').textContent = e.target.value;
    });
    
    // Helper: apply Chaikin smoothing on control points
    function applySmoothToShape(shape, level) {
        const pts = shape.originalPoints || shape.points;
        if (pts.length < 3) { shape.points = pts.slice(); return; }
        
        // Step 1: Simplify
        const simplified = [pts[0]];
        const threshold = level * 1.5;
        for (let i = 1; i < pts.length - 1; i++) {
            const prev = simplified[simplified.length - 1];
            const dist = Math.sqrt((pts[i].x - prev.x) ** 2 + (pts[i].y - prev.y) ** 2);
            if (dist > threshold) {
                simplified.push(pts[i]);
            }
        }
        simplified.push(pts[pts.length - 1]);
        
        // Step 2: Chaikin smoothing
        const iterations = Math.max(2, Math.ceil(level / 2));
        let result = simplified;
        for (let iter = 0; iter < iterations; iter++) {
            let smooth = [result[0]];
            for (let i = 0; i < result.length - 1; i++) {
                const p0 = result[i];
                const p1 = result[i + 1];
                smooth.push({ x: 0.75 * p0.x + 0.25 * p1.x, y: 0.75 * p0.y + 0.25 * p1.y });
                smooth.push({ x: 0.25 * p0.x + 0.75 * p1.x, y: 0.25 * p0.y + 0.75 * p1.y });
            }
            smooth.push(result[result.length - 1]);
            result = smooth;
        }
        
        shape.points = result;
        shape.smoothLevel = level;
        
        // Recalculate bounding box from smoothed points to keep bbox consistent
        if (result.length > 1) {
            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
            result.forEach(p => {
                if (p.x < minX) minX = p.x;
                if (p.y < minY) minY = p.y;
                if (p.x > maxX) maxX = p.x;
                if (p.y > maxY) maxY = p.y;
            });
            // Also include originalPoints in bbox so control points are inside
            if (shape.originalPoints) {
                shape.originalPoints.forEach(p => {
                    if (p.x < minX) minX = p.x;
                    if (p.y < minY) minY = p.y;
                    if (p.x > maxX) maxX = p.x;
                    if (p.y > maxY) maxY = p.y;
                });
            }
            const sw = shape.strokeWidth || 5;
            shape.x = minX - sw;
            shape.y = minY - sw;
            shape.x2 = maxX + sw;
            shape.y2 = maxY + sw;
        }
    }
    
    // Smooth button for brush/polyarrow paths
    container.querySelector('#is-brush-smooth').addEventListener('click', () => {
        if (!activeVectorShape || !['path', 'polyarrow'].includes(activeVectorShape.type)) return;
        const level = parseInt(container.querySelector('#is-smooth-level').value) || 5;
        
        if (activeVectorShape.type === 'path') {
            // Brush path: simple smooth, just replace points
            const pts = activeVectorShape.points;
            if (pts.length < 3) return;
            applySmoothToShape(activeVectorShape, level);
            delete activeVectorShape.originalPoints; // no control point editing for brush
        } else {
            // Polyarrow: save original points for control point editing
            const pts = activeVectorShape.originalPoints || activeVectorShape.points;
            if (pts.length < 3) return;
            if (!activeVectorShape.originalPoints) {
                activeVectorShape.originalPoints = pts.map(p => ({ x: p.x, y: p.y }));
            }
            applySmoothToShape(activeVectorShape, level);
        }
        
        drawSelectionOverlay();
        saveState();
        
        // Flash feedback on button
        const btn = container.querySelector('#is-brush-smooth');
        btn.style.color = '#4ade80';
        setTimeout(() => btn.style.color = '', 500);
    });

    // Polyarrow mode buttons (none / single / double)
    container.querySelectorAll('.is-arrow-mode').forEach(btn => {
        btn.addEventListener('click', () => {
            if (!activeVectorShape || activeVectorShape.type !== 'polyarrow') return;
            const mode = btn.getAttribute('data-mode');
            activeVectorShape.arrowMode = mode;
            container.querySelectorAll('.is-arrow-mode').forEach(b => b.classList.toggle('active', b.getAttribute('data-mode') === mode));
            // Show/hide arrowhead options
            const hasArrow = mode !== 'none';
            container.querySelector('#is-arrowhead-divider').style.display = hasArrow ? '' : 'none';
            container.querySelector('#is-arrowhead-label').style.display = hasArrow ? '' : 'none';
            container.querySelector('#is-arrowhead-style').style.display = hasArrow ? '' : 'none';
            drawSelectionOverlay();
            saveState();
        });
    });

    // Line style selector
    container.querySelector('#is-line-style').addEventListener('change', (e) => {
        if (!activeVectorShape || activeVectorShape.type !== 'polyarrow') return;
        activeVectorShape.lineStyle = e.target.value;
        drawSelectionOverlay();
        saveState();
    });

    // Arrowhead style selector
    container.querySelector('#is-arrowhead-style').addEventListener('change', (e) => {
        if (!activeVectorShape || activeVectorShape.type !== 'polyarrow') return;
        activeVectorShape.arrowHead = e.target.value;
        drawSelectionOverlay();
        saveState();
    });

    function performCut() {
        performCopy();
        if (activeVectorShape) {
            vectorShapes = vectorShapes.filter(s => s !== activeVectorShape);
            activeVectorShape = null;
        } else if (selection) {
            if (!selection.isFloating) {
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(selection.x, selection.y, selection.w, selection.h);
            }
            selection = null;
        }
        drawSelectionOverlay();
        saveState();
    }

    function performPaste() {
        if (clipboardData) {
            if (selection) {
                if (selection.isFloating) {
                    ctx.putImageData(selection.imgData, selection.x, selection.y);
                }
                selection = null;
            }
            
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = clipboardData.width;
            tempCanvas.height = clipboardData.height;
            tempCanvas.getContext('2d').putImageData(clipboardData, 0, 0);
            
            // Scale down to fit canvas if needed (keep aspect ratio)
            let w = clipboardData.width, h = clipboardData.height;
            if (w > canvas.width || h > canvas.height) {
                const scale = Math.min(canvas.width / w, canvas.height / h);
                w = Math.round(w * scale);
                h = Math.round(h * scale);
            }
            
            const obj = {
                id: nextShapeId(),
                type: 'image',
                img: tempCanvas,
                x: Math.round(canvas.width/2 - w/2),
                y: Math.round(canvas.height/2 - h/2),
                x2: Math.round(canvas.width/2 + w/2),
                y2: Math.round(canvas.height/2 + h/2),
                strokeWidth: 0
            };
            vectorShapes.push(obj);
            activeVectorShape = obj;
            currentTool = 'select';
            tools.forEach(t => t.classList.toggle('active', t.getAttribute('data-tool') === 'select'));
            canvas.style.cursor = 'default';
            drawSelectionOverlay();
            saveState();
        }
    }

    container.querySelector('#is-copy-btn').addEventListener('click', performCopy);
    
    // Region Copy - copies the selected region to clipboard
    container.querySelector('#is-region-copy').addEventListener('click', () => {
        if (!selection) return;
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = selection.w;
        tempCanvas.height = selection.h;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(canvas, selection.x, selection.y, selection.w, selection.h, 0, 0, selection.w, selection.h);
        // Also draw any vector shapes that overlap
        tempCtx.save();
        tempCtx.translate(-selection.x, -selection.y);
        vectorShapes.forEach(s => drawShape(tempCtx, s));
        tempCtx.restore();
        
        tempCanvas.toBlob(blob => {
            if (blob) {
                navigator.clipboard.write([
                    new ClipboardItem({ 'image/png': blob })
                ]).then(() => {
                    const btn = container.querySelector('#is-region-copy');
                    btn.style.color = '#4ade80';
                    setTimeout(() => btn.style.color = '', 800);
                }).catch(err => console.warn('Copy failed:', err));
            }
        }, 'image/png');
    });
    
    // Region Crop - crops canvas to the selected region
    container.querySelector('#is-region-crop').addEventListener('click', () => {
        if (!selection) return;
        // Bake vector shapes
        vectorShapes.forEach(s => drawShape(ctx, s));
        vectorShapes = [];
        activeVectorShape = null;
        
        const imgData = ctx.getImageData(selection.x, selection.y, selection.w, selection.h);
        canvas.width = selection.w;
        canvas.height = selection.h;
        overlay.width = selection.w;
        overlay.height = selection.h;
        ctx.putImageData(imgData, 0, 0);
        sizeInfo.innerText = `${Math.round(selection.w)} x ${Math.round(selection.h)}`;
        selection = null;
        
        // Reset context bar
        const allSpans = ['is-ctx-text','is-ctx-shape','is-ctx-brush','is-ctx-eraser','is-ctx-fill','is-ctx-crop','is-ctx-select','is-ctx-region-actions'];
        allSpans.forEach(id => container.querySelector('#'+id).style.display = 'none');
        container.querySelector('#is-ctx-crop').style.display = 'contents';
        
        drawSelectionOverlay();
        saveState();
    });
    
    // Context bar delete
    container.querySelector('#is-ctx-del').addEventListener('click', () => {
        if (activeVectorShape) {
            vectorShapes = vectorShapes.filter(s => s !== activeVectorShape);
            activeVectorShape = null;
        } else if (selection) {
            if (!selection.isFloating) {
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(selection.x, selection.y, selection.w, selection.h);
            }
            selection = null;
        }
        contextBar.style.display = 'none';
        drawSelectionOverlay();
        saveState();
    });
    
    // Layer ordering: Bring to Front
    container.querySelector('#is-ctx-front').addEventListener('click', () => {
        if (!activeVectorShape) return;
        const idx = vectorShapes.indexOf(activeVectorShape);
        if (idx < vectorShapes.length - 1) {
            vectorShapes.splice(idx, 1);
            vectorShapes.push(activeVectorShape);
            drawSelectionOverlay();
        }
    });
    
    // Layer ordering: Send to Back
    container.querySelector('#is-ctx-back').addEventListener('click', () => {
        if (!activeVectorShape) return;
        const idx = vectorShapes.indexOf(activeVectorShape);
        if (idx > 0) {
            vectorShapes.splice(idx, 1);
            vectorShapes.unshift(activeVectorShape);
            drawSelectionOverlay();
        }
    });
    
    // Shape color/stroke live edit
    container.querySelector('#is-shape-color').addEventListener('input', () => {
        if (activeVectorShape && activeVectorShape.type !== 'text') {
            activeVectorShape.stroke = window._isGetCVal('#is-shape-color');
            drawSelectionOverlay();
        }
    });
    
    container.querySelector('#is-shape-fill-color').addEventListener('input', () => {
        if (activeVectorShape && activeVectorShape.type !== 'text') {
            activeVectorShape.fill = window._isGetCVal('#is-shape-fill-color');
            drawSelectionOverlay();
        }
    });
    container.querySelector('#is-shape-stroke').addEventListener('input', () => {
        if (activeVectorShape && activeVectorShape.type !== 'text') {
            activeVectorShape.strokeWidth = parseInt(container.querySelector('#is-shape-stroke').value) || 5;
            drawSelectionOverlay();
        }
    });

    // Undo / Redo
    let _restorePending = false;
    const restoreState = (step) => {
        const entry = history[step];
        if (!entry) return;
        _restorePending = true;
        const img = new Image();
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            _restorePending = false;
            // Redraw overlay AFTER canvas is ready to avoid visual desync
            drawSelectionOverlay();
        };
        img.src = entry.dataURL;
        // Restore vector shapes (deep clone including nested objects)
        vectorShapes = entry.shapes.map(s => {
            const clone = { ...s };
            if (s.points) clone.points = s.points.map(p => ({ ...p }));
            if (s.originalPoints) clone.originalPoints = s.originalPoints.map(p => ({ ...p }));
            if (s.connections) clone.connections = JSON.parse(JSON.stringify(s.connections));
            if (s.type === 'image' && s.img) {
                clone.img = s.img;
            }
            return clone;
        });
        activeVectorShape = null;
        selection = null;
    };

    container.querySelector('#is-undo').addEventListener('click', () => {
        if (_restorePending) return; // prevent rapid clicks from causing race conditions
        if (historyStep > 0) {
            historyStep--;
            restoreState(historyStep);
        }
    });

    container.querySelector('#is-redo').addEventListener('click', () => {
        if (_restorePending) return; // prevent rapid clicks from causing race conditions
        if (historyStep < history.length - 1) {
            historyStep++;
            restoreState(historyStep);
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Only if we are viewing the studio
        if (!document.getElementById('is-canvas')) return;
        
        if (e.key === 'Delete' && currentTool === 'select') {
            if (activeVectorShape) {
                vectorShapes = vectorShapes.filter(s => s !== activeVectorShape);
                activeVectorShape = null;
                drawSelectionOverlay();
                saveState();
            } else if (selection) {
                selection = null;
                drawSelectionOverlay();
                saveState();
            }
        }
        
        if (e.ctrlKey && e.key.toLowerCase() === 'z') {
            e.preventDefault();
            container.querySelector('#is-undo').click();
        }
        if (e.ctrlKey && e.key.toLowerCase() === 'y') {
            e.preventDefault();
            container.querySelector('#is-redo').click();
        }
        if (e.ctrlKey && e.key.toLowerCase() === 'c') {
            e.preventDefault();
            performCopy();
        }
        if (e.ctrlKey && e.key.toLowerCase() === 'x') {
            e.preventDefault();
            performCut();
        }
        if (e.ctrlKey && e.key.toLowerCase() === 's') {
            e.preventDefault();
            container.querySelector('#is-download-btn').click();
        }
        if (e.ctrlKey && e.key.toLowerCase() === 'o') {
            e.preventDefault();
            uploadBtn.click();
        }
    });

    // Adjustments Dropdown Logic
    const adjBtn = container.querySelector('#is-adj-btn');
    const adjMenu = container.querySelector('#is-adj-menu');
    
    adjBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        adjMenu.style.display = adjMenu.style.display === 'none' ? 'block' : 'none';
    });
    
    document.addEventListener('click', (e) => {
        if (!document.getElementById('is-adj-container')) return;
        if (!container.querySelector('#is-adj-container').contains(e.target)) {
            adjMenu.style.display = 'none';
        }
    });

    // Filters
    const filters = container.querySelectorAll('.is-filter');
    let originalImageData = null; // Store base image before sliding
    
    filters.forEach(f => {
        f.addEventListener('mousedown', () => {
            if (!originalImageData) {
                originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            }
        });
        
        f.addEventListener('input', (e) => {
            container.querySelector('#val-' + f.getAttribute('data-filter')).innerText = e.target.value;
            // Native canvas filter preview via CSS is faster for live preview
            const b = container.querySelector('[data-filter="brightness"]').value;
            const c = container.querySelector('[data-filter="contrast"]').value;
            const s = container.querySelector('[data-filter="saturation"]').value;
            const bl = container.querySelector('[data-filter="blur"]').value;
            
            canvas.style.filter = `brightness(${100 + parseInt(b)}%) contrast(${100 + parseInt(c)}%) saturate(${100 + parseInt(s)}%) blur(${bl}px)`;
        });
    });

    container.querySelector('#is-apply-filters').addEventListener('click', () => {
        const b = container.querySelector('[data-filter="brightness"]').value;
        const c = container.querySelector('[data-filter="contrast"]').value;
        const s = container.querySelector('[data-filter="saturation"]').value;
        const bl = container.querySelector('[data-filter="blur"]').value;

        // Apply permanently by drawing into itself with filter
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tctx = tempCanvas.getContext('2d');
        tctx.filter = `brightness(${100 + parseInt(b)}%) contrast(${100 + parseInt(c)}%) saturate(${100 + parseInt(s)}%) blur(${bl}px)`;
        tctx.drawImage(canvas, 0, 0);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(tempCanvas, 0, 0);
        
        // Reset UI
        canvas.style.filter = 'none';
        filters.forEach(f => {
            f.value = f.getAttribute('data-filter') === 'blur' ? 0 : 0;
            container.querySelector('#val-' + f.getAttribute('data-filter')).innerText = "0";
        });
        originalImageData = null;
        saveState();
    });

    // AI Mock Features
    container.querySelector('#is-ai-enhance').addEventListener('click', () => {
        const btn = container.querySelector('#is-ai-enhance');
        btn.innerHTML = "<i class='bx bx-loader-alt bx-spin'></i> Analyzing Image...";
        
        setTimeout(() => {
            // Apply mock optimal settings
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            const tctx = tempCanvas.getContext('2d');
            tctx.filter = `brightness(110%) contrast(115%) saturate(120%)`;
            tctx.drawImage(canvas, 0, 0);

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(tempCanvas, 0, 0);
            saveState();
            
            btn.innerHTML = "<i class='bx bx-check'></i> Enhanced!";
            setTimeout(() => {
                btn.innerHTML = "<i class='bx bxs-magic-wand'></i> Auto Enhance";
            }, 2000);
        }, 1500);
    });

    container.querySelector('#is-flatten-all').addEventListener('click', () => {
        if (!vectorShapes || vectorShapes.length === 0) return;
        if (!confirm("Are you sure you want to merge all objects into the base image? This cannot be undone.")) return;
        
        vectorShapes.forEach(s => {
            if (typeof drawShape === 'function') drawShape(ctx, s);
        });
        vectorShapes.splice(0, vectorShapes.length);
        activeVectorShape = null;
        saveState();
        drawSelectionOverlay();
    });

    // Helper: run removeBackground on a source and show progress on a button
    async function runRemoveBg(btn, sourceUrl) {
        const resultBlob = await removeBackground(sourceUrl, {
            progress: (key, current, total) => {
                if (!total) return;
                const pct = Math.round((current / total) * 100);
                if (key.includes('fetch')) {
                    btn.innerHTML = `<i class='bx bx-loader-alt bx-spin'></i> AI Model ${pct}%`;
                } else {
                    btn.innerHTML = `<i class='bx bx-loader-alt bx-spin'></i> Removing ${pct}%`;
                }
            }
        });
        return resultBlob;
    }

    // Remove Background - canvas context bar (whole canvas)
    container.querySelector('#is-canvas-remove-bg').addEventListener('click', async () => {
        const btn = container.querySelector('#is-canvas-remove-bg');
        const origText = btn.innerHTML;
        btn.innerHTML = "<i class='bx bx-loader-alt bx-spin'></i> Processing...";
        btn.disabled = true;
        
        const w = canvas.width, h = canvas.height;
        
        try {
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = w; tempCanvas.height = h;
            const tctx = tempCanvas.getContext('2d');
            tctx.drawImage(canvas, 0, 0);
            vectorShapes.forEach(s => drawShape(tctx, s));
            
            const srcBlob = await new Promise(r => tempCanvas.toBlob(r, 'image/png'));
            const srcUrl = URL.createObjectURL(srcBlob);
            const resultBlob = await runRemoveBg(btn, srcUrl);
            URL.revokeObjectURL(srcUrl);
            
            if (!container.querySelector('#is-canvas')) { btn.innerHTML = origText; btn.disabled = false; return; }
            
            const resultUrl = URL.createObjectURL(resultBlob);
            const img = new Image();
            img.onload = () => {
                ctx.clearRect(0, 0, w, h);
                ctx.fillStyle = canvasBgColor;
                ctx.fillRect(0, 0, w, h);
                ctx.drawImage(img, 0, 0, w, h);
                URL.revokeObjectURL(resultUrl);
                vectorShapes.length = 0;
                activeVectorShape = null;
                saveState(); drawSelectionOverlay();
                btn.innerHTML = "<i class='bx bx-check' style='color:#10b981;'></i> Done!";
                setTimeout(() => { btn.innerHTML = origText; btn.disabled = false; }, 2000);
            };
            img.src = resultUrl;
        } catch(err) {
            console.error('Remove BG error:', err);
            btn.innerHTML = "<i class='bx bx-error' style='color:#ef4444;'></i> Error";
            setTimeout(() => { btn.innerHTML = origText; btn.disabled = false; }, 2000);
        }
    });
    
    // Remove Background - selected image object only
    container.querySelector('#is-obj-remove-bg').addEventListener('click', async () => {
        if (!activeVectorShape || activeVectorShape.type !== 'image') return;
        
        const btn = container.querySelector('#is-obj-remove-bg');
        const origText = btn.innerHTML;
        btn.innerHTML = "<i class='bx bx-loader-alt bx-spin'></i> Processing...";
        btn.disabled = true;
        
        const shape = activeVectorShape;
        const imgEl = shape.img;
        const iw = imgEl.naturalWidth || imgEl.width;
        const ih = imgEl.naturalHeight || imgEl.height;
        
        try {
            // Draw the image object at its native resolution
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = iw; tempCanvas.height = ih;
            const tctx = tempCanvas.getContext('2d');
            tctx.drawImage(imgEl, 0, 0, iw, ih);
            
            const srcBlob = await new Promise(r => tempCanvas.toBlob(r, 'image/png'));
            const srcUrl = URL.createObjectURL(srcBlob);
            const resultBlob = await runRemoveBg(btn, srcUrl);
            URL.revokeObjectURL(srcUrl);
            
            if (!container.querySelector('#is-canvas')) { btn.innerHTML = origText; btn.disabled = false; return; }
            
            // Replace the image in the shape with the result
            const resultUrl = URL.createObjectURL(resultBlob);
            const newImg = new Image();
            newImg.onload = () => {
                shape.img = newImg;
                saveState(); drawSelectionOverlay();
                btn.innerHTML = "<i class='bx bx-check' style='color:#10b981;'></i> Done!";
                setTimeout(() => { btn.innerHTML = origText; btn.disabled = false; }, 2000);
            };
            newImg.src = resultUrl;
        } catch(err) {
            console.error('Remove BG error:', err);
            btn.innerHTML = "<i class='bx bx-error' style='color:#ef4444;'></i> Error";
            setTimeout(() => { btn.innerHTML = origText; btn.disabled = false; }, 2000);
        }
    });

        const smartRemoveHandler = (e) => {
        e.stopPropagation();

        let existingMenu = container.querySelector('#is-ai-tool-menu');
        if (existingMenu) existingMenu.remove();

        const menu = document.createElement('div');
        menu.id = 'is-ai-tool-menu';
        menu.style.cssText = 'position: absolute; display: flex; flex-direction: column; background: #252526; padding: 6px; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); z-index: 200; width: 180px; gap: 2px;';
        
        const rect = e.target.getBoundingClientRect();
        let left = rect.left + window.scrollX;
        let top = rect.bottom + window.scrollY + 10;
        if (left + 180 > window.innerWidth) left = window.innerWidth - 190;
        menu.style.left = left + 'px';
        menu.style.top = top + 'px';

        menu.innerHTML = `
            <div style="padding: 4px 10px; font-size: 10px; color: #9ca3af; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;">AI Generation</div>
            <button class="is-btn-icon" id="is-ai-opt-create" style="justify-content: flex-start; padding: 6px 10px; width: 100%; border-radius: 4px; font-size: 11px; white-space: nowrap;"><i class='bx bxs-magic-wand' style="margin-right: 6px; color:#10b981;"></i> Create Image Object</button>
            <button class="is-btn-icon" id="is-ai-opt-whole" style="justify-content: flex-start; padding: 6px 10px; width: 100%; border-radius: 4px; font-size: 11px; white-space: nowrap;"><i class='bx bx-image-alt' style="margin-right: 6px;"></i> Prompt AI (Edit)</button>
            <button class="is-btn-icon" id="is-ai-opt-area" style="justify-content: flex-start; padding: 6px 10px; width: 100%; border-radius: 4px; font-size: 11px; white-space: nowrap;"><i class='bx bx-highlight' style="margin-right: 6px;"></i> Select Area to Prompt</button>
            <div style="height: 1px; background: rgba(255,255,255,0.1); margin: 4px 0; width: 100%;"></div>
            <div style="padding: 4px 10px; font-size: 10px; color: #9ca3af; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;">AI Enhancement</div>
            <button class="is-btn-icon" id="is-ai-opt-super" style="justify-content: flex-start; padding: 6px 10px; width: 100%; border-radius: 4px; font-size: 11px; white-space: nowrap;"><i class='bx bx-zoom-in' style="margin-right: 6px;"></i> Super Resolution</button>
            <button class="is-btn-icon" id="is-ai-opt-analyze" style="justify-content: flex-start; padding: 6px 10px; width: 100%; border-radius: 4px; font-size: 11px; white-space: nowrap;"><i class='bx bx-search-alt' style="margin-right: 6px;"></i> Analysis with AI</button>
        `;

        const closeMenu = (ev) => {
            if (!menu.contains(ev.target)) {
                menu.remove();
                document.removeEventListener('pointerdown', closeMenu);
            }
        };
        setTimeout(() => document.addEventListener('pointerdown', closeMenu), 0);
        document.body.appendChild(menu);

        let actionBar = null;
        let isMaskDrawing = false;

        const escListener = (ev) => {
            if (ev.key === 'Escape' && currentTool === 'smartremove') {
                ev.preventDefault();
                exitSmartRemove();
            }
        };
        document.addEventListener('keydown', escListener);

        function exitSmartRemove() {
            document.removeEventListener('keydown', escListener);
            canvas.removeEventListener('mousedown', onMaskDown);
            window.removeEventListener('mousemove', onMaskMove);
            window.removeEventListener('mouseup', onMaskUp);
            window.currentMaskPoints = null;
            window.currentMaskCanvas = null;
            window.isMaskFinished = false;
            
            hideCanvasTooltip();
            if (actionBar) actionBar.remove();
            
            currentTool = 'select';
            canvas.style.cursor = 'default';
            drawSelectionOverlay();
        }

        function cancelMask() {
            window.currentMaskPoints = [];
            window.currentMaskCanvas = null;
            window.isMaskFinished = false;
            if (actionBar) actionBar.style.display = 'none';
            drawSelectionOverlay();
        }

        function showAiEditModal(imageDataUrl, isObj, maskDataUrl = null) {
            const modalOverlay = document.createElement('div');
            modalOverlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:99999;display:flex;justify-content:center;align-items:center;backdrop-filter:blur(3px);';
            
            const modalContent = document.createElement('div');
            modalContent.style.cssText = 'background:#1e1e1e;width:450px;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,0.8);border:1px solid rgba(255,255,255,0.1);display:flex;flex-direction:column;overflow:hidden;font-family:inherit;';
            
            modalContent.innerHTML = `
                <div style="padding:16px 20px;border-bottom:1px solid rgba(255,255,255,0.1);display:flex;justify-content:space-between;align-items:center;">
                    <h3 style="margin:0;color:#fff;font-size:16px;font-weight:600;display:flex;align-items:center;gap:8px;">
                        ${maskDataUrl ? "<i class='bx bx-highlight' style='color:#f43f5e;'></i> Prompt AI (Inpainting)" : "<i class='bx bx-image-alt' style='color:#3b82f6;'></i> Prompt AI (Image Edit)"}
                    </h3>
                    <button id="is-ai-modal-edit-close" style="background:none;border:none;color:#9ca3af;cursor:pointer;font-size:20px;padding:0;"><i class='bx bx-x'></i></button>
                </div>
                <div style="padding:20px;display:flex;flex-direction:column;gap:16px;">
                    <div>
                        <label style="display:block;color:#d1d5db;font-size:12px;margin-bottom:6px;">Edit Instructions ${maskDataUrl ? '' : '<span style="color:#ef4444">*</span>'}</label>
                        <textarea id="is-ai-edit-prompt-input" rows="4" placeholder="${maskDataUrl ? 'Describe what to put in the mask area, or leave blank to remove the object...' : 'How should the AI edit or transform this image?...'}" style="width:100%;background:#111;color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:10px;font-size:13px;outline:none;resize:none;box-sizing:border-box;"></textarea>
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:6px;">
                            <button id="is-ai-edit-refine-btn" style="background:transparent;color:#3b82f6;border:1px solid rgba(59,130,246,0.3);border-radius:4px;padding:4px 8px;cursor:pointer;font-size:11px;display:flex;align-items:center;gap:4px;transition:all 0.2s;"><i class='bx bx-brush'></i> Refine Prompt</button>
                            <button id="is-ai-edit-revert-btn" style="background:transparent;color:#9ca3af;border:none;cursor:pointer;font-size:11px;display:none;text-decoration:underline;">Revert</button>
                        </div>
                    </div>
                    ${!maskDataUrl ? `
                    <div style="display:flex;gap:12px;">
                        <div style="flex:1;">
                            <label style="display:block;color:#d1d5db;font-size:12px;margin-bottom:6px;">Image Editing API</label>
                            <select id="is-ai-edit-model-select" style="width:100%;background:#111;color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:8px;font-size:13px;outline:none;box-sizing:border-box;">
                                <option value="mystic" selected>Mystic (Default Edit)</option>
                                <option value="upscaler">Upscaler - Magnific API</option>
                                <option value="relight">Relight - Magnific API</option>
                                <option value="style-transfer">Style Transfer - Magnific API</option>
                                <option value="remove-background">Remove Background</option>
                                <option value="reimagine-flux">Reimagine Flux</option>
                                <option value="image-expand">Image Expand API</option>
                                <option value="skin-enhancer">Skin Enhancer API</option>
                                <option value="change-camera">Change Camera</option>
                            </select>
                        </div>
                    </div>` : ''}
                </div>
                <div style="padding:16px 20px;background:rgba(255,255,255,0.02);border-top:1px solid rgba(255,255,255,0.05);display:flex;justify-content:flex-end;gap:10px;">
                    <button id="is-ai-modal-edit-cancel" style="background:transparent;color:#d1d5db;border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:8px 16px;cursor:pointer;font-size:13px;transition:all 0.2s;">Cancel</button>
                    <button id="is-ai-modal-edit-submit" style="background:${maskDataUrl ? '#f43f5e' : '#3b82f6'};color:#fff;border:none;border-radius:6px;padding:8px 16px;cursor:pointer;font-size:13px;font-weight:600;display:flex;align-items:center;gap:6px;transition:all 0.2s;"><i class='bx bxs-magic-wand'></i> Apply Edit</button>
                </div>
            `;
            
            modalOverlay.appendChild(modalContent);
            document.body.appendChild(modalOverlay);
            
            const closeModal = () => {
                modalOverlay.remove();
                if (maskDataUrl) exitSmartRemove();
            };
            
            modalContent.querySelector('#is-ai-modal-edit-close').addEventListener('click', closeModal);
            modalContent.querySelector('#is-ai-modal-edit-cancel').addEventListener('click', closeModal);
            modalOverlay.addEventListener('click', (ev) => { if(ev.target === modalOverlay) closeModal(); });
            
            const promptInput = modalContent.querySelector('#is-ai-edit-prompt-input');
            promptInput.focus();
            
            const refineBtn = modalContent.querySelector('#is-ai-edit-refine-btn');
            const revertBtn = modalContent.querySelector('#is-ai-edit-revert-btn');
            let originalPrompt = '';

            refineBtn.addEventListener('click', async () => {
                const currentVal = promptInput.value.trim();
                if (!currentVal) {
                    promptInput.style.borderColor = '#ef4444';
                    return;
                }
                
                originalPrompt = currentVal;
                refineBtn.innerHTML = "<i class='bx bx-loader-alt bx-spin'></i> Refining...";
                refineBtn.disabled = true;
                refineBtn.style.opacity = '0.5';
                
                try {
                    const settings = {
                        provider: localStorage.getItem('worldtools_ai_provider') || 'gemini',
                        geminiKey: localStorage.getItem('worldtools_gemini_key') || '',
                        customBaseUrl: localStorage.getItem('worldtools_custom_url') || '',
                        customModelId: localStorage.getItem('worldtools_custom_model') || '',
                        customApiKey: localStorage.getItem('worldtools_custom_key') || ''
                    };
                    const res = await fetch('http://localhost:3000/api/ai/refine-prompt', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ prompt: currentVal, settings })
                    });
                    const data = await res.json();
                    if (!res.ok || !data.success) throw new Error(data.error);
                    
                    promptInput.value = data.prompt;
                    revertBtn.style.display = 'block';
                } catch (err) {
                    alert('Refine failed: ' + err.message);
                } finally {
                    refineBtn.innerHTML = "<i class='bx bx-brush'></i> Refine Prompt";
                    refineBtn.disabled = false;
                    refineBtn.style.opacity = '1';
                }
            });

            revertBtn.addEventListener('click', () => {
                promptInput.value = originalPrompt;
                revertBtn.style.display = 'none';
            });
            
            modalContent.querySelector('#is-ai-modal-edit-submit').addEventListener('click', async () => {
                const promptVal = promptInput.value.trim();
                if (!maskDataUrl && !promptVal) {
                    promptInput.style.borderColor = '#ef4444';
                    return;
                }
                
                const btnSubmit = modalContent.querySelector('#is-ai-modal-edit-submit');
                btnSubmit.innerHTML = "<i class='bx bx-loader-alt bx-spin'></i> Processing...";
                btnSubmit.disabled = true;
                btnSubmit.style.opacity = '0.7';
                
                const loadingMsg = document.createElement('div');
                loadingMsg.innerHTML = "This may take 10-30 seconds. Please wait...";
                loadingMsg.style.cssText = "color:#3b82f6;font-size:12px;margin-top:10px;text-align:center;width:100%;";
                modalContent.querySelector('.bx-loader-alt').parentElement.parentElement.appendChild(loadingMsg);
                
                try {
                    const baseSettings = typeof AIClient !== 'undefined' ? AIClient.getSettings() : { provider: 'gemini', geminiKey: '' };
                    const settings = {
                        ...baseSettings,
                        imageKey: localStorage.getItem('worldtools_image_key') || ''
                    };

                    let res, data;
                    if (maskDataUrl) {
                        res = await fetch('http://localhost:3000/api/ai/generate-fill', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ 
                                prompt: promptVal, 
                                image: imageDataUrl,
                                mask: maskDataUrl,
                                settings 
                            })
                        });
                        data = await res.json();
                        if (!res.ok || !data.success) throw new Error(data.message || data.error || "Failed to generate fill");
                    } else {
                        const modelVal = modalContent.querySelector('#is-ai-edit-model-select').value;
                        res = await fetch('http://localhost:3000/api/ai/edit-image', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ 
                                prompt: promptVal, 
                                model: modelVal, 
                                image: imageDataUrl,
                                settings 
                            })
                        });
                        data = await res.json();
                        if (!res.ok || !data.success) throw new Error(data.error || data.message || "Failed to edit image");
                    }

                    const newImg = new Image();
                    newImg.crossOrigin = 'anonymous';
                    newImg.onload = () => {
                        closeModal();
                        
                        if (isObj && activeVectorShape) {
                            if (maskDataUrl) {
                                activeVectorShape.img = newImg;
                                saveState(); drawSelectionOverlay();
                            } else {
                                activeVectorShape.img = newImg;
                                saveState(); drawSelectionOverlay();
                            }
                        } else {
                            if (!maskDataUrl) {
                                ctx.clearRect(0, 0, canvas.width, canvas.height);
                                vectorShapes.splice(0, vectorShapes.length);
                            }
                            ctx.drawImage(newImg, 0, 0, canvas.width, canvas.height);
                            saveState();
                            drawSelectionOverlay();
                        }
                    };
                    newImg.onerror = () => {
                        closeModal();
                        alert("Failed to load edited image.");
                    };
                    newImg.src = data.imageUrl || data.imageBase64;
                    
                } catch (err) {
                    console.error(err);
                    alert("Edit failed: " + err.message);
                    btnSubmit.innerHTML = "<i class='bx bxs-magic-wand'></i> Apply Edit";
                    btnSubmit.disabled = false;
                    btnSubmit.style.opacity = '1';
                    loadingMsg.remove();
                }
            });
        }

        function createActionBar(x, y) {
            actionBar = document.createElement('div');
            actionBar.id = 'is-smart-remove-actionbar';
            actionBar.style.cssText = 'position: absolute; display: flex; align-items: center; gap: 4px; background: #252526; padding: 6px; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); z-index: 100;';
            actionBar.innerHTML = `
                <input type="text" id="is-sr-prompt" placeholder="What to generate? (Leave empty to Remove)" style="background: #1e1e1e; color: #fff; border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; padding: 4px 8px; font-size: 11px; width: 220px; outline: none;">
                <button class="is-btn-icon" id="is-sr-apply" title="Generate / Remove" style="width: auto; padding: 0 8px; font-size: 11px; color: #10b981;"><i class='bx bxs-magic-wand'></i> Generate</button>
                <div class="is-divider"></div>
                <button class="is-btn-icon" id="is-sr-cancel" title="Cancel" style="color: #ef4444;"><i class='bx bx-x'></i></button>
            `;
            document.body.appendChild(actionBar);
            
            setTimeout(() => {
                const abw = actionBar.offsetWidth || 300;
                const abh = actionBar.offsetHeight || 40;
                const wrapperRect = container.querySelector('#is-canvas-wrapper').getBoundingClientRect();
                const zoom = parseInt(container.querySelector('#is-zoom').value) / 100;
                let tx = wrapperRect.left + (x * zoom) + window.scrollX;
                let ty = wrapperRect.top + (y * zoom) + window.scrollY;
                if (tx + abw > window.innerWidth) tx = window.innerWidth - abw - 10;
                if (ty + abh > window.innerHeight) ty = window.innerHeight - abh - 10;
                if (tx < window.scrollX + 10) tx = window.scrollX + 10;
                if (ty < window.scrollY + 10) ty = window.scrollY + 10;
                actionBar.style.left = tx + 'px';
                actionBar.style.top = ty + 'px';
            }, 0);

            actionBar.querySelector('#is-sr-apply').addEventListener('click', async (e) => {
                e.stopPropagation();
                if (!window.currentMaskCanvas) return;
                
                const prompt = actionBar.querySelector('#is-sr-prompt').value.trim();
                const btnApply = actionBar.querySelector('#is-sr-apply');
                
                if (prompt) {
                    btnApply.innerHTML = "<i class='bx bx-loader-alt bx-spin'></i>";
                    btnApply.disabled = true;
                    try {
                        const tempCanvas = document.createElement('canvas');
                        tempCanvas.width = canvas.width; tempCanvas.height = canvas.height;
                        const tctx = tempCanvas.getContext('2d');
                        tctx.drawImage(canvas, 0, 0);
                        if (typeof vectorShapes !== 'undefined') {
                            vectorShapes.forEach(s => {
                                if (typeof drawShape === 'function') drawShape(tctx, s);
                            });
                        }
                        
                        const imgBlob = await new Promise(res => tempCanvas.toBlob(res, 'image/png'));
                        const maskBlob = await new Promise(res => window.currentMaskCanvas.toBlob(res, 'image/png'));
                        
                        const imgBase64 = await new Promise(res => { const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(imgBlob); });
                        const maskBase64 = await new Promise(res => { const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(maskBlob); });
                        
                        const baseSettings = typeof AIClient !== 'undefined' ? AIClient.getSettings() : { provider: 'gemini', geminiKey: '' };
                        const settings = {
                            ...baseSettings,
                            imageKey: localStorage.getItem('worldtools_image_key') || ''
                        };
                        
                        const response = await fetch('http://localhost:3000/api/ai/generate-fill', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ settings, prompt, image: imgBase64, mask: maskBase64 })
                        });
                        
                        const data = await response.json();
                        if (!response.ok || !data.success) throw new Error(data.message || 'API request failed');
                        
                        const newImage = new Image();
                        newImage.onload = () => {
                            if (activeVectorShape && activeVectorShape.type === 'image') {
                                activeVectorShape.img = newImage;
                                saveState(); drawSelectionOverlay();
                            } else {
                                ctx.drawImage(newImage, 0, 0, canvas.width, canvas.height);
                                saveState(); drawSelectionOverlay();
                            }
                        };
                        newImage.src = data.imageUrl || data.imageBase64;
                    } catch (err) {
                        console.error("AI Generation error:", err);
                        alert("AI Generation failed: " + err.message);
                    }
                } else {
                    console.log("No prompt, skipping legacy remove");
                }
                exitSmartRemove();
            });
            
            actionBar.querySelector('#is-sr-cancel').addEventListener('click', (e) => {
                e.stopPropagation();
                cancelMask();
            });
        }

        function onMaskDown(e) {
            if (currentTool !== 'smartremove') return;
            if (window.isMaskFinished) return;
            isMaskDrawing = true;
            window.currentMaskPoints = [getMousePos(e)];
            drawSelectionOverlay();
        }
        function onMaskMove(e) {
            if (currentTool !== 'smartremove') return;
            if (isMaskDrawing && !window.isMaskFinished) {
                window.currentMaskPoints.push(getMousePos(e));
                drawSelectionOverlay();
            }
        }
        function onMaskUp(e) {
            if (currentTool !== 'smartremove' || !isMaskDrawing || window.isMaskFinished) return;
            isMaskDrawing = false;
            
            if (window.currentMaskPoints.length < 3) {
                window.currentMaskPoints = [];
                drawSelectionOverlay();
                return;
            }
            
            window.isMaskFinished = true;
            const maskCanvas = document.createElement('canvas');
            maskCanvas.width = canvas.width; maskCanvas.height = canvas.height;
            const mctx = maskCanvas.getContext('2d');
            
            // Background must be white (unchanged areas)
            mctx.fillStyle = '#ffffff';
            mctx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
            
            // Mask area must be black (edited areas)
            mctx.fillStyle = '#000000';
            mctx.beginPath();
            mctx.moveTo(window.currentMaskPoints[0].x, window.currentMaskPoints[0].y);
            for(let i=1; i<window.currentMaskPoints.length; i++) mctx.lineTo(window.currentMaskPoints[i].x, window.currentMaskPoints[i].y);
            mctx.closePath();
            mctx.fill();
            
            window.currentMaskCanvas = maskCanvas;
            drawSelectionOverlay();
            
            window.currentMaskCanvas = maskCanvas;
            drawSelectionOverlay();
            
            // Capture image data
            let imageDataUrl = '';
            let isObj = false;
            let targetW = canvas.width;
            let targetH = canvas.height;
            if (activeVectorShape && activeVectorShape.type === 'image') {
                const tempC = document.createElement('canvas');
                targetW = Math.abs(activeVectorShape.x2 - activeVectorShape.x);
                targetH = Math.abs(activeVectorShape.y2 - activeVectorShape.y);
                tempC.width = targetW;
                tempC.height = targetH;
                const tCtx = tempC.getContext('2d');
                tCtx.drawImage(activeVectorShape.img, 0, 0, tempC.width, tempC.height);
                imageDataUrl = tempC.toDataURL('image/jpeg', 0.9);
                
                // Also crop the mask to the exact same dimensions
                const croppedMask = document.createElement('canvas');
                croppedMask.width = targetW;
                croppedMask.height = targetH;
                const cmCtx = croppedMask.getContext('2d');
                cmCtx.drawImage(maskCanvas, activeVectorShape.x, activeVectorShape.y, targetW, targetH, 0, 0, targetW, targetH);
                maskCanvas.width = targetW;
                maskCanvas.height = targetH;
                maskCanvas.getContext('2d').drawImage(croppedMask, 0, 0);
                
                isObj = true;
            } else {
                const tempC = document.createElement('canvas');
                tempC.width = canvas.width; tempC.height = canvas.height;
                const tCtx = tempC.getContext('2d');
                tCtx.fillStyle = canvasBgColor;
                tCtx.fillRect(0, 0, canvas.width, canvas.height);
                tCtx.drawImage(canvas, 0, 0);
                if (typeof vectorShapes !== 'undefined') {
                    vectorShapes.forEach(s => { if (typeof drawShape === 'function') drawShape(tCtx, s); });
                }
                imageDataUrl = tempC.toDataURL('image/jpeg', 0.9);
            }
            
            const maskDataUrl = maskCanvas.toDataURL('image/png');
            showAiEditModal(imageDataUrl, isObj, maskDataUrl);
        }

        // Action 1: Prompt AI
        menu.querySelector('#is-ai-opt-whole').addEventListener('click', async (e) => {
            e.stopPropagation();
            menu.remove();
            document.removeEventListener('pointerdown', closeMenu);
            
            // Capture image data
            let imageDataUrl = '';
            let isObj = false;
            let targetW = canvas.width;
            let targetH = canvas.height;
            if (activeVectorShape && activeVectorShape.type === 'image') {
                const tempC = document.createElement('canvas');
                targetW = Math.abs(activeVectorShape.x2 - activeVectorShape.x);
                targetH = Math.abs(activeVectorShape.y2 - activeVectorShape.y);
                tempC.width = targetW;
                tempC.height = targetH;
                const tCtx = tempC.getContext('2d');
                tCtx.drawImage(activeVectorShape.img, 0, 0, tempC.width, tempC.height);
                imageDataUrl = tempC.toDataURL('image/jpeg', 0.9);
                isObj = true;
            } else {
                const tempC = document.createElement('canvas');
                tempC.width = canvas.width; tempC.height = canvas.height;
                const tCtx = tempC.getContext('2d');
                tCtx.fillStyle = canvasBgColor;
                tCtx.fillRect(0, 0, canvas.width, canvas.height);
                tCtx.drawImage(canvas, 0, 0);
                if (typeof vectorShapes !== 'undefined') {
                    vectorShapes.forEach(s => { if (typeof drawShape === 'function') drawShape(tCtx, s); });
                }
                imageDataUrl = tempC.toDataURL('image/jpeg', 0.9);
            }
            
            showAiEditModal(imageDataUrl, isObj, null);
        });

        // Action 2: Select Area to Prompt
        menu.querySelector('#is-ai-opt-area').addEventListener('click', (e) => {
            e.stopPropagation();
            menu.remove();
            document.removeEventListener('pointerdown', closeMenu);
            
            currentTool = 'smartremove';
            canvas.style.cursor = 'crosshair';
            const allSpans = ['is-ctx-text','is-ctx-shape','is-ctx-brush','is-ctx-eraser','is-ctx-fill','is-ctx-crop','is-ctx-select','is-ctx-region-actions'];
            allSpans.forEach(id => container.querySelector('#'+id).style.display = 'none');
            contextBar.style.display = 'flex';
            setCanvasTooltip("Draw an outline around the area to edit or remove &nbsp;·&nbsp; <b style='color:#f87171;'>Esc</b> to cancel");
            
            window.currentMaskPoints = [];
            window.currentMaskCanvas = null;
            window.isMaskFinished = false;
            
            canvas.addEventListener('mousedown', onMaskDown);
            window.addEventListener('mousemove', onMaskMove);
            window.addEventListener('mouseup', onMaskUp);
        });

        // Action 3: Super Resolution
        menu.querySelector('#is-ai-opt-super').addEventListener('click', async (e) => {
            e.stopPropagation();
            menu.remove();
            document.removeEventListener('pointerdown', closeMenu);
            
            let isObj = false;
            let targetW = canvas.width;
            let targetH = canvas.height;
            let imageDataUrl = '';
            
            if (activeVectorShape && activeVectorShape.type === 'image') {
                const tempC = document.createElement('canvas');
                targetW = Math.abs(activeVectorShape.x2 - activeVectorShape.x);
                targetH = Math.abs(activeVectorShape.y2 - activeVectorShape.y);
                tempC.width = targetW;
                tempC.height = targetH;
                const tCtx = tempC.getContext('2d');
                tCtx.drawImage(activeVectorShape.img, 0, 0, tempC.width, tempC.height);
                imageDataUrl = tempC.toDataURL('image/jpeg', 0.9);
                isObj = true;
            } else {
                imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
            }
            
            const scaleStr = prompt("Enter Upscale Level (e.g., 2 for 2x, 4 for 4x, 9 for 9x):", "4");
            if (!scaleStr) {
                document.addEventListener('pointerdown', closeMenu);
                return;
            }
            const scaleFactor = parseInt(scaleStr);
            if (isNaN(scaleFactor) || scaleFactor < 1) {
                alert("Invalid scale factor.");
                return;
            }
            
            const btn = e.target;
            const origHTML = btn.innerHTML;
            
            const toast = document.createElement('div');
            toast.innerHTML = `<i class='bx bx-loader-alt bx-spin'></i> Running Super Resolution ${scaleFactor}x (10-30s)...`;
            toast.style.cssText = "position:absolute;top:20px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.8);color:#10b981;padding:10px 20px;border-radius:20px;font-size:13px;z-index:9999;font-family:sans-serif;";
            container.appendChild(toast);
            
            try {
                const baseSettings = typeof AIClient !== 'undefined' ? AIClient.getSettings() : { provider: 'gemini', geminiKey: '' };
                const settings = {
                    ...baseSettings,
                    imageKey: localStorage.getItem('worldtools_image_key') || ''
                };
                
                const response = await fetch('http://localhost:3000/api/ai/edit-image', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ settings, image: imageDataUrl, model: 'super-resolution', prompt: 'upscale', scale_factor: scaleFactor })
                });
                
                const data = await response.json();
                if (!response.ok || !data.success) throw new Error(data.message || data.error || 'Super Resolution failed');
                
                const newImg = new Image();
                newImg.crossOrigin = 'anonymous';
                newImg.onload = () => {
                    toast.remove();
                    if (isObj && activeVectorShape) {
                        activeVectorShape.img = newImg;
                    } else {
                        const scaleX = newImg.width / canvas.width;
                        const scaleY = newImg.height / canvas.height;
                        
                        canvas.width = newImg.width;
                        canvas.height = newImg.height;
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        ctx.drawImage(newImg, 0, 0);
                        
                        if (typeof vectorShapes !== 'undefined') {
                            vectorShapes.forEach(s => {
                                if (s.x !== undefined) s.x *= scaleX;
                                if (s.y !== undefined) s.y *= scaleY;
                                if (s.x2 !== undefined) s.x2 *= scaleX;
                                if (s.y2 !== undefined) s.y2 *= scaleY;
                                if (s.fontSize) s.fontSize *= scaleY;
                                if (s.strokeWidth) s.strokeWidth *= scaleX;
                                if (s.points) s.points.forEach(p => { p.x *= scaleX; p.y *= scaleY; });
                                if (s.originalPoints) s.originalPoints.forEach(p => { p.x *= scaleX; p.y *= scaleY; });
                            });
                        }
                    }
                    saveState(); drawSelectionOverlay();
                };
                newImg.onerror = () => { toast.remove(); alert("Failed to load upscaled image"); };
                newImg.src = data.imageUrl || data.imageBase64;
            } catch(err) {
                toast.remove();
                alert("Super Resolution Error: " + err.message);
            }

        });

        // Action 3.5: Create Image Object
        menu.querySelector('#is-ai-opt-create').addEventListener('click', (e) => {
            e.stopPropagation();
            menu.remove();
            document.removeEventListener('pointerdown', closeMenu);
            
            const modalOverlay = document.createElement('div');
            modalOverlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:99999;display:flex;justify-content:center;align-items:center;backdrop-filter:blur(3px);';
            
            const modalContent = document.createElement('div');
            modalContent.style.cssText = 'background:#1e1e1e;width:450px;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,0.8);border:1px solid rgba(255,255,255,0.1);display:flex;flex-direction:column;overflow:hidden;font-family:inherit;';
            
            modalContent.innerHTML = `
                <div style="padding:16px 20px;border-bottom:1px solid rgba(255,255,255,0.1);display:flex;justify-content:space-between;align-items:center;">
                    <h3 style="margin:0;color:#fff;font-size:16px;font-weight:600;display:flex;align-items:center;gap:8px;"><i class='bx bxs-magic-wand' style="color:#10b981;"></i> Create Image Object</h3>
                    <button id="is-ai-modal-create-close" style="background:none;border:none;color:#9ca3af;cursor:pointer;font-size:20px;padding:0;"><i class='bx bx-x'></i></button>
                </div>
                <div style="padding:20px;display:flex;flex-direction:column;gap:16px;">
                    <div>
                        <label style="display:block;color:#d1d5db;font-size:12px;margin-bottom:6px;">Image Prompt <span style="color:#ef4444">*</span></label>
                        <textarea id="is-ai-create-prompt-input" rows="4" placeholder="Describe the object you want to generate..." style="width:100%;background:#111;color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:10px;font-size:13px;outline:none;resize:none;box-sizing:border-box;"></textarea>
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:6px;">
                            <button id="is-ai-create-refine-btn" style="background:transparent;color:#3b82f6;border:1px solid rgba(59,130,246,0.3);border-radius:4px;padding:4px 8px;cursor:pointer;font-size:11px;display:flex;align-items:center;gap:4px;transition:all 0.2s;"><i class='bx bx-brush'></i> Refine Prompt</button>
                            <button id="is-ai-create-revert-btn" style="background:transparent;color:#9ca3af;border:none;cursor:pointer;font-size:11px;display:none;text-decoration:underline;">Revert</button>
                        </div>
                    </div>
                    <div style="display:flex;gap:12px;">
                        <div style="flex:1;">
                            <label style="display:block;color:#d1d5db;font-size:12px;margin-bottom:6px;">Model</label>
                            <select id="is-ai-create-model-select" style="width:100%;background:#111;color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:8px;font-size:13px;outline:none;box-sizing:border-box;">
                                <option value="mystic" selected>Mystic</option>
                                <option value="reimagine-flux">Reimagine Flux</option>
                            </select>
                        </div>
                        <div style="flex:1;">
                            <label style="display:block;color:#d1d5db;font-size:12px;margin-bottom:6px;">Aspect Ratio</label>
                            <select id="is-ai-create-ratio" style="width:100%;background:#111;color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:8px;font-size:13px;outline:none;box-sizing:border-box;">
                                <option value="square_1_1" selected>1:1 (Square)</option>
                                <option value="widescreen_16_9">16:9 (Landscape)</option>
                                <option value="social_story_9_16">9:16 (Portrait)</option>
                                <option value="classic_4_3">4:3</option>
                                <option value="traditional_3_4">3:4</option>
                            </select>
                        </div>
                        <div style="flex:1;">
                            <label style="display:block;color:#d1d5db;font-size:12px;margin-bottom:6px;">Size on Canvas</label>
                            <select id="is-ai-create-size" style="width:100%;background:#111;color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:8px;font-size:13px;outline:none;box-sizing:border-box;">
                                <option value="small">Small (25%)</option>
                                <option value="medium" selected>Medium (50%)</option>
                                <option value="large">Large (75%)</option>
                                <option value="full">100% (Full Size)</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div style="padding:16px 20px;background:rgba(255,255,255,0.02);border-top:1px solid rgba(255,255,255,0.05);display:flex;justify-content:flex-end;gap:10px;">
                    <button id="is-ai-modal-create-cancel" style="background:transparent;color:#d1d5db;border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:8px 16px;cursor:pointer;font-size:13px;transition:all 0.2s;">Cancel</button>
                    <button id="is-ai-modal-create-submit" style="background:#10b981;color:#fff;border:none;border-radius:6px;padding:8px 16px;cursor:pointer;font-size:13px;font-weight:600;display:flex;align-items:center;gap:6px;transition:all 0.2s;"><i class='bx bxs-magic-wand'></i> Generate</button>
                </div>
            `;
            
            modalOverlay.appendChild(modalContent);
            document.body.appendChild(modalOverlay);
            
            const closeModal = () => modalOverlay.remove();
            
            modalContent.querySelector('#is-ai-modal-create-close').addEventListener('click', closeModal);
            modalContent.querySelector('#is-ai-modal-create-cancel').addEventListener('click', closeModal);
            modalOverlay.addEventListener('click', (ev) => { if(ev.target === modalOverlay) closeModal(); });
            
            const promptInput = modalContent.querySelector('#is-ai-create-prompt-input');
            promptInput.focus();

            const refineBtn = modalContent.querySelector('#is-ai-create-refine-btn');
            const revertBtn = modalContent.querySelector('#is-ai-create-revert-btn');
            let originalPrompt = '';

            refineBtn.addEventListener('click', async () => {
                const currentVal = promptInput.value.trim();
                if (!currentVal) {
                    promptInput.style.borderColor = '#ef4444';
                    return;
                }
                
                originalPrompt = currentVal;
                refineBtn.innerHTML = "<i class='bx bx-loader-alt bx-spin'></i> Refining...";
                refineBtn.disabled = true;
                refineBtn.style.opacity = '0.5';
                
                try {
                    const settings = {
                        provider: localStorage.getItem('worldtools_ai_provider') || 'gemini',
                        geminiKey: localStorage.getItem('worldtools_gemini_key') || '',
                        customBaseUrl: localStorage.getItem('worldtools_custom_url') || '',
                        customModelId: localStorage.getItem('worldtools_custom_model') || '',
                        customApiKey: localStorage.getItem('worldtools_custom_key') || ''
                    };
                    const res = await fetch('http://localhost:3000/api/ai/refine-prompt', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ prompt: currentVal, settings })
                    });
                    const data = await res.json();
                    if (!res.ok || !data.success) throw new Error(data.error);
                    
                    promptInput.value = data.prompt;
                    revertBtn.style.display = 'block';
                } catch (err) {
                    alert('Refine failed: ' + err.message);
                } finally {
                    refineBtn.innerHTML = "<i class='bx bx-brush'></i> Refine Prompt";
                    refineBtn.disabled = false;
                    refineBtn.style.opacity = '1';
                }
            });

            revertBtn.addEventListener('click', () => {
                promptInput.value = originalPrompt;
                revertBtn.style.display = 'none';
            });
            
            modalContent.querySelector('#is-ai-modal-create-submit').addEventListener('click', async () => {
                const promptVal = promptInput.value.trim();
                if (!promptVal) {
                    promptInput.style.borderColor = '#ef4444';
                    return;
                }
                
                const modelVal = modalContent.querySelector('#is-ai-create-model-select').value;
                const ratioVal = modalContent.querySelector('#is-ai-create-ratio').value;
                const sizeVal = modalContent.querySelector('#is-ai-create-size').value;
                
                const btnSubmit = modalContent.querySelector('#is-ai-modal-create-submit');
                btnSubmit.innerHTML = "<i class='bx bx-loader-alt bx-spin'></i> Generating...";
                btnSubmit.disabled = true;
                btnSubmit.style.opacity = '0.7';
                
                const loadingMsg = document.createElement('div');
                loadingMsg.innerHTML = "This may take 10-30 seconds. Please wait...";
                loadingMsg.style.cssText = "color:#10b981;font-size:12px;margin-top:10px;text-align:center;width:100%;";
                modalContent.querySelector('.bx-loader-alt').parentElement.parentElement.appendChild(loadingMsg);
                
                try {
                    const settings = { imageKey: localStorage.getItem('worldtools_image_key') || '' };

                    const res = await fetch('http://localhost:3000/api/ai/generate-image', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            prompt: promptVal, 
                            model: modelVal, 
                            aspect_ratio: ratioVal,
                            settings 
                        })
                    });
                    
                    const data = await res.json();
                    if (!res.ok || !data.success) throw new Error(data.error || data.message || "Failed to generate image");

                    const newImg = new Image();
                    newImg.crossOrigin = 'anonymous';
                    newImg.onload = () => {
                        closeModal();
                        
                        // Calculate dimensions based on size selection
                        let scale = 0.5;
                        if (sizeVal === 'small') scale = 0.25;
                        else if (sizeVal === 'large') scale = 0.75;
                        else if (sizeVal === 'full') scale = 1.0;
                        
                        let iw = newImg.width;
                        let ih = newImg.height;
                        
                        // Scale down to fit inside canvas based on scale
                        let drawW = canvas.width * scale;
                        let drawH = (ih / iw) * drawW;
                        
                        if (drawH > canvas.height * scale) {
                            drawH = canvas.height * scale;
                            drawW = (iw / ih) * drawH;
                        }
                        
                        const shape = {
                            id: nextShapeId(),
                            type: 'image',
                            img: newImg,
                            x: (canvas.width - drawW) / 2,
                            y: (canvas.height - drawH) / 2,
                            x2: (canvas.width - drawW) / 2 + drawW,
                            y2: (canvas.height - drawH) / 2 + drawH
                        };
                        
                        vectorShapes.push(shape);
                        activeVectorShape = shape;
                        
                        // Switch to Select tool to let user interact with object
                        if (typeof currentTool !== 'undefined') {
                            currentTool = 'select';
                            document.querySelectorAll('.is-tool-btn').forEach(t => t.classList.remove('active'));
                            const selBtn = document.querySelector('[data-tool="select"]');
                            if (selBtn) selBtn.classList.add('active');
                            canvas.style.cursor = 'default';
                        }
                        
                        saveState();
                        drawSelectionOverlay();
                    };
                    newImg.onerror = () => {
                        closeModal();
                        alert("Failed to load generated image.");
                    };
                    newImg.src = data.imageUrl || data.imageBase64;
                    
                } catch (err) {
                    console.error(err);
                    alert("Generation failed: " + err.message);
                    btnSubmit.innerHTML = "<i class='bx bxs-magic-wand'></i> Generate";
                    btnSubmit.disabled = false;
                    btnSubmit.style.opacity = '1';
                    loadingMsg.remove();
                }
            });
        });
        // Action 4: Analysis with AI
        menu.querySelector('#is-ai-opt-analyze').addEventListener('click', async (e) => {
            e.stopPropagation();
            menu.remove();
            document.removeEventListener('pointerdown', closeMenu);
            
            // Lấy dữ liệu ảnh
            let imageDataUrl = '';
            if (activeVectorShape && activeVectorShape.type === 'image') {
                const tempC = document.createElement('canvas');
                tempC.width = Math.abs(activeVectorShape.x2 - activeVectorShape.x);
                tempC.height = Math.abs(activeVectorShape.y2 - activeVectorShape.y);
                const tCtx = tempC.getContext('2d');
                tCtx.drawImage(activeVectorShape.img, 0, 0, tempC.width, tempC.height);
                imageDataUrl = tempC.toDataURL('image/jpeg', 0.8);
            } else {
                imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
            }

            if (!window.aiAnalysisHistory) window.aiAnalysisHistory = [];
            
            // Add a temporary loading item
            const loadingId = Date.now();
            window.aiAnalysisHistory.unshift({
                id: loadingId,
                image: imageDataUrl,
                result: null, // null indicates loading
                time: new Date().toLocaleTimeString()
            });
            
            showAiAnalysisPopup(loadingId);

            try {
                const reqPrompt = "Hãy phân tích chi tiết bức ảnh này theo các mục sau:\n1. **Nội dung chính**: Bức ảnh chứa những gì?\n2. **Style & Màu sắc**: Phong cách nghệ thuật, ánh sáng, tone màu chủ đạo?\n3. **Prompt gợi ý**: Đề xuất 1 prompt tiếng Anh chi tiết để tạo ra bức ảnh có phong cách và nội dung tương tự.";
                
                const settings = {
                    provider: localStorage.getItem('worldtools_ai_provider') || 'gemini',
                    geminiKey: localStorage.getItem('worldtools_gemini_key') || '',
                    customBaseUrl: localStorage.getItem('worldtools_custom_url') || '',
                    customModelId: localStorage.getItem('worldtools_custom_model') || '',
                    customApiKey: localStorage.getItem('worldtools_custom_key') || ''
                };

                const res = await fetch('http://localhost:3000/api/ai/vision', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        imageBase64: imageDataUrl,
                        prompt: reqPrompt,
                        settings: settings
                    })
                });
                
                const data = await res.json();
                if (data.error) throw new Error(data.error);

                // Update the loading item with actual result
                const itemIdx = window.aiAnalysisHistory.findIndex(i => i.id === loadingId);
                if (itemIdx !== -1) {
                    window.aiAnalysisHistory[itemIdx].result = data.result;
                }
                showAiAnalysisPopup(loadingId);

            } catch (err) {
                console.error(err);
                const itemIdx = window.aiAnalysisHistory.findIndex(i => i.id === loadingId);
                if (itemIdx !== -1) {
                    window.aiAnalysisHistory[itemIdx].result = "**Lỗi phân tích:** " + err.message;
                }
                showAiAnalysisPopup(loadingId);
            }
        });

        
        // Action 5: Flatten Object Down -> Removed from right click menu
    };

    function showAiAnalysisPopup(activeId = null) {
        let popup = container.querySelector('#is-ai-analysis-popup');
        if (!popup) {
            popup = document.createElement('div');
            popup.id = 'is-ai-analysis-popup';
            popup.style.cssText = 'position:absolute; top:10%; left:50%; transform:translateX(-50%); width:700px; max-width:90%; max-height:80%; background:#252526; border:1px solid rgba(255,255,255,0.1); border-radius:8px; box-shadow:0 10px 30px rgba(0,0,0,0.8); z-index:1000; display:flex; flex-direction:column; overflow:hidden; font-family:system-ui,sans-serif;';
            container.appendChild(popup);
        }
        
        if (!window.aiAnalysisHistory || window.aiAnalysisHistory.length === 0) {
            alert("Chưa có lịch sử phân tích ảnh nào.");
            popup.remove();
            return;
        }
        
        let activeIdx = 0;
        if (activeId) {
            const idx = window.aiAnalysisHistory.findIndex(i => i.id === activeId);
            if (idx !== -1) activeIdx = idx;
        }
        
        let historyHTML = window.aiAnalysisHistory.map((item, idx) => `
            <div class="is-ai-history-item" data-idx="${idx}" style="padding: 8px; border-bottom: 1px solid rgba(255,255,255,0.05); cursor: pointer; display: flex; gap: 8px; align-items: center; background: ${idx === activeIdx ? 'rgba(255,255,255,0.1)' : 'transparent'};">
                <img src="${item.image}" style="width: 48px; height: 48px; object-fit: cover; border-radius: 4px; background: #111;">
                <div style="flex:1; overflow:hidden;">
                    <div style="font-size: 11px; color: #ccc; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><i class='bx bx-time'></i> ${item.time}</div>
                    <div style="font-size: 10px; color: #888; margin-top:2px;">
                        ${item.result === null ? '<i class="bx bx-loader-alt bx-spin" style="color:#60a5fa;"></i> Đang xử lý...' : (item.result.substring(0, 20) + '...')}
                    </div>
                </div>
            </div>
        `).join('');

        const currentItem = window.aiAnalysisHistory[activeIdx];

        popup.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 16px; background:rgba(0,0,0,0.2); border-bottom:1px solid rgba(255,255,255,0.05);">
                <div style="font-size: 14px; font-weight: 600; color: #fff;"><i class='bx bx-search-alt' style="color:#60a5fa; margin-right:4px;"></i> AI Image Analysis</div>
                <button id="is-ai-analysis-close" class="is-btn-icon" style="color:#aaa;"><i class='bx bx-x' style="font-size:20px;"></i></button>
            </div>
            <div style="display:flex; flex:1; overflow:hidden; height: 500px;">
                <div style="width: 180px; background: rgba(0,0,0,0.1); border-right: 1px solid rgba(255,255,255,0.05); overflow-y: auto;" id="is-ai-history-list">
                    ${historyHTML}
                </div>
                <div style="flex:1; padding: 16px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; background: #1e1e1e;" id="is-ai-analysis-content">
                    <!-- Content injected here -->
                </div>
            </div>
        `;

        const renderContent = (item) => {
            let contentHTML = '';
            if (item.result === null) {
                contentHTML = `<div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height: 200px; color: #aaa;">
                    <i class='bx bx-loader-alt bx-spin' style="font-size: 32px; color: #60a5fa; margin-bottom: 12px;"></i>
                    <span style="font-size: 13px;">AI đang phân tích ảnh, vui lòng chờ...</span>
                </div>`;
            } else {
                const formattedText = item.result
                    .replace(/^#+\s+/gm, '') // Remove markdown headers completely
                    .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#60a5fa;">$1</strong>')
                    .replace(/\n/g, '<br>')
                    .replace(/\* (.*?)(<br>|$)/g, '<li style="margin-bottom:4px;">$1</li>');
                    
                contentHTML = `<div style="font-size: 13px; color: #ddd; line-height: 1.6; user-select: text; padding-bottom: 20px;">${formattedText}</div>`;
            }

            container.querySelector('#is-ai-analysis-content').innerHTML = `
                <div style="text-align: center; background: #111; padding: 8px; border-radius: 6px; border:1px solid rgba(255,255,255,0.05); flex-shrink: 0;">
                    <img src="${item.image}" style="max-width: 100%; max-height: 220px; object-fit: contain; border-radius: 4px;">
                </div>
                ${contentHTML}
            `;
        };

        renderContent(currentItem);

        popup.querySelector('#is-ai-analysis-close').addEventListener('click', () => popup.remove());
        
        popup.querySelectorAll('.is-ai-history-item').forEach(el => {
            el.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.getAttribute('data-idx'));
                popup.querySelectorAll('.is-ai-history-item').forEach(i => i.style.background = 'transparent');
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                renderContent(window.aiAnalysisHistory[idx]);
            });
        });
    }

    container.querySelector('#is-ai-history-btn').addEventListener('click', () => showAiAnalysisPopup());

    container.querySelector('#is-canvas-smart-remove').addEventListener('click', smartRemoveHandler);
    container.querySelector('#is-obj-smart-remove').addEventListener('click', smartRemoveHandler);
    
    container.querySelector('#is-obj-flatten').addEventListener('click', (e) => {
        if (!activeVectorShape) return;
        if (typeof drawShape === 'function') drawShape(ctx, activeVectorShape);
        const idx = vectorShapes.indexOf(activeVectorShape);
        if (idx > -1) vectorShapes.splice(idx, 1);
        activeVectorShape = null;
        saveState();
        drawSelectionOverlay();
    });

    container.querySelector('#is-obj-copy').addEventListener('click', async (e) => {
        if (!activeVectorShape) return;
        try {
            const s = activeVectorShape;
            const minX = Math.min(s.x, s.x2);
            const maxX = Math.max(s.x, s.x2);
            const minY = Math.min(s.y, s.y2);
            const maxY = Math.max(s.y, s.y2);
            
            const pad = (s.strokeWidth || 0) + 10;
            const targetW = Math.abs(maxX - minX) + pad*2;
            const targetH = Math.abs(maxY - minY) + pad*2;
            
            const tempC = document.createElement('canvas');
            tempC.width = targetW;
            tempC.height = targetH;
            const tCtx = tempC.getContext('2d');
            
            tCtx.translate(-minX + pad, -minY + pad);
            if (typeof drawShape === 'function') drawShape(tCtx, s);
            
            tempC.toBlob(async (blob) => {
                if (blob) {
                    try {
                        await navigator.clipboard.write([
                            new window.ClipboardItem({ 'image/png': blob })
                        ]);
                        alert('Object copied to clipboard successfully!');
                    } catch(clipboardErr) {
                        console.error(clipboardErr);
                        alert('Failed to copy. Your browser might not support clipboard API.');
                    }
                }
            }, 'image/png');
        } catch(err) {
            console.error(err);
            alert("Error copying object: " + err.message);
        }
    });

    // Initialize default tool to select
    const defaultToolBtn = container.querySelector('.is-tool[data-tool="select"]');
    if (defaultToolBtn) defaultToolBtn.click();
    
    // Set initial zoom to fit canvas nicely
    setTimeout(() => {
        const cContainer = container.querySelector('#is-canvas-container');
        if (cContainer) {
            const rect = cContainer.getBoundingClientRect();
            const pad = 80;
            const scaleX = (rect.width - pad) / canvas.width;
            const scaleY = (rect.height - pad) / canvas.height;
            const scale = Math.min(scaleX, scaleY, 1);
            const initialZoom = Math.max(10, Math.floor(scale * 100));
            zoomSlider.value = initialZoom;
            zoomSlider.dispatchEvent(new Event('input'));
        }
    }, 50);

    // === CUSTOM PRO COLOR PICKER ===
    const existingCp = document.getElementById('is-pro-color-picker');
    if (existingCp) existingCp.remove();

    const cpContainer = document.createElement('div');
    cpContainer.innerHTML = `
        <div id="is-pro-color-picker" style="display: none; position: absolute; background: #252526; border: 1px solid #444; border-radius: 8px; box-shadow: 0 8px 32px rgba(0,0,0,0.8); z-index: 9999; padding: 12px; width: 220px; flex-direction: column; gap: 12px; user-select: none; font-family: sans-serif;">
            <canvas id="is-cp-sl" width="196" height="150" style="border-radius: 4px; cursor: crosshair; display: block; border: 1px solid rgba(255,255,255,0.1);"></canvas>
            <input type="range" id="is-cp-hue" min="0" max="360" value="0" style="width: 100%; height: 12px; appearance: none; border-radius: 6px; outline: none; background: linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%); cursor: pointer;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <div id="is-cp-preview" style="width: 28px; height: 28px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.2); background: #ff0000; box-shadow: inset 0 0 4px rgba(0,0,0,0.5);"></div>
                <input type="text" id="is-cp-hex" value="#FF0000" style="width: 80px; background: #111; color: #fff; border: 1px solid #444; border-radius: 4px; padding: 6px; text-align: center; font-family: monospace; font-size: 13px; outline: none; font-weight: bold; text-transform: uppercase;">
            </div>
            <div style="width: 100%; height: 1px; background: rgba(255,255,255,0.1);"></div>
            <div id="is-cp-swatches" style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 6px;"></div>
        </div>
    `;
    document.body.appendChild(cpContainer.firstElementChild);

    const cpPopup = document.getElementById('is-pro-color-picker');
    const cpSL = cpPopup.querySelector('#is-cp-sl');
    const cpSLContext = cpSL.getContext('2d');
    const cpHue = cpPopup.querySelector('#is-cp-hue');
    const cpHex = cpPopup.querySelector('#is-cp-hex');
    const cpPreview = cpPopup.querySelector('#is-cp-preview');
    const cpSwatches = cpPopup.querySelector('#is-cp-swatches');

    let currentHSV = { h: 0, s: 1, v: 1 };
    let cpTargetInput = null;
    let cpFakeBtn = null;

    function hsvToRgb(h, s, v) {
        let r, g, b, i, f, p, q, t;
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }
    function rgbToHex(r, g, b) {
        return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase();
    }
    function hexToHsv(hex) {
        if (!hex) return {h:0, s:1, v:1};
        let r = parseInt(hex.slice(1, 3), 16) / 255;
        let g = parseInt(hex.slice(3, 5), 16) / 255;
        let b = parseInt(hex.slice(5, 7), 16) / 255;
        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h = 0, s = 0, v = max;
        let d = max - min;
        s = max === 0 ? 0 : d / max;
        if (max !== min) {
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return { h: h * 360, s: s, v: v };
    }
    function renderSL() {
        cpSLContext.fillStyle = `hsl(${currentHSV.h}, 100%, 50%)`;
        cpSLContext.fillRect(0, 0, cpSL.width, cpSL.height);
        let wg = cpSLContext.createLinearGradient(0, 0, cpSL.width, 0);
        wg.addColorStop(0, 'rgba(255,255,255,1)'); wg.addColorStop(1, 'rgba(255,255,255,0)');
        cpSLContext.fillStyle = wg; cpSLContext.fillRect(0, 0, cpSL.width, cpSL.height);
        let bg = cpSLContext.createLinearGradient(0, 0, 0, cpSL.height);
        bg.addColorStop(0, 'rgba(0,0,0,0)'); bg.addColorStop(1, 'rgba(0,0,0,1)');
        cpSLContext.fillStyle = bg; cpSLContext.fillRect(0, 0, cpSL.width, cpSL.height);
        
        let cx = currentHSV.s * cpSL.width;
        let cy = (1 - currentHSV.v) * cpSL.height;
        cpSLContext.beginPath();
        cpSLContext.arc(cx, cy, 6, 0, Math.PI*2);
        cpSLContext.strokeStyle = currentHSV.v > 0.5 && currentHSV.s < 0.5 ? '#000' : '#fff';
        cpSLContext.lineWidth = 2;
        cpSLContext.stroke();
    }
    function updateColorFromHSV() {
        const rgb = hsvToRgb(currentHSV.h / 360, currentHSV.s, currentHSV.v);
        const hex = rgbToHex(rgb[0], rgb[1], rgb[2]);
        cpPreview.style.background = hex;
        cpHex.value = hex;
        if (cpTargetInput && cpFakeBtn) {
            cpFakeBtn.style.background = hex;
            cpTargetInput.value = hex;
            cpTargetInput.dispatchEvent(new Event('input', { bubbles: true }));
            cpTargetInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
        renderSL();
    }
    
    let isDraggingSL = false;
    function handleSLMove(e) {
        if (!isDraggingSL) return;
        const rect = cpSL.getBoundingClientRect();
        let x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        let y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
        currentHSV.s = x / rect.width;
        currentHSV.v = 1 - (y / rect.height);
        updateColorFromHSV();
    }
    cpSL.addEventListener('mousedown', (e) => { isDraggingSL = true; handleSLMove(e); });
    window.addEventListener('mousemove', handleSLMove);
    window.addEventListener('mouseup', () => isDraggingSL = false);
    cpHue.addEventListener('input', (e) => { currentHSV.h = parseFloat(e.target.value); updateColorFromHSV(); });
    cpHex.addEventListener('change', (e) => {
        let val = e.target.value.trim();
        if (!val.startsWith('#')) val = '#' + val;
        if (/^#[0-9A-Fa-f]{6}$/i.test(val)) {
            currentHSV = hexToHsv(val);
            cpHue.value = currentHSV.h;
            updateColorFromHSV();
        }
    });
    
    const proSwatches = [
        'transparent', '#000000', '#333333', '#666666', '#999999', '#cccccc', '#ffffff',
        '#ff0000', '#ff5722', '#ff9800', '#ffeb3b', '#cddc39', '#8bc34a',
        '#4caf50', '#009688', '#00bcd4', '#03a9f4', '#2196f3', '#3f51b5',
        '#673ab7', '#9c27b0', '#e91e63', '#f44336', '#795548', '#607d8b'
    ];
    proSwatches.forEach(c => {
        const sw = document.createElement('div');
        sw.style.cssText = `width: 100%; aspect-ratio: 1; border-radius: 4px; background: ${c}; cursor: pointer; border: 1px solid rgba(255,255,255,0.2); transition: 0.1s;`;
        if (c === 'transparent') {
            sw.style.background = '#111';
            sw.style.display = 'flex';
            sw.style.alignItems = 'center';
            sw.style.justifyContent = 'center';
            sw.innerHTML = `<div style="width: 20px; height: 20px; border-radius: 50%; border: 2px solid #ff4444; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; box-sizing: border-box;"><div style="width: 150%; height: 2px; background: #ff4444; transform: rotate(-45deg); position: absolute;"></div></div>`;
        }
        sw.onmouseenter = () => sw.style.transform = 'scale(1.1)';
        sw.onmouseleave = () => sw.style.transform = 'scale(1)';
        sw.onclick = () => {
            if (c === 'transparent') {
                if (cpTargetInput && cpFakeBtn) {
                    cpTargetInput.dataset.transparent = 'true';
                    cpFakeBtn.style.background = 'repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 10px 10px';
                    cpFakeBtn.style.backgroundColor = '#fff';
                    cpPreview.style.background = 'repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 10px 10px';
                    cpPreview.style.backgroundColor = '#fff';
                    cpHex.value = 'NONE';
                    cpTargetInput.dispatchEvent(new Event('input', { bubbles: true }));
                    cpTargetInput.dispatchEvent(new Event('change', { bubbles: true }));
                }
                return;
            }
            if (cpTargetInput) cpTargetInput.dataset.transparent = 'false';
            currentHSV = hexToHsv(c);
            cpHue.value = currentHSV.h;
            updateColorFromHSV();
        };
        cpSwatches.appendChild(sw);
    });

    container.querySelectorAll('input[type="color"]').forEach(inp => {
        const parent = inp.parentNode;
        inp.style.display = 'none';
        
        const fakeBtn = document.createElement('div');
        fakeBtn.className = 'is-pro-color-btn';
        fakeBtn.style.cssText = `width: ${inp.style.width || '24px'}; height: ${inp.style.height || '24px'}; border-radius: 4px; cursor: pointer; background: ${inp.value}; border: 1px solid rgba(255,255,255,0.2); display: inline-block; vertical-align: middle;`;
        if (inp.style.marginLeft) fakeBtn.style.marginLeft = inp.style.marginLeft;
        
        parent.insertBefore(fakeBtn, inp);
        
        const observer = new MutationObserver(() => {
            if (inp.dataset.transparent === 'true') {
                fakeBtn.style.background = 'repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 10px 10px';
                fakeBtn.style.backgroundColor = '#fff';
            } else {
                fakeBtn.style.background = inp.value;
            }
        });
        observer.observe(inp, { attributes: true, attributeFilter: ['value', 'data-transparent'] });

        fakeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            cpTargetInput = inp;
            cpFakeBtn = fakeBtn;
            currentHSV = hexToHsv(inp.value);
            cpHue.value = currentHSV.h;
            renderSL();
            cpPreview.style.background = inp.value;
            cpHex.value = inp.value.toUpperCase();
            
            const rect = fakeBtn.getBoundingClientRect();
            
            cpPopup.style.display = 'flex';
            cpPopup.style.top = (rect.bottom + window.scrollY + 8) + 'px';
            cpPopup.style.left = (rect.left + window.scrollX) + 'px';
            
            const pRect = cpPopup.getBoundingClientRect();
            if (pRect.right > window.innerWidth) {
                cpPopup.style.left = (window.innerWidth - pRect.width - 16 + window.scrollX) + 'px';
            }
        });
    });

    document.addEventListener('mousedown', (e) => {
        if (cpPopup.style.display === 'flex' && !cpPopup.contains(e.target) && !e.target.classList.contains('is-pro-color-btn')) {
            cpPopup.style.display = 'none';
        }
    });
}
