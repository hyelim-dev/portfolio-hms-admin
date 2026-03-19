import { http, HttpResponse } from 'msw'
export const debugHandlers = [
  http.get('*/__msw_ping', () => {
    console.log('PING HIT')
    return HttpResponse.text('pong')
  }),
]
