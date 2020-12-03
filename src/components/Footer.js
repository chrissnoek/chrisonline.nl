import React from "react";
import {  Link } from 'gatsby'
import { withPrefix } from "gatsby";
import {  FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = class extends React.Component {
	render() {
		return (
			<footer className="bg-chris-black">
				<div className="container mx-auto py-12 flex items-center">
				<div className="text-center">
					<img
						src={`${withPrefix("/")}img/logo.png`}
						alt="Kaldi"
						style={{ width: '14em', height: 'auto' }}
					/> 
				</div>
				<div className="ml-auto">
					<div className="container ">
						<div style={{ maxWidth: "100vw" }} className="flex">
							<div className="column is-4">
								<section className="menu">
									<ul className="menu-list flex">
										<li className="mr-4">
											<Link to="/" className="navbar-item">
												Home
											</Link>
										</li>
										<li className="mr-4">
											<Link className="navbar-item" to="/website-abonnement">
												Website abonnementen
											</Link>
										</li>
										<li className="mr-4">
											<Link className="navbar-item" to="/#contact">
												Contact
											</Link>
										</li>
									</ul>
								</section>
							</div>
							<div className="mr-2">
								<a className="text-white flex items-center hover:underline" href="https://www.instagram.com/chrisonline.nl" target="_blank" rel="noreferrer">Tips op instagram: <FaInstagram className="text-2xl ml-2" /></a>
							</div>
							<div className="mr-2">
								<a className="text-white flex items-center hover:underline" href="https://www.linkedin.com/in/chrissnoek/" target="_blank" rel="noreferrer">Connect op Linkedin: <FaLinkedin  className="text-2xl ml-2" /></a>
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
