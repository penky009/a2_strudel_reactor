export function Preprocess({ inputText, volume, drumsOn }) {

    let outputText = inputText;
    outputText = outputText.replace(/\/\/ all\(x => x\.gain\([^)]+\)\)/g,`all(x => x.gain(${volume})`);
    // outputText = outputText.replaceAll("{$VOLUME}", volume)

    Object.keys(drumsOn).forEach(setName => {
        const pattern = new RegExp(`\\b_?${setName}:`, "g");
        outputText = outputText.replace(pattern, drumsOn[setName] ? `${setName}:` : `_${setName}:`);
    });

    return outputText;
}

export default Preprocess;