import generate from 'project-name-generator';

module.exports = {
    template: require('./../../templates/game/create.html'),

    data() {
        return {
            form: new Form({
                name: null,
                players: 2,
                matches: 1,
                points: 100
            }),
            _$modal: null
        };
    },

    ready() {
        this.initModal();
    },

    methods: {
        create() {
            this.form.send('game.create')
                .then((response) => {
                    this._$modal.modal('hide');
                    this.$router.go({'name': 'game.join', params: {hash: response.data.hash}});
                });
        },

        /**
         * Initialize modal events.
         */
        initModal() {
            this._$modal = $('#create-game-modal');

            this._$modal.on('show.bs.modal', () => {
                this.form.name = generate().dashed;
                this.form.players = 2;
                this.form.matches = 1;
                this.form.points = 100;
            })
            .on('hidden.bs.modal', () => {
                this.form.clear();
            });
        }
    }
};
