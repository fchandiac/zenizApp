const config = require('./config.json')
module.exports = {
	images: {
        loader: 'custom',
        path: config.images_path
    },
	webpack: (config, { isServer }) => {
	  if (!isServer) {
		config.target = 'electron-renderer';
	  }
	  return config;
	},
  };