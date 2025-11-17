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
import { Preprocess } from './utilities/PreprocessingLogic';
import D3Graph from './Components/D3Graph';

let globalEditor = null;

const handleD3Data = (event) => {
    console.log(event.detail);
};

export default function StrudelDemo() {

    const hasRun = useRef(false);

    const [songText, setSongText] = useState(stranger_tune)

    const [volume, setVolume] = useState(0.5);

    const [state, setState] = useState("stopped");

    const [drumsOn, setDrumsOn] = useState({
        drums: true,
        drums2: true
    });

    const [cpm, setCpm] = useState(35);

    const [drum1lpf, setDrum1lpf] = useState(7000);

    const [drum2hpf, setDrum2hpf] = useState(1000);

    const [arpOn, setArpOn] = useState(true);

    const [selectedArp, setSelectedArp] = useState("arp1");

    const [d3GraphOn, setD3GraphOn] = useState(false);


    // Process the output text on play
    const handlePlay = () => {
        let outputText = Preprocess({ inputText: songText, volume: volume, drumsOn, cpm, drum1lpf, drum2hpf, arpOn, selectedArp, d3GraphOn });
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
    }, [volume, drumsOn, cpm, drum1lpf, drum2hpf, arpOn, selectedArp, d3GraphOn]);

    // Drum Accordion Toggle
    const [isDrumAccordionOpen, setIsDrumAccordionOpen] = useState(false);

    const handleDrumAccordion = () => {
        setIsDrumAccordionOpen(!isDrumAccordionOpen);
    };


    // Arppegiator Accordion Toggle
    const [isArpAccordionOpen, setIsArpAccordionOpen] = useState(false);

    const handleArpAccordion = () => {
        setIsArpAccordionOpen(!isArpAccordionOpen);
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
                <div style={{ width: '50%', paddingRight: '10px', display: 'flex', flexDirection: 'column', height: '100%' }}>
                    {/* Preprocess Textbox */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <p className="mt-3" style={{ flexShrink: 0, marginBottom: '5px' }}>Preprocess Textbox:</p>
                        <div style={{ flex: 1, overflowY: 'auto' }}>
                            <PreprocessTextbox
                                defaultValue={songText}
                                onChange={(e) => setSongText(e.target.value)}
                                style={{ height: '50px' }}
                            />
                        </div>
                    </div>
                    {/* Strudel REPL */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <p className="mt-3" style={{ flexShrink: 0, marginBottom: '5px' }}>Strudel REPL:</p>
                        <div style={{ height: '50vh', overflowY: 'auto' }}>
                            <div id="editor" />
                            <div id="output" />
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="col-md-6" style={{ height: '100%', overflowY: 'auto', paddingLeft: '10px', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
                    <h4 className="m-3 text-center">Controls</h4>
                    {/* Play Buttons */}
                    <div className="d-flex justify-content-center gap-2 mb-3">
                        <PlayButtons
                            onPlay={() => { setState("playing"); handlePlay() }}
                            onStop={() => { setState("stopped"); handleStop() }}
                        />
                    </div>

                    {/* DJ Controls */}
                    <DJControls
                        onVolumeChange={(e) => setVolume(parseFloat(e.target.value))} volume={volume}
                        onCPMChange={(e) => setCpm(e.target.value === "" ? "" : parseFloat(e.target.value))} cpm={cpm}
                        isDrumAccordionOpen={isDrumAccordionOpen} onDrumAccordionChange={handleDrumAccordion}
                        drumsOn={drumsOn} onDrumChange={(e) => setDrumsOn({ ...drumsOn, drums: e.target.checked })} onDrum2Change={(e) => setDrumsOn({ ...drumsOn, drums2: e.target.checked })}
                        drum1lpf={drum1lpf} onDrum1LpfChange={(e) => setDrum1lpf(parseFloat(e.target.value))}
                        drum2hpf={drum2hpf} onDrum2HpfChange={(e) => setDrum2hpf(parseFloat(e.target.value))}
                        isArpAccordionOpen={isArpAccordionOpen} onArpAccordionChange={handleArpAccordion}
                        arpOn={arpOn} onArpChange={(e) => setArpOn(e.target.checked)}
                        selectedArp={selectedArp} onSelectedArpChange={(e) => setSelectedArp(e.target.value)}
                        d3Graph={d3GraphOn} onD3GraphChange={(e) => setD3GraphOn(e.target.checked)}
                    />
                </div>
            </div>

            <D3Graph />

            {/* Piano Roll Canvas */}
            <div className="row mt-2">
                <div className="col-12">
                    <canvas id="roll" style={{ width: '100%', height: '200px', backgroundColor: '#222' }} />
                </div>
            </div>

        </div>
    </main>

);


}
