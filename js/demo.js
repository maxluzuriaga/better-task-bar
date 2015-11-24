var statusBar = ReactDOM.render(React.createElement(BetterTaskBar, { tasks: [] }), document.getElementById('react-container'));

function SimpleTask(number) {
    this.duration = (Math.floor(Math.random() * 6) + 1) * 1000;
    this.startTime = new Date().getTime();
    this.name = "Task " + number;

    this.start = function () {
        // Do some task-y stuff!
    };

    this.getStatus = function () {
        var time = new Date().getTime();

        if (time > this.startTime + this.duration) {
            return Math.random() < .7 ? "done" : "error";
        } else {
            return (time - this.startTime) / this.duration * 100;
        }
    };
}

var counter = 1;
setInterval(function () {
    var t = new SimpleTask(counter);
    counter++;

    statusBar.addTask(t);
}, 2000);