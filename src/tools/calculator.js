export function renderCalculator(container) {
    container.innerHTML = `
        <div class="calc-shell">
            <div class="calc-device">
                <div class="calc-display-wrap">
                    <div id="calc-history-disp" class="calc-history-disp"></div>
                    <div id="calc-display" class="calc-display">0</div>
                </div>

                <div class="calc-topbar">
                    <button id="calc-deg-rad" class="is-btn-icon calc-mode">DEG</button>
                    <span>FX-570 PRO</span>
                </div>

                <div class="calc-keypad">
                    <button class="calc-btn" data-val="sin(">sin</button>
                    <button class="calc-btn" data-val="cos(">cos</button>
                    <button class="calc-btn" data-val="tan(">tan</button>
                    <button class="calc-btn" data-val="(">(</button>
                    <button class="calc-btn" data-val=")">)</button>

                    <button class="calc-btn" data-val="sqrt(">sqrt</button>
                    <button class="calc-btn" data-val="^2">x²</button>
                    <button class="calc-btn" data-val="^">xʸ</button>
                    <button class="calc-btn" data-val="log(">log</button>
                    <button class="calc-btn" data-val="ln(">ln</button>

                    <button class="calc-btn" data-val="PI">π</button>
                    <button class="calc-btn" data-val="e">e</button>
                    <button class="calc-btn" data-val="!">x!</button>
                    <button class="calc-btn" data-val="E">EXP</button>
                    <button class="calc-btn" data-val="Ans">Ans</button>

                    <button class="calc-btn num" data-val="7">7</button>
                    <button class="calc-btn num" data-val="8">8</button>
                    <button class="calc-btn num" data-val="9">9</button>
                    <button class="calc-btn danger" data-val="C">C</button>
                    <button class="calc-btn danger" data-val="BACKSPACE">⌫</button>

                    <button class="calc-btn num" data-val="4">4</button>
                    <button class="calc-btn num" data-val="5">5</button>
                    <button class="calc-btn num" data-val="6">6</button>
                    <button class="calc-btn op" data-val="*">×</button>
                    <button class="calc-btn op" data-val="/">÷</button>

                    <button class="calc-btn num" data-val="1">1</button>
                    <button class="calc-btn num" data-val="2">2</button>
                    <button class="calc-btn num" data-val="3">3</button>
                    <button class="calc-btn op" data-val="+">+</button>
                    <button class="calc-btn op" data-val="-">-</button>

                    <button class="calc-btn num zero" data-val="0">0</button>
                    <button class="calc-btn num" data-val=".">.</button>
                    <button class="calc-btn" data-val="%">%</button>
                    <button class="calc-btn eq" id="calc-eq" data-val="=">=</button>
                </div>
            </div>

            <div class="calc-history-panel" id="calc-history-panel">
                <div class="calc-history-head">
                    <h3><i class='bx bx-history'></i> History</h3>
                    <button id="calc-clear-history" class="is-btn-icon" title="Clear History"><i class='bx bx-trash'></i></button>
                </div>
                <div id="calc-history-list" class="calc-history-list"></div>
            </div>
        </div>

        <style>
            .calc-shell {
                width: min(100%, 980px);
                min-width: 280px;
                min-height: min(720px, calc(100vh - 64px));
                margin: 0 auto;
                padding: clamp(10px, 2.4vw, 24px);
                display: grid;
                grid-template-columns: minmax(280px, 450px) minmax(240px, 350px);
                justify-content: center;
                align-items: stretch;
                gap: clamp(12px, 2vw, 24px);
            }
            .calc-device {
                min-width: 280px;
                max-width: 450px;
                width: 100%;
                min-height: 460px;
                max-height: min(720px, calc(100vh - 96px));
                background: #252526;
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 16px;
                padding: clamp(12px, 2vw, 20px);
                display: flex;
                flex-direction: column;
                box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            }
            .calc-display-wrap {
                background: #1e1e1e;
                border-radius: 12px;
                padding: clamp(14px, 2vw, 20px);
                margin-bottom: 12px;
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                justify-content: flex-end;
                min-height: clamp(88px, 16vh, 120px);
                box-shadow: inset 0 2px 10px rgba(0,0,0,0.3);
            }
            .calc-history-disp,
            .calc-display {
                width: 100%;
                text-align: right;
                overflow-x: auto;
                white-space: nowrap;
                scrollbar-width: none;
            }
            .calc-history-disp {
                color: #888;
                font-size: clamp(13px, 1.6vw, 16px);
                min-height: 24px;
            }
            .calc-display {
                color: #fff;
                font-size: clamp(28px, 5vw, 42px);
                font-weight: 500;
            }
            .calc-topbar {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
                padding: 0 4px;
                color: #666;
                font-size: 12px;
                font-weight: 600;
                letter-spacing: 1px;
            }
            .calc-mode {
                min-height: 28px;
                width: auto;
                border-radius: 6px;
                font-size: 13px;
                font-weight: 700;
                padding: 4px 12px;
                background: rgba(255,255,255,0.05);
                border: 1px solid rgba(255,255,255,0.2);
                color: #fff;
            }
            .calc-keypad {
                display: grid;
                grid-template-columns: repeat(5, minmax(0, 1fr));
                gap: clamp(6px, 1vw, 8px);
                flex: 1;
            }
            .calc-btn {
                min-width: 0;
                min-height: clamp(38px, 7.2vh, 52px);
                background: rgba(255, 255, 255, 0.04);
                border: 1px solid rgba(255, 255, 255, 0.05);
                border-radius: 8px;
                color: #ccc;
                font-size: clamp(12px, 1.8vw, 15px);
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
                user-select: none;
            }
            .calc-btn:hover { background: rgba(255, 255, 255, 0.1); transform: translateY(-2px); }
            .calc-btn:active { background: rgba(255, 255, 255, 0.15); transform: translateY(0); }
            .calc-btn.num { background: rgba(255, 255, 255, 0.12); color: #fff; font-size: clamp(17px, 2.4vw, 20px); }
            .calc-btn.num:hover { background: rgba(255, 255, 255, 0.18); }
            .calc-btn.op { background: rgba(255, 255, 255, 0.08); color: var(--accent-color); font-size: clamp(18px, 2.8vw, 22px); }
            .calc-btn.op:hover { background: rgba(255, 255, 255, 0.14); }
            .calc-btn.danger { color: #ef4444; font-weight: 700; }
            .calc-btn.zero { grid-column: span 2; }
            .calc-btn.eq {
                background: var(--accent-color);
                color: #fff;
                border: none;
                box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
            }
            .calc-history-panel {
                min-width: 240px;
                max-width: 350px;
                width: 100%;
                max-height: min(720px, calc(100vh - 96px));
                background: rgba(37,37,38,0.6);
                border: 1px solid rgba(255,255,255,0.05);
                border-radius: 16px;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }
            .calc-history-head {
                padding: 16px 20px;
                border-bottom: 1px solid rgba(255,255,255,0.05);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .calc-history-head h3 {
                margin: 0;
                font-size: 16px;
                font-weight: 500;
            }
            .calc-history-list {
                flex: 1;
                overflow-y: auto;
                padding: 10px;
            }
            .calc-history-item {
                padding: 12px 16px;
                border-radius: 8px;
                cursor: pointer;
                transition: background 0.2s;
                text-align: right;
            }
            .calc-history-item:hover { background: rgba(255,255,255,0.05); }
            .calc-history-item .expr { color: #888; font-size: 14px; margin-bottom: 4px; }
            .calc-history-item .res { color: #fff; font-size: 20px; font-weight: 500; }
            @media (max-width: 860px) {
                .calc-shell {
                    grid-template-columns: minmax(280px, 450px);
                    min-height: auto;
                }
                .calc-history-panel { display: none; }
            }
            @media (max-width: 420px) {
                .calc-shell { padding: 6px; }
                .calc-device { min-width: 0; padding: 10px; }
                .calc-keypad { gap: 5px; }
            }
        </style>
    `;

    const display = container.querySelector('#calc-display');
    const histDisp = container.querySelector('#calc-history-disp');
    const historyList = container.querySelector('#calc-history-list');
    const clearHistoryBtn = container.querySelector('#calc-clear-history');
    const degRadBtn = container.querySelector('#calc-deg-rad');

    let currentInput = '0';
    let history = JSON.parse(localStorage.getItem('calc_history')) || [];
    let shouldResetInput = false;

    degRadBtn.addEventListener('click', () => {
        degRadBtn.innerText = degRadBtn.innerText === 'DEG' ? 'RAD' : 'DEG';
    });

    function renderHistory() {
        if (history.length === 0) {
            historyList.innerHTML = '<div style="text-align:center;color:#666;margin-top:20px;font-size:14px;">No history yet</div>';
            return;
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
                    let res = 1;
                    for (let i = 2; i <= Math.floor(n); i++) res *= i;
                    return res;
                }
            };

            let jsExpr = expr
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace(/\bPI\b/g, 'env.PI')
                .replace(/\be\b/g, 'env.E')
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
                .replace(/sqrt\(/g, 'env.sqrt(');

            const openCount = (jsExpr.match(/\(/g) || []).length;
            const closeCount = (jsExpr.match(/\)/g) || []).length;
            if (openCount > closeCount) {
                jsExpr += ')'.repeat(openCount - closeCount);
                expr += ')'.repeat(openCount - closeCount);
            }

            let result = new Function('env', 'return ' + jsExpr)(env);
            result = Math.round(result * 1e12) / 1e12;

            if (!isFinite(result) || isNaN(result)) throw new Error('Math Error');

            history.unshift({ expr, result });
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
        if (currentInput === 'Error') currentInput = '0';

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
            if (shouldResetInput) shouldResetInput = false;
            const lastChar = currentInput.slice(-1);
            currentInput = ['+', '-', '×', '÷'].includes(lastChar)
                ? currentInput.slice(0, -1) + visualOp
                : currentInput + visualOp;
        } else {
            if (shouldResetInput) {
                if (val === '.') currentInput = '0.';
                else if (['sin(', 'cos(', 'tan(', 'ln(', 'log(', 'sqrt('].includes(val)) currentInput = val;
                else currentInput = val;
                histDisp.innerText = '';
                shouldResetInput = false;
            } else if (currentInput === '0' && val !== '.') {
                currentInput = val;
            } else {
                currentInput += val;
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

    const keydownHandler = (e) => {
        if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;

        const keyMap = {
            'Enter': '=',
            '=': '=',
            'Escape': 'C',
            'Backspace': 'BACKSPACE',
            'c': 'C'
        };

        const val = keyMap[e.key] || e.key;
        const validInputs = ['0','1','2','3','4','5','6','7','8','9','.','+','-','*','/','%','(',')','=','C','BACKSPACE','e','^','!'];
        if (validInputs.includes(val)) {
            e.preventDefault();
            handleInput(val);
        }
    };

    window.addEventListener('keydown', keydownHandler);

    const observer = new MutationObserver(() => {
        if (!document.body.contains(container)) {
            window.removeEventListener('keydown', keydownHandler);
            observer.disconnect();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    renderHistory();
    updateDisplay();
}
