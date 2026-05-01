export function renderKeyboardTest(container) {
    container.innerHTML = `
        <div class="tool-header">
            <h2><i class='bx bxs-keyboard'></i> Full Keyboard Tester</h2>
            <p>Press any key. Keys will turn <span style="color:#22c55e">green</span> if working. Hold them to see them light up.</p>
        </div>
        
        <div class="panel" style="display: flex; flex-direction: column; align-items: center; justify-content: center; overflow-x: auto; padding: 40px 20px;">
            
            <div id="kt-keyboard-wrapper" style="display: flex; gap: 20px; user-select: none; transform-origin: top center;">
                <!-- Main Keyboard -->
                <div class="kb-section" style="display: flex; flex-direction: column; gap: 4px;">
                    <!-- Row 1 -->
                    <div class="kb-row">
                        <div class="kb-key" data-code="Escape" style="margin-right: 24px;">Esc</div>
                        <div class="kb-key" data-code="F1">F1</div>
                        <div class="kb-key" data-code="F2">F2</div>
                        <div class="kb-key" data-code="F3">F3</div>
                        <div class="kb-key" data-code="F4" style="margin-right: 24px;">F4</div>
                        <div class="kb-key" data-code="F5">F5</div>
                        <div class="kb-key" data-code="F6">F6</div>
                        <div class="kb-key" data-code="F7">F7</div>
                        <div class="kb-key" data-code="F8" style="margin-right: 24px;">F8</div>
                        <div class="kb-key" data-code="F9">F9</div>
                        <div class="kb-key" data-code="F10">F10</div>
                        <div class="kb-key" data-code="F11">F11</div>
                        <div class="kb-key" data-code="F12">F12</div>
                    </div>
                    <!-- Row 2 -->
                    <div class="kb-row" style="margin-top: 12px;">
                        <div class="kb-key" data-code="Backquote">\`</div>
                        <div class="kb-key" data-code="Digit1">1</div>
                        <div class="kb-key" data-code="Digit2">2</div>
                        <div class="kb-key" data-code="Digit3">3</div>
                        <div class="kb-key" data-code="Digit4">4</div>
                        <div class="kb-key" data-code="Digit5">5</div>
                        <div class="kb-key" data-code="Digit6">6</div>
                        <div class="kb-key" data-code="Digit7">7</div>
                        <div class="kb-key" data-code="Digit8">8</div>
                        <div class="kb-key" data-code="Digit9">9</div>
                        <div class="kb-key" data-code="Digit0">0</div>
                        <div class="kb-key" data-code="Minus">-</div>
                        <div class="kb-key" data-code="Equal">=</div>
                        <div class="kb-key" data-code="Backspace" style="flex: 1; min-width: 80px;">Backspace</div>
                    </div>
                    <!-- Row 3 -->
                    <div class="kb-row">
                        <div class="kb-key" data-code="Tab" style="width: 60px;">Tab</div>
                        <div class="kb-key" data-code="KeyQ">Q</div>
                        <div class="kb-key" data-code="KeyW">W</div>
                        <div class="kb-key" data-code="KeyE">E</div>
                        <div class="kb-key" data-code="KeyR">R</div>
                        <div class="kb-key" data-code="KeyT">T</div>
                        <div class="kb-key" data-code="KeyY">Y</div>
                        <div class="kb-key" data-code="KeyU">U</div>
                        <div class="kb-key" data-code="KeyI">I</div>
                        <div class="kb-key" data-code="KeyO">O</div>
                        <div class="kb-key" data-code="KeyP">P</div>
                        <div class="kb-key" data-code="BracketLeft">[</div>
                        <div class="kb-key" data-code="BracketRight">]</div>
                        <div class="kb-key" data-code="Backslash" style="flex: 1;">\\</div>
                    </div>
                    <!-- Row 4 -->
                    <div class="kb-row">
                        <div class="kb-key" data-code="CapsLock" style="width: 75px;">Caps Lock</div>
                        <div class="kb-key" data-code="KeyA">A</div>
                        <div class="kb-key" data-code="KeyS">S</div>
                        <div class="kb-key" data-code="KeyD">D</div>
                        <div class="kb-key" data-code="KeyF">F</div>
                        <div class="kb-key" data-code="KeyG">G</div>
                        <div class="kb-key" data-code="KeyH">H</div>
                        <div class="kb-key" data-code="KeyJ">J</div>
                        <div class="kb-key" data-code="KeyK">K</div>
                        <div class="kb-key" data-code="KeyL">L</div>
                        <div class="kb-key" data-code="Semicolon">;</div>
                        <div class="kb-key" data-code="Quote">'</div>
                        <div class="kb-key" data-code="Enter" style="flex: 1;">Enter</div>
                    </div>
                    <!-- Row 5 -->
                    <div class="kb-row">
                        <div class="kb-key" data-code="ShiftLeft" style="width: 100px;">Shift</div>
                        <div class="kb-key" data-code="KeyZ">Z</div>
                        <div class="kb-key" data-code="KeyX">X</div>
                        <div class="kb-key" data-code="KeyC">C</div>
                        <div class="kb-key" data-code="KeyV">V</div>
                        <div class="kb-key" data-code="KeyB">B</div>
                        <div class="kb-key" data-code="KeyN">N</div>
                        <div class="kb-key" data-code="KeyM">M</div>
                        <div class="kb-key" data-code="Comma">,</div>
                        <div class="kb-key" data-code="Period">.</div>
                        <div class="kb-key" data-code="Slash">/</div>
                        <div class="kb-key" data-code="ShiftRight" style="flex: 1;">Shift</div>
                    </div>
                    <!-- Row 6 -->
                    <div class="kb-row">
                        <div class="kb-key" data-code="ControlLeft" style="width: 50px;">Ctrl</div>
                        <div class="kb-key" data-code="MetaLeft" style="width: 50px;">Win</div>
                        <div class="kb-key" data-code="AltLeft" style="width: 50px;">Alt</div>
                        <div class="kb-key" data-code="Space" style="flex: 1;">Space</div>
                        <div class="kb-key" data-code="AltRight" style="width: 50px;">Alt</div>
                        <div class="kb-key" data-code="MetaRight" style="width: 50px;">Win</div>
                        <div class="kb-key" data-code="ContextMenu" style="width: 50px;">Menu</div>
                        <div class="kb-key" data-code="ControlRight" style="width: 50px;">Ctrl</div>
                    </div>
                </div>

                <!-- Nav Section -->
                <div class="kb-section" style="display: flex; flex-direction: column; gap: 4px;">
                    <div class="kb-row">
                        <div class="kb-key" data-code="PrintScreen">PrtSc</div>
                        <div class="kb-key" data-code="ScrollLock">ScrLk</div>
                        <div class="kb-key" data-code="Pause">Pause</div>
                    </div>
                    <div class="kb-row" style="margin-top: 12px;">
                        <div class="kb-key" data-code="Insert">Ins</div>
                        <div class="kb-key" data-code="Home">Home</div>
                        <div class="kb-key" data-code="PageUp">PgUp</div>
                    </div>
                    <div class="kb-row">
                        <div class="kb-key" data-code="Delete">Del</div>
                        <div class="kb-key" data-code="End">End</div>
                        <div class="kb-key" data-code="PageDown">PgDn</div>
                    </div>
                    <!-- Arrows -->
                    <div style="margin-top: 36px; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 4px;">
                        <div></div>
                        <div class="kb-key" data-code="ArrowUp">↑</div>
                        <div></div>
                        <div class="kb-key" data-code="ArrowLeft">←</div>
                        <div class="kb-key" data-code="ArrowDown">↓</div>
                        <div class="kb-key" data-code="ArrowRight">→</div>
                    </div>
                </div>

                <!-- Numpad Section -->
                <div class="kb-section" style="display: flex; flex-direction: column; gap: 4px;">
                    <div class="kb-row" style="margin-bottom: 12px; visibility: hidden;">
                        <div class="kb-key">Spacer</div>
                    </div>
                    <div class="kb-row">
                        <div class="kb-key" data-code="NumLock">Num</div>
                        <div class="kb-key" data-code="NumpadDivide">/</div>
                        <div class="kb-key" data-code="NumpadMultiply">*</div>
                        <div class="kb-key" data-code="NumpadSubtract">-</div>
                    </div>
                    <div style="display: flex; gap: 4px;">
                        <div style="display: flex; flex-direction: column; gap: 4px;">
                            <div class="kb-row">
                                <div class="kb-key" data-code="Numpad7">7</div>
                                <div class="kb-key" data-code="Numpad8">8</div>
                                <div class="kb-key" data-code="Numpad9">9</div>
                            </div>
                            <div class="kb-row">
                                <div class="kb-key" data-code="Numpad4">4</div>
                                <div class="kb-key" data-code="Numpad5">5</div>
                                <div class="kb-key" data-code="Numpad6">6</div>
                            </div>
                            <div class="kb-row">
                                <div class="kb-key" data-code="Numpad1">1</div>
                                <div class="kb-key" data-code="Numpad2">2</div>
                                <div class="kb-key" data-code="Numpad3">3</div>
                            </div>
                            <div class="kb-row">
                                <div class="kb-key" data-code="Numpad0" style="width: 84px;">0</div>
                                <div class="kb-key" data-code="NumpadDecimal">.</div>
                            </div>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 4px;">
                            <div class="kb-key" data-code="NumpadAdd" style="height: 84px;">+</div>
                            <div class="kb-key" data-code="NumpadEnter" style="height: 84px;">Ent</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Detail display -->
            <div style="margin-top: 40px; display: flex; gap: 30px; background: rgba(0,0,0,0.3); padding: 20px 40px; border-radius: 8px;">
                <div style="text-align: center;">
                    <div style="font-size: 13px; color: var(--text-secondary); text-transform: uppercase;">event.key</div>
                    <div id="kt-key-val" style="font-size: 20px; font-family: monospace; font-weight: bold; margin-top: 4px; color: var(--accent-color);">-</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 13px; color: var(--text-secondary); text-transform: uppercase;">event.code</div>
                    <div id="kt-code-val" style="font-size: 20px; font-family: monospace; font-weight: bold; margin-top: 4px; color: var(--accent-color);">-</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 13px; color: var(--text-secondary); text-transform: uppercase;">keyCode</div>
                    <div id="kt-keycode-val" style="font-size: 20px; font-family: monospace; font-weight: bold; margin-top: 4px; color: var(--accent-color);">-</div>
                </div>
            </div>

            <button class="btn-secondary" id="kt-reset" style="margin-top: 20px;"><i class='bx bx-refresh'></i> Reset Keyboard</button>
        </div>

        <style>
            .kb-row {
                display: flex;
                gap: 4px;
            }
            .kb-key {
                width: 40px;
                height: 40px;
                background: rgba(255,255,255,0.05);
                border: 2px solid rgba(255,255,255,0.1);
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'Inter', sans-serif;
                font-size: 12px;
                font-weight: 600;
                color: rgba(255,255,255,0.6);
                box-sizing: border-box;
                transition: background 0.1s, border-color 0.1s, transform 0.05s, box-shadow 0.1s;
                position: relative;
                overflow: hidden;
            }
            
            /* Status classes */
            .kb-key.pressed {
                background: rgba(99, 102, 241, 0.6);
                border-color: rgba(99, 102, 241, 1);
                color: #fff;
                transform: scale(0.95);
                box-shadow: 0 0 15px rgba(99, 102, 241, 0.5);
            }
            .kb-key.tested {
                background: rgba(34, 197, 94, 0.15);
                border-color: rgba(34, 197, 94, 0.5);
                color: #fff;
            }
            .kb-key.tested.pressed {
                background: rgba(34, 197, 94, 0.6);
                border-color: rgba(34, 197, 94, 1);
                box-shadow: 0 0 15px rgba(34, 197, 94, 0.5);
                transform: scale(0.95);
            }

            /* Responsive scale */
            @media (max-width: 1200px) {
                #kt-keyboard-wrapper { transform: scale(0.8); }
            }
            @media (max-width: 900px) {
                #kt-keyboard-wrapper { transform: scale(0.6); }
            }
            @media (max-width: 600px) {
                #kt-keyboard-wrapper { transform: scale(0.4); }
            }
        </style>
    `;

    const keyVal = container.querySelector('#kt-key-val');
    const codeVal = container.querySelector('#kt-code-val');
    const keycodeVal = container.querySelector('#kt-keycode-val');
    
    // Map to keep track of key elements by code
    const keyElements = {};
    container.querySelectorAll('.kb-key').forEach(el => {
        const code = el.getAttribute('data-code');
        if (code) {
            keyElements[code] = el;
        }
    });

    // We also want to support fallback mapping for generic codes if necessary
    const fallbackMap = {
        'OSLeft': 'MetaLeft',
        'OSRight': 'MetaRight'
    };

    const handleKeyDown = (e) => {
        if (e.key !== 'F12') {
            e.preventDefault();
            e.stopPropagation();
        }

        let code = e.code;
        if (fallbackMap[code]) code = fallbackMap[code];

        keyVal.innerText = e.key === ' ' ? 'Space' : e.key;
        codeVal.innerText = code;
        keycodeVal.innerText = e.keyCode;

        const el = keyElements[code];
        if (el) {
            el.classList.add('pressed');
            el.classList.add('tested');
        }
    };

    const handleKeyUp = (e) => {
        if (e.key !== 'F12') {
            e.preventDefault();
            e.stopPropagation();
        }
        
        let code = e.code;
        if (fallbackMap[code]) code = fallbackMap[code];

        const el = keyElements[code];
        if (el) {
            el.classList.remove('pressed');
        }
    };

    document.addEventListener('keydown', handleKeyDown, { passive: false });
    document.addEventListener('keyup', handleKeyUp);

    container.querySelector('#kt-reset').addEventListener('click', () => {
        container.querySelectorAll('.kb-key').forEach(el => {
            el.classList.remove('pressed', 'tested');
        });
        keyVal.innerText = '-';
        codeVal.innerText = '-';
        keycodeVal.innerText = '-';
    });

    const observer = new MutationObserver((mutations) => {
        if (!document.body.contains(container)) {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
            observer.disconnect();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
}
