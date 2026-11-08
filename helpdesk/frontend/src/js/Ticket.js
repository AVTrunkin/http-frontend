export default class Ticket {
  constructor({ id, name, description, status, created }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.status = status;
    this.created = created;
  }

  toRequest() {
    return {
      name: this.name,
      description: this.description,
      status: this.status,
    };
  }

  static formatDate(timestamp) {
    return new Date(timestamp).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
