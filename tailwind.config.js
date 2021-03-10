module.exports = {
	future: {
		removeDeprecatedGapUtilities: true,
	},
	purge: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			colors: {
				chris: {
					light: "#00b0d5",
					dark: "#0266d5",
					black: "#0e0f1c",
				},
			},
		},
	},
	variants: {},
	plugins: [],
};
