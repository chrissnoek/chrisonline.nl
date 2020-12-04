import React from "react";
import { Link } from "gatsby";
import { withPrefix } from "gatsby";
import { FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = class extends React.Component {
	render() {
		return (
			<footer className="bg-chris-black">
				<div className="container mx-auto py-12 block sm:flex items-center">
					<div className="text-center mb-4 sm:mb-0">
						<img
							src={`${withPrefix("/")}img/logo.png`}
							alt="Kaldi"
							style={{ width: "14em", height: "auto" }}
						/>
					</div>
					<div className="ml-auto">
						<div className="container ">
							<div style={{ maxWidth: "100vw" }} className="block sm:flex">
								<div className="column is-4">
									<section className="menu">
										<ul className="menu-list block sm:flex">
											<li className="w-full mr-4 mb-2 sm:mb-0">
												<Link to="/" className="navbar-item">
													Home
												</Link>
											</li>
											<li className="w-full mr-4 mb-2 sm:mb-0">
												<Link className="navbar-item" to="/website-abonnement">
													Website abonnementen
												</Link>
											</li>
											<li className="w-full mr-4 mb-2 sm:mb-0">
												KVK: 80020097
											</li>
											<li className="w-full mr-4 mb-2 sm:mb-0">
												BTW: NL003382510B60
											</li>
										</ul>
									</section>
								</div>
								<div className="mr-2">
									<a
										className="text-white flex items-center hover:underline mb-2 sm:mb-0"
										href="https://www.instagram.com/chrisonline.nl"
										target="_blank"
										rel="noreferrer"
									>
										Tips op instagram: <FaInstagram className="text-2xl ml-2" />
									</a>
								</div>
								<div className="mr-2">
									<a
										className="text-white flex items-center hover:underline mb-2 sm:mb-0"
										href="https://www.linkedin.com/in/chrissnoek/"
										target="_blank"
										rel="noreferrer"
									>
										Connect op Linkedin:{" "}
										<FaLinkedin className="text-2xl ml-2" />
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</footer>
		);
	}
};

export default Footer;
