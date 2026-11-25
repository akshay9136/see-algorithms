/** @type {import('next-sitemap').IConfig} */

module.exports = {
    siteUrl: 'https://see-algorithms.com',
    exclude: [
        '/auth/*',
        '/admin',
        '/buy-credits',
        '/refund-policy',
        '/sorting/embed/*',
        '/graph/embed/*',
        '/data-structures/embed/*',
    ],
}
