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
	this.x; // position on the 6x6 board grid 
	this.y;
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
	// this information will be used to set the move options available for each node on each turn, depending on where the player is
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
			if (network[j].name == players[i].character.startingNode) {
				//console.log('player'+i+' character is at the '+network[j].name);
				players[i].currentNode = j;
				network[j].compromised = true;
			}
		}
	}	
}

function resizeTiles() {
	$( '.tile' ).each(function( index ) {
	  $( this ).css('height',$(this).css('width'));
	});
}

function character(name,description,start) {
	this.name = name;
	this.description = description;
	this.startingNode = start;
}
// in beta we're only having one player, who will be a social engineer. later we'll add more players and allow for selection of characters from the following list:
var characters = new Array(
new character('social engineer','A master of manipulation, the social engineer attacks the human factor of security. Why pick a lock when they\'ll open the door for anyone dressed like a delivery person? Why crack a login screen, when the dumpster may have crumpled-up passwords in it? Humans are part of the system, and you know how to hack them to get just about anywhere.','Internet Gateway'),
new character('war driver','You use wireless to your advantage, gaining access from remote places. War driving is the act of methodically probing for wireless access points left unsecured, and you\'ve mapped out the whole city. Did you know that, from your favorite coffeeshop, a radio antenna at just the right angle gets you access to a network left  exposed on the top floor of the neighboring skyscraper? You do your mobile magic, long distance.','Wireless Router'),
new character('the insider','If you want tobeat \'em, then join \'em! The malicious insider tears it apart from the inside, taking advantage of free access to the surrounding machines. Welcome to the company! The server room is down the hall.','VPN Gateway'),
new character('botmaster','As a botmaster, you control hundreds - no, thousands - of machines all over the world, and you know how to use them all to dish it out, at scale. Your "zombies" share files, fire out spam, and launch denial of service attacks... all controlled by you.','Laptop Client'),
new character('cryptanalyst','Crypto is hard to get right. You\'ve picked a much easier game: recognizing when it\'s done wrong. Weak keys, unsafe primes, corrupt certificate authorities: an expert of finesse, the cryptanalyst is adept at tackling hard problems from a slightly different angle.','VLAN Switch'),
new character('malware writer','When it comes to viruses, trojan horses, and worms you\'re the best of the best. An artist, a maestro, a poet ... that is, if poems could stop a car or explode a pacemaker. Like a nasty cold, your malware spreads quickly across the network.','Primary DNS')
);

// for now player1 (our only player for the beta) is a social engineer
var player1 = {character: characters[0], name: '', currentNode: 0};
// set up dummy variables for the other 3 players
//var player2 = {character: characters[1]; name: ''; currentNode: 0};
//var player3 = {character: characters[2]; name: ''; currentNode: 0};
//var player4 = {character: characters[3]; name: ''; currentNode: 0};
var players = [player1]; // only one player for now
//var players = [player1, player2, player3, player4];

$( document ).ready(function() {
	shuffle();
    // display the tiles
    for(var i=0;i<network.length;++i) {
		if (network[i].compromised == true) {
			$('#tile'+(i+1)).find('img').attr('src','images/tiles/'+network[i].image+'_compromised.png');
		} else {
			$('#tile'+(i+1)).find('img').attr('src','images/tiles/'+network[i].image+'.png');
		}
        $('#tile'+(i+1)).find('img').attr('alt',network[i].name);
    }
	
	// resize tiles for current window
	resizeTiles();
	// resize tiles if window is resized
	$( window ).resize(function() {
	  resizeTiles();
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
