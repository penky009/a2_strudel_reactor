function PlayButtons({ onPlay, onStop }) {
    return (
        <>
            {/* Play Button */}
            <button id="play" className="btn btn-outline-success btn-lg" onClick={onPlay}>Play</button>
            {/* Stop Button */}
            <button id="stop" className="btn btn-outline-danger btn-lg" onClick={onStop}>Stop</button>
        </>
    );
}

export default PlayButtons;