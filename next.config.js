/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['demo-api.shadowgrow.com', 'api.gsmfileguru.com', 'localhost', 'apis.filewale.com', 'gsmraja-api.shadowgrow.com', 'api.zmtfirmwarefiles.com'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'demo-api.shadowgrow.com',
            },
           
            {
                protocol: 'https',
                hostname: 'api.gsmfileguru.com',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
            },
            {
                protocol: 'https',
                hostname: 'apis.filewale.com'
            },
            {
                protocol: 'https',
                hostname: 'gsmraja-api.shadowgrow.com'
            },
            {
                protocol: 'https',
                hostname: 'api.zmtfirmwarefiles.com'
            }
        ],
    },
};

module.exports = nextConfig;