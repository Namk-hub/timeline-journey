import { defineConfig } from 'jsrepo';

export default defineConfig({
    // configure where stuff comes from here
    registries: [
        'https://reactbits.dev/r'
    ],
    // configure where stuff goes here
    paths: {
        components: 'src/components/ui',
        component: 'src/components/ui',
    },
});