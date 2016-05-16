import swal from 'sweetalert';

module.exports = {
    template: require('./../../templates/game/join.html'),

    data() {
        return {
            game: null,
            _$inviteModal: null,
            friends: []
        };
    },

    ready() {
        let hash = this.$route.params.hash;

        // Listen for users joining the game.
        socket.on('game.joined', (response) => {
            this.game.users.push(response.data);
            this.game.joined += 1;

            if (this.isFull()) {
                this.redirect(hash);
            }
        });

        // Listen for users leaving the game.
        socket.on('game.left', (response) => {
            let user = _.findWhere(this.game.users, {id: response.data.id});
            this.game.users.$remove(user);
            this.game.joined -= 1;
        });

        this.join();

        this.initInviteModal();
    },

    methods: {
        /**
         * Join the game.
         */
        join() {
            let hash = this.$route.params.hash;

            socket.send('game.join', {hash: hash})
                .then((response) => {
                    this.game = response.data;

                    if (this.isFull()) {
                        this.redirect(hash);
                    }
                })
                .catch(this.onError);
        },

        /**
         * Handle join game error.
         */
        onError(response) {
            let title = 'Opps!';
            let text = response.status == 422 ? response.data : 'Something went wrong. Please try again.';

            if (response.status == 404) {
                title = 'Error 404';
                text = 'The game could not be found!';
            }

            swal({
                type: 'error',
                title: title,
                text: text,
                confirmButtonText: 'Ok'
            }, () => {
                this.$router.go({name: 'game.browse'});
            });
        },

        /**
         * Determinte if the game is full.
         *
         * @return {Boolean}
         */
        isFull() {
            return this.game.joined == this.game.players;
        },

        /**
         * Redirect to play.
         */
        redirect(hash) {
            this.$router.go({name: 'game.play', params: {hash: hash}});
        },

        /**
         * Leave the game.
         */
        leave() {
            swal({
                type: 'warning',
                title: 'Are you sure?',
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: 'Yes, I\'m sure!'
            }, () => {
                socket.send('game.leave', {hash: this.$route.params.hash})
                    .then(() => this.$router.go({name: 'game.browse'}))
                    .catch(() => swal('Opps!', 'Something went wrong. Please try again.', 'error'));
            });
        },

        /**
         * Show invite friends modal.
         */
        invite() {
            this._$inviteModal.modal('show');
        },

        /**
         * Invite friend.
         * @param {Object} user
         */
        inviteFriend(user) {
            socket.send('game.invite', {user_id: user.id})
                .then((response) => {
                    console.log(response);
                });
        },

        /**
         * Initialize modal events.
         */
        initInviteModal() {
            this._$inviteModal = $('#invite-friends-modal');

            this._$inviteModal.on('show.bs.modal', () => {

            })
            .on('hidden.bs.modal', () => {

            });

            // Fetch friends.
            socket.send('user.friends')
                .then((response) => {
                    this.friends = response.data;
                });
        }
    }
};
