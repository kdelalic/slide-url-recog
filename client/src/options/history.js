import { h, Fragment, Component } from 'preact';
import HistoryEntry from "./historyEntry";

export default class History extends Component {

    componentDidMount() {
        const historyStr = localStorage.getItem("screenshot_history");
        const history = historyStr ? JSON.parse(historyStr) : {};
        this.setState({ history });
    }

    render(_, { history }) {
        return (
            <>
                {
                    history && history.length > 0 ?
                        history.map((_, i) => {
                            const { imgURL, urls, timestamp } = history[history.length - i - 1];
                            return <HistoryEntry key={i} timestamp={timestamp} imgURL={imgURL} urls={urls} />
                        }) : <span class="no-history">No history to display!</span>
                }
            </>
        )
    }
}
