
(function(window, document, version, callback) {
    var j, d;
    var loaded = false;
    if (!(j = window.jQuery) || version > j.fn.jquery || callback(j, loaded)) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js";
        script.onload = script.onreadystatechange = function() {
            if (!loaded && (!(d = this.readyState) || d == "loaded" || d == "complete")) {
                callback((j = window.jQuery).noConflict(1), loaded = true);
                j(script).remove();
            }
        };
        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script);
    }
})(window, document, "1.3", function($, jquery_loaded) {
    $(function() {
    	if(!window.mdlywidgets) { 
    		window.mdlywidgets = {};
		  	var MW = window.mdlywidgets;
		  	// Add the style tag into the head
	        $('head').append('<link rel="stylesheet" href="http://mdly.co/scripts/medleywidgets.css" type="text/css"/>'); 
		  	// Check width to see if is a mobile device
		  	var pw = $( ".MDLYa1" ).parent().width();
		  	if (pw < 420) {	
		  	} else {
		  			// Go Through Each Medley On The Page
			    	$( ".MDLYa1" ).each(function(i,e) {
			    		var self = e;
			    		// Call Medley API
			    		var id = $(self).attr('data-id');
			    		var mAPI = "http://mdly.co/api/1/m/short_id/" + id
			    		$.getJSON( mAPI, function( m ) {
			    			m = m[0];
			    			console.log("External Medley Loaded: ", m);
			    			// Attach Medley to Global Namespace
			    			if (!MW[m.short_id]) { MW[m.short_id] = m };
			    			// Append Containers
			    			$(self).append('<div class="MDLYa1-title-box"></div>');
			    			$(self).append('<div class="MDLYa1-items-box" data-medleyid="'+m.short_id+'"></div>');
						  	// Size Medley
			    			var rowHeightsObj = {};
						    // Resize Items
						    $.each(m.items, function(index, item) {
						    	console.log(item)
						            // Set Item Dimensions
						            if (item.size_y == 1){ item.width  = 85  };
						            if (item.size_y == 2){ item.width  = 175 };
						            if (item.size_x == 1){ item.height = 85  };
						            if (item.size_x == 2){ item.height = 175 };
						            // Set Item Position
						            if (item.row == 1 ){ item.top  = 5 };
						            if (item.row >  1 ){ item.top  = (item.row * 90) + 5 - 90  };
						            if (item.col == 1) { item.left = 5 };
						            if (item.col >  1 ){ item.left = (item.col * 90) + 5 - 90  };
						            // Keep Row Count for Container Height
						            if(!rowHeightsObj[item.row]) { rowHeightsObj[item.row] = 0 };
						            if( rowHeightsObj[item.row] < item.size_y ) { 
						                rowHeightsObj[item.row] = item.size_y;
						            };
						            // Add Medley Items
								    var image    = '<img src="' + item.images.medium + '" draggable="false" />'
									var itemHtml = "<div class='MDLYa1-item' style='top:"+item.top+"px;left:"+item.left+"px;height:"+item.height+"px;width:"+item.width+"px;' data-itemid='" + item.short_id + "'>" + image + "</div>"
									$(self).find('.MDLYa1-items-box').append(itemHtml)
						    });
						    // Resize Container
						    $.each(rowHeightsObj, function(key, value) {
						          previousRow = rowHeightsObj[key - 1]
						          if (previousRow == 2) {
						            rowHeightsObj[key] = 0
						          }
						    });
						    // Iterate through object and pull values
						    rowHeightsTotal = 0
						    $.each(rowHeightsObj, function(key, value) { 
						          rowHeightsTotal = rowHeightsTotal + value; 
						    });
						    medley.height = rowHeightsTotal * 90 + 8;


						  	// Add Medley Title
						  	$(self).find('.MDLYa1-items-box').append('<div class="MDLYa1-link-box"><h1 class="MDLYa1-home-link" style="text-align:center !important;font-size:14px !important;cursor:pointer !important;color:#999 !important;margin-top:0px!important;text-transform:uppercase !important;letter-spacing:4px !important;">MEDLEY</h1></div>');
							// Setting Height Of Container.  Start by finding the largest row number.  We use this to find total height.
							$(self).addClass('height-outer' + rowHeightsTotal );
							$(self).children('.MDLYa1-items-box').addClass('height' + rowHeightsTotal );
							// Set Title
							$(self).find('.MDLYa1-title-box').append('<h1>' + m.hashtags.join(" ") + '</h1>');
						}); // /getJSON
					}) // /.each for each Medley on the page

					// Set Event Listener for Clicking A Medley Item
		  			$('.MDLYa1').on('click', '.MDLYa1-item', function (e) {
						    var MW = window.mdlywidgets
						    var itemsContainer = $(e.currentTarget).parent()
						    var medleyId = $(itemsContainer).attr('data-medleyid');
						    var itemId   = $(e.currentTarget).attr('data-itemid');
						    // Hide All Items
						    $(itemsContainer).find('.MDLYa1-item').attr('style', 'display: none !important');
						    // Find Item in Global Variable
						    var itemObject = $.grep(MW[medleyId].items, function(m){ return m.id == itemId });
						    // If There Are Duplicate Items In Medley, Grab Just One
						    if (itemObject.length > 0) { itemObject = itemObject[0]}
						    // Build Item Info View Based Off of itemObject
							var closingDiv = '</div>'
							var infoContainer = '<div class="MDLYa1-item-info-container" style="display: block !important;height:250px !important;width:370px !important;text-align: center !important;margin:10px auto 0px auto !important;">'
							var infoLeftContainer = '<div class="MDLYa1-item-info-container-left" style="display: block !important;float:left !important;height:250px !important;width:45% !important;">'
							var infoRightContainer = '<div class="MDLYa1-item-info-container-right" style="display: block !important;float:left !important;height:250px !important;width:55% !important;">'
							var infoImage    = '<img src="' + itemObject.img_small + '" draggable="false" />'
							var infoTitle = '<h2 style="text-align:left !important;font-size:14px !important;line-height: 20px !important;margin:3px 0px 4px 0px !important;font-family: nexa_boldregular, sans-serif !important;text-transform:uppercase !important;color:#333 !important;">' + itemObject.title + '</h2>'
							var infoCategory = '<p style="text-align:left !important;font-size:12px !important;line-height:18px !important;margin:0px !important;font-family: sans-serif !important;color:#555 !important;">Category: ' + itemObject.category + '</p>'
							var infoPrice = '<p style="text-align:left !important;font-size:12px !important;line-height:18px !important;margin:0px !important;font-family: sans-serif !important;color:#555 !important;">Best Price: $' + itemObject.price + '</p>'
							var infoSource   = '<p style="text-align:left !important;font-size:12px !important;line-height:18px !important;margin:0px !important;font-family: sans-serif !important;color:#555 !important;text-transform:capitalize !important;">Best Price Found On: ' + itemObject.source + '</p>'
							var buyButton = '<div class="MDLYa1-buy-button" data-link="' + itemObject.link + '" style="display:block !important;padding: 15px !important;background: #333 !important;cursor:pointer !important;color:#fff !important;font-size:12px !important;letter-spacing: 2px !important;font-weight:normal !important;margin: 10px 0px 5px 0px !important;font-family: nexa_boldregular, sans-serif !important;-webkit-border-radius: 3px !important;border-radius: 3px !important;">VIEW</div>' 
							var backButton = '<div class="MDLYa1-back-button" style="display:block !important;padding: 10px !important;background: #ccc !important;cursor:pointer !important;color:#fff !important;font-size:10px !important;letter-spacing: 2px !important;font-family: nexa_boldregular, sans-serif !important;-webkit-border-radius: 3px !important;border-radius: 3px !important;">BACK</div>' 
							$(itemsContainer).append( infoContainer + infoLeftContainer + infoImage + closingDiv + infoRightContainer + infoTitle + infoCategory + infoPrice + infoSource + buyButton + backButton + closingDiv + closingDiv );
					});
					$('.MDLYa1').on('click', '.MDLYa1-back-button', function (e) {
						var parent = $(e.currentTarget).parent().parent().parent();
						$(parent).find('.MDLYa1-item-info-container').attr('style', 'display: none !important');
						$(parent).find('.MDLYa1-item').attr('style', 'display: block !important');
					});
					$('.MDLYa1').on('click', '.MDLYa1-buy-button', function (e) {
						var medleyId = $(e.currentTarget).parent().parent().parent().attr('data-medleyid')
						var itemObject = window.mdlywidgets[medleyId]
						var itemTag = itemObject.user.affiliate_id
						var itemLink = $(e.currentTarget).attr('data-link') + '%26tag%3D' + itemTag
						window.open(itemLink, '_blank');
					});
					$('.MDLYa1').on('click', '.MDLYa1-home-link', function (e) {
						window.open('http://mdly.co', '_blank');
					});

	        }; // / Mobile Device Check
		}; // / window.mdlywidgets Check
	}); //jQuery End Document Ready
});