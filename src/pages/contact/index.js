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
			<section className="section">
				<div className="container">
					<div className="content">
						<form
							name="contact"
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
							<div className="field mb-4">
								<label
									className="label text-gray-800 mb-2 block"
									htmlFor={"name"}
								>
									Naam
								</label>
								<div className="control">
									<input
										className="input bg-gray-200 rounded w-full px-4 py-2 text-gray-800"
										type={"text"}
										name={"name"}
										onChange={this.handleChange}
										id={"name"}
										required={true}
									/>
								</div>
							</div>
							<div className="field mb-4">
								<label
									className="label text-gray-800 mb-2 block"
									htmlFor={"email"}
								>
									Email
								</label>
								<div className="control">
									<input
										className="input bg-gray-200 rounded w-full px-4 py-2 text-gray-800"
										type={"email"}
										name={"email"}
										onChange={this.handleChange}
										id={"email"}
										required={true}
									/>
								</div>
							</div>
							<div className="field mb-4">
								<label
									className="label text-gray-800 mb-2 block"
									htmlFor={"message"}
								>
									Bericht
								</label>
								<div className="control">
									<textarea
										className="input bg-gray-200 rounded w-full px-4 py-2 text-gray-800"
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
					</div>
				</div>
			</section>
		);
	}
}
