export const allPropsAreEmpty = (filters: { [key: string]: unknown }) => {
  return Object.values(filters).every((val: any) => {
    return typeof val == 'undefined';
  });
};
export type Paginate = { limit?: number; skip?: number };

export type PartialAssert<T> = {
  [P in keyof T]?: T[P] | ((val: T[P]) => boolean);
} & Paginate;

const handleSizeArr =
  <T extends unknown>(arr: T[]) =>
  (skip: number, limit: number) => {
    return arr.slice(skip, limit);
  };

export function assertProps<T>(arr: T[]) {
  return ({ limit, skip, ...props }: PartialAssert<T>) => {
    if (allPropsAreEmpty(props)) return arr;
    return handleSizeArr(arr)(skip, limit).filter((can: any) => {
      return Object.keys(props).every((d: any) => {
        const safeProps: any = props;
        if (typeof safeProps[d] == 'function') {
          return safeProps[d]((can as any)[d]);
        }
        return can[d] === safeProps[d];
      });
    });
  };
}
