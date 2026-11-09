/**
 *  Основной класс приложения
 * */

import Ticket from './Ticket';
import TicketService from './TicketService';
import TicketView from './TicketView';
import TicketForm from './TicketForm';


export default class HelpDesk {
  constructor(container, service = new TicketService()) {
    this.container = container;
    this.service = service;
    this.loader = document.getElementById('loader');
    this.confirmModal = document.getElementById('modal-confirm');
    this.viewModal = document.getElementById('modal-view');

    this.view = new TicketView(document.getElementById('tickets'), {
      onStatusChange: (id, status) => this.changeStatus(id, status),
      onEdit: (id) => this.editTicket(id),
      onDelete: (id) => this.deleteTicket(id),
      onView: (id) => this.showTicket(id),
    });

    this.form = new TicketForm(
      document.getElementById('modal-form'),
      (data) => this.saveTicket(data),
      () => { this.editingId = null; },
    );

    document.getElementById('add-ticket').addEventListener('click', () => this.form.open());
    document.getElementById('confirm-delete').addEventListener('click', () => this.confirmDelete());

    this.confirmModal.addEventListener('click', (event) => {
      if (event.target.hasAttribute('data-close') || event.target === this.confirmModal) {
        this.confirmModal.classList.add('hidden');
      }
    });

    this.viewModal.addEventListener('click', (event) => {
      if (event.target.hasAttribute('data-close') || event.target === this.viewModal) {
        this.viewModal.classList.add('hidden');
      }
    });
  }

  init() {
    this.refresh();
  }

  showLoader() {
    this.loader.classList.remove('hidden');
  }

  hideLoader() {
    this.loader.classList.add('hidden');
  }

  async refresh() {
    this.showLoader();
    try {
      const raw = await this.service.list();
      this.view.render(raw.map((item) => new Ticket(item)));
    } catch (error) {
      this.showError(`Не удалось загрузить список: ${error.message}`);
    } finally {
      this.hideLoader();
    }
  }

  async saveTicket(data) {
    try {
      if (this.editingId) {
        await this.service.update(this.editingId, data);
        this.editingId = null;
      } else {
        await this.service.create(data);
      }
      await this.refresh();
    } catch (error) {
      this.showError(`Не удалось сохранить тикет: ${error.message}`);
    }
  }

  async editTicket(id) {
    try {
      const raw = await this.service.get(id);
      this.editingId = id;
      this.form.open(new Ticket(raw));
    } catch (error) {
      this.showError(`Не удалось загрузить тикет: ${error.message}`);
    }
  }

  async changeStatus(id, status) {
    try {
      const raw = await this.service.get(id);
      const ticket = new Ticket(raw);
      await this.service.update(id, { ...ticket.toRequest(), status });
      await this.refresh();
    } catch (error) {
      this.showError(`Не удалось обновить статус: ${error.message}`);
    }
  }

  deleteTicket(id) {
    this.deletingId = id;
    this.confirmModal.classList.remove('hidden');
  }

  async confirmDelete() {
    try {
      await this.service.delete(this.deletingId);
      this.confirmModal.classList.add('hidden');
      this.deletingId = null;
      await this.refresh();
    } catch (error) {
      this.showError(`Не удалось удалить тикет: ${error.message}`);
    }
  }

  async showTicket(id) {
    try {
      const raw = await this.service.get(id);
      const ticket = new Ticket(raw);
      document.getElementById('view-name').textContent = ticket.name;
      document.getElementById('view-created').textContent = Ticket.formatDate(ticket.created);
      document.getElementById('view-description').textContent = ticket.description;
      this.viewModal.classList.remove('hidden');
    } catch (error) {
      this.showError(`Не удалось загрузить описание: ${error.message}`);
    }
  }

  showError(message) {
    // Минимальный вариант; можно заменить на toast
    // eslint-disable-next-line no-alert
    alert(message);
  }
}
