import React from "react";
import { navigate } from "gatsby-link";
import Layout from "../../components/Layout";

function encode(data) {
	return Object.keys(data)
		.map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
		.join("&");
}

export default class Index extends React.Component {
	constructor(props) {
		super(props);
		this.state = { isValidated: false };
	}

	handleChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	};

	handleSubmit = (e) => {
		e.preventDefault();
		const form = e.target;
		fetch("/", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: encode({
				"form-name": form.getAttribute("name"),
				...this.state,
			}),
		})
			.then(() => navigate(form.getAttribute("action")))
			.catch((error) => alert(error));
	};

	render() {
		return (
			<Layout>
				<section className="section">
					<div className="container mx-auto">
						<div className="content">
							<h1 className="text-2xl sm:text-5xl font-bold text-white mb-2">
								Website abonnement: Basic
							</h1>
							<div className="block sm:flex">
								<form
									name="basic"
									className="w-full mr-12 mb-6 sm:mb-0"
									method="post"
									action="/contact/thanks/"
									data-netlify="true"
									data-netlify-honeypot="bot-field"
									onSubmit={this.handleSubmit}
								>
									{/* The `form-name` hidden field is required to support form submissions without JavaScript */}
									<input type="hidden" name="form-name" value="contact" />
									<div hidden>
										<label>
											Don’t fill this out:{" "}
											<input name="bot-field" onChange={this.handleChange} />
										</label>
									</div>
									<div className="flex">
										<div className="field mb-4 w-full mr-4">
											<label
												className="label text-white mb-2 block"
												htmlFor={"name"}
											>
												Naam
											</label>
											<div className="control">
												<input
													className="input bg-gray-200 rounded w-full px-4 py-2 text-black"
													type={"text"}
													name={"name"}
													onChange={this.handleChange}
													id={"name"}
													required={true}
												/>
											</div>
										</div>
										<div className="field mb-4 w-full">
											<label
												className="label text-white mb-2 block"
												htmlFor={"company"}
											>
												Bedrijfsnaam
											</label>
											<div className="control">
												<input
													className="input bg-gray-200 rounded w-full px-4 py-2 text-black"
													type={"text"}
													name={"company"}
													onChange={this.handleChange}
													id={"company"}
													required={true}
												/>
											</div>
										</div>
									</div>
									<div className="flex">
										<div className="field mb-4 w-full mr-4">
											<label
												className="label text-white mb-2 block"
												htmlFor={"email"}
											>
												Email
											</label>
											<div className="control">
												<input
													className="input bg-gray-200 rounded w-full px-4 py-2 text-black"
													type={"email"}
													name={"email"}
													onChange={this.handleChange}
													id={"email"}
													required={true}
												/>
											</div>
										</div>
										<div className="field mb-4 w-full">
											<label
												className="label text-white mb-2 block"
												htmlFor={"phone"}
											>
												Telefoon
											</label>
											<div className="control">
												<input
													className="input bg-gray-200 rounded w-full px-4 py-2 text-black"
													type={"phone"}
													name={"phone"}
													onChange={this.handleChange}
													id={"phone"}
													required={true}
												/>
											</div>
										</div>
									</div>
									<div className="field mb-4">
										<label
											className="label text-white mb-2 block"
											htmlFor={"message"}
										>
											Huidige website url
										</label>
										<div className="control">
											<input
												className="input bg-gray-200 rounded w-full px-4 py-2 text-black"
												type={"text"}
												name={"website"}
												onChange={this.handleChange}
												id={"website"}
											/>
										</div>
									</div>
									<div className="field mb-4">
										<label
											className="label text-white mb-2 block"
											htmlFor={"message"}
										>
											Wat zijn de knelpunten waar je nu tegenaan loopt?
										</label>
										<div className="control">
											<textarea
												className="input bg-gray-200 rounded w-full px-4 py-2 text-black"
												name={"message"}
												onChange={this.handleChange}
												id={"message"}
												required={true}
											/>
										</div>
									</div>
									<div className="field">
										<button
											className="gradient text-white rounded w-full py-4"
											type="submit"
										>
											Verzenden
										</button>
									</div>
								</form>
								<div className="bg-white py-6 px-6 rounded shadow-lg">
									<p className="text-black font-bold text-2xl mb-4">
										Wat gebeurt er na je aanvraag?
									</p>
									<p className="text-black mb-2">
										<span className="font-bold text-chris-dark">
											1. Video call:{" "}
										</span>
										Ik neem zo spoedig mogelijk contact met je op om een
										vrijblijvende videocall in te plannen. We bespreken alle
										wensen en eisen en maken we een plan van aanpak.
									</p>
									<p className="text-black mb-2">
										<span className="font-bold text-chris-dark">
											2. Ontwerp proces:{" "}
										</span>
										Ik bestudeer je merk, richtlijnen en specificaties, zodat we
										een site kunnen ontwerpen die past bij je merk en
										productbehoeften.
									</p>
									<p className="text-black mb-2">
										<span className="font-bold text-chris-dark">
											3. Feedback rondes:{" "}
										</span>
										Om jouw visie en merk zo goed mogelijk te kunnen vertalen is
										er genoeg ruimte voor feedback rondes. Ik ga door totdat jij
										tevreden bent!
									</p>
									<p className="text-black mb-2">
										<span className="font-bold text-chris-dark">
											4. Development:{" "}
										</span>
										Wanneer het ontwerp goedgekeurd is ga ik aan de slag met de
										ontwikkeling van de website, zodat deze razendsnel en
										volgens de richtlijnen van Google gebouwd wordt.
									</p>
									<p className="text-black mb-2">
										<span className="font-bold text-chris-dark">
											5. Livegang:{" "}
										</span>
										Wanneer de nieuwe website helemaal af is zetten we deze
										live, en kunnen we starten met het verzamelen van data om de
										website later te verbeteren.
									</p>
									<p className="text-black mb-2">
										<span className="font-bold text-chris-dark">
											6. Doorontwikkelen:{" "}
										</span>
										Een goede website is nooit af. Heb je nieuwe ideeen die je
										graag wilt uitproberen? Stuur een berichtje en ik ga aan de
										slag. 'Gewoon, doen!'. Ook wanneer je na een tijdje een hele
										nieuwe website wilt!
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>
			</Layout>
		);
	}
}
