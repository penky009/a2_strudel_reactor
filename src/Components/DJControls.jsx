function DJControls({ onVolumeChange, volume, onBPMChange, bpm, onBPSChange, bps, onBPMDivisionChange, bpmDivision, onAccordionChange, isAccordionOpen, drumsOn, onDrumChange, onDrum2Change }) {
    return (
        <>

        {/* CPS Text Boxes */}
        <div className="input-group mb-3">
            <span className="input-group-text" id="cps_label">Set CPS (Cycles Per Second):</span>
                <input type="text" className="form-control" placeholder="120" value={bpm} onChange={onBPMChange} />
                <input type="text" className="form-control" placeholder="60" value={bps} onChange={onBPSChange} />
                <input type="text" className="form-control" placeholder="4" value={bpmDivision} onChange={onBPMDivisionChange} />
        </div>

        {/* Volume Slider */}
        <div>
            <label htmlFor="volume_range" className="form-label">Volume: {volume * 100}%</label>
            <input className="form-range" type="range" id="volume_range" min="0" max="1" step="0.1" value={volume} onChange={onVolumeChange} />
        </div>

        {/* Drum Effects Accordion */}
        <div className="mt-3 accordion" id="effectsAccordion">
            <div className="accordion-item">
                <h2 className="accordion-header">
                    <button className={`accordion-button ${!isAccordionOpen ? " collapsed" : ""}`} type="button" onClick={onAccordionChange}>Drum Control</button>
                    </h2>
                {isAccordionOpen && (
                    <div className="accordion-body">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" name="drum_box" id="drum_box" checked={drumsOn.drums} onChange={onDrumChange} />
                            <label className="form-check-label" htmlFor="drum_box">
                                Enable Drums
                            </label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" name="drum2_box" id="drum2_box" checked={drumsOn.drums2} onChange={onDrum2Change} />
                            <label className="form-check-label" htmlFor="drum2_box">
                                Enable Drums2
                            </label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="reverb" />
                            <label className="form-check-label" htmlFor="reverb">Reverb</label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="delay" />
                            <label className="form-check-label" htmlFor="delay">Delay</label>
                        </div>
                    </div>
                )}
            </div>
        </div>

    </>
    );
}

export default DJControls;