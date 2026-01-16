const { ipcRenderer } = require('electron');

console.log("Renderer is klaar voor updates...");

ipcRenderer.on('update-blue', (event, avgBlue) => {

    let intensity = (avgBlue / 255) * 0.6;
    

    if (intensity < 0.05) intensity = 0.05;
    

    document.body.style.backgroundColor = `rgba(255, 140, 0, ${intensity})`;
    
    console.log("Nieuwe blauwwaarde ontvangen:", Math.round(avgBlue), "Filter:", intensity.toFixed(2));
});