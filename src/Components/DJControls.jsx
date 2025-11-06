function DJControls({ onVolumeChange, volume, onBPMChange, bpm, onBPSChange, bps, onBPMDivisionChange, bpmDivision, onAccordionChange, isAccordionOpen }) {
    return (
    <>
        <div className="input-group mb-3">
            <span className="input-group-text" id="cps_label">Set CPS (Cycles Per Second):</span>
                <input type="text" className="form-control" placeholder="120" value={bpm} onChange={onBPMChange} />
                <input type="text" className="form-control" placeholder="60" value={bps} onChange={onBPSChange} />
                <input type="text" className="form-control" placeholder="4" value={bpmDivision} onChange={onBPMDivisionChange} />
        </div>

        <div>
            <label htmlFor="volume_range" className="form-label">Volume: {volume * 100}%</label>
            <input className="form-range" type="range" id="volume_range" min="0" max="1" step="0.1" value={volume} onChange={onVolumeChange} />
        </div>

        <div className="col-md-4">
            <div className="form-check">
                <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" defaultChecked />
                <label className="form-check-label" htmlFor="flexRadioDefault1">
                    drum: ON
                </label>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
                <label className="form-check-label" htmlFor="flexRadioDefault2">
                    drum: HUSH
                </label>
            </div>
        </div>

        <div className="accordion" id="effectsAccordion">
            <div className="accordion-item">
                <h2 className="accordion-header">
                    <button className={`accordion-button ${!isAccordionOpen ? " collapsed" : ""}`} type="button" onClick={onAccordionChange}>Effects List</button>
                </h2>
                {isAccordionOpen && (
                    <div className="accordion-body">
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