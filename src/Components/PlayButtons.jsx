function PlayButtons({ onPlay, onStop }) {
    return (
        <>
            <button id="play" className="btn btn-outline-success btn-lg" onClick={onPlay}>Play</button>
            <button id="stop" className="btn btn-outline-danger btn-lg" onClick={onStop}>Stop</button>
        </>
    );
}

export default PlayButtons;