import './common/dependencies.js'
import './../../bower_components/jquery.shapeshift/core/jquery.shapeshift.js'

$(".board-game").shapeshift({
    minColumns: 100,
    cutoffStart: 3,
    cutoffEnd: 3,
    dragWhitelist: ".active"
});
