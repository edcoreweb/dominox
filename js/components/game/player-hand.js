Vue.component('player-hand', {
    props: ['pieces', 'onDragStart', 'onDragStop', 'disable'],

    template: require('./../../templates/game/player-hand.html'),

    data() {
        return { selected: null };
    },

    ready() {
        this.draggable();

        this.$watch('pieces', () => {
            this.draggable();
        });
    },

    methods: {
        /**
         * Select piece.
         *
         * @param  {Piece} piece
         */
        select(piece) {
            this.selected = piece;
        },

        /**
         * Make pieces draggable.
         */
        draggable() {
            try {
                $('.player-piece').draggable('destroy');
            } catch (e) {
                //
            }

            $('.player-piece:not(.piece-disabled)').draggable({
                cursor: 'move',
                helper: 'clone',
                revert: 'invalid',
                revertDuration: 300,
                containment: 'document',

                start: (e, ui) => {
                    $(e.target).addClass('player-piece-drag');
                    ui.helper.selectedPiece = this.selected;
                    this.onDragStart(this.selected);
                },

                stop: (e) => {
                    $(e.target).removeClass('player-piece-drag');
                    this.onDragStop();
                }
            });
        }
    }
});
