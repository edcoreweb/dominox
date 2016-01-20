module.exports = {
    props: ['user'],

    template: require('./../../templates/user/settings.html'),

    data() {
        return {
            form: new Form({
                name: null,
                email: null
            })
        };
    },

    ready() {
        $('#user-settings-modal').on('show.bs.modal', () => {
            this.form.name = this.user.name;
            this.form.email = this.user.email;
        })
        .on('hidden.bs.modal', () => {
            this.form.clear();
        });
    },

    methods: {
        save() {
            this.form.patch('me');
        }
    }
};
