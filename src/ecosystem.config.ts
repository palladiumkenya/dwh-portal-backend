module.exports = {
    apps: [
        {
            name: 'dwh-portal-backend',
            script: './main.js',
            watch: true,
            // eslint-disable-next-line @typescript-eslint/camelcase
            env_production: {
                PORT: 4000,
                NODE_ENV: 'production',
            },
        },
    ],
};
