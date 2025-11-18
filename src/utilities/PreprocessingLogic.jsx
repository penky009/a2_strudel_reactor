
export function Preprocess({ inputText, volume, drumsOn, cpm, drum1lpf, drum2hpf, arpOn, selectedArp, d3GraphOn, bassOn, bassLpf, selectedBass }) {

    let outputText = inputText;

    // Update the gain tag for all instruments
    outputText = outputText.replace(/\.gain\(([^)]+)\)/g, `.gain($1 * ${volume})`);

    // Mute/Unmute the drum tag
    Object.keys(drumsOn).forEach(setName => {
        const pattern = new RegExp(`\\b_?${setName}:`, "g");
        outputText = outputText.replace(pattern, drumsOn[setName] ? `${setName}:` : `_${setName}:`);
    });

    // Update the CPM tag
    outputText = outputText.replace("setcpm({CPM})", `setcpm(${cpm})`);
    // outputText = outputText.replaceAll("{$CPM}", cpm)

    // Update the drum1 LPF tag
    outputText = outputText.replace(".lpf({DRUM1LPF})", `.lpf(${drum1lpf})`);

    // Update the drum2 HPF tag
    outputText = outputText.replace(".hpf({DRUM2HPF})", `.hpf(${drum2hpf})`);

    // Mute/Unmute the arpeggiator tag
    if (arpOn) {
        outputText = outputText.replace("_main_arp:", "main_arp:");
    } else {
        outputText = outputText.replace("main_arp:", "_main_arp:");
    }

    // Change the arpeggiator melody
    if (selectedArp === "arp2") {
        outputText = outputText.replace(`note(pick(arpeggiator1, "<0 1 2 3>/2"))`, `note(pick(arpeggiator2, "<0 1 2 3>/2"))`);
    }

    // Enable d3 graphing by logging the main arpeggiator
    if (d3GraphOn) {
        outputText = outputText.replace("//.log()", ".log()");
    }

    // Mute/Unmute the bassline tag
    if (bassOn) {
        outputText = outputText.replace("_bassline:", "bassline:");
    } else {
        outputText = outputText.replace("bassline:", "_bassline:");
    }

    // Update the bassline lpf (Low Pass Filer)
    outputText = outputText.replace(".lpf({BASSLINELPF})", `.lpf(${bassLpf})`);

    // Change the bassline instrument sound
    if (selectedBass) {
        outputText = outputText.replace(`.sound("{BASSLINESOUND}")`, `.sound("${selectedBass}")`);
    } 

    return outputText;
}

export default Preprocess;