export function Preprocess ({ inputText, volume }) {
    return (
        outputText += `\n// all(x => x.gain(${volume}))`
        outputText = outputText.replaceAll("{$VOLUME}", volume)
    )
}

export default Preprocess;