function DJControls({ onVolumeChange, volume }) {
    return (
    <>
        <div className="input-group mb-3">
            <span className="input-group-text" id="cps_label">Set CPS (Counts Per Second):</span>
            <input type="text" className="form-control" placeholder="120" aria-label="cps" aria-describedby="cps_label"/>
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
    </>
    );
}

export default DJControls;