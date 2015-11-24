var BTBTaskRow = React.createClass({
    render: function() {
        return (
            <li className="row">
                <p className="col-xs-2">{this.props.name}</p>
                <div className="col-xs-10">
                    <div className="progress">
                        <div className={this.props.rowClassName} role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style={{width: this.props.done ? "100%" : (this.props.percent + "%")}}>
                            <span className="sr-only">{this.props.percent}% Complete</span>
                        </div>
                    </div>
                </div>
            </li>
        );
    }
});

var BTBTaskList = React.createClass({
    render: function() {
        return (
            <ul className="btb-task-list">
                {
                    this.props.tasks.map(function(task) {
                        return (
                            <BTBTaskRow done={task.done} name={task.name} rowClassName={task.className} percent={task.percent} key={task.name} />
                        );
                    })
                }
            </ul>
        )
    }
});

var BetterTaskBar = React.createClass({
    componentDidMount: function() {
        // var self = this;
        self._timer = setInterval(this.pollStatuses, 50);
    },
    componentWillUnmount: function() {
        if (this._timer) {
            clearInterval(this._timer);
            this._timer = null;
        }
    },
    pollStatuses: function() {
        var time = new Date().getTime();
        var statuses = this.state.statuses.filter(function(s) {
            return (s.done && s.end >= (time - 3000));
        });

        var tasks = this.state.tasks;
        for (var i=0; i < tasks.length; i++) {
            var task = tasks[i];

            var s = task.getStatus();
            var toStore = {};
            if (s == "done" || s == "error") {
                toStore.done = true;
                toStore.status = s;
                toStore.end = time;
                tasks.splice(i, 1);
                i--;
            } else {
                toStore.done = false;
                toStore.percent = s;
            }

            toStore.className = "progress-bar";

            if (toStore.done) {
                if (s == "done") {
                    toStore.className += " progress-bar-success"
                } else {
                    toStore.className += " progress-bar-danger"
                }
            } else {
                toStore.className += " progress-bar-striped active";
            }

            toStore.name = task.name;
            statuses.push(toStore);
        }

        this.setState({statuses: statuses, tasks: tasks});
    },
    addTask: function(task, l) {
        var tasks = this.state.tasks;
        task.start();
        tasks.push(task);
        this.setState({ statuses: this.state.statuses, tasks: tasks });
    },
    getInitialState: function() {
        return { tasks: [], statuses: [] };
    },
    render: function () {
        return (
            <div className="btb-task-bar">
                <BTBTaskList tasks={this.state.statuses} />
            </div>);
    }
});