
export function Preprocess({ inputText, volume, drumsOn, cpm, drum1lpf, drum2hpf, arpOn, selectedArp, d3GraphOn, bassOn, bassLpf, selectedBass }) {

    // Update the volume tag
    let outputText = inputText;
    outputText = outputText.replace(/\/\/ all\(x => x\.gain\([^)]+\)\)/g,`all(x => x.gain(${volume})`);
    // outputText = outputText.replaceAll("{$VOLUME}", volume)

    // Mute/Unmute the drum tag
    Object.keys(drumsOn).forEach(setName => {
        const pattern = new RegExp(`\\b_?${setName}:`, "g");
        outputText = outputText.replace(pattern, drumsOn[setName] ? `${setName}:` : `_${setName}:`);
    });

    // Update the CPM tag
    outputText = outputText.replace(/setcps\([^)]+\)/gi, `setcpm(${cpm})`);
    // outputText = outputText.replaceAll("{$CPM}", cpm)

    // Update the drum1 LPF tag
    outputText = outputText.replace(/(drums:[^]*?)\.lpf\([^)]+\)/gi, `$1.lpf(${drum1lpf})`);

    // Update the drum2 HPF tag
    outputText = outputText.replace(/(drums2:[^]*?)\.hpf\([^)]+\)/gi, `$1.hpf(${drum2hpf})`);

    // Mute/Unmute the arpeggiator tag
    if (arpOn) {
        outputText = outputText.replace("_main_arp:", "main_arp:");
    } else {
        outputText = outputText.replace("main_arp:", "_main_arp:");
    }

    // Change the arpeggiator melody
    if (selectedArp === "arp1") {
        outputText = outputText.replace(/(main_arp:[\s\S]*?)pick\([a-zA-Z0-9_]+,/g, `$1pick(arpeggiator1,`);
    } else {
        outputText = outputText.replace(/(main_arp:[\s\S]*?)pick\([a-zA-Z0-9_]+,/g, `$1pick(arpeggiator2,`);
    }

    // Enable d3 graphing by logging the main arpeggiator
    if (d3GraphOn) {
        outputText = outputText.replace(/(main_arp:[\s\S]*?)(\.\w+\(.*?\))/gm, '$1$2.log()');
    }

    // Mute/Unmute the bassline tag
    if (bassOn) {
        outputText = outputText.replace("_bassline:", "bassline:");
    } else {
        outputText = outputText.replace("bassline:", "_bassline:");
    }

    // Update the bassline lpf (Low Pass Filer)
    outputText = outputText.replace(/(bassline:[\s\S]*?)\.lpf\([^\)]+\)/, `$1.lpf(${bassLpf})`);

    // Change the bassline instrument sound
    if (selectedBass) {
        outputText = outputText.replace(/\.sound\("[^"]*"\)/, `.sound("${selectedBass}")`);
    } 

    return outputText;
}

export default Preprocess;