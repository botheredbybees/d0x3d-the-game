
var players = [];
// set up the default board: a 6x6 array of 2, 4, 6, 6, 4, 2 cards
// each element of the array has either a -1 (no tile) or a non-negative integer corresponding to the network array index corresponding to that node
// for future versions there may be other layouts
var board = [[-1,-1,0,1,-1,-1],[-1,2,3,4,5,-1],[6,7,8,9,10,11],[12,13,14,15,16,17],[-1,18,19,20,21,-1],[-1,-1,22,23,-1,-1]];
function node(name,image,asset)
{
    // make asset an optional argument as most tiles don't have one on them
    // the next line will set the asset to an empty string if it hasn't been passed in the object constructor function call
    asset = typeof asset !== 'undefined' ? asset : '';
    this.asset=asset;
    this.name=name;
    this.image=image;
    this.compromised=false;
    this.loot=[]; // an array of loot cards dropped on this node (if any)
	this.x=0; // position on the 6x6 board grid 
	this.y=0;
	this.players = []; // array of players occupying this node
}

var network = new Array(new node('Backup File Server', 'node_backup_file_server','intellectual property'),
new node('Certificate Sevices', 'node_cert_sevices','authentication credentials'),
new node('Chat Server', 'node_chat_server'),
new node('Laptop Client', 'node_client_laptop'),
new node('Mobile Client', 'node_client_mobile'),
new node('Tablet Client', 'node_client_tablet'),
new node('Tower Client', 'node_client_tower'),
new node('Customer Database', 'node_customer_db','financial data'),
new node('Firewall', 'node_firewall'),
new node('IMAP Server', 'node_imap_server','personally identifiable information'),
new node('Intrusion Detection System', 'node_intrusion_sys'),
new node('NAT Device', 'node_nat_device'),
new node('Network File Server', 'node_network_file_server','intellectual property'),
new node('Primary DNS', 'node_primary_dns'),
new node('Sales Database', 'node_sales_db','financial data'),
new node('Secondary DNS', 'node_secondary_dns'),
new node('SMTP Server', 'node_smtp_server','personally identifiable information'),
new node('SSO Service', 'node_sso_service','authentication credentials'),
new node('VLAN Switch', 'node_vlan_switch'),
new node('VOIP Server', 'node_voip_server'),
new node('VPN Gateway', 'node_vpn_gateway'),
new node('Web Server', 'node_web_server'),
new node('Wireless Router', 'node_wireless_router'),
new node('Internet Gateway', 'node_internet_gateway'));

function shuffle() {
	// shuffle the nodes on the network
	var target, temp;
	for(var i=0; i<network.length; ++i) {
		// for each node, find a random target on the network
		target=Math.floor((Math.random()*network.length));
		// and swap our node with the target node
		temp = network[target];
		network[target] = network[i];
		network[i] = temp;
	}
	// assign grid positions to the now shuffled nodes
	// this information will be used to set and show the move options available on each turn
	network[0].x = 2;
	network[0].y = 0;
	network[1].x = 3;
	network[1].y = 0;
	
	network[2].x = 1;
	network[2].y = 1;
	network[3].x = 2;
	network[3].y = 1;
	network[4].x = 3;
	network[4].y = 1;
	network[5].x = 4;
	network[5].y = 1;
	
	network[6].x = 0;
	network[6].y = 2;
	network[7].x = 1;
	network[7].y = 2;
	network[8].x = 2;
	network[8].y = 2;
	network[9].x = 3;
	network[9].y = 2;
	network[10].x = 4;
	network[10].y = 2;
	network[11].x = 5;
	network[11].y = 2;
	
	network[12].x = 0;
	network[12].y = 3;
	network[13].x = 1;
	network[13].y = 3;
	network[14].x = 2;
	network[14].y = 3;
	network[15].x = 3;
	network[15].y = 3;
	network[16].x = 4;
	network[16].y = 3;
	network[17].x = 5;
	network[17].y = 3;
	
	network[18].x = 1;
	network[18].y = 4;
	network[19].x = 2;
	network[19].y = 4;
	network[20].x = 3;
	network[20].y = 4;
	network[21].x = 4;
	network[21].y = 4;
	
	network[22].x = 2;
	network[22].y = 5;
	network[23].x = 3;
	network[23].y = 5;
	
	// find the player start position in the grid
	for(i=0;i<players.length;++i) {
		for(var j=0; j<network.length;++j) {
			if (network[j].name === players[i].character.startingNode) {
				//console.log('player'+i+' character is at the '+network[j].name);
				players[i].currentNode = j;
				players[i].xpos = network[j].x;
				players[i].ypos = network[j].y;
				network[j].compromised = true;
				$('#icon'+i).attr('src','images/characters/icon_'+players[i].character.filestem+'.png');
				//console.log('player'+i+' filestem is '+players[i].character.filestem);
				$('#icon'+i).attr('alt',players[i].character.name);
				$('#icon'+i).attr('height','50px');
				$('#icon'+i).attr('width','50px');
				//showplayer(i,network[j].x,network[j].y); // no point in doing this here since the initial tile drawing routine kills it
			}
		}
	}
}

