import './App.css';
import { useEffect, useRef, useState } from "react";
import { StrudelMirror } from '@strudel/codemirror';
import { evalScope } from '@strudel/core';
import { drawPianoroll } from '@strudel/draw';
import { initAudioOnFirstClick } from '@strudel/webaudio';
import { transpiler } from '@strudel/transpiler';
import { getAudioContext, webaudioOutput, registerSynthSounds } from '@strudel/webaudio';
import { registerSoundfonts } from '@strudel/soundfonts';
import { stranger_tune } from './tunes';
import console_monkey_patch, { getD3Data } from './console-monkey-patch';
import DJControls from './Components/DJControls';
import PlayButtons from './Components/PlayButtons';
// import ProcButtons from './Components/ProcButtons';
import PreprocessTextbox from './Components/PreprocessTextbox';

let globalEditor = null;

const handleD3Data = (event) => {
    console.log(event.detail);
};

export default function StrudelDemo() {

    const hasRun = useRef(false);

    const handlePlay = () => {
        globalEditor.evaluate()
    }

    const handleStop = () => {
        globalEditor.stop()
    }

    const [songText, setSongText] = useState(stranger_tune)

    const [volume, setVolume] = useState(1.0);

    const [bpm, setBpm] = useState(140);
    const [bps, setBps] = useState(60);
    const [bpmDivision, setBpmDivision] = useState(4);
    const cps = bpm / bps / bpmDivision;

    const [isAccordionOpen, setIsAccordionOpen] = useState(false);

    const handleAccordion = () => {
        setIsAccordionOpen(!isAccordionOpen);
    };


useEffect(() => {

    if (!hasRun.current) {
        document.addEventListener("d3Data", handleD3Data);
        console_monkey_patch();
        hasRun.current = true;
        //Code copied from example: https://codeberg.org/uzu/strudel/src/branch/main/examples/codemirror-repl
            //init canvas
            const canvas = document.getElementById('roll');
            canvas.width = canvas.width * 2;
            canvas.height = canvas.height * 2;
            const drawContext = canvas.getContext('2d');
            const drawTime = [-2, 2]; // time window of drawn haps

            globalEditor = new StrudelMirror({
                defaultOutput: webaudioOutput,
                getTime: () => getAudioContext().currentTime,
                transpiler,
                root: document.getElementById('editor'),
                drawTime,
                onDraw: (haps, time) => drawPianoroll({ haps, time, ctx: drawContext, drawTime, fold: 0 }),
                prebake: async () => {
                    initAudioOnFirstClick(); // needed to make the browser happy (don't await this here..)
                    const loadModules = evalScope(
                        import('@strudel/core'),
                        import('@strudel/draw'),
                        import('@strudel/mini'),
                        import('@strudel/tonal'),
                        import('@strudel/webaudio'),
                    );
                    await Promise.all([loadModules, registerSynthSounds(), registerSoundfonts()]);
                },
            });
            
        document.getElementById('proc').value = stranger_tune
        //SetupButtons()
        //Proc()
    }

    let updatedCode = songText.replaceAll(
        "// all(x => x.gain(mouseX.range(0,1)))",
        `all(x => x.gain(${volume}))`
    );

    updatedCode = updatedCode.replaceAll(
        "setcps(140/60/4)",
        `setcps(${bpm}/${bps}/${bpmDivision})`
    );

    globalEditor.setCode(updatedCode);

}, [songText, volume, bpm, bps, bpmDivision]);


return (
    <main>
        <div className="container-fluid">

            <div className="row mb-4">
                <div className="col-md-6" style={{ maxHeight: '50vh', overflowY: 'auto', paddingRight: '10px' }}>
                    <h3>DJ Script</h3>
                    <PreprocessTextbox
                        defaultValue={songText}
                        onChange={(e) => setSongText(e.target.value)}
                    />
                </div>

                <div className="col-md-6" style={{ maxHeight: '50vh', overflowY: 'auto', paddingLeft: '10px' }}>
                    <h3>Strudel Editor</h3>
                    <p>Strudel REPL:</p>
                    <div id="editor" />
                    <div id="output" />
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-md-4" style={{ paddingRight: '10px' }}>
                    <h3>Controls</h3>
                    <DJControls
                        onVolumeChange={(e) => setVolume(parseFloat(e.target.value))} volume={volume}
                        onBPMChange={(e) => setBpm(e.target.value === "" ? "" : parseFloat(e.target.value))} bpm={bpm}
                        onBPSChange={(e) => setBps(e.target.value === "" ? "" : parseFloat(e.target.value))} bps={bps}
                        onBPMDivisionChange={(e) => setBpmDivision(e.target.value === "" ? "" : parseFloat(e.target.value))} bpmDivision={bpmDivision}
                        isAccordionOpen={isAccordionOpen} onAccordionChange={handleAccordion}
                    />
                </div>

                <div className="col-md-6" style={{ paddingLeft: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <PlayButtons onPlay={handlePlay} onStop={handleStop} />
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <canvas id="roll" style={{ width: '100%', height: '200px', backgroundColor: '#222' }} />
                </div>
            </div>

        </div>
    </main>

);


}
