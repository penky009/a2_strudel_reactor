function PlayButtons({ onPlay, onStop }) {
    return (
        <>
            {/* Play Button */}
            <button id="play" className="btn btn-outline-success btn-lg" onClick={onPlay}>&#9655;</button>
            {/* Stop Button */}
            <button id="stop" className="btn btn-outline-danger btn-lg" onClick={onStop}>&#128910;</button>
        </>
    );
}

export default PlayButtons;