import type { CategoryList } from "./Util";

type APIFunction = (this: void) => Promise<string>;
type APIFunctionRandom = (this: void) => Promise<{ data: string; type: StringCategories; }>;

export type StringCategories = typeof CategoryList[number];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;
type StringToNestedObject<S extends string, K> = S extends `${infer T}.${infer U}` ? {[Key in T]: StringToNestedObject<U, K>} : { [Key in S]: K };
export type ImagesStructure = UnionToIntersection<StringToNestedObject<StringCategories, APIFunction>> & Record<"random", APIFunctionRandom>;
