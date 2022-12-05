import * as T from 'fp-ts/Task'
import * as TE from 'fp-ts/TaskEither'
import type {Writable} from 'svelte/store'

export enum DataState {
  NotInited = 'NotInited',
  Loading = 'Loading',
  HasData = 'HasData',
  HasError = 'HasError',
}

export class Result<T, Err> {
  public value: T | null = null
  public err: Err | null = null
  public state: DataState = DataState.NotInited

  get notInited() {
    return this.state === DataState.NotInited
  }

  get loading() {
    return this.state === DataState.Loading
  }

  get hasData() {
    return this.state === DataState.HasData
  }

  get hasError() {
    return this.state === DataState.HasError
  }

  reset() {
    this.state = DataState.NotInited
    this.err = null
    this.value = null
    return this
  }

  setLoading() {
    this.state = DataState.Loading
    return this
  }

  setValue(val: T | null) {
    this.state = DataState.HasData
    this.value = val
    return this
  }

  setError(err: Err) {
    this.state = DataState.HasError
    this.err = err
    return this
  }

  onNotInited<R>(notInited: () => R) {
    if (this.state === DataState.NotInited) {
      notInited()
    }
    return this
  }

  onLoading<R>(loading: () => R) {
    if (this.state === DataState.Loading) {
      loading()
    }
    return this
  }

  onHasData<R>(hasData: (data: T) => R) {
    if (this.state === DataState.HasData) {
      hasData(this.value)
    }
    return this
  }

  onHasError<R>(hasError: (err: Err) => R) {
    if (this.state === DataState.HasError) {
      hasError(this.err)
    }
    return this
  }

  match<R>({
    notInited,
    loading,
    hasData,
    hasError,
  }: {
    notInited: () => R
    loading: () => R
    hasData: (data: T) => R
    hasError: (err: Err) => R
  }) {
    if (this.state === DataState.NotInited) {
      return notInited()
    }
    if (this.state === DataState.Loading) {
      return loading()
    }
    if (this.state === DataState.HasData) {
      return hasData(this.value)
    }
    if (this.state === DataState.HasError) {
      return hasError(this.err)
    }
  }
}

/**
 * Fold the result with given Writable Result
 * Set the data and change state based on Result or Error
 *
 * `foldWritable(storeVal)`
 *
 * is equipvalent to
 *
 * ```
 * T.fold(
 *   err => T.of(storeVal.update(v => v.setError(err)))
 *   res => T.of(storeVal.update(v => v.setValue(res)))
 * )
 * ```
 */
export const foldResult = <T, Err>(w: Writable<Result<T, Err>>) =>
  TE.fold<Err, T, void>(
    err => T.of(w.update(v => v.setError(err))),
    res => T.of(w.update(v => v.setValue(res)))
  )
