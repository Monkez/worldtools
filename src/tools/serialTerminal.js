export function renderSerialTerminal(container) {
    let port = null, reader = null, writer = null, readableStreamClosed = null;
    let isConnected = false;
    let rxBuffer = [], txHistory = [], txHistoryIdx = -1;
    let rxCount = 0, txCount = 0;
    let autoScroll = true, showTimestamp = true, displayMode = 'ascii';
    const _savedMacros = localStorage.getItem('serial-macros');
    let macros;
    if (_savedMacros !== null) {
        macros = JSON.parse(_savedMacros);
    } else {
        macros = [
            { name: 'AT', data: 'AT\\r\\n' },
            { name: 'ATI', data: 'ATI\\r\\n' },
            { name: 'Reset', data: 'ATZ\\r\\n' },
            { name: 'Hello', data: 'Hello World!\\r\\n' }
        ];
        localStorage.setItem('serial-macros', JSON.stringify(macros));
    }

    container.innerHTML = `
    <style>
        .serial-wrap { display:flex; flex-direction:column; height:calc(100vh - 80px); gap:16px; }
        .serial-topbar { display:flex; gap:12px; align-items:center; flex-wrap:wrap; }
        .serial-topbar select, .serial-topbar input[type=number] {
            background:rgba(0,0,0,0.3); border:1px solid var(--border-color); color:var(--text-primary);
            border-radius:6px; padding:6px 10px; font-family:'Outfit',sans-serif; font-size:13px;
        }
        .serial-topbar label { font-size:12px; color:var(--text-secondary); display:flex; flex-direction:column; gap:2px; }
        .serial-connect-btn {
            padding:8px 20px; border:none; border-radius:8px; font-weight:600; font-size:13px;
            cursor:pointer; transition:all .2s; font-family:'Outfit',sans-serif; display:flex; align-items:center; gap:6px;
        }
        .serial-connect-btn.connect { background:linear-gradient(135deg,#10b981,#059669); color:#fff; }
        .serial-connect-btn.connect:hover { box-shadow:0 4px 15px rgba(16,185,129,.4); transform:translateY(-1px); }
        .serial-connect-btn.disconnect { background:linear-gradient(135deg,#ef4444,#dc2626); color:#fff; }
        .serial-connect-btn.disconnect:hover { box-shadow:0 4px 15px rgba(239,68,68,.4); transform:translateY(-1px); }
        .serial-status { display:flex; align-items:center; gap:6px; font-size:12px; font-weight:600; }
        .serial-status .dot { width:8px; height:8px; border-radius:50%; }
        .serial-status .dot.on { background:#10b981; box-shadow:0 0 8px #10b981; }
        .serial-status .dot.off { background:#6b7280; }
        .serial-body { display:flex; gap:16px; flex:1; min-height:0; }
        .serial-terminal-col { flex:1; display:flex; flex-direction:column; gap:12px; min-width:0; }
        .serial-side-col { width:260px; display:flex; flex-direction:column; gap:12px; flex-shrink:0; min-height:0; overflow-y:auto; }
        .serial-panel { background:rgba(31,41,55,.7); border:1px solid rgba(255,255,255,.08); border-radius:12px; padding:16px; backdrop-filter:blur(8px); }
        .serial-panel h4 { margin:0 0 10px 0; font-size:13px; color:var(--text-secondary); display:flex; align-items:center; gap:6px; }
        .serial-terminal {
            flex:1; background:#0d1117; border:1px solid rgba(255,255,255,.06); border-radius:10px;
            font-family:'Source Code Pro',monospace; font-size:13px; line-height:1.6; color:#c9d1d9;
            overflow-y:auto; padding:12px; min-height:200px; position:relative; white-space:pre-wrap; word-break:break-all;
        }
        .serial-terminal::-webkit-scrollbar { width:6px; }
        .serial-terminal::-webkit-scrollbar-thumb { background:#374151; border-radius:3px; }
        .serial-rx { color:#58a6ff; }
        .serial-tx { color:#f0883e; }
        .serial-sys { color:#8b949e; font-style:italic; }
        .serial-ts { color:#6e7681; font-size:11px; margin-right:8px; }
        .serial-hex { color:#d2a8ff; letter-spacing:1px; }
        .serial-send-bar { display:flex; gap:8px; }
        .serial-send-input {
            flex:1; background:rgba(0,0,0,.3); border:1px solid var(--border-color); color:var(--text-primary);
            border-radius:8px; padding:10px 14px; font-family:'Source Code Pro',monospace; font-size:13px;
            transition:border-color .2s;
        }
        .serial-send-input:focus { outline:none; border-color:var(--accent-color); box-shadow:0 0 0 2px rgba(99,102,241,.2); }
        .serial-send-btn {
            padding:10px 20px; background:linear-gradient(135deg,var(--accent-color),#8b5cf6); color:#fff;
            border:none; border-radius:8px; font-weight:600; cursor:pointer; font-family:'Outfit',sans-serif;
            display:flex; align-items:center; gap:6px; transition:all .2s;
        }
        .serial-send-btn:hover { transform:translateY(-1px); box-shadow:0 4px 15px rgba(99,102,241,.4); }
        .serial-send-btn:disabled { opacity:.4; cursor:not-allowed; transform:none; box-shadow:none; }
        .serial-opt-row { display:flex; gap:12px; align-items:center; flex-wrap:wrap; }
        .serial-opt-row label { font-size:12px; color:var(--text-secondary); display:flex; align-items:center; gap:4px; cursor:pointer; }
        .serial-opt-row select { background:rgba(0,0,0,.3); border:1px solid var(--border-color); color:var(--text-primary); border-radius:6px; padding:4px 8px; font-size:12px; }
        .serial-counter { font-size:11px; color:var(--text-secondary); display:flex; gap:16px; }
        .serial-counter span { display:flex; align-items:center; gap:4px; }
        .serial-counter .rx-c { color:#58a6ff; }
        .serial-counter .tx-c { color:#f0883e; }
        .macro-list { display:flex; flex-direction:column; gap:6px; flex:1; overflow-y:auto; min-height:60px; }
        .macro-item {
            display:flex; align-items:center; gap:6px; background:rgba(0,0,0,.2); border:1px solid rgba(255,255,255,.05);
            border-radius:8px; padding:6px 10px; cursor:pointer; transition:all .2s;
        }
        .macro-item:hover { background:rgba(99,102,241,.15); border-color:var(--accent-color); }
        .macro-item .m-name { flex:1; font-size:12px; font-weight:600; color:var(--text-primary); }
        .macro-item .m-data { font-size:10px; color:var(--text-secondary); font-family:'Source Code Pro',monospace; max-width:120px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .macro-item .m-del { color:#ef4444; cursor:pointer; font-size:16px; opacity:.6; transition:opacity .2s; }
        .macro-item .m-del:hover { opacity:1; }
        .macro-add-row { display:flex; flex-direction:column; gap:6px; margin-top:8px; flex-shrink:0; }
        .macro-add-row input { width:100%; background:rgba(0,0,0,.3); border:1px solid var(--border-color); color:var(--text-primary); border-radius:6px; padding:6px 8px; font-size:11px; box-sizing:border-box; }
        .macro-add-btn { width:100%; background:var(--accent-color); color:#fff; border:none; border-radius:6px; padding:6px 10px; font-size:11px; cursor:pointer; font-weight:600; }
        .serial-signal-row { display:flex; gap:8px; flex-wrap:wrap; }
        .signal-toggle {
            padding:4px 12px; border-radius:6px; font-size:11px; font-weight:600; cursor:pointer;
            border:1px solid rgba(255,255,255,.1); background:rgba(0,0,0,.2); color:var(--text-secondary); transition:all .2s;
        }
        .signal-toggle.active { background:rgba(16,185,129,.2); border-color:#10b981; color:#10b981; }
        .serial-toolbar-btns { display:flex; gap:6px; flex-wrap:wrap; }
        .serial-toolbar-btns button {
            padding:4px 10px; border-radius:6px; font-size:11px; border:1px solid rgba(255,255,255,.08);
            background:rgba(255,255,255,.05); color:var(--text-secondary); cursor:pointer; transition:all .2s;
            display:flex; align-items:center; gap:4px;
        }
        .serial-toolbar-btns button:hover { background:rgba(255,255,255,.1); color:var(--text-primary); }
        .serial-port-selector {
            display:flex; align-items:center; gap:8px; padding:6px 14px;
            background:rgba(0,0,0,.3); border:1px solid var(--border-color); border-radius:8px; cursor:pointer;
            transition:all .2s; min-width:160px;
        }
        .serial-port-selector:hover { border-color:var(--accent-color); background:rgba(99,102,241,.08); }
        .serial-port-selector i { font-size:18px; color:var(--accent-color); }
        .serial-port-selector .port-label { font-size:10px; color:var(--text-secondary); text-transform:uppercase; letter-spacing:.5px; }
        .serial-port-selector .port-name { font-size:13px; font-weight:600; color:var(--text-primary); font-family:'Source Code Pro',monospace; }
        .serial-port-selector .port-info { display:flex; flex-direction:column; gap:1px; }
        @media(max-width:900px) { .serial-body { flex-direction:column; } .serial-side-col { width:100%; } }
    </style>

    <div class="serial-wrap">
        <div class="tool-header">
            <h2><i class='bx bx-terminal'></i> Serial Terminal</h2>
            <p>Professional serial port monitor & terminal. Requires Chrome/Edge with Web Serial API.</p>
        </div>

        <div class="serial-panel serial-topbar">
            <div class="serial-port-selector" id="ser-select-port" title="Click to select a serial port">
                <i class='bx bx-usb'></i>
                <div class="port-info">
                    <span class="port-label">Serial Port</span>
                    <span class="port-name" id="ser-port-name">No port selected</span>
                </div>
            </div>
            <label>Baud Rate
                <select id="ser-baud">
                    <option>1200</option><option>2400</option><option>4800</option><option selected>9600</option>
                    <option>19200</option><option>38400</option><option>57600</option><option>115200</option>
                    <option>230400</option><option>460800</option><option>921600</option>
                </select>
            </label>
            <label>Data Bits
                <select id="ser-databits"><option>7</option><option selected>8</option></select>
            </label>
            <label>Stop Bits
                <select id="ser-stopbits"><option selected>1</option><option>2</option></select>
            </label>
            <label>Parity
                <select id="ser-parity"><option selected>none</option><option>even</option><option>odd</option></select>
            </label>
            <label>Flow Control
                <select id="ser-flow"><option selected>none</option><option>hardware</option></select>
            </label>
            <div style="flex:1"></div>
            <div class="serial-status">
                <span class="dot ${isConnected ? 'on' : 'off'}" id="ser-dot"></span>
                <span id="ser-status-text">${isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
            <button class="serial-connect-btn ${isConnected ? 'disconnect' : 'connect'}" id="ser-connect-btn">
                <i class='bx ${isConnected ? 'bx-x' : 'bx-plug'}'></i> ${isConnected ? 'Disconnect' : 'Connect'}
            </button>
        </div>

        <div class="serial-body">
            <div class="serial-terminal-col">
                <div class="serial-opt-row">
                    <label><input type="checkbox" id="ser-autoscroll" ${autoScroll ? 'checked' : ''}> Auto-scroll</label>
                    <label><input type="checkbox" id="ser-timestamp" ${showTimestamp ? 'checked' : ''}> Timestamp</label>
                    <select id="ser-display"><option value="ascii" ${displayMode==='ascii'?'selected':''}>ASCII</option><option value="hex" ${displayMode==='hex'?'selected':''}>HEX</option><option value="both" ${displayMode==='both'?'selected':''}>Both</option></select>
                    <div style="flex:1"></div>
                    <div class="serial-toolbar-btns">
                        <button id="ser-clear"><i class='bx bx-trash'></i> Clear</button>
                        <button id="ser-export"><i class='bx bx-download'></i> Export</button>
                    </div>
                </div>
                <div class="serial-terminal" id="ser-terminal"></div>
                <div class="serial-counter">
                    <span class="rx-c"><i class='bx bx-down-arrow-alt'></i> RX: <b id="ser-rx-count">0</b></span>
                    <span class="tx-c"><i class='bx bx-up-arrow-alt'></i> TX: <b id="ser-tx-count">0</b></span>
                </div>
                <div class="serial-send-bar">
                    <input type="text" class="serial-send-input" id="ser-send-input" placeholder="Type data to send... (↑↓ for history)" autocomplete="off">
                    <select id="ser-line-ending" style="background:rgba(0,0,0,.3); border:1px solid var(--border-color); color:var(--text-primary); border-radius:8px; padding:6px 10px; font-size:12px;">
                        <option value="">No line ending</option>
                        <option value="\\n">LF (\\n)</option>
                        <option value="\\r">CR (\\r)</option>
                        <option value="\\r\\n" selected>CR+LF</option>
                    </select>
                    <label style="display:flex; align-items:center; gap:4px; font-size:12px; color:var(--text-secondary); white-space:nowrap;"><input type="checkbox" id="ser-send-hex"> Send HEX</label>
                    <button class="serial-send-btn" id="ser-send-btn" disabled><i class='bx bx-send'></i> Send</button>
                </div>
            </div>

            <div class="serial-side-col">
                <div class="serial-panel" style="flex-shrink:0;">
                    <h4><i class='bx bx-signal-5'></i> Line Signals</h4>
                    <div class="serial-signal-row">
                        <button class="signal-toggle" id="sig-dtr" title="Data Terminal Ready">DTR</button>
                        <button class="signal-toggle" id="sig-rts" title="Request To Send">RTS</button>
                        <button class="signal-toggle" id="sig-brk" title="Break Signal">BRK</button>
                    </div>
                </div>
                <div class="serial-panel" style="flex:1; min-height:0; display:flex; flex-direction:column;">
                    <h4><i class='bx bx-rocket'></i> Quick Macros</h4>
                    <div class="macro-list" id="macro-list"></div>
                    <div class="macro-add-row">
                        <input type="text" id="macro-name" placeholder="Name">
                        <input type="text" id="macro-data" placeholder="Data (e.g. AT\\r\\n)">
                        <button class="macro-add-btn" id="macro-add-btn">+</button>
                    </div>
                </div>
            </div>
        </div>
    </div>`;

    // DOM refs
    const terminal = container.querySelector('#ser-terminal');
    const sendInput = container.querySelector('#ser-send-input');
    const sendBtn = container.querySelector('#ser-send-btn');
    const connectBtn = container.querySelector('#ser-connect-btn');
    const clearBtn = container.querySelector('#ser-clear');
    const exportBtn = container.querySelector('#ser-export');
    const rxCountEl = container.querySelector('#ser-rx-count');
    const txCountEl = container.querySelector('#ser-tx-count');
    const dotEl = container.querySelector('#ser-dot');
    const statusText = container.querySelector('#ser-status-text');
    const macroList = container.querySelector('#macro-list');
    const selectPortBtn = container.querySelector('#ser-select-port');
    const portNameEl = container.querySelector('#ser-port-name');

    function now() { const d = new Date(); return d.toLocaleTimeString('en',{hour12:false})+'.'+String(d.getMilliseconds()).padStart(3,'0'); }

    function appendTerminal(text, type = 'rx') {
        const line = document.createElement('div');
        let ts = showTimestamp ? `<span class="serial-ts">[${now()}]</span>` : '';
        if (type === 'sys') {
            line.innerHTML = `${ts}<span class="serial-sys">${escHtml(text)}</span>`;
        } else {
            const cls = type === 'tx' ? 'serial-tx' : 'serial-rx';
            const prefix = type === 'tx' ? '→ ' : '← ';
            let content = '';
            if (displayMode === 'hex') {
                content = `<span class="${cls} serial-hex">${prefix}${toHex(text)}</span>`;
            } else if (displayMode === 'both') {
                content = `<span class="${cls}">${prefix}${escHtml(text)}</span> <span class="serial-hex">[${toHex(text)}]</span>`;
            } else {
                content = `<span class="${cls}">${prefix}${escHtml(text)}</span>`;
            }
            line.innerHTML = `${ts}${content}`;
        }
        terminal.appendChild(line);
        rxBuffer.push({ text, type, time: now() });
        if (autoScroll) terminal.scrollTop = terminal.scrollHeight;
    }

    function escHtml(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
    function toHex(s) { return Array.from(new TextEncoder().encode(s)).map(b => b.toString(16).toUpperCase().padStart(2,'0')).join(' '); }
    function parseEscapes(s) { return s.replace(/\\r/g,'\r').replace(/\\n/g,'\n').replace(/\\t/g,'\t').replace(/\\0/g,'\0'); }
    function hexToBytes(hex) {
        hex = hex.replace(/\s+/g,'');
        const bytes = [];
        for (let i = 0; i < hex.length; i += 2) bytes.push(parseInt(hex.substr(i,2),16));
        return new Uint8Array(bytes);
    }

    function getPortName(p) {
        const info = p.getInfo();
        if (info.usbVendorId !== undefined) {
            return `USB (VID:${info.usbVendorId.toString(16).toUpperCase()} PID:${info.usbProductId.toString(16).toUpperCase()})`;
        }
        return 'Serial Port';
    }

    function updateUI() {
        dotEl.className = `dot ${isConnected ? 'on' : 'off'}`;
        statusText.textContent = isConnected ? 'Connected' : (port ? 'Ready' : 'Disconnected');
        connectBtn.className = `serial-connect-btn ${isConnected ? 'disconnect' : 'connect'}`;
        connectBtn.innerHTML = `<i class='bx ${isConnected ? 'bx-x' : 'bx-plug'}'></i> ${isConnected ? 'Disconnect' : 'Connect'}`;
        sendBtn.disabled = !isConnected;
        if (port) {
            portNameEl.textContent = getPortName(port);
            selectPortBtn.style.borderColor = isConnected ? '#10b981' : 'var(--accent-color)';
        } else {
            portNameEl.textContent = 'No port selected';
            selectPortBtn.style.borderColor = 'var(--border-color)';
        }
    }

    // Check Web Serial API
    if (!('serial' in navigator)) {
        appendTerminal('Web Serial API is not supported. Please use Chrome or Edge browser.', 'sys');
    } else {
        // Try to load previously authorized ports
        navigator.serial.getPorts().then(ports => {
            if (ports.length > 0) {
                port = ports[0];
                updateUI();
                appendTerminal(`Previously authorized port found: ${getPortName(port)}. Click Connect to open.`, 'sys');
            } else {
                appendTerminal('Click the "Serial Port" selector to choose a COM port, then click Connect.', 'sys');
            }
        });
    }

    // Select port
    selectPortBtn.addEventListener('click', async () => {
        if (isConnected) {
            appendTerminal('Disconnect first before selecting a new port.', 'sys');
            return;
        }
        try {
            port = await navigator.serial.requestPort();
            updateUI();
            appendTerminal(`Port selected: ${getPortName(port)}. Click Connect to open.`, 'sys');
        } catch (e) {
            if (e.name !== 'NotFoundError') {
                appendTerminal(`Port selection failed: ${e.message}`, 'sys');
            }
        }
    });

    // Connect / Disconnect
    connectBtn.addEventListener('click', async () => {
        if (isConnected) {
            await disconnect();
        } else {
            await connect();
        }
    });

    async function connect() {
        try {
            if (!port) {
                port = await navigator.serial.requestPort();
            }
            const baud = parseInt(container.querySelector('#ser-baud').value);
            const dataBits = parseInt(container.querySelector('#ser-databits').value);
            const stopBits = parseInt(container.querySelector('#ser-stopbits').value);
            const parity = container.querySelector('#ser-parity').value;
            const flowControl = container.querySelector('#ser-flow').value;
            await port.open({ baudRate: baud, dataBits, stopBits, parity, flowControl });
            isConnected = true;
            updateUI();
            appendTerminal(`Port opened — ${getPortName(port)} @ ${baud} baud, ${dataBits}${parity[0].toUpperCase()}${stopBits}`, 'sys');
            readLoop();
        } catch (e) {
            appendTerminal(`Connection failed: ${e.message}`, 'sys');
        }
    }

    async function disconnect() {
        try {
            if (reader) { await reader.cancel(); reader.releaseLock(); reader = null; }
            if (readableStreamClosed) { try { await readableStreamClosed; } catch {} readableStreamClosed = null; }
            if (port) { await port.close(); port = null; }
        } catch (e) { /* ignore */ }
        isConnected = false;
        updateUI();
        appendTerminal('Port closed.', 'sys');
    }

    async function readLoop() {
        const decoder = new TextDecoderStream();
        readableStreamClosed = port.readable.pipeTo(decoder.writable);
        const inputStream = decoder.readable;
        reader = inputStream.getReader();
        try {
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                if (value) {
                    rxCount += value.length;
                    rxCountEl.textContent = rxCount;
                    appendTerminal(value, 'rx');
                }
            }
        } catch (e) {
            if (isConnected) appendTerminal(`Read error: ${e.message}`, 'sys');
        } finally {
            reader.releaseLock();
        }
    }

    async function sendData(raw) {
        if (!isConnected || !port) return;
        try {
            writer = port.writable.getWriter();
            const sendHex = container.querySelector('#ser-send-hex').checked;
            let bytes;
            if (sendHex) {
                bytes = hexToBytes(raw);
            } else {
                const lineEnding = parseEscapes(container.querySelector('#ser-line-ending').value);
                bytes = new TextEncoder().encode(raw + lineEnding);
            }
            await writer.write(bytes);
            writer.releaseLock();
            writer = null;
            txCount += bytes.length;
            txCountEl.textContent = txCount;
            appendTerminal(raw, 'tx');
        } catch (e) {
            appendTerminal(`Send error: ${e.message}`, 'sys');
            if (writer) { writer.releaseLock(); writer = null; }
        }
    }

    // Send
    sendBtn.addEventListener('click', () => {
        const val = sendInput.value;
        if (!val) return;
        txHistory.unshift(val);
        if (txHistory.length > 50) txHistory.pop();
        txHistoryIdx = -1;
        sendData(val);
        sendInput.value = '';
    });
    sendInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { sendBtn.click(); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); if (txHistoryIdx < txHistory.length-1) { txHistoryIdx++; sendInput.value = txHistory[txHistoryIdx]; } }
        else if (e.key === 'ArrowDown') { e.preventDefault(); if (txHistoryIdx > 0) { txHistoryIdx--; sendInput.value = txHistory[txHistoryIdx]; } else { txHistoryIdx = -1; sendInput.value = ''; } }
    });

    // Options
    container.querySelector('#ser-autoscroll').addEventListener('change', e => { autoScroll = e.target.checked; });
    container.querySelector('#ser-timestamp').addEventListener('change', e => { showTimestamp = e.target.checked; });
    container.querySelector('#ser-display').addEventListener('change', e => { displayMode = e.target.value; });

    // Clear
    clearBtn.addEventListener('click', () => { terminal.innerHTML = ''; rxBuffer = []; rxCount = 0; txCount = 0; rxCountEl.textContent='0'; txCountEl.textContent='0'; });

    // Export
    exportBtn.addEventListener('click', () => {
        const text = rxBuffer.map(r => `[${r.time}] [${r.type.toUpperCase()}] ${r.text}`).join('\n');
        const blob = new Blob([text], { type:'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `serial_log_${new Date().toISOString().slice(0,19).replace(/:/g,'-')}.txt`;
        a.click();
    });

    // Signals
    ['dtr','rts'].forEach(sig => {
        container.querySelector(`#sig-${sig}`).addEventListener('click', async function() {
            if (!isConnected || !port) return;
            this.classList.toggle('active');
            try { await port.setSignals({ [`${sig === 'dtr' ? 'dataTerminalReady' : 'requestToSend'}`]: this.classList.contains('active') }); }
            catch (e) { appendTerminal(`Signal error: ${e.message}`, 'sys'); }
        });
    });
    container.querySelector('#sig-brk').addEventListener('click', async function() {
        if (!isConnected || !port) return;
        this.classList.toggle('active');
        try { await port.setSignals({ break: this.classList.contains('active') }); }
        catch (e) { appendTerminal(`Signal error: ${e.message}`, 'sys'); }
    });

    // Macros
    function renderMacros() {
        macroList.innerHTML = '';
        macros.forEach((m, i) => {
            const el = document.createElement('div');
            el.className = 'macro-item';
            el.innerHTML = `<span class="m-name">${escHtml(m.name)}</span><span class="m-data">${escHtml(m.data)}</span><i class='bx bx-x m-del' data-idx="${i}"></i>`;
            el.addEventListener('click', (e) => {
                if (e.target.classList.contains('m-del')) { macros.splice(i,1); saveMacros(); renderMacros(); return; }
                if (!isConnected) return;
                const parsed = parseEscapes(m.data);
                sendData(parsed);
            });
            macroList.appendChild(el);
        });
    }
    function saveMacros() { localStorage.setItem('serial-macros', JSON.stringify(macros)); }
    container.querySelector('#macro-add-btn').addEventListener('click', () => {
        const name = container.querySelector('#macro-name').value.trim();
        const data = container.querySelector('#macro-data').value.trim();
        if (!name || !data) return;
        macros.push({ name, data });
        saveMacros();
        renderMacros();
        container.querySelector('#macro-name').value = '';
        container.querySelector('#macro-data').value = '';
    });
    renderMacros();
}
