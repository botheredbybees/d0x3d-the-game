function node(name,image,asset)
{
    // make asset an optional argument as most tiles don't have one on them
    // the next line will set the asset to an empty string if it hasn't been passed in the object constructor function call
    asset = typeof asset !== 'undefined' ? asset : '';
    this.name=name;
    this.image=image;
    this.compromised=false;
    this.loot=[];
    this.asset=asset;
}

var network = new Array(new node('Backup File Server', 'node_backup_file_server'),
new node('Certificate Sevices', 'node_cert_sevices'),
new node('Chat Server', 'node_chat_server'),
new node('Laptop Client', 'node_client_laptop'),
new node('Mobile Client', 'node_client_mobile'),
new node('Tablet Client', 'node_client_tablet'),
new node('Tower Client', 'node_client_tower'),
new node('Customer Database', 'node_customer_db'),
new node('Firewall', 'node_firewall'),
new node('IMAP Server', 'node_imap_server'),
new node('Intrusion Detection System', 'node_intrusion_sys'),
new node('NAT Device', 'node_nat_device'),
new node('Network File Server', 'node_network_file_server'),
new node('Primary DNS', 'node_primary_dns'),
new node('Sales Database', 'node_sales_db'),
new node('Secondary DNS', 'node_secondary_dns'),
new node('SMTP Server', 'node_smtp_server'),
new node('SSO Service', 'node_sso_service'),
new node('VLAN Switch', 'node_vlan_switch'),
new node('VOIP Server', 'node_voip_server'),
new node('VPN Gateway', 'node_vpn_gateway'),
new node('Web Server', 'node_web_server'),
new node('Wireless Router', 'node_wireless_router'),
new node('Internet Gateway', 'node_internet_gateway'));

$( document ).ready(function() {
    // load up the tiles
    for(var i=0;i<network.length;++i) {
        $('#tile'+(i+1)).find('img').attr('src','images/tiles/'+network[i].image+'.png');
        $('#tile'+(i+1)).find('img').attr('alt',network[i].name);
    }
    if ($('html').hasClass('csstransforms3d')) {          
        $('.thumb').removeClass('scroll').addClass('flip');     
        $('.thumb.flip').hover(
            function () {
                $(this).find('.thumb-wrapper').addClass('flipIt');
            },
            function () {
                $(this).find('.thumb-wrapper').removeClass('flipIt');           
            }
        );        
    } else {
        $('.thumb').hover(
            function () {
                $(this).find('.thumb-detail').stop().animate({bottom:0}, 500, 'easeOutCubic');
            },
            function () {
                $(this).find('.thumb-detail').stop().animate({bottom: ($(this).height() * -1) }, 500, 'easeOutCubic');          
            }
        );
    }
});
