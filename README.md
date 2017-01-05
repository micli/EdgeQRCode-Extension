# EdgeQRCode-Extension #

This is a sample of Microsoft Edge Extension to convert current URL to QRCode for sharing. In China, there is a very popular instant message application WeChat. 
People uses Wechat everyday a lot of hours. Definatly, WeChat is a important tool for sharing message. 
With WebChat's driven, a lots of people like use "Scan it" to swipe QRCode to discover web pages, mobile applications etc,. 
EdgeQRCode extension can help users convert current tab URL to QRCode. It is very easy of use for sharing information to mobile device.

Since Windows 10 Anniversary Update has been released, Microsoft Edge has officially support extension feature. 
In this sample, I want to share you my experience about creating custom extension for Edge.

## Tools: Visual Studio Code ##
It can be download at: [https://code.visualstudio.com](https://code.visualstudio.com/). It supports OS X, Linux and Windows. So it means that you can create a custom extension for Edge even you are using Linux.
Now, let getting start……

## Implementation Edge extension ##

Step 1. Create a folder on you disk eg. EdgeQRCode, and then open it by Visual Studio Code File->Open Folder……
Step 2. Create a configuration file manifest.json in EdgeQRCode folder.
You can get a sample file from [Edge Manifest Sample](https://developer.microsoft.com/en-us/microsoft-edge/platform/documentation/extensions/api-support/supported-manifest-keys/json-manifest-example/).  
Yes, it very looks like Mozilla Web extension’s configuration file. Actually Edge does not support full JSON schema as Mozilla. The key properties please check [Manifest Keys](https://developer.microsoft.com/en-us/microsoft-edge/platform/documentation/extensions/api-support/supported-manifest-keys/).  In this case, I removed some keys from sample file like this:
```JSON
{
    "name" : "Edge QRCode",
    "version" : "1.0.0.0",
    "author" : "Fine Code Corporation",
    "browser_action" : 
    {
        "default_icon" : 
        {
            "20" : "icons/icon_20.png",
            "40" : "icons/icon_40.png"
        },
        "default_title" : "Edge QRCode",
        "default_popup" : "index.html"
    },
    "content_scripts" : [{
            "js" : ["js/index.js"],
            "matches" : ["*://*/*"]
        }
    ],
    "content_security_policy" : "script-src 'self'; object-src 'self'",
    "default_locale" : "en",
    "description" : "This is a simple extension that translate current url to QRCode for scan.",

    "permissions" : 
    [
        "*://*/*", "notifications",  "activeTab", "tabs", "contextMenus", "background", "webNavigation"
    ],
    "icons" : {
        "128" : "icons/icon_128.png",
        "16" : "icons/icon_16.png",
        "48" : "icons/icon_48.png"
    },
    "minimum_edge_version" : "38.14393.0.0",
    "web_accessible_resources" : ["icons/icon_48.png"]
} 
```

Since this extension doesn’t need running at background I removed background key from sample file. 
All paths in configuration file are relative path. The root is EdgeQRCode folder.

Step 3. Create a js folder to implement functional of Edge extension.  The jquery.min.js and jquery.qrcode.min.js are downloaded from their official sites. Only index.js is custom code.

```JavaScript
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

```

For security reason, extension doesn’t allow javascript embedded in html file. So we have to set event binding by addEventLinstener(). 
We can suppose there is a <div> element which id is ‘qrcode’ used for display QR code. And other div element with ‘title’ id used for display page title.

Step 4. Create a index.html file for popup UI that already defined in manifest.json file. It has to claim two <div> elements title and qrcode in HTML body.

```HTML

<!DOCTYPE html>

<html>

    <head>

        <link href="style.css" rel="stylesheet" />

    </head>

    <body>

        <div id="title" class="title">

        </div>           

        <div id="qrcode" class="qrcode">

        </div>   

        <script type="text/javascript" src="js/jquery.min.js"></script>

        <script type="text/javascript" src="js/jquery.qrcode.min.js"></script>

        <script type="text/javascript" src="js/index.js"></script>    

    </body>

</html>
```

## Debugging Edge extension ##

Before debugging extension, you have to enable sideloading feature on your Edge. To achieve this please follow section two of below link
[Edge Extension troubleshooting](https://developer.microsoft.com/en-us/microsoft-edge/platform/documentation/extensions/troubleshooting/)
And then open Edge menu->Extensions->Load Extension, locate EdgeQRCode folder to load. 
After loading finished, you have to set “Edge QRCode” on and “Show button next to the address bar” on.

Debugging popup UI is a little bit specific. You can use ms-browser-extension://[Extension_Id]/index.html to let Edge load your popup UI. 
The extension id is shown in extension properties UI. In this case the URL should be: ms-browser-extension://EdgeQRCode_08b2vmtxn4krp/index.html
When html and javascript has been loaded. You can enable Edge debugging tool by press F12.

## Appendix ##

+ For more information about web extension, please visit: https://developer.mozilla.org/en-US/Add-ons/WebExtensions 
+ Edge team wants to compatible Mozilla standard, but there is a gap by now.
+ If you want to convert an existing Chrome/Firefox extension to Edge, please check: [Convert Chrome externsion to Edge](http://bav0.com/converting-any-chrome-extension-to-edge-in-theory/)
