declare module 'most/lib/scheduler/defaultScheduler' {
  import { Scheduler } from 'most';

  const defaultScheduler: Scheduler;

  export default defaultScheduler;
}

declare module 'most/lib/scheduler/PropagateTask' {
  import { Task, Sink } from 'most';

  class PropagateTask<T> implements Task {
    public active: boolean;
    constructor(run: (t: number, x: T, sink: Sink<T>) => any, value: T, sink: Sink<T>);
    public static event<T>(x: T, sink: Sink<T>): PropagateTask<T>;
    public static end<T>(x: T, sink: Sink<T>): PropagateTask<T>;
    public static error(err: Error, sink: Sink<any>): PropagateTask<any>;
    public dispose(): void;
    public run(time: number): void;
    public error(time: number, err: Error): void;
  }

  export default PropagateTask;
}
