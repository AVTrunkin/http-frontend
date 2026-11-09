export default class TicketForm {
  constructor(modal, onSubmit, onClose = null) {
    this.modal = modal;
    this.form = modal.querySelector('#ticket-form');
    this.title = modal.querySelector('#form-title');
    this.onSubmit = onSubmit;
    this.onClose = onClose;

    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(this.form);
      this.onSubmit({
        name: formData.get('name').trim(),
        description: formData.get('description').trim(),
        status: this.form.elements.status.checked,
      });
      this.close();
    });

    this.modal.addEventListener('click', (event) => {
      if (event.target.hasAttribute('data-close') || event.target === this.modal) {
        this.close();
      }
    });
  }

  open(ticket = null) {
    this.form.reset();
    this.title.textContent = ticket ? 'Редактировать тикет' : 'Добавить тикет';
    if (ticket) {
      this.form.elements.name.value = ticket.name;
      this.form.elements.description.value = ticket.description;
      this.form.elements.status.checked = ticket.status;
    }
    this.modal.classList.remove('hidden');
    this.form.elements.name.focus();
  }

  close() {
    this.modal.classList.add('hidden');
    if (this.onClose) this.onClose();
  }
}