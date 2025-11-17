function DJControls({ onVolumeChange, volume, onCPMChange, cpm, onDrumAccordionChange, isDrumAccordionOpen, drumsOn, onDrumChange, onDrum2Change, drum1lpf, onDrum1LpfChange, drum2hpf, onDrum2HpfChange }) {
    return (
        <>

        {/* CPS Text Boxes */}
        <div className="input-group mb-3">
            <span className="input-group-text" id="cps_label">CPM:</span>
                <input type="number" className="form-control" placeholder="35" value={cpm} onChange={onCPMChange} min="1" />
        </div>

        {/* Volume Slider */}
        <div>
            <label htmlFor="volume_range" className="form-label">Volume: {volume * 100}%</label>
            <input className="form-range" type="range" id="volume_range" min="0" max="1" step="0.1" value={volume} onChange={onVolumeChange} />
        </div>

        {/* Drum Control Accordion */}
        <div className="mt-3 accordion" id="drumAccordion">
            <div className="accordion-item">
                <h2 className="accordion-header">
                    <button className={`accordion-button ${!isDrumAccordionOpen ? " collapsed" : ""}`} type="button" onClick={onDrumAccordionChange}>Drum Control</button>
                </h2>
                {isDrumAccordionOpen && (
                    <div className="accordion-body">
                        <div className="row">
                            <div className="col-6 border-end">
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" name="drum_box" id="drum_box"
                                        checked={drumsOn.drums} onChange={onDrumChange} />
                                    <label className="form-check-label" htmlFor="drum_box">
                                        Enable Drums
                                    </label>
                                </div>
                                <div className="mt-3">
                                    <label htmlFor="drum1_lpf_range" className="form-label">LPF: {drum1lpf}</label>
                                    <input className="form-range" type="range" id="drum1_lpf_range" min="0" max="10000" step="100" value={drum1lpf} onChange={onDrum1LpfChange} />
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" name="drum2_box" id="drum2_box"
                                        checked={drumsOn.drums2} onChange={onDrum2Change} />
                                    <label className="form-check-label" htmlFor="drum2_box">
                                        Enable Drums2
                                    </label>
                                </div>
                                <div className="mt-3">
                                    <label htmlFor="drum2_hpf_range" className="form-label">HPF: {drum2hpf}</label>
                                    <input className="form-range" type="range" id="drum2_hpf_range" min="0" max="10000" step="100" value={drum2hpf} onChange={onDrum2HpfChange} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>

    </>
    );
}

export default DJControls;