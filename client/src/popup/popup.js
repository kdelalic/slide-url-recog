import { h, Component, createRef } from 'preact';
import axios from 'axios';
import Result from "./result";
import CameraIcon from "../assets/camera-solid.svg";
import HistoryIcon from "../assets/history-solid.svg";

const dataURItoBlob = (dataURI) => {
	// convert base64 to raw binary data held in a string
	// doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
	const byteString = atob(dataURI.split(',')[1]);

	// separate out the mime component
	const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

	// write the bytes of the string to an ArrayBuffer
	const ab = new ArrayBuffer(byteString.length);

	// create a view into the buffer
	const ia = new Uint8Array(ab);

	// set the bytes of the buffer to the correct values
	for (var i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i);
	}

	// write the ArrayBuffer to a blob, and you're done
	const blob = new Blob([ab], { type: mimeString });

	return blob;
}

export default class Popup extends Component {

	state = {
		imgURL: null,
		urls: null,
		error: false
	}

	captureButtonRef = createRef();

	componentDidMount() {
		if (this.captureButtonRef.current) this.captureButtonRef.current.addEventListener("click", () => this.captureClick());
	}

	captureClick = () => {
		if (typeof chrome.tabs !== "undefined") {
			chrome.tabs.captureVisibleTab({ quality: 50 }, (dataURL) => {
				const imageBlob = dataURItoBlob(dataURL);
				const formData = new FormData();
				formData.append('file', imageBlob, "image");

				const timestamp = + new Date();
				const imgURL = dataURL;

				this.setState({
					imgURL,
					urls: null,
					error: false
				});

				axios.post('http://165.22.239.68:8080/ocr', formData)
					.then((response) => {
						const urls = response.data;

						this.setState({
							urls
						});

						const historyStr = localStorage.getItem("screenshot_history");
						const history = historyStr ? JSON.parse(historyStr) : [];

						history.push({
							timestamp,
							imgURL,
							urls
						})

						localStorage.setItem("screenshot_history", JSON.stringify(history));
					}).catch((error) => {
						console.log(error);
						this.setState({error: true});
					});
			});
		}
	};

	render(_, { imgURL, urls, error }) {
		return (
			<div id="app">
				<div class="buttons">
					<a class="button" id="capture" ref={this.captureButtonRef}>
						<img class="button-icon" src={CameraIcon} /> Capture
					</a>
					<a class="button" id="history" href="options.html#/history" target="_blank">
						<img class="button-icon" src={HistoryIcon} /> History
					</a>
				</div>
				{imgURL ? <Result imgURL={imgURL} urls={urls} error={error} /> : ''}
			</div>
		);
	}
}
