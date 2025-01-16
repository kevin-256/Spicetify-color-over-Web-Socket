# Color Over Websocket
<img style="display: block; margin: 0 auto" src="Images/logo.png" height="250">

A [Spicetify](https://spicetify.app/) extension that takes the color that match the current album cover and send it with a Web Socket to localhost.


## Prerequisites

- [Spicetify](https://spicetify.app/) installed on your Spotify client
- Web Socket Server on the same machine, you can use [Chataigne](https://github.com/benkuper/Chataigne) to modify the color or reroute over OSC or DMX or Midi

## Data Format

The data sent over Web Socket is a simple JSON with three values:

```javascript
{
    red: 97,
    green: 96,
    blue: 96
}
```

## Setup Instructions

1. Install the extension using the Spicetify Marketplace
2. Configure the extension:
   - Click on your profile picture in the top right corner
   - Choose "Web Socket Settings"
   - Fill in the required information:
     - **Web Socket Server port**: The listening port of your Web Socket Server (the default port on [Chataigne](https://github.com/benkuper/Chataigne) is 8080)

    ### (Optional) Chataigne Setup
    
    1. [Download](http://benjamin.kuperberg.fr/chataigne/en#download) from the official website or [compile ](https://github.com/benkuper/Chataigne) and install [Chataigne](https://github.com/benkuper/Chataigne)
    
    2. In the top left of the UI in the tab Modules add a module
        <img src="Images/Add Web Socket Module.png" width="600" >
    
    3. In the right Inspector tab set:
        1. JSON as the protocol
        2. Local Port, the same on Spicetify settings
        <img src="Images/Setting Web Socket Settings.png" width="600">
        3. If everything works after changing one song you can see some values appearing automatically on Values tab(you don't need to add the value by hand) 
    
    4. Now you can reroute this values as you like trough OSC, Midi, Artet, GrandMA3... 