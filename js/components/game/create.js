module.exports = {
    template: require('./../../templates/game/create.html'),

    data() {
        return {
            form: new Form({
                name: null
            })
        };
    },

    ready() {
        $('#create-game-modal').on('hidden.bs.modal', () => {
            this.form.clear();
        });
    },

    methods: {
        create() {
            this.form.post();
        }
    }
};
