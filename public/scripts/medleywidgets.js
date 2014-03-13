
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
		  	// Add the style tag into the head
	        $('head').append('<link rel="stylesheet" href="http://localhost:3000/scripts/medleywidgets.css" type="text/css"/>'); 
		  	// Check width to see if is a mobile device
		  	var pw = $( ".MDLY" ).parent().width();
		  	if (pw < 420) {	
		  		// Mobile Device
		  	} else {
		  			// Go Through Each Medley On The Page
			    	$( ".MDLY" ).each(function(i,e) {
			    		var self = e;
			    		// Call Medley API
			    		var id = $(self).attr('data-id');
			    		var mAPI = "http://localhost:3000/api/1/m/short_id/" + id
			    		$.getJSON( mAPI, function( m ) {
			    			m = m[0];
			    			console.log("External Medley Loaded: ", m);
			    			// Attach Medley to Global Namespace
			    			if (!window.mdlywidgets[m.short_id]) { window.mdlywidgets[m.short_id] = m };
			    			// Append Title, Append Items Container, Append Medley Brand @ Bottom
			    			$(self).append('<div class="MDLY-title-box"><h1>' + m.hashtags.join(" ") + '</h1></div>');
			    			$(self).append('<div class="MDLY-items-box" data-medleyid="'+m.short_id+'"></div>');
			    			$(self).find('.MDLY-items-box').append('<div class="MDLY-link-box"><h1 class="MDLY-home-link">medley</h1></div>');
						    // Set Medley Item Sizes
						    var rowHeightsObj = {};
						    $.each(m.items, function(index, item) {
						            // Set Item Dimensions
						            if (item.size_y == 1){ item.width  = 60  };
						            if (item.size_y == 2){ item.width  = 125 };
						            if (item.size_x == 1){ item.height = 60  };
						            if (item.size_x == 2){ item.height = 125 };
						            // Set Item Position
						            if (item.row == 1 ){ item.top  = 5 };
						            if (item.row >  1 ){ item.top  = (item.row * 65) - 60  };
						            if (item.col == 1 ){ item.left = 5 };
						            if (item.col >  1 ){ item.left = (item.col * 65) - 60  };
						            // Keep Row Count for Container Height
						            if(!rowHeightsObj[item.row]) { rowHeightsObj[item.row] = 0 };
						            if( rowHeightsObj[item.row] < item.size_y ) {  rowHeightsObj[item.row] = item.size_y }; // Check to see if item takes up two rows
						            // Add Medley Items
								    var image    = '<img src="' + item.images.medium + '" draggable="false" />'
									var itemHtml = "<div class='MDLY-item' style='top:"+item.top+"px;left:"+item.left+"px;height:"+item.height+"px;width:"+item.width+"px;' data-itemid='" + index + "'>" + image + "</div>"
									$(self).find('.MDLY-items-box').append(itemHtml)
						    }); // $.each
						    // Find Items that contain 2 rows / are size_y = 2
						    $.each(rowHeightsObj, function(key, value) {
						            previousRow = rowHeightsObj[key - 1]
						            if (previousRow == 2) {
						            	rowHeightsObj[key] = 0
						            };
						    });
						    // Find total rows
						    rowHeightsTotal = 0;
						    $.each(rowHeightsObj, function(key, value) { 
						            rowHeightsTotal = rowHeightsTotal + value; 
						    });
						    // Resize Container
						    m.height = rowHeightsTotal * 75;
						    $(self).find('.MDLY-items-box').height(m.height);
						}); // /getJSON

					}) // /.each for each Medley on the page

					// Set Event Listener for Clicking A Medley Item
		  			$('.MDLY').on('click', '.MDLY-item', function (e) {
						    var itemsContainer   = $(e.currentTarget).parent();
						    var medleyId         = $(itemsContainer).attr('data-medleyid');
						    var itemId           = $(e.currentTarget).attr('data-itemid');
						    // Hide Individual Items
						    $(itemsContainer).find('.MDLY-item').addClass('MDLY-hide');
						    // Find Item in Global Variable
						    var item = window.mdlywidgets[medleyId].items[itemId]
						    // Build Item Info View Based Off of item
							var closingDiv = '</div>'
							var infoContainer = '<div class="MDLY-item-info-container" style="display: block !important;height:250px !important;width:370px !important;text-align: center !important;margin:10px auto 0px auto !important;">'
							var infoLeftContainer = '<div class="MDLY-item-info-container-left" style="display: block !important;float:left !important;height:250px !important;width:45% !important;">'
							var infoRightContainer = '<div class="MDLY-item-info-container-right" style="display: block !important;float:left !important;height:250px !important;width:55% !important;">'
							var infoImage    = '<img src="' + item.images.medium + '" draggable="false" />'
							var infoTitle = '<h2 style="text-align:left !important;font-size:14px !important;line-height: 20px !important;margin:3px 0px 4px 0px !important;font-family: nexa_boldregular, sans-serif !important;text-transform:uppercase !important;color:#333 !important;">' + item.title + '</h2>'
							var infoCategory = '<p style="text-align:left !important;font-size:12px !important;line-height:18px !important;margin:0px !important;font-family: sans-serif !important;color:#555 !important;">Category: ' + item.category + '</p>'
							var infoPrice = '<p style="text-align:left !important;font-size:12px !important;line-height:18px !important;margin:0px !important;font-family: sans-serif !important;color:#555 !important;">Best Price: $' + item.price_new + '</p>'
							var infoSource   = '<p style="text-align:left !important;font-size:12px !important;line-height:18px !important;margin:0px !important;font-family: sans-serif !important;color:#555 !important;text-transform:capitalize !important;">Best Price Found On: ' + item.retailer + '</p>'
							var buyButton = '<div class="MDLY-buy-button" data-link="' + item.link + '">View</div>' 
							var backButton = '<div class="MDLY-back-button">Back</div>' 
							$(itemsContainer).append( infoContainer + infoLeftContainer + infoImage + closingDiv + infoRightContainer + infoTitle + infoCategory + infoPrice + infoSource + buyButton + backButton + closingDiv + closingDiv );
					});                  
					$('.MDLY').on('click', '.MDLY-back-button', function (e) {
						var parent = $(e.currentTarget).parent().parent().parent();
						console.log( parent );
						$(parent).find('.MDLY-item-info-container').attr('style', 'display: none !important');
						$(parent).find('.MDLY-item').removeClass('MDLY-hide')
					});
					$('.MDLY').on('click', '.MDLY-buy-button', function (e) {
						var medleyId = $(e.currentTarget).parent().parent().parent().attr('data-medleyid')
						var item = window.mdlywidgets[medleyId]
						var itemTag = item.user.affiliate_id
						var itemLink = $(e.currentTarget).attr('data-link') + '%26tag%3D' + itemTag
						window.open(itemLink, '_blank');
					});
					$('.MDLY').on('click', '.MDLY-home-link', function (e) {
						window.open('http://mdly.co', '_blank');
					});

	        }; // / Mobile Device Check
		}; // / window.mdlywidgets Check
	}); //jQuery End Document Ready
});