const _dirname = "C:/Users/Kevin/Google Drive/Coding Projects/Git/FluteBotXD/"
const {Howl, Howler} = require (_dirname + 'howler');

function Yeet()
{
    var sound = new Howl({
        src: ['adlibs\yeet.mp3']
    });
    sound.play();
}

