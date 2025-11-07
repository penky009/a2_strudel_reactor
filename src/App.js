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
import { Preprocess } from './Utilities/PreprocessingLogic';

let globalEditor = null;

const handleD3Data = (event) => {
    console.log(event.detail);
};

export default function StrudelDemo() {

    const hasRun = useRef(false);

    const [songText, setSongText] = useState(stranger_tune)

    const [volume, setVolume] = useState(1.0);

    const [state, setState] = useState("stopped");

    const [drumsOn, setDrumsOn] = useState({
        drums: true,
        drums2: true
    });

    // Process the output text on play
    const handlePlay = () => {
        let outputText = Preprocess({ inputText: songText, volume: volume, drumsOn });
        globalEditor.setCode(outputText);
        globalEditor.evaluate()
    }

    // Stop the strudel
    const handleStop = () => {
        globalEditor.stop()
    }

    // Re-process the output text when volume or drums change
    useEffect(() => {
        if (state === "playing") {
            handlePlay();
        }
    }, [volume, drumsOn]);

    const [bpm, setBpm] = useState(140);
    const [bps, setBps] = useState(60);
    const [bpmDivision, setBpmDivision] = useState(4);
    const cps = bpm / bps / bpmDivision;

    const [isAccordionOpen, setIsAccordionOpen] = useState(false);

    // Drum Accordion Toggle
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
            
        document.getElementById('proc').value = songText;
        //SetupButtons()
        //Proc()    
        globalEditor.setCode(songText);
    }


}, [songText]);


return (
    <main>
        <header className="p-1 text-bg-light text-center">
            <h1>Strudel DJ Demo</h1>
            <p>Convert text to process and play with the Strudel REPL live!</p>
        </header>

        <div className="container-fluid">
            <div className="row mb-6">
                {/* Preprocess Textbox and Controls */}
                <div className="col-md-6" style={{ maxHeight: '100%', overflowY: 'auto', paddingRight: '10px', display: 'flex', flexDirection: 'column' }}>
                    <p className="mt-3">Preprocess Textbox:</p>
                    <PreprocessTextbox
                        defaultValue={songText}
                        onChange={(e) => setSongText(e.target.value)}
                        style={{ height: '50px' }}
                    />

                    {/* Play Buttons */}
                    <h4 className="m-3 text-center">Controls</h4>
                    <div className="d-flex justify-content-center gap-2 mb-3">
                        <PlayButtons
                            onPlay={() => { setState("playing"); handlePlay() }}
                            onStop={() => { setState("stopped"); handleStop() }}
                        />
                    </div>

                    {/* DJ Controls */}
                    <DJControls
                        onVolumeChange={(e) => setVolume(parseFloat(e.target.value))} volume={volume}
                        onBPMChange={(e) => setBpm(e.target.value === "" ? "" : parseFloat(e.target.value))} bpm={bpm}
                        onBPSChange={(e) => setBps(e.target.value === "" ? "" : parseFloat(e.target.value))} bps={bps}
                        onBPMDivisionChange={(e) => setBpmDivision(e.target.value === "" ? "" : parseFloat(e.target.value))} bpmDivision={bpmDivision}
                        isAccordionOpen={isAccordionOpen} onAccordionChange={handleAccordion}
                        drumsOn={drumsOn} onDrumChange={(e) => setDrumsOn({ ...drumsOn, drums: e.target.checked })} onDrum2Change={(e) => setDrumsOn({ ...drumsOn, drums2: e.target.checked })}

                    />
                </div>

                {/* Strudel REPL Box */}
                <div className="col-md-6" style={{ maxHeight: '80vh', overflowY: 'auto', paddingLeft: '10px', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
                    <p className="mt-3">Strudel REPL:</p>
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        <div id="editor" />
                        <div id="output" />
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <canvas id="roll" style={{ width: '100%', height: '200px'}} />
                </div>
            </div>

        </div>
    </main>

);


}
