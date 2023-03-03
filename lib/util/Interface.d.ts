export interface Pixivic {
    id: number;
    title: string;
    imageUrls: {
        large: string;
        medium: string;
        original: string;
        squareMedium: string;
    }[];
    tags: {
        name: string;
        translatedName: string;
    }[];
    createDate: string;
}
export interface Vilipix {
    original_url: string;
    title: string;
    tags: string;
    picture_id: string;
}
export interface Lolicon {
    pid: number;
    p: number;
    uid: number;
    title: string;
    author: string;
    "r18": false;
    tags: string[];
    ext: number;
    aiType: number;
    uploadDate: number;
    urls: {
        original: string;
    };
}
