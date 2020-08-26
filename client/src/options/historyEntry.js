import '../style';
import { h, Component, createRef } from 'preact';
import { GetClickableLink, Base64NewTab } from '../util/common';

export default class HistoryEntry extends Component {
    imgRef = createRef();

    componentDidMount() {
        if (this.imgRef.current) this.imgRef.current.addEventListener("click", () => Base64NewTab(this.props.imgURL));
    }

    getURLComponent = (urls) => {
        if (urls && urls.length > 0) {
            return (
                <ul>
                    {urls.map((url, i) => {
                        return <li key={i}>
                            <a class="result-url" href={GetClickableLink(url)} target="_blank">{url}</a>
                        </li>;
                    })}
                </ul>)
        } else {
            return <span>No valid URLs were found in the viewport.</span>;
        }
    }

    formatDate = (timestamp) => {
        const date = new Date(parseInt(timestamp, 10));
        return date.toLocaleString();
    }

    render({ timestamp, imgURL, urls }) {
        return (
            <div class="history-entry">
                <span class="timestamp">{this.formatDate(timestamp)}</span>
                <img class="screenshot" ref={this.imgRef} src={imgURL} />
                {this.getURLComponent(urls)}
            </div>
        )
    }
}
