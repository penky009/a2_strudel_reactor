
export function Preprocess({ inputText, volume, drumsOn, cpm, drum1lpf, drum2hpf }) {

    // Change the volume tag
    let outputText = inputText;
    outputText = outputText.replace(/\/\/ all\(x => x\.gain\([^)]+\)\)/g,`all(x => x.gain(${volume})`);
    // outputText = outputText.replaceAll("{$VOLUME}", volume)

    // Change the drum tag to mute
    Object.keys(drumsOn).forEach(setName => {
        const pattern = new RegExp(`\\b_?${setName}:`, "g");
        outputText = outputText.replace(pattern, drumsOn[setName] ? `${setName}:` : `_${setName}:`);
    });

    // Change the CPM tag
    outputText = outputText.replace(/setcps\([^)]+\)/gi, `setcpm(${cpm})`);
    // outputText = outputText.replaceAll("{$CPM}", cpm)

    // Change the drum1 LPF tag
    outputText = outputText.replace(/(drums:[^]*?)\.lpf\([^)]+\)/gi, `$1.lpf(${drum1lpf})`);

    // Change the drum2 HPF tag
    outputText = outputText.replace(/(drums2:[^]*?)\.hpf\([^)]+\)/gi, `$1.hpf(${drum2hpf})`);

    return outputText;
}

export default Preprocess;