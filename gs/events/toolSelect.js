"use strict";

( function() {

var ax, ay, atrackId, axem,
	clicked,
	dragging,
	selectionId = 0,
	elRect = wisdom.cE( "<div id='squareSelection'>" )[ 0 ];

ui.tool.select = {
	mousedown: function( e, sample ) {
		clicked = true;
		ax = e.pageX;
		ay = e.pageY;
		if ( !e.shiftKey ) {
			gs.samplesUnselect();
		}
		if ( sample ) {
			gs.sampleSelect( sample, !sample.selected );
		}
	},
	mouseup: function() {
		clicked = dragging = false;
		ui.css( elRect, "width", "0px" );
		ui.css( elRect, "height", "0px" );
		elRect.remove();
	},
	mousemove: function( e ) {
		if ( clicked ) {
			var btrackId, bxem,
				px = e.pageX,
				py = e.pageY;

			if ( !dragging && Math.max( Math.abs( px - ax ), Math.abs( py - ay ) ) > 5 ) {
				++selectionId;
				dragging = true;
				atrackId = ui.getTrackFromPageY( ay ).id;
				axem = ui.getGridXem( ax );
				ui.elTrackLines.appendChild( elRect );
			}

			if ( dragging ) {
				btrackId = ui.getTrackFromPageY( py );
				btrackId = btrackId ? btrackId.id : 0;
				bxem = Math.max( 0, ui.getGridXem( px ) );
				var trackMin = Math.min( atrackId, btrackId ),
					trackMax = Math.max( atrackId, btrackId ),
					xemMin = Math.min( axem, bxem ),
					xemMax = Math.max( axem, bxem );

				gs.samples.forEach( function( s ) {
					var xemA, xemB, trackId = s.track.id;
					if ( s.wsample ) { // check wsample for empty sample
						if ( trackMin <= trackId && trackId <= trackMax ) {
							xemA = s.xem;
							xemB = xemA + s.wsample.duration * ui.BPMem;
							if ( ( xemMin <= xemA && xemA < xemMax ) ||
								( xemMin < xemB && xemB <= xemMax ) ||
								( xemA <= xemMin && xemMax <= xemB ) )
							{
								if ( !s.selected ) {
									s.squareSelected = selectionId;
									gs.sampleSelect( s, true );
								}
								return;
							}
						}
						if ( s.squareSelected === selectionId ) {
							gs.sampleSelect( s, false );
						}
					}
				});
				ui.css( elRect, "top", trackMin + "em" );
				ui.css( elRect, "left", xemMin + "em" );
				ui.css( elRect, "width", xemMax - xemMin + "em" );
				ui.css( elRect, "height", trackMax - trackMin + 1 + "em" );
			}
		}
	}
};

} )();
