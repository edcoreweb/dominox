Vue.component('player-hand', {
    props: ['pieces', 'active', 'onDragStart', 'onDragStop'],

    template: require('./../../templates/game/player-hand.html'),

    data() {
        return { selected: null };
    },

    created() {


    },

    ready() {
        $('.player-hand-inner').jCarouselLite({
            btnNext: '.prev',
            btnPrev: '.next',
            visible: 3,
            circular: false,
            speed: 150,
            scroll: 3
        });

        this.draggable();

        this.$watch('pieces', () => {
            setTimeout(() => this.draggable(), 100);
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
            // TODO
            try {
                $('.player-piece').draggable('destroy');
            } catch (e) {
                //
            }

            $('.player-piece').draggable({
                cursor: 'move',
                helper: 'clone',
                revert: 'invalid',
                revertDuration: 300,
                scroll: false,
                zIndex: 999,
                containment: 'document',
                appendTo: '.game-board',

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
