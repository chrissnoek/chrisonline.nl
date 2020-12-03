import React, { useState } from "react";
import PropTypes from "prop-types";
import { graphql, Link } from "gatsby";
import Layout from "../components/Layout";
import {
	FaCaretDown,
	FaCaretUp,
	FaCheck,
	FaComments,
	FaLinkedin,
	FaRegLightbulb,
	FaStar,
} from "react-icons/fa";

export const ProductPageTemplate = () => {
	const onLinkClick = (e) => {
		e.preventDefault();
		const splittedUrl = e.target.href.split("#");
		const segment = "#" + splittedUrl[splittedUrl.length - 1];
		const element = document.querySelector(segment);
		const topPos = element.getBoundingClientRect().top;

		window.scroll({
			top: topPos,
			behavior: "smooth", // чтобы было плавным
		});
	};
	const faq = [
		{
			question:
				"Kan ik mijn huidige domeinnaam gebruiken voor de nieuwe website?",
			answer:
				"Tuurlijk! We verhuizen je domeinnaam gewoon mee, ik regel het voor je.",
		},
		{
			question: "Kan ik de site zelf gaan bijhouden?",
			answer:
				"Ik bouw de website op een content management systeem waar je zelf je teksten en foto's kunt aanpassen. Grotere aanpassingen geef je gewoon even door en ik zorg dat deze zo spoedig mogelijk live komen te staan.",
		},
		{
			question: "Zijn updates en onderhoud bij de prijs inbegrepen?",
			answer:
				"Alle aanpassingen aan de website zijn bij de prijs ingegrepen. Ook als je over een tijdje een hele nieuwe website wilt.",
		},
		{
			question:
				"Ik begin net met mijn bedrijf en ik heb nog geen huisstijl, kan je hier bij helpen?",
			answer:
				"Ik heb in mijn netwerk van freelancers sterke grafisch ontwerpers zitten, vermeld dit even bij je aanvraag en ik help je opweg.",
		},
		{
			question: "Wat houdt de maandelijkse analyse in?",
			answer:
				"Naast dat je zelf toegang krijg tot Google Analytics, zorg ik voor een maandelijks rapport met optimalisatie tips op het gebied van content, conversie, seo, en trends zodat we je website elke keer een stukje beter kunnen maken.",
		},
	];
	return (
		<div>
			<div className="content">
				<div className="h-4/5 flex items-center justify-center text-center">
					<div className="max-w-2xl mx-auto text-center">
						<div className="gradient inline-block mx-auto mb-4 transition duration-500 ease-in-out px-8 py-3  text-base leading-6 font-medium rounded-md text-white bg-chris-light hover:bg-teal-200  focus:shadow-outline-teal md:py-2 md:text-lg md:px-5">
							Eerste maand gratis
						</div>
						<h1 className="font-bold w-full text-white text-5xl mb-4 leading-tight">
							Een professioneel handgemaakte website voor een vast bedrag per
							maand.
						</h1>
						<p className="text-lg">
							Met{" "}
							<span className="text-chris-light font-bold">
								gratis, onbeperkt
							</span>{" "}
							aanpassingen, voor ondernemers die weten wat ze online willen,
							maar geen tijd of expertise hebben om dit uit te voeren
						</p>
					</div>
				</div>
				<div className="text-center">
					<section className="flex items-center justify-center mt-10">
						<div className="flex items-center justify-center mr-6">
							<FaCheck className="text-chris-dark mr-2" />
							<span className="text-lg text-white font-bold">100% op maat</span>
						</div>
						<div className="flex items-center justify-center mr-6">
							<FaCheck className="text-chris-dark mr-2" />
							<span className="text-lg text-white font-bold">
								Gratis onbeperkt website aanpassingen
							</span>
						</div>
						<div className="flex items-center justify-center mr-6">
							<FaCheck className="text-chris-dark mr-2" />
							<span className="text-lg text-white font-bold">
								Vast bedrag per maand
							</span>
						</div>
					</section>
					<a
						onClick={onLinkClick}
						href="#pakketten"
						className="rounded py-2 px-5 mt-8 mb-4 border-2 border-chris-light hover:border-chris-dark inline-block mx-auto text-center"
					>
						Bekijk pakketten »
					</a>
				</div>
			</div>
			<section className="w-full mt-12 bg-chris-dark py-12 px-4">
				<div className="content text-center">
					<h2 className="text-white text-4xl font-bold mb-6">
						Wanneer is het website abonnement voor jou geschikt?
					</h2>
					<div className="flex items-stretch justify-center mb-4">
						<div className="bg-white px-6 py-4 rounded w-full mr-4">
							<p className="font-bold text-black">
								Je begrijpt het belang van een up-to-date website, maar hebt
								zelf geen tijd of de nodige expertise om dit altijd goed te doen
							</p>
						</div>
						<div className="bg-white px-6 py-4 rounded w-full mr-4 flex items-center">
							<p className="font-bold text-black">
								Je hebt iemand nodig die altijd klaarstaat om je site naar jouw
								wensen aan te passen
							</p>
						</div>
						<div className="bg-white px-6 py-4 rounde w-full">
							<p className="font-bold text-black">
								Je bent veel liever bezig zijn met het laten groeien van je
								onderneming dan het bijhouden van je website
							</p>
						</div>
					</div>
					<div className="flex items-stretch justify-center ">
						<div className="bg-white px-6 py-4 rounded w-full mr-4 max-w-md">
							<p className="font-bold text-black">
								Je wilt geen onverwachte kosten of een torenhoge factuur na elke
								aanpassing, of zelfs hele nieuwe website
							</p>
						</div>
						<div className="bg-white px-6 py-4 rounded w-full mr-4 max-w-md flex items-center">
							<p className="font-bold text-black">
								Je hebt iemand nodig met expertise en die meedenkt vanuit het
								belang van jouw bedrijf
							</p>
						</div>
					</div>
				</div>
			</section>

			<section className="w-full mt-12 py-12 px-4">
				<div className=" text-center max-w-2xl mx-auto">
					<h2 className="text-white text-4xl font-bold mb-6">Over Chris</h2>
					<p className="text-white mb-4">
						Inmiddels heb ik voor en met diverse klanten tal van projecten tot
						een succes gemaakt. Aan de basis van ieder project staat niet alleen
						ruim 9 jaar ervaring, maar vooral ook: heel veel inzet en
						gedrevenheid.
					</p>
					<p className="text-white mb-4">
						Naast 9 jaar ervaring in front end development loop ik ook al 5 jaar
						rond bij Coolblue, een van de grootste online retailers van
						Nederland waar ik veel kennis heb opgedaan.{" "}
					</p>
					<p className="text-white mb-4">
						Graag deel ik mijn ervaring en passie voor internet ondernemen met
						jou. Zoek je een betrouwbare partner voor een online project? Bekijk
						mijn portfolio of neem direct vrijblijvend contact op.
					</p>
					<div className="flex items-center justify-center">
						<a
							className="flex items-center justify-center mr-6 block rounded py-2 px-5 mt-8 mb-4 border-2 border-chris-light hover:border-chris-dark inline-block  text-center"
							rel="noreferrer"
							href="https://www.linkedin.com/in/chrissnoek/"
							target="_blank"
						>
							<span className="text-lg text-white font-bold mr-2">
								Connect op Linkedin:{" "}
							</span>
							<FaLinkedin className="text-2xl text-white-800 hover:text-white" />
						</a>
					</div>
				</div>
				<div className="flex items-center justify-center mt-10 pt-10 text-center content">
					<div className="max-w-sm text-center w-full sm:mr-4">
						<FaStar className="text-chris-dark mb-4 text-5xl text-center mx-auto" />
						<h3 className="text-white font-bold mb-2">Kwaliteit en maatwerk</h3>
						<p className="text-white mb-2">
							Maatwerk in plaats van standaard templates. Zo krijgt iedere
							website gegarandeerd de meest persoonlijke uitstraling én de beste
							performance.
						</p>
					</div>
					<div className="max-w-sm text-center w-full sm:mr-4">
						<FaComments className="text-chris-dark mb-4 text-5xl text-center mx-auto" />
						<h3 className="text-white font-bold mb-2">Persoonlijk contact</h3>
						<p className="text-white mb-2">
							Korte lijntjes en één aanspreekpunt tijdens het gehele ontwerp- en
							ontwikkelproces. Dat is snel, handig en betrouwbaar.
						</p>
					</div>
					<div className="max-w-sm text-center w-full">
						<FaRegLightbulb className="text-chris-dark mb-4 text-5xl text-center mx-auto" />
						<h3 className="text-white font-bold mb-2">Kennis en ervaring</h3>
						<p className="text-white mb-2">
							5 jaar ervaring bij een van de grootste online retailers van
							Nederland. De juiste kennis en ervaring is ruimschoots aanwezig!
						</p>
					</div>
				</div>
			</section>

			<section className="w-full mt-12 py-12 px-4 bg-white">
				<div className=" text-center max-w-2xl mx-auto">
					<h2 className="text-gray-800 text-4xl font-bold mb-6">
						Veelgestelde vragen
					</h2>
					<p className="text-gray-800 mb-8">
						<span className="font-bold block ">
							Hier vind je een overzicht met de meest gestelde vragen.
						</span>
						Mocht je vraag er niet tussen staan neem dan{" "}
						<a
							className="text-chris-dark cursor-pointer"
							href="mailto:info@chrisonline.nl"
						>
							gerust contact op!
						</a>
					</p>
					<div className="">
						{faq.map((item) => (
							<Question question={item.question} answer={item.answer} />
						))}
					</div>
				</div>
			</section>

			<section className="w-full mt-12 py-12 px-4">
				<div className=" text-center">
					<h2 id="pakketten" className="text-white text-4xl font-bold mb-6">
						Pakketten
					</h2>

					<div className="flex items-center justify-center content">
						<div className="px-10 py-10 bg-white rounded shadow-lg w-full max-w-md mr-4 self-stretch">
							<div className="gradient text-sm inline-block mx-auto mb-2 transition duration-500 ease-in-out px-3 py-1 font-medium rounded-md text-white bg-chris-light">
								Eerste maand gratis
							</div>
							<h3 className="text-chris-light font-bold text-3xl mb-2">
								Basic
							</h3>
							<div className="flex items-center justify-center mb-4">
								<span className="text-gray-600 text-sm mr-1">€</span>
								<p className=" text-black font-bold text-4xl">149</p>
								<span className="text-gray-600 text-sm ml-1">p.m.</span>
							</div>
							<div className="text-left">
								<span className="flex items-center mb-3  font-bold text-gray-800">
									<FaCheck className="mr-2 text-chris-light" />{" "}
									<span>1 domein, 1 SSL certificaat en 40GB mail</span>
								</span>
								<span className="flex items-center mb-3  font-bold text-gray-800">
									<FaCheck className="mr-2 text-chris-light" />{" "}
									<span>Professioneel ontwerp op maat</span>
								</span>
								<span className="flex items-center mb-3  font-bold text-gray-800">
									<FaCheck className="mr-2 text-chris-light" />{" "}
									<span>Zelf content aanpassingen doen</span>
								</span>
								<span className="flex items-center mb-3  font-bold text-gray-800">
									<FaCheck className="mr-2 text-chris-light" />{" "}
									<span>Onbeperkt aanpassingen aanvragen</span>
								</span>
								<span className="flex items-center mb-3  font-bold text-gray-800">
									<FaCheck className="mr-2 text-chris-light" />{" "}
									<span>Homepagina, subpagina, 1 contact formulier</span>
								</span>
								<span className="flex items-center mb-3  font-bold text-gray-800">
									<FaCheck className="mr-2 text-chris-light" />{" "}
									<span>Geoptimaliseerd voor Google</span>
								</span>
								<span className="flex items-center mb-3  font-bold text-gray-800">
									<FaCheck className="mr-2 text-chris-light" />{" "}
									<span>Mobiel en tablet vriendelijk</span>
								</span>
							</div>
							<Link
								className="mt-6 py-3 px-4 text-lg bg-green-500 hover:bg-green-600 text-white text-center inline-block rounded"
								to="/website-abonnement/basic"
							>
								Gratis gesprek aanvragen{" "}
								<span role="img" aria-label="rocket">
									🚀
								</span>
							</Link>
						</div>
						<div className="px-10 py-10 bg-white rounded shadow-lg w-full max-w-md">
							<div className="gradient text-sm inline-block mx-auto mb-2 transition duration-500 ease-in-out px-3 py-1 font-medium rounded-md text-white bg-chris-light">
								Eerste maand gratis
							</div>
							<h3 className="text-chris-light font-bold text-3xl mb-2">Pro</h3>
							<div className="flex items-center justify-center mb-4">
								<span className="text-gray-600 text-sm mr-1">€</span>
								<p className=" text-black font-bold text-4xl">349</p>
								<span className="text-gray-600 text-sm ml-1">p.m.</span>
							</div>
							<div className="text-left">
								<span className="flex items-center mb-3  font-bold text-gray-800">
									<FaCheck className="mr-2 text-chris-light" />{" "}
									<span>1 domein, 1 SSL certificaat en 40GB mail</span>
								</span>
								<span className="flex items-center mb-3  font-bold text-gray-800">
									<FaCheck className="mr-2 text-chris-light" />{" "}
									<span>Professioneel ontwerp op maat</span>
								</span>
								<span className="flex items-center mb-3  font-bold text-gray-800">
									<FaCheck className="mr-2 text-chris-light" />{" "}
									<span>Zelf content aanpassingen doen</span>
								</span>
								<span className="flex items-center mb-3  font-bold text-gray-800">
									<FaCheck className="mr-2 text-chris-light" />{" "}
									<span>Onbeperkt aanpassingen aanvragen</span>
								</span>
								<span className="flex items-center mb-3  font-bold text-chris-light">
									<FaCheck className="mr-2 text-chris-light" />{" "}
									<span>Complexe website/webshop, niets is te gek</span>
								</span>
								<span className="flex items-center mb-3  font-bold text-gray-800">
									<FaCheck className="mr-2 text-chris-light" />{" "}
									<span>Geoptimaliseerd voor Google</span>
								</span>
								<span className="flex items-center mb-3  font-bold text-gray-800">
									<FaCheck className="mr-2 text-chris-light" />{" "}
									<span>Mobiel en tablet vriendelijk</span>
								</span>
								<span className="flex items-center mb-3  font-bold text-chris-light">
									<FaCheck className="mr-2 text-chris-light" />{" "}
									<span>Maandelijkse website analyse</span>
								</span>
							</div>
							<Link
								className="mt-6 py-3 px-4 text-lg bg-green-500 hover:bg-green-600 text-white text-center inline-block rounded"
								to="/website-abonnement/pro"
							>
								Gratis gesprek aanvragen{" "}
								<span role="img" aria-label="rocket">
									🚀
								</span>
							</Link>
						</div>
					</div>
					<div className="text-sm text-gray-700 mt-6">
						Prijzen exlusief BTW.
					</div>
				</div>
			</section>
		</div>
	);
};

