import "@total-typescript/ts-reset";
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Promise<T> {
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: unknown) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null,
    ): Promise<TResult1 | TResult2>;

    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: unknown) => TResult | PromiseLike<TResult>)
        | undefined
        | null,
    ): Promise<T | TResult>;
  }

  interface ArrayConstructor {
    isArray<T>(arg: T[] extends T ? T | T[] : never): arg is unknown[];
    new (arrayLength?: number): unknown[];
    (arrayLength?: number): unknown[];
  }

  interface ReadonlyArray<T> {
    includes<TSearch extends T | (TSReset.WidenLiteral<T> & {})>(
      searchElement: TSearch,
      fromIndex?: number,
    ): searchElement is T & TSearch;
  }

  interface MapConstructor {
    new (): Map<unknown, unknown>;
  }

  interface BooleanConstructor {
    new (value?: any): Boolean;
    <T>(value?: T): value is TSReset.NonFalsy<T>;
    readonly prototype: Boolean;
  }

  interface String {
    toLowerCase<T extends string>(this: T): Lowercase<T>;
    toUpperCase<T extends string>(this: T): Uppercase<T>;
  }

  interface NodeRequire {
    (id: string): unknown;
  }

  interface JSON {
    /**
     * Converts a JavaScript Object Notation (JSON) string into an object.
     * @param text A valid JSON string.
     * @param reviver A function that transforms the results. This function is called for each member of the object.
     * If a member contains nested objects, the nested objects are transformed before the parent object is.
     */
    parse(
      text: string,
      reviver?: (this: unknown, key: string, value: unknown) => any,
    ): unknown;
  
    stringify(
      value: unknown,
      replacer?: (this: unknown, key: string, value: unknown) => unknown,
      space?: string | number,
    ): string;
  }  
}
