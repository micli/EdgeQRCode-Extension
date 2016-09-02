/*
 *
 * This is a simple sample.
 *  
 */

////////////////////////////////////////////////////////////////////////////////
function ShowQRCode(url){
    jQuery('#qrcode').qrcode(url);
};

function ShowTitle(title){
    jQuery('#title').html(title);
};

function OnShowQRCode(){
    // Get active tab and retrive url and title.
    browser.tabs.query({ currentWindow: true, active: true }, function(tabs){
        var url = tabs[0].url;
        var title = tabs[0].title;
        ShowQRCode(url); 
        ShowTitle(title);       
    });
};
////////////////////////////////////////////////////////////////////////////////

// Event binding.
document.addEventListener("pageshow", OnShowQRCode()); 