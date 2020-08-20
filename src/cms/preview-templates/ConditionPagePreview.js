import React from "react";
import PropTypes from "prop-types";
import { ConditionPageTemplate } from "../../templates/conditions-page";

const ConditionPagePreview = ({ entry, widgetFor }) => (
	<ConditionPageTemplate
		title={entry.getIn(["data", "title"])}
		content={widgetFor("body")}
	/>
);

ConditionPagePreview.propTypes = {
	entry: PropTypes.shape({
		getIn: PropTypes.func,
	}),
	widgetFor: PropTypes.func,
};

export default ConditionPagePreview;
