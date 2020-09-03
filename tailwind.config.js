module.exports = {
	future: {
		removeDeprecatedGapUtilities: true,
	},
	purge: ["./src/**/*.js", "./src/**/*.jsx", "./src/**/*.ts", "./src/**/*.tsx"],
	theme: {
		extend: {
			colors: {
				chris: {
					light: "#0bb5d6",
					dark: "#2369b3",
				},
			},
		},
	},
	variants: {},
	plugins: [],
};
