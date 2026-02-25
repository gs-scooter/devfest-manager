import { signalStoreFeature, withComputed, withState } from '@ngrx/signals';

export enum RequestStatusEnum {
  IDLE = 'idle',
  PENDING = 'pending',
  FULFILLED = 'fulfilled',
}

export type RequestStatus =
  | RequestStatusEnum.IDLE
  | RequestStatusEnum.PENDING
  | RequestStatusEnum.FULFILLED
  | { error: string };
export interface RequestStatusState {
  requestStatus: RequestStatus;
}

export function withRequestStatus() {
  return signalStoreFeature(
    withState<RequestStatusState>({
      requestStatus: RequestStatusEnum.IDLE,
    }),
    withComputed(({ requestStatus }) => ({
      isPending: () => requestStatus() === RequestStatusEnum.PENDING,
      isFulfilled: () => requestStatus() === RequestStatusEnum.FULFILLED,
      error: () => {
        const status = requestStatus();
        return typeof status === 'object' ? status.error : null;
      },
    })),
  );
}
