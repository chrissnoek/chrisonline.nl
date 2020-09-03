import React from "react";
import PropTypes from "prop-types";
import { Link, graphql } from "gatsby";
import { FaMobile, FaMedal, FaBolt } from "react-icons/fa";
import Index from "../pages/contact/index.js";

import Layout from "../components/Layout";
import Features from "../components/Features";
import BlogRoll from "../components/BlogRoll";

export const IndexPageTemplate = ({
	image,
	title,
	heading,
	subheading,
	mainpitch,
	description,
	intro,
}) => {
	const onLinkClick = (e) => {
		e.preventDefault();
		const splittedUrl = e.target.href.split("/");
		const segment = splittedUrl[splittedUrl.length - 1];
		const element = document.querySelector(segment);
		const topPos = element.getBoundingClientRect().top;

		window.scroll({
			top: topPos,
			behavior: "smooth", // чтобы было плавным
		});
	};

	return (
		<div>
			<main className="py-10 mx-auto max-w-screen-xl sm:py-12 md:py-16 lg:py-20 xl:py-28">
				<div className="sm:text-center lg:text-left">
					<h2 className="text-white text-4xl tracking-tight leading-10 font-extrabold sm:text-5xl sm:leading-none md:text-6xl">
						Een <span className="text-chris-light"> razendsnelle website</span>{" "}
						voor je bedrijf
					</h2>
					<p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
						Geen trage WordPress installatie, maar een razendsnelle website die
						zorgt voor betere posities in Google, hogere conversie ratio en een
						uitstekende user experience.
						<br />
						Dat is toch wat je wil?
					</p>
					<div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
						<div className="rounded-md shadow">
							<a
								onClick={onLinkClick}
								href="#contact"
								className="bg-gradient-to-r from-chris-light to-chris-dark w-full hover:via-chris-light transition duration-500 ease-in-out flex items-center justify-center px-8 py-3  text-base leading-6 font-medium rounded-md text-white bg-chris-light hover:bg-teal-200  focus:shadow-outline-teal md:py-4 md:text-lg md:px-10"
							>
								Razendsnel contact opnemen »
							</a>
						</div>
						{/* <div className="mt-3 sm:mt-0 sm:ml-3">
						<a
							href="#"
							className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-teal-700 bg-teal-100 hover:text-chris-light hover:bg-teal-50 focus:outline-none focus:shadow-outline-teal focus:border-teal-300 transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10"
						>
							Live demo
						</a>
					</div> */}
					</div>
				</div>
			</main>

			<div className="py-12">
				<div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="lg:text-center">
						<p className="text-base leading-6 text-chris-light font-semibold tracking-wide uppercase">
							Waarom ChrisOnline?
						</p>
						<h3 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl sm:leading-10">
							Diensten
						</h3>
						<p className="mt-4 max-w-2xl text-xl leading-7 text-gray-500 lg:mx-auto">
							Een technisch sterke website waarmee je meteen een voorsprong hebt
							op je concurrentie.
						</p>
					</div>

					<div className="mt-10">
						<ul className="md:grid md:grid-cols-2 md:col-gap-8 md:row-gap-10">
							<li className=" mb-8 mr-8">
								<div className="flex">
									<div className="flex-shrink-0">
										<div className="flex items-center justify-center h-12 w-12 rounded-md bg-chris-light text-white">
											<FaMedal className="fill-current text-white" />
										</div>
									</div>
									<div className="ml-4">
										<h4 className="text-lg leading-6 font-medium text-white">
											Kwaliteit en maatwerk
										</h4>
										<p className="mt-2 text-base leading-6 text-gray-500">
											Maatwerk in plaats van standaard templates. Zo krijgt
											iedere website gegarandeerd de beste performance en
											ervaring.
										</p>
									</div>
								</div>
							</li>
							<li className="mt-10 md:mt-0 mb-8">
								<div className="flex">
									<div className="flex-shrink-0">
										<div className="flex items-center justify-center h-12 w-12 rounded-md bg-chris-light text-white">
											<FaMobile className="fill-current text-white" />
										</div>
									</div>
									<div className="ml-4">
										<h4 className="text-lg leading-6 font-medium text-white">
											Volledig responsive
										</h4>
										<p className="mt-2 text-base leading-6 text-gray-500">
											Mobile first ontwerp, volledig schaalbaar op elk apparaat.
											Een must voor een moderne website.
										</p>
									</div>
								</div>
							</li>
							<li className="mt-10 md:mt-0 mb-4">
								<div className="flex">
									<div className="flex-shrink-0">
										<div className="flex items-center justify-center h-12 w-12 rounded-md bg-chris-light text-white">
											<FaBolt className="fill-current text-white" />
										</div>
									</div>
									<div className="ml-4">
										<h4 className="text-lg leading-6 font-medium text-white">
											Razend snel
										</h4>
										<p className="mt-2 text-base leading-6 text-gray-500">
											Door alleen code te gebruiken die nodig is, heb je met je
											snelle website een grote voorsprong op je concurrenten.
										</p>
									</div>
								</div>
							</li>
							<li className="mt-10 md:mt-0">
								<div className="flex">
									<div className="flex-shrink-0">
										<div className="flex items-center justify-center h-12 w-12 rounded-md bg-chris-light text-white">
											<svg
												className="h-6 w-6"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
												/>
											</svg>
										</div>
									</div>
									<div className="ml-4">
										<h4 className="text-lg leading-6 font-medium text-white">
											Content Management systeem
										</h4>
										<p className="mt-2 text-base leading-6 text-gray-500">
											Eenvoudig je website aanpassen en up-to-date houden door
											je content aan te passen via jouw CMS systeem.
										</p>
									</div>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</div>

			<div className="bg-white relative sm:flex rounded p-12">
				<div className="flex flex-col justify-between mr-8 w-full">
					<div>
						<h2
							id="contact"
							className="text-gray-800 text-4xl lg:text-5xl font-bold leading-tight"
						>
							Project starten met Chris?{" "}
							<span className="hidden sm:inline-block">👉</span>{" "}
							<span className="inline-block sm:hidden">👇</span>
						</h2>
					</div>
					<div className="mt-8 text-center"></div>
				</div>
				<div className="w-full">
					<Index />
					<a
						href="mailto:info@chrisoline.nl"
						className="block underline text-2xl text-gray-700 mt-8"
					>
						Liever een mailtje?
					</a>
				</div>
			</div>

			{/* <div
      className="full-width-image margin-top-0"
      style={{
        backgroundImage: `url(${
          !!image.childImageSharp ? image.childImageSharp.fluid.src : image
        })`,
        backgroundPosition: `top left`,
        backgroundAttachment: `fixed`,
      }}
    >
      <div
        style={{
          display: 'flex',
          height: '150px',
          lineHeight: '1',
          justifyContent: 'space-around',
          alignItems: 'left',
          flexDirection: 'column',
        }}
      >
        <h1
          className="has-text-weight-bold is-size-3-mobile is-size-2-tablet is-size-1-widescreen"
          style={{
            boxShadow:
              'rgb(255, 68, 0) 0.5rem 0px 0px, rgb(255, 68, 0) -0.5rem 0px 0px',
            backgroundColor: 'rgb(255, 68, 0)',
            color: 'white',
            lineHeight: '1',
            padding: '0.25em',
          }}
        >
          {title}
        </h1>
        <h3
          className="has-text-weight-bold is-size-5-mobile is-size-5-tablet is-size-4-widescreen"
          style={{
            boxShadow:
              'rgb(255, 68, 0) 0.5rem 0px 0px, rgb(255, 68, 0) -0.5rem 0px 0px',
            backgroundColor: 'rgb(255, 68, 0)',
            color: 'white',
            lineHeight: '1',
            padding: '0.25em',
          }}
        >
          {subheading}
        </h3>
      </div>
    </div>
    <section className="section section--gradient">
      <div className="container">
        <div className="section">
          <div className="columns">
            <div className="column is-10 is-offset-1">
              <div className="content">
                <div className="content">
                  <div className="tile">
                    <h1 className="title">{mainpitch.title}</h1>
                  </div>
                  <div className="tile">
                    <h3 className="subtitle">{mainpitch.description}</h3>
                  </div>
                </div>
                <div className="columns">
                  <div className="column is-12">
                    <h3 className="has-text-weight-semibold is-size-2">
                      {heading}
                    </h3>
                    <p>{description}</p>
                  </div>
                </div>
                <Features gridItems={intro.blurbs} />
                <div className="columns">
                  <div className="column is-12 has-text-centered">
                    <Link className="btn" to="/products">
                      See all products
                    </Link>
                  </div>
                </div>
                <div className="column is-12">
                  <h3 className="has-text-weight-semibold is-size-2">
                    Latest stories
                  </h3>
                  <BlogRoll />
                  <div className="column is-12 has-text-centered">
                    <Link className="btn" to="/blog">
                      Read more
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section> */}
		</div>
	);
};

