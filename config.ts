const GlobalConfig = {
    rest: {
        //Space is capitalized because 'namespace' is a reserved string in TypeScript
        nameSpace: '/tdl-rest',
        baseURL: 'http://localhost:5050'
    },
    proxy: {
        nameSpace: '/',
        baseURL: 'https://training-ir.tdl.org'
    },
    ui: {
        nameSpace: '/', 
        baseURL: 'http://localhost:3000'
    }
};

export {GlobalConfig}
