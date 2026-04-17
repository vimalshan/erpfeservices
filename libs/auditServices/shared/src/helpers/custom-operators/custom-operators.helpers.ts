import { map, Observable } from 'rxjs';

interface ApiResponseLike {
  isSuccess?: boolean;
  message?: string | null;
  data?: any;
}

export function throwIfNotSuccess() {
  return <T extends ApiResponseLike>(source: Observable<T>): Observable<T> =>
    source.pipe(
      map((response) => {
        if (!response.isSuccess) {
          throw new Error(response.message ?? 'Request failed');
        }

        return response;
      }),
    );
}
