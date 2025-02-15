import { atom } from "recoil";

const mainPageData = atom({
    key: "mainPageData",
    default: []
});

const firstPageData = atom({
    key: "firstPageData",
    default: []
});

const secondPageData = atom({
    key: "secondPageData",
    default: []
});

export {
    mainPageData,
    firstPageData,
    secondPageData
}