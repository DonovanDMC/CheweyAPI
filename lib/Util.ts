import type { ImagesStructure, StringCategories } from "./types";

export const CategoryList = [
    "birb", "car", "cat", "crab",
    "dog", "dolphin", "duck", "fantasy-art",
    "ferret", "fox", "jellyfish", "kangaroo",
    "koala", "nature", "otter", "owl",
    "panda", "rabbit", "racoon", "red-panda",
    "snake", "space", "turtle", "wallaby",
    "whale", "wolf", "bird"
] as const;

export function CreateImagesWrapper(doRequest: (path: string, raw: boolean) => unknown, props: Array<string> = []): ImagesStructure {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return new Proxy(function() {}, {
        get(target, key) {
            if (typeof key !== "string") {
                throw new TypeError(`Expected key to be a string, got ${typeof key}`);
            }
            const k = [...props, key].join(".") as StringCategories;

            if (CategoryList.includes(k)) {
                return () => doRequest(`/${[...props, key].join("/")}`, false);
            }

            if ((k as string) === "random") {
                return () => doRequest("/random", true);
            }
            if (CategoryList.some(category => category.startsWith(k))) {
                return CreateImagesWrapper(doRequest, [...props, key]);
            }
        }
    }) as unknown as ImagesStructure;
}
