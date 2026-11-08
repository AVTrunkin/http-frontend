import Ticket from './Ticket';

/**
 * Отвечает за отрисовку списка тикетов
 */
export default class TicketView {
  constructor(container, callbacks) {
    this.container = container;
    this.callbacks = callbacks; // onStatusChange, onEdit, onDelete, onView
  }

  render(tickets) {
    this.container.innerHTML = '';
    tickets.forEach((ticket) => this.container.append(this.createRow(ticket)));
  }

  createRow(ticket) {
    const li = document.createElement('li');
    li.className = 'ticket';
    li.dataset.id = ticket.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'ticket-status';
    checkbox.checked = ticket.status;

    const name = document.createElement('span');
    name.className = 'ticket-name';
    name.textContent = ticket.name;

    const created = document.createElement('span');
    created.className = 'ticket-created';
    created.textContent = Ticket.formatDate(ticket.created);

    const editBtn = document.createElement('button');
    editBtn.className = 'icon-btn';
    editBtn.dataset.action = 'edit';
    editBtn.title = 'Редактировать';
    editBtn.textContent = '✎';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'icon-btn';
    deleteBtn.dataset.action = 'delete';
    deleteBtn.title = 'Удалить';
    deleteBtn.textContent = '✕';

    li.append(checkbox, name, created, editBtn, deleteBtn);

    li.addEventListener('click', (event) => {
      // Чекбокс — отметка о выполнении
      if (event.target.classList.contains('ticket-status')) {
        this.callbacks.onStatusChange(ticket.id, event.target.checked);
        return;
      }
      // Кнопки — редактирование и удаление
      const actionBtn = event.target.closest('[data-action]');
      if (actionBtn) {
        if (actionBtn.dataset.action === 'edit') this.callbacks.onEdit(ticket.id);
        if (actionBtn.dataset.action === 'delete') this.callbacks.onDelete(ticket.id);
        return;
      }
      // Любой другой клик по строке — подробное описание
      this.callbacks.onView(ticket.id);
    });

    return li;
  }
}
