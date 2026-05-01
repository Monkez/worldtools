export function renderCalculator(container) {
    container.innerHTML = `
        <div style="display: flex; gap: 24px; padding: 24px; max-width: 950px; margin: 0 auto; height: 100%;">
            
            <!-- Calculator Container -->
            <div style="flex: 1; min-width: 340px; max-width: 450px; background: #252526; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 20px; display: flex; flex-direction: column; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                
                <!-- Display -->
                <div style="background: #1e1e1e; border-radius: 12px; padding: 20px; margin-bottom: 12px; display: flex; flex-direction: column; align-items: flex-end; justify-content: flex-end; min-height: 120px; box-shadow: inset 0 2px 10px rgba(0,0,0,0.3);">
                    <div id="calc-history-disp" style="color: #888; font-size: 16px; min-height: 24px; overflow-x: auto; white-space: nowrap; width: 100%; text-align: right; scrollbar-width: none;"></div>
                    <div id="calc-display" style="color: #fff; font-size: 42px; font-weight: 500; overflow-x: auto; white-space: nowrap; width: 100%; text-align: right; scrollbar-width: none;">0</div>
                </div>

                <!-- Top controls -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding: 0 4px;">
                    <button id="calc-deg-rad" class="is-btn-icon" style="min-height: 28px; width: auto; border-radius: 6px; font-size: 13px; font-weight: bold; padding: 4px 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.2); color: #fff;">DEG</button>
                    <span style="color: #666; font-size: 12px; font-weight: 600; letter-spacing: 1px;">FX-570 PRO</span>
                </div>

                <!-- Keypad -->
                <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; flex: 1;">
                    <button class="calc-btn sci" data-val="sin(">sin</button>
                    <button class="calc-btn sci" data-val="cos(">cos</button>
                    <button class="calc-btn sci" data-val="tan(">tan</button>
                    <button class="calc-btn action" data-val="C" style="color: #ef4444;">C</button>
                    <button class="calc-btn action" data-val="BACKSPACE" style="color: #ef4444;">⌫</button>

                    <button class="calc-btn sci" data-val="ln(">ln</button>
                    <button class="calc-btn sci" data-val="log(">log</button>
                    <button class="calc-btn sci" data-val="π">π</button>
                    <button class="calc-btn action" data-val="(">(</button>
                    <button class="calc-btn action" data-val=")">)</button>

                    <button class="calc-btn sci" data-val="√(">√</button>
                    <button class="calc-btn sci" data-val="^2">x²</button>
                    <button class="calc-btn sci" data-val="^">xʸ</button>
                    <button class="calc-btn sci" data-val="!">x!</button>
                    <button class="calc-btn op" data-val="/" style="color: var(--accent-color);">÷</button>

                    <button class="calc-btn num" data-val="7">7</button>
                    <button class="calc-btn num" data-val="8">8</button>
                    <button class="calc-btn num" data-val="9">9</button>
                    <button class="calc-btn action" data-val="%">%</button>
                    <button class="calc-btn op" data-val="*" style="color: var(--accent-color);">×</button>

                    <button class="calc-btn num" data-val="4">4</button>
                    <button class="calc-btn num" data-val="5">5</button>
                    <button class="calc-btn num" data-val="6">6</button>
                    <button class="calc-btn sci" data-val="e">e</button>
                    <button class="calc-btn op" data-val="-" style="color: var(--accent-color);">-</button>

                    <button class="calc-btn num" data-val="1">1</button>
                    <button class="calc-btn num" data-val="2">2</button>
                    <button class="calc-btn num" data-val="3">3</button>
                    <button class="calc-btn sci" data-val="E">EXP</button>
                    <button class="calc-btn op" data-val="+" style="color: var(--accent-color);">+</button>

                    <button class="calc-btn num" data-val="0" style="grid-column: span 2;">0</button>
                    <button class="calc-btn num" data-val=".">.</button>
                    <button class="calc-btn sci" data-val="Ans">Ans</button>
                    <button class="calc-btn op" id="calc-eq" data-val="=" style="background: var(--accent-color); color: white; border: none; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);">=</button>
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
                border-radius: 8px;
                color: #fff;
                font-size: 18px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 48px;
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
                font-size: 22px;
            }
            .calc-btn.op:hover {
                background: #353545;
            }
            .calc-btn.sci {
                background: #23232c;
                font-size: 15px;
                color: #aaa;
            }
            .calc-btn.sci:hover {
                background: #2d2d3a;
                color: #fff;
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
            @media (max-width: 800px) {
                #calc-history-panel { display: none !important; }
            }
        </style>
    `;

    const display = container.querySelector('#calc-display');
    const histDisp = container.querySelector('#calc-history-disp');
    const historyList = container.querySelector('#calc-history-list');
    const historyPanel = container.querySelector('#calc-history-panel');
    const clearHistoryBtn = container.querySelector('#calc-clear-history');
    const degRadBtn = container.querySelector('#calc-deg-rad');
    
    let currentInput = '0';
    let history = JSON.parse(localStorage.getItem('calc_history')) || [];
    let shouldResetInput = false;

    degRadBtn.addEventListener('click', () => {
        degRadBtn.innerText = degRadBtn.innerText === 'DEG' ? 'RAD' : 'DEG';
    });

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
        display.innerText = currentInput || '0';
        display.scrollLeft = display.scrollWidth;
    }

    function evaluateExpression() {
        if (!currentInput) return;
        let expr = currentInput;
        
        try {
            const isDeg = degRadBtn.innerText === 'DEG';
            const D2R = Math.PI / 180;
            const env = {
                sin: (x) => Math.sin(isDeg ? x * D2R : x),
                cos: (x) => Math.cos(isDeg ? x * D2R : x),
                tan: (x) => Math.tan(isDeg ? x * D2R : x),
                ln: Math.log,
                log: Math.log10,
                sqrt: Math.sqrt,
                PI: Math.PI,
                E: Math.E,
                fact: (n) => {
                    if (n < 0 || n > 170) return NaN;
                    let res = 1; for(let i=2; i<=Math.floor(n); i++) res*=i; return res;
                }
            };

            let jsExpr = expr
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace(/π/g, 'env.PI')
                .replace(/e/g, 'env.E')
                .replace(/Ans/g, '(' + (history.length > 0 ? history[0].result : 0) + ')')
                .replace(/([0-9.]+)%/g, '($1/100)')
                .replace(/([0-9.]+)!/g, 'env.fact($1)')
                .replace(/\^2/g, '**2')
                .replace(/\^/g, '**')
                .replace(/sin\(/g, 'env.sin(')
                .replace(/cos\(/g, 'env.cos(')
                .replace(/tan\(/g, 'env.tan(')
                .replace(/ln\(/g, 'env.ln(')
                .replace(/log\(/g, 'env.log(')
                .replace(/√\(/g, 'env.sqrt(');

            // Auto-close missing parentheses
            const openCount = (jsExpr.match(/\(/g) || []).length;
            const closeCount = (jsExpr.match(/\)/g) || []).length;
            if (openCount > closeCount) {
                jsExpr += ')'.repeat(openCount - closeCount);
                expr += ')'.repeat(openCount - closeCount);
            }

            let result = new Function('env', 'return ' + jsExpr)(env);
            
            // Format result to avoid weird float issues
            result = Math.round(result * 1e12) / 1e12;
            
            if (!isFinite(result) || isNaN(result)) {
                throw new Error('Math Error');
            }

            history.unshift({ expr: expr, result: result });
            saveHistory();

            histDisp.innerText = expr + ' =';
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
        } else if (val === 'BACKSPACE') {
            if (shouldResetInput) {
                histDisp.innerText = '';
                currentInput = '0';
                shouldResetInput = false;
            } else {
                currentInput = currentInput.slice(0, -1) || '0';
            }
        } else if (val === '=') {
            evaluateExpression();
            return;
        } else if (['/', '*', '-', '+'].includes(val)) {
            const visualOp = val === '*' ? '×' : (val === '/' ? '÷' : val);
            if (shouldResetInput) {
                shouldResetInput = false;
            }
            const lastChar = currentInput.slice(-1);
            if (['+', '-', '×', '÷'].includes(lastChar)) {
                currentInput = currentInput.slice(0, -1) + visualOp;
            } else {
                currentInput += visualOp;
            }
        } else {
            if (shouldResetInput) {
                if (val === '.') currentInput = '0.';
                else if (['sin(', 'cos(', 'tan(', 'ln(', 'log(', '√('].includes(val)) currentInput = val;
                else currentInput = val;
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
            btn.blur();
        });
    });

    // Keyboard support
    const keydownHandler = (e) => {
        if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
        
        const keyMap = {
            'Enter': '=',
            '=': '=',
            'Escape': 'C',
            'Backspace': 'BACKSPACE',
            'c': 'C'
        };

        let val = keyMap[e.key] || e.key;

        const validInputs = ['0','1','2','3','4','5','6','7','8','9','.','+','-','*','/','%','(',')','=','C','BACKSPACE','e','^','!'];
        if (validInputs.includes(val) || val === 'BACKSPACE') {
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
