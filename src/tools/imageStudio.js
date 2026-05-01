import { removeBackground } from '@imgly/background-removal';

export function renderImageStudio(container) {
    container.innerHTML = `
        <div style="display: flex; flex-direction: column; height: calc(100vh - 48px); border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); overflow: hidden; background: #1e1e1e; margin-top: -10px;">
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
                            <button id="is-apply-filters" class="btn-primary" style="width: 100%; padding: 6px; font-size: 12px;">Apply</button>
                        </div>
                    </div>

                    <!-- AI Tools -->
                    <button class="is-btn-text" id="is-ai-enhance" style="color: #a855f7;"><i class='bx bx-magic-wand'></i> Auto Enhance</button>
                </div>
                
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 11px; color: #888;" id="is-size-info">800 x 600</span>
                    <div class="is-divider"></div>
                    <button class="is-btn-icon" onclick="document.getElementById('is-zoom').value = Math.max(10, parseInt(document.getElementById('is-zoom').value) - 10); document.getElementById('is-zoom').dispatchEvent(new Event('input'));"><i class='bx bx-minus'></i></button>
                    <input type="range" id="is-zoom" min="10" max="400" value="100" style="width: 80px; height: 2px;">
                    <button class="is-btn-icon" onclick="document.getElementById('is-zoom').value = Math.min(400, parseInt(document.getElementById('is-zoom').value) + 10); document.getElementById('is-zoom').dispatchEvent(new Event('input'));"><i class='bx bx-plus'></i></button>
                    <span style="font-size: 11px; color: #aaa; width: 32px; text-align: right;" id="is-zoom-val">100%</span>
                </div>
            </div>

            <div style="display: flex; flex: 1; overflow: hidden; position: relative;">
                <!-- ULTRA COMPACT LEFT TOOLBAR -->
                <div style="width: 40px; background: #252526; border-right: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; align-items: center; padding: 8px 0; gap: 4px; z-index: 10;">
                    <button class="is-btn-icon is-tool" data-tool="select" title="Select Object (V)"><i class='bx bx-pointer'></i></button>
                    <button class="is-btn-icon is-tool" data-tool="region" title="Select Region"><i class='bx bx-crop'></i></button>
                    <div style="width: 24px; height: 1px; background: rgba(255,255,255,0.1); margin: 4px 0;"></div>
                    <button class="is-btn-icon is-tool active" data-tool="brush" title="Brush"><i class='bx bx-paint'></i></button>
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
                    <!-- Text-specific controls -->
                    <span id="is-ctx-text" style="display: none; contents;">
                        <span style="font-size: 11px; color: #888;">Color</span>
                        <input type="color" id="is-text-color" value="#6366f1" style="width: 24px; height: 24px; border: none; border-radius: 4px; cursor: pointer; padding: 0; background: none;">
                        <div class="is-divider"></div>
                        <select id="is-font-family" style="background: #1e1e1e; color: #ccc; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 3px 6px; font-size: 12px; width: 140px; cursor: pointer;">
                            <option value="Arial">Arial</option>
                            <option value="Helvetica">Helvetica</option>
                            <option value="Times New Roman">Times New Roman</option>
                            <option value="Georgia">Georgia</option>
                            <option value="Courier New">Courier New</option>
                            <option value="Verdana">Verdana</option>
                            <option value="Trebuchet MS">Trebuchet MS</option>
                            <option value="Impact">Impact</option>
                            <option value="Comic Sans MS">Comic Sans MS</option>
                            <option value="Outfit">Outfit</option>
                        </select>
                        <input type="number" id="is-font-size" value="24" min="8" max="200" style="background: #1e1e1e; color: #ccc; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 3px 6px; font-size: 12px; width: 52px; text-align: center;">
                        <div class="is-divider"></div>
                        <button class="is-btn-icon is-text-style" id="is-font-bold" title="Bold" style="font-weight: bold; font-size: 14px;">B</button>
                        <button class="is-btn-icon is-text-style" id="is-font-italic" title="Italic" style="font-style: italic; font-size: 14px;">I</button>
                        <button class="is-btn-icon is-text-style" id="is-font-underline" title="Underline" style="text-decoration: underline; font-size: 14px;">U</button>
                    </span>
                    <!-- Shape-specific controls -->
                    <span id="is-ctx-shape" style="display: none; contents;">
                        <span style="font-size: 11px; color: #888;">Color</span>
                        <input type="color" id="is-shape-color" value="#6366f1" style="width: 24px; height: 24px; border: none; border-radius: 4px; cursor: pointer; padding: 0; background: none;">
                        <div class="is-divider"></div>
                        <span style="font-size: 11px; color: #888;">Stroke</span>
                        <input type="number" id="is-shape-stroke" value="5" min="1" max="50" style="background: #1e1e1e; color: #ccc; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 3px 6px; font-size: 12px; width: 48px; text-align: center;">
                    </span>
                    <!-- Brush controls -->
                    <span id="is-ctx-brush" style="display: none; contents;">
                        <span style="font-size: 11px; color: #888;">Color</span>
                        <input type="color" id="is-brush-color" value="#6366f1" style="width: 24px; height: 24px; border: none; border-radius: 4px; cursor: pointer; padding: 0; background: none;">
                        <div class="is-divider"></div>
                        <span style="font-size: 11px; color: #888;">Size</span>
                        <input type="range" id="is-brush-size" min="1" max="50" value="5" style="width: 100px; accent-color: #3b82f6;">
                        <span id="is-brush-size-val" style="font-size: 11px; color: #aaa; min-width: 28px;">5px</span>
                        <div class="is-divider"></div>
                        <span style="font-size: 11px; color: #888;">Opacity</span>
                        <input type="range" id="is-brush-opacity" min="10" max="100" value="100" style="width: 80px; accent-color: #3b82f6;">
                        <span id="is-brush-opacity-val" style="font-size: 11px; color: #aaa; min-width: 32px;">100%</span>
                    </span>
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
                        <input type="color" id="is-fill-color" value="#6366f1" style="width: 24px; height: 24px; border: none; border-radius: 4px; cursor: pointer; padding: 0; background: none;">
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
                        <input type="color" id="is-canvas-bg-color" value="#ffffff" style="width: 24px; height: 24px; border: none; border-radius: 4px; cursor: pointer; padding: 0; background: none;">
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
                        <span id="is-canvas-size-info" style="font-size: 11px; color: #aaa;"></span>
                        <div class="is-divider"></div>
                        <button class="is-btn-icon" id="is-canvas-remove-bg" title="Remove Background" style="gap: 4px; width: auto; padding: 0 8px; font-size: 11px; color: #ec4899;"><i class='bx bx-cut'></i> Remove BG</button>
                    </span>
                    <div class="is-divider" id="is-ctx-del-divider" style="display: none;"></div>
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
                        <canvas id="is-canvas" width="800" height="600" style="display: block;"></canvas>
                        <canvas id="is-overlay" width="800" height="600" style="display: block; position: absolute; top: 0; left: 0; pointer-events: none;"></canvas>
                    </div>
                </div>
            </div>
        </div>
        <style>
            .is-btn-icon { background: transparent; border: none; color: #ccc; width: 28px; height: 28px; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 16px; cursor: pointer; transition: 0.1s; }
            .is-btn-icon:hover { background: rgba(255,255,255,0.1); color: #fff; }
            .is-btn-text { background: transparent; border: none; color: #ccc; height: 28px; padding: 0 8px; border-radius: 4px; display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 500; cursor: pointer; transition: 0.1s; }
            .is-btn-text:hover { background: rgba(255,255,255,0.1); color: #fff; }
            .is-divider { width: 1px; height: 16px; background: rgba(255,255,255,0.1); margin: 0 4px; }
            .is-tool.active { background: #3b82f6 !important; color: #fff; }
            .is-text-style.active { background: rgba(59, 130, 246, 0.3) !important; color: #fff; }
            .is-slider-group { margin-bottom: 12px; font-size: 12px; color: #ccc; }
            .is-slider-group label { display: flex; justify-content: space-between; margin-bottom: 4px; }
            #is-zoom, #is-linewidth, .is-filter { accent-color: #3b82f6; }
            input[type="range"] { width: 100%; }
        </style>
    `;

    const canvas = container.querySelector('#is-canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const overlay = container.querySelector('#is-overlay');
    const octx = overlay.getContext('2d');
    
    // Fill white background initially
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // State
    let currentTool = 'brush';
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
    const sizeInfo = container.querySelector('#is-size-info');

    // Save state for Undo/Redo
    function saveState() {
        if (historyStep < history.length - 1) {
            history = history.slice(0, historyStep + 1);
        }
        // Deep clone vectorShapes (handle Image objects in 'image' shapes)
        const shapesClone = vectorShapes.map(s => {
            const clone = { ...s };
            if (s.points) clone.points = s.points.map(p => ({ ...p }));
            if (s.originalPoints) clone.originalPoints = s.originalPoints.map(p => ({ ...p }));
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
    }
    
    // Initial save
    saveState();
    
    // Flood fill (paint bucket) algorithm
    function floodFill(startX, startY, hexColor, tolerance) {
        const w = canvas.width;
        const h = canvas.height;
        if (startX < 0 || startX >= w || startY < 0 || startY >= h) return;
        
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;
        
        // Parse hex color to RGB
        const fr = parseInt(hexColor.slice(1,3), 16);
        const fg = parseInt(hexColor.slice(3,5), 16);
        const fb = parseInt(hexColor.slice(5,7), 16);
        
        // Get target color at click position
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
        
        // Scanline flood fill
        const visited = new Uint8Array(w * h);
        const stack = [[startX, startY]];
        
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
                data[fi] = fr;
                data[fi+1] = fg;
                data[fi+2] = fb;
                data[fi+3] = 255;
                visited[y * w + fx] = 1;
                
                if (y > 0 && !visited[(y-1) * w + fx]) stack.push([fx, y - 1]);
                if (y < h - 1 && !visited[(y+1) * w + fx]) stack.push([fx, y + 1]);
            }
        }
        
        ctx.putImageData(imageData, 0, 0);
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
            targetCtx.font = `${fontStyle}${s.fontSize}px ${s.fontFamily || 'Arial'}`;
            targetCtx.fillStyle = s.stroke;
            targetCtx.textBaseline = 'top';
            targetCtx.fillText(s.text, s.x, s.y);
            if (s.fontUnderline) {
                const metrics = targetCtx.measureText(s.text);
                targetCtx.beginPath();
                targetCtx.strokeStyle = s.stroke;
                targetCtx.lineWidth = Math.max(1, s.fontSize / 15);
                targetCtx.moveTo(s.x, s.y + s.fontSize + 2);
                targetCtx.lineTo(s.x + metrics.width, s.y + s.fontSize + 2);
                targetCtx.stroke();
            }
        } else if (s.type === 'path' && s.points && s.points.length > 1) {
            targetCtx.lineCap = 'round';
            targetCtx.lineJoin = 'round';
            targetCtx.globalAlpha = s.opacity || 1;
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
            targetCtx.stroke();
        }
        
        targetCtx.restore();
    }
    
    function drawSelectionOverlay() {
        octx.clearRect(0, 0, overlay.width, overlay.height);
        
        // Draw grid pattern on overlay (non-destructive)
        drawGrid(octx);
        
        vectorShapes.forEach(s => drawShape(octx, s));
        
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
            
            // 8 handles (in local rotated space)
            const localHandles = [
                {x: -w/2, y: -h/2}, {x: 0, y: -h/2}, {x: w/2, y: -h/2},
                {x: -w/2, y: 0},                      {x: w/2, y: 0},
                {x: -w/2, y: h/2},  {x: 0, y: h/2},  {x: w/2, y: h/2}
            ];
            
            octx.fillStyle = '#fff';
            octx.strokeStyle = '#000';
            octx.lineWidth = 1;
            localHandles.forEach(hnd => {
                octx.fillRect(hnd.x - 4, hnd.y - 4, 8, 8);
                octx.strokeRect(hnd.x - 4, hnd.y - 4, 8, 8);
            });
            
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
            container.querySelector('#is-ctx-back').style.display = 'flex';
            container.querySelector('#is-obj-remove-bg').style.display = 'none';
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
                container.querySelector('#is-font-size').value = s.fontSize || 24;
                container.querySelector('#is-font-bold').classList.toggle('active', !!s.fontBold);
                container.querySelector('#is-font-italic').classList.toggle('active', !!s.fontItalic);
                container.querySelector('#is-font-underline').classList.toggle('active', !!s.fontUnderline);
            } else if (s.type === 'path') {
                ctxTextSpan.style.display = 'none';
                ctxShapeSpan.style.display = 'none';
                container.querySelector('#is-ctx-brush').style.display = 'contents';
                container.querySelector('#is-brush-color').value = s.stroke || '#6366f1';
                container.querySelector('#is-brush-size').value = s.strokeWidth || 5;
                container.querySelector('#is-brush-size-val').textContent = (s.strokeWidth || 5) + 'px';
                container.querySelector('#is-brush-opacity').value = Math.round((s.opacity || 1) * 100);
                container.querySelector('#is-brush-opacity-val').textContent = Math.round((s.opacity || 1) * 100) + '%';
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
            } else {
                ctxTextSpan.style.display = 'none';
                ctxShapeSpan.style.display = 'contents';
                container.querySelector('#is-shape-color').value = s.stroke || '#6366f1';
                container.querySelector('#is-shape-stroke').value = s.strokeWidth || 5;
            }
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
            const polyTip = container.querySelector('#is-poly-tooltip');
            if (polyTip) polyTip.remove();
            if (currentTool === 'text') canvas.style.cursor = 'text';
            else if (currentTool === 'select' || currentTool === 'region') canvas.style.cursor = 'default';
            else if (currentTool === 'fill') canvas.style.cursor = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23fff' stroke='%23000' stroke-width='1.5' d='M16.56 8.94L7.62 0 6.21 1.41l2.38 2.38-5.15 5.15a1.49 1.49 0 000 2.12l5.5 5.5c.29.29.68.44 1.06.44s.77-.15 1.06-.44l5.5-5.5c.59-.58.59-1.53 0-2.12zM5.21 10L10 5.21 14.79 10H5.21zM19 11.5s-2 2.17-2 3.5c0 1.1.9 2 2 2s2-.9 2-2c0-1.33-2-3.5-2-3.5z'/%3E%3C/svg%3E") 2 22, crosshair`;
            else canvas.style.cursor = 'none'; // custom cursor for all drawing tools
            
            // Show/hide context bar based on tool
            const allCtxSpans = ['is-ctx-text','is-ctx-shape','is-ctx-brush','is-ctx-eraser','is-ctx-fill','is-ctx-crop','is-ctx-select','is-ctx-region-actions'];
            allCtxSpans.forEach(id => container.querySelector('#'+id).style.display = 'none');
            contextBar.style.display = 'flex';
            
            const isShapeTool = ['polyarrow', 'rect', 'circle', 'ellipse', 'triangle', 'diamond', 'parallelogram', 'pentagon', 'hexagon', 'star'].includes(currentTool);
            if (currentTool === 'text') {
                ctxTextSpan.style.display = 'contents';
            } else if (isShapeTool) {
                ctxShapeSpan.style.display = 'contents';
                container.querySelector('#is-shape-color').value = colorPicker.value;
                container.querySelector('#is-shape-stroke').value = lineWidthSlider.value;
            } else if (currentTool === 'brush') {
                container.querySelector('#is-ctx-brush').style.display = 'contents';
                container.querySelector('#is-brush-color').value = colorPicker.value;
                container.querySelector('#is-brush-size').value = lineWidthSlider.value;
                container.querySelector('#is-brush-size-val').textContent = lineWidthSlider.value + 'px';
                container.querySelector('#is-brush-smooth').style.display = 'none';
                container.querySelector('#is-brush-smooth-divider').style.display = 'none';
                container.querySelector('#is-smooth-level').style.display = 'none';
                container.querySelector('#is-smooth-level-label').style.display = 'none';
                container.querySelector('#is-smooth-level-val').style.display = 'none';
            } else if (currentTool === 'eraser') {
                container.querySelector('#is-ctx-eraser').style.display = 'contents';
                container.querySelector('#is-eraser-size').value = lineWidthSlider.value;
                container.querySelector('#is-eraser-size-val').textContent = lineWidthSlider.value + 'px';
            } else if (currentTool === 'fill') {
                container.querySelector('#is-ctx-fill').style.display = 'contents';
                container.querySelector('#is-fill-color').value = colorPicker.value;
            } else if (currentTool === 'crop' || currentTool === 'region') {
                container.querySelector('#is-ctx-crop').style.display = 'contents';
            } else if (currentTool === 'select') {
                container.querySelector('#is-ctx-select').style.display = 'contents';
            }
            // Hide delete button when no object is selected
            container.querySelector('#is-ctx-del').style.display = 'none';
            container.querySelector('#is-ctx-del-divider').style.display = 'none';
            container.querySelector('#is-ctx-front').style.display = 'none';
            container.querySelector('#is-ctx-back').style.display = 'none';
            container.querySelector('#is-obj-remove-bg').style.display = 'none';
            container.querySelector('#is-polyarrow-opts').style.display = 'none';
            
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
            activeVectorShape.stroke = container.querySelector('#is-text-color').value;
            drawSelectionOverlay();
        }
    });
    
    // Font family / size changes update active text shape
    container.querySelector('#is-font-family').addEventListener('change', () => {
        if (activeVectorShape && activeVectorShape.type === 'text') {
            activeVectorShape.fontFamily = container.querySelector('#is-font-family').value;
            recalcTextBounds(activeVectorShape);
            drawSelectionOverlay();
        }
    });
    container.querySelector('#is-font-size').addEventListener('input', () => {
        if (activeVectorShape && activeVectorShape.type === 'text') {
            activeVectorShape.fontSize = parseInt(container.querySelector('#is-font-size').value) || 24;
            recalcTextBounds(activeVectorShape);
            drawSelectionOverlay();
        }
    });
    
    // Recalculate text bounding box
    function recalcTextBounds(s) {
        let fontStr = '';
        if (s.fontItalic) fontStr += 'italic ';
        if (s.fontBold) fontStr += 'bold ';
        ctx.font = `${fontStr}${s.fontSize}px ${s.fontFamily || 'Arial'}`;
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
    container.querySelector('#is-brush-opacity').addEventListener('input', (e) => {
        container.querySelector('#is-brush-opacity-val').textContent = e.target.value + '%';
        if (activeVectorShape && activeVectorShape.type === 'path') {
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
            let zoom = parseInt(zoomSlider.value);
            zoom += e.deltaY > 0 ? -15 : 15;
            zoom = Math.max(10, Math.min(400, zoom));
            zoomSlider.value = zoom;
            zoomSlider.dispatchEvent(new Event('input'));
        }
    });

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

    canvas.addEventListener('mousedown', (e) => {
        if (e.button === 1 || isSpaceDown) return; // Ignore if panning
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

                // 8 handles in local space
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
                
                let p = s.strokeWidth / 2 + 5;
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
            
            if (hitShape) {
                // If we're in control point editing mode on the active shape,
                // clicking the shape body should not start a move - only handles work
                if (hitShape === activeVectorShape && activeVectorShape.originalPoints && activeVectorShape.originalPoints.length > 1) {
                    // Stay selected but don't start move
                    return;
                }
                activeVectorShape = hitShape;
                resizingHandle = 'move';
                startX = pos.x; startY = pos.y;
                selection = null; // drop raster selection
                drawSelectionOverlay();
                return;
            }
            
            
            activeVectorShape = null;
            // Hide object buttons, show canvas context
            container.querySelector('#is-ctx-del').style.display = 'none';
            container.querySelector('#is-ctx-del-divider').style.display = 'none';
            container.querySelector('#is-ctx-front').style.display = 'none';
            container.querySelector('#is-ctx-back').style.display = 'none';
            container.querySelector('#is-obj-remove-bg').style.display = 'none';
            container.querySelector('#is-polyarrow-opts').style.display = 'none';
            const allSpans = ['is-ctx-text','is-ctx-shape','is-ctx-brush','is-ctx-eraser','is-ctx-fill','is-ctx-crop','is-ctx-select','is-ctx-region-actions'];
            allSpans.forEach(id => container.querySelector('#'+id).style.display = 'none');
            container.querySelector('#is-ctx-select').style.display = 'contents';
            container.querySelector('#is-canvas-size-info').textContent = `Canvas: ${canvas.width} × ${canvas.height}`;
            contextBar.style.display = 'flex';
            drawSelectionOverlay();
            return;
        }
        
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
                const shapeColor = container.querySelector('#is-shape-color').value;
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
            let tip = container.querySelector('#is-poly-tooltip');
            if (!tip) {
                tip = document.createElement('div');
                tip.id = 'is-poly-tooltip';
                tip.style.cssText = 'position:absolute; bottom:12px; left:50%; transform:translateX(-50%); background:rgba(0,0,0,0.85); color:#fff; padding:6px 14px; border-radius:6px; font-size:12px; pointer-events:none; z-index:100; white-space:nowrap; backdrop-filter:blur(4px); border:1px solid rgba(255,255,255,0.1);';
                tip.innerHTML = "Click to add points &nbsp;·&nbsp; <b style='color:#60a5fa;'>Space</b> to finish &nbsp;·&nbsp; <b style='color:#f87171;'>Esc</b> to cancel";
                container.querySelector('#is-canvas-container').appendChild(tip);
            }
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
            const fontSize = parseInt(container.querySelector('#is-font-size').value) || 24;
            const isBold = container.querySelector('#is-font-bold').classList.contains('active');
            const isItalic = container.querySelector('#is-font-italic').classList.contains('active');
            const isUnderline = container.querySelector('#is-font-underline').classList.contains('active');
            
            const input = document.createElement('div');
            input.className = 'is-text-input';
            input.contentEditable = true;
            input.style.position = 'absolute';
            input.style.left = startX + 'px';
            input.style.top = startY + 'px';
            input.style.color = container.querySelector('#is-text-color').value;
            input.style.fontSize = fontSize + 'px';
            input.style.fontFamily = fontFamily;
            input.style.fontWeight = isBold ? 'bold' : 'normal';
            input.style.fontStyle = isItalic ? 'italic' : 'normal';
            input.style.textDecoration = isUnderline ? 'underline' : 'none';
            input.style.lineHeight = '1';
            input.style.outline = '2px dashed rgba(0,0,0,0.5)';
            input.style.outlineOffset = '2px';
            input.style.minWidth = '20px';
            input.style.minHeight = '1em';
            input.style.padding = '0';
            input.style.margin = '0';
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
                    ctx.font = `${fontStr}${fontSize}px ${fontFamily}`;
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
                        stroke: container.querySelector('#is-text-color').value,
                        fontSize: fontSize,
                        fontFamily: fontFamily,
                        fontBold: isBold,
                        fontItalic: isItalic,
                        fontUnderline: isUnderline,
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
            const fillColor = container.querySelector('#is-fill-color').value;
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
            ctx.globalAlpha = (parseInt(container.querySelector('#is-brush-opacity').value) || 100) / 100;
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

    canvas.addEventListener('mousemove', (e) => {
        if (e.button === 1 || isSpaceDown || isPanning) return;
        const pos = getMousePos(e);

        if (currentTool === 'select') {
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
                applySmoothToShape(activeVectorShape, activeVectorShape.smoothLevel || 5);
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
                } else if (resizingHandle === 'tl') {
                    activeVectorShape.x += dx;
                    activeVectorShape.y += dy;
                } else if (resizingHandle === 'tc') {
                    activeVectorShape.y += dy;
                } else if (resizingHandle === 'tr') {
                    activeVectorShape.x2 += dx;
                    activeVectorShape.y += dy;
                } else if (resizingHandle === 'ml') {
                    activeVectorShape.x += dx;
                } else if (resizingHandle === 'mr') {
                    activeVectorShape.x2 += dx;
                } else if (resizingHandle === 'bl') {
                    activeVectorShape.x += dx;
                    activeVectorShape.y2 += dy;
                } else if (resizingHandle === 'bc') {
                    activeVectorShape.y2 += dy;
                } else if (resizingHandle === 'br') {
                    activeVectorShape.x2 += dx;
                    activeVectorShape.y2 += dy;
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
                if (!foundCursor) {
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
                    let p = s.strokeWidth / 2 + 5;
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
                    const shapeColor = container.querySelector('#is-shape-color').value;
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
                    octx.lineTo(pos.x, pos.y);
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
            const shapeColor = container.querySelector('#is-shape-color').value;
            const shapeStroke = parseInt(container.querySelector('#is-shape-stroke').value) || 5;
            drawSelectionOverlay();
            drawShape(octx, {
                type: currentTool,
                x: startX, y: startY, x2: pos.x, y2: pos.y,
                stroke: shapeColor,
                strokeWidth: shapeStroke
            });
        }
    });

    // Finalize polyarrow shape (shared logic)
    function finalizePolyArrow() {
        if (currentTool !== 'polyarrow' || currentPolyPoints.length < 2) return;
        const shapeColor = container.querySelector('#is-shape-color').value;
        const shapeStroke = parseInt(container.querySelector('#is-shape-stroke').value) || 5;
        
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
            points: currentPolyPoints.slice(),
            originalPoints: currentPolyPoints.slice(),
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
        const tip = container.querySelector('#is-poly-tooltip');
        if (tip) tip.remove();
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
                const tip = container.querySelector('#is-poly-tooltip');
                if (tip) tip.remove();
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
                input.style.outline = '2px dashed rgba(0,0,0,0.5)';
                input.style.outlineOffset = '2px';
                input.style.minWidth = '20px';
                input.style.minHeight = '1em';
                input.style.padding = '0';
                input.style.margin = '0';
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

    canvas.addEventListener('mouseup', (e) => {
        if (e.button === 1 || isSpaceDown) return;
        const pos = getMousePos(e);

        if (currentTool === 'select') {
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
            const shapeColor = container.querySelector('#is-shape-color').value;
            const shapeStroke = parseInt(container.querySelector('#is-shape-stroke').value) || 5;
            vectorShapes.push({
                id: nextShapeId(),
                type: currentTool,
                x: startX, y: startY, x2: pos.x, y2: pos.y,
                stroke: shapeColor,
                strokeWidth: shapeStroke,
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
            // Undo the raster drawing - restore from last saved state
            if (historyStep >= 0) {
                const img = new Image();
                img.onload = () => {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0);
                };
                img.src = history[historyStep].dataURL;
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
            const opacity = (parseInt(container.querySelector('#is-brush-opacity').value) || 100) / 100;
            
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
                        vectorShapes.push({
                            id: nextShapeId(),
                            type: 'image',
                            img: img,
                            x: Math.round(canvas.width/2 - w/2),
                            y: Math.round(canvas.height/2 - h/2),
                            x2: Math.round(canvas.width/2 + w/2),
                            y2: Math.round(canvas.height/2 + h/2),
                            strokeWidth: 0
                        });
                        activeVectorShape = vectorShapes[vectorShapes.length - 1];
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
            
            vectorShapes.push({
                id: nextShapeId(),
                type: 'image',
                img: tempCanvas,
                x: Math.round(canvas.width/2 - w/2),
                y: Math.round(canvas.height/2 - h/2),
                x2: Math.round(canvas.width/2 + w/2),
                y2: Math.round(canvas.height/2 + h/2),
                strokeWidth: 0
            });
            activeVectorShape = vectorShapes[vectorShapes.length - 1];
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
            activeVectorShape.stroke = container.querySelector('#is-shape-color').value;
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
    const restoreState = (step) => {
        const entry = history[step];
        if (!entry) return;
        const img = new Image();
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
        img.src = entry.dataURL;
        // Restore vector shapes
        vectorShapes = entry.shapes.map(s => {
            const clone = { ...s };
            if (s.points) clone.points = s.points.map(p => ({ ...p }));
            if (s.originalPoints) clone.originalPoints = s.originalPoints.map(p => ({ ...p }));
            if (s.type === 'image' && s.img) {
                clone.img = s.img;
            }
            return clone;
        });
        activeVectorShape = null;
        selection = null;
        drawSelectionOverlay();
    };

    container.querySelector('#is-undo').addEventListener('click', () => {
        if (historyStep > 0) {
            historyStep--;
            restoreState(historyStep);
        }
    });

    container.querySelector('#is-redo').addEventListener('click', () => {
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
                btn.innerHTML = "<i class='bx bx-magic-wand'></i> Auto Enhance";
            }, 2000);
        }, 1500);
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
}
