var game = {
    exitGame: false,

    currentColors: [],

    viewModel: {},

    LifeViewModel: function () {
        var self = this;

        self.rows = ko.observableArray();

        self.setAliveStatus = function (cell) {
            cell.isAlive(!cell.isAlive());
            cell.color(Math.floor(Math.random() * 2) == 0 ? "cell red" : "cell blue");
        }
    },

    Row: function () {
        var self = this;

        self.cells = ko.observableArray();
    },

    Cell: function () {
        var self = this;

        self.isAlive = ko.observable(false);
        self.shouldBeAlive = false;
        self.color = ko.observable("cell");
        self.futureColor = "cell";
    },

    initialize: function () {
        game.wireEvents();
        game.setViewModel();
        game.configureState();
    },

    wireEvents: function() {
        $("#runButton").on("click", game.start);
    },

    setViewModel: function () {
        var row,
            cell;

        game.viewModel = new game.LifeViewModel();

        for (var i = 0; i < 10; i++) {
            row = new game.Row();

            for (var j = 0; j < 10; j++) {
                cell = new game.Cell();
                row.cells.push(cell);
            }

            game.viewModel.rows.push(row);
        }

        ko.applyBindings(game.viewModel);
    },

    configureState: function () {
    },

    start: function () {
        game.checkState();
        game.updateBoard();
        setTimeout(game.start, 500);
    },

    checkState: function () {
        $.each(game.viewModel.rows(), function (j) {
            $.each(this.cells(), function (i) {
                var count = game.getNeighborCount(i, j);

                if (!this.isAlive() && count == 3) {
                    this.shouldBeAlive = true;
                    this.futureColor = game.currentColors[Math.floor(Math.random() * 3)];
                }
                else if (this.isAlive() && (count == 2 || count == 3)) {
                    this.shouldBeAlive = true;
                    this.futureColor = this.color();
                }
                else {
                    this.shouldBeAlive = false;
                    this.futureColor = "cell";
                }

                game.currentColors = [];
            });
        });
    },

    updateBoard: function () {
        $.each(game.viewModel.rows(), function () {
            $.each(this.cells(), function () {
                this.isAlive(this.shouldBeAlive);
                this.color(this.futureColor);
            });
        });
    },

    getNeighborCount: function (column, row) {

        var viewRow;
        var viewCell;
        var count = 0;

        for (var i = 0; i < 3; i++) {

            viewRow = game.viewModel.rows()[row - 1 + i];

            if (viewRow) {

                for (var j = 0; j < 3; j++) {

                    viewCell = viewRow.cells()[column - 1 + j];

                    if (viewCell && (i != 1 || j != 1)) {
                        if (viewCell.isAlive()) {
                            game.currentColors.push(viewCell.color());
                            count += 1;
                        }
                    }
                }
            }
        }

        return count;
    }
};

game.initialize();