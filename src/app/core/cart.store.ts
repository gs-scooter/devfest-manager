import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { RequestStatusEnum, withRequestStatus } from './store-features/request-status.feature';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TICKETS_URL } from './tokens';
import { exhaustMap, mergeMap, pipe, switchMap, tap } from 'rxjs';
import { TicketEntry } from './cart.service';
import { tapResponse } from '@ngrx/operators';

interface CartState {
  ticketIds: string[];
}

export const CartStore = signalStore(
  { providedIn: 'root' },
  withState<CartState>({
    ticketIds: [],
  }),
  withComputed(({ ticketIds }) => ({
    count: () => ticketIds().length,
  })),
  withRequestStatus(),
  withMethods((store) => {
    const http = inject(HttpClient);
    const ticketsUrl = inject(TICKETS_URL);

    return {
      _load: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { requestStatus: RequestStatusEnum.PENDING })),
          switchMap(() =>
            http.get<TicketEntry[]>(ticketsUrl).pipe(
              tapResponse({
                next: (tickets) =>
                  patchState(store, {
                    ticketIds: tickets.map((t) => t.eventId),
                    requestStatus: RequestStatusEnum.FULFILLED,
                  }),
                error: (err: { message: string }) =>
                  patchState(store, {
                    requestStatus: { error: err.message },
                  }),
              }),
            ),
          ),
        ),
      ),
      addToCart: rxMethod<{ eventId: string }>(
        exhaustMap(({ eventId }) => {
          patchState(store, (state) => ({
            ticketIds: [...state.ticketIds, eventId],
            requestStatus: RequestStatusEnum.PENDING,
          }));
          return http.post<void>(ticketsUrl, { eventId }).pipe(
            tapResponse({
              next: () => {
                patchState(store, { requestStatus: RequestStatusEnum.FULFILLED });
              },
              error: (err: { message: string }) => {
                patchState(store, (state) => {
                  const index = state.ticketIds.lastIndexOf(eventId);
                  if (index === -1) return state;
                  const newIds = [...state.ticketIds];
                  newIds.splice(index, 1);
                  return {
                    ticketIds: newIds,
                    requestStatus: { error: err.message },
                  };
                });
              },
            }),
          );
        }),
      ),
    };
  }),
  withHooks({
    onInit(store) {
      store._load();
    },
  }),
);
