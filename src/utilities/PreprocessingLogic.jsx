
export function Preprocess({ inputText, volume, drumsOn, cpm }) {

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


    return outputText;
}

export default Preprocess;