import { removeBackground } from '@imgly/background-removal';
import { AIClient } from '../utils/aiClient.js';
import { getApiBase } from '../utils/apiBase.js';
import { ensurePuterLoaded } from '../utils/puterLoader.js';

const IMAGE_STUDIO_PROJECT_EXTENSION = '.wtoolsimage';
const IMAGE_STUDIO_LEGACY_PROJECT_EXTENSION = '.wtools-image';

function getProjectFilename(projectName) {
    const baseName = projectName === 'Untitled'
        ? 'worldtools-image'
        : projectName.replace(/\.(?:wtoolsimage|wtools-image|json)$/i, '');
    return `${baseName}${IMAGE_STUDIO_PROJECT_EXTENSION}`;
}

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
            <div class="is-topbar" style="display: flex; justify-content: space-between; align-items: center; background: #252526; padding: 6px 12px; border-bottom: 1px solid rgba(255,255,255,0.05);">
                <div class="is-top-actions" style="display: flex; gap: 4px; align-items: center;">
                    <button class="is-btn-icon" id="is-upload-btn" title="Open (Ctrl+O)"><i class='bx bx-folder-open'></i></button>
                    <input type="file" id="is-upload" accept="image/*" style="display: none;">
                    <button class="is-btn-icon" id="is-project-open-btn" title="Open editable project"><i class='bx bx-folder'></i></button>
                    <input type="file" id="is-project-open" accept="${IMAGE_STUDIO_PROJECT_EXTENSION},${IMAGE_STUDIO_LEGACY_PROJECT_EXTENSION},.json,application/json" style="display:none;">
                    <button class="is-btn-icon" id="is-project-save-btn" title="Save editable project (Ctrl+Shift+S)"><i class='bx bx-save'></i></button>
                    <button class="is-btn-icon" id="is-project-save-as-btn" title="Save project as"><i class='bx bx-copy-alt'></i></button>
                    <span id="is-project-status" title="Project status" style="max-width:130px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#8b8b8b;font-size:10px;"></span>
                    <button class="is-btn-text" id="is-download-btn" title="Export image (Ctrl+S)"><i class='bx bx-export'></i> Export</button>
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
                    <button class="is-btn-text" id="is-ai-history-btn" title="View AI results"><i class='bx bx-history' style="color:#60a5fa;"></i> AI Results</button>
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
                    <div id="is-more-container" style="position:relative;display:none;">
                        <button class="is-btn-text" id="is-more-btn"><i class='bx bx-dots-horizontal-rounded'></i> More</button>
                        <div id="is-more-menu" style="display:none;position:absolute;top:34px;left:0;min-width:190px;background:#252526;border:1px solid rgba(255,255,255,.12);border-radius:7px;padding:6px;z-index:1000;box-shadow:0 12px 30px rgba(0,0,0,.5);">
                            <button data-more-action="ai"><i class='bx bx-history'></i> AI Results</button>
                            <button data-more-action="adjust"><i class='bx bx-slider-alt'></i> Adjustments</button>
                            <button data-more-action="merge" class="danger"><i class='bx bx-layer-minus'></i> Merge All</button>
                        </div>
                    </div>
                </div>
                
                <div class="is-zoom-actions" style="display: flex; align-items: center; gap: 4px; background: rgba(255,255,255,0.05); padding: 4px; border-radius: 6px;">
                    <button class="is-btn-icon" id="is-zoom-fit" title="Fit to window" style="width: 24px; height: 24px; font-size: 14px;"><i class='bx bx-expand'></i></button>
                    <button class="is-btn-icon" id="is-zoom-selection" title="Zoom to selection" style="width: 24px; height: 24px; font-size: 14px;"><i class='bx bx-selection'></i></button>
                    <button class="is-btn-icon" id="is-zoom-reset" title="Actual Size (100%)" style="width: 24px; height: 24px; font-size: 14px;"><i class='bx bx-target-lock'></i></button>
                    <div class="is-divider"></div>
                    <button class="is-btn-icon" onclick="document.getElementById('is-zoom').value = Math.max(10, parseInt(document.getElementById('is-zoom').value) - 10); document.getElementById('is-zoom').dispatchEvent(new Event('input'));" style="width: 24px; height: 24px;"><i class='bx bx-minus'></i></button>
                    <input type="range" id="is-zoom" min="10" max="400" value="100" style="width: 60px;">
                    <button class="is-btn-icon" onclick="document.getElementById('is-zoom').value = Math.min(400, parseInt(document.getElementById('is-zoom').value) + 10); document.getElementById('is-zoom').dispatchEvent(new Event('input'));" style="width: 24px; height: 24px;"><i class='bx bx-plus'></i></button>
                    <div style="display: flex; align-items: center; position: relative; margin-left: 2px;">
                        <input type="number" id="is-zoom-val-input" value="100" min="10" max="400" title="Zoom %" style="background: rgba(0,0,0,0.2); color: #ccc; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 2px 14px 2px 4px; font-size: 11px; width: 44px; text-align: center; outline: none; -moz-appearance: textfield;">
                        <span style="font-size: 11px; color: #888; position: absolute; right: 4px; pointer-events: none;">%</span>
                    </div>
                    <div class="is-divider"></div>
                    <button class="is-btn-icon" id="is-shortcuts-btn" title="Keyboard shortcuts" style="width:24px;height:24px;"><i class='bx bx-help-circle'></i></button>
                    <button class="is-btn-icon" id="is-panel-toggle" title="Toggle side panel" style="width:24px;height:24px;"><i class='bx bx-sidebar'></i></button>
                </div>
            </div>

            <div style="display: flex; flex: 1; overflow: hidden; position: relative;">
                <!-- ULTRA COMPACT LEFT TOOLBAR -->
                <div style="width: 40px; background: #252526; border-right: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; align-items: center; padding: 8px 0; gap: 4px; z-index: 10;">
                    <button class="is-btn-icon is-tool active" data-tool="select" title="Select Object (V)"><i class='bx bx-pointer'></i></button>
                    <button class="is-btn-icon is-tool" data-tool="hand" title="Pan canvas (H)"><i class='bx bx-move'></i></button>
                    <div style="width: 24px; height: 1px; background: rgba(255,255,255,0.1); margin: 4px 0;"></div>
                    <button class="is-btn-icon is-tool" data-tool="brush" title="Brush"><i class='bx bx-paint'></i></button>
                    <button class="is-btn-icon is-tool" data-tool="fill" title="Paint Bucket"><i class='bx bx-color-fill'></i></button>
                    <button class="is-btn-icon is-tool" data-tool="eraser" title="Eraser"><i class='bx bx-eraser'></i></button>
                    <div style="width: 24px; height: 1px; background: rgba(255,255,255,0.1); margin: 4px 0;"></div>
                    <button class="is-btn-icon is-tool" data-tool="line" title="Line - drag one segment"><i class='bx bx-minus'></i></button>
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
                <div id="is-context-bar" style="display: none; position: absolute; top: 0; left: 40px; right: 248px; background: #252526; border-bottom: 1px solid rgba(255,255,255,0.08); padding: 4px 12px; z-index: 20; align-items: center; gap: 8px; flex-wrap: wrap;">
                    <span id="is-obj-type-info" style="display: none; font-size: 11px; color: #8b8b8b; align-items: center; gap: 4px; padding: 0 4px; background: rgba(0,0,0,0.2); border-radius: 4px; border: 1px solid rgba(255,255,255,0.05); height: 22px;"></span>
                    <!-- Text-specific controls -->
                    <span id="is-ctx-text" style="display: none; contents;">
                        <span style="font-size: 11px; color: #888;">Color</span>
                        <input type="color" id="is-text-color" list="is-color-swatches" value="#000000" style="width: 24px; height: 24px; border: none; border-radius: 4px; cursor: pointer; padding: 0; background: none;">
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
                        <button class="is-btn-icon is-text-align" id="is-font-align-left" title="Align Left" data-align="left"><i class='bx bx-align-left'></i></button>
                        <button class="is-btn-icon is-text-align" id="is-font-align-center" title="Align Center" data-align="center"><i class='bx bx-align-middle'></i></button>
                        <button class="is-btn-icon is-text-align" id="is-font-align-right" title="Align Right" data-align="right"><i class='bx bx-align-right'></i></button>
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
                        <input type="color" id="is-shape-color" list="is-color-swatches" value="#2563eb" style="width: 24px; height: 24px; border: none; border-radius: 4px; cursor: pointer; padding: 0; background: none;" title="Stroke Color">
                        
                        <div class="is-divider"></div>
                        <span style="font-size: 11px; color: #888;">Fill</span>
                        <input type="color" id="is-shape-fill-color" list="is-color-swatches" value="#2563eb" data-transparent="true" style="width: 24px; height: 24px; border: none; border-radius: 4px; cursor: pointer; padding: 0; background: none;" title="Fill Color">

                        <div class="is-divider"></div>
                        <span style="font-size: 11px; color: #888;">Stroke</span>
                        <input type="number" id="is-shape-stroke" value="5" min="1" max="50" style="background: #1e1e1e; color: #ccc; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 3px 6px; font-size: 12px; width: 48px; text-align: center;">

                        <div class="is-divider" id="is-shape-radius-divider" style="display: none;"></div>
                        <span id="is-shape-radius-label" style="display: none; font-size: 11px; color: #888;">Radius</span>
                        <input type="number" id="is-shape-radius" value="0" min="0" max="200" style="display: none; background: #1e1e1e; color: #ccc; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 3px 6px; font-size: 12px; width: 48px; text-align: center;">
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
                        <button class="is-btn-icon" id="is-region-select-inside" title="Select objects completely inside" style="gap: 4px; width: auto; padding: 0 8px; font-size: 11px;"><i class='bx bx-border-inner'></i> Inside</button>
                        <button class="is-btn-icon" id="is-region-select-intersect" title="Select objects partially inside" style="gap: 4px; width: auto; padding: 0 8px; font-size: 11px;"><i class='bx bx-intersect'></i> Intersect</button>
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
                    <button class="is-btn-icon" id="is-obj-copy" title="Copy Object" style="display: none; gap: 4px; width: auto; padding: 0 8px; font-size: 11px;"><i class='bx bx-copy'></i> Copy</button>
                    <button class="is-btn-icon" id="is-obj-flatten" title="Merge Down" style="display: none; gap: 4px; width: auto; padding: 0 8px; font-size: 11px; color: #ef4444;"><i class='bx bx-layer-minus'></i> Merge</button>
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
                    <button class="is-btn-icon" id="is-ctx-group" title="Group (Ctrl+G)" style="display: none; font-size: 12px; gap:3px; width:auto; padding:0 8px; color:#22d3ee;"><i class='bx bx-group'></i> Group</button>
                    <span id="is-ctx-align" style="display: none; align-items: center; gap: 4px;">
                        <div class="is-divider"></div>
                        <button class="is-btn-icon is-obj-align" data-align="top" title="Align Top"><i class='bx bx-align-left' style='transform: rotate(90deg);'></i></button>
                        <button class="is-btn-icon is-obj-align" data-align="v-middle" title="Align Middle"><i class='bx bx-align-middle' style='transform: rotate(90deg);'></i></button>
                        <button class="is-btn-icon is-obj-align" data-align="bottom" title="Align Bottom"><i class='bx bx-align-right' style='transform: rotate(90deg);'></i></button>
                        <div class="is-divider"></div>
                        <button class="is-btn-icon is-obj-align" data-align="left" title="Align Left"><i class='bx bx-align-left'></i></button>
                        <button class="is-btn-icon is-obj-align" data-align="h-middle" title="Align Center"><i class='bx bx-align-middle'></i></button>
                        <button class="is-btn-icon is-obj-align" data-align="right" title="Align Right"><i class='bx bx-align-right'></i></button>
                    </span>
                    <button class="is-btn-icon" id="is-ctx-ungroup" title="Ungroup" style="display: none; font-size: 12px; gap:3px; width:auto; padding:0 8px; color:#fb923c;"><i class='bx bx-unlink'></i></button>
                    <button class="is-btn-icon" id="is-ctx-del" title="Delete (Del)" style="color: #fca5a5; display: none;"><i class='bx bx-trash'></i></button>
                </div>

                <!-- MAIN CANVAS AREA -->
                <div id="is-canvas-container" style="flex: 1; background: #111; overflow: hidden; display: flex; align-items: center; justify-content: center; position: relative;">
                    <div id="is-empty-state" style="position:absolute; inset:0; display:none; align-items:center; justify-content:center; z-index:15; pointer-events:none;">
                        <div style="width:min(520px, calc(100% - 48px)); background:rgba(30,30,30,0.92); border:1px solid rgba(255,255,255,0.12); border-radius:8px; box-shadow:0 20px 50px rgba(0,0,0,0.45); padding:22px; color:#f3f4f6; pointer-events:auto;">
                            <div style="display:flex; align-items:center; gap:10px; margin-bottom:10px;">
                                <i class='bx bx-image-add' style="font-size:28px; color:#60a5fa;"></i>
                                <div>
                                    <div style="font-size:18px; font-weight:700;">Start your image</div>
                                    <div style="font-size:12px; color:#a1a1aa; margin-top:2px;">Open an image, create with AI, or begin with a blank canvas.</div>
                                </div>
                            </div>
                            <div style="display:grid; grid-template-columns:repeat(3, minmax(0, 1fr)); gap:10px; margin-top:18px;">
                                <button class="is-empty-action" id="is-empty-open" type="button"><i class='bx bx-folder-open'></i><span>Open Image</span></button>
                                <button class="is-empty-action" id="is-empty-ai" type="button"><i class='bx bxs-magic-wand'></i><span>Generate AI</span></button>
                                <button class="is-empty-action" id="is-empty-blank" type="button"><i class='bx bx-edit-alt'></i><span>Blank Canvas</span></button>
                            </div>
                            <div style="font-size:11px; color:#71717a; margin-top:14px;">Tip: you can also paste an image directly from the clipboard.</div>
                        </div>
                    </div>
                    <div id="is-canvas-wrapper" style="position: relative; box-shadow: 0 0 20px rgba(0,0,0,0.8); background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/ENF5gNqGoB4TjxrAwDAJg4MGAgB/xwgfV7oJlwAAAABJRU5ErkJggg==') repeat; transition: transform 0.1s;">
                        <canvas id="is-canvas" width="1600" height="1200" style="display: block;"></canvas>
                        <canvas id="is-overlay" width="1600" height="1200" style="display: block; position: absolute; top: 0; left: 0; pointer-events: none;"></canvas>
                    </div>
                </div>
                <aside id="is-side-panel" style="width:248px; background:#202020; border-left:1px solid rgba(255,255,255,0.08); display:flex; flex-direction:column; min-width:220px;">
                    <div style="display:flex; border-bottom:1px solid rgba(255,255,255,0.08); padding:6px; gap:4px;">
                        <button class="is-panel-tab active" data-panel="layers" type="button"><i class='bx bx-layer'></i> Layers</button>
                        <button class="is-panel-tab" data-panel="props" type="button"><i class='bx bx-slider-alt'></i> Properties</button>
                        <button class="is-panel-tab" data-panel="history" type="button"><i class='bx bx-history'></i> Edit History</button>
                    </div>
                    <div class="is-panel-section active" id="is-panel-layers">
                        <div class="is-panel-head">
                            <span>Objects</span>
                            <span style="display:flex;align-items:center;gap:4px;"><button class="is-panel-icon" id="is-layer-show-all" title="Show and unlock all"><i class='bx bx-reset'></i></button><span id="is-layer-count">0</span></span>
                        </div>
                        <div id="is-group-edit-banner" style="display:none;margin-bottom:8px;"></div>
                        <div style="display:grid;grid-template-columns:1fr 86px;gap:6px;margin-bottom:8px;">
                            <input id="is-layer-search" type="search" placeholder="Search layers" aria-label="Search layers">
                            <select id="is-layer-filter" aria-label="Filter layers"><option value="all">All</option><option value="shape">Shapes</option><option value="text">Text</option><option value="image">Images</option><option value="line">Lines</option><option value="group">Groups</option></select>
                        </div>
                        <div id="is-layer-list" class="is-layer-list"></div>
                    </div>
                    <div class="is-panel-section" id="is-panel-props">
                        <div class="is-panel-head"><span>Selection</span></div>
                        <div id="is-properties-content" class="is-panel-empty">Select an object to edit its common settings.</div>
                    </div>
                    <div class="is-panel-section" id="is-panel-history">
                        <div class="is-panel-head"><span>Quick Actions</span></div>
                        <div class="is-quick-actions">
                            <button type="button" id="is-panel-undo"><i class='bx bx-undo'></i> Undo</button>
                            <button type="button" id="is-panel-redo"><i class='bx bx-redo'></i> Redo</button>
                            <button type="button" id="is-panel-save"><i class='bx bx-export'></i> Export Image</button>
                            <button type="button" id="is-panel-project"><i class='bx bx-save'></i> Save Project</button>
                        </div>
                        <div id="is-history-summary" class="is-panel-empty"></div>
                        <div id="is-history-list" class="is-history-list"></div>
                    </div>
                </aside>
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
            .is-empty-action { min-height: 72px; background:#111827; border:1px solid rgba(255,255,255,0.12); color:#e5e7eb; border-radius:7px; cursor:pointer; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:7px; font-family:inherit; font-size:12px; font-weight:600; }
            .is-empty-action:hover { background:#1f2937; border-color:rgba(96,165,250,0.55); color:#fff; }
            .is-empty-action i { font-size:22px; color:#60a5fa; }
            .is-panel-tab { flex:1; height:30px; border:none; background:transparent; color:#9ca3af; border-radius:5px; cursor:pointer; font-size:11px; display:flex; align-items:center; justify-content:center; gap:4px; font-family:inherit; }
            .is-panel-tab.active, .is-panel-tab:hover { background:rgba(255,255,255,0.08); color:#fff; }
            .is-panel-section { display:none; overflow:auto; padding:10px; flex:1; }
            .is-panel-section.active { display:block; }
            .is-panel-head { display:flex; justify-content:space-between; align-items:center; color:#d4d4d8; font-size:11px; text-transform:uppercase; letter-spacing:.4px; font-weight:700; margin-bottom:8px; }
            .is-layer-list { display:flex; flex-direction:column; gap:6px; }
            .is-layer-item { border:1px solid rgba(255,255,255,0.08); background:#181818; color:#d4d4d8; border-radius:6px; padding:7px 8px; cursor:pointer; display:flex; align-items:center; gap:8px; min-height:34px; font-size:12px; }
            .is-layer-item[draggable="true"] { cursor:grab; }
            .is-layer-item.is-hidden { opacity:.5; }
            .is-layer-item.is-locked { border-style:dashed; }
            .is-layer-item.is-child { margin-left:18px; min-height:30px; background:#151515; }
            .is-layer-item:hover { border-color:rgba(96,165,250,0.4); background:#222; }
            .is-layer-item.active { border-color:#3b82f6; background:rgba(59,130,246,0.16); color:#fff; }
            .is-layer-meta { margin-left:auto; color:#71717a; font-size:10px; }
            .is-layer-name { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; min-width:0; }
            .is-layer-actions { margin-left:auto; display:flex; gap:2px; }
            .is-layer-action, .is-panel-icon { width:24px; height:24px; border:0; border-radius:4px; background:transparent; color:#8b8b8b; display:inline-flex; align-items:center; justify-content:center; cursor:pointer; padding:0; }
            .is-layer-action:hover, .is-panel-icon:hover { background:rgba(255,255,255,.1); color:#fff; }
            .is-panel-empty { color:#8b8b8b; font-size:12px; line-height:1.45; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); border-radius:6px; padding:10px; }
            .is-prop-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
            .is-prop-field label { display:block; color:#8b8b8b; font-size:10px; margin-bottom:4px; }
            .is-prop-field input, .is-prop-field select { width:100%; box-sizing:border-box; background:#111; color:#fff; border:1px solid rgba(255,255,255,0.12); border-radius:5px; padding:6px; font-size:12px; }
            .is-quick-actions { display:grid; grid-template-columns:1fr; gap:7px; margin-bottom:10px; }
            .is-quick-actions button { height:32px; border:1px solid rgba(255,255,255,0.1); background:#181818; color:#d4d4d8; border-radius:6px; cursor:pointer; font-family:inherit; display:flex; align-items:center; justify-content:center; gap:6px; }
            .is-quick-actions button:hover { background:#252525; color:#fff; }
            .is-toast { position:absolute; top:16px; left:50%; transform:translateX(-50%); background:rgba(24,24,27,0.94); color:#fff; border:1px solid rgba(255,255,255,0.12); border-radius:20px; padding:9px 14px; z-index:9999; font-size:12px; box-shadow:0 10px 30px rgba(0,0,0,0.35); display:flex; align-items:center; gap:8px; }
            .is-modal-overlay { position:fixed; inset:0; z-index:100000; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.58); backdrop-filter:blur(4px); padding:24px; box-sizing:border-box; }
            .is-modal { width:min(420px, 100%); background:#1f1f1f; border:1px solid rgba(255,255,255,0.12); border-radius:10px; box-shadow:0 18px 50px rgba(0,0,0,0.6); padding:18px; color:#f4f4f5; font-family:inherit; box-sizing:border-box; }
            .is-modal h3 { margin:0 0 8px; font-size:16px; line-height:1.25; }
            .is-modal p { margin:0 0 16px; color:#a1a1aa; font-size:13px; line-height:1.45; }
            .is-modal-actions { display:flex; justify-content:flex-end; gap:8px; margin-top:14px; }
            .is-modal-actions button { height:34px; border-radius:6px; padding:0 12px; cursor:pointer; font-family:inherit; }
            .is-btn-secondary { background:#303030; color:#d4d4d8; border:1px solid rgba(255,255,255,0.1); }
            .is-btn-primary { background:#2563eb; color:#fff; border:1px solid rgba(37,99,235,0.8); font-weight:600; }
            .is-history-list { display:flex; flex-direction:column; gap:4px; margin-top:8px; }
            .is-history-item { width:100%; min-height:30px; border:1px solid rgba(255,255,255,.07); border-radius:5px; background:#181818; color:#aaa; display:flex; align-items:center; gap:7px; padding:0 8px; cursor:pointer; font:inherit; font-size:11px; text-align:left; }
            .is-history-item.active { color:#fff; border-color:#3b82f6; background:rgba(59,130,246,.16); }
            .is-prop-section-title { color:#d4d4d8; font-size:10px; font-weight:700; text-transform:uppercase; margin:12px 0 7px; letter-spacing:.4px; }
            .is-prop-actions { display:grid; grid-template-columns:1fr 1fr; gap:6px; }
            .is-prop-actions button { min-height:30px; border:1px solid rgba(255,255,255,.1); background:#181818; color:#ccc; border-radius:5px; cursor:pointer; font:inherit; font-size:11px; }
            .is-label-popover { position:fixed; z-index:100000; width:min(360px,calc(100vw - 24px)); background:#1f1f1f; border:1px solid rgba(255,255,255,.14); border-radius:8px; box-shadow:0 18px 50px rgba(0,0,0,.6); padding:14px; color:#f4f4f5; box-sizing:border-box; }
            #is-more-menu button { width:100%;height:32px;border:0;border-radius:5px;background:transparent;color:#ddd;display:flex;align-items:center;gap:8px;padding:0 9px;cursor:pointer;font:inherit;font-size:12px; }
            #is-more-menu button:hover { background:rgba(255,255,255,.08); } #is-more-menu button.danger { color:#f87171; }
            #is-adj-container.is-more-open { display:block !important;position:fixed !important;top:56px;left:70px;z-index:2000; }
            #is-adj-container.is-more-open > #is-adj-btn { display:none; }
            #is-adj-container.is-more-open #is-adj-menu { position:fixed !important;top:56px !important;left:70px !important;margin:0 !important; }
            #is-layer-search, #is-layer-filter { width:100%;box-sizing:border-box;background:#111;color:#ddd;border:1px solid rgba(255,255,255,.1);border-radius:5px;padding:6px;font:inherit;font-size:11px; }
            .is-group-banner { border:1px solid rgba(34,211,238,.3);background:rgba(34,211,238,.08);border-radius:6px;padding:7px;color:#a5f3fc;font-size:11px;display:flex;align-items:center;justify-content:space-between;gap:6px; }
            .is-group-banner button { border:0;background:rgba(255,255,255,.1);color:#fff;border-radius:4px;cursor:pointer;height:24px; }
            .is-prop-details { border-top:1px solid rgba(255,255,255,.07);padding-top:7px;margin-top:8px; }
            .is-prop-details summary { color:#d4d4d8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.4px;cursor:pointer;margin-bottom:8px; }
            @media (max-width: 1100px) { .is-topbar { gap:6px; } .is-top-actions { min-width:0; } .is-zoom-actions { flex-shrink:0; } #is-ai-history-btn, #is-adj-container, #is-flatten-all, #is-project-status { display:none !important; } #is-more-container { display:block !important; } #is-zoom { width:42px !important; } }
            @media (max-width: 900px) { #is-side-panel { position:absolute;right:0;top:0;bottom:0;z-index:40;box-shadow:-12px 0 28px rgba(0,0,0,.45); } #is-context-bar { right:0 !important; } }
            #is-zoom, #is-linewidth, .is-filter { accent-color: #3b82f6; }
            input[type="number"]::-webkit-outer-spin-button,
            input[type="number"]::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }
            input[type="range"] {
                -webkit-appearance: none;
                width: 100%;
                background: transparent;
            }
            input[type="range"]::-webkit-slider-runnable-track {
                width: 100%;
                height: 3px;
                cursor: pointer;
                background: linear-gradient(to right, #3b82f6 var(--val, 50%), #444 var(--val, 50%));
                border-radius: 2px;
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
            #is-cp-hue::-webkit-slider-runnable-track {
                background: transparent;
                height: 12px;
                margin-top: 0;
            }
            #is-cp-hue::-webkit-slider-thumb {
                height: 16px;
                width: 16px;
                background: #fff;
                border: 2px solid #333;
                margin-top: -2px;
                box-shadow: 0 0 4px rgba(0,0,0,0.5);
            }
        </style>
    `;

    const canvas = container.querySelector('#is-canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const overlay = container.querySelector('#is-overlay');
    const octx = overlay.getContext('2d');
    
    // Fill white background initially
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    function escapeHtml(value) {
        return String(value ?? '').replace(/[&<>"']/g, ch => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[ch]));
    }

    function showToast(message, type = 'info', ms = 2400) {
        const host = container.querySelector('#is-canvas-container') || container;
        host.querySelectorAll('.is-toast').forEach(t => t.remove());
        const toast = document.createElement('div');
        toast.className = 'is-toast';
        const icon = type === 'error' ? 'bx-error-circle' : type === 'success' ? 'bx-check-circle' : 'bx-info-circle';
        const color = type === 'error' ? '#f87171' : type === 'success' ? '#34d399' : '#60a5fa';
        toast.innerHTML = `<i class='bx ${icon}' style="color:${color};font-size:16px;"></i><span>${escapeHtml(message)}</span>`;
        host.appendChild(toast);
        setTimeout(() => toast.remove(), ms);
        return toast;
    }

    function showStudioConfirm({ title, message, confirmText = 'Continue', danger = false }) {
        return new Promise(resolve => {
            const modal = document.createElement('div');
            modal.style.cssText = 'position:fixed;inset:0;z-index:100000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.58);backdrop-filter:blur(4px);';
            modal.innerHTML = `
                <div style="width:360px;background:#1f1f1f;border:1px solid rgba(255,255,255,0.12);border-radius:10px;box-shadow:0 18px 50px rgba(0,0,0,0.6);padding:18px;font-family:inherit;color:#f4f4f5;">
                    <div style="font-size:16px;font-weight:700;margin-bottom:8px;">${escapeHtml(title)}</div>
                    <div style="font-size:13px;color:#a1a1aa;line-height:1.45;margin-bottom:18px;">${escapeHtml(message)}</div>
                    <div style="display:flex;justify-content:flex-end;gap:8px;">
                        <button id="is-confirm-cancel" style="background:#303030;color:#d4d4d8;border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:8px 14px;cursor:pointer;font-family:inherit;">Cancel</button>
                        <button id="is-confirm-ok" style="background:${danger ? '#dc2626' : '#2563eb'};color:#fff;border:none;border-radius:6px;padding:8px 14px;cursor:pointer;font-family:inherit;font-weight:600;">${escapeHtml(confirmText)}</button>
                    </div>
                </div>
            `;
            const finish = value => { modal.remove(); resolve(value); };
            modal.querySelector('#is-confirm-cancel').addEventListener('click', () => finish(false));
            modal.querySelector('#is-confirm-ok').addEventListener('click', () => finish(true));
            modal.addEventListener('click', e => { if (e.target === modal) finish(false); });
            document.body.appendChild(modal);
        });
    }

    function showStudioPrompt({ title, message, defaultValue = '', confirmText = 'Apply' }) {
        return new Promise(resolve => {
            const modal = document.createElement('div');
            modal.style.cssText = 'position:fixed;inset:0;z-index:100000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.58);backdrop-filter:blur(4px);';
            modal.innerHTML = `
                <div style="width:380px;background:#1f1f1f;border:1px solid rgba(255,255,255,0.12);border-radius:10px;box-shadow:0 18px 50px rgba(0,0,0,0.6);padding:18px;font-family:inherit;color:#f4f4f5;">
                    <div style="font-size:16px;font-weight:700;margin-bottom:8px;">${escapeHtml(title)}</div>
                    <div style="font-size:13px;color:#a1a1aa;line-height:1.45;margin-bottom:12px;">${escapeHtml(message)}</div>
                    <input id="is-prompt-input" value="${escapeHtml(defaultValue)}" style="width:100%;box-sizing:border-box;background:#111;color:#fff;border:1px solid rgba(255,255,255,0.14);border-radius:6px;padding:9px 10px;font-size:14px;outline:none;margin-bottom:16px;">
                    <div style="display:flex;justify-content:flex-end;gap:8px;">
                        <button id="is-prompt-cancel" style="background:#303030;color:#d4d4d8;border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:8px 14px;cursor:pointer;font-family:inherit;">Cancel</button>
                        <button id="is-prompt-ok" style="background:#2563eb;color:#fff;border:none;border-radius:6px;padding:8px 14px;cursor:pointer;font-family:inherit;font-weight:600;">${escapeHtml(confirmText)}</button>
                    </div>
                </div>
            `;
            const input = modal.querySelector('#is-prompt-input');
            const finish = value => { modal.remove(); resolve(value); };
            modal.querySelector('#is-prompt-cancel').addEventListener('click', () => finish(null));
            modal.querySelector('#is-prompt-ok').addEventListener('click', () => finish(input.value));
            input.addEventListener('keydown', e => {
                if (e.key === 'Enter') finish(input.value);
                if (e.key === 'Escape') finish(null);
            });
            modal.addEventListener('click', e => { if (e.target === modal) finish(null); });
            document.body.appendChild(modal);
            input.focus();
            input.select();
        });
    }

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
    let objectClipboard = null;
    
    // Vector Shapes
    let vectorShapes = [];
    let activeVectorShape = null;
    let resizingHandle = null;
    let currentPathPoints = []; // for brush path recording
    let currentPolyPoints = []; // for polyline arrow tools
    let draggingControlPointIdx = -1; // index of control point being dragged
    let labelDragState = null;
    let lastCanvasPointer = null;
    let hoveredVectorShape = null;
    let pendingDuplicateState = null;
    let editingGroup = null;
    const expandedGroups = new Set();
    let shapeIdCounter = 0;
    let canvasBgColor = '#ffffff';
    let canvasGrid = 'none';
    let canvasGridSize = 20;
    let hasBaseImage = false;
    let studioStarted = false;
    let currentProjectName = 'Untitled';
    let currentProjectHandle = null;
    let projectDirty = false;
    const DRAFT_KEY = 'worldtools_image_studio_draft_v2';
    
    function nextShapeId() { return 'shape_' + (++shapeIdCounter); }
    
    // Deep clone a vector shape (for duplicate / Shift+drag)
    function cloneShape(s) {
        const clone = { ...s, id: s.type === 'group' ? 'g_' + Date.now() + '_' + Math.floor(Math.random()*1000) : nextShapeId() };
        if (s.points) clone.points = s.points.map(p => ({ ...p }));
        if (s.originalPoints) clone.originalPoints = s.originalPoints.map(p => ({ ...p }));
        if (s.connections) clone.connections = JSON.parse(JSON.stringify(s.connections));
        if (s.type === 'image' && s.img) clone.img = s.img;
        if (s.type === 'group' && s.children) {
            clone.children = s.children.map(child => cloneShape(child));
        }
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
    const zoomValInput = container.querySelector('#is-zoom-val-input');
    const canvasWrapper = container.querySelector('#is-canvas-wrapper');
    const sizeInfo = container.querySelector('#is-obj-type-info');

    function markStudioStarted() {
        studioStarted = true;
        updateEmptyState();
    }

    function updateProjectStatus() {
        const status = container.querySelector('#is-project-status');
        if (!status) return;
        status.textContent = `${projectDirty ? '● ' : ''}${currentProjectName}`;
        status.style.color = projectDirty ? '#fbbf24' : '#8b8b8b';
        status.title = `${currentProjectName}${projectDirty ? ' · Unsaved changes' : ' · Saved'}`;
    }

    function updateEmptyState() {
        const empty = container.querySelector('#is-empty-state');
        if (!empty) return;
        const hasObjects = vectorShapes && vectorShapes.length > 0;
        empty.style.display = (!studioStarted && !hasObjects) ? 'flex' : 'none';
    }

    let panelRefreshQueued = false;
    function queueStudioPanelRefresh() {
        if (panelRefreshQueued) return;
        panelRefreshQueued = true;
        requestAnimationFrame(() => {
            panelRefreshQueued = false;
            refreshStudioPanels();
        });
    }

    function ensureShapeIds() {
        vectorShapes.forEach(shape => {
            if (!shape.id) shape.id = nextShapeId();
            if (shape.type === 'group' && shape.children) {
                shape.children.forEach(child => { if (!child.id) child.id = nextShapeId(); });
            }
        });
    }

    function shapeIcon(type) {
        return {
            image: 'bx-image', text: 'bx-text', path: 'bx-paint', polyarrow: 'bx-trending-up',
            group: 'bx-group', rect: 'bx-square', circle: 'bx-circle', ellipse: 'bx-shape-circle',
            triangle: 'bx-shape-triangle', star: 'bx-star'
        }[type] || 'bx-shape-polygon';
    }

    function shapeName(shape, index) {
        const names = {
            image: 'Image', text: 'Text', path: 'Brush Path', polyarrow: 'Line/Arrow',
            group: 'Group', rect: 'Rectangle', circle: 'Circle', ellipse: 'Ellipse',
            triangle: 'Triangle', diamond: 'Diamond', parallelogram: 'Parallelogram',
            pentagon: 'Pentagon', hexagon: 'Hexagon', star: 'Star'
        };
        if (shape.name) return shape.name;
        if (shape.type === 'text' && shape.text) return '"' + shape.text.slice(0, 24) + (shape.text.length > 24 ? '...' : '') + '"';
        return `${names[shape.type] || 'Object'}${index >= 0 ? ` ${index + 1}` : ''}`;
    }

    function layerItemHtml(s, index, child = false) {
        const active = s === activeVectorShape || multiSelected.has(s);
        const groupOpen = s.type === 'group' && expandedGroups.has(s.id);
        return `<div class="is-layer-item ${active ? 'active' : ''} ${s.hidden ? 'is-hidden' : ''} ${s.locked ? 'is-locked' : ''} ${child ? 'is-child' : ''}" draggable="${child ? 'false' : 'true'}" data-shape-id="${escapeHtml(s.id)}">
            ${s.type === 'group' ? `<button class="is-layer-action" data-layer-action="expand" title="${groupOpen ? 'Collapse group' : 'Expand group'}"><i class='bx bx-chevron-${groupOpen ? 'down' : 'right'}'></i></button>` : '<span style="width:24px"></span>'}
            <i class='bx ${shapeIcon(s.type)}'></i>
            <span class="is-layer-name" title="Double-click to rename">${escapeHtml(shapeName(s, index))}</span>
            <span class="is-layer-actions">
                ${s.type === 'group' ? `<button class="is-layer-action" data-layer-action="edit-group" title="Edit group contents"><i class='bx bx-edit'></i></button>` : ''}
                <button class="is-layer-action" data-layer-action="visibility" title="${s.hidden ? 'Show' : 'Hide'}"><i class='bx bx-${s.hidden ? 'hide' : 'show'}'></i></button>
                <button class="is-layer-action" data-layer-action="lock" title="${s.locked ? 'Unlock' : 'Lock'}"><i class='bx bx-${s.locked ? 'lock' : 'lock-open-alt'}'></i></button>
            </span>
        </div>${groupOpen ? (s.children || []).map((c, i) => layerItemHtml(c, i, true)).join('') : ''}`;
    }

    function objectSpecificProperties(s) {
        const color = normalizeHexColor(s.stroke, '#2563eb');
        const fill = normalizeHexColor(s.fill, '#2563eb');
        if (s.type === 'text') return `<details class="is-prop-details" open><summary>Text</summary><div class="is-prop-grid">
            <div class="is-prop-field"><label>Color</label><input type="color" data-prop="stroke" value="${color}"></div>
            <div class="is-prop-field"><label>Size</label><input type="number" data-prop="fontSize" min="8" max="240" value="${parseInt(s.fontSize, 10) || 48}"></div>
            <div class="is-prop-field" style="grid-column:1/-1"><label>Font</label><select data-prop="fontFamily">${['Be Vietnam Pro','Inter','Arial','Montserrat','Georgia','Times New Roman','Courier New'].map(f => `<option value="${escapeHtml(f)}" ${(s.fontFamily || 'Be Vietnam Pro') === f ? 'selected' : ''}>${escapeHtml(f)}</option>`).join('')}</select></div>
        </div></details>`;
        if (['rect','circle','ellipse','triangle','diamond','parallelogram','pentagon','hexagon','star'].includes(s.type)) return `<details class="is-prop-details" open><summary>Appearance</summary><div class="is-prop-grid">
            <div class="is-prop-field"><label>Stroke</label><input type="color" data-prop="stroke" value="${color}"></div>
            <div class="is-prop-field"><label>Fill</label><input type="color" data-prop="fill" value="${fill}"></div>
            <div class="is-prop-field"><label>Stroke Width</label><input type="number" data-prop="strokeWidth" min="1" max="50" value="${parseInt(s.strokeWidth,10)||5}"></div>
            ${s.type === 'rect' ? `<div class="is-prop-field"><label>Corner Radius</label><input type="number" data-prop="borderRadius" min="0" max="200" value="${parseInt(s.borderRadius,10)||0}"></div>` : ''}
        </div></details>`;
        if (s.type === 'path' || s.type === 'polyarrow') return `<details class="is-prop-details" open><summary>Line</summary><div class="is-prop-grid">
            <div class="is-prop-field"><label>Color</label><input type="color" data-prop="stroke" value="${color}"></div>
            <div class="is-prop-field"><label>Width</label><input type="number" data-prop="strokeWidth" min="1" max="50" value="${parseInt(s.strokeWidth,10)||5}"></div>
            <div class="is-prop-field"><label>Smoothing</label><input type="number" data-prop="smoothLevel" min="0" max="20" value="${parseInt(s.smoothLevel,10)||0}"></div>
            ${s.type === 'polyarrow' ? `<div class="is-prop-field"><label>Mode</label><select data-prop="arrowMode"><option value="none" ${(s.arrowMode || 'none') === 'none' ? 'selected' : ''}>Line</option><option value="single" ${s.arrowMode === 'single' ? 'selected' : ''}>Arrow</option><option value="double" ${s.arrowMode === 'double' ? 'selected' : ''}>Double</option></select></div>
            <div class="is-prop-field"><label>Style</label><select data-prop="lineStyle"><option value="solid" ${(s.lineStyle || 'solid') === 'solid' ? 'selected' : ''}>Solid</option><option value="dashed" ${s.lineStyle === 'dashed' ? 'selected' : ''}>Dashed</option><option value="dotted" ${s.lineStyle === 'dotted' ? 'selected' : ''}>Dotted</option><option value="dashdot" ${s.lineStyle === 'dashdot' ? 'selected' : ''}>Dash-dot</option></select></div>
            <div class="is-prop-field"><label>Arrowhead</label><select data-prop="arrowHead"><option value="open" ${(s.arrowHead || 'open') === 'open' ? 'selected' : ''}>Open</option><option value="filled" ${s.arrowHead === 'filled' ? 'selected' : ''}>Filled</option><option value="diamond" ${s.arrowHead === 'diamond' ? 'selected' : ''}>Diamond</option><option value="circle" ${s.arrowHead === 'circle' ? 'selected' : ''}>Circle</option><option value="square" ${s.arrowHead === 'square' ? 'selected' : ''}>Square</option></select></div>` : ''}
        </div></details>`;
        if (s.type === 'image') return `<details class="is-prop-details" open><summary>Image</summary><div class="is-prop-actions"><button data-panel-action="remove-bg"><i class='bx bx-cut'></i> Remove BG</button><button data-panel-action="ai-object"><i class='bx bxs-magic-wand'></i> AI Tools</button></div></details>`;
        return '';
    }

    function layerMatches(s, query, filter) {
        const typeGroup = ['rect','circle','ellipse','triangle','diamond','parallelogram','pentagon','hexagon','star'].includes(s.type) ? 'shape' : (['path','polyarrow'].includes(s.type) ? 'line' : s.type);
        const matchesType = filter === 'all' || typeGroup === filter;
        const matchesText = !query || shapeName(s, 0).toLowerCase().includes(query);
        return (matchesType && matchesText) || (s.children || []).some(child => layerMatches(child, query, filter));
    }

    function refreshStudioPanels() {
        ensureShapeIds();
        updateEmptyState();

        const layerList = container.querySelector('#is-layer-list');
        const layerCount = container.querySelector('#is-layer-count');
        const props = container.querySelector('#is-properties-content');
        const historySummary = container.querySelector('#is-history-summary');
        if (!layerList || !props || !historySummary) return;

        layerCount.textContent = vectorShapes.length;
        const groupBanner = container.querySelector('#is-group-edit-banner');
        if (groupBanner) {
            groupBanner.style.display = editingGroup ? 'block' : 'none';
            groupBanner.innerHTML = editingGroup ? `<div class="is-group-banner"><span><i class='bx bx-edit'></i> Editing ${escapeHtml(shapeName(editingGroup, 0))}</span><button id="is-exit-group" type="button">Exit · Esc</button></div>` : '';
        }
        if (!vectorShapes.length) {
            layerList.innerHTML = `<div class="is-panel-empty">No objects yet. Add text, shapes, brush strokes, pasted images, or AI-generated objects.</div>`;
        } else {
            const query = (container.querySelector('#is-layer-search')?.value || '').trim().toLowerCase();
            const filter = container.querySelector('#is-layer-filter')?.value || 'all';
            const visibleShapes = vectorShapes.filter(s => layerMatches(s, query, filter));
            layerList.innerHTML = visibleShapes.map((shape, visualIdx) => {
                const s = visibleShapes[visibleShapes.length - 1 - visualIdx];
                const stackIndex = vectorShapes.indexOf(s);
                return layerItemHtml(s, stackIndex);
            }).join('');
            if (!visibleShapes.length) layerList.innerHTML = `<div class="is-panel-empty">No layers match this search.</div>`;
        }

        if (!activeVectorShape) {
            props.innerHTML = `<div class="is-panel-empty">Select an object on the canvas or from Layers to edit its position, size, opacity, and rotation.</div>`;
        } else if (multiSelected.size >= 2) {
            props.innerHTML = `<div class="is-panel-empty">${multiSelected.size} objects selected.</div><div class="is-prop-section-title">Arrange</div><div class="is-prop-actions">
                <button data-panel-action="group"><i class='bx bx-group'></i> Group</button><button data-panel-action="delete"><i class='bx bx-trash'></i> Delete</button>
                <button data-panel-action="align-left">Align Left</button><button data-panel-action="align-center">Center</button>
                <button data-panel-action="align-top">Align Top</button><button data-panel-action="align-middle">Middle</button>
                <button data-panel-action="distribute-h">Distribute H</button><button data-panel-action="distribute-v">Distribute V</button>
            </div><div class="is-prop-field" style="margin-top:8px;"><label>Gap (px, blank = auto)</label><input id="is-distribute-gap" type="number" min="0" placeholder="Auto"></div>`;
        } else {
            const s = activeVectorShape;
            const opacity = Math.round((s.opacity ?? 1) * 100);
            const labelColor = normalizeHexColor(s.labelColor, '#ffffff');
            const labelBg = normalizeHexColor(s.labelBg, '#111827');
            props.innerHTML = `
                <div class="is-panel-empty" style="margin-bottom:10px;">${escapeHtml(shapeName(s, vectorShapes.indexOf(s)))} · ${escapeHtml(s.type)}</div>
                ${s.type !== 'text' ? `<details class="is-prop-details" open><summary>Attached Label</summary><div class="is-prop-field" style="margin-bottom:8px;"><label>Text</label><input type="text" data-prop="label" value="${escapeHtml(s.label || '')}" placeholder="Optional label on this object"></div>
                <div class="is-prop-grid" style="margin-bottom:10px;">
                    <div class="is-prop-field"><label>Label Size</label><input type="number" data-prop="labelFontSize" min="8" max="96" value="${parseInt(s.labelFontSize, 10) || 16}"></div>
                    <div class="is-prop-field"><label>Label Font</label><select data-prop="labelFontFamily">
                        ${['Arial','Inter','Be Vietnam Pro','Montserrat','Georgia','Times New Roman','Courier New'].map(f => `<option value="${escapeHtml(f)}" ${(s.labelFontFamily || 'Arial') === f ? 'selected' : ''}>${escapeHtml(f)}</option>`).join('')}
                    </select></div>
                    <div class="is-prop-field"><label>Text Color</label><input type="color" data-prop="labelColor" value="${labelColor}"></div>
                    <div class="is-prop-field"><label>Label Fill</label><input type="color" data-prop="labelBg" value="${labelBg}"></div>
                </div><label style="display:flex;align-items:center;gap:6px;color:#aaa;font-size:11px;margin:8px 0;"><input type="checkbox" data-prop="labelTransparent" ${s.labelTransparent ? 'checked' : ''} style="width:auto;"> Transparent label fill</label><div class="is-prop-actions" style="margin-bottom:8px;"><button data-label-position="top">Top</button><button data-label-position="bottom">Bottom</button><button data-label-position="left">Left</button><button data-label-position="right">Right</button><button data-label-position="center">Center</button><button data-label-position="auto">Auto Place</button><button data-label-position="reset">Reset</button></div></details>` : ''}
                ${objectSpecificProperties(s)}
                <details class="is-prop-details" open><summary>Transform</summary>
                <div class="is-prop-grid">
                    <div class="is-prop-field"><label>X</label><input type="number" data-prop="x" value="${Math.round(s.x || 0)}"></div>
                    <div class="is-prop-field"><label>Y</label><input type="number" data-prop="y" value="${Math.round(s.y || 0)}"></div>
                    <div class="is-prop-field"><label>Width</label><input type="number" data-prop="w" min="1" value="${Math.round(Math.abs((s.x2 || 0) - (s.x || 0)))}"></div>
                    <div class="is-prop-field"><label>Height</label><input type="number" data-prop="h" min="1" value="${Math.round(Math.abs((s.y2 || 0) - (s.y || 0)))}"></div>
                    <div class="is-prop-field"><label>Rotation</label><input type="number" data-prop="rotation" value="${Math.round(s.rotation || 0)}"></div>
                    <div class="is-prop-field"><label>Opacity %</label><input type="number" data-prop="opacity" min="1" max="100" value="${opacity}"></div>
                </div></details>`;
        }

        historySummary.innerHTML = `Canvas: ${canvas.width} x ${canvas.height}px · Objects: ${vectorShapes.length}`;
        const historyList = container.querySelector('#is-history-list');
        if (historyList) historyList.innerHTML = history.map((entry, idx) => `<button class="is-history-item ${idx === historyStep ? 'active' : ''}" data-history-index="${idx}"><i class='bx ${idx === historyStep ? 'bx-radio-circle-marked' : 'bx-radio-circle'}'></i><span>${escapeHtml(entry.action || 'Edit canvas')}</span></button>`).reverse().join('');
    }

    function applyPropertyEdit(prop, rawValue) {
        if (!activeVectorShape || multiSelected.size >= 2) return;
        if (prop === 'label') {
            const label = String(rawValue || '').trim();
            if (label) activeVectorShape.label = label;
            else delete activeVectorShape.label;
            markStudioStarted();
            drawSelectionOverlay();
            saveState();
            return;
        }
        if (prop === 'labelTransparent') {
            activeVectorShape.labelTransparent = rawValue === true || rawValue === 'true';
            drawSelectionOverlay(); saveState('Change label background'); return;
        }
        if (['labelFontSize', 'labelFontFamily', 'labelColor', 'labelBg'].includes(prop)) {
            const s = activeVectorShape;
            if (prop === 'labelFontSize') s.labelFontSize = Math.max(8, Math.min(96, parseInt(rawValue, 10) || 16));
            if (prop === 'labelFontFamily') s.labelFontFamily = String(rawValue || 'Arial');
            if (prop === 'labelColor') s.labelColor = normalizeHexColor(rawValue, '#ffffff');
            if (prop === 'labelBg') s.labelBg = normalizeHexColor(rawValue, '#111827');
            markStudioStarted();
            drawSelectionOverlay();
            saveState();
            return;
        }
        if (['stroke', 'fill', 'fontFamily', 'arrowHead', 'arrowMode', 'lineStyle'].includes(prop)) {
            activeVectorShape[prop] = rawValue;
            if (prop === 'fontFamily' && activeVectorShape.type === 'text') recalcTextBounds(activeVectorShape);
            markStudioStarted();
            drawSelectionOverlay();
            saveState(`Change ${prop}`);
            return;
        }
        const value = parseFloat(rawValue);
        if (!Number.isFinite(value)) return;
        const s = activeVectorShape;
        const width = Math.max(1, Math.abs((s.x2 || 0) - (s.x || 0)));
        const height = Math.max(1, Math.abs((s.y2 || 0) - (s.y || 0)));
        if (prop === 'x') { const dx = value - s.x; s.x += dx; s.x2 += dx; }
        if (prop === 'y') { const dy = value - s.y; s.y += dy; s.y2 += dy; }
        if (prop === 'w') s.x2 = s.x + Math.max(1, value) * (s.x2 >= s.x ? 1 : -1);
        if (prop === 'h') s.y2 = s.y + Math.max(1, value) * (s.y2 >= s.y ? 1 : -1);
        if (prop === 'rotation') s.rotation = value;
        if (prop === 'opacity') s.opacity = Math.max(1, Math.min(100, value)) / 100;
        if (prop === 'strokeWidth') s.strokeWidth = Math.max(1, Math.min(50, value));
        if (prop === 'borderRadius') s.borderRadius = Math.max(0, Math.min(200, value));
        if (prop === 'fontSize') { s.fontSize = Math.max(8, Math.min(240, value)); recalcTextBounds(s); }
        if (prop === 'smoothLevel') { s.smoothLevel = Math.max(0, Math.min(20, value)); if (s.originalPoints) applySmoothToShape(s, s.smoothLevel); }
        if (prop === 'w' && s.type === 'text') recalcTextBounds(s, Math.max(1, value));
        if (prop === 'h' && height && s.type !== 'text') s.y2 = s.y + Math.max(1, value) * (s.y2 >= s.y ? 1 : -1);
        markStudioStarted();
        drawSelectionOverlay();
        saveState(`Change ${prop}`);
    }

    container.querySelectorAll('.is-panel-tab').forEach(tabBtn => {
        tabBtn.addEventListener('click', () => {
            container.querySelectorAll('.is-panel-tab').forEach(b => b.classList.toggle('active', b === tabBtn));
            const panel = tabBtn.getAttribute('data-panel');
            container.querySelectorAll('.is-panel-section').forEach(section => {
                section.classList.toggle('active', section.id === `is-panel-${panel}`);
            });
        });
    });

    function findShapeById(id, shapes = vectorShapes) {
        for (const shape of shapes) {
            if (shape.id === id) return shape;
            if (shape.children) {
                const child = findShapeById(id, shape.children);
                if (child) return child;
            }
        }
        return null;
    }

    function findParentGroup(shape, shapes = vectorShapes) {
        for (const item of shapes) {
            if (item.type === 'group' && item.children?.includes(shape)) return item;
            if (item.children) {
                const parent = findParentGroup(shape, item.children);
                if (parent) return parent;
            }
        }
        return null;
    }

    function updateGroupBounds(group) {
        if (!group?.children?.length) return;
        group.x = Math.min(...group.children.map(s => Math.min(s.x, s.x2)));
        group.y = Math.min(...group.children.map(s => Math.min(s.y, s.y2)));
        group.x2 = Math.max(...group.children.map(s => Math.max(s.x, s.x2)));
        group.y2 = Math.max(...group.children.map(s => Math.max(s.y, s.y2)));
    }

    function enterGroup(group) {
        if (!group || group.type !== 'group') return;
        editingGroup = group;
        expandedGroups.add(group.id);
        activeVectorShape = null; multiSelected.clear(); hoveredVectorShape = null;
        drawSelectionOverlay();
        showToast(`Editing ${shapeName(group, 0)} · Esc to exit`);
    }

    function exitGroup() {
        if (!editingGroup) return;
        updateGroupBounds(editingGroup);
        activeVectorShape = editingGroup;
        editingGroup = null; multiSelected.clear(); hoveredVectorShape = null;
        drawSelectionOverlay();
    }

    container.querySelector('#is-layer-list').addEventListener('click', e => {
        const item = e.target.closest('.is-layer-item');
        if (!item) return;
        const shape = findShapeById(item.dataset.shapeId);
        if (!shape) return;
        const action = e.target.closest('[data-layer-action]')?.dataset.layerAction;
        if (action === 'expand') {
            if (expandedGroups.has(shape.id)) expandedGroups.delete(shape.id); else expandedGroups.add(shape.id);
            refreshStudioPanels();
            return;
        }
        if (action === 'edit-group') { enterGroup(shape); return; }
        if (action === 'visibility') {
            shape.hidden = !shape.hidden;
            if (shape.hidden) { multiSelected.delete(shape); if (activeVectorShape === shape) activeVectorShape = null; }
            drawSelectionOverlay();
            saveState(shape.hidden ? 'Hide object' : 'Show object');
            return;
        }
        if (action === 'lock') {
            shape.locked = !shape.locked;
            if (shape.locked && activeVectorShape === shape) activeVectorShape = null;
            drawSelectionOverlay();
            saveState(shape.locked ? 'Lock object' : 'Unlock object');
            return;
        }
        if (shape.locked || (item.classList.contains('is-child') && findParentGroup(shape) !== editingGroup)) return;
        if ((e.ctrlKey || e.metaKey) && !shape.locked) {
            if (multiSelected.has(shape)) multiSelected.delete(shape); else multiSelected.add(shape);
            if (activeVectorShape && activeVectorShape !== shape) multiSelected.add(activeVectorShape);
            activeVectorShape = shape;
            drawSelectionOverlay();
            return;
        }
        if (e.shiftKey && activeVectorShape && vectorShapes.includes(activeVectorShape)) {
            const a = vectorShapes.indexOf(activeVectorShape), b = vectorShapes.indexOf(shape);
            multiSelected.clear();
            vectorShapes.slice(Math.min(a,b), Math.max(a,b)+1).filter(s => !s.locked && !s.hidden).forEach(s => multiSelected.add(s));
            activeVectorShape = shape;
            drawSelectionOverlay();
            return;
        }
        activeVectorShape = shape;
        canvasSelected = false;
        selection = null;
        multiSelected.clear();
        currentTool = 'select';
        tools.forEach(t => t.classList.toggle('active', t.getAttribute('data-tool') === 'select'));
        canvas.style.cursor = 'default';
        drawSelectionOverlay();
    });

    container.querySelector('#is-layer-list').addEventListener('dblclick', e => {
        const item = e.target.closest('.is-layer-item');
        const nameEl = e.target.closest('.is-layer-name');
        if (!item || !nameEl || item.classList.contains('is-child')) return;
        const shape = findShapeById(item.dataset.shapeId);
        if (!shape) return;
        const input = document.createElement('input');
        input.value = shape.name || shapeName(shape, vectorShapes.indexOf(shape));
        input.style.cssText = 'min-width:0;flex:1;background:#111;color:#fff;border:1px solid #3b82f6;border-radius:4px;padding:4px;';
        nameEl.replaceWith(input);
        input.focus(); input.select();
        const commit = () => {
            const name = input.value.trim();
            if (name) shape.name = name; else delete shape.name;
            saveState('Rename object');
            refreshStudioPanels();
        };
        input.addEventListener('blur', commit, { once:true });
        input.addEventListener('keydown', ke => { if (ke.key === 'Enter') input.blur(); if (ke.key === 'Escape') { input.value = shape.name || ''; input.blur(); } });
    });
    container.querySelector('#is-group-edit-banner').addEventListener('click', e => { if (e.target.closest('#is-exit-group')) exitGroup(); });
    container.querySelector('#is-layer-search').addEventListener('input', refreshStudioPanels);
    container.querySelector('#is-layer-filter').addEventListener('change', refreshStudioPanels);

    let draggedLayerId = null;
    container.querySelector('#is-layer-list').addEventListener('dragstart', e => {
        const item = e.target.closest('.is-layer-item:not(.is-child)');
        if (!item) return;
        draggedLayerId = item.dataset.shapeId;
        e.dataTransfer.effectAllowed = 'move';
    });
    container.querySelector('#is-layer-list').addEventListener('dragover', e => { if (e.target.closest('.is-layer-item:not(.is-child)')) e.preventDefault(); });
    container.querySelector('#is-layer-list').addEventListener('drop', e => {
        const target = e.target.closest('.is-layer-item:not(.is-child)');
        if (!target || !draggedLayerId || target.dataset.shapeId === draggedLayerId) return;
        e.preventDefault();
        const from = vectorShapes.findIndex(s => s.id === draggedLayerId);
        const to = vectorShapes.findIndex(s => s.id === target.dataset.shapeId);
        if (from < 0 || to < 0) return;
        const [moved] = vectorShapes.splice(from, 1);
        vectorShapes.splice(to, 0, moved);
        draggedLayerId = null;
        drawSelectionOverlay();
        saveState('Reorder layers');
    });

    container.querySelector('#is-properties-content').addEventListener('change', e => {
        const input = e.target.closest('input[data-prop], select[data-prop]');
        if (!input) return;
        applyPropertyEdit(input.dataset.prop, input.type === 'checkbox' ? input.checked : input.value);
    });
    container.querySelector('#is-properties-content').addEventListener('click', e => {
        const posBtn = e.target.closest('[data-label-position]');
        if (posBtn && activeVectorShape) {
            const w = Math.abs(activeVectorShape.x2 - activeVectorShape.x);
            const h = Math.abs(activeVectorShape.y2 - activeVectorShape.y);
            if (posBtn.dataset.labelPosition === 'auto') { autoPlaceLabel(activeVectorShape); drawSelectionOverlay(); saveState('Auto place attached label'); return; }
            const offsets = { top:[0,-h/2-24], bottom:[0,h/2+24], left:[-w/2-40,0], right:[w/2+40,0], center:[0,0], reset:[0,-10] };
            const [x,y] = offsets[posBtn.dataset.labelPosition] || offsets.reset;
            activeVectorShape.labelOffsetX = x; activeVectorShape.labelOffsetY = y;
            drawSelectionOverlay(); saveState('Move attached label');
            return;
        }
        const action = e.target.closest('[data-panel-action]')?.dataset.panelAction;
        if (!action) return;
        if (action === 'group') container.querySelector('#is-ctx-group').click();
        if (action === 'delete') deleteSelectedObjects();
        if (action === 'align-left') container.querySelector('.is-obj-align[data-align="left"]')?.click();
        if (action === 'align-center') container.querySelector('.is-obj-align[data-align="h-middle"]')?.click();
        if (action === 'align-top') container.querySelector('.is-obj-align[data-align="top"]')?.click();
        if (action === 'align-middle') container.querySelector('.is-obj-align[data-align="v-middle"]')?.click();
        if (action === 'distribute-h') distributeSelected('horizontal', container.querySelector('#is-distribute-gap')?.value);
        if (action === 'distribute-v') distributeSelected('vertical', container.querySelector('#is-distribute-gap')?.value);
        if (action === 'remove-bg') container.querySelector('#is-obj-remove-bg')?.click();
        if (action === 'ai-object') container.querySelector('#is-obj-smart-remove')?.click();
    });

    function distributeSelected(axis, rawGap) {
        const selected = [...multiSelected];
        if (selected.length < 3) { showToast('Select at least 3 objects to distribute'); return; }
        const horizontal = axis === 'horizontal';
        selected.sort((a,b) => (horizontal ? Math.min(a.x,a.x2)-Math.min(b.x,b.x2) : Math.min(a.y,a.y2)-Math.min(b.y,b.y2)));
        const explicitGap = rawGap !== '' && Number.isFinite(Number(rawGap)) ? Math.max(0, Number(rawGap)) : null;
        if (explicitGap !== null) {
            let cursor = horizontal ? Math.min(selected[0].x,selected[0].x2) : Math.min(selected[0].y,selected[0].y2);
            selected.forEach((s, index) => {
                const start = horizontal ? Math.min(s.x,s.x2) : Math.min(s.y,s.y2);
                if (index) shiftShapeRecursive(s, horizontal ? cursor-start : 0, horizontal ? 0 : cursor-start);
                const size = horizontal ? Math.abs(s.x2-s.x) : Math.abs(s.y2-s.y);
                cursor += size + explicitGap;
            });
        } else {
            const first = selected[0], last = selected[selected.length-1];
            const firstCenter = horizontal ? (first.x+first.x2)/2 : (first.y+first.y2)/2;
            const lastCenter = horizontal ? (last.x+last.x2)/2 : (last.y+last.y2)/2;
            const step = (lastCenter-firstCenter)/(selected.length-1);
            selected.slice(1,-1).forEach((s,i) => {
                const center = horizontal ? (s.x+s.x2)/2 : (s.y+s.y2)/2;
                const target = firstCenter+step*(i+1);
                shiftShapeRecursive(s, horizontal ? target-center : 0, horizontal ? 0 : target-center);
            });
        }
        drawSelectionOverlay(); saveState(horizontal ? 'Distribute horizontally' : 'Distribute vertically');
    }

    container.querySelector('#is-panel-undo').addEventListener('click', () => container.querySelector('#is-undo').click());
    container.querySelector('#is-panel-redo').addEventListener('click', () => container.querySelector('#is-redo').click());
    container.querySelector('#is-panel-save').addEventListener('click', () => container.querySelector('#is-download-btn').click());
    container.querySelector('#is-panel-project').addEventListener('click', () => container.querySelector('#is-project-save-btn').click());
    const moreMenu = container.querySelector('#is-more-menu');
    container.querySelector('#is-more-btn').addEventListener('click', e => { e.stopPropagation(); moreMenu.style.display = moreMenu.style.display === 'none' ? 'block' : 'none'; });
    moreMenu.addEventListener('click', e => {
        e.stopPropagation();
        const action = e.target.closest('[data-more-action]')?.dataset.moreAction;
        if (!action) return;
        moreMenu.style.display = 'none';
        if (action === 'ai') container.querySelector('#is-ai-history-btn').click();
        if (action === 'adjust') { const adj=container.querySelector('#is-adj-container'); adj.classList.add('is-more-open'); container.querySelector('#is-adj-menu').style.display='block'; }
        if (action === 'merge') container.querySelector('#is-flatten-all').click();
    });
    document.addEventListener('click', e => { if (!container.querySelector('#is-more-container').contains(e.target)) moreMenu.style.display = 'none'; });
    container.querySelector('#is-panel-toggle').addEventListener('click', () => {
        const panel = container.querySelector('#is-side-panel');
        panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
        contextBar.style.right = panel.style.display === 'none' ? '0' : '248px';
        setTimeout(fitCanvasToWindow, 0);
    });
    container.querySelector('#is-shortcuts-btn').addEventListener('click', () => {
        const modal = document.createElement('div'); modal.className = 'is-modal-overlay';
        modal.innerHTML = `<div class="is-modal"><h3>Keyboard Shortcuts</h3><div class="is-prop-grid" style="line-height:1.8;font-size:12px;color:#d4d4d8;">
            <div>V · Select</div><div>H · Pan</div><div>Ctrl/Shift+click · Multi-select</div><div>Shift/Alt+drag · Duplicate</div><div>Space+drag · Pan</div><div>Alt+click · Select below</div><div>Double-click group · Edit inside</div><div>Esc · Exit group</div><div>Ctrl+G · Group</div><div>Ctrl+Shift+G · Ungroup</div><div>Ctrl+S · Export</div><div>Ctrl+Shift+S · Save Project</div><div>Ctrl+Z / Ctrl+Y · Undo / Redo</div><div>Delete · Remove object</div>
        </div><div class="is-modal-actions"><button class="is-btn-primary" id="is-shortcuts-close">Close</button></div></div>`;
        document.body.appendChild(modal);
        const close = () => modal.remove(); modal.querySelector('#is-shortcuts-close').onclick = close; modal.onclick = e => { if (e.target === modal) close(); };
    });
    container.querySelector('#is-layer-show-all').addEventListener('click', () => {
        const reset = shapes => shapes.forEach(s => { s.hidden = false; s.locked = false; if (s.children) reset(s.children); });
        reset(vectorShapes); drawSelectionOverlay(); saveState('Show and unlock all');
    });
    container.querySelector('#is-history-list').addEventListener('click', e => {
        const item = e.target.closest('[data-history-index]');
        if (!item || _restorePending) return;
        historyStep = parseInt(item.dataset.historyIndex, 10);
        restoreState(historyStep);
    });
    container.querySelector('#is-empty-open').addEventListener('click', () => container.querySelector('#is-upload-btn').click());
    container.querySelector('#is-empty-ai').addEventListener('click', () => {
        markStudioStarted();
        container.querySelector('#is-canvas-smart-remove').click();
        setTimeout(() => container.querySelector('#is-ai-opt-create')?.click(), 60);
    });
    container.querySelector('#is-empty-blank').addEventListener('click', () => {
        markStudioStarted();
        showToast('Blank canvas ready', 'success');
    });

    // Save state for Undo/Redo
    const MAX_HISTORY = 50;
    let draftSaveTimer = null;
    let isRestoringDraft = false;

    function getImageSource(img) {
        if (!img) return '';
        if (img instanceof HTMLCanvasElement) return img.toDataURL('image/png');
        return img.currentSrc || img.src || '';
    }

    function serializeShape(shape) {
        const clone = { ...shape };
        if (shape.points) clone.points = shape.points.map(p => ({ ...p }));
        if (shape.originalPoints) clone.originalPoints = shape.originalPoints.map(p => ({ ...p }));
        if (shape.connections) clone.connections = JSON.parse(JSON.stringify(shape.connections));
        if (shape.type === 'image') {
            clone.imageSrc = getImageSource(shape.img);
            delete clone.img;
        }
        if (shape.type === 'group' && shape.children) {
            clone.children = shape.children.map(child => serializeShape(child));
        }
        return clone;
    }

    function prepareDuplicateOnDrag(hitShape, pos, altKey = false) {
        const previousActive = activeVectorShape;
        activeVectorShape = hitShape;
        pendingDuplicateState = {
            startX: pos.x,
            startY: pos.y,
            targets: multiSelected.size > 1 && multiSelected.has(hitShape) ? [...multiSelected] : [hitShape],
            hitShape,
            previousActive,
            previousSelection: new Set(multiSelected),
            altKey,
            activated: false
        };
    }

    function activatePendingDuplicate() {
        if (!pendingDuplicateState || pendingDuplicateState.activated) return;
        const pool = editingGroup?.children || vectorShapes;
        const clones = pendingDuplicateState.targets.map(s => {
            const clone = cloneShape(s);
            pool.push(clone);
            return clone;
        });
        multiSelected.clear();
        if (clones.length > 1) clones.forEach(s => multiSelected.add(s));
        activeVectorShape = clones[clones.length - 1];
        pendingDuplicateState.activated = true;
    }

    function snapshotShape(s) {
        const clone = { ...s };
        if (s.points) clone.points = s.points.map(p => ({ ...p }));
        if (s.originalPoints) clone.originalPoints = s.originalPoints.map(p => ({ ...p }));
        if (s.connections) clone.connections = JSON.parse(JSON.stringify(s.connections));
        if (s.type === 'image' && s.img) clone.img = s.img;
        if (s.type === 'group' && s.children) clone.children = s.children.map(child => snapshotShape(child));
        return clone;
    }

    function loadImage(src) {
        return new Promise((resolve, reject) => {
            if (!src) {
                resolve(null);
                return;
            }
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }

    async function deserializeShape(shape) {
        const clone = { ...shape };
        if (shape.points) clone.points = shape.points.map(p => ({ ...p }));
        if (shape.originalPoints) clone.originalPoints = shape.originalPoints.map(p => ({ ...p }));
        if (shape.connections) clone.connections = JSON.parse(JSON.stringify(shape.connections));
        if (shape.type === 'image' && shape.imageSrc) {
            clone.img = await loadImage(shape.imageSrc);
            delete clone.imageSrc;
        }
        if (shape.type === 'group' && shape.children) {
            clone.children = await Promise.all(shape.children.map(child => deserializeShape(child)));
        }
        return clone;
    }

    function persistDraft() {
        if (isRestoringDraft) return;
        try {
            const draft = {
                version: 2,
                savedAt: Date.now(),
                canvasWidth: canvas.width,
                canvasHeight: canvas.height,
                baseDataURL: canvas.toDataURL('image/png'),
                canvasBgColor,
                canvasGrid,
                canvasGridSize,
                hasBaseImage,
                shapeIdCounter,
                shapes: vectorShapes.map(shape => serializeShape(shape))
            };
            localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
        } catch (err) {
            console.warn('Image Studio draft autosave failed:', err);
        }
    }

    function scheduleDraftSave() {
        clearTimeout(draftSaveTimer);
        draftSaveTimer = setTimeout(persistDraft, 400);
    }

    async function restoreDraftIfAvailable() {
        const raw = localStorage.getItem(DRAFT_KEY);
        if (!raw) return false;

        try {
            isRestoringDraft = true;
            const draft = JSON.parse(raw);
            if (!draft || !draft.baseDataURL) return false;

            canvas.width = draft.canvasWidth || canvas.width;
            canvas.height = draft.canvasHeight || canvas.height;
            overlay.width = canvas.width;
            overlay.height = canvas.height;
            sizeInfo.innerText = `${canvas.width} x ${canvas.height}`;

            canvasBgColor = draft.canvasBgColor || '#ffffff';
            canvasGrid = draft.canvasGrid || 'none';
            canvasGridSize = draft.canvasGridSize || 20;
            hasBaseImage = !!draft.hasBaseImage;
            shapeIdCounter = Math.max(shapeIdCounter, draft.shapeIdCounter || 0);

            const bgInput = container.querySelector('#is-canvas-bg-color');
            const gridInput = container.querySelector('#is-canvas-grid');
            const gridSizeInput = container.querySelector('#is-canvas-grid-size');
            if (bgInput) bgInput.value = canvasBgColor;
            if (gridInput) gridInput.value = canvasGrid;
            if (gridSizeInput) gridSizeInput.value = canvasGridSize;

            const baseImg = await loadImage(draft.baseDataURL);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(baseImg, 0, 0);

            vectorShapes = await Promise.all((draft.shapes || []).map(shape => deserializeShape(shape)));
            studioStarted = true;
            activeVectorShape = null;
            multiSelected.clear();
            selection = null;
            drawSelectionOverlay();
            return true;
        } catch (err) {
            console.warn('Image Studio draft restore failed:', err);
            return false;
        } finally {
            isRestoringDraft = false;
        }
    }

    function inferHistoryAction() {
        const previous = history[historyStep];
        if (!previous) return 'Open editor';
        const flatten = shapes => (shapes || []).flatMap(s => [s, ...(s.children ? flatten(s.children) : [])]);
        const beforeShapes = flatten(previous.shapes);
        const afterShapes = flatten(vectorShapes);
        const before = beforeShapes.length;
        const after = afterShapes.length;
        if (after > before) return after - before > 1 ? `Add ${after - before} objects` : 'Add object';
        if (after < before) return before - after > 1 ? `Remove ${before - after} objects` : 'Remove object';
        if (previous.canvasWidth !== canvas.width || previous.canvasHeight !== canvas.height) return 'Resize canvas';
        if (activeVectorShape?.id) {
            const old = beforeShapes.find(s => s.id === activeVectorShape.id);
            const cur = activeVectorShape;
            if (old) {
                if ((old.rotation || 0) !== (cur.rotation || 0)) return 'Rotate object';
                if (Math.abs(old.x2-old.x) !== Math.abs(cur.x2-cur.x) || Math.abs(old.y2-old.y) !== Math.abs(cur.y2-cur.y)) return 'Resize object';
                if (old.x !== cur.x || old.y !== cur.y) return 'Move object';
                if (old.label !== cur.label || old.labelFontSize !== cur.labelFontSize || old.labelColor !== cur.labelColor) return 'Edit attached label';
                if (old.fontFamily !== cur.fontFamily || old.fontSize !== cur.fontSize) return 'Change font';
                if (old.stroke !== cur.stroke || old.fill !== cur.fill) return 'Change color';
                if (old.opacity !== cur.opacity) return 'Change opacity';
            }
        }
        return 'Edit object';
    }

    function saveState(action = '') {
        if (editingGroup) updateGroupBounds(editingGroup);
        if (historyStep < history.length - 1) {
            history = history.slice(0, historyStep + 1);
        }
        // Deep clone vectorShapes (handle Image objects and nested objects)
        const shapesClone = vectorShapes.map(s => {
            return snapshotShape(s);
        });
        history.push({
            dataURL: canvas.toDataURL(),
            shapes: shapesClone,
            canvasWidth: canvas.width,
            canvasHeight: canvas.height,
            canvasBgColor,
            canvasGrid,
            canvasGridSize,
            hasBaseImage,
            action: action || inferHistoryAction()
        });
        historyStep++;
        // Enforce history limit to prevent memory leaks
        if (history.length > MAX_HISTORY) {
            const excess = history.length - MAX_HISTORY;
            history = history.slice(excess);
            historyStep -= excess;
            if (historyStep < 0) historyStep = 0;
        }
        if (vectorShapes.length > 0) studioStarted = true;
        projectDirty = action !== 'Open editor';
        updateProjectStatus();
        scheduleDraftSave();
        refreshStudioPanels();
    }

    const initialRestorePromise = restoreDraftIfAvailable().then(restored => { saveState(restored ? 'Restore draft' : 'Open editor'); projectDirty = !!restored; updateProjectStatus(); });
    window.addEventListener('beforeunload', persistDraft);
    
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
    
    function wrapTextLines(context, text, maxWidth) {
        const words = text.split('\n').map(line => line.split(' '));
        const lines = [];
        for (let i = 0; i < words.length; i++) {
            let currentLine = words[i][0] || '';
            for (let j = 1; j < words[i].length; j++) {
                const word = words[i][j];
                const width = context.measureText(currentLine + ' ' + word).width;
                if (width < maxWidth) {
                    currentLine += ' ' + word;
                } else {
                    lines.push(currentLine);
                    currentLine = word;
                }
            }
            lines.push(currentLine);
        }
        return lines;
    }

    function measureTextLayout(context, text, fontSize, maxWidth) {
        const lines = wrapTextLines(context, text || '', maxWidth);
        const fallbackMetrics = context.measureText('Mg');
        let ascent = fallbackMetrics.actualBoundingBoxAscent || fontSize * 0.82;
        let descent = fallbackMetrics.actualBoundingBoxDescent || fontSize * 0.22;
        let maxLineWidth = 0;

        lines.forEach(line => {
            const metrics = context.measureText(line || ' ');
            maxLineWidth = Math.max(maxLineWidth, metrics.width);
            ascent = Math.max(ascent, metrics.actualBoundingBoxAscent || ascent);
            descent = Math.max(descent, metrics.actualBoundingBoxDescent || descent);
        });

        const lineHeight = Math.max(fontSize * 1.2, ascent + descent);
        const textHeight = lines.length ? ascent + descent + (lines.length - 1) * lineHeight : ascent + descent;
        return { lines, lineHeight, ascent, descent, textHeight, textWidth: maxLineWidth };
    }

    function getShapeLabelAnchor(s) {
        if (s.type === 'polyarrow' && s.points && s.points.length > 1) {
            const mid = Math.floor((s.points.length - 1) / 2);
            const a = s.points[mid];
            const b = s.points[mid + 1] || a;
            return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
        }
        return {
            x: s.x + (s.x2 - s.x) / 2,
            y: s.y + (s.y2 - s.y) / 2
        };
    }

    function normalizeHexColor(value, fallback = '#111827') {
        const v = String(value || '').trim();
        if (/^#[0-9a-f]{6}$/i.test(v)) return v;
        return fallback;
    }

    function getAttachedLabelBounds(s, targetCtx = ctx) {
        if (!s || !s.label || s.type === 'text') return null;
        const text = String(s.label).trim();
        if (!text) return null;

        const fontSize = parseInt(s.labelFontSize, 10) || 16;
        const anchor = getShapeLabelAnchor(s);
        const x = anchor.x + (s.labelOffsetX || 0);
        const y = anchor.y + (s.labelOffsetY ?? -10);

        targetCtx.save();
        targetCtx.font = `600 ${fontSize}px "${s.labelFontFamily || 'Arial'}", sans-serif`;
        const metrics = targetCtx.measureText(text);
        targetCtx.restore();

        const padX = 8;
        const padY = 5;
        const width = metrics.width + padX * 2;
        const height = fontSize + padY * 2;
        return {
            x: x - width / 2,
            y: y - height / 2,
            w: width,
            h: height,
            cx: x,
            cy: y
        };
    }

    function isPointInAttachedLabel(pos, s) {
        if (!s || s.hidden || s.locked) return false;
        const b = getAttachedLabelBounds(s);
        if (!b) return false;
        return pos.x >= b.x && pos.x <= b.x + b.w && pos.y >= b.y && pos.y <= b.y + b.h;
    }

    function findTopLabelAt(pos) {
        const shapes = editingGroup?.children || vectorShapes;
        for (let i = shapes.length - 1; i >= 0; i--) {
            if (isPointInAttachedLabel(pos, shapes[i])) return shapes[i];
        }
        return null;
    }

    function autoPlaceLabel(shape) {
        const w = Math.abs(shape.x2-shape.x), h = Math.abs(shape.y2-shape.y);
        const candidates = [[0,-h/2-24],[w/2+45,0],[0,h/2+24],[-w/2-45,0]];
        const flatten = shapes => shapes.flatMap(s => [s,...(s.children ? flatten(s.children) : [])]);
        const obstacles = flatten(vectorShapes).filter(s => s !== shape && !s.hidden);
        let best=candidates[0],bestScore=Infinity;
        candidates.forEach(([x,y]) => {
            shape.labelOffsetX=x; shape.labelOffsetY=y;
            const b=getAttachedLabelBounds(shape); if(!b)return;
            let score=0;
            obstacles.forEach(s => {
                const sx=Math.min(s.x,s.x2),sy=Math.min(s.y,s.y2),sw=Math.abs(s.x2-s.x),sh=Math.abs(s.y2-s.y);
                score += Math.max(0,Math.min(b.x+b.w,sx+sw)-Math.max(b.x,sx))*Math.max(0,Math.min(b.y+b.h,sy+sh)-Math.max(b.y,sy));
                const lb=getAttachedLabelBounds(s); if(lb) score += Math.max(0,Math.min(b.x+b.w,lb.x+lb.w)-Math.max(b.x,lb.x))*Math.max(0,Math.min(b.y+b.h,lb.y+lb.h)-Math.max(b.y,lb.y));
            });
            if(score<bestScore){bestScore=score;best=[x,y];}
        });
        shape.labelOffsetX=best[0]; shape.labelOffsetY=best[1];
    }

    function drawAttachedLabel(targetCtx, s) {
        if (!s.label || s.type === 'text') return;
        const text = String(s.label).trim();
        if (!text) return;

        const fontSize = s.labelFontSize || 16;
        const bounds = getAttachedLabelBounds(s, targetCtx);
        if (!bounds) return;

        targetCtx.save();
        targetCtx.globalAlpha = s.opacity ?? 1;
        targetCtx.font = `600 ${fontSize}px "${s.labelFontFamily || 'Arial'}", sans-serif`;
        targetCtx.textAlign = 'center';
        targetCtx.textBaseline = 'middle';

        const x = bounds.cx;
        const y = bounds.cy;
        const boxW = bounds.w;
        const boxH = bounds.h;
        const r = 5;

        const anchor = getShapeLabelAnchor(s);
        if (Math.hypot(x-anchor.x,y-anchor.y) > 24) {
            targetCtx.beginPath(); targetCtx.moveTo(anchor.x,anchor.y); targetCtx.lineTo(x,y);
            targetCtx.strokeStyle = s.labelColor || '#ffffff'; targetCtx.lineWidth = Math.max(1, fontSize/14); targetCtx.setLineDash([3,3]); targetCtx.stroke(); targetCtx.setLineDash([]);
        }
        targetCtx.fillStyle = s.labelBg || 'rgba(17,24,39,0.82)';
        targetCtx.beginPath();
        targetCtx.moveTo(x - boxW / 2 + r, y - boxH / 2);
        targetCtx.lineTo(x + boxW / 2 - r, y - boxH / 2);
        targetCtx.quadraticCurveTo(x + boxW / 2, y - boxH / 2, x + boxW / 2, y - boxH / 2 + r);
        targetCtx.lineTo(x + boxW / 2, y + boxH / 2 - r);
        targetCtx.quadraticCurveTo(x + boxW / 2, y + boxH / 2, x + boxW / 2 - r, y + boxH / 2);
        targetCtx.lineTo(x - boxW / 2 + r, y + boxH / 2);
        targetCtx.quadraticCurveTo(x - boxW / 2, y + boxH / 2, x - boxW / 2, y + boxH / 2 - r);
        targetCtx.lineTo(x - boxW / 2, y - boxH / 2 + r);
        targetCtx.quadraticCurveTo(x - boxW / 2, y - boxH / 2, x - boxW / 2 + r, y - boxH / 2);
        targetCtx.closePath();
        if (!s.labelTransparent) targetCtx.fill();

        targetCtx.fillStyle = s.labelColor || '#ffffff';
        targetCtx.fillText(text, x, y + 0.5);
        targetCtx.restore();
    }
    
    function drawShape(targetCtx, s) {
        if (s.isEditing || s.hidden) return;
        targetCtx.save();
        targetCtx.globalAlpha = s.opacity ?? 1;
        
        // Group: draw all children
        if (s.type === 'group' && s.children) {
            s.children.forEach(child => drawShape(targetCtx, child));
            targetCtx.restore();
            return;
        }
        
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
            if (s.borderRadius > 0) {
                const r = Math.min(s.borderRadius, Math.abs(w) / 2, Math.abs(h) / 2);
                targetCtx.moveTo(s.x + r, s.y);
                targetCtx.lineTo(s.x + w - r, s.y);
                targetCtx.quadraticCurveTo(s.x + w, s.y, s.x + w, s.y + r);
                targetCtx.lineTo(s.x + w, s.y + h - r);
                targetCtx.quadraticCurveTo(s.x + w, s.y + h, s.x + w - r, s.y + h);
                targetCtx.lineTo(s.x + r, s.y + h);
                targetCtx.quadraticCurveTo(s.x, s.y + h, s.x, s.y + h - r);
                targetCtx.lineTo(s.x, s.y + r);
                targetCtx.quadraticCurveTo(s.x, s.y, s.x + r, s.y);
                targetCtx.closePath();
            } else {
                targetCtx.rect(s.x, s.y, w, h);
            }
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
            targetCtx.textBaseline = 'alphabetic';
            targetCtx.textAlign = s.align || 'left';
            
            const maxWidth = Math.max(20, Math.abs(s.x2 - s.x));
            const { lines, lineHeight, ascent, descent, textHeight, textWidth } = measureTextLayout(targetCtx, s.text, s.fontSize, maxWidth);
            
            let drawX = s.x;
            if (s.align === 'center') drawX = s.x + maxWidth / 2;
            else if (s.align === 'right') drawX = s.x + maxWidth;

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
                
                let rx;
                if (s.align === 'center') rx = s.x + (maxWidth - textWidth) / 2 - padX;
                else if (s.align === 'right') rx = s.x + (maxWidth - textWidth) - padX;
                else rx = s.x - padX;

                const ry = s.y - padY, rw = textWidth + padX * 2, rh = textHeight + padY * 2, r = s.fontSize * 0.2;
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
                lines.forEach((line, i) => {
                    targetCtx.fillText(line, drawX, s.y + ascent + i * lineHeight);
                });
                targetCtx.restore();
            }
            
            targetCtx.fillStyle = s.stroke;
            
            // Effect outline
            if (s.textStyle === 'outline') {
                targetCtx.strokeStyle = s.textBgColor || '#000000';
                targetCtx.lineWidth = s.fontSize * 0.12;
                targetCtx.lineJoin = 'round';
                lines.forEach((line, i) => {
                    targetCtx.strokeText(line, drawX, s.y + ascent + i * lineHeight);
                });
            }
            
            lines.forEach((line, i) => {
                targetCtx.fillText(line, drawX, s.y + ascent + i * lineHeight);
            });
            
            if (s.fontUnderline) {
                targetCtx.beginPath();
                targetCtx.strokeStyle = s.stroke;
                targetCtx.lineWidth = Math.max(1, s.fontSize / 15);
                lines.forEach((line, i) => {
                    const lw = targetCtx.measureText(line).width;
                    let ux;
                    if (s.align === 'center') ux = drawX - lw / 2;
                    else if (s.align === 'right') ux = drawX - lw;
                    else ux = drawX;
                    
                    const underlineY = s.y + ascent + i * lineHeight + Math.max(2, descent * 0.35);
                    targetCtx.moveTo(ux, underlineY);
                    targetCtx.lineTo(ux + lw, underlineY);
                });
                targetCtx.stroke();
            }
            
            s.y2 = s.y + textHeight;
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

        drawAttachedLabel(targetCtx, s);
        targetCtx.restore();
    }
    
    function drawSelectionOverlay() {
        if (currentTool === 'select') setCanvasTooltip(`<b>${editingGroup ? 'Inside group' : 'Select'}</b> · Click object · Drag to move · <b style='color:#60a5fa;'>Ctrl</b>+click multi-select · <b style='color:#60a5fa;'>Shift/Alt</b>+drag duplicate`);
        queueStudioPanelRefresh();
        octx.clearRect(0, 0, overlay.width, overlay.height);
        
        // Draw grid pattern on overlay (non-destructive)
        drawGrid(octx);
        
        // When resizing canvas, dim objects instead of hiding them
        if (isResizingCanvas) {
            octx.save();
            octx.globalAlpha = 0.3;
            vectorShapes.forEach(s => drawShape(octx, s));
            octx.restore();
        } else {
            vectorShapes.forEach(s => drawShape(octx, s));
        }

        if (hoveredVectorShape && hoveredVectorShape !== activeVectorShape && !hoveredVectorShape.hidden) {
            const hover = { ...hoveredVectorShape, stroke: '#22d3ee', opacity: 0.8 };
            if (hover.type !== 'text' && hover.type !== 'image') hover.fill = 'transparent';
            hover.strokeWidth = Math.max(hoveredVectorShape.strokeWidth || 1, 3);
            octx.save();
            octx.shadowColor = '#22d3ee';
            octx.shadowBlur = 5;
            drawShape(octx, hover);
            octx.restore();
        }
        
        // Draw multi-selected outlines
        if (multiSelected.size > 0) {
            multiSelected.forEach(s => {
                if (s === activeVectorShape) return;
                const ms_cx = s.x + (s.x2 - s.x) / 2;
                const ms_cy = s.y + (s.y2 - s.y) / 2;
                const ms_w = Math.abs(s.x2 - s.x);
                const ms_h = Math.abs(s.y2 - s.y);
                const ms_rot = (s.rotation || 0) * Math.PI / 180;
                octx.save();
                octx.translate(ms_cx, ms_cy);
                octx.rotate(ms_rot);
                octx.strokeStyle = '#22d3ee';
                octx.lineWidth = 1.5;
                octx.setLineDash([4, 4]);
                octx.strokeRect(-ms_w/2 - 3, -ms_h/2 - 3, ms_w + 6, ms_h + 6);
                octx.setLineDash([]);
                octx.restore();
            });
        }
        
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
            const _typeNames = { rect: '▭ Rectangle', circle: '○ Circle', ellipse: '⬭ Ellipse', triangle: '△ Triangle', diamond: '◇ Diamond', parallelogram: '▱ Parallelogram', pentagon: '⬠ Pentagon', hexagon: '⬡ Hexagon', star: '★ Star', text: 'T Text', path: '✏ Brush Path', polyarrow: '↗ Line/Arrow', image: '🖼 Image', group: '⊞ Group' };
            const _typeName = _typeNames[s.type] || s.type;
            const _ow = Math.round(Math.abs(s.x2 - s.x));
            const _oh = Math.round(Math.abs(s.y2 - s.y));
            if (multiSelected.size >= 2) {
                container.querySelector('#is-obj-type-info').innerHTML = '<span style="color:#22d3ee; font-weight:500;">' + multiSelected.size + ' objects selected</span>';
            } else {
                container.querySelector('#is-obj-type-info').innerHTML = '<span style="color:#aaa; font-weight:500;">' + _typeName + (s.type === 'group' ? ' (' + s.children.length + ')' : '') + '</span> <span style="color:#555">|</span> <span style="color:#888;">' + _ow + ' × ' + _oh + ' px</span>';
            }
            container.querySelector('#is-obj-type-info').style.display = 'flex';
            container.querySelector('#is-ctx-back').style.display = 'flex';
            container.querySelector('#is-obj-remove-bg').style.display = 'none';
            container.querySelector('#is-obj-smart-remove').style.display = 'none';
            container.querySelector('#is-polyarrow-opts').style.display = 'none';
            container.querySelector('#is-ctx-group').style.display = multiSelected.size >= 2 ? 'flex' : 'none';
            container.querySelector('#is-ctx-ungroup').style.display = (s.type === 'group' && multiSelected.size < 2) ? 'flex' : 'none';
            // Hide smooth controls (shown selectively for path/polyarrow)
            container.querySelector('#is-brush-smooth').style.display = 'none';
            container.querySelector('#is-brush-smooth-divider').style.display = 'none';
            container.querySelector('#is-smooth-level').style.display = 'none';
            container.querySelector('#is-smooth-level-label').style.display = 'none';
            container.querySelector('#is-smooth-level-val').style.display = 'none';

            if (multiSelected.size >= 2) {
                container.querySelector('#is-ctx-front').style.display = 'none';
                container.querySelector('#is-ctx-back').style.display = 'none';
                container.querySelector('#is-obj-copy').style.display = 'none';
                container.querySelector('#is-obj-flatten').style.display = 'none';
                container.querySelector('#is-ctx-align').style.display = 'flex';
                return;
            } else {
                if (container.querySelector('#is-ctx-align')) {
                    container.querySelector('#is-ctx-align').style.display = 'none';
                }
            }

            if (s.type === 'text') {
                ctxTextSpan.style.display = 'contents';
                ctxShapeSpan.style.display = 'none';
                container.querySelector('#is-text-color').value = s.stroke || '#6366f1';
                container.querySelector('#is-font-family').value = s.fontFamily || 'Arial';
                container.querySelector('#is-font-size').value = s.fontSize || 48;
                container.querySelector('#is-font-bold').classList.toggle('active', !!s.fontBold);
                container.querySelector('#is-font-italic').classList.toggle('active', !!s.fontItalic);
                container.querySelector('#is-font-underline').classList.toggle('active', !!s.fontUnderline);
                
                const curAlign = s.align || 'left';
                container.querySelectorAll('.is-text-align').forEach(b => b.classList.toggle('active', b.getAttribute('data-align') === curAlign));

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
                if (s.type === 'rect') {
                    container.querySelector('#is-shape-radius-divider').style.display = '';
                    container.querySelector('#is-shape-radius-label').style.display = '';
                    container.querySelector('#is-shape-radius').style.display = '';
                    container.querySelector('#is-shape-radius').value = s.borderRadius || 0;
                } else {
                    container.querySelector('#is-shape-radius-divider').style.display = 'none';
                    container.querySelector('#is-shape-radius-label').style.display = 'none';
                    container.querySelector('#is-shape-radius').style.display = 'none';
                }
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
                
                if (s.type === 'rect') {
                    container.querySelector('#is-shape-radius-divider').style.display = '';
                    container.querySelector('#is-shape-radius-label').style.display = '';
                    container.querySelector('#is-shape-radius').style.display = '';
                    container.querySelector('#is-shape-radius').value = s.borderRadius || 0;
                } else {
                    container.querySelector('#is-shape-radius-divider').style.display = 'none';
                    container.querySelector('#is-shape-radius-label').style.display = 'none';
                    container.querySelector('#is-shape-radius').style.display = 'none';
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

    function setColorInputValue(selector, value, transparent = false) {
        const input = container.querySelector(selector);
        if (!input) return;
        input.dataset.transparent = transparent ? 'true' : 'false';
        input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
    }

    function applyDefaultStyleForTool(tool) {
        if (tool === 'line' || tool === 'polyarrow') {
            setColorInputValue('#is-shape-color', '#ef4444', false);
            setColorInputValue('#is-shape-fill-color', '#ef4444', true);
        } else if (['rect', 'circle', 'ellipse', 'triangle', 'diamond', 'parallelogram', 'pentagon', 'hexagon', 'star'].includes(tool)) {
            setColorInputValue('#is-shape-color', '#2563eb', false);
            setColorInputValue('#is-shape-fill-color', '#2563eb', true);
        } else if (tool === 'text') {
            setColorInputValue('#is-text-color', '#000000', false);
        }
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
            applyDefaultStyleForTool(currentTool);
            currentPolyPoints = []; // Reset poly points on tool switch
            hideCanvasTooltip();
            if (currentTool === 'text') canvas.style.cursor = 'text';
            else if (currentTool === 'select' || currentTool === 'region') canvas.style.cursor = 'default';
            else if (currentTool === 'hand') canvas.style.cursor = 'grab';
            else if (currentTool === 'line') canvas.style.cursor = 'crosshair';
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
            
            const isShapeTool = ['line', 'polyarrow', 'rect', 'circle', 'ellipse', 'triangle', 'diamond', 'parallelogram', 'pentagon', 'hexagon', 'star'].includes(currentTool);
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
            
                select: "Click to select · Drag to move · <b style='color:#60a5fa;'>Ctrl</b>+click multi-select · <b style='color:#60a5fa;'>Ctrl+G</b> group · <b style='color:#60a5fa;'>Shift</b>+handle lock ratio · <b style='color:#f0883e;'>Esc</b> select canvas",
                hand: "Drag to pan the canvas · Press <b style='color:#60a5fa;'>V</b> to return to Select",
            
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

                line: "Drag to draw one straight line",
            
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

    container.querySelectorAll('.is-text-align').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const align = btn.getAttribute('data-align');
            container.querySelectorAll('.is-text-align').forEach(b => b.classList.toggle('active', b === btn));
            if (activeVectorShape && activeVectorShape.type === 'text') {
                activeVectorShape.align = align;
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
        const maxWidth = Math.max(20, Math.abs(s.x2 - s.x));
        const layout = measureTextLayout(ctx, s.text, s.fontSize, maxWidth);
        s.y2 = s.y + layout.textHeight;
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


    const canvasContainer = container.querySelector('#is-canvas-container');

    const updateZoom = (val) => {
        val = Math.max(10, Math.min(400, Math.round(val)));
        zoomSlider.value = val;
        zoomValInput.value = val;
        canvasWrapper.style.transform = `scale(${val / 100})`;
        canvasWrapper.style.transformOrigin = 'center center';
    };

    zoomSlider.addEventListener('input', (e) => updateZoom(e.target.value));
    
    zoomValInput.addEventListener('change', (e) => updateZoom(e.target.value));
    zoomValInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            updateZoom(e.target.value);
            e.target.blur();
        }
    });

    function fitCanvasToWindow(attempt = 0) {
        const cw = canvasContainer.clientWidth;
        const ch = canvasContainer.clientHeight;
        if ((!cw || !ch || !canvas.width || !canvas.height) && attempt < 10) {
            requestAnimationFrame(() => fitCanvasToWindow(attempt + 1));
            return;
        }
        if (!cw || !ch || !canvas.width || !canvas.height) return;
        const scaleX = Math.max(cw - 120, 50) / canvas.width;
        const scaleY = Math.max(ch - 120, 50) / canvas.height;
        updateZoom(Math.min(scaleX, scaleY, 4) * 100);
    }

    container.querySelector('#is-zoom-fit').addEventListener('click', fitCanvasToWindow);

    container.querySelector('#is-zoom-reset').addEventListener('click', () => updateZoom(100));
    container.querySelector('#is-zoom-selection').addEventListener('click', () => {
        const selected = multiSelected.size ? [...multiSelected] : (activeVectorShape ? [activeVectorShape] : []);
        if (!selected.length) { showToast('Select an object first'); return; }
        const minX = Math.min(...selected.map(s => Math.min(s.x, s.x2)));
        const minY = Math.min(...selected.map(s => Math.min(s.y, s.y2)));
        const maxX = Math.max(...selected.map(s => Math.max(s.x, s.x2)));
        const maxY = Math.max(...selected.map(s => Math.max(s.y, s.y2)));
        const scaleX = Math.max(canvasContainer.clientWidth - 120, 50) / Math.max(1, maxX - minX);
        const scaleY = Math.max(canvasContainer.clientHeight - 120, 50) / Math.max(1, maxY - minY);
        updateZoom(Math.min(scaleX, scaleY, 4) * 100);
        canvasWrapper.style.transformOrigin = `${(minX + maxX) / 2}px ${(minY + maxY) / 2}px`;
    });

    initialRestorePromise.finally(() => {
        requestAnimationFrame(() => requestAnimationFrame(() => fitCanvasToWindow()));
        setTimeout(() => fitCanvasToWindow(), 120);
        setTimeout(() => fitCanvasToWindow(), 350);
    });

    // Panning & Zoom with Mouse
    let isPanning = false;
    let isSpaceDown = false;
    let isShiftDown = false;
    let isCtrlDown = false;
    let previousToolBeforeCtrl = null;
    let canvasSelected = false;

    // Reset all modifier key states when window loses focus (prevents stuck keys)
    function resetModifierStates() {
        isSpaceDown = false;
        isShiftDown = false;
        isCtrlDown = false;
        isPanning = false;
        previousToolBeforeCtrl = null;
        if (canvasContainer) canvasContainer.style.cursor = 'auto';
        if (canvas) {
            if (currentTool === 'text') canvas.style.cursor = 'text';
            else if (currentTool === 'select') canvas.style.cursor = 'default';
            else canvas.style.cursor = 'none';
        }
    }
    window.addEventListener('blur', resetModifierStates);
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) resetModifierStates();
    });

    // Helper: select the background canvas (deselect any object)
    function selectCanvasBackground() {
        activeVectorShape = null;
        canvasSelected = true;
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
    }
    let multiSelected = new Set(); // for Ctrl+Click multi-select
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
        if ((e.key === 'Control' || e.key === 'Meta') && !isCtrlDown) {
            isCtrlDown = true;
            if (currentTool !== 'select') {
                previousToolBeforeCtrl = currentTool;
                const selectBtn = Array.from(tools).find(btn => btn.getAttribute('data-tool') === 'select');
                if (selectBtn) selectBtn.click();
            }
        }
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
        if (e.key === 'Control' || e.key === 'Meta') {
            isCtrlDown = false;
            if (previousToolBeforeCtrl && currentTool === 'select') {
                const prevBtn = Array.from(tools).find(btn => btn.getAttribute('data-tool') === previousToolBeforeCtrl);
                if (prevBtn) prevBtn.click();
            }
            previousToolBeforeCtrl = null;
        }
    });

    canvasContainer.addEventListener('mousedown', (e) => {
        if (e.button === 1 || isSpaceDown || currentTool === 'hand') {
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

    const hitCanvas = document.createElement('canvas');
    const hitCtx = hitCanvas.getContext('2d', { willReadFrequently: true });

    function makeHitShape(shape) {
        const clone = { ...shape };
        if (shape.points) clone.points = shape.points.map(p => ({ ...p }));
        if (shape.originalPoints) clone.originalPoints = shape.originalPoints.map(p => ({ ...p }));
        if (shape.children) clone.children = shape.children.map(child => makeHitShape(child));
        if (shape.img) clone.img = shape.img;
        if (shape.type === 'image') {
            clone.type = 'rect';
            delete clone.img;
            clone.fill = '#000000';
        }
        clone.stroke = '#000000';
        const zoom = Math.max(0.1, (parseFloat(zoomSlider?.value) || 100) / 100);
        clone.strokeWidth = Math.max(shape.strokeWidth || 1, 10 / zoom);
        if (shape.type !== 'image' && shape.type !== 'text') {
            clone.fill = shape.fill && shape.fill !== 'transparent' ? '#000000' : null;
        }
        clone.opacity = 1;
        if (clone.label) {
            clone.labelColor = '#000000';
            clone.labelBg = '#000000';
        }
        return clone;
    }

    function isPointInShape(pos, s) {
        if (!s || s.hidden || s.locked) return false;
        const x = Math.round(pos.x);
        const y = Math.round(pos.y);
        if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) return false;

        if (hitCanvas.width !== canvas.width || hitCanvas.height !== canvas.height) {
            hitCanvas.width = canvas.width;
            hitCanvas.height = canvas.height;
        }

        hitCtx.clearRect(0, 0, hitCanvas.width, hitCanvas.height);
        drawShape(hitCtx, makeHitShape(s));
        const alpha = hitCtx.getImageData(x, y, 1, 1).data[3];
        hitCtx.clearRect(0, 0, hitCanvas.width, hitCanvas.height);
        return alpha > 8;
    }

    function findTopShapeAt(pos) {
        const shapes = editingGroup?.children || vectorShapes;
        for (let i = shapes.length - 1; i >= 0; i--) {
            if (isPointInShape(pos, shapes[i])) return shapes[i];
        }
        return null;
    }

    function constrainLineEnd(start, end) {
        if (!isShiftDown) return { x: end.x, y: end.y };
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const adx = Math.abs(dx);
        const ady = Math.abs(dy);
        if (adx > ady * 2) return { x: end.x, y: start.y };
        if (ady > adx * 2) return { x: start.x, y: end.y };
        const d = Math.max(adx, ady);
        return {
            x: start.x + d * Math.sign(dx || 1),
            y: start.y + d * Math.sign(dy || 1)
        };
    }

    function getConstrainedPolyPoint(pos, snap = null) {
        if (snap) return { x: snap.x, y: snap.y };
        if (!isShiftDown || currentPolyPoints.length === 0) return { x: pos.x, y: pos.y };
        return constrainLineEnd(currentPolyPoints[currentPolyPoints.length - 1], pos);
    }

    canvas.addEventListener('mousedown', (e) => {
        if (e.button === 1 || isSpaceDown) return;
        if (currentTool === 'smartremove') return; // Ignore if panning
        const pos = getMousePos(e);
        lastCanvasPointer = pos;
        
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

            const hitLabel = findTopLabelAt(pos);
            if (hitLabel) {
                canvasSelected = false;
                multiSelected.clear();
                activeVectorShape = hitLabel;
                selection = null;
                labelDragState = {
                    shape: hitLabel,
                    startX: pos.x,
                    startY: pos.y,
                    offsetX: hitLabel.labelOffsetX || 0,
                    offsetY: hitLabel.labelOffsetY ?? -10,
                    moved: false
                };
                drawSelectionOverlay();
                return;
            }
            
            // Check vector shapes (hit test in local rotated space)
            let hitShape = findTopShapeAt(pos);
            
            if (hitShape) {
                canvasSelected = false;
                // Ctrl+Click: toggle multi-select
                if (isCtrlDown || e.ctrlKey || e.metaKey) {
                    if (multiSelected.has(hitShape)) {
                        multiSelected.delete(hitShape);
                        if (hitShape === activeVectorShape) {
                            activeVectorShape = multiSelected.size > 0 ? [...multiSelected][0] : null;
                        }
                    } else {
                        if (activeVectorShape && !multiSelected.has(activeVectorShape)) {
                            multiSelected.add(activeVectorShape);
                        }
                        multiSelected.add(hitShape);
                        activeVectorShape = hitShape;
                    }
                    // Show group button if 2+ selected
                    if (multiSelected.size >= 2) {
                        container.querySelector('#is-ctx-group').style.display = 'flex';
                        container.querySelector('#is-obj-type-info').innerHTML = '<span style="color:#22d3ee; font-weight:500;">' + multiSelected.size + ' objects selected</span>';
                        container.querySelector('#is-obj-type-info').style.display = 'flex';
                    } else {
                        container.querySelector('#is-ctx-group').style.display = 'none';
                    }
                    drawSelectionOverlay();
                    return;
                }
                // Normal click: clear multi-select if not clicking on already selected item
                if (!multiSelected.has(hitShape)) {
                    multiSelected.clear();
                    container.querySelector('#is-ctx-group').style.display = 'none';
                }
                
                // If we're in control point editing mode on the active shape,
                // clicking the shape body should not start a move - only handles work
                if (hitShape === activeVectorShape && activeVectorShape.originalPoints && activeVectorShape.originalPoints.length > 1) {
                    // Allow move if not near a control point (control points checked above)
                    if (isShiftDown || e.shiftKey || e.altKey) prepareDuplicateOnDrag(hitShape, pos, e.altKey);
                    else { pendingDuplicateState = null; activeVectorShape = hitShape; }
                    resizingHandle = 'move';
                    startX = pos.x; startY = pos.y;
                    drawSelectionOverlay();
                    return;
                }

                if (isShiftDown || e.shiftKey || e.altKey) prepareDuplicateOnDrag(hitShape, pos, e.altKey);
                else { pendingDuplicateState = null; activeVectorShape = hitShape; }
                resizingHandle = 'move';
                startX = pos.x; startY = pos.y;
                selection = null; // drop raster selection
                drawSelectionOverlay();
                return;
            }
            
            
            activeVectorShape = null;
            multiSelected.clear();
            canvasSelected = false;
            selection = null;
            isDrawing = true;
            startX = pos.x;
            startY = pos.y;
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
            const pt = getConstrainedPolyPoint(pos, snap);
            
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
            input.style.textAlign = container.querySelector('.is-text-align.active')?.getAttribute('data-align') || 'left';
            input.style.lineHeight = '1.2';
            input.style.outline = '2px solid #3b82f6';
            input.style.outlineOffset = '2px';
            input.style.minWidth = '20px';
            input.style.minHeight = '1em';
            input.style.padding = '0';
            input.style.margin = '0';
            input.style.whiteSpace = 'pre-wrap';
            input.style.wordBreak = 'break-word';
            input.style.zIndex = '1000';
            input.style.cursor = 'text';
            input.style.background = 'rgba(255,255,255,0.8)';
            input.style.backdropFilter = 'blur(4px)';
            
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
                    
                    const textLines = txt.split('\n');
                    let maxW = 0;
                    textLines.forEach(l => {
                        const lw = ctx.measureText(l).width;
                        if (lw > maxW) maxW = lw;
                    });
                    const initialWidth = maxW + 5; // tiny buffer to avoid initial auto-wrap
                    const layout = measureTextLayout(ctx, txt, fontSize, Math.max(20, initialWidth));
                    const w = initialWidth;
                    const h = layout.textHeight;
                    
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
        lastCanvasPointer = pos;

        if (currentTool === 'select') {
            if (!labelDragState && !resizingHandle && !isDrawing && !isResizingCanvas) {
                const nextHover = findTopLabelAt(pos) || findTopShapeAt(pos);
                if (nextHover !== hoveredVectorShape) {
                    hoveredVectorShape = nextHover;
                    drawSelectionOverlay();
                }
            }
            if (labelDragState) {
                const dx = pos.x - labelDragState.startX;
                const dy = pos.y - labelDragState.startY;
                if (Math.hypot(dx, dy) > 3) labelDragState.moved = true;
                if (labelDragState.moved) {
                    labelDragState.shape.labelOffsetX = labelDragState.offsetX + dx;
                    labelDragState.shape.labelOffsetY = labelDragState.offsetY + dy;
                    drawSelectionOverlay();
                }
                return;
            }
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
                // Re-apply smooth or update points directly
                if (activeVectorShape.smoothLevel) {
                    applySmoothToShape(activeVectorShape, activeVectorShape.smoothLevel);
                } else if (activeVectorShape.points && activeVectorShape.points[draggingControlPointIdx]) {
                    activeVectorShape.points[draggingControlPointIdx].x = currentPos.x;
                    activeVectorShape.points[draggingControlPointIdx].y = currentPos.y;
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
                    if (pendingDuplicateState && !pendingDuplicateState.activated) {
                        const threshold = 5 / Math.max(0.1, (parseFloat(zoomSlider.value) || 100) / 100);
                        if (Math.hypot(pos.x - pendingDuplicateState.startX, pos.y - pendingDuplicateState.startY) < threshold) return;
                        activatePendingDuplicate();
                    }
                    const _shiftShape = (sh, ddx, ddy) => {
                        sh.x += ddx; sh.x2 += ddx;
                        sh.y += ddy; sh.y2 += ddy;
                        if (sh.originalPoints) sh.originalPoints.forEach(p => { p.x += ddx; p.y += ddy; });
                        if (sh.smoothLevel && sh.originalPoints) applySmoothToShape(sh, sh.smoothLevel);
                        else if (sh.points) sh.points.forEach(p => { p.x += ddx; p.y += ddy; });
                        if (sh.connections) sh.connections = null;
                        if (sh.type === 'group' && sh.children) sh.children.forEach(c => _shiftShape(c, ddx, ddy));
                    };
                    _shiftShape(activeVectorShape, dx, dy);
                    // Move all multi-selected shapes together
                    multiSelected.forEach(ms => {
                        if (ms === activeVectorShape) return;
                        _shiftShape(ms, dx, dy);
                    });
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
                if (activeVectorShape.type === 'text') recalcTextBounds(activeVectorShape);
                startX = pos.x; startY = pos.y;
                updateConnections();
                drawSelectionOverlay();
                return;
            }

            if (isDrawing) {
                octx.clearRect(0, 0, overlay.width, overlay.height);
                vectorShapes.forEach(s => drawShape(octx, s));
                const rx = Math.min(startX, pos.x);
                const ry = Math.min(startY, pos.y);
                const rw = Math.abs(pos.x - startX);
                const rh = Math.abs(pos.y - startY);
                octx.fillStyle = 'rgba(96, 165, 250, 0.1)';
                octx.fillRect(rx, ry, rw, rh);
                octx.strokeStyle = '#3b82f6';
                octx.setLineDash([5, 5]);
                octx.strokeRect(rx, ry, rw, rh);
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
                    if (isPointInShape(pos, s)) {
                        canvas.style.cursor = 'move';
                    } else {
                        canvas.style.cursor = hoveredVectorShape ? 'move' : 'default';
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
            } else if (['line', 'polyarrow', 'rect', 'circle', 'ellipse', 'triangle', 'diamond', 'parallelogram', 'pentagon', 'hexagon', 'star', 'crop', 'text'].includes(currentTool)) {
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
                    const previewEnd = constrainLineEnd(last, pos);
                    octx.lineTo(previewEnd.x, previewEnd.y);
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
            const rx = Math.min(startX, pos.x);
            const ry = Math.min(startY, pos.y);
            const rw = Math.abs(pos.x - startX);
            const rh = Math.abs(pos.y - startY);
            octx.fillStyle = 'rgba(96, 165, 250, 0.1)';
            octx.fillRect(rx, ry, rw, rh);
            octx.strokeStyle = '#60a5fa';
            octx.lineWidth = 1;
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
        } else if (currentTool === 'line') {
            const shapeColor = window._isGetCVal('#is-shape-color');
            const shapeStroke = parseInt(container.querySelector('#is-shape-stroke').value) || 5;
            const end = constrainLineEnd({ x: startX, y: startY }, pos);
            drawSelectionOverlay();
            drawShape(octx, {
                type: 'polyarrow',
                points: [{ x: startX, y: startY }, end],
                originalPoints: [{ x: startX, y: startY }, end],
                x: Math.min(startX, end.x) - shapeStroke,
                y: Math.min(startY, end.y) - shapeStroke,
                x2: Math.max(startX, end.x) + shapeStroke,
                y2: Math.max(startY, end.y) + shapeStroke,
                stroke: shapeColor,
                strokeWidth: shapeStroke,
                arrowMode: 'none',
                lineStyle: container.querySelector('#is-line-style').value,
                arrowHead: container.querySelector('#is-arrowhead-style').value
            });
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

    function finalizeLineShape(endPos) {
        if (currentTool !== 'line' || !endPos) return false;
        const shapeColor = window._isGetCVal('#is-shape-color');
        const shapeStroke = parseInt(container.querySelector('#is-shape-stroke').value) || 5;
        const end = constrainLineEnd({ x: startX, y: startY }, endPos);
        if (Math.hypot(end.x - startX, end.y - startY) < 3) {
            drawSelectionOverlay();
            return true;
        }
        const minX = Math.min(startX, end.x);
        const minY = Math.min(startY, end.y);
        const maxX = Math.max(startX, end.x);
        const maxY = Math.max(startY, end.y);
        vectorShapes.push({
            id: nextShapeId(),
            type: 'polyarrow',
            points: [{ x: startX, y: startY }, { x: end.x, y: end.y }],
            originalPoints: [{ x: startX, y: startY }, { x: end.x, y: end.y }],
            x: minX - shapeStroke, y: minY - shapeStroke,
            x2: maxX + shapeStroke, y2: maxY + shapeStroke,
            stroke: shapeColor,
            strokeWidth: shapeStroke,
            rotation: 0, flipH: false, flipV: false,
            arrowMode: 'none',
            lineStyle: container.querySelector('#is-line-style').value,
            arrowHead: container.querySelector('#is-arrowhead-style').value,
            connections: { start: null, end: null }
        });
        activeVectorShape = vectorShapes[vectorShapes.length - 1];
        currentTool = 'select';
        tools.forEach(t => t.classList.toggle('active', t.getAttribute('data-tool') === 'select'));
        canvas.style.cursor = 'default';
        drawSelectionOverlay();
        saveState();
        return true;
    }
    
    // Space to finish polyarrow, Escape to cancel / select canvas
    document.addEventListener('keydown', (e) => {
        if (!container.querySelector('#is-canvas')) return;
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
        if (currentTool === 'line' && isDrawing && e.key === 'Tab') {
            e.preventDefault();
            isDrawing = false;
            finalizeLineShape(lastCanvasPointer || { x: startX, y: startY });
            return;
        }
        if (currentTool === 'polyarrow') {
            if (e.key === ' ' || e.code === 'Space') {
                e.preventDefault();
                finalizePolyArrow();
            } else if (e.key === 'Escape' && currentPolyPoints.length > 0) {
                currentPolyPoints = [];
                hideCanvasTooltip();
                drawSelectionOverlay();
            }
            return;
        }
        // Ctrl+G: Group selected objects
        if ((e.ctrlKey || e.metaKey) && e.key === 'g' && currentTool === 'select') {
            e.preventDefault();
            if (multiSelected.size >= 2) {
                container.querySelector('#is-ctx-group').click();
            } else if (activeVectorShape && activeVectorShape.type === 'group') {
                container.querySelector('#is-ctx-ungroup').click();
            }
            return;
        }
        // Escape: deselect object → select canvas background
        if (e.key === 'Escape' && currentTool === 'select') {
            if (editingGroup) {
                e.preventDefault();
                exitGroup();
            } else if (multiSelected.size > 0) {
                multiSelected.clear();
                container.querySelector('#is-ctx-group').style.display = 'none';
                drawSelectionOverlay();
            } else if (activeVectorShape) {
                selectCanvasBackground();
                e.preventDefault();
            } else if (canvasSelected) {
                canvasSelected = false;
                drawSelectionOverlay();
            }
        }
    });

    // Double-click to edit text shapes
    canvas.addEventListener('dblclick', (e) => {
        if (currentTool !== 'select') return;
        const pos = getMousePos(e);
        const groupHit = findTopShapeAt(pos);
        if (!editingGroup && groupHit?.type === 'group') {
            e.preventDefault();
            enterGroup(groupHit);
            return;
        }
        const labelShape = findTopLabelAt(pos);
        if (labelShape) {
            e.preventDefault();
            activeVectorShape = labelShape;
            editAttachedLabel(labelShape);
            return;
        }
        
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
                s.isEditing = true;
                
                const input = document.createElement('div');
                input.className = 'is-text-input';
                input.contentEditable = true;
                input.innerText = s.text;
                input.style.position = 'absolute';
                input.style.left = s.x + 'px';
                input.style.top = s.y + 'px';
                input.style.width = Math.max(50, Math.abs(s.x2 - s.x)) + 'px';
                input.style.color = s.stroke;
                input.style.fontSize = s.fontSize + 'px';
                input.style.fontFamily = s.fontFamily || 'Arial';
                input.style.fontWeight = s.fontBold ? 'bold' : 'normal';
                input.style.fontStyle = s.fontItalic ? 'italic' : 'normal';
                input.style.textDecoration = s.fontUnderline ? 'underline' : 'none';
                input.style.textAlign = s.align || 'left';
                input.style.lineHeight = '1.2';
                input.style.outline = '2px solid #3b82f6';
                input.style.outlineOffset = '2px';
                input.style.minHeight = '1em';
                input.style.padding = '0';
                input.style.margin = '0';
                input.style.whiteSpace = 'pre-wrap';
                input.style.wordBreak = 'break-word';
                input.style.zIndex = '1000';
                input.style.cursor = 'text';
                input.style.background = 'rgba(255,255,255,0.8)';
                input.style.backdropFilter = 'blur(4px)';
                
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
                    s.isEditing = false;
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
                        s.isEditing = false;
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
        lastCanvasPointer = pos;

        if (currentTool === 'select') {
            if (labelDragState) {
                const state = labelDragState;
                labelDragState = null;
                isDrawing = false;
                if (state.moved) {
                    markStudioStarted();
                    drawSelectionOverlay();
                    saveState();
                } else {
                    editAttachedLabel(state.shape);
                }
                return;
            }
            if (isResizingCanvas) {
                isResizingCanvas = false;
                canvas.style.cursor = 'default';
                // Canvas was already resized in real-time during mousemove,
                // just update info and save state immediately
                const finalW = canvas.width, finalH = canvas.height;
                sizeInfo.innerText = finalW + ' x ' + finalH;
                container.querySelector('#is-obj-type-info').innerHTML = '<span style="color:#aaa; font-weight:500;">Background Canvas</span> <span style="color:#555">|</span> <span style="color:#888;">' + finalW + ' × ' + finalH + ' px</span>';
                saveState();
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
                const duplicated = !!pendingDuplicateState?.activated;
                const wasPending = !!pendingDuplicateState;
                const pendingState = pendingDuplicateState;
                const completedHandle = resizingHandle;
                pendingDuplicateState = null;
                resizingHandle = null;
                isDrawing = false;
                if (wasPending && !duplicated && pendingState) {
                    if (pendingState.altKey) {
                        const pool = editingGroup?.children || vectorShapes;
                        const hits = [...pool].reverse().filter(s => isPointInShape(pos, s));
                        const current = hits.indexOf(pendingState.previousActive);
                        activeVectorShape = hits[(current + 1 + hits.length) % Math.max(1,hits.length)] || pendingState.hitShape;
                        multiSelected.clear(); drawSelectionOverlay(); return;
                    }
                    multiSelected.clear(); pendingState.previousSelection.forEach(s => multiSelected.add(s));
                    if (pendingState.previousActive && pendingState.previousActive !== pendingState.hitShape) multiSelected.add(pendingState.previousActive);
                    if (multiSelected.has(pendingState.hitShape)) multiSelected.delete(pendingState.hitShape); else multiSelected.add(pendingState.hitShape);
                    activeVectorShape = pendingState.hitShape;
                    if (multiSelected.size < 2) multiSelected.clear();
                    drawSelectionOverlay();
                    return;
                }
                if (!wasPending || duplicated) saveState(duplicated ? 'Duplicate and move' : (completedHandle === 'move' ? 'Move object' : completedHandle === 'rotate' ? 'Rotate object' : 'Resize object'));
                return;
            }
            if (isDrawing) {
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
                    const allSpans = ['is-ctx-text','is-ctx-shape','is-ctx-brush','is-ctx-eraser','is-ctx-fill','is-ctx-crop','is-ctx-select','is-ctx-region-actions'];
                    allSpans.forEach(id => container.querySelector('#'+id).style.display = 'none');
                    container.querySelector('#is-ctx-region-actions').style.display = 'contents';
                    container.querySelector('#is-region-info').textContent = `${Math.round(w)} x ${Math.round(h)} px`;
                    contextBar.style.display = 'flex';
                    drawSelectionOverlay();
                } else {
                    selectCanvasBackground();
                }
                return;
            }
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

        if (currentTool === 'line') {
            finalizeLineShape(pos);
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
                rotation: 0, flipH: false, flipV: false,
                borderRadius: 0
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
                hasBaseImage = true;
                markStudioStarted();
                saveState();
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });

    // Paste Image
    document.addEventListener('paste', (e) => {
        if (!document.getElementById('is-canvas')) return;
        // Don't intercept paste when user is typing in an input field
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
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

    function getExportBounds(mode, shapes) {
        if (mode === 'selection' && selection) return { x:selection.x, y:selection.y, w:selection.w, h:selection.h };
        if (mode === 'objects' && shapes.length) {
            let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
            shapes.forEach(s => {
                const pad = Math.max(6, (s.strokeWidth || 0) + 4);
                minX=Math.min(minX,Math.min(s.x,s.x2)-pad); minY=Math.min(minY,Math.min(s.y,s.y2)-pad);
                maxX=Math.max(maxX,Math.max(s.x,s.x2)+pad); maxY=Math.max(maxY,Math.max(s.y,s.y2)+pad);
                const label = getAttachedLabelBounds(s);
                if (label) { minX=Math.min(minX,label.x); minY=Math.min(minY,label.y); maxX=Math.max(maxX,label.x+label.w); maxY=Math.max(maxY,label.y+label.h); }
            });
            return { x:Math.floor(minX), y:Math.floor(minY), w:Math.ceil(maxX-minX), h:Math.ceil(maxY-minY) };
        }
        return { x:0, y:0, w:canvas.width, h:canvas.height };
    }

    function buildExportCanvas(scale = 1, options = {}) {
        const mode = options.mode || 'canvas';
        const shapes = mode === 'objects' ? getSelectedShapes().filter(s => !s.hidden) : vectorShapes.filter(s => !s.hidden);
        const bounds = getExportBounds(mode, shapes);
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = Math.max(1, Math.round(bounds.w * scale));
        tempCanvas.height = Math.max(1, Math.round(bounds.h * scale));
        const tctx = tempCanvas.getContext('2d');
        tctx.scale(scale, scale);
        if (options.format === 'jpeg') { tctx.fillStyle='#ffffff'; tctx.fillRect(0,0,bounds.w,bounds.h); }
        tctx.translate(-bounds.x, -bounds.y);
        const omitBase = mode === 'objects' || (options.transparent && !hasBaseImage);
        if (!omitBase) tctx.drawImage(canvas, 0, 0);
        shapes.forEach(s => drawShape(tctx, s));
        return tempCanvas;
    }

    function downloadBlob(blob, filename) {
        const link = document.createElement('a');
        link.download = filename;
        link.href = URL.createObjectURL(blob);
        link.click();
        setTimeout(() => URL.revokeObjectURL(link.href), 1200);
    }

    function createProjectData() {
        return {
            app: 'WorldTools Image Studio Pro', version: 1, savedAt: new Date().toISOString(),
            canvasWidth: canvas.width, canvasHeight: canvas.height,
            canvasBgColor, canvasGrid, canvasGridSize, shapeIdCounter, hasBaseImage,
            baseDataURL: canvas.toDataURL('image/png'),
            shapes: vectorShapes.map(serializeShape)
        };
    }

    async function saveProject(saveAs = false) {
        const blob = new Blob([JSON.stringify(createProjectData())], { type: 'application/json' });
        try {
            if ((saveAs || !currentProjectHandle) && window.showSaveFilePicker) {
                currentProjectHandle = await window.showSaveFilePicker({
                    suggestedName: getProjectFilename(currentProjectName),
                    types: [{ description: 'WorldTools Image Project', accept: { 'application/json': [IMAGE_STUDIO_PROJECT_EXTENSION] } }]
                });
                currentProjectName = currentProjectHandle.name;
            }
            if (currentProjectHandle?.createWritable) {
                const writable = await currentProjectHandle.createWritable();
                await writable.write(blob); await writable.close();
            } else {
                const filename = getProjectFilename(currentProjectName);
                downloadBlob(blob, filename);
                currentProjectName = filename;
            }
            projectDirty = false; updateProjectStatus();
            showToast(`Project saved: ${currentProjectName}`, 'success');
        } catch (err) {
            if (err?.name !== 'AbortError') showToast(err.message || 'Could not save project', 'error');
        }
    }

    container.querySelector('#is-project-save-btn').addEventListener('click', () => saveProject(false));
    container.querySelector('#is-project-save-as-btn').addEventListener('click', () => saveProject(true));

    async function loadProjectFile(file, handle = null) {
        if (!file) return;
        try {
            const project = JSON.parse(await file.text());
            if (!project.baseDataURL || !Array.isArray(project.shapes)) throw new Error('This is not a valid Image Studio project.');
            const base = await loadImage(project.baseDataURL);
            canvas.width = project.canvasWidth || base.width;
            canvas.height = project.canvasHeight || base.height;
            overlay.width = canvas.width; overlay.height = canvas.height;
            ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.drawImage(base, 0, 0);
            vectorShapes = await Promise.all(project.shapes.map(deserializeShape));
            canvasBgColor = project.canvasBgColor || '#ffffff';
            canvasGrid = project.canvasGrid || 'none'; canvasGridSize = project.canvasGridSize || 20;
            hasBaseImage = !!project.hasBaseImage;
            shapeIdCounter = Math.max(shapeIdCounter, project.shapeIdCounter || 0);
            activeVectorShape = null; editingGroup = null; multiSelected.clear(); selection = null; studioStarted = true;
            history = []; historyStep = -1;
            currentProjectHandle = handle; currentProjectName = file.name || 'Untitled';
            drawSelectionOverlay(); saveState('Open project'); projectDirty = false; updateProjectStatus(); fitCanvasToWindow();
            showToast(`Project opened: ${file.name}`, 'success');
        } catch (err) { showToast(err.message || 'Could not open project', 'error', 4200); }
    }

    container.querySelector('#is-project-open-btn').addEventListener('click', async () => {
        if (projectDirty && !await showStudioConfirm({ title:'Open another project?', message:'Your current project has unsaved changes.', confirmText:'Open Project', danger:true })) return;
        if (window.showOpenFilePicker) {
            try {
                const [handle] = await window.showOpenFilePicker({ types:[{ description:'WorldTools Image Project', accept:{ 'application/json':[IMAGE_STUDIO_PROJECT_EXTENSION,'.json'] } }], multiple:false });
                await loadProjectFile(await handle.getFile(), handle);
                return;
            } catch (err) { if (err?.name === 'AbortError') return; }
        }
        container.querySelector('#is-project-open').click();
    });
    container.querySelector('#is-project-open').addEventListener('change', async e => {
        const file = e.target.files?.[0];
        e.target.value = '';
        await loadProjectFile(file, null);
    });

    // Export flattened image
    container.querySelector('#is-download-btn').addEventListener('click', () => {
        document.querySelector('#is-export-modal')?.remove();
        const modal = document.createElement('div');
        modal.id = 'is-export-modal'; modal.className = 'is-modal-overlay';
        modal.innerHTML = `<div class="is-modal" style="max-width:400px;"><h3>Export Image</h3><p>Exports a flattened image. Use Save Project when you need to edit objects again.</p>
            <div class="is-prop-grid">
                <div class="is-prop-field"><label>Format</label><select id="is-export-format"><option value="png">PNG</option><option value="jpeg">JPEG</option><option value="webp">WebP</option></select></div>
                <div class="is-prop-field"><label>Scale</label><select id="is-export-scale"><option value="1">1x</option><option value="2">2x</option><option value="3">3x</option></select></div>
                <div class="is-prop-field" style="grid-column:1/-1"><label>Area</label><select id="is-export-area"><option value="canvas">Entire canvas</option>${selection ? '<option value="selection">Selected region</option>' : ''}${getSelectedShapes().length ? '<option value="objects">Selected object(s)</option>' : ''}</select></div>
                <label style="grid-column:1/-1;display:flex;align-items:center;gap:8px;color:#ccc;font-size:12px;"><input id="is-export-transparent" type="checkbox" style="width:auto;"> Transparent background</label>
                <div class="is-prop-field" style="grid-column:1/-1"><label>Quality <span id="is-export-quality-value">92%</span></label><input id="is-export-quality" type="range" min="30" max="100" value="92"></div>
            </div>
            <div id="is-export-size" class="is-panel-empty" style="margin-top:10px;">${canvas.width} x ${canvas.height}px</div>
            <div class="is-modal-actions"><button class="is-btn-secondary" id="is-export-cancel">Cancel</button><button class="is-btn-primary" id="is-export-confirm"><i class='bx bx-export'></i> Export</button></div></div>`;
        document.body.appendChild(modal);
        const close = () => modal.remove();
        modal.querySelector('#is-export-cancel').addEventListener('click', close);
        modal.addEventListener('click', e => { if (e.target === modal) close(); });
        const quality = modal.querySelector('#is-export-quality');
        const scale = modal.querySelector('#is-export-scale');
        const format = modal.querySelector('#is-export-format');
        const area = modal.querySelector('#is-export-area');
        const transparent = modal.querySelector('#is-export-transparent');
        const refresh = () => {
            const factor = parseInt(scale.value, 10);
            modal.querySelector('#is-export-size').textContent = `${canvas.width * factor} x ${canvas.height * factor}px · ${format.value.toUpperCase()}`;
            modal.querySelector('#is-export-quality-value').textContent = `${quality.value}%`;
            const bounds = getExportBounds(area.value, area.value === 'objects' ? getSelectedShapes() : vectorShapes);
            modal.querySelector('#is-export-size').textContent = `${Math.round(bounds.w * factor)} x ${Math.round(bounds.h * factor)}px · ${format.value.toUpperCase()}`;
            quality.closest('.is-prop-field').style.display = format.value === 'png' ? 'none' : '';
            transparent.disabled = format.value === 'jpeg' || (hasBaseImage && area.value !== 'objects');
            if (transparent.disabled) transparent.checked = false;
            transparent.parentElement.title = hasBaseImage && area.value !== 'objects' ? 'The canvas contains a base image.' : '';
        };
        [quality, scale, format, area, transparent].forEach(el => el.addEventListener('input', refresh)); refresh();
        modal.querySelector('#is-export-confirm').addEventListener('click', () => {
            const btn = modal.querySelector('#is-export-confirm'); btn.disabled = true; btn.textContent = 'Preparing...';
            const type = `image/${format.value}`;
            const factor = parseInt(scale.value, 10);
            buildExportCanvas(factor, { mode:area.value, transparent:transparent.checked, format:format.value }).toBlob(blob => {
                if (!blob) { btn.disabled = false; btn.textContent = 'Export'; return; }
                downloadBlob(blob, `worldtools-image.${format.value === 'jpeg' ? 'jpg' : format.value}`);
                close(); showToast(`Exported ${format.value.toUpperCase()} at ${factor}x`, 'success');
            }, type, parseInt(quality.value, 10) / 100);
        });
    });

    // Clear
    container.querySelector('#is-clear').addEventListener('click', async () => {
        if(await showStudioConfirm({
            title: 'Clear canvas?',
            message: 'This removes the current base image, selection, and all editable objects. You can still use Undo right after clearing.',
            confirmText: 'Clear Canvas',
            danger: true
        })) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            vectorShapes = [];
            activeVectorShape = null;
            selection = null;
            studioStarted = false;
            hasBaseImage = false;
            drawSelectionOverlay();
            saveState();
            showToast('Canvas cleared', 'success');
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
        const selected = getSelectedShapes();
        if (selected.length > 0) {
            copyObjectsToInternalClipboard(selected);
            copySelectedObjects().catch(err => console.warn('Object preview copy failed:', err));
            const copyBtn = container.querySelector('#is-copy-btn');
            if (copyBtn) {
                copyBtn.style.color = '#4ade80';
                setTimeout(() => copyBtn.style.color = '', 800);
            }
            return;
        }

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
        const selected = getSelectedShapes();
        if (selected.length > 0) {
            copyObjectsToInternalClipboard(selected);
            deleteSelectedObjects();
            return;
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
        if (objectClipboard && objectClipboard.shapes.length > 0) {
            const clones = objectClipboard.shapes.map(s => {
                const clone = cloneShape(s);
                shiftShapeRecursive(clone, 24, 24);
                return clone;
            });

            vectorShapes.push(...clones);
            multiSelected.clear();
            if (clones.length > 1) clones.forEach(clone => multiSelected.add(clone));
            activeVectorShape = clones[clones.length - 1];
            currentTool = 'select';
            tools.forEach(t => t.classList.toggle('active', t.getAttribute('data-tool') === 'select'));
            canvas.style.cursor = 'default';
            drawSelectionOverlay();
            saveState();
        } else if (clipboardData) {
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
        sizeInfo.innerText = `${Math.round(selection.w)} × ${Math.round(selection.h)}`;
        selection = null;
        
        // Reset context bar
        const allSpans = ['is-ctx-text','is-ctx-shape','is-ctx-brush','is-ctx-eraser','is-ctx-fill','is-ctx-crop','is-ctx-select','is-ctx-region-actions'];
        allSpans.forEach(id => container.querySelector('#'+id).style.display = 'none');
        container.querySelector('#is-ctx-crop').style.display = 'contents';
        
        drawSelectionOverlay();
        saveState();
    });

    const handleRegionSelect = (mode) => {
        if (!selection) return;
        const rx1 = selection.x;
        const ry1 = selection.y;
        const rx2 = selection.x + selection.w;
        const ry2 = selection.y + selection.h;
        
        multiSelected.clear();
        vectorShapes.forEach(s => {
            const bx1 = Math.min(s.x, s.x2);
            const by1 = Math.min(s.y, s.y2);
            const bx2 = Math.max(s.x, s.x2);
            const by2 = Math.max(s.y, s.y2);
            
            let match = false;
            if (mode === 'inside') {
                match = (bx1 >= rx1 && bx2 <= rx2 && by1 >= ry1 && by2 <= ry2);
            } else if (mode === 'intersect') {
                match = (bx1 <= rx2 && bx2 >= rx1 && by1 <= ry2 && by2 >= ry1);
            }
            if (match) multiSelected.add(s);
        });
        
        if (multiSelected.size > 0) {
            selection = null;
            container.querySelector('[data-tool="select"]').click();
            if (multiSelected.size === 1) {
                activeVectorShape = [...multiSelected][0];
                multiSelected.clear();
            } else {
                activeVectorShape = [...multiSelected][0];
            }
            drawSelectionOverlay();
        } else {
            // Nothing selected, just clear selection
            selection = null;
            container.querySelector('[data-tool="select"]').click();
        }
    };

    container.querySelector('#is-region-select-inside').addEventListener('click', () => handleRegionSelect('inside'));
    container.querySelector('#is-region-select-intersect').addEventListener('click', () => handleRegionSelect('intersect'));
    
    // Context bar delete
    container.querySelector('#is-ctx-del').addEventListener('click', () => {
        if (activeVectorShape || multiSelected.size > 0) {
            deleteSelectedObjects();
            return;
        } else if (selection) {
            if (!selection.isFloating) {
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(selection.x, selection.y, selection.w, selection.h);
            }
            selection = null;
        }
        container.querySelector('#is-ctx-group').style.display = 'none';
        contextBar.style.display = 'none';
        drawSelectionOverlay();
        saveState();
    });
    
    // Layer ordering: Bring to Front
    container.querySelector('#is-ctx-front').addEventListener('click', () => {
        if (!activeVectorShape) return;
        const pool = editingGroup?.children || vectorShapes;
        const idx = pool.indexOf(activeVectorShape);
        if (idx < pool.length - 1) {
            pool.splice(idx, 1);
            pool.push(activeVectorShape);
            drawSelectionOverlay();
            saveState();
        }
    });
    
    // Layer ordering: Send to Back
    container.querySelector('#is-ctx-back').addEventListener('click', () => {
        if (!activeVectorShape) return;
        const pool = editingGroup?.children || vectorShapes;
        const idx = pool.indexOf(activeVectorShape);
        if (idx > 0) {
            pool.splice(idx, 1);
            pool.unshift(activeVectorShape);
            drawSelectionOverlay();
            saveState();
        }
    });

    // Group selected objects
    container.querySelector('#is-ctx-group').addEventListener('click', () => {
        if (multiSelected.size < 2) return;
        const pool = editingGroup?.children || vectorShapes;
        const children = [...multiSelected].sort((a, b) => pool.indexOf(a) - pool.indexOf(b));
        const topObject = children[children.length - 1];
        const topIdx = pool.indexOf(topObject);
        const selectedBelowCount = children.length - 1; // All except the top one

        // Calculate bounding box of all children
        let gx1 = Infinity, gy1 = Infinity, gx2 = -Infinity, gy2 = -Infinity;
        children.forEach(s => {
            gx1 = Math.min(gx1, Math.min(s.x, s.x2));
            gy1 = Math.min(gy1, Math.min(s.y, s.y2));
            gx2 = Math.max(gx2, Math.max(s.x, s.x2));
            gy2 = Math.max(gy2, Math.max(s.y, s.y2));
        });
        // Remove children from main array
        const remaining = pool.filter(s => !multiSelected.has(s));
        if (editingGroup) editingGroup.children = remaining; else vectorShapes = remaining;
        // Create group shape
        const group = {
            type: 'group',
            id: 'g_' + Date.now(),
            x: gx1, y: gy1, x2: gx2, y2: gy2,
            rotation: 0,
            children: children,
            stroke: 'transparent', strokeWidth: 0
        };
        // Insert at the original top-most position
        const destination = editingGroup?.children || vectorShapes;
        destination.splice(topIdx - selectedBelowCount, 0, group);
        multiSelected.clear();
        activeVectorShape = group;
        container.querySelector('#is-ctx-group').style.display = 'none';
        container.querySelector('#is-ctx-ungroup').style.display = 'flex';
        drawSelectionOverlay();
        saveState();
    });

    // Alignment tools
    container.querySelectorAll('.is-obj-align').forEach(btn => {
        btn.addEventListener('click', () => {
            if (multiSelected.size < 2) return;
            const alignType = btn.getAttribute('data-align');
            
            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
            multiSelected.forEach(s => {
                const sLeft = s.type === 'polyarrow' || s.type === 'path' ? s.x : Math.min(s.x, s.x2);
                const sTop = s.type === 'polyarrow' || s.type === 'path' ? s.y : Math.min(s.y, s.y2);
                const sRight = s.type === 'polyarrow' || s.type === 'path' ? s.x2 : Math.max(s.x, s.x2);
                const sBottom = s.type === 'polyarrow' || s.type === 'path' ? s.y2 : Math.max(s.y, s.y2);
                if (sLeft < minX) minX = sLeft;
                if (sTop < minY) minY = sTop;
                if (sRight > maxX) maxX = sRight;
                if (sBottom > maxY) maxY = sBottom;
            });
            const centerX = minX + (maxX - minX) / 2;
            const centerY = minY + (maxY - minY) / 2;
            
            const _shiftShape = (sh, ddx, ddy) => {
                sh.x += ddx; sh.x2 += ddx;
                sh.y += ddy; sh.y2 += ddy;
                if (sh.originalPoints) sh.originalPoints.forEach(p => { p.x += ddx; p.y += ddy; });
                if (sh.smoothLevel && sh.originalPoints && typeof applySmoothToShape === 'function') applySmoothToShape(sh, sh.smoothLevel);
                else if (sh.points) sh.points.forEach(p => { p.x += ddx; p.y += ddy; });
                if (sh.connections) sh.connections = null;
                if (sh.type === 'group' && sh.children) sh.children.forEach(c => _shiftShape(c, ddx, ddy));
            };

            multiSelected.forEach(s => {
                const sLeft = s.type === 'polyarrow' || s.type === 'path' ? s.x : Math.min(s.x, s.x2);
                const sTop = s.type === 'polyarrow' || s.type === 'path' ? s.y : Math.min(s.y, s.y2);
                const sRight = s.type === 'polyarrow' || s.type === 'path' ? s.x2 : Math.max(s.x, s.x2);
                const sBottom = s.type === 'polyarrow' || s.type === 'path' ? s.y2 : Math.max(s.y, s.y2);
                const sCenterX = sLeft + (sRight - sLeft) / 2;
                const sCenterY = sTop + (sBottom - sTop) / 2;
                
                let ddx = 0, ddy = 0;
                switch(alignType) {
                    case 'top': ddy = minY - sTop; break;
                    case 'v-middle': ddy = centerY - sCenterY; break;
                    case 'bottom': ddy = maxY - sBottom; break;
                    case 'left': ddx = minX - sLeft; break;
                    case 'h-middle': ddx = centerX - sCenterX; break;
                    case 'right': ddx = maxX - sRight; break;
                }
                if (ddx !== 0 || ddy !== 0) {
                    _shiftShape(s, ddx, ddy);
                }
            });
            drawSelectionOverlay();
            saveState();
        });
    });

    // Ungroup
    container.querySelector('#is-ctx-ungroup').addEventListener('click', () => {
        if (!activeVectorShape || activeVectorShape.type !== 'group') return;
        const group = activeVectorShape;
        const pool = editingGroup?.children || vectorShapes;
        const idx = pool.indexOf(group);
        if (idx < 0) return;
        // Restore children to main array at the same position
        pool.splice(idx, 1, ...group.children);
        activeVectorShape = null;
        multiSelected.clear();
        container.querySelector('#is-ctx-ungroup').style.display = 'none';
        drawSelectionOverlay();
        saveState();
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

    container.querySelector('#is-shape-radius').addEventListener('input', () => {
        if (activeVectorShape && activeVectorShape.type === 'rect') {
            activeVectorShape.borderRadius = parseInt(container.querySelector('#is-shape-radius').value) || 0;
            drawSelectionOverlay();
        }
    });

    // Undo / Redo
    let _restorePending = false;
    const restoreState = (step) => {
        const entry = history[step];
        if (!entry) return;
        _restorePending = true;
        if (entry.canvasWidth && entry.canvasHeight) {
            canvas.width = entry.canvasWidth;
            canvas.height = entry.canvasHeight;
            overlay.width = entry.canvasWidth;
            overlay.height = entry.canvasHeight;
            sizeInfo.innerText = `${canvas.width} x ${canvas.height}`;
        }
        canvasBgColor = entry.canvasBgColor || canvasBgColor;
        canvasGrid = entry.canvasGrid || canvasGrid;
        canvasGridSize = entry.canvasGridSize || canvasGridSize;
        hasBaseImage = !!entry.hasBaseImage;
        const img = new Image();
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            _restorePending = false;
            // Redraw overlay AFTER canvas is ready to avoid visual desync
            drawSelectionOverlay();
            scheduleDraftSave();
            refreshStudioPanels();
        };
        img.src = entry.dataURL;
        // Restore vector shapes (deep clone including nested objects)
        vectorShapes = entry.shapes.map(s => snapshotShape(s));
        activeVectorShape = null;
        editingGroup = null;
        multiSelected.clear();
        selection = null;
        projectDirty = true;
        updateProjectStatus();
        studioStarted = vectorShapes.length > 0 || historyStep > 0;
        refreshStudioPanels();
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
        // Ignore if typing in input fields
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
        
        if (e.key === 'Delete' && currentTool === 'select') {
            if (multiSelected.size > 0) {
                vectorShapes = vectorShapes.filter(s => !multiSelected.has(s));
                multiSelected.clear();
                activeVectorShape = null;
                container.querySelector('#is-ctx-group').style.display = 'none';
                drawSelectionOverlay();
                saveState();
            } else if (activeVectorShape) {
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
        if (e.ctrlKey && e.key.toLowerCase() === 'a') {
            e.preventDefault();
            selectAllObjects();
        }
        if (e.ctrlKey && e.key.toLowerCase() === 'x') {
            e.preventDefault();
            performCut();
        }
        if (e.ctrlKey && !e.shiftKey && e.key.toLowerCase() === 's') {
            e.preventDefault();
            container.querySelector('#is-download-btn').click();
        }
        if (e.ctrlKey && e.key.toLowerCase() === 'o') {
            e.preventDefault();
            uploadBtn.click();
        }
        if (!e.ctrlKey && !e.metaKey && e.key.toLowerCase() === 'v') {
            container.querySelector('.is-tool[data-tool="select"]')?.click();
        }
        if (!e.ctrlKey && !e.metaKey && e.key.toLowerCase() === 'h') {
            container.querySelector('.is-tool[data-tool="hand"]')?.click();
        }
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 's') {
            e.preventDefault();
            container.querySelector('#is-project-save-btn').click();
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
            container.querySelector('#is-adj-container').classList.remove('is-more-open');
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

    container.querySelector('#is-flatten-all').addEventListener('click', async () => {
        if (!vectorShapes || vectorShapes.length === 0) return;
        const ok = await showStudioConfirm({
            title: 'Merge all objects?',
            message: 'All editable objects will be painted into the base image. This keeps the visual result but removes individual layer editing.',
            confirmText: 'Merge All',
            danger: true
        });
        if (!ok) return;
        
        vectorShapes.forEach(s => {
            if (typeof drawShape === 'function') drawShape(ctx, s);
        });
        vectorShapes.splice(0, vectorShapes.length);
        activeVectorShape = null;
        saveState();
        drawSelectionOverlay();
        showToast('Objects merged into the image', 'success');
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
            <div style="padding: 4px 10px; font-size: 10px; color: #9ca3af; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;">Create or Edit</div>
            <button class="is-btn-icon" id="is-ai-opt-create" style="justify-content: flex-start; padding: 6px 10px; width: 100%; border-radius: 4px; font-size: 11px; white-space: nowrap;" title="Generate a new editable image object"><i class='bx bxs-magic-wand' style="margin-right: 6px; color:#10b981;"></i> Generate New Image</button>
            <button class="is-btn-icon" id="is-ai-opt-whole" style="justify-content: flex-start; padding: 6px 10px; width: 100%; border-radius: 4px; font-size: 11px; white-space: nowrap;" title="Apply a prompt to the whole canvas or selected image"><i class='bx bx-image-alt' style="margin-right: 6px;"></i> Edit Whole Image</button>
            <button class="is-btn-icon" id="is-ai-opt-area" style="justify-content: flex-start; padding: 6px 10px; width: 100%; border-radius: 4px; font-size: 11px; white-space: nowrap;" title="Draw an area first, then describe the change"><i class='bx bx-highlight' style="margin-right: 6px;"></i> Edit Selected Area</button>
            <div style="height: 1px; background: rgba(255,255,255,0.1); margin: 4px 0; width: 100%;"></div>
            <div style="padding: 4px 10px; font-size: 10px; color: #9ca3af; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;">Enhance</div>
            <button class="is-btn-icon" id="is-ai-opt-super" style="justify-content: flex-start; padding: 6px 10px; width: 100%; border-radius: 4px; font-size: 11px; white-space: nowrap;"><i class='bx bx-zoom-in' style="margin-right: 6px;"></i> Upscale Image</button>
            <button class="is-btn-icon" id="is-ai-opt-analyze" style="justify-content: flex-start; padding: 6px 10px; width: 100%; border-radius: 4px; font-size: 11px; white-space: nowrap;"><i class='bx bx-search-alt' style="margin-right: 6px;"></i> Analyze Image</button>
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

        function showAiEditModal(imageDataUrl, isObj, maskDataUrl = null, targetW = 1, targetH = 1) {
            // Capture the active object reference now — it may be deselected during async operations
            const capturedShape = activeVectorShape;
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
                    <div style="display:flex;gap:12px;">
                        <div style="flex:1;">
                            <label style="display:block;color:#d1d5db;font-size:12px;margin-bottom:6px;">Provider</label>
                            <select id="is-ai-edit-provider-select" style="width:100%;background:#111;color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:8px;font-size:13px;outline:none;box-sizing:border-box;">
                                ${!maskDataUrl ? '<option value="pollinations" selected>Pollinations AI</option>' : ''}
                                <option value="magnific" ${maskDataUrl ? 'selected' : ''}>Magnific</option>
                                ${!maskDataUrl ? '<option value="puter">Puter AI</option>' : ''}
                            </select>
                        </div>
                        <div style="flex:1;">
                            <label style="display:block;color:#d1d5db;font-size:12px;margin-bottom:6px;">Model</label>
                            <select id="is-ai-edit-model-select" style="width:100%;background:#111;color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:8px;font-size:13px;outline:none;box-sizing:border-box;">
                                <option value="gptimage" selected>GPT Image ★</option>
                                <option value="flux">Flux ★</option>
                                <option value="kontext">Kontext</option>
                            </select>
                        </div>
                    </div>
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
            
            const providerSelect = modalContent.querySelector('#is-ai-edit-provider-select');
            const modelSelect = modalContent.querySelector('#is-ai-edit-model-select');
            
            if (providerSelect && modelSelect) {
                const updateEditModels = async () => {
                    const provider = providerSelect.value;
                    modelSelect.innerHTML = '';
                    if (provider === 'magnific') {
                        modelSelect.innerHTML = `
                            <option value="nano-banana-pro" selected>Google Banana Pro</option>
                            <option value="mystic">Mystic</option>
                            <option value="reimagine-flux">Reimagine Flux</option>
                        `;
                    } else if (provider === 'puter') {
                        modelSelect.innerHTML = `
                            <option value="gemini-2.5-flash-image-preview" selected>Gemini 2.5 Flash</option>
                            <option value="dall-e-3">DALL-E 3</option>
                            <option value="gpt-image-2">GPT Image 2</option>
                            <option value="black-forest-labs/flux-schnell">Flux.1 Schnell</option>
                            <option value="stabilityai/stable-diffusion-3-medium">Stable Diffusion 3</option>
                        `;
                    } else if (provider === 'pollinations') {
                        modelSelect.innerHTML = `<option value="gptimage" selected>GPT Image (Loading...)</option>`;
                        try {
                            const res = await fetch('https://gen.pollinations.ai/image/models');
                            const models = await res.json();
                            // Edit priority: gptimage first, then flux, then other edit-capable
                            const editFirst = ['gptimage', 'gptimage-large', 'gpt-image-2', 'flux', 'kontext', 'seedream', 'seedream-pro', 'seedream5', 'nanobanana', 'nanobanana-pro', 'nanobanana-2', 'klein'];
                            const allNames = models.map(m => m.name || m);
                            const top = editFirst.filter(n => allNames.includes(n));
                            const rest = allNames.filter(n => !editFirst.includes(n));
                            const ordered = [...top, ...rest];
                            modelSelect.innerHTML = ordered.map(n => `<option value="${n}"${n === 'gptimage' ? ' selected' : ''}>${n}${editFirst.includes(n) ? ' ★' : ''}</option>`).join('');
                        } catch(e) {
                            modelSelect.innerHTML = `
                                <option value="gptimage" selected>GPT Image</option>
                                <option value="flux">Flux</option>
                                <option value="kontext">Kontext</option>
                                <option value="seedream">Seedream</option>
                                <option value="nanobanana">Nanobanana</option>
                                <option value="klein">Klein</option>
                            `;
                        }
                    }
                };
                providerSelect.addEventListener('change', updateEditModels);
                updateEditModels(); // Load models for default provider
            }
            
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
                    const settings = typeof AIClient !== 'undefined' ? AIClient.getSettings() : { provider: 'gemini' };
                    const res = await fetch(`${getApiBase()}/api/ai/refine-prompt`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ prompt: currentVal, settings })
                    });
                    const data = await res.json();
                    if (!res.ok || !data.success) throw new Error(data.error);
                    
                    promptInput.value = data.prompt;
                    revertBtn.style.display = 'block';
                } catch (err) {
                    showToast('Refine failed: ' + err.message, 'error');
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
                        imageKey: localStorage.getItem('worldtools_image_key') || '',
                        pollinationsApiKey: localStorage.getItem('worldtools_pollinations_key') || ''
                    };

                    let res, data;
                    if (maskDataUrl) {
                        const fillProviderVal = modalContent.querySelector('#is-ai-edit-provider-select').value;
                        const fillModelVal = modalContent.querySelector('#is-ai-edit-model-select').value;
                        
                        let finalMaskDataUrl = maskDataUrl;
                        if (fillProviderVal === 'pollinations') {
                            // Pollinations expects transparent area for edit, opaque for keep.
                            // Our default maskDataUrl is: white (#FFFFFF) = keep, black (#000000) = edit
                            const tempCanvas = document.createElement('canvas');
                            const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
                            const maskImg = new Image();
                            await new Promise(resolve => {
                                maskImg.onload = resolve;
                                maskImg.src = maskDataUrl;
                            });
                            tempCanvas.width = maskImg.width;
                            tempCanvas.height = maskImg.height;
                            tempCtx.drawImage(maskImg, 0, 0);
                            const imgData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
                            const dataBytes = imgData.data;
                            for (let i = 0; i < dataBytes.length; i += 4) {
                                // If it's black (edit area), make it transparent
                                const isBlack = dataBytes[i] < 128 && dataBytes[i+1] < 128 && dataBytes[i+2] < 128;
                                if (isBlack) {
                                    dataBytes[i+3] = 0; // Alpha 0 = transparent
                                }
                            }
                            tempCtx.putImageData(imgData, 0, 0);
                            finalMaskDataUrl = tempCanvas.toDataURL('image/png');
                        }

                        res = await fetch(`${getApiBase()}/api/ai/generate-fill`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ 
                                prompt: promptVal, 
                                image: imageDataUrl,
                                mask: finalMaskDataUrl,
                                settings,
                                provider: fillProviderVal,
                                model: fillModelVal,
                                targetW: targetW,
                                targetH: targetH
                            })
                        });
                        data = await res.json();
                        if (!res.ok || !data.success) throw new Error(data.message || data.error || "Failed to generate fill");
                    } else {
                        const modelVal = modalContent.querySelector('#is-ai-edit-model-select').value;
                        const providerVal = modalContent.querySelector('#is-ai-edit-provider-select').value;
                        res = await fetch(`${getApiBase()}/api/ai/edit-image`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ 
                                prompt: promptVal, 
                                model: modelVal, 
                                provider: providerVal,
                                image: imageDataUrl,
                                settings,
                                targetW: targetW,
                                targetH: targetH
                            })
                        });
                        data = await res.json();
                        if (!res.ok || !data.success) throw new Error(data.error || data.message || "Failed to edit image");
                    }

                    const newImg = new Image();
                    newImg.crossOrigin = 'anonymous';
                    newImg.onload = () => {
                        closeModal();
                        
                        if (isObj && capturedShape) {
                            capturedShape.img = newImg;
                            activeVectorShape = capturedShape;
                            markStudioStarted();
                            saveState(); drawSelectionOverlay();
                        } else {
                            if (!maskDataUrl) {
                                ctx.clearRect(0, 0, canvas.width, canvas.height);
                                vectorShapes.splice(0, vectorShapes.length);
                            }
                            ctx.drawImage(newImg, 0, 0, canvas.width, canvas.height);
                            markStudioStarted();
                            saveState();
                            drawSelectionOverlay();
                        }
                    };
                    newImg.onerror = () => {
                        closeModal();
                        showToast("Failed to load edited image.", 'error');
                    };
                    newImg.src = data.imageUrl || data.imageBase64;
                    
                } catch (err) {
                    console.error(err);
                    showToast("Edit failed: " + err.message, 'error');
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
                            imageKey: localStorage.getItem('worldtools_image_key') || '',
                            pollinationsApiKey: localStorage.getItem('worldtools_pollinations_key') || ''
                        };
                        
                        const response = await fetch(`${getApiBase()}/api/ai/generate-fill`, {
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
                                markStudioStarted();
                                saveState(); drawSelectionOverlay();
                            } else {
                                ctx.drawImage(newImage, 0, 0, canvas.width, canvas.height);
                                markStudioStarted();
                                saveState(); drawSelectionOverlay();
                            }
                        };
                        newImage.src = data.imageUrl || data.imageBase64;
                    } catch (err) {
                        console.error("AI Generation error:", err);
                        showToast("AI generation failed: " + err.message, 'error');
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
            showAiEditModal(imageDataUrl, isObj, maskDataUrl, targetW, targetH);
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
            
            showAiEditModal(imageDataUrl, isObj, null, targetW, targetH);
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
            
            const scaleStr = await showStudioPrompt({
                title: 'Super Resolution',
                message: 'Choose an upscale level. 2x is faster; 4x is a good default; higher values can take longer.',
                defaultValue: '4',
                confirmText: 'Upscale'
            });
            if (!scaleStr) {
                document.addEventListener('pointerdown', closeMenu);
                return;
            }
            const scaleFactor = parseInt(scaleStr);
            if (isNaN(scaleFactor) || scaleFactor < 1) {
                showToast("Invalid scale factor.", 'error');
                return;
            }
            
            const btn = e.target;
            const origHTML = btn.innerHTML;
            
            const toast = showToast(`Running Super Resolution ${scaleFactor}x (10-30s)...`, 'info', 30000);
            
            try {
                const baseSettings = typeof AIClient !== 'undefined' ? AIClient.getSettings() : { provider: 'gemini', geminiKey: '' };
                const settings = {
                    ...baseSettings,
                    imageKey: localStorage.getItem('worldtools_image_key') || '',
                    pollinationsApiKey: localStorage.getItem('worldtools_pollinations_key') || ''
                };
                
                const response = await fetch(`${getApiBase()}/api/ai/edit-image`, {
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
                    markStudioStarted();
                    saveState(); drawSelectionOverlay();
                    showToast('Upscaled image applied', 'success');
                };
                newImg.onerror = () => { toast.remove(); showToast("Failed to load upscaled image", 'error'); };
                newImg.src = data.imageUrl || data.imageBase64;
            } catch(err) {
                toast.remove();
                showToast("Super Resolution error: " + err.message, 'error');
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
                    <div style="font-size:11px;color:#9ca3af;background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.18);border-radius:6px;padding:8px 10px;">Defaults are ready for quick generation. Change provider, model, or canvas size only when you need more control.</div>
                    <div style="display:flex; gap:12px; margin-bottom: 12px;">
                        <div style="flex:1;">
                            <label style="display:block;color:#d1d5db;font-size:12px;margin-bottom:6px;">Provider</label>
                            <select id="is-ai-create-provider-select" style="width:100%;background:#111;color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:8px;font-size:13px;outline:none;box-sizing:border-box;">
                                <option value="pollinations" selected>Pollinations AI</option>
                                <option value="magnific">Magnific</option>
                                <option value="puter">Puter AI</option>
                            </select>
                        </div>
                        <div style="flex:1;">
                            <label style="display:block;color:#d1d5db;font-size:12px;margin-bottom:6px;">Model</label>
                            <select id="is-ai-create-model-select" style="width:100%;background:#111;color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:8px;font-size:13px;outline:none;box-sizing:border-box;">
                                <option value="flux" selected>Flux ★</option>
                                <option value="gptimage">GPT Image ★</option>
                                <option value="kontext">Kontext</option>
                            </select>
                        </div>
                    </div>
                    <div style="display:flex;gap:12px;">
                        <div style="flex:1;">
                            <label style="display:block;color:#d1d5db;font-size:12px;margin-bottom:6px;">Aspect Ratio</label>
                            <select id="is-ai-create-ratio" style="width:100%;background:#111;color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:8px;font-size:13px;outline:none;box-sizing:border-box;">
                                <option value="square_1_1" selected>1:1 (Square)</option>
                                <option value="widescreen_16_9">16:9 (Landscape)</option>
                                <option value="social_story_9_16">9:16 (Portrait)</option>
                                <option value="classic_4_3">4:3</option>
                                <option value="traditional_3_4">3:4</option>
                                <option value="custom">Custom Size</option>
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
                    <div style="display:none; gap:12px; margin-top: 12px;" id="is-ai-create-custom-size-group">
                        <div style="flex:1;">
                            <label style="display:block;color:#d1d5db;font-size:12px;margin-bottom:6px;">Custom Width (px)</label>
                            <input type="number" id="is-ai-create-custom-w" placeholder="e.g. 1024" style="width:100%;background:#111;color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:8px;font-size:13px;outline:none;box-sizing:border-box;">
                        </div>
                        <div style="flex:1;">
                            <label style="display:block;color:#d1d5db;font-size:12px;margin-bottom:6px;">Custom Height (px)</label>
                            <input type="number" id="is-ai-create-custom-h" placeholder="e.g. 1024" style="width:100%;background:#111;color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:8px;font-size:13px;outline:none;box-sizing:border-box;">
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
            
            const providerSelect = modalContent.querySelector('#is-ai-create-provider-select');
            const modelSelect = modalContent.querySelector('#is-ai-create-model-select');
            
            const updateModels = async () => {
                const provider = providerSelect.value;
                modelSelect.innerHTML = '';
                if (provider === 'magnific') {
                    modelSelect.innerHTML = `
                        <option value="nano-banana-pro" selected>Google Banana Pro</option>
                        <option value="mystic">Mystic</option>
                        <option value="reimagine-flux">Reimagine Flux</option>
                    `;
                } else if (provider === 'puter') {
                    modelSelect.innerHTML = `
                        <option value="gemini-2.5-flash-image-preview" selected>Gemini 2.5 Flash</option>
                        <option value="dall-e-3">DALL-E 3</option>
                        <option value="gpt-image-2">GPT Image 2</option>
                        <option value="black-forest-labs/flux-schnell">Flux.1 Schnell</option>
                        <option value="stabilityai/stable-diffusion-3-medium">Stable Diffusion 3</option>
                    `;
                } else if (provider === 'pollinations') {
                    // Create mode: flux first, then gptimage, then others
                    modelSelect.innerHTML = `<option value="flux" selected>Flux (Loading models...)</option>`;
                    try {
                        const res = await fetch('https://gen.pollinations.ai/image/models');
                        const models = await res.json();
                        const createFirst = ['flux', 'gptimage', 'gptimage-large', 'gpt-image-2', 'kontext', 'seedream', 'seedream-pro', 'seedream5', 'nanobanana', 'nanobanana-pro', 'nanobanana-2', 'klein', 'zimage'];
                        const allNames = models.map(m => m.name || m);
                        const top = createFirst.filter(n => allNames.includes(n));
                        const rest = allNames.filter(n => !createFirst.includes(n));
                        const ordered = [...top, ...rest];
                        modelSelect.innerHTML = ordered.map(n => `<option value="${n}"${n === 'flux' ? ' selected' : ''}>${n}${createFirst.includes(n) ? ' ★' : ''}</option>`).join('');
                    } catch(e) {
                        modelSelect.innerHTML = `
                            <option value="flux" selected>Flux ★</option>
                            <option value="gptimage">GPT Image ★</option>
                            <option value="kontext">Kontext</option>
                            <option value="seedream">Seedream</option>
                        `;
                    }
                }
            };
            
            providerSelect.addEventListener('change', updateModels);
            updateModels(); // Load models for default provider
            
            const ratioSelect = modalContent.querySelector('#is-ai-create-ratio');
            const customSizeGroup = modalContent.querySelector('#is-ai-create-custom-size-group');
            ratioSelect.addEventListener('change', () => {
                if (ratioSelect.value === 'custom') {
                    customSizeGroup.style.display = 'flex';
                } else {
                    customSizeGroup.style.display = 'none';
                }
            });
            
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
                    const settings = typeof AIClient !== 'undefined' ? AIClient.getSettings() : { provider: 'gemini' };
                    const res = await fetch(`${getApiBase()}/api/ai/refine-prompt`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ prompt: currentVal, settings })
                    });
                    const data = await res.json();
                    if (!res.ok || !data.success) throw new Error(data.error);
                    
                    promptInput.value = data.prompt;
                    revertBtn.style.display = 'block';
                } catch (err) {
                    showToast('Refine failed: ' + err.message, 'error');
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
                
                const providerVal = modalContent.querySelector('#is-ai-create-provider-select').value;
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
                    let finalImageUrl = null;
                    
                    if (providerVal === 'puter') {
                        const puter = await ensurePuterLoaded();
                        const apiOptions = { model: modelVal };
                        if (ratioVal === "square_1_1") { apiOptions.width = 1024; apiOptions.height = 1024; }
                        else if (ratioVal === "widescreen_16_9") { apiOptions.width = 1024; apiOptions.height = 576; }
                        else if (ratioVal === "social_story_9_16") { apiOptions.width = 576; apiOptions.height = 1024; }
                        else if (ratioVal === "classic_4_3") { apiOptions.width = 1024; apiOptions.height = 768; }
                        else if (ratioVal === "traditional_3_4") { apiOptions.width = 768; apiOptions.height = 1024; }
                        else if (ratioVal === "custom") {
                            const cw = parseInt(modalContent.querySelector('#is-ai-create-custom-w').value);
                            const ch = parseInt(modalContent.querySelector('#is-ai-create-custom-h').value);
                            if (cw && ch) {
                                apiOptions.width = cw;
                                apiOptions.height = ch;
                            }
                        }
                        
                        const resultImg = await puter.ai.txt2img(promptVal, apiOptions);
                        if (resultImg instanceof HTMLImageElement) finalImageUrl = resultImg.src;
                        else if (typeof resultImg === 'string') finalImageUrl = resultImg;
                        else if (resultImg.url) finalImageUrl = resultImg.url;
                        else finalImageUrl = URL.createObjectURL(new Blob([resultImg]));
                    } else {
                        const settings = { 
                            imageKey: localStorage.getItem('worldtools_image_key') || '',
                            pollinationsApiKey: localStorage.getItem('worldtools_pollinations_key') || ''
                        };
    
                        const reqBody = { 
                            prompt: promptVal, 
                            model: modelVal,
                            provider: providerVal,
                            settings 
                        };

                        if (ratioVal === "custom") {
                            const cw = parseInt(modalContent.querySelector('#is-ai-create-custom-w').value);
                            const ch = parseInt(modalContent.querySelector('#is-ai-create-custom-h').value);
                            if (cw && ch) {
                                reqBody.width = cw;
                                reqBody.height = ch;
                            }
                        } else {
                            reqBody.aspect_ratio = ratioVal;
                        }

                        const res = await fetch(`${getApiBase()}/api/ai/generate-image`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(reqBody)
                        });
                        
                        const data = await res.json();
                        if (!res.ok || !data.success) throw new Error(data.error || data.message || "Failed to generate image");
                        finalImageUrl = data.imageUrl || data.imageBase64;
                    }

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
                            container.querySelectorAll('.is-tool').forEach(t => t.classList.remove('active'));
                            const selBtn = container.querySelector('.is-tool[data-tool="select"]');
                            if (selBtn) selBtn.classList.add('active');
                            canvas.style.cursor = 'default';
                        }
                        
                        markStudioStarted();
                        saveState();
                        drawSelectionOverlay();
                    };
                    newImg.onerror = () => {
                        closeModal();
                        showToast("Failed to load generated image.", 'error');
                    };
                    newImg.src = finalImageUrl;
                    
                } catch (err) {
                    console.error(err);
                    showToast("Generation failed: " + err.message, 'error');
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
                
                const settings = typeof AIClient !== 'undefined' ? AIClient.getSettings() : { provider: 'gemini' };

                let analysisResult = "";

                if (settings.provider === 'puter') {
                    const puter = await ensurePuterLoaded();
                    
                    if (typeof puter.ai.img2txt === 'function') {
                        // Some APIs take (image, prompt) or just (image)
                        analysisResult = await puter.ai.img2txt(imageDataUrl, reqPrompt);
                    } else if (typeof puter.ai.chat === 'function') {
                        // Fallback to chat if img2txt is not available
                        analysisResult = await puter.ai.chat(reqPrompt, imageDataUrl);
                    } else {
                        throw new Error("Puter API does not support vision analysis currently.");
                    }
                    
                    if (typeof analysisResult === 'object') {
                        analysisResult = analysisResult.message || analysisResult.text || JSON.stringify(analysisResult);
                    }
                } else {
                    const res = await fetch(`${getApiBase()}/api/ai/vision`, {
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
                    analysisResult = data.result;
                }

                // Update the loading item with actual result
                const itemIdx = window.aiAnalysisHistory.findIndex(i => i.id === loadingId);
                if (itemIdx !== -1) {
                    window.aiAnalysisHistory[itemIdx].result = analysisResult;
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
            showToast("No AI analysis history yet.", 'info');
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
            copyObjectsToInternalClipboard();
            const btn = container.querySelector('#is-obj-copy');
            const original = btn.innerHTML;
            btn.innerHTML = "<i class='bx bx-check'></i> Copied";
            setTimeout(() => { btn.innerHTML = original; }, 900);
        } catch(err) {
            console.error(err);
            showToast("Error copying object: " + err.message, 'error');
        }
    });

    function getSelectedShapes() {
        return multiSelected.size >= 2 ? [...multiSelected] : (activeVectorShape ? [activeVectorShape] : []);
    }

    function copyObjectsToInternalClipboard(shapes = getSelectedShapes()) {
        if (!shapes || shapes.length === 0) return false;
        const pool = editingGroup?.children || vectorShapes;
        objectClipboard = {
            copiedAt: Date.now(),
            shapes: shapes
                .sort((a, b) => pool.indexOf(a) - pool.indexOf(b))
                .map(s => cloneShape(s))
        };
        return true;
    }

    function shiftShapeRecursive(shape, dx, dy) {
        shape.x += dx;
        shape.x2 += dx;
        shape.y += dy;
        shape.y2 += dy;
        if (shape.points) shape.points.forEach(p => { p.x += dx; p.y += dy; });
        if (shape.originalPoints) shape.originalPoints.forEach(p => { p.x += dx; p.y += dy; });
        if (shape.type === 'group' && shape.children) shape.children.forEach(child => shiftShapeRecursive(child, dx, dy));
    }

    async function copySelectedObjects() {
        const selected = getSelectedShapes();
        if (selected.length === 0) {
            performCopy();
            return;
        }

        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        selected.forEach(s => {
            const pad = s.type === 'image' ? 0 : ((s.strokeWidth || 0) + 10);
            minX = Math.min(minX, Math.min(s.x, s.x2) - pad);
            minY = Math.min(minY, Math.min(s.y, s.y2) - pad);
            maxX = Math.max(maxX, Math.max(s.x, s.x2) + pad);
            maxY = Math.max(maxY, Math.max(s.y, s.y2) + pad);
        });

        const tempC = document.createElement('canvas');
        tempC.width = Math.max(1, Math.ceil(maxX - minX));
        tempC.height = Math.max(1, Math.ceil(maxY - minY));
        const tCtx = tempC.getContext('2d');
        tCtx.translate(-minX, -minY);
        selected.forEach(s => drawShape(tCtx, s));

        const blob = await new Promise(resolve => tempC.toBlob(resolve, 'image/png'));
        if (!blob) return;
        await navigator.clipboard.write([new window.ClipboardItem({ 'image/png': blob })]);
    }

    function deleteSelectedObjects() {
        const pool = editingGroup?.children || vectorShapes;
        const selected = multiSelected.size > 0 ? [...multiSelected] : (activeVectorShape ? [activeVectorShape] : []);
        if (selected.length) {
            const remaining = pool.filter(s => !selected.includes(s));
            if (editingGroup) editingGroup.children = remaining; else vectorShapes = remaining;
            multiSelected.clear(); activeVectorShape = null;
            if (editingGroup && !editingGroup.children.length) { const emptyGroup = editingGroup; exitGroup(); vectorShapes = vectorShapes.filter(s => s !== emptyGroup); }
        } else if (selection) {
            selection = null;
        }
        contextBar.style.display = 'none';
        drawSelectionOverlay();
        saveState();
    }

    function duplicateSelectedObjects() {
        const selected = getSelectedShapes();
        if (selected.length === 0) return;

        const clones = selected
            .sort((a, b) => vectorShapes.indexOf(a) - vectorShapes.indexOf(b))
            .map(s => {
                const clone = cloneShape(s);
                shiftShapeRecursive(clone, 24, 24);
                return clone;
            });

        const pool = editingGroup?.children || vectorShapes;
        pool.push(...clones);
        multiSelected.clear();
        if (clones.length > 1) clones.forEach(clone => multiSelected.add(clone));
        activeVectorShape = clones[clones.length - 1];
        drawSelectionOverlay();
        saveState();
    }

    function selectAllObjects() {
        const pool = editingGroup?.children || vectorShapes;
        multiSelected.clear();
        pool.filter(s => !s.locked && !s.hidden).forEach(s => multiSelected.add(s));
        activeVectorShape = pool[pool.length - 1] || null;
        if (activeVectorShape) canvasSelected = false;
        drawSelectionOverlay();
    }

    function bringSelectedToFront() {
        const selected = getSelectedShapes();
        if (selected.length === 0) return;
        const pool = editingGroup?.children || vectorShapes;
        const remaining = pool.filter(s => !selected.includes(s));
        remaining.push(...selected);
        if (editingGroup) editingGroup.children = remaining; else vectorShapes = remaining;
        drawSelectionOverlay();
        saveState();
    }

    function sendSelectedToBack() {
        const selected = getSelectedShapes();
        if (selected.length === 0) return;
        const pool = editingGroup?.children || vectorShapes;
        const remaining = pool.filter(s => !selected.includes(s));
        remaining.unshift(...selected);
        if (editingGroup) editingGroup.children = remaining; else vectorShapes = remaining;
        drawSelectionOverlay();
        saveState();
    }

    function flattenSelectedObjects() {
        const selected = getSelectedShapes();
        if (selected.length === 0) return;
        selected
            .sort((a, b) => vectorShapes.indexOf(a) - vectorShapes.indexOf(b))
            .forEach(s => drawShape(ctx, s));
        const pool = editingGroup?.children || vectorShapes;
        const remaining = pool.filter(s => !selected.includes(s));
        if (editingGroup) editingGroup.children = remaining; else vectorShapes = remaining;
        activeVectorShape = null;
        multiSelected.clear();
        drawSelectionOverlay();
        saveState();
    }

    async function editAttachedLabel(shape = activeVectorShape) {
        if (!shape || shape.type === 'text') return;
        document.querySelector('.is-label-popover')?.remove();
        const modal = document.createElement('div');
        modal.className = 'is-label-popover is-modal';
        modal.innerHTML = `
                <h3>${shape.label ? 'Edit attached label' : 'Add attached label'}</h3>
                <p>This label stays attached to the object and can be dragged directly on the canvas.</p>
                <div class="is-prop-field" style="margin-bottom:10px;">
                    <label>Label text</label>
                    <input id="is-label-editor-text" type="text" value="${escapeHtml(shape.label || '')}" placeholder="Optional label">
                </div>
                <div class="is-prop-grid" style="margin-bottom:10px;">
                    <div class="is-prop-field"><label>Size</label><input id="is-label-editor-size" type="number" min="8" max="96" value="${parseInt(shape.labelFontSize, 10) || 16}"></div>
                    <div class="is-prop-field"><label>Font</label><select id="is-label-editor-font">
                        ${['Arial','Inter','Be Vietnam Pro','Montserrat','Georgia','Times New Roman','Courier New'].map(f => `<option value="${escapeHtml(f)}" ${(shape.labelFontFamily || 'Arial') === f ? 'selected' : ''}>${escapeHtml(f)}</option>`).join('')}
                    </select></div>
                    <div class="is-prop-field"><label>Text</label><input id="is-label-editor-color" type="color" value="${normalizeHexColor(shape.labelColor, '#ffffff')}"></div>
                    <div class="is-prop-field"><label>Fill</label><input id="is-label-editor-bg" type="color" value="${normalizeHexColor(shape.labelBg, '#111827')}"></div>
                </div>
                <label style="display:flex;align-items:center;gap:7px;color:#aaa;font-size:12px;"><input id="is-label-editor-transparent" type="checkbox" ${shape.labelTransparent ? 'checked' : ''} style="width:auto;"> Transparent fill</label>
                <div class="is-modal-actions">
                    <button class="is-btn-secondary" id="is-label-editor-remove" type="button">Remove</button>
                    <button class="is-btn-secondary" id="is-label-editor-cancel" type="button">Cancel</button>
                    <button class="is-btn-primary" id="is-label-editor-apply" type="button">Apply Label</button>
                </div>`;
        document.body.appendChild(modal);

        const bounds = getAttachedLabelBounds(shape);
        const canvasRect = canvas.getBoundingClientRect();
        const objectAnchor = getShapeLabelAnchor(shape);
        const anchorX = canvasRect.left + (bounds ? bounds.cx : objectAnchor.x) * canvasRect.width / canvas.width;
        const anchorY = canvasRect.top + (bounds ? bounds.y + bounds.h : Math.max(shape.y, shape.y2) + 12) * canvasRect.height / canvas.height + 10;
        const popupRect = modal.getBoundingClientRect();
        modal.style.left = `${Math.max(12, Math.min(window.innerWidth - popupRect.width - 12, anchorX - popupRect.width / 2))}px`;
        modal.style.top = `${Math.max(12, Math.min(window.innerHeight - popupRect.height - 12, anchorY))}px`;

        const close = () => { modal.remove(); document.removeEventListener('pointerdown', outside); };
        const outside = e => { if (!modal.contains(e.target)) close(); };
        setTimeout(() => document.addEventListener('pointerdown', outside), 0);
        modal.querySelector('#is-label-editor-cancel').addEventListener('click', close);
        modal.querySelector('#is-label-editor-remove').addEventListener('click', () => {
            delete shape.label;
            activeVectorShape = shape;
            markStudioStarted();
            drawSelectionOverlay();
            saveState('Remove attached label');
            close();
        });
        modal.querySelector('#is-label-editor-apply').addEventListener('click', () => {
            const label = modal.querySelector('#is-label-editor-text').value.trim();
            if (label) shape.label = label;
            else delete shape.label;
            shape.labelFontSize = Math.max(8, Math.min(96, parseInt(modal.querySelector('#is-label-editor-size').value, 10) || 16));
            shape.labelFontFamily = modal.querySelector('#is-label-editor-font').value || 'Arial';
            shape.labelColor = normalizeHexColor(modal.querySelector('#is-label-editor-color').value, '#ffffff');
            shape.labelBg = normalizeHexColor(modal.querySelector('#is-label-editor-bg').value, '#111827');
            shape.labelTransparent = modal.querySelector('#is-label-editor-transparent').checked;
            activeVectorShape = shape;
            markStudioStarted();
            drawSelectionOverlay();
            saveState(shape.label ? 'Edit attached label' : 'Remove attached label');
            close();
        });
        setTimeout(() => modal.querySelector('#is-label-editor-text')?.focus(), 0);
    }

    function showStudioContextMenu(event, mode) {
        container.querySelector('#is-right-click-menu')?.remove();

        const selected = getSelectedShapes();
        const hasObjects = selected.length > 0;
        const isMulti = selected.length > 1;
        const activeIsImage = activeVectorShape && activeVectorShape.type === 'image';
        const menu = document.createElement('div');
        menu.id = 'is-right-click-menu';
        menu.style.cssText = 'position:fixed;z-index:100000;min-width:220px;background:#252526;border:1px solid rgba(255,255,255,0.12);border-radius:8px;padding:6px;box-shadow:0 16px 40px rgba(0,0,0,0.5);display:flex;flex-direction:column;gap:2px;color:#ddd;font-size:12px;';

        const item = (icon, label, action, opts = {}) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.disabled = !!opts.disabled;
            btn.innerHTML = `<i class='bx ${icon}' style="font-size:16px;color:${opts.color || '#9ca3af'};"></i><span>${label}</span>${opts.shortcut ? `<span style="margin-left:auto;color:#666;font-size:11px;">${opts.shortcut}</span>` : ''}`;
            btn.style.cssText = 'width:100%;height:30px;border:none;border-radius:5px;background:transparent;color:inherit;display:flex;align-items:center;gap:8px;padding:0 9px;text-align:left;cursor:pointer;font-family:inherit;font-size:12px;';
            if (btn.disabled) {
                btn.style.opacity = '0.4';
                btn.style.cursor = 'not-allowed';
            } else {
                btn.onmouseenter = () => btn.style.background = 'rgba(255,255,255,0.08)';
                btn.onmouseleave = () => btn.style.background = 'transparent';
                btn.addEventListener('click', async () => {
                    menu.remove();
                    try { await action(); } catch (err) { showToast(err.message || err, 'error'); }
                });
            }
            return btn;
        };
        const divider = () => {
            const el = document.createElement('div');
            el.style.cssText = 'height:1px;background:rgba(255,255,255,0.08);margin:4px 2px;';
            return el;
        };
        const label = (text) => {
            const el = document.createElement('div');
            el.textContent = text;
            el.style.cssText = 'padding:5px 9px 3px;color:#8b8b8b;text-transform:uppercase;font-size:10px;font-weight:700;letter-spacing:.45px;';
            return el;
        };

        if (mode === 'object' && hasObjects) {
            menu.appendChild(label(isMulti ? `${selected.length} objects` : 'Object'));
            menu.appendChild(item('bx-copy', 'Copy object', () => { copyObjectsToInternalClipboard(); }, { shortcut: 'Ctrl+C' }));
            menu.appendChild(item('bx-image', 'Copy preview PNG', copySelectedObjects));
            menu.appendChild(item('bx-cut', 'Cut object', () => { copyObjectsToInternalClipboard(); deleteSelectedObjects(); }, { shortcut: 'Ctrl+X' }));
            menu.appendChild(item('bx-duplicate', 'Duplicate', duplicateSelectedObjects));
            menu.appendChild(item('bx-trash', 'Delete', deleteSelectedObjects, { shortcut: 'Del', color: '#f87171' }));
            menu.appendChild(item('bx-text', activeVectorShape?.label ? 'Edit attached label' : 'Add attached label', () => editAttachedLabel(activeVectorShape), { disabled: isMulti || activeVectorShape?.type === 'text', color: '#60a5fa' }));
            menu.appendChild(divider());
            menu.appendChild(item('bx-arrow-to-top', 'Bring to front', bringSelectedToFront));
            menu.appendChild(item('bx-arrow-to-bottom', 'Send to back', sendSelectedToBack));
            menu.appendChild(item('bx-group', 'Group selected', () => container.querySelector('#is-ctx-group').click(), { disabled: !isMulti, color: '#22d3ee' }));
            menu.appendChild(item('bx-edit', 'Edit group contents', () => enterGroup(activeVectorShape), { disabled: !(activeVectorShape && activeVectorShape.type === 'group'), color: '#22d3ee' }));
            menu.appendChild(item('bx-unlink', 'Ungroup', () => container.querySelector('#is-ctx-ungroup').click(), { disabled: !(activeVectorShape && activeVectorShape.type === 'group'), color: '#fb923c' }));
            if (isMulti) {
                menu.appendChild(divider());
                menu.appendChild(label('Align'));
                menu.appendChild(item('bx-align-left', 'Left', () => container.querySelector('.is-obj-align[data-align="left"]').click()));
                menu.appendChild(item('bx-align-middle', 'Center', () => container.querySelector('.is-obj-align[data-align="h-middle"]').click()));
                menu.appendChild(item('bx-align-right', 'Right', () => container.querySelector('.is-obj-align[data-align="right"]').click()));
                menu.appendChild(item('bx-align-left', 'Top', () => container.querySelector('.is-obj-align[data-align="top"]').click()));
                menu.appendChild(item('bx-align-middle', 'Middle', () => container.querySelector('.is-obj-align[data-align="v-middle"]').click()));
                menu.appendChild(item('bx-align-right', 'Bottom', () => container.querySelector('.is-obj-align[data-align="bottom"]').click()));
            }
            menu.appendChild(divider());
            menu.appendChild(item('bx-layer-minus', 'Merge down', flattenSelectedObjects, { color: '#ef4444' }));
            menu.appendChild(item('bxs-magic-wand', 'AI tools for object', () => container.querySelector('#is-obj-smart-remove').click(), { color: '#10b981' }));
            menu.appendChild(item('bx-cut', 'Remove background', () => container.querySelector('#is-obj-remove-bg').click(), { disabled: !activeIsImage, color: '#ec4899' }));
        } else {
            menu.appendChild(label('Canvas'));
            menu.appendChild(item('bx-paste', objectClipboard ? 'Paste objects' : 'Paste', performPaste, { disabled: !objectClipboard && !clipboardData, shortcut: 'Ctrl+V' }));
            menu.appendChild(item('bx-copy', 'Copy canvas', performCopy, { shortcut: 'Ctrl+C' }));
            menu.appendChild(item('bx-select-multiple', 'Select all objects', selectAllObjects, { shortcut: 'Ctrl+A', disabled: vectorShapes.length === 0 }));
            menu.appendChild(divider());
            menu.appendChild(item('bx-expand', 'Resize canvas', () => container.querySelector('#is-resize-btn').click()));
            menu.appendChild(item('bxs-magic-wand', 'AI tools for canvas', () => container.querySelector('#is-canvas-smart-remove').click(), { color: '#10b981' }));
            menu.appendChild(item('bx-cut', 'Remove background', () => container.querySelector('#is-canvas-remove-bg').click(), { color: '#ec4899' }));
            menu.appendChild(item('bx-layer-minus', 'Merge all objects', () => container.querySelector('#is-flatten-all').click(), { disabled: vectorShapes.length === 0, color: '#ef4444' }));
            menu.appendChild(item('bx-trash', 'Clear canvas', () => container.querySelector('#is-clear').click(), { color: '#f87171' }));
        }

        document.body.appendChild(menu);
        const rect = menu.getBoundingClientRect();
        let left = event.clientX;
        let top = event.clientY;
        if (left + rect.width > window.innerWidth) left = window.innerWidth - rect.width - 8;
        if (top + rect.height > window.innerHeight) top = window.innerHeight - rect.height - 8;
        menu.style.left = Math.max(8, left) + 'px';
        menu.style.top = Math.max(8, top) + 'px';

        const close = (ev) => {
            if (!menu.contains(ev.target)) {
                menu.remove();
                document.removeEventListener('pointerdown', close);
            }
        };
        setTimeout(() => document.addEventListener('pointerdown', close), 0);
    }

    canvas.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        const pos = getMousePos(event);
        const hit = findTopShapeAt(pos);

        if (hit) {
            canvasSelected = false;
            if (!multiSelected.has(hit)) {
                multiSelected.clear();
                activeVectorShape = hit;
            } else {
                activeVectorShape = hit;
            }
            selection = null;
            drawSelectionOverlay();
            showStudioContextMenu(event, 'object');
        } else {
            multiSelected.clear();
            activeVectorShape = null;
            selectCanvasBackground();
            showStudioContextMenu(event, 'canvas');
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
        
        const update = () => {
            if (inp.dataset.transparent === 'true') {
                fakeBtn.style.background = 'repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 10px 10px';
                fakeBtn.style.backgroundColor = '#fff';
            } else {
                fakeBtn.style.background = inp.value;
            }
        };

        const observer = new MutationObserver(update);
        observer.observe(inp, { attributes: true, attributeFilter: ['value', 'data-transparent'] });

        // Intercept programmatic value changes
        const descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
        Object.defineProperty(inp, 'value', {
            get: function() { return descriptor.get.call(this); },
            set: function(val) {
                descriptor.set.call(this, val);
                update();
            }
        });

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