ProductPageTemplate.propTypes = {
	image: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
	title: PropTypes.string,
	heading: PropTypes.string,
	description: PropTypes.string,
	intro: PropTypes.shape({
		blurbs: PropTypes.array,
	}),
	main: PropTypes.shape({
		heading: PropTypes.string,
		description: PropTypes.string,
		image1: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
		image2: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
		image3: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
	}),
	testimonials: PropTypes.array,
	fullImage: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
	pricing: PropTypes.shape({
		heading: PropTypes.string,
		description: PropTypes.string,
		plans: PropTypes.array,
	}),
};

const ProductPage = ({ data }) => {
	const { frontmatter } = data.markdownRemark;

	return (
		<Layout>
			<ProductPageTemplate
				image={frontmatter.image}
				title={frontmatter.title}
				heading={frontmatter.heading}
				description={frontmatter.description}
				intro={frontmatter.intro}
				main={frontmatter.main}
				testimonials={frontmatter.testimonials}
				fullImage={frontmatter.full_image}
				pricing={frontmatter.pricing}
			/>
		</Layout>
	);
};
const Question = ({ question, answer }) => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleRow = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div className="rounded bg-white py-3 px-4 mb-4 shadow-md">
			<div
				className="flex items-center"
				onClick={toggleRow}
				role="button"
				tabIndex={0}
				onKeyDown={toggleRow}
			>
				<p className="text-black font-bold">{question}</p>

				<span className="ml-auto">
					{isOpen ? (
						<FaCaretDown className="text-black" />
					) : (
						<FaCaretUp className="text-black" />
					)}
				</span>
			</div>
			<div className={isOpen ? "block mt-2" : "hidden"}>
				<p className="text-black text-left">{answer}</p>
			</div>
		</div>
	);
};

ProductPage.propTypes = {
	data: PropTypes.shape({
		markdownRemark: PropTypes.shape({
			frontmatter: PropTypes.object,
		}),
	}),
};

export default ProductPage;

export const productPageQuery = graphql`
	query ProductPage($id: String!) {
		markdownRemark(id: { eq: $id }) {
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
				main {
					heading
					description
					image1 {
						alt
						image {
							childImageSharp {
								fluid(maxWidth: 526, quality: 92) {
									...GatsbyImageSharpFluid
								}
							}
						}
					}
					image2 {
						alt
						image {
							childImageSharp {
								fluid(maxWidth: 526, quality: 92) {
									...GatsbyImageSharpFluid
								}
							}
						}
					}
					image3 {
						alt
						image {
							childImageSharp {
								fluid(maxWidth: 1075, quality: 72) {
									...GatsbyImageSharpFluid
								}
							}
						}
					}
				}
				testimonials {
					author
					quote
				}
				full_image {
					childImageSharp {
						fluid(maxWidth: 2048, quality: 100) {
							...GatsbyImageSharpFluid
						}
					}
				}
				pricing {
					heading
					description
					plans {
						description
						items
						plan
						price
					}
				}
			}
		}
	}
`;
