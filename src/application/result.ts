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
    this.state === DataState.Loading
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

  fold<R>(
    notInited: () => R,
    loading: () => R,
    hasData: (data: T) => R,
    hasError: (err: Err) => R
  ) {
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
