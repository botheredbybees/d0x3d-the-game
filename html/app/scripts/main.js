/////////////////////////////////////////////////////////////////////////////////////////////////////
// 
//  I've split this file up into the following sections to make it a bit easier to find the bits I'm interested in...
// DATA STRUCTURES - definitions of the various objects, arrays and global variables used by the game
// PLAY - the routines used during game play
// SETUP - initialisation routines run when the game starts
//
/////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
// 
// DATA STRUCTURES - definitions of the various objects, arrays and global variables used by the game
//
/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////


var BACKGROUND_COLOUR = '#FFA500';
var currentplayer = 0; // currently active player
var players = [];
var infoconLevel = 2;
var patchcount = 0;
// set up the default board: a 6x6 array of 2, 4, 6, 6, 4, 2 cards
// each element of the array has either a -1 (no tile) or a non-negative integer corresponding to the network array index corresponding to that node
// TODO for future versions there create other layouts, assign these for different difficulty levels, or as a progression when more than one game is played
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
    this.lo0t=[]; // an array of loot cards dropped on this node (if any)
  this.x=0; // position on the 6x6 board grid 
  this.y=0;
  this.players = []; // array of players occupying this node
}

var network = new Array(new node('Backup File Server', 'node_backup_file_server','intellectual property'),
new node('Certificate Sevices', 'node_cert_services','authentication credentials'),
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

var patchCards = network.slice(0); // get a copy of the nework array for patching
var patchDiscards = [];

var lo0t = new Array('detection_honeypot_audit',
'detection_net_anomaly',
'detection_virus_sig',
'exploit_buffer_overflow',
'exploit_format_string_vuln',
'exploit_integer_overflow',
'exploit_logic_bomb',
'exploit_trojan_horse',
'shares_auth',
'shares_auth',
'shares_auth',
'shares_auth',
'shares_auth',
'shares_financial',
'shares_financial',
'shares_financial',
'shares_financial',
'shares_financial',
'shares_ip',
'shares_ip',
'shares_ip',
'shares_ip',
'shares_ip',
'shares_pii',
'shares_pii',
'shares_pii',
'shares_pii',
'shares_pii');

var lo0tDiscards = [];

function character(name,description,start,filestem) {
    this.name = name;
    this.description = description;
    this.startingNode = start;
    this.filestem = filestem;

}

var characters = new Array(
new character('social engineer','A master of manipulation, the social engineer attacks the human factor of security. Why pick a lock when they\'ll open the door for anyone dressed like a delivery person? Why crack a login screen, when the dumpster may have crumpled-up passwords in it? Humans are part of the system, and you know how to hack them to get just about anywhere.','Internet Gateway','social_engineer'),
new character('war driver','You use wireless to your advantage, gaining access from remote places. War driving is the act of methodically probing for wireless access points left unsecured, and you\'ve mapped out the whole city. Did you know that, from your favorite coffeeshop, a radio antenna at just the right angle gets you access to a network left  exposed on the top floor of the neighboring skyscraper? You do your mobile magic, long distance.','Wireless Router','war_driver'),
new character('the insider','If you want to beat \'em, then join \'em! The malicious insider tears it apart from the inside, taking advantage of free access to the surrounding machines. Welcome to the company! The server room is down the hall.','VPN Gateway','insider'),
new character('botmaster','As a botmaster, you control hundreds - no, thousands - of machines all over the world, and you know how to use them all to dish it out, at scale. Your "zombies" share files, fire out spam, and launch denial of service attacks... all controlled by you.','Laptop Client','botmaster'),
new character('cryptanalyst','Crypto is hard to get right. You\'ve picked a much easier game: recognizing when it\'s done wrong. Weak keys, unsafe primes, corrupt certificate authorities: an expert of finesse, the cryptanalyst is adept at tackling hard problems from a slightly different angle.','VLAN Switch','cryptanalyst'),
new character('malware writer','When it comes to viruses, trojan horses, and worms you\'re the best of the best. An artist, a maestro, a poet ... that is, if poems could stop a car or explode a pacemaker. Like a nasty cold, your malware spreads quickly across the network.','Primary DNS','malware_writer')
);

// TODO allow players to choose a character (in harder modes, randomly assign a character type?)
// in beta we're only having one player, who will be a social engineer. later we'll add more players and allow for selection of characters from the following list:
var player1 = {character: characters[0], name: '', currentNode: 0, xpos: 0, ypos: 0, movenum: 0, lo0t: []};
//var player2 = {character: characters[1]; name: '', currentNode: 0, xpos: 0, ypos: 0, movenum: 0, lo0t: []};
//var player3 = {character: characters[2]; name: '', currentNode: 0, xpos: 0, ypos: 0, movenum: 0, lo0t: []};
//var player4 = {character: characters[3]; name: '', currentNode: 0, xpos: 0, ypos: 0, movenum: 0, lo0t: []};

players = [player1]; // only one player for now
// TODO code for more than one player 1) using the same comptuer 2) using networked play
//if you wanted 4 players you would create: var players = [player1, player2, player3, player4];




/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
// 
// PLAY - the routines used during game play
//
/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
function hidemodals() {
  // hide all the modals
  $('#dropLo0t').modal('hide');
  $('#lo0t').modal('hide');
  $('#pickupLo0t').modal('hide');
  $('#assetRecovered').modal('hide');
  $('#patchPhase').modal('hide');
  $('#discardLo0t').modal('hide');
  //$('#').modal('hide');
}
function showpatch() {
  $('#goPatch').hide();
  $('#patchComments').html('');
  hidemodals();
  $('#patchPhase').modal('show');
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
// 
// PLAY Phase I : Action
//
/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
function incrementMove() {
  // player has clicked on the 'skip' button
  players[currentplayer].movenum += 1;
  if (players[currentplayer].movenum > 3) {
    // move on to the lo0t distribution phase of play
    getLoot();
  }
  $('.movenum').text(players[currentplayer].movenum);
}
function decrementMove() {
  // cancel this move
  players[currentplayer].movenum -= 1;
  $('.movenum').text(players[currentplayer].movenum);
}
function activateTile(id) {
  // enable the slide up menu for a tile
  // TODO check that this node has not been removed from the game
  $('#'+id).parent().hover(
    function () {
      $(this).find('.tile-detail').stop().animate({bottom:0}, 500, 'easeOutCubic');
    },
    function () {
      $(this).find('.tile-detail').stop().delay(100).animate({bottom: ($(this).height() * -1) }, 500, 'easeOutCubic');
    }
  );
}
function showTakeOrMove(x,y) {
  // look for a tile at the x,y grid position
  // if compromised show the 'move here' button, otherwise show the 'compromise' button
  // add the relevant action to the button
    if (x>5 || y>5 || x<0 || y<0) {
      // we're off the grid, don't bother trying
      return;
    }
  var nodeNum = board[y][x];
  if (nodeNum >= 0) { // there is a tile here
    //console.log('north nodeNum: '+nodeNum+' name: '+network[nodeNum].name);
    // turn off any click events which might already exist
    if(network[nodeNum].compromised === true) {
      $('#'+y+x+' button.move').css('display','block');
        // hide the 'compromise' button (in case we just compromised it during the last move)
        $('#'+y+x+' button.compromise').css('display','none');
        $('#'+y+x+' button.move').unbind('click');
        $('#'+y+x+' button.move').click(function() {
            movePlayer(x,y);
        });
    } else {
      $('#'+y+x+' button.compromise').css('display','block');
      $('#'+y+x+' button.move').css('display','none');
      $('#'+y+x+' button.compromise').unbind('click');
      $('#'+y+x+' button.compromise').click(function() {
          compromise(nodeNum,x,y);
      });
    }
    // show that this is a possible target
    $('#'+y+x).css('background-color',BACKGROUND_COLOUR);
    // turn on the slide up menu
    activateTile(y.toString()+x.toString());
  }
}

function countPlayerAssets(assets,assetType) {
  var count = 0;
  for(var i = 0; i < assets.length; ++i){
    if(assets[i] == assetType) {
      count++;
    }
  }
  return count;
}
/////////////////////////////////////////////////////////////////////////////////////////////////////
// 
// PLAY Phase I (Action) - drop loot on a node
//
function showLootOnNode(targetnode) {
  // this function is called after dropping and picking up loot
  // clear current images
  var col1 = $('#tile'+network[targetnode].y+network[targetnode].x).find('.tilecards1');
  col1.html('');  
  var col2 = $('#tile'+network[targetnode].y+network[targetnode].x).find('.tilecards2');
  col2.html('');
  // show the current crop
  for(var j=0;j<network[targetnode].lo0t.length;++j) {
    //console.log('j: '+j+' network[targetnode].lo0t[j]: '+network[targetnode].lo0t[j]);
    if (j<4) {
      col1.html(col1.html() + '<img src="images/lo0t/lo0t.'+network[targetnode].lo0t[j]+'.png" class="img-responsive" alt="'+network[targetnode].lo0t[j]+'">');
    } else {
      col2.html(col2.html() + '<img src="images/lo0t/lo0t.'+network[targetnode].lo0t[j]+'.png" class="img-responsive" alt="'+network[targetnode].lo0t[j]+'">');
    }
  }
  // and update the current player hand on the main screen
  $('[id^=p'+(currentplayer+1)+'loot]').html('');
  players[currentplayer].lo0t.sort();
  var lo0t = players[currentplayer].lo0t;
  for(j=0;j<lo0t.length;++j) {
    $('#p'+(currentplayer+1)+'loot'+j).html('<img src="images/lo0t/lo0t.'+lo0t[j]+'.png" class="img-responsive" alt="'+lo0t[j]+'" >');
  }
}
function dropAsset(targetnode, lootnum) {
  // drop this loot card onto the node
  var loot = players[currentplayer].lo0t[lootnum];
  //console.log('loot being dropped: '+loot+' targetnode: '+targetnode);
  network[targetnode].lo0t.push(loot);
  // remove loot from player object
  players[currentplayer].lo0t.splice(lootnum, 1);
  if (players[currentplayer].lo0t.length < 1) {
    // we've got no more loot to drop, so hide the 'drop' menu option
    $('button.drop').css('display','none');
  } 
  // but we do have some loot to pick up
  var id = players[currentplayer].ypos.toString() + players[currentplayer].xpos.toString();  
  $('#'+id+' button.pickup').css('display','block');
  $('#'+id+' button.pickup').unbind('click');
  $('#'+id+' button.pickup').click(function() {
    pickupLoot(players[currentplayer].currentNode);
  });
  // show the loot we just dropped on the node
  showLootOnNode(targetnode);
  $('#lootimg'+lootnum).unbind('click');
  hidemodals();
  incrementMove();
}
function dropLoot(nodenum) {
  // show the dialog box so player can drop some loot on this node
  // clear all existing stuff
  $('[id^=p_loot]').html('');
  $('[id^=p_loot]').unbind('click');
  $('[id^=d_loot]').html('');
  $('[id^=d_loot]').unbind('click');  
  players[currentplayer].lo0t.sort();
  var lo0t = players[currentplayer].lo0t;
  for(var j=0;j<lo0t.length;++j) {
    $('#d_loot'+j).html('<img src="images/lo0t/lo0t.'+lo0t[j]+'.png" id="lootimg'+j+'" data-index="'+j+'" class="img-responsive" alt="'+lo0t[j]+'" onclick="dropAsset('+nodenum+','+j+');">');
  }
  hidemodals();
  $('#dropLo0t').modal('show');
}


/////////////////////////////////////////////////////////////////////////////////////////////////////
// 
// PLAY Phase I (Action) - compromise a node
//
// TODO add info to the node object that tracks how many moves it takes to compromise that node. Add code to track and display the state of a semi-compromised node (one that takes 2 moves to compromise)
function compromise(nodeNum,x,y) {
    // compromise this node
    network[nodeNum].compromised = true;
    $('#tile'+network[nodeNum].y+network[nodeNum].x).find('img').attr('src','images/tiles/'+network[nodeNum].image+'_compromised.png');
    // update the move number
    incrementMove();
    // reset the buttons on this tile
    showTakeOrMove(x,y);
}


/////////////////////////////////////////////////////////////////////////////////////////////////////
// 
// PLAY Phase I (Action) - move player to a new node
//
function movePlayer(x,y) {
  //console.log(players[currentplayer]);
  // move the player to a new tile. 
  // This function is called during game play for the currently active player but the real action happens in showPlayer (which is also called when the board is first set up for each of the player tokens being used)
  // remove the player from the current node
  var tileplayers = network[players[currentplayer].currentNode].players;
  var newlist = [];
  for (var i=0; i< tileplayers.length; ++i) {
    if (tileplayers[i].name != players[currentplayer].name) {
      newlist.push(tileplayers[i]);
    }
    network[players[currentplayer].currentNode].players = newlist.slice(0);
  }
  players[currentplayer].currentNode = board[y][x];
  // add this player to the node for tracking
  network[players[currentplayer].currentNode].players.push(players[currentplayer]);
  players[currentplayer].xpos = x;
  players[currentplayer].ypos = y;
  //console.log(players[currentplayer]);
  showPlayer(currentplayer,x,y);
  incrementMove();
}
function showPlayer(playernum,xpos,ypos) {
  // show the player at a given position on the board grid and set up the current and surrounding tiles ready for action
  var image = $('#icon'+playernum);
  image.remove();
  $('#'+ypos+xpos).append(image);
  
  // hide all buttons
  $('#tiles button').css('display','none');
  // turn the move number display button back on
  $('.btn-info').css('display','block');
  // turn off any background colours (used to show which tiles are possible targets)
  $('.tile-wrapper').css('background-color','none');
  // turn off any hover events
  $('.tile').unbind('mouseenter mouseleave');

  // set up buttons for the current tile
  var id = ypos.toString() + xpos.toString();
  // show the 'drop loot' button if player has any loot to drop 
  if (players[playernum].lo0t.length) { 
    $('#'+id+' button.drop').css('display','block');
    $('#'+id+' button.drop').unbind('click');
    $('#'+id+' button.drop').click(function() {
      dropLoot(players[playernum].currentNode);
    }); 
  }
  // show the 'pickup loot' button if the node has some on it
  if (network[players[playernum].currentNode].lo0t.length) { 
    $('#'+id+' button.pickup').css('display','block');
    $('#'+id+' button.pickup').unbind('click');
    $('#'+id+' button.pickup').click(function() {
      pickupLoot(players[playernum].currentNode);
    }); 
  }

  // if the node has enough asset tokens and that asset has not already been retrieved show the 'retrieve' button
  if (network[players[playernum].currentNode].asset !== '') { 
    // this node has an asset, see if the player has enough loot cards to do an asset recovery
    var lootCount = 0;
    switch(network[players[playernum].currentNode].asset) {
    case 'intellectual property':
      lootCount = countPlayerAssets(players[playernum].lo0t,'shares_ip');
      break;
    case 'authentication credentials':
      lootCount = countPlayerAssets(players[playernum].lo0t,'shares_auth');
      break;
    case 'financial data':
      lootCount = countPlayerAssets(players[playernum].lo0t,'shares_financial');
      break;
    case 'personally identifiable information':
      lootCount = countPlayerAssets(players[playernum].lo0t,'shares_pii');
      break;
    }
    if (lootCount >= 4) {
      $('#'+id+' button.recover').css('display','block');
      $('#'+id+' button.recover').unbind('click');
      $('#'+id+' button.recover').click(function() {
        //console.log('setting up asset recovery for '+network[players[playernum].currentNode].asset);
        recoverAsset(network[players[playernum].currentNode].asset);
      });
    } 
  }

  $('#'+id+' button.skip').css('display','block');
  // show that this is a possible target
  $('#'+id).css('background-color',BACKGROUND_COLOUR);
  // turn on the slide up menu
  activateTile(id);
  // TODO if there's another character here (or if the player is the botmaster) show the 'give' and 'swap' buttons

  // set up buttons for the tile to the north
  if(ypos > 0) {
    $('#'+(ypos-1)+xpos+' button.skip').css('display','block');
    // if compromised show the 'move here' button, otherwise show the 'compromise' button
    showTakeOrMove(xpos,ypos-1);
  }

  if(ypos < 5) {
    // set up buttons for the tile to the south
    $('#'+(ypos+1)+xpos+' button.skip').css('display','block');
    showTakeOrMove(xpos,ypos+1);
  }

  if(xpos > 0) {
    // set up buttons for the tile to the east
    $('#'+ypos+(xpos-1)+' button.skip').css('display','block');
    showTakeOrMove(xpos-1,ypos);
  }

  if(xpos < 5) {
    // set up buttons for the tile to the west
    $('#'+ypos+(xpos+1)+' button.skip').css('display','block');
    showTakeOrMove(xpos+1,ypos);
  }

  // TODO set up any other tiles for the other character types
  switch(players[playernum].character.name) {
  case 'social engineer':
    // as one action, move to any compromised tile
    for(var i=0; i<network.length;++i) {
      if(network[i].compromised === true) {
        ypos = network[i].y;
        xpos = network[i].x;
        if((players[playernum].xpos != xpos) || (players[playernum].ypos != ypos)) {
          // only do this for tiles the player is not currently occupying
          $('#'+ypos+xpos+' button.skip').css('display','block');
          showTakeOrMove(xpos,ypos);
        }
      }
    }
    break;
  case 'war driver':
    // as one action, give or exchange a card to a player anywhere on the network
    break;
  case 'the insider':
    // as one action, compromise two adjacent tiles 
    break;
  case 'botmaster':
    // as one action, give or exhcnge two cards
    break;
  case 'cryptanalyst':
    // as one action, move or compromise diagonally
    break;
  case 'malware writer':
    // as one action, move across two compromised tiles
    break;
  }
}



/////////////////////////////////////////////////////////////////////////////////////////////////////
// 
// PLAY Phase I (Action) - pick a loot card up off the current node
//
function pickupLoot(nodenum) {
  // show the dialog box so player can drop some loot on this node    
  // first clear all existing stuff
  $('[id^=pickupP_loot]').html('');
  $('[id^=node_loot]').html('');
  $('[id^=node_loot]').unbind('click');
  network[nodenum].lo0t.sort();
  var lo0t = network[nodenum].lo0t;
  players[currentplayer].lo0t.sort();
  var playerlo0t = players[currentplayer].lo0t;
  // show this node's loot
  for(var j=0;j<lo0t.length;++j) {
    $('#node_loot'+j).html('<img src="images/lo0t/lo0t.'+lo0t[j]+'.png" id="lootimg'+j+'" data-index="'+j+'" class="img-responsive" alt="'+lo0t[j]+'" onclick="pickupAsset('+nodenum+','+j+');">');
  }
  // and the loot held by the current player
  for(j=0;j<playerlo0t.length;++j) {
    $('#pickupP_loot'+j).html('<img src="images/lo0t/lo0t.'+playerlo0t[j]+'.png" class="img-responsive" alt="'+playerlo0t[j]+'" >');
  }
  hidemodals();
  $('#pickupLo0t').modal('show');
}

function pickupAsset(targetnode, lootnum) {
  // grab this loot card from the node
  var loot = network[targetnode].lo0t[lootnum];
  players[currentplayer].lo0t.push(loot);
  // remove loot from the node
  network[targetnode].lo0t.splice(lootnum, 1);
  if (network[targetnode].lo0t.length < 1) {
    // we've got no more loot to grab, so hide the 'pick up loot' menu option
    $('button.pickup').css('display','none');
  } 
  // show the node with the loot removed
  showLootOnNode(targetnode);
  hidemodals();
  incrementMove();
}


/////////////////////////////////////////////////////////////////////////////////////////////////////
// 
// PLAY Phase I (Action) - recover a digital asset from the current node
//
function recoverAsset(asset) {
  var newImg = '';
  var newTitle = '';
  var lootCount;
  var assetID;
  switch(asset) {
  case 'intellectual property':
    assetID = 'shares_ip';
    newImg = 'images/stickers/sticker_ip.png';
    newTitle="<h2>[intellectual property] Recovered!</h2> <p>Intellectual property is data that came out of your head or your hands, like inventions and creative works: an essay for school, an original photo, a piece of software, a secret recipe, your band’s demo tracks, your YouTube videos, etc.</p>";
    break;
  case  'authentication credentials':
    assetID = 'shares_auth';
    newImg = 'images/stickers/sticker_auth.png';
    newTitle="<h2>[authentication credentials] Recovered!</h2> <p>Authentication credentials are data you use to prove your identity. They can be something you have (like a driver’s license), something you know (like a password), or something you are (like a fingerprint). When stolen, someone could use these credentials to impersonate you.</p>";
    break;
  case  'financial data':
    assetID = 'shares_financial';
    newImg = 'images/stickers/sticker_financial.png';
    newTitle="<h2>[financial data] Recovered!</h2> <p>If it’s worth money or about money, it's financial data: credit card numbers, bank account numbers, tax data, electronic gift certificates, e-cash, quarterly earnings reports, etc.</p>";
    break;
  case  'personally identifiable information':
    assetID = 'shares_pii';
    newImg = 'images/stickers/sticker_pii.png';
    newTitle="<h2>[personally identifiable information] Recovered!</h2> <p>Personally identifiable information is data, about you or someone else: your home phone number, your address, photos of you and your friends, your grades, your medical records, etc.</p>";
    break;
  }
  //console.log('getting asset: '+asset+" assetID: "+assetID);
  $('#'+assetID).attr('src',newImg);
  $('#'+assetID).attr('data-original-title', newTitle).tooltip('fixTitle');
  $('#recoveredAsset').text(asset);
  $('#assetRecoveredImg').attr('src',newImg);
  $('#assetRecoveredImg').attr('alt',asset);
  $('#assetRecovered').modal('show');
  // remove the 4 loot cards from the player's hand
  var removed = 0;
  for (var j=0; j<players[currentplayer].lo0t.length;++j) {
    if (players[currentplayer].lo0t[j] == assetID && removed < 4) {
      lo0tDiscards.push(assetID);
      players[currentplayer].lo0t.splice(j, 1);
      ++removed;
      --j; // since we removed one element of the array we need to start from one element back
    }
  }
  // update the screen lo0t display
  showPlayerLoot();
  incrementMove();

  // TODO add code to show the 'retrieve loot' option after picking up a loot card (i.e. if the play hasn't moved, but has picked up a card)

  // TODO add some more code to give feedback on the assetRecovered modal about how many more assets need to be recovered (or if all have been recovered, that the player(s) need to go to the internet gateway to win)

}

/////////////////////////////////////////////////////////////////////////////////////////////////////
// 
// PLAY Phase I (Action) - give a loot card to another player on the current node
//
// Note: the botmaster may give two cards as one action.
// Note: the wardriver may give a card to any other player no matter where they are located.



/////////////////////////////////////////////////////////////////////////////////////////////////////
// 
// PLAY Phase I (Action) - exchange a loot card with another player on the current node
//
// Note: the botmaster may exchange two cards as one action.
// Note: the wardriver may exchange a card with any other player no matter where they are located.

// TODO write routines for the above actions.  

/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
// 
// PLAY Phase II -  get 2 new lo0t cards
//
/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

function grabLoot(wherefrom) {
  // called when a loot card back is clicked on in the 'get loot' phase of play
  // TODO add code to check for sufficient loot cards in the lo0t array, if not restock from the discard array and shuffle
  var loot = lo0t.pop();
  var newlootpos = players[currentplayer].lo0t.length;
  if(loot.substring(0, 9) !== 'detection') {
    // got a good card
    $(wherefrom).attr('src','images/lo0t/lo0t.'+loot+'.png').fadeOut(1000);
    // show in the modal display of player loot cards
    $('#p_loot'+newlootpos).html('<img src="images/lo0t/lo0t.'+loot+'.png" class="img-responsive" alt="'+loot+'">').fadeIn(1000);
    players[currentplayer].lo0t.push(loot);
    showPlayerLoot();
    // turn on the 'drop loot' option (in case it was turned off through the player dropping everything they owned in a previous move)
    var id = players[currentplayer].ypos.toString() + players[currentplayer].xpos.toString();
    $('#'+id+' button.drop').css('display','block');
    $('#'+id+' button.drop').unbind('click');
    $('#'+id+' button.drop').click(function() {
      dropLoot(board[players[currentplayer].ypos][players[currentplayer].xpos]);
    }); 
  } else {
    // intrusion detected!
    // TODO add code for handling the various detection cards
      $(wherefrom).attr('src','images/lo0t/lo0t.'+loot+'.png').fadeOut(1000);
  }
  players[currentplayer].movenum += 1;
  if (players[currentplayer].movenum === 2) {
    // we've got our 2 loot cards
    players[currentplayer].movenum = 1;
    $('#infoconlevel').text(infoconLevel);
    for (var i=0; i<infoconLevel; ++i) {
      $('#networkNode'+i).html('<img src="images/backs/back_patch.png" id="nodeToPatch'+i+'" data-index="'+i+'" class="img-responsive" alt="patch '+i+'">'); 
    }
    patchcount = 0;
    $('#goPatch').show();
    // TODO check to see if we need to display the 'retrieve' button
  }
}
function showPlayerLoot() {
  players[currentplayer].lo0t.sort();
  var lo0t = players[currentplayer].lo0t;
  $('[id^=p'+(currentplayer+1)+'loot]').html('');  
  for(var j=0;j<lo0t.length;++j) {
    // on the modal
    $('#p_loot'+j).html('<img src="images/lo0t/lo0t.'+lo0t[j]+'.png" id="lootimg'+j+'" data-index="'+j+'" class="img-responsive" alt="'+lo0t[j]+'">');
    // on the main screen
    $('#p'+(currentplayer+1)+'loot'+(j)).html('<img src="images/lo0t/lo0t.'+lo0t[j]+'.png" id="lootimg'+j+'" class="img-responsive" alt="'+lo0t[j]+'">');
  }
}
function getLoot() {
  players[currentplayer].movenum = 0;
  // hide the loot modal (in case we're being called from a drop loot move)
  hidemodals();
  // get some new loot
  showPlayerLoot();
  // show the new loot cards
  $('#newloot1, #newloot2').attr('src','images/backs/back_lo0t.png').show();
  $('#newLoot').show();
  $('#goPatch').hide();
  // show the loot modal
  $('#lo0t').modal('show');
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
// 
// PLAY Phase III -  patch
//
/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
function patch(wherefrom) {
  // called when a patch card back is clicked on in the 'patch' phase of play
  // TODO add code to check for sufficient node cards in the patch array, if not restock from the patchDiscards array and shuffle
  
  var patchnode = patchCards.pop();
  var patchcomment = '';
  $(wherefrom).attr('src','images/tiles/'+patchnode.image+'.png').fadeIn(1000);
  // find the matching network node
  for (var i =0; i<network.length;++i) {
    if(network[i].name == patchnode.name) {
      // we have a match
      patchcount += 1;
      if (network[i].lo0t.length>0){
        // remove lo0t cards from the target node
        patchcomment += '<br>Removed '+network[i].lo0t.length+' digital asset tokens';
        for(var j=0; j<network[i].lo0t.length; ++j) {
          lo0tDiscards.push(network[i].lo0t[j]);
        }
        network[i].lo0t = [];
      }
      if (network[i].compromised) {
        if (network[i].players.length>0) {
          // TODO check where players on the node can move - if they cannot the game has been lost (show loosing modal with a 'replay' option).
          // if they can, restrict the next move to a 'move' only
          // decommission the node
          // TODO check that this is not the internet gateway (if it is, the game has been lost)
          patchcomment += '<br><span class="red">Intrusion detected!</span> Taking '+patchnode.name+' offline for forensic analysis';
          network.splice(i, 1);
          $('#tile'+network[i].y+network[i].x).find('.nodeimg').hide();
          $('#'+network[i].y+network[i].x+' button').css('display','none');
          // TODO reset menus on surrounding tiles if needed
          //showPlayer(playernum,xpos,ypos);
          // TODO set players[playernum].currentNode to -1
        } else {
          // no players on the node, reset to uncompromised
          patchcomment += '<br>Restoring node to an uncompromised state';
          $('#tile'+network[i].y+network[i].x).find('.nodeimg').attr('src','images/tiles/'+network[i].image+'.png');
          network[i].compromised = false;
          $('#'+network[i].y+network[i].x+' button.move').css('display','none');
          // TODO change the menu options so players cannot move here but can re-compromise the node
          //showPlayer(playernum,xpos,ypos);
        }
      }
      if (patchcomment == '') {
        patchcomment = '<br>Nothing found';
      }
      $('#patchComments').html($('#patchComments').html()+'<br><strong>Patching '+patchnode.name+'</strong>'+patchcomment);
      // TODO add patchcard to discard pile if the node was not removed
    }
  }
  if(infoconLevel == patchcount) {
    // we've finished patching
    $('#goCheck').show();
  }
 
}


/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
// 
// PLAY Phase IV -  check - remove current player's lo0t cards until they only hold 5
//
/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
function check() {
  $('#goCheck').hide();
  if(players[currentplayer].lo0t.length > 5) {
    hidemodals();
    $('#discardLo0t').modal('show');
    // TODO create routines for discarding extra lo0t
    showExtraLoot();
  } else {
    // move on to the next round. Get the player's next move
    hidemodals();
  }
}
function showExtraLoot() {
  players[currentplayer].lo0t.sort();
  var lo0t = players[currentplayer].lo0t;
  var instructions;
  if (lo0t.length > 6) {
    instructions = 'Click on '+(lo0t.length-5)+' cards to discard them';
  } else { // we only have one extra card
    instructions = 'Click on a lo0t card to discard it';
  }
  $('#lootCount').text(instructions);
  $('[id^=p'+(currentplayer+1)+'loot]').html('');  
  for(var j=0;j<lo0t.length;++j) {
    // on the modal
    $('#discard_loot'+j).html('<img src="images/lo0t/lo0t.'+lo0t[j]+'.png" id="playerlootimg'+j+'" class="img-responsive" onclick="discard(\''+lo0t[j]+'\',\'#playerlootimg'+j+'\');" alt="'+lo0t[j]+'">');
  }
}
function discard(lootname,from) {
  $(from).fadeOut(1000);
  var found = false;
  for(var i=0; i<players[currentplayer].lo0t.length;++i) {
    if(players[currentplayer].lo0t[i] == lootname && found==false){
      players[currentplayer].lo0t.splice(i, 1);
      found = true;
    }
  }
  // update the current player hand on the main screen
  $('[id^=p'+(currentplayer+1)+'loot]').html('');
  players[currentplayer].lo0t.sort();
  var lo0t = players[currentplayer].lo0t;
  for(j=0;j<lo0t.length;++j) {
    $('#p'+(currentplayer+1)+'loot'+j).html('<img src="images/lo0t/lo0t.'+lo0t[j]+'.png" class="img-responsive" alt="'+lo0t[j]+'" >');
  }
  // update screen feedback  
  var instructions;
  if (lo0t.length > 6) {
    instructions = 'Click on '+(lo0t.length-5)+' cards to discard them';
  } else { // we only have one extra card
    instructions = 'Click on a lo0t card to discard it';
  }
  $('#lootCount').text(instructions);
  if (players[currentplayer].lo0t.length <= 5) {
    // move on to the next round. Get the player's next move
    hidemodals();
  }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
// 
// SETUP - initialisation routines. These run just before the game starts
//
/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////



function shuffle(cards) {
  // shuffle the elements in the array
  var target, temp;
  for(var i=0; i<cards.length; ++i) {
    // for each card, find a random target in the array
    target=Math.floor((Math.random()*cards.length));
    // and swap our card with the target card
    temp = cards[target];
    cards[target] = cards[i];
    cards[i] = temp;
  }
}
function setup() {
  // shuffle the loot
  shuffle(lo0t);

  // shuffle the patch cards
  shuffle(patchCards);
    
  // shuffle the nodes on the network
  shuffle(network);
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
  
  
  for(var i=0;i<players.length;++i) {
    // give each player 2 lo0t cards
    // we need to find the first 2 'good' cards, ignoring any detection cards
    for (var j=0;j<lo0t.length && players[i].lo0t.length < 2;++j) {
      if(lo0t[j].substring(0, 9) !== 'detection') {
        // got a good card
        var x = lo0t.splice(j, 1);
        players[i].lo0t.push(x[0]);
      }
    }
    // find the player start position in the grid
    for(j=0; j<network.length;++j) {
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
      }
    }
  }
}


function resizeTiles() {
  var tileheight;
    $( '.tile' ).each(function( ) {
        $( this ).css('height',$(this).css('width'));
        tileheight = parseInt($(this).css('height'));
    });
    // reposition the dropped loot divs    
    $( '.tilecards1, .tilecards2' ).each(function( ) {
  //console.log('setting tilecards top to '+(15-tileheight));
        $( this ).css('top',(15-tileheight)+"px");
    });
}

$( document ).ready(function() {
    setup();
    // display the tiles
    for(var i=0;i<network.length;++i) {
        if (network[i].compromised === true) {
            $('#tile'+network[i].y+network[i].x).find('.nodeimg').attr('src','images/tiles/'+network[i].image+'_compromised.png');
        } else {
            $('#tile'+network[i].y+network[i].x).find('.nodeimg').attr('src','images/tiles/'+network[i].image+'.png');
        }
        $('#tile'+network[i].y+network[i].x).find('.nodeimg').attr('alt',network[i].name);
    }
    // show the player icons and their lo0t
    for(i=players.length-1;i>=0;--i) { // show the first player last, so that the menus are all set up for them correctly
      showPlayer(i,players[i].xpos,players[i].ypos);
      var lo0t = players[i].lo0t;
      for(var j=0;j<lo0t.length;++j) {
        $('#p'+(i+1)+'loot'+j).html('<img src="images/lo0t/lo0t.'+lo0t[j]+'.png" class="img-responsive" alt="'+lo0t[j]+'">');
      }
    }
    // turn on tooltips
    $('.asset').tooltip();
    // resize tiles for current window
    resizeTiles();
    // resize tiles if window is resized
    $( window ).resize(function() {
        resizeTiles();
    });
    // centre the menus for each tile
    $('.btn-group-vertical').css({
        'position' : 'absolute',
        'left' : '25%',
        'top' : '20%'
    });
  // set the background color on the flip side (this is a bit lazy, and should by rights have happened in the css file, but I'm still experimenting with colours and know I'll forget to come back and fix this :-)
  $('.tile-detail').css('background-color',BACKGROUND_COLOUR);

  // set up the loot cards for clicking    
  $('#newloot1').click(function() {
    grabLoot('#newloot1');
  });
  $('#newloot2').click(function() {
    grabLoot('#newloot2');
  });

  // set up the patch cards on the goPatch modal for clicking
  $('#networkNode0').click(function() {
    patch('#nodeToPatch0');
  });
  $('#networkNode1').click(function() {
    patch('#nodeToPatch1');
  });
  $('#networkNode2').click(function() {
    patch('#nodeToPatch2');
  });
  $('#networkNode3').click(function() {
    patch('#nodeToPatch3');
  });
  $('#networkNode4').click(function() {
    patch('#nodeToPatch4');
  });
  $('#goCheck').hide();
  // start the player off on the first move
  incrementMove();
});

