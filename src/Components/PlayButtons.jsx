function PlayButtons({ onPlay, onStop }) {
    return (
        <>
            <button id="play" className="btn btn-outline-success" onClick={onPlay}>Play</button>
            <button id="stop" className="btn btn-outline-danger" onClick={onStop}>Stop</button>
        </>
    );
}

export default PlayButtons;