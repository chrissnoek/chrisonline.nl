module.exports = {
	siteMetadata: {
		title: "Chris Online",
		author: "Chris Online",
		description: "",
	},
	plugins: [
		{
			resolve: "gatsby-plugin-google-tagmanager",
			options: {
				id: "GTM-NQQ2NXW",

				// Include GTM in development.
				//
				// Defaults to false meaning GTM will only be loaded in production.
				includeInDevelopment: false,

				// datalayer to be set before GTM is loaded
				// should be an object or a function that is executed in the browser
				//
				// Defaults to null
				defaultDataLayer: { platform: "gatsby" },

				// Specify optional GTM environment details.
				//   gtmAuth: "YOUR_GOOGLE_TAGMANAGER_ENVIRONMENT_AUTH_STRING",
				//   gtmPreview: "YOUR_GOOGLE_TAGMANAGER_ENVIRONMENT_PREVIEW_NAME",
				//   dataLayerName: "YOUR_DATA_LAYER_NAME",

				// Name of the event that is triggered
				// on every Gatsby route change.
				//
				// Defaults to gatsby-route-change
				//routeChangeEventName: "YOUR_ROUTE_CHANGE_EVENT_NAME",
			},
		},
		"gatsby-plugin-react-helmet",
		"gatsby-plugin-postcss",
		{
			resolve: `gatsby-plugin-sass`,
			options: {
				postCssPlugins: [
					require("tailwindcss"),
					require("./tailwind.config.js"), // Optional: Load custom Tailwind CSS configuration
				],
			},
		},
		{
			// keep as first gatsby-source-filesystem plugin for gatsby image support
			resolve: "gatsby-source-filesystem",
			options: {
				path: `${__dirname}/static/img`,
				name: "uploads",
			},
		},
		{
			resolve: "gatsby-source-filesystem",
			options: {
				path: `${__dirname}/src/pages`,
				name: "pages",
			},
		},
		{
			resolve: "gatsby-source-filesystem",
			options: {
				path: `${__dirname}/src/img`,
				name: "images",
			},
		},
		"gatsby-plugin-sharp",
		"gatsby-transformer-sharp",
		{
			resolve: "gatsby-transformer-remark",
			options: {
				plugins: [
					{
						resolve: "gatsby-remark-relative-images",
						options: {
							name: "uploads",
						},
					},
					{
						resolve: "gatsby-remark-images",
						options: {
							// It's important to specify the maxWidth (in pixels) of
							// the content container as this plugin uses this as the
							// base for generating different widths of each image.
							maxWidth: 2048,
						},
					},
					{
						resolve: "gatsby-remark-copy-linked-files",
						options: {
							destinationDir: "static",
						},
					},
				],
			},
		},
		{
			resolve: "gatsby-plugin-netlify-cms",
			options: {
				modulePath: `${__dirname}/src/cms/cms.js`,
			},
		},
		{
			resolve: "gatsby-plugin-purgecss", // purges all unused/unreferenced css rules
			options: {
				develop: true, // Activates purging in npm run develop
				purgeOnly: ["/all.sass"], // applies purging only on the bulma css file
			},
		}, // must be after other CSS plugins
		"gatsby-plugin-netlify", // make sure to keep it last in the array
	],
};
