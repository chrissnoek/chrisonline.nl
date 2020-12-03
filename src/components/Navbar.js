import React from "react";
import { Link } from "gatsby";
import { withPrefix } from "gatsby";

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
							navBarActiveClass: "is-active",
					  })
					: this.setState({
							navBarActiveClass: "",
					  });
			}
		);
	};

	render() {
		return (
			<div className="content">
				<nav className="py-8" role="navigation" aria-label="main-navigation">
					<div className="container flex items-center">
						<div className="navbar-brand">
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
							{/* <div
							className={`navbar-burger burger ${this.state.navBarActiveClass}`}
							data-target="navMenu"
							onClick={() => this.toggleHamburger()}
						>
							<span />
							<span />
							<span />
						</div> */}
						</div>
						<div
							id="navMenu"
							className={`ml-auto navbar-menu ${this.state.navBarActiveClass}`}
						>
							<div className="navbar-start has-text-centered">
								<Link className="navbar-item font-bold text-white mr-4 text-lg" to="/">
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
							<Link className="font-bold text-white text-lg mr-4" to="/website-abonnement">
									Website abonnement paketten
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
