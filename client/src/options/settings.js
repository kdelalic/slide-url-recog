import { h, Component, createRef } from 'preact';

export default class Settings extends Component {

    clearHistoryButtonRef = createRef();

    componentDidMount() {
        if (this.clearHistoryButtonRef.current) this.clearHistoryButtonRef.current.addEventListener("click", () => this.clearHistoryClick());
    }

    clearHistoryClick() {
        if (confirm("Permanently delete all history?")) localStorage.clear();
    }

    render() {
        return (
            <div class="settings">
                <div class="settings-button">
                    <a class="button" id="clear" ref={this.clearHistoryButtonRef}>
                        Clear History
                    </a>
                    <span>
                        Permanently deletes all history.
                    </span>
                </div>
            </div>
        )
    }
}
