/**
 *  Класс для связи с сервером.
 *  Содержит методы для отправки запросов на сервер и получения ответов
 * */

import createRequest from './api/createRequest';

export default class TicketService {
  list() {
    return createRequest('allTickets');
  }

  get(id) {
    return createRequest('ticketById', { id });
  }

  create(data) {
    return createRequest('createTicket', { body: data });
  }

  update(id, data) {
    return createRequest('updateById', { id, body: data });
  }

  delete(id) {
    return createRequest('deleteById', { id });
  }
}
