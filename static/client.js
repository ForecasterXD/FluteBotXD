//Setup new AudioContext
var context = new AudioContext();

//Establish Websocket to Server

ws.addEventListener('open', function(event)
{
    ws.send('connection established');
})

ws.addEventListener('message', function(event)
{
    console.log('Server: ', event.data);
    if (event.data[0] === '!')
    {
        playSound(event.data);
    }
});
//Load state of Audio Context Button
if (context.state === 'suspended')
{
    document.getElementById('AudioContext').innerText = 'Resume';
}
if (context.state === 'running')
{
    document.getElementById('AudioContext').innerText = 'Running';
}

//Resume audio context with button
document.getElementById('AudioContext').addEventListener('click', function()
{
    if (context.state === 'suspended')
    {
        context.resume().then(() => 
        {
            console.log('Client: Playback Resumed');
            console.log(context.state);
        })
        document.getElementById('AudioContext').innerText = 'Stop';
    }
});



/*function playYeet()
        {
            var sound = new Howl({
                src: ['adlibs/yeet.mp3']
            });
            sound.play();
            console.log('playing')
            ws.send('Playing Yeet');
        }*/