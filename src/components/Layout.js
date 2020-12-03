import React from "react";
import { Helmet } from "react-helmet";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "./all.scss";
import useSiteMetadata from "./SiteMetadata";
import { withPrefix } from "gatsby";

const TemplateWrapper = ({ children }) => {
	const { title, description } = useSiteMetadata();
	return (
		<div>
			<Helmet>
				<html lang="en" />
				<title>{title}</title>
				<meta name="description" content={description} />

				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href={`${withPrefix("/")}img/apple-touch-icon.png`}
				/>
				<link
					rel="icon"
					type="image/png"
					href={`${withPrefix("/")}img/favicon-32x32.png`}
					sizes="32x32"
				/>
				<link
					rel="icon"
					type="image/png"
					href={`${withPrefix("/")}img/favicon-16x16.png`}
					sizes="16x16"
				/>

				<link
					rel="mask-icon"
					href={`${withPrefix("/")}img/safari-pinned-tab.svg`}
					color="#ff4400"
				/>
				<meta name="theme-color" content="#fff" />

				<meta property="og:type" content="business.business" />
				<meta property="og:title" content={title} />
				<meta property="og:url" content="/" />
				<meta
					property="og:image"
					content={`${withPrefix("/")}img/og-image.jpg`}
				/>
			</Helmet>

			{/* <aside class="top-0 left-0 w-full z-10 flex justify-center items-center p-3 bg-blue-500 text-white font-bold">
				<div class="text-2xl">&zwj;<span role="img" aria-label="rocket">🚀️</span>&zwj;&nbsp;</div>
				<p>
					Beschikbaar voor nieuwe projecten. Aarzel niet om{" "}
					<a className="underline" onClick={onLinkClick} href="#contact">
						contact
					</a>{" "}
					op te nemen!
				</p>
			</aside> */}
			
			<div className=" bg-chris-black text-white">
				<div className="">
					<Navbar />
					{children}
					<Footer />
				</div>
			</div>
		</div>
	);
};

export default TemplateWrapper;