function showplayer(playernum,xpos,ypos) {
	// move the player to a new position on the board grid
	var image = $('#icon'+playernum);
	image.remove();
	$("#"+ypos+xpos).append(image);

	// turn off flipping?
	
	// hide all buttons
	$('button').css('display','none');

	// set up buttons for the current tile
	$("#"+ypos+xpos+" button.drop").css('display','block'); // should really check to see if player has any loot to drop first
	$("#"+ypos+xpos+" button.skip").css('display','block');
	// if there's a character here show the 'give' and 'swap' buttons
	// if there's any loot on the tile show the 'pick up' button
	// if tile has an asset and that asset has not already been retrieved show the 'retrieve' button

	// set up buttons for the tile to the north
	$("#"+(ypos-1)+xpos+" button.skip").css('display','block');
	// if compromised show the 'move here' button, otherwise show the 'compromise' button

	// set up buttons for the tile to the south
	$("#"+(ypos+1)+xpos+" button.skip").css('display','block');

	// set up buttons for the tile to the east
	$("#"+ypos+(xpos-1)+" button.skip").css('display','block');

	// set up buttons for the tile to the west
	$("#"+ypos+(xpos+1)+" button.skip").css('display','block');

	// set up any other tiles for the current character type (eg show 'move' and 'skip' on any compromised tiles for the social engineer)
}

function resizeTiles() {
	$( '.tile' ).each(function( ) {
		$( this ).css('height',$(this).css('width'));
	});
}

function character(name,description,start,filestem) {
	this.name = name;
	this.description = description;
	this.startingNode = start;
	this.filestem = filestem;

}
// in beta we're only having one player, who will be a social engineer. later we'll add more players and allow for selection of characters from the following list:
var characters = new Array(
new character('social engineer','A master of manipulation, the social engineer attacks the human factor of security. Why pick a lock when they\'ll open the door for anyone dressed like a delivery person? Why crack a login screen, when the dumpster may have crumpled-up passwords in it? Humans are part of the system, and you know how to hack them to get just about anywhere.','Internet Gateway','social_engineer'),
new character('war driver','You use wireless to your advantage, gaining access from remote places. War driving is the act of methodically probing for wireless access points left unsecured, and you\'ve mapped out the whole city. Did you know that, from your favorite coffeeshop, a radio antenna at just the right angle gets you access to a network left  exposed on the top floor of the neighboring skyscraper? You do your mobile magic, long distance.','Wireless Router','war_driver'),
new character('the insider','If you want to beat \'em, then join \'em! The malicious insider tears it apart from the inside, taking advantage of free access to the surrounding machines. Welcome to the company! The server room is down the hall.','VPN Gateway','insider'),
new character('botmaster','As a botmaster, you control hundreds - no, thousands - of machines all over the world, and you know how to use them all to dish it out, at scale. Your "zombies" share files, fire out spam, and launch denial of service attacks... all controlled by you.','Laptop Client','botmaster'),
new character('cryptanalyst','Crypto is hard to get right. You\'ve picked a much easier game: recognizing when it\'s done wrong. Weak keys, unsafe primes, corrupt certificate authorities: an expert of finesse, the cryptanalyst is adept at tackling hard problems from a slightly different angle.','VLAN Switch','cryptanalyst'),
new character('malware writer','When it comes to viruses, trojan horses, and worms you\'re the best of the best. An artist, a maestro, a poet ... that is, if poems could stop a car or explode a pacemaker. Like a nasty cold, your malware spreads quickly across the network.','Primary DNS','malware_writer')
);

// for now player1 (our only player for the beta) is a social engineer
var player1 = {character: characters[0], name: '', currentNode: 0, xpos: 0, ypos: 0};
// set up dummy variables for the other 3 players
//var player2 = {character: characters[1]; name: ''; currentNode: 0};
//var player3 = {character: characters[2]; name: ''; currentNode: 0};
//var player4 = {character: characters[3]; name: ''; currentNode: 0};
players = [player1]; // only one player for now
//var players = [player1, player2, player3, player4];

$( document ).ready(function() {
	shuffle();
    // display the tiles
    for(var i=0;i<network.length;++i) {
		if (network[i].compromised === true) {
			$('#tile'+(i+1)).find('img').attr('src','images/tiles/'+network[i].image+'_compromised.png');
			//$("#"+network[i].x+network[i].y).css('background-image', 'url(images/tiles/'+network[i].image+'_compromised.png');
		} else {
			$('#tile'+(i+1)).find('img').attr('src','images/tiles/'+network[i].image+'.png');
			//$("#"+network[i].x+network[i].y).css('background-image', 'url(images/tiles/'+network[i].image+'.png');
		}
        $('#tile'+(i+1)).find('img').attr('alt',network[i].name);
    }
	// show the player icons
	for(i=0;i<players.length;++i) {
		showplayer(i,players[i].xpos,players[i].ypos);	
	}
	// resize tiles for current window
	resizeTiles();
	// resize tiles if window is resized
	$( window ).resize(function() {
		resizeTiles();
	});
	// center the menus for each tile
	$('.btn-group-vertical').css({
        'position' : 'absolute',
        'left' : '50%',
        'top' : '50%'
    });
	
	// tile flipping code
    if ($('html').hasClass('csstransforms3d')) {
        $('.tile').removeClass('scroll').addClass('flip');
        $('.tile.flip').hover(
            function () {
                $(this).find('.tile-wrapper').addClass('flipIt');
            },
            function () {
                $(this).find('.tile-wrapper').delay(100).removeClass('flipIt');
            }
        );
    } else { // run this if the browser can't do css transformations
        $('.tile').hover(
            function () {
                $(this).find('.tile-detail').stop().animate({bottom:0}, 500, 'easeOutCubic');
            },
            function () {
                $(this).find('.tile-detail').stop().delay(100).animate({bottom: ($(this).height() * -1) }, 500, 'easeOutCubic');
            }
        );
    }
	// end tile flipping code
});
