export class ArtViewModel {
    public url: string;
    public title: string;
    public author: string;
    public description: string;

    constructor(url: string, title: string, author: string, description: string) {
        this.url = url;
        this.title = title;
        this.author = author;
        this.description = description;
    }

    public static toViewModel(props: any): ArtViewModel {
        return new ArtViewModel(
            props["url_obra"] ?? "",
            props["nome"] ?? "",
            props["autor"] ?? "",
            props["descricao"] ?? "",
        );
    }
}