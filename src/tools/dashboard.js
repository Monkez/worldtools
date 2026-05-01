import { tools, loadTool } from '../main.js';

export function renderDashboard(container) {
    const html = `
        <div class="dashboard-grid">
            ${tools.filter(t => !t.hidden).map(tool => `
                <div class="dashboard-card" data-id="${tool.id}">
                    <i class='bx ${tool.icon} icon'></i>
                    <h3>${tool.name}</h3>
                    <p>${tool.description}</p>
                </div>
            `).join('')}
        </div>
    `;
    
    container.innerHTML = html;

    // Add event listeners to cards
    container.querySelectorAll('.dashboard-card').forEach(card => {
        card.addEventListener('click', () => {
            loadTool(card.getAttribute('data-id'));
        });
    });
}
