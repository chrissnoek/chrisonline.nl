module.exports = {
	future: {
		removeDeprecatedGapUtilities: true,
	},
	purge: ["./src/**/*.js", "./src/**/*.jsx", "./src/**/*.ts", "./src/**/*.tsx"],
	theme: {
		extend: {
			colors: {
				chris: {
					light: "#00b0d5",
					dark: "#0266d5",
				},
			},
		},
	},
	variants: {},
	plugins: [],
};
