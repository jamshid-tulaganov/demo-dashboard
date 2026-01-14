interface SeoOptions {
    title: string;
    description?: string;
    keywords?: string;
    image?: string;
}

export const useSeo = (options: SeoOptions) => {
    const { title, description, keywords, image } = options;

    useHead({
        title,
        meta: [
            ...(description ? [{ name: 'description', content: description }] : []),
            ...(keywords ? [{ name: 'keywords', content: keywords }] : []),
            // Open Graph
            { property: 'og:title', content: `${title} | DashStack` },
            ...(description ? [{ property: 'og:description', content: description }] : []),
            ...(image ? [{ property: 'og:image', content: image }] : []),
            // Twitter
            { name: 'twitter:title', content: `${title} | DashStack` },
            ...(description ? [{ name: 'twitter:description', content: description }] : []),
            ...(image ? [{ name: 'twitter:image', content: image }] : []),
        ],
    });
};
