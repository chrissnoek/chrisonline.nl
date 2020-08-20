import React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
import Layout from "../components/Layout";
import Content, { HTMLContent } from "../components/Content";

export const ConditionPageTemplate = ({ title, content, contentComponent }) => {
	const PageContent = contentComponent || Content;

	return (
		<section className="section section--gradient">
			<div className="container">
				<div className="columns">
					<div className="column is-10 is-offset-1">
						<div className="section">
							<h2 className="title is-size-3 has-text-weight-bold is-bold-light">
								{title}
							</h2>
							<PageContent className="content" content={content} />
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

ConditionPageTemplate.propTypes = {
	title: PropTypes.string.isRequired,
	content: PropTypes.string,
	contentComponent: PropTypes.func,
};

const ConditionPage = ({ data }) => {
	const { markdownRemark: post } = data;

	return (
		<Layout>
			<ConditionPageTemplate
				contentComponent={HTMLContent}
				title={post.frontmatter.title}
				content={post.html}
			/>
		</Layout>
	);
};

ConditionPage.propTypes = {
	data: PropTypes.object.isRequired,
};

export default ConditionPage;

export const aboutPageQuery = graphql`
	query ConditionPage($id: String!) {
		markdownRemark(id: { eq: $id }) {
			html
			frontmatter {
				title
			}
		}
	}
`;