IndexPageTemplate.propTypes = {
	image: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
	title: PropTypes.string,
	heading: PropTypes.string,
	subheading: PropTypes.string,
	mainpitch: PropTypes.object,
	description: PropTypes.string,
	intro: PropTypes.shape({
		blurbs: PropTypes.array,
	}),
};

const IndexPage = ({ data }) => {
	const { frontmatter } = data.markdownRemark;

	return (
		<Layout>
			<IndexPageTemplate
				image={frontmatter.image}
				title={frontmatter.title}
				heading={frontmatter.heading}
				subheading={frontmatter.subheading}
				mainpitch={frontmatter.mainpitch}
				description={frontmatter.description}
				intro={frontmatter.intro}
			/>
		</Layout>
	);
};

IndexPage.propTypes = {
	data: PropTypes.shape({
		markdownRemark: PropTypes.shape({
			frontmatter: PropTypes.object,
		}),
	}),
};

export default IndexPage;

export const pageQuery = graphql`
	query IndexPageTemplate {
		markdownRemark(frontmatter: { templateKey: { eq: "index-page" } }) {
			frontmatter {
				title
				image {
					childImageSharp {
						fluid(maxWidth: 2048, quality: 100) {
							...GatsbyImageSharpFluid
						}
					}
				}
				heading
				subheading
				mainpitch {
					title
					description
				}
				description
				intro {
					blurbs {
						image {
							childImageSharp {
								fluid(maxWidth: 240, quality: 64) {
									...GatsbyImageSharpFluid
								}
							}
						}
						text
					}
					heading
					description
				}
			}
		}
	}
`;
