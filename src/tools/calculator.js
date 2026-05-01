export function renderCalculator(container) {
    container.innerHTML = `
        <div style="display: flex; gap: 24px; padding: 24px; max-width: 900px; margin: 0 auto; height: 100%;">
            
            <!-- Calculator Container -->
            <div style="flex: 1; min-width: 300px; max-width: 400px; background: #252526; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 20px; display: flex; flex-direction: column; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                
                <!-- Display -->
                <div style="background: #1e1e1e; border-radius: 12px; padding: 20px; margin-bottom: 20px; display: flex; flex-direction: column; align-items: flex-end; justify-content: flex-end; min-height: 120px; box-shadow: inset 0 2px 10px rgba(0,0,0,0.3);">
                    <div id="calc-history-disp" style="color: #888; font-size: 16px; min-height: 24px; overflow-x: auto; white-space: nowrap; width: 100%; text-align: right; scrollbar-width: none;"></div>
                    <div id="calc-display" style="color: #fff; font-size: 42px; font-weight: 500; overflow-x: auto; white-space: nowrap; width: 100%; text-align: right; scrollbar-width: none;">0</div>
                </div>

                <!-- Keypad -->
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; flex: 1;">
                    <button class="calc-btn action" data-val="C" style="color: #ef4444;">C</button>
                    <button class="calc-btn action" data-val="()" style="color: var(--accent-color);">( )</button>
                    <button class="calc-btn action" data-val="%" style="color: var(--accent-color);">%</button>
                    <button class="calc-btn op" data-val="/" style="color: var(--accent-color);"><i class='bx bx-divide'></i></button>

                    <button class="calc-btn num" data-val="7">7</button>
                    <button class="calc-btn num" data-val="8">8</button>
                    <button class="calc-btn num" data-val="9">9</button>
                    <button class="calc-btn op" data-val="*" style="color: var(--accent-color);"><i class='bx bx-x'></i></button>

                    <button class="calc-btn num" data-val="4">4</button>
                    <button class="calc-btn num" data-val="5">5</button>
                    <button class="calc-btn num" data-val="6">6</button>
                    <button class="calc-btn op" data-val="-" style="color: var(--accent-color);"><i class='bx bx-minus'></i></button>

                    <button class="calc-btn num" data-val="1">1</button>
                    <button class="calc-btn num" data-val="2">2</button>
                    <button class="calc-btn num" data-val="3">3</button>
                    <button class="calc-btn op" data-val="+" style="color: var(--accent-color);"><i class='bx bx-plus'></i></button>

                    <button class="calc-btn num" data-val="0" style="grid-column: span 2; text-align: left; padding-left: 24px;">0</button>
                    <button class="calc-btn num" data-val=".">.</button>
                    <button class="calc-btn op" id="calc-eq" data-val="=" style="background: var(--accent-color); color: white; border: none; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);"><i class='bx bx-equal'></i></button>
                </div>
            </div>

            <!-- History Panel -->
            <div style="flex: 1; max-width: 350px; background: rgba(37,37,38,0.6); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; display: flex; flex-direction: column; overflow: hidden; display: none;" id="calc-history-panel">
                <div style="padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="margin: 0; font-size: 16px; font-weight: 500;"><i class='bx bx-history'></i> History</h3>
                    <button id="calc-clear-history" class="is-btn-icon" title="Clear History"><i class='bx bx-trash'></i></button>
                </div>
                <div id="calc-history-list" style="flex: 1; overflow-y: auto; padding: 10px;">
                    <!-- History items will appear here -->
                </div>
            </div>

        </div>

        <style>
            .calc-btn {
                background: #333333;
                border: 1px solid rgba(255,255,255,0.05);
                border-radius: 12px;
                color: #fff;
                font-size: 20px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 60px;
                user-select: none;
            }
            .calc-btn:hover {
                background: #444444;
                transform: translateY(-2px);
            }
            .calc-btn:active {
                background: #555555;
                transform: translateY(0);
            }
            .calc-btn.op {
                background: #2a2a35;
            }
            .calc-btn.op:hover {
                background: #353545;
            }
            
            .calc-history-item {
                padding: 12px 16px;
                border-radius: 8px;
                cursor: pointer;
                transition: background 0.2s;
                text-align: right;
            }
            .calc-history-item:hover {
                background: rgba(255,255,255,0.05);
            }
            .calc-history-item .expr {
                color: #888;
                font-size: 14px;
                margin-bottom: 4px;
            }
            .calc-history-item .res {
                color: #fff;
                font-size: 20px;
                font-weight: 500;
            }
            @media (max-width: 768px) {
                #calc-history-panel { display: none !important; }
            }
        </style>
    `;

    const display = container.querySelector('#calc-display');
    const histDisp = container.querySelector('#calc-history-disp');
    const historyList = container.querySelector('#calc-history-list');
    const historyPanel = container.querySelector('#calc-history-panel');
    const clearHistoryBtn = container.querySelector('#calc-clear-history');
    
    let currentInput = '0';
    let history = JSON.parse(localStorage.getItem('calc_history')) || [];
    let shouldResetInput = false;

    function renderHistory() {
        if (history.length > 0) {
            historyPanel.style.display = 'flex';
        } else {
            historyPanel.style.display = 'none';
        }
        
        historyList.innerHTML = history.map((item, index) => `
            <div class="calc-history-item" data-index="${index}">
                <div class="expr">${item.expr} =</div>
                <div class="res">${item.result}</div>
            </div>
        `).join('');

        historyList.querySelectorAll('.calc-history-item').forEach(el => {
            el.addEventListener('click', () => {
                const item = history[el.getAttribute('data-index')];
                currentInput = String(item.result);
                histDisp.innerText = item.expr + ' =';
                updateDisplay();
                shouldResetInput = true;
            });
        });
    }

    function saveHistory() {
        if (history.length > 20) history = history.slice(0, 20);
        localStorage.setItem('calc_history', JSON.stringify(history));
        renderHistory();
    }

    clearHistoryBtn.addEventListener('click', () => {
        history = [];
        saveHistory();
    });

    function updateDisplay() {
        // Simple formatting to add commas for large numbers where appropriate, 
        // but since it might contain equations like "1+2", we just display it raw,
        // or we could format numbers individually. Raw is safer for a calculator expression string.
        display.innerText = currentInput || '0';
        // Auto scroll to right
        display.scrollLeft = display.scrollWidth;
    }

    function evaluateExpression() {
        if (!currentInput) return;
        let expr = currentInput;
        // Replace visual symbols with JS operators
        expr = expr.replace(/×/g, '*').replace(/÷/g, '/');
        
        try {
            // Very basic sanitation before eval
            if (!/^[0-9+\-*/().%\s]+$/.test(expr)) {
                throw new Error('Invalid characters');
            }

            // Handle percentage logic e.g., 50% -> 50/100
            expr = expr.replace(/([0-9.]+)%/g, '($1/100)');

            // Evaluate
            let result = new Function('return ' + expr)();
            
            // Format result to avoid weird float issues (e.g. 0.1+0.2=0.30000000000000004)
            result = Math.round(result * 1e10) / 1e10;
            
            if (!isFinite(result) || isNaN(result)) {
                throw new Error('Math Error');
            }

            history.unshift({ expr: currentInput, result: result });
            saveHistory();

            histDisp.innerText = currentInput + ' =';
            currentInput = String(result);
            shouldResetInput = true;

        } catch (e) {
            currentInput = 'Error';
            shouldResetInput = true;
        }
        updateDisplay();
    }

    function handleInput(val) {
        if (currentInput === 'Error') {
            currentInput = '0';
        }

        if (val === 'C') {
            currentInput = '0';
            histDisp.innerText = '';
        } else if (val === '=') {
            evaluateExpression();
            return; // skip updateDisplay here as it's done in evaluate
        } else if (val === '()') {
            // Smart parenthesis insertion
            const openCount = (currentInput.match(/\(/g) || []).length;
            const closeCount = (currentInput.match(/\)/g) || []).length;
            const lastChar = currentInput.slice(-1);
            
            if (currentInput === '0' || shouldResetInput) {
                currentInput = '(';
            } else if (openCount > closeCount && /[0-9.)]/.test(lastChar)) {
                currentInput += ')';
            } else if (/[0-9.)]/.test(lastChar)) {
                currentInput += '*(';
            } else {
                currentInput += '(';
            }
        } else if (['/', '*', '-', '+'].includes(val)) {
            // Visual replacements
            const visualOp = val === '*' ? '×' : (val === '/' ? '÷' : val);
            
            if (shouldResetInput) {
                shouldResetInput = false;
            }
            
            const lastChar = currentInput.slice(-1);
            if (['+', '-', '×', '÷'].includes(lastChar)) {
                // Replace last operator
                currentInput = currentInput.slice(0, -1) + visualOp;
            } else {
                currentInput += visualOp;
            }
        } else {
            // Numbers or decimal
            if (shouldResetInput) {
                currentInput = val === '.' ? '0.' : val;
                histDisp.innerText = '';
                shouldResetInput = false;
            } else {
                if (currentInput === '0' && val !== '.') {
                    currentInput = val;
                } else {
                    currentInput += val;
                }
            }
        }
        updateDisplay();
    }

    container.querySelectorAll('.calc-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            handleInput(btn.getAttribute('data-val'));
            // Blur to prevent enter key repeating the button click
            btn.blur();
        });
    });

    // Keyboard support
    const keydownHandler = (e) => {
        // Don't intercept if user is typing in an input elsewhere
        if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
        
        const keyMap = {
            'Enter': '=',
            '=': '=',
            'Escape': 'C',
            'Backspace': 'BACKSPACE',
            'c': 'C',
            'C': 'C'
        };

        let val = keyMap[e.key] || e.key;

        if (val === 'BACKSPACE') {
            if (shouldResetInput) {
                histDisp.innerText = '';
                currentInput = '0';
            } else {
                currentInput = currentInput.slice(0, -1);
                if (currentInput === '') currentInput = '0';
            }
            updateDisplay();
            return;
        }

        const validInputs = ['0','1','2','3','4','5','6','7','8','9','.','+','-','*','/','%','(',')','=','C'];
        if (validInputs.includes(val)) {
            e.preventDefault();
            handleInput(val);
        }
    };

    window.addEventListener('keydown', keydownHandler);

    // Cleanup on tool change
    const observer = new MutationObserver((mutations) => {
        if (!document.body.contains(container)) {
            window.removeEventListener('keydown', keydownHandler);
            observer.disconnect();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    renderHistory();
    updateDisplay();
}
