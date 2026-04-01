import { http, HttpResponse } from 'msw'
export const debugHandlers = [
  http.get('*/__msw_ping', () => {
    return HttpResponse.text('pong')
  }),
]
