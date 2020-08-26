import '../style';
import { h, Component, createRef } from 'preact';
import { GetClickableLink, Base64NewTab } from '../util/common';

export default class Result extends Component {
    imgRef = createRef();

    componentDidMount() {
        if (this.imgRef.current) this.imgRef.current.addEventListener("click", () => Base64NewTab(this.props.imgURL));
    }

    getURLComponent = (urls) => {
        if (!urls) {
            return <span class="loading">Loading...</span>;
        } else if (urls.length > 0) {
            return (
                <ul>
                    {urls.map((url, i) => {
                        return <li key={i}>
                            <a class="result-url" href={GetClickableLink(url)} target="_blank">{url}</a>
                        </li>;
                    })}
                </ul>)
        } else {
            return <span class="no-url">No valid URLs were found in the viewport.</span>;
        }
    }

    render({ imgURL, urls, error }) {
        return (
            <div class="result">
                <img class="screenshot" ref={this.imgRef} src={imgURL} />
                {error ? <span class="error">Error, please try again.</span> : this.getURLComponent(urls)}
            </div>
        )
    }
}
