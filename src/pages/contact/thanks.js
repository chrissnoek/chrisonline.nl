import React from "react";
import Layout from "../../components/Layout";
import { Link } from "gatsby";

export default () => (
	<Layout>
		<section className="section h-screen">
			<div className="container">
				<div className="content flex justify-center items-center flex-wrap">
					<div>
						<h1 className="text-3xl font-bold">Bedankt voor je bericht.</h1>
						<p>Ik neem zo spoedig mogelijk contact met je op!</p>
						<Link
							to="/"
							className="bg-gradient-to-r from-chris-light to-chris-dark w-full hover:via-chris-light transition duration-500 ease-in-out flex items-center justify-center px-8 py-3 text-base mt-6 leading-4 font-medium rounded-md text-white bg-chris-light hover:bg-teal-200  focus:shadow-outline-teal md:py-4 md:text-lg md:px-10"
						>
							&laquo; Terug naar home
						</Link>
					</div>
				</div>
			</div>
		</section>
	</Layout>
);
