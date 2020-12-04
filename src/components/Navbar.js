import React from "react";
import { Link } from "gatsby";
import { withPrefix } from "gatsby";
import { GiHamburgerMenu } from "react-icons/gi";

const Navbar = class extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			active: false,
			navBarActiveClass: "",
		};
	}

	toggleHamburger = () => {
		// toggle the active boolean in the state
		this.setState(
			{
				active: !this.state.active,
			},
			// after state has been updated,
			() => {
				// set the class in state for the navbar accordingly
				this.state.active
					? this.setState({
							navBarActiveClass: "block",
					  })
					: this.setState({
							navBarActiveClass: "hidden",
					  });
			}
		);
	};

	render() {
		return (
			<div className="content">
				<nav className="py-8" role="navigation" aria-label="main-navigation">
					<div className="container block sm:flex items-center">
						<div className="navbar-brand flex items-center sm:block">
							<Link to="/" className="navbar-item" title="Logo">
								<h1 className="text-white text-2xl font-bold">
									<img
										src={`${withPrefix("/")}img/logo.png`}
										alt="Chris Online Logo"
										className="w-56"
									/>
								</h1>
							</Link>
							{/* Hamburger menu */}
							<div
								className={`navbar-burger burger block ml-auto sm:hidden`}
								data-target="navMenu"
								onClick={() => this.toggleHamburger()}
							>
								<GiHamburgerMenu />
							</div>
						</div>
						<div
							id="navMenu"
							className={`ml-auto navbar-menu ${
								this.state.active ? "block" : "hidden"
							} sm:block`}
						>
							<div className="navbar-start has-text-centered mt-6 sm:flex items-center">
								<Link
									className="navbar-item font-bold text-white mr-4 text-lg w-full block py-2"
									to="/"
								>
									Home
								</Link>
								{/* <Link className="navbar-item" to="/diensten">
								Diensten
							</Link>
							<Link className="navbar-item" to="/algemene-voorwaarden">
								Algemene voorwaarden
							</Link>
							<Link className="navbar-item" to="/contact">
								Contact
							</Link> */}
								{/* <Link className="navbar-item" to="/contact/examples">
									Form Examples
							</Link>  */}
								<Link
									className="font-bold text-white text-lg mr-4 w-full block py-2"
									to="/website-abonnement"
								>
									Website&nbsp;abonnementen
								</Link>
							</div>
							{/* <div className="navbar-end has-text-centered">
							<a
								className="navbar-item"
								href="https://github.com/netlify-templates/gatsby-starter-netlify-cms"
								target="_blank"
								rel="noopener noreferrer"
							>
								<span className="icon">
									<img src={github} alt="Github" />
								</span>
							</a>
						</div> */}
						</div>
					</div>
				</nav>
			</div>
		);
	}
};

export default Navbar;
