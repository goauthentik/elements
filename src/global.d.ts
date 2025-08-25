declare module "*.css";

declare module "*.scss";

declare module "*.md" {
    const html: string;
    const metadata: { [key: string]: string };
    const filename: string;
}

declare module "*.mdx" {
    const html: string;
    const metadata: { [key: string]: string };
    const filename: string;
}

declare namespace Intl {
    class ListFormat {
        constructor(locale: string, args: { [key: string]: string });
        public format: (items: string[]) => string;
    }
}

declare module "*.mdx" {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parameters: any;
}
