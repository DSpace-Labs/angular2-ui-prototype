const GlobalConfig = {
	rest: {
		//Space is capitalized because 'namespace' is a reserved string in TypeScript
		nameSpace: '/tdl-rest',
		baseURL: 'http://imacdev.tamu.edu:5050'
	},
	proxy: {
		nameSpace: '/',
		baseURL: 'https://training-ir.tdl.org'
	},
	ui: {
		nameSpace: '/',	
		baseURL: 'http://imacdev.tamu.edu:3000'
	}
};

export {GlobalConfig}
